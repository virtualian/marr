/**
 * Sync command - Propagate standards between MARR-configured projects
 *
 * Usage:
 *   marr sync                    Interactive mode - prompts for source/targets
 *   marr sync --from <path>      Specify source project
 *   marr sync --to <path>        Specify target project (can repeat)
 *   marr sync --only <file>      Sync specific standard(s) only
 *   marr sync --dry-run          Preview changes without applying
 *   marr sync --force            Skip confirmation prompts
 *   marr sync --register         Add current project to registry
 *   marr sync --unregister       Remove current project from registry
 *   marr sync --list             Show registered projects
 */

import { Command } from 'commander';
import { join, basename } from 'path';
import * as readline from 'readline';
import * as logger from '../utils/logger.js';
import * as fileOps from '../utils/file-ops.js';
import {
  registerProject,
  unregisterProject,
  listProjects,
  listValidProjects,
  isMarrProject,
  cleanRegistry,
} from '../utils/project-registry.js';
import { regenerateTriggerTable } from '../utils/trigger-regenerator.js';

interface SyncOptions {
  from?: string;
  to?: string[];
  only?: string;
  dryRun?: boolean;
  force?: boolean;
  register?: boolean;
  unregister?: boolean;
  list?: boolean;
}

const STANDARDS_DIR = join('.claude', 'marr', 'standards');

/**
 * Create readline interface for interactive prompts
 */
function createReadline(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Prompt user for input
 */
function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Select from a numbered list interactively
 */
async function selectFromList(
  rl: readline.Interface,
  items: string[],
  promptText: string,
  allowMultiple = false
): Promise<string[]> {
  logger.blank();
  logger.info(promptText);
  logger.blank();

  items.forEach((item, index) => {
    logger.log(`  ${index + 1}) ${item}`);
  });

  logger.blank();

  if (allowMultiple) {
    const answer = await prompt(rl, 'Enter numbers (comma-separated) or "all": ');

    if (answer.toLowerCase() === 'all') {
      return items;
    }

    const indices = answer
      .split(',')
      .map((s) => parseInt(s.trim(), 10) - 1)
      .filter((i) => i >= 0 && i < items.length);

    return indices.map((i) => items[i]);
  } else {
    const answer = await prompt(rl, 'Enter number: ');
    const index = parseInt(answer, 10) - 1;

    if (index >= 0 && index < items.length) {
      return [items[index]];
    }

    return [];
  }
}

/**
 * Get list of standard files in a project
 */
function getStandardFiles(projectPath: string): string[] {
  const standardsPath = join(projectPath, STANDARDS_DIR);

  if (!fileOps.exists(standardsPath)) {
    return [];
  }

  const files = fileOps.listFiles(standardsPath, false);
  return files
    .filter((f) => f.endsWith('.md') && basename(f) !== 'README.md')
    .map((f) => basename(f));
}

/**
 * Compare two files and return whether they differ
 */
function filesAreDifferent(path1: string, path2: string): boolean {
  if (!fileOps.exists(path1) || !fileOps.exists(path2)) {
    return true;
  }

  try {
    const content1 = fileOps.readFile(path1);
    const content2 = fileOps.readFile(path2);
    return content1 !== content2;
  } catch {
    return true;
  }
}

/**
 * Generate a simple unified diff between two strings
 */
function generateDiff(oldContent: string, newContent: string, filename: string): string {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');

  const lines: string[] = [];
  lines.push(`--- a/${filename}`);
  lines.push(`+++ b/${filename}`);

  // Simple line-by-line diff (not a true unified diff algorithm, but sufficient)
  const maxLines = Math.max(oldLines.length, newLines.length);
  let inHunk = false;
  let hunkStart = -1;

  for (let i = 0; i < maxLines; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];

    if (oldLine !== newLine) {
      if (!inHunk) {
        hunkStart = i;
        inHunk = true;
        lines.push(`@@ -${i + 1} +${i + 1} @@`);
      }

      if (oldLine !== undefined) {
        lines.push(`-${oldLine}`);
      }
      if (newLine !== undefined) {
        lines.push(`+${newLine}`);
      }
    } else if (inHunk) {
      // Context line after changes
      lines.push(` ${oldLine || ''}`);
      if (i - hunkStart > 3) {
        inHunk = false;
      }
    }
  }

  return lines.join('\n');
}

/**
 * Sync standards from source to target project
 */
