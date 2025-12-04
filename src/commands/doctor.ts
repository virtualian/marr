/**
 * Doctor command - Interactive conflict resolution
 *
 * Walks through detected conflicts and helps resolve them
 */

import { Command } from 'commander';
import * as readline from 'readline';
import * as logger from '../utils/logger.js';
import * as fileOps from '../utils/file-ops.js';
import * as backup from '../utils/backup.js';
import {
  detectProjectConflicts,
  detectUserConflicts,
} from '../utils/conflict-detector.js';
import type {
  Conflict,
  Resolution,
  ResolutionAction,
} from '../types/conflict.js';

interface DoctorOptions {
  auto?: boolean;
  user?: boolean;
  project?: boolean;
  dryRun?: boolean;
}

export function doctorCommand(program: Command): void {
  program
    .command('doctor')
    .description('Interactive conflict resolution for MARR configuration')
    .option('--auto', 'Automatically apply recommended resolutions')
    .option('-u, --user', 'Only check user-level configuration')
    .option('-p, --project', 'Only check project-level configuration')
    .option('-n, --dry-run', 'Preview what would be changed without applying')
    .addHelpText('after', `
What it does:
  1. Detects conflicts between your config and MARR standards
  2. Walks through each conflict interactively
  3. Lets you choose how to resolve each conflict
  4. Creates backups before any modifications

Workflow:
  $ marr validate        # See what conflicts exist
  $ marr doctor          # Resolve conflicts interactively

Examples:
  $ marr doctor              Interactive resolution
  $ marr doctor --auto       Apply recommended fixes automatically
  $ marr doctor --dry-run    Preview without making changes
  $ marr doctor --user       Only check user config (~/.claude/)
  $ marr doctor --project    Only check project config`)
    .action(async (options: DoctorOptions) => {
      try {
        await executeDoctor(options);
      } catch (err) {
        logger.error((err as Error).message);
        process.exit(1);
      }
    });
}

async function executeDoctor(options: DoctorOptions): Promise<void> {
  const { auto, user, project, dryRun } = options;

  logger.section(dryRun ? 'MARR Doctor (Dry Run)' : 'MARR Doctor');
  logger.blank();

  // Determine scope
  const checkUser = user || (!user && !project);
  const checkProject = project || (!user && !project);

  // Detect conflicts
  logger.info('Scanning for conflicts...');
  const conflicts: Conflict[] = [];

  if (checkUser) {
    conflicts.push(...detectUserConflicts());
  }

  if (checkProject) {
    conflicts.push(...detectProjectConflicts());
  }

  if (conflicts.length === 0) {
    logger.blank();
    logger.success('No conflicts detected! Your configuration is clean.');
    return;
  }

  logger.blank();
  logger.log(`Found ${conflicts.length} conflict(s) to resolve.`);
  logger.blank();

  // Process conflicts
  const actions: ResolutionAction[] = [];

  if (auto) {
    // Auto mode: apply recommended resolutions
    for (const conflict of conflicts) {
      const recommended = conflict.resolutions.find(r => r.recommended);
      const resolution = recommended || conflict.resolutions[0];

      const action = await applyResolution(conflict, resolution, dryRun);
      actions.push(action);
    }
  } else {
    // Interactive mode
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    for (let i = 0; i < conflicts.length; i++) {
      const conflict = conflicts[i];
      const action = await resolveConflictInteractively(rl, conflict, i + 1, conflicts.length, dryRun);
      actions.push(action);
    }

    rl.close();
  }

  // Display summary
  displaySummary(actions, dryRun);
}

/**
 * Interactively resolve a single conflict
 */
async function resolveConflictInteractively(
  rl: readline.Interface,
  conflict: Conflict,
  current: number,
  total: number,
  dryRun?: boolean
): Promise<ResolutionAction> {
  logger.section(`[${current}/${total}] ${getCategoryLabel(conflict.category)}`);

  // Display conflict details
  logger.log(`  Location: ${conflict.location}${conflict.line ? `:${conflict.line}` : ''}`);
  logger.log(`  Found: "${conflict.existing}"`);

  if (conflict.marrExpects) {
    logger.log(`  MARR expects: ${conflict.marrExpects}`);
  }

  if (conflict.marrSource) {
    logger.log(`  Source: ${conflict.marrSource}`);
  }

  logger.blank();
  logger.log('  Options:');

  // Display resolution options
  for (const resolution of conflict.resolutions) {
    const marker = resolution.recommended ? ' (recommended)' : '';
    logger.log(`    [${resolution.key}] ${resolution.label}${marker}`);
    logger.log(`        ${resolution.description}`);
  }

  logger.blank();

  // Get user choice
  const choice = await question(rl, '  Choice: ');
  const selectedResolution = conflict.resolutions.find(
    r => r.key.toLowerCase() === choice.toLowerCase()
  );

  if (!selectedResolution) {
    logger.warning('  Invalid choice, skipping...');
    return {
      conflictId: conflict.id,
      resolution: 'skipped',
      success: false,
      error: 'Invalid choice',
    };
  }

  return applyResolution(conflict, selectedResolution, dryRun);
}

/**
 * Apply a resolution to a conflict
 */
