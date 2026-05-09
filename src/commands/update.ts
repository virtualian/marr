/**
 * Update command — refresh canonical MARR standards into a consumer project.
 *
 * Usage:
 *   marr update --project [path]    Refresh standards from canonical
 *   marr update --project --check   Drift report only (non-zero exit if drift)
 *   marr update --project --prune   Also remove orphaned standards
 *   marr update --project --dry-run Preview changes without writing
 *   marr update --project --force   Skip per-file confirms
 *
 * The 5-bucket model (see `compareManifest`):
 *   - unchanged: skip
 *   - modified:  refresh silently (canonical advanced; user untouched)
 *   - drifted:   prompt (user edited)
 *   - added:     prompt to install (canonical has it; subscription doesn't)
 *   - orphan:    prune candidate (subscribed, but canonical removed it)
 */

import { Command } from 'commander';
import { join, resolve } from 'path';
import { unlinkSync } from 'fs';
import * as readline from 'readline';
import * as logger from '../utils/logger.js';
import * as fileOps from '../utils/file-ops.js';
import * as marrSetup from '../utils/marr-setup.js';
import { createBackup } from '../utils/backup.js';
import { generateDiff } from '../utils/diff.js';
import { regenerateTriggerTable } from '../utils/trigger-regenerator.js';
import {
  buildManifest,
  compareManifest,
  isStandardFilename,
  readManifest,
  writeManifest,
  MANIFEST_FILENAME,
  type Manifest,
  type ManifestDiff,
} from '../utils/marr-manifest.js';

const STANDARDS_SUBPATH = join('.claude', 'marr', 'standards');
const MARR_SUBPATH = join('.claude', 'marr');

interface UpdateOptions {
  project?: string | boolean;
  check?: boolean;
  prune?: boolean;
  dryRun?: boolean;
  force?: boolean;
}

interface UpdatePlan {
  refreshSilent: string[]; // modified bucket
  refreshConfirmed: string[]; // drifted bucket — user said yes
  installConfirmed: string[]; // added bucket — user said yes
  pruneConfirmed: string[]; // orphan bucket — user said yes (and --prune)
  skipped: string[];
}

function createReadlineInterface(): readline.Interface {
  return readline.createInterface({ input: process.stdin, output: process.stdout });
}

function ask(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve_) => {
    rl.question(question, (answer) => resolve_(answer.trim()));
  });
}

function resolveProjectPath(option: string | boolean | undefined): string {
  if (typeof option === 'string') return resolve(option);
  return process.cwd();
}

function isProjectInitialised(projectPath: string): boolean {
  return fileOps.exists(join(projectPath, MARR_SUBPATH));
}

function printDriftReport(diff: ManifestDiff, isBootstrap: boolean): void {
  logger.section(isBootstrap ? 'Drift Report (Bootstrap — no manifest)' : 'Drift Report');
  logger.blank();
  const total = diff.unchanged.length + diff.modified.length + diff.drifted.length + diff.added.length + diff.orphan.length;
  logger.log(`  unchanged: ${diff.unchanged.length}`);
  logger.log(`  modified:  ${diff.modified.length}    (canonical advanced; safe to refresh)`);
  logger.log(`  drifted:   ${diff.drifted.length}    (locally edited)`);
  logger.log(`  added:     ${diff.added.length}    (available in canonical, not subscribed)`);
  logger.log(`  orphan:    ${diff.orphan.length}    (subscribed, no longer in canonical)`);
  logger.blank();

  for (const f of diff.modified) logger.log(`    [modified] ${f}`);
  for (const f of diff.drifted) logger.log(`    [drifted]  ${f}`);
  for (const f of diff.added) logger.log(`    [added]    ${f}`);
  for (const f of diff.orphan) logger.log(`    [orphan]   ${f}`);

  if (total === 0) {
    logger.info('No standards detected.');
  }
  logger.blank();
}

function hasDrift(diff: ManifestDiff): boolean {
  return (
    diff.modified.length > 0 ||
    diff.drifted.length > 0 ||
    diff.added.length > 0 ||
    diff.orphan.length > 0
  );
}