async function syncProjects(
  sourcePath: string,
  targetPath: string,
  options: { only?: string; dryRun?: boolean; force?: boolean },
  rl: readline.Interface
): Promise<{ synced: number; skipped: number }> {
  const sourceStandardsDir = join(sourcePath, STANDARDS_DIR);
  const targetStandardsDir = join(targetPath, STANDARDS_DIR);

  if (!fileOps.exists(sourceStandardsDir)) {
    logger.warning(`No standards directory in source: ${sourcePath}`);
    return { synced: 0, skipped: 0 };
  }

  // Get source standards
  let sourceFiles = getStandardFiles(sourcePath);

  // Filter by --only if specified
  if (options.only) {
    const onlyFiles = options.only.split(',').map((f) => f.trim());
    sourceFiles = sourceFiles.filter((f) => onlyFiles.includes(f));
  }

  if (sourceFiles.length === 0) {
    logger.info('No standards to sync');
    return { synced: 0, skipped: 0 };
  }

  let synced = 0;
  let skipped = 0;

  for (const file of sourceFiles) {
    const sourcePath_ = join(sourceStandardsDir, file);
    const targetPath_ = join(targetStandardsDir, file);

    const sourceExists = fileOps.exists(sourcePath_);
    const targetExists = fileOps.exists(targetPath_);

    if (!sourceExists) {
      continue;
    }

    const isDifferent = !targetExists || filesAreDifferent(sourcePath_, targetPath_);

    if (!isDifferent) {
      continue; // Already in sync
    }

    const sourceContent = fileOps.readFile(sourcePath_);
    const targetContent = targetExists ? fileOps.readFile(targetPath_) : '';

    // Show diff
    logger.blank();
    if (targetExists) {
      logger.info(`Changes for ${file}:`);
      const diff = generateDiff(targetContent, sourceContent, file);
      logger.log(diff);
    } else {
      logger.info(`New file: ${file}`);
    }

    // Prompt for confirmation unless --force or --dry-run
    let shouldSync = options.force || false;

    if (!options.dryRun && !options.force) {
      const answer = await prompt(rl, `\nApply changes to ${file}? [y/N] `);
      shouldSync = answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
    }

    if (options.dryRun) {
      logger.info(`[dry-run] Would sync: ${file}`);
      synced++;
    } else if (shouldSync) {
      fileOps.ensureDir(targetStandardsDir);
      fileOps.copyFile(sourcePath_, targetPath_);
      logger.success(`Synced: ${file}`);
      synced++;
    } else {
      logger.info(`Skipped: ${file}`);
      skipped++;
    }
  }

  // Regenerate trigger table if any files were synced
  if (synced > 0 && !options.dryRun) {
    const result = regenerateTriggerTable(targetPath);
    if (result.success) {
      logger.success(`Regenerated trigger table (${result.standardsCount} standards)`);
    } else if (result.error) {
      logger.warning(`Could not regenerate trigger table: ${result.error}`);
    }
  }

  return { synced, skipped };
}

/**
 * Handle --register flag
 */
function handleRegister(): void {
  const cwd = process.cwd();

  if (!isMarrProject(cwd)) {
    logger.error('Current directory is not a MARR-configured project');
    logger.info('Run: marr init --project');
    process.exit(1);
  }

  const added = registerProject(cwd);

  if (added) {
    logger.success(`Registered: ${cwd}`);
  } else {
    logger.info(`Already registered: ${cwd}`);
  }
}

/**
 * Handle --unregister flag
 */
function handleUnregister(): void {
  const cwd = process.cwd();
  const removed = unregisterProject(cwd);

  if (removed) {
    logger.success(`Unregistered: ${cwd}`);
  } else {
    logger.info(`Not registered: ${cwd}`);
  }
}

/**
 * Handle --list flag
 */
function handleList(): void {
  const projects = listProjects();

  logger.section('Registered Projects');
  logger.blank();

  if (projects.length === 0) {
    logger.info('No projects registered');
    logger.blank();
    logger.info('Register projects with: marr sync --register');
    logger.info('Or run: marr init --project (auto-registers)');
  } else {
    // Clean up invalid projects first
    const removed = cleanRegistry();
    if (removed.length > 0) {
      logger.warning(`Removed ${removed.length} invalid project(s) from registry`);
      logger.blank();
    }

    const validProjects = listValidProjects();

    for (const project of projects) {
      const isValid = validProjects.includes(project);
      if (isValid) {
        logger.log(`  ${project}`);
      } else {
        logger.log(`  ${project} (not found)`);
      }
    }

    logger.blank();
    logger.info(`${validProjects.length} project(s) registered`);
  }

  logger.blank();
}

/**
 * Main sync execution
 */