async function applyResolution(
  conflict: Conflict,
  resolution: Resolution,
  dryRun?: boolean
): Promise<ResolutionAction> {
  const action: ResolutionAction = {
    conflictId: conflict.id,
    resolution: resolution.label,
    success: true,
  };

  // Skip resolution
  if (resolution.key === 's') {
    logger.info(`  Skipped: ${conflict.description}`);
    return action;
  }

  // For dry run, just report what would happen
  if (dryRun) {
    logger.info(`  Would apply: ${resolution.label}`);
    return action;
  }

  // Create backup before modifying
  if (fileOps.exists(conflict.location)) {
    const backupPath = backup.createBackup(conflict.location);
    if (backupPath) {
      action.backupPath = backupPath;
      logger.success(`  Backup created: ${backupPath}`);
    }
  }

  // Apply the resolution based on category and choice
  try {
    switch (conflict.category) {
      case 'missing_import':
        if (resolution.key === 'a') {
          await addMissingImport(conflict);
          logger.success(`  Added MARR import to ${conflict.location}`);
        }
        break;

      case 'directive_conflict':
        if (resolution.key === 'm') {
          await removeConflictingDirective(conflict);
          logger.success(`  Removed conflicting directive from ${conflict.location}`);
        } else if (resolution.key === 'k') {
          logger.info(`  Keeping existing directive`);
        }
        break;

      case 'duplicate_standard':
        if (resolution.key === 'm') {
          // For now, just inform user - removing files is dangerous
          logger.info(`  Consider removing: ${conflict.location}`);
          logger.info(`  MARR provides this functionality via ${conflict.marrSource}`);
        } else if (resolution.key === 'k') {
          logger.info(`  Keeping your custom standard`);
        } else if (resolution.key === 'b') {
          logger.warning(`  Keeping both - may cause conflicts`);
        }
        break;

      case 'override_after_import':
        if (resolution.key === 'r') {
          await removeConflictingDirective(conflict);
          logger.success(`  Removed override from ${conflict.location}`);
        } else if (resolution.key === 'k') {
          logger.info(`  Keeping intentional override`);
        }
        break;
    }
  } catch (err) {
    action.success = false;
    action.error = (err as Error).message;
    logger.error(`  Failed: ${action.error}`);
  }

  return action;
}

/**
 * Add missing MARR import to a file
 */
async function addMissingImport(conflict: Conflict): Promise<void> {
  const content = fileOps.readFile(conflict.location);

  // Determine which import to add based on location
  const isUserConfig = conflict.location.includes('.claude/CLAUDE.md') &&
    conflict.location.includes(fileOps.getHomeDir());

  const importLine = isUserConfig
    ? '@~/.claude/marr/MARR-USER-CLAUDE.md'
    : '@.claude/marr/MARR-PROJECT-CLAUDE.md';

  const importComment = '<!-- MARR: Making Agents Really Reliable -->';
  const importBlock = `${importComment}\n${importLine}\n`;

  // Add after first heading or at top
  const lines = content.split('\n');
  const firstHeadingIndex = lines.findIndex(line => line.startsWith('# '));

  let newContent: string;
  if (firstHeadingIndex >= 0) {
    lines.splice(firstHeadingIndex + 1, 0, '', importBlock);
    newContent = lines.join('\n');
  } else {
    newContent = importBlock + '\n' + content;
  }

  fileOps.writeFile(conflict.location, newContent);
}

/**
 * Remove a conflicting directive from a file
 */
async function removeConflictingDirective(conflict: Conflict): Promise<void> {
  if (!conflict.line) {
    throw new Error('Cannot remove directive without line number');
  }

  const content = fileOps.readFile(conflict.location);
  const lines = content.split('\n');

  // Remove the conflicting line
  const lineIndex = conflict.line - 1;
  if (lineIndex >= 0 && lineIndex < lines.length) {
    lines.splice(lineIndex, 1);
  }

  fileOps.writeFile(conflict.location, lines.join('\n'));
}

/**
 * Get human-readable label for conflict category
 */
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    directive_conflict: 'Directive Conflict',
    duplicate_standard: 'Duplicate Standard',
    missing_import: 'Missing MARR Import',
    override_after_import: 'Override After Import',
  };
  return labels[category] || category;
}

/**
 * Display summary of actions taken
 */
function displaySummary(actions: ResolutionAction[], dryRun?: boolean): void {
  logger.blank();
  logger.section(dryRun ? 'Summary (Dry Run)' : 'Summary');

  const resolved = actions.filter(a => a.success && a.resolution !== 'skipped').length;
  const skipped = actions.filter(a => a.resolution === 'skipped' || a.resolution.toLowerCase().includes('skip')).length;
  const failed = actions.filter(a => !a.success).length;

  logger.log(`  Resolved: ${resolved}`);
  logger.log(`  Skipped: ${skipped}`);
  logger.log(`  Failed: ${failed}`);

  // List backups created
  const backups = actions.filter(a => a.backupPath);
  if (backups.length > 0) {
    logger.blank();
    logger.info('Backups created:');
    for (const action of backups) {
      logger.log(`  ${action.backupPath}`);
    }
  }

  logger.blank();

  if (dryRun) {
    logger.info('Dry run complete. Run without --dry-run to apply changes.');
  } else if (failed === 0) {
    logger.success('Doctor complete!');
  } else {
    logger.warning(`Doctor complete with ${failed} failure(s).`);
  }
}

/**
 * Promise-based readline question
 */
function question(rl: readline.Interface, prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}
