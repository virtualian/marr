/**
 * Clean command - Remove MARR configuration
 * Removes MARR files from user and/or project locations
 */

import { Command } from 'commander';
import { rmSync } from 'fs';
import { join } from 'path';
import * as fileOps from '../utils/file-ops.js';
import * as logger from '../utils/logger.js';
import { removeMarrImport, isMarrSetup, hasMarrImport } from '../utils/marr-setup.js';

interface CleanOptions {
  user: boolean;
  project: boolean;
  all: boolean;
  dryRun: boolean;
  force: boolean;
}

/**
 * Clean user-level MARR configuration (~/.claude/marr/)
 */
function cleanUser(dryRun: boolean): { removed: string[]; errors: string[] } {
  const removed: string[] = [];
  const errors: string[] = [];

  const marrRoot = fileOps.getMarrRoot();

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

  return { removed, errors };
}

/**
 * Clean project-level MARR configuration (./CLAUDE.md and ./prompts/)
 */
function cleanProject(dryRun: boolean): { removed: string[]; errors: string[] } {
  const removed: string[] = [];
  const errors: string[] = [];

  const cwd = process.cwd();
  const claudeMdPath = join(cwd, 'CLAUDE.md');
  const promptsPath = join(cwd, 'prompts');

  // Remove ./CLAUDE.md if it exists
  if (fileOps.exists(claudeMdPath)) {
    if (dryRun) {
      removed.push('./CLAUDE.md');
    } else {
      try {
        rmSync(claudeMdPath);
        removed.push('./CLAUDE.md');
      } catch (err) {
        errors.push(`Failed to remove ./CLAUDE.md: ${(err as Error).message}`);
      }
    }
  }

  // Remove ./prompts/ directory if it exists
  if (fileOps.exists(promptsPath) && fileOps.isDirectory(promptsPath)) {
    if (dryRun) {
      removed.push('./prompts/ directory');
    } else {
      try {
        rmSync(promptsPath, { recursive: true, force: true });
        removed.push('./prompts/ directory');
      } catch (err) {
        errors.push(`Failed to remove ./prompts/: ${(err as Error).message}`);
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
  const userHasContent = isMarrSetup() || hasMarrImport();
  const projectHasContent = fileOps.exists(join(process.cwd(), 'CLAUDE.md')) ||
    fileOps.exists(join(process.cwd(), 'prompts'));

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
    .option('-u, --user', 'Clean user-level config (~/.claude/marr/)')
    .option('-p, --project', 'Clean project-level config (./CLAUDE.md, ./prompts/)')
    .option('-a, --all', 'Clean both user and project config')
    .option('-n, --dry-run', 'Show what would be removed without actually removing')
    .option('-f, --force', 'Skip confirmation prompts')
    .action((options: CleanOptions) => {
      executeClean(options);
    });
}