async function executeSync(options: SyncOptions): Promise<void> {
  // Handle registry management flags
  if (options.register) {
    handleRegister();
    return;
  }

  if (options.unregister) {
    handleUnregister();
    return;
  }

  if (options.list) {
    handleList();
    return;
  }

  // Get valid projects for sync
  const validProjects = listValidProjects();

  if (validProjects.length === 0) {
    logger.error('No MARR projects registered');
    logger.blank();
    logger.info('Register projects first:');
    logger.log('  cd /path/to/project && marr sync --register');
    logger.log('  Or: marr init --project (auto-registers)');
    process.exit(1);
  }

  const rl = createReadline();

  try {
    // Determine source
    let sourcePath: string;

    if (options.from) {
      sourcePath = options.from.startsWith('/') ? options.from : join(process.cwd(), options.from);

      if (!isMarrProject(sourcePath)) {
        logger.error(`Not a MARR project: ${sourcePath}`);
        process.exit(1);
      }
    } else {
      // Interactive source selection
      const selected = await selectFromList(
        rl,
        validProjects,
        'Select SOURCE project (sync FROM):',
        false
      );

      if (selected.length === 0) {
        logger.info('No source selected. Cancelled.');
        rl.close();
        return;
      }

      sourcePath = selected[0];
    }

    // Determine targets
    let targetPaths: string[];

    if (options.to && options.to.length > 0) {
      targetPaths = options.to.map((p) => (p.startsWith('/') ? p : join(process.cwd(), p)));

      // Validate targets
      for (const target of targetPaths) {
        if (!isMarrProject(target)) {
          logger.error(`Not a MARR project: ${target}`);
          process.exit(1);
        }
      }
    } else {
      // Interactive target selection (exclude source)
      const availableTargets = validProjects.filter((p) => p !== sourcePath);

      if (availableTargets.length === 0) {
        logger.error('No other projects to sync to');
        logger.info('Register more projects with: marr sync --register');
        rl.close();
        process.exit(1);
      }

      targetPaths = await selectFromList(
        rl,
        availableTargets,
        'Select TARGET project(s) (sync TO):',
        true
      );

      if (targetPaths.length === 0) {
        logger.info('No targets selected. Cancelled.');
        rl.close();
        return;
      }
    }

    // Perform sync
    logger.section(options.dryRun ? 'Sync Preview (Dry Run)' : 'Syncing Standards');
    logger.blank();
    logger.info(`Source: ${sourcePath}`);
    logger.info(`Targets: ${targetPaths.length} project(s)`);

    let totalSynced = 0;
    let totalSkipped = 0;

    for (const targetPath of targetPaths) {
      logger.blank();
      logger.info(`→ ${targetPath}`);

      const result = await syncProjects(sourcePath, targetPath, options, rl);
      totalSynced += result.synced;
      totalSkipped += result.skipped;
    }

    // Summary
    logger.blank();
    if (options.dryRun) {
      logger.info(`Dry run complete: ${totalSynced} file(s) would be synced`);
    } else {
      logger.success(`Sync complete: ${totalSynced} file(s) synced, ${totalSkipped} skipped`);
    }

    rl.close();
  } catch (err) {
    rl.close();
    throw err;
  }
}

/**
 * Register the sync command
 */
export function syncCommand(program: Command): void {
  program
    .command('sync')
    .description('Sync standards between MARR-configured projects')
    .option('--from <path>', 'Source project path')
    .option('--to <path...>', 'Target project path(s)')
    .option('--only <files>', 'Sync specific standard(s) only (comma-separated)')
    .option('-n, --dry-run', 'Preview changes without applying')
    .option('-f, --force', 'Skip confirmation prompts')
    .option('--register', 'Add current project to registry')
    .option('--unregister', 'Remove current project from registry')
    .option('--list', 'Show registered projects')
    .addHelpText(
      'after',
      `
Examples:
  $ marr sync                    Interactive mode - select source and targets
  $ marr sync --from ~/proj/a --to ~/proj/b   Sync from A to B
  $ marr sync --only prj-version-control-standard.md   Sync specific standard
  $ marr sync --dry-run          Preview changes
  $ marr sync --force            Skip confirmations
  $ marr sync --register         Add current project to registry
  $ marr sync --unregister       Remove current project from registry
  $ marr sync --list             Show registered projects

Projects are auto-registered when you run 'marr init --project'.`
    )
    .action(async (options: SyncOptions) => {
      try {
        await executeSync(options);
      } catch (err) {
        logger.error((err as Error).message);
        process.exit(1);
      }
    });
}
