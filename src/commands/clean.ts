/**
 * Clean command - Remove MARR configuration
 * Removes MARR files from user and/or project locations
 */

import { Command } from 'commander';
import { rmSync, unlinkSync } from 'fs';
import { join } from 'path';
import * as fileOps from '../utils/file-ops.js';
import * as logger from '../utils/logger.js';
import { removeMarrImport, isMarrSetup, hasMarrImport } from '../utils/marr-setup.js';

/** Helper scripts installed by MARR */
const HELPER_SCRIPTS = [
  'gh-add-subissue.sh',
  'gh-list-subissues.sh',
];

interface CleanOptions {
  user: boolean;
  project: boolean;
  all: boolean;
  dryRun: boolean;
  force: boolean;
}

/**
 * Check if any helper scripts are installed in ~/bin/
 */
function hasHelperScripts(): boolean {
  const binDir = join(fileOps.getHomeDir(), 'bin');
  return HELPER_SCRIPTS.some(script => fileOps.exists(join(binDir, script)));
}

/**
 * Clean user-level MARR configuration (~/.claude/marr/)
 */
function cleanUser(dryRun: boolean): { removed: string[]; errors: string[] } {
  const removed: string[] = [];
  const errors: string[] = [];

  const marrRoot = fileOps.getMarrRoot();
  const binDir = join(fileOps.getHomeDir(), 'bin');

  // Remove import from ~/.claude/CLAUDE.md
  if (hasMarrImport()) {
    if (dryRun) {
      removed.push('Import line from ~/.claude/CLAUDE.md');
    } else {
      try {
        removeMarrImport();
        removed.push('Import line from ~/.claude/CLAUDE.md');
      } catch (err) {
        errors.push(`Failed to remove import from ~/.claude/CLAUDE.md: ${(err as Error).message}`);
      }
    }
  }

  // Remove ~/.claude/marr/ directory
  if (isMarrSetup()) {
    if (dryRun) {
      removed.push('~/.claude/marr/ directory');
    } else {
      try {
        rmSync(marrRoot, { recursive: true, force: true });
        removed.push('~/.claude/marr/ directory');
      } catch (err) {
        errors.push(`Failed to remove ~/.claude/marr/: ${(err as Error).message}`);
      }
    }
  }

  // Remove helper scripts from ~/bin/
  for (const script of HELPER_SCRIPTS) {
    const scriptPath = join(binDir, script);
    if (fileOps.exists(scriptPath)) {
      if (dryRun) {
        removed.push(`~/bin/${script}`);
      } else {
        try {
          unlinkSync(scriptPath);
          removed.push(`~/bin/${script}`);
        } catch (err) {
          errors.push(`Failed to remove ~/bin/${script}: ${(err as Error).message}`);
        }
      }
    }
  }

  return { removed, errors };
}

/**
 * Clean project-level MARR configuration (./MARR-PROJECT-CLAUDE.md and ./.marr/)
 */
function cleanProject(dryRun: boolean): { removed: string[]; errors: string[] } {
  const removed: string[] = [];
  const errors: string[] = [];

  const cwd = process.cwd();
  const claudeMdPath = join(cwd, 'MARR-PROJECT-CLAUDE.md');
  const marrPath = join(cwd, '.marr');

  // Remove ./MARR-PROJECT-CLAUDE.md if it exists
  if (fileOps.exists(claudeMdPath)) {
    if (dryRun) {
      removed.push('./MARR-PROJECT-CLAUDE.md');
    } else {
      try {
        rmSync(claudeMdPath);
        removed.push('./MARR-PROJECT-CLAUDE.md');
      } catch (err) {
        errors.push(`Failed to remove ./MARR-PROJECT-CLAUDE.md: ${(err as Error).message}`);
      }
    }
  }

  // Remove ./.marr/ directory if it exists
  if (fileOps.exists(marrPath) && fileOps.isDirectory(marrPath)) {
    if (dryRun) {
      removed.push('./.marr/ directory');
    } else {
      try {
        rmSync(marrPath, { recursive: true, force: true });
        removed.push('./.marr/ directory');
      } catch (err) {
        errors.push(`Failed to remove ./.marr/: ${(err as Error).message}`);
      }
    }
  }

  return { removed, errors };
}