async function planActions(
  diff: ManifestDiff,
  canonicalDir: string,
  localDir: string,
  options: UpdateOptions,
  rl: readline.Interface,
): Promise<UpdatePlan> {
  const plan: UpdatePlan = {
    refreshSilent: [...diff.modified],
    refreshConfirmed: [],
    installConfirmed: [],
    pruneConfirmed: [],
    skipped: [],
  };

  // Drifted: prompt refresh/skip/show-diff (force => refresh-all)
  for (const file of diff.drifted) {
    if (options.force) {
      plan.refreshConfirmed.push(file);
      continue;
    }
    const decision = await promptDriftedFile(rl, file, canonicalDir, localDir);
    if (decision === 'refresh') plan.refreshConfirmed.push(file);
    else plan.skipped.push(file);
  }

  // Added: prompt install (default Y; force => install-all)
  for (const file of diff.added) {
    if (options.force) {
      plan.installConfirmed.push(file);
      continue;
    }
    const answer = await ask(rl, `Install new standard "${file}"? [Y/n] `);
    if (answer === '' || answer.toLowerCase().startsWith('y')) {
      plan.installConfirmed.push(file);
    } else {
      plan.skipped.push(file);
    }
  }

  // Orphan: only with --prune. Per-file confirm unless --force.
  if (options.prune) {
    for (const file of diff.orphan) {
      if (options.force) {
        plan.pruneConfirmed.push(file);
        continue;
      }
      const answer = await ask(rl, `Prune orphaned standard "${file}"? [y/N] `);
      if (answer.toLowerCase().startsWith('y')) {
        plan.pruneConfirmed.push(file);
      } else {
        plan.skipped.push(file);
      }
    }
  }

  return plan;
}

async function promptDriftedFile(
  rl: readline.Interface,
  file: string,
  canonicalDir: string,
  localDir: string,
): Promise<'refresh' | 'skip'> {
  while (true) {
    const answer = await ask(rl, `Locally-edited "${file}" — [r]efresh / [s]kip / [d]iff? `);
    const a = answer.toLowerCase();
    if (a.startsWith('r')) return 'refresh';
    if (a === '' || a.startsWith('s')) return 'skip';
    if (a.startsWith('d')) {
      const oldContent = fileOps.readFile(join(localDir, file));
      const newContent = fileOps.readFile(join(canonicalDir, file));
      logger.blank();
      logger.log(generateDiff(oldContent, newContent, file));
      logger.blank();
      continue;
    }
  }
}

function applyPlan(
  plan: UpdatePlan,
  canonicalDir: string,
  localDir: string,
  dryRun: boolean,
): { applied: number; backups: number } {
  let applied = 0;
  let backups = 0;

  fileOps.ensureDir(localDir);

  const refresh = (file: string, label: string): void => {
    const target = join(localDir, file);
    if (dryRun) {
      logger.info(`  [dry-run] ${label}: ${file}`);
      applied++;
      return;
    }
    if (fileOps.exists(target)) {
      const backup = createBackup(target);
      if (backup) backups++;
    }
    fileOps.copyFile(join(canonicalDir, file), target);
    logger.success(`  ${label}: ${file}`);
    applied++;
  };

  for (const f of plan.refreshSilent) refresh(f, 'refreshed');
  for (const f of plan.refreshConfirmed) refresh(f, 'refreshed');
  for (const f of plan.installConfirmed) refresh(f, 'installed');

  for (const f of plan.pruneConfirmed) {
    const target = join(localDir, f);
    if (dryRun) {
      logger.info(`  [dry-run] pruned: ${f}`);
      applied++;
      continue;
    }
    if (fileOps.exists(target)) {
      const backup = createBackup(target);
      if (backup) backups++;
      unlinkSync(target);
    }
    logger.success(`  pruned: ${f}`);
    applied++;
  }

  return { applied, backups };
}

function buildPostUpdateManifest(
  priorManifest: Manifest | null,
  plan: UpdatePlan,
  localStandardsDir: string,
  marrVersion: string,
): Manifest {
  // Subscribed = prior subscription (or bootstrap-detected local files)
  //              + newly installed - pruned.
  const subscribed = new Set<string>();

  if (priorManifest) {
    for (const name of Object.keys(priorManifest.files)) subscribed.add(name);
  } else if (fileOps.exists(localStandardsDir)) {
    for (const path of fileOps.listFiles(localStandardsDir, false)) {
      const name = path.split('/').pop() ?? '';
      if (isStandardFilename(name)) subscribed.add(name);
    }
  }
  for (const name of plan.installConfirmed) subscribed.add(name);
  for (const name of plan.pruneConfirmed) subscribed.delete(name);

  return buildManifest(localStandardsDir, marrVersion, (name) => subscribed.has(name));
}