/**
 * Execute clean command
 */
function executeClean(options: CleanOptions): void {
  const { user, project, all, dryRun } = options;

  // Determine what to clean
  const cleanUserConfig = user || all || (!user && !project);
  const cleanProjectConfig = project || all;

  // Validate there's something to clean
  const userHasContent = isMarrSetup() || hasMarrImport() || hasHelperScripts();
  const projectHasContent = fileOps.exists(join(process.cwd(), 'MARR-PROJECT-CLAUDE.md')) ||
    fileOps.exists(join(process.cwd(), '.marr'));

  if (cleanUserConfig && !userHasContent && cleanProjectConfig && !projectHasContent) {
    logger.info('Nothing to clean - no MARR configuration found.');
    return;
  }

  if (cleanUserConfig && !userHasContent && !cleanProjectConfig) {
    logger.info('Nothing to clean - no user-level MARR configuration found.');
    return;
  }

  if (cleanProjectConfig && !projectHasContent && !cleanUserConfig) {
    logger.info('Nothing to clean - no project-level MARR configuration found.');
    return;
  }

  // Show what will be cleaned
  if (dryRun) {
    logger.section('Dry Run - Would Remove');
  } else {
    logger.section('Cleaning MARR Configuration');
  }

  const allRemoved: string[] = [];
  const allErrors: string[] = [];

  // Clean user config
  if (cleanUserConfig && userHasContent) {
    const { removed, errors } = cleanUser(dryRun);
    allRemoved.push(...removed);
    allErrors.push(...errors);
  }

  // Clean project config
  if (cleanProjectConfig && projectHasContent) {
    const { removed, errors } = cleanProject(dryRun);
    allRemoved.push(...removed);
    allErrors.push(...errors);
  }

  // Display results
  if (allRemoved.length > 0) {
    for (const item of allRemoved) {
      if (dryRun) {
        logger.info(`  Would remove: ${item}`);
      } else {
        logger.success(`  Removed: ${item}`);
      }
    }
  }

  if (allErrors.length > 0) {
    logger.blank();
    for (const error of allErrors) {
      logger.error(error);
    }
  }

  // Summary
  logger.blank();
  if (dryRun) {
    logger.info(`Dry run complete. ${allRemoved.length} item(s) would be removed.`);
    logger.info('Run without --dry-run to actually remove files.');
  } else if (allErrors.length === 0) {
    logger.success('MARR configuration cleaned successfully.');
  } else {
    logger.warning(`Cleaned with ${allErrors.length} error(s).`);
  }
}

/**
 * Register clean command with CLI
 */
export function cleanCommand(program: Command): void {
  program
    .command('clean')
    .description('Remove MARR configuration files')
    .option('-u, --user', 'Remove user-level config (~/.claude/marr/, helper scripts)')
    .option('-p, --project', 'Remove project-level config (./MARR-PROJECT-CLAUDE.md, ./.marr/)')
    .option('-a, --all', 'Remove both user and project config')
    .option('-n, --dry-run', 'Preview what would be removed without deleting')
    .option('-f, --force', 'Skip confirmation prompts')
    .addHelpText('after', `
What gets removed:
  --user      ~/.claude/marr/, import line in ~/.claude/CLAUDE.md, ~/bin/*.sh scripts
  --project   ./MARR-PROJECT-CLAUDE.md, ./.marr/ directory

Examples:
  $ marr clean --project              Remove MARR from current project
  $ marr clean --user                 Remove user-level MARR config
  $ marr clean --all                  Remove everything
  $ marr clean --project --dry-run    Preview what would be removed

Note: Without flags, defaults to --user (user-level cleanup only).`)
    .action((options: CleanOptions) => {
      executeClean(options);
    });
}