async function executeUpdate(options: UpdateOptions): Promise<void> {
  // Exit codes: 0 = no drift / clean run; 1 = drift detected (--check); 2 = usage / error.
  if (options.project === undefined || options.project === false) {
    logger.error('--project flag is required (with optional path).');
    logger.info('Example: marr update --project');
    process.exit(2);
  }

  const projectPath = resolveProjectPath(options.project);

  if (!isProjectInitialised(projectPath)) {
    logger.error(`Not a MARR project: ${projectPath}`);
    logger.info('Run: marr init --project');
    process.exit(2);
  }

  const localMarrDir = join(projectPath, MARR_SUBPATH);
  const localStandardsDir = join(projectPath, STANDARDS_SUBPATH);
  const canonicalStandardsDir = join(marrSetup.getResourcesDir(), 'project', 'common');

  if (!fileOps.exists(canonicalStandardsDir)) {
    logger.error(`Canonical standards not found at: ${canonicalStandardsDir}`);
    process.exit(2);
  }

  const priorManifest = readManifest(localMarrDir);
  const isBootstrap = priorManifest === null;
  const diff = compareManifest(priorManifest, localStandardsDir, canonicalStandardsDir);

  // --check: report and exit; never write.
  if (options.check) {
    printDriftReport(diff, isBootstrap);
    process.exit(hasDrift(diff) ? 1 : 0);
  }

  printDriftReport(diff, isBootstrap);

  if (!hasDrift(diff)) {
    if (!priorManifest) {
      // Bootstrap with everything already aligned: just create the manifest.
      if (!options.dryRun) {
        const manifest = buildManifest(localStandardsDir, marrSetup.getMarrVersion());
        writeManifest(localMarrDir, manifest);
        logger.success(`Wrote manifest: ${MANIFEST_FILENAME}`);
      } else {
        logger.info(`[dry-run] Would write manifest: ${MANIFEST_FILENAME}`);
      }
    } else {
      logger.info('Already up to date.');
    }
    return;
  }

  const rl = createReadlineInterface();
  let plan: UpdatePlan;
  try {
    plan = await planActions(diff, canonicalStandardsDir, localStandardsDir, options, rl);
  } finally {
    rl.close();
  }

  logger.blank();
  logger.section(options.dryRun ? 'Dry Run — Would Apply' : 'Applying Updates');
  logger.blank();

  const { applied, backups } = applyPlan(plan, canonicalStandardsDir, localStandardsDir, options.dryRun ?? false);

  if (!options.dryRun && applied > 0) {
    const manifest = buildPostUpdateManifest(priorManifest, plan, localStandardsDir, marrSetup.getMarrVersion());
    writeManifest(localMarrDir, manifest);
    logger.success(`Wrote manifest: ${MANIFEST_FILENAME}`);

    const tt = regenerateTriggerTable(projectPath);
    if (tt.success) {
      logger.success(`Regenerated trigger table (${tt.standardsCount} standards)`);
    } else if (tt.error) {
      logger.warning(`Could not regenerate trigger table: ${tt.error}`);
    }
  }

  logger.blank();
  if (options.dryRun) {
    logger.info(`Dry run complete: ${applied} change(s) would be applied.`);
  } else {
    logger.success(`Update complete: ${applied} change(s), ${backups} backup(s) created.`);
  }
}

export function updateCommand(program: Command): void {
  program
    .command('update')
    .description('Refresh canonical MARR standards into a consumer project')
    .option('-p, --project [path]', 'Update project at [path] (defaults to current directory)')
    .option('--check', 'Drift report only; non-zero exit if drift detected; no writes')
    .option('--prune', 'Also remove orphaned standards (subscribed, no longer in canonical)')
    .option('-n, --dry-run', 'Preview changes without writing')
    .option('-f, --force', 'Skip per-file confirms (refresh drifted, install added, prune orphans)')
    .addHelpText(
      'after',
      `
Drift buckets:
  modified  Canonical advanced; you have not edited locally — refreshed silently.
  drifted   You have edited locally — prompted (refresh/skip/show-diff).
  added     Available in canonical, not subscribed — prompted (default install).
  orphan    Subscribed, but canonical removed it — pruned only with --prune.

Examples:
  $ marr update --project              Refresh current project
  $ marr update --project --check      Report drift; exit non-zero if behind canonical
  $ marr update --project --prune      Also remove orphaned standards
  $ marr update --project --dry-run    Preview without writing
  $ marr update --project --force      Skip prompts (CI-friendly)

First run on a project with no manifest enters bootstrap mode: existing
local files become the subscription set; new canonical standards are
offered for installation.`,
    )
    .action(async (options: UpdateOptions) => {
      try {
        await executeUpdate(options);
      } catch (err) {
        logger.error((err as Error).message);
        process.exit(2);
      }
    });
}
