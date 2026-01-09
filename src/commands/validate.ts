/**
 * Validate command - Validate MARR configuration
 *
 * Performs structural validation and conflict detection
 */

import { Command } from 'commander';
import { execSync } from 'child_process';
import { join } from 'path';
import * as logger from '../utils/logger.js';
import * as fileOps from '../utils/file-ops.js';
import { detectProjectConflicts } from '../utils/conflict-detector.js';
import type { Conflict } from '../types/conflict.js';

interface ValidateOptions {
  strict?: boolean;
  conflicts?: boolean;
  json?: boolean;
  verbose?: boolean;
}

interface ValidationResult {
  errors: string[];
  warnings: string[];
  conflicts: Conflict[];
  context?: DiagnosticContext;
  notMarrProject?: boolean;
}

interface DiagnosticContext {
  cwd: string;
  gitRoot: string | null;
  gitRootHasMarr: boolean;
  partialSetup: {
    hasClaudeDir: boolean;
    hasMarrDir: boolean;
    hasProjectConfig: boolean;
    hasStandards: boolean;
  };
}

export function validateCommand(program: Command): void {
  program
    .command('validate')
    .description('Validate MARR configuration in current project')
    .option('--strict', 'Treat warnings as errors (exit code 1)')
    .option('--conflicts', 'Only check for conflicts (skip structural validation)')
    .option('--json', 'Output results as JSON')
    .option('--verbose', 'Show additional diagnostic information')
    .addHelpText('after', `
What it checks:
  Structural validation:
  • .claude/marr/MARR-PROJECT-CLAUDE.md exists and has required sections
  • .claude/marr/standards/ directory exists with standard files
  • Prompt files follow naming convention (prj-*)
  • CLAUDE.md has MARR import line

  Conflict detection:
  • Directives that contradict MARR philosophy
  • Duplicate standards that overlap with MARR
  • Missing MARR imports

Examples:
  $ marr validate              Standard validation
  $ marr validate --strict     Fail if any warnings found
  $ marr validate --conflicts  Only check for conflicts
  $ marr validate --json       Output as JSON (for tooling)
  $ marr validate --verbose    Show diagnostic details

Exit codes:
  0  Validation passed
  1  Validation failed (errors, or warnings in strict mode)`)
    .action((options: ValidateOptions) => {
      const result = options.conflicts
        ? validateConflictsOnly()
        : validateProject(options);

      if (options.json) {
        displayResultsJson(result);
      } else {
        displayResults(result, options);
      }

      // Exit with error code if validation failed
      if (result.errors.length > 0) {
        process.exit(1);
      }

      // Count conflicts as warnings for exit code purposes
      const totalWarnings = result.warnings.length + result.conflicts.length;

      if (options.strict && totalWarnings > 0) {
        process.exit(1);
      }
    });
}

/**
 * Only check for conflicts, skip structural validation
 */
function validateConflictsOnly(): ValidationResult {
  const conflicts = detectProjectConflicts();
  return {
    errors: [],
    warnings: [],
    conflicts,
  };
}

/**
 * Gather diagnostic context for error messages
 */
function gatherDiagnosticContext(): DiagnosticContext {
  const cwd = process.cwd();
  const claudeDir = join(cwd, '.claude');
  const marrDir = join(cwd, '.claude', 'marr');
  const projectConfig = join(marrDir, 'MARR-PROJECT-CLAUDE.md');
  const standardsDir = join(marrDir, 'standards');

  // Detect git root
  let gitRoot: string | null = null;
  try {
    gitRoot = execSync('git rev-parse --show-toplevel', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    // Not in a git repository
  }

  // Check if git root has MARR
  let gitRootHasMarr = false;
  if (gitRoot && gitRoot !== cwd) {
    const gitRootMarrDir = join(gitRoot, '.claude', 'marr');
    gitRootHasMarr = fileOps.exists(gitRootMarrDir);
  }

  return {
    cwd,
    gitRoot,
    gitRootHasMarr,
    partialSetup: {
      hasClaudeDir: fileOps.exists(claudeDir),
      hasMarrDir: fileOps.exists(marrDir),
      hasProjectConfig: fileOps.exists(projectConfig),
      hasStandards: fileOps.exists(standardsDir),
    },
  };
}

/**
 * Display rich error message when not in a MARR project
 */
function displayNotMarrProject(ctx: DiagnosticContext, verbose: boolean): void {
  const { cwd, gitRoot, gitRootHasMarr, partialSetup } = ctx;

  // Scenario 1: In a git subdirectory where MARR exists at the root
  if (gitRootHasMarr && gitRoot) {
    logger.error('Not in a MARR project root');
    logger.blank();
    logger.log(`Current directory: ${cwd}`);
    logger.blank();
    logger.info('Detected: You\'re in a subdirectory of a MARR project.');
    logger.log(`Git root: ${gitRoot} (has .claude/marr/)`);
    logger.blank();
    logger.log('What to do:');
    logger.log(`  • Navigate to project root: cd ${gitRoot}`);
    logger.log('  • Then run: marr validate');
    return;
  }

  // Scenario 2: Partial setup detected
  if (partialSetup.hasClaudeDir && !partialSetup.hasMarrDir) {
    logger.error('Incomplete MARR setup');
    logger.blank();
    logger.log(`Current directory: ${cwd}`);
    logger.blank();
    logger.log('Found:');
    logger.log('  ✓ .claude/ directory exists');
    logger.log('  ✗ .claude/marr/ directory missing');
    logger.log('  ✗ MARR-PROJECT-CLAUDE.md missing');
    logger.blank();
    logger.log('What to do:');
    logger.log('  • Complete initialization: Run \'marr init --project\'');
    return;
  }

  // Scenario 3: Not a MARR project at all
  logger.error('Not a MARR-initialized project');
  logger.blank();
  logger.log(`Current directory: ${cwd}`);
  logger.blank();
  logger.log('Possible causes:');
  logger.log('  • You may be in the wrong directory');
  logger.log('  • This project hasn\'t been initialized with MARR yet');
  logger.log('  • The .claude/marr/ directory was deleted');
  logger.blank();
  logger.log('What to do:');
  logger.log('  • If this should be a MARR project: Run \'marr init --project\'');
  logger.log('  • If you\'re in the wrong directory: Navigate to your project root');
  logger.log('  • To check MARR user setup: Run \'marr status\'');
  logger.blank();
  logger.info('Tip: MARR projects have a .claude/marr/ directory at their root.');

  // Verbose output
  if (verbose) {
    logger.blank();
    logger.section('Diagnostics');
    logger.log(`  Working directory: ${cwd}`);
    logger.log(`  Git repository: ${gitRoot ? `Yes (root: ${gitRoot})` : 'No'}`);
    logger.log(`  .claude/ exists: ${partialSetup.hasClaudeDir ? 'Yes' : 'No'}`);
    logger.log(`  .claude/marr/ exists: ${partialSetup.hasMarrDir ? 'Yes' : 'No'}`);
    logger.log(`  User MARR setup: ${fileOps.exists(fileOps.getMarrRoot()) ? 'Yes' : 'No'}`);
  }
}

/**
 * Full validation: structure + conflicts
 */
function validateProject(options: ValidateOptions): ValidationResult {
  logger.section('MARR Configuration Validation');

  const result: ValidationResult = {
    errors: [],
    warnings: [],
    conflicts: [],
  };

  // Gather diagnostic context first
  const ctx = gatherDiagnosticContext();
  result.context = ctx;

  // Check if we're in a MARR project
  const isMarrProject = validateMarrProject(result, ctx, options);

  // If not a MARR project, stop here
  if (!isMarrProject) {
    result.notMarrProject = true;
    return result;
  }

  // Validate MARR-PROJECT-CLAUDE.md structure
  validateMarrProjectClaudeMd(result);

  // Validate standards directory
  validateStandardsDirectory(result);

  // Validate standard file naming
  validateStandardNaming(result);

  // Validate root CLAUDE.md has import
  validateRootClaudeMd(result);

  // Detect conflicts
  logger.blank();
  logger.info('Checking for conflicts...');
  result.conflicts = detectProjectConflicts();

  if (result.conflicts.length === 0) {
    logger.success('No conflicts detected');
  }

  return result;
}

function validateMarrProject(
  result: ValidationResult,
  ctx: DiagnosticContext,
  options: ValidateOptions
): boolean {
  const marrDir = join(process.cwd(), '.claude', 'marr');
  const marrProjectClaudeMdPath = join(marrDir, 'MARR-PROJECT-CLAUDE.md');

  if (!fileOps.exists(marrDir)) {
    // Use rich display for non-JSON output
    if (!options.json) {
      displayNotMarrProject(ctx, options.verbose ?? false);
    }
    result.errors.push('Not a MARR-initialized project');
    return false;
  }

  if (!fileOps.exists(marrProjectClaudeMdPath)) {
    result.errors.push('.claude/marr/MARR-PROJECT-CLAUDE.md not found');
    result.errors.push('Run: marr init --project --force');
    return false;
  }

  logger.success('.claude/marr/MARR-PROJECT-CLAUDE.md exists');
  return true;
}

function validateMarrProjectClaudeMd(result: ValidationResult): void {
  const marrProjectClaudeMdPath = join(process.cwd(), '.claude', 'marr', 'MARR-PROJECT-CLAUDE.md');
  const content = fileOps.readFile(marrProjectClaudeMdPath);

  // Check for project name heading
  const lines = content.split('\n');
  const firstHeading = lines.find(line => line.startsWith('# '));
  if (!firstHeading) {
    result.errors.push('MARR-PROJECT-CLAUDE.md missing project name heading (# Project Name)');
  }

  logger.success('MARR-PROJECT-CLAUDE.md structure validated');
}

function validateStandardsDirectory(result: ValidationResult): void {
  const standardsDir = join(process.cwd(), '.claude', 'marr', 'standards');

  if (!fileOps.exists(standardsDir)) {
    result.warnings.push('.claude/marr/standards/ directory not found');
    result.warnings.push('  No project standards installed. Run: marr init --project --standards all');
    return;
  }

  if (!fileOps.isDirectory(standardsDir)) {
    result.errors.push('.claude/marr/standards exists but is not a directory');
    return;
  }

  // Note: Removed check for specific recommended standards
  // Projects can choose which standards to use

  logger.success('.claude/marr/standards/ directory validated');
}

function validateStandardNaming(result: ValidationResult): void {
  const standardsDir = join(process.cwd(), '.claude', 'marr', 'standards');

  if (!fileOps.exists(standardsDir)) {
    return; // Already reported warning
  }

  const files = fileOps.listFiles(standardsDir, false);

  for (const file of files) {
    const filename = file.substring(file.lastIndexOf('/') + 1);

    // Skip non-markdown files
    if (!filename.endsWith('.md')) {
      continue;
    }

    // Skip README files
    if (filename === 'README.md') {
      continue;
    }

    // Check naming convention
    if (!filename.startsWith('prj-')) {
      result.warnings.push(`Standard file doesn't follow naming convention: ${filename}`);
      result.warnings.push('  Expected: prj-*');
    }
  }

  logger.success('Standard file naming validated');
}

function validateRootClaudeMd(result: ValidationResult): void {
  const rootClaudeMdPath = join(process.cwd(), 'CLAUDE.md');
  const dotClaudeClaudeMdPath = join(process.cwd(), '.claude', 'CLAUDE.md');
  const importLine = '@.claude/marr/MARR-PROJECT-CLAUDE.md';

  // Check both possible CLAUDE.md locations
  let claudeMdPath: string | null = null;
  let location = '';

  if (fileOps.exists(rootClaudeMdPath)) {
    claudeMdPath = rootClaudeMdPath;
    location = 'CLAUDE.md';
  } else if (fileOps.exists(dotClaudeClaudeMdPath)) {
    claudeMdPath = dotClaudeClaudeMdPath;
    location = '.claude/CLAUDE.md';
  }

  if (!claudeMdPath) {
    result.warnings.push('CLAUDE.md not found (checked ./CLAUDE.md and ./.claude/CLAUDE.md)');
    result.warnings.push('  Claude Code may not discover MARR configuration');
    result.warnings.push('  Run: marr init --project --force');
    return;
  }

  const content = fileOps.readFile(claudeMdPath);

  if (!content.includes(importLine)) {
    result.warnings.push(`${location} missing MARR import line`);
    result.warnings.push(`  Expected: ${importLine}`);
    result.warnings.push('  Run: marr init --project --force');
  } else {
    logger.success(`${location} has MARR import`);
  }
}

/**
 * Display results as JSON
 */
function displayResultsJson(result: ValidationResult): void {
  const output: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    valid: result.errors.length === 0,
    errors: result.errors,
    warnings: result.warnings,
    conflicts: result.conflicts.map(c => ({
      id: c.id,
      category: c.category,
      severity: c.severity,
      location: c.location,
      line: c.line,
      description: c.description,
      existing: c.existing,
      marrExpects: c.marrExpects,
      marrSource: c.marrSource,
    })),
    summary: {
      errors: result.errors.length,
      warnings: result.warnings.length,
      conflicts: result.conflicts.length,
    },
  };

  // Include diagnostic context when available
  if (result.context) {
    output.context = {
      cwd: result.context.cwd,
      gitRoot: result.context.gitRoot,
      gitRootHasMarr: result.context.gitRootHasMarr,
      partialSetup: result.context.partialSetup,
    };
  }

  console.log(JSON.stringify(output, null, 2));
}

function displayResults(result: ValidationResult, options: ValidateOptions): void {
  // Skip error display if we already showed rich "not MARR project" message
  if (result.notMarrProject) {
    logger.blank();
    return;
  }

  // Display errors
  if (result.errors.length > 0) {
    logger.section('Errors');
    for (const error of result.errors) {
      logger.error(error);
    }
  }

  // Display warnings
  if (result.warnings.length > 0) {
    logger.section('Warnings');
    for (const warning of result.warnings) {
      logger.warning(warning);
    }
  }

  // Display conflicts
  if (result.conflicts.length > 0) {
    logger.section('Conflicts Detected');
    for (const conflict of result.conflicts) {
      const severityIcon = conflict.severity === 'error' ? '✗' : '⚠';
      logger.log(`\n${severityIcon} ${conflict.description}`);
      logger.log(`  Location: ${conflict.location}${conflict.line ? `:${conflict.line}` : ''}`);
      logger.log(`  Found: "${conflict.existing}"`);
      if (conflict.marrExpects) {
        logger.log(`  MARR expects: ${conflict.marrExpects}`);
      }
      if (conflict.marrSource) {
        logger.log(`  Source: ${conflict.marrSource}`);
      }
    }
    logger.blank();
    logger.info('Run: marr doctor  to resolve conflicts interactively');
  }

  // Summary
  const totalIssues = result.errors.length + result.warnings.length + result.conflicts.length;

  if (totalIssues === 0) {
    logger.blank();
    logger.success('Validation passed! Configuration is valid.');
  } else {
    logger.section('Summary');
    logger.log(`Errors: ${result.errors.length}`);
    logger.log(`Warnings: ${result.warnings.length}`);
    logger.log(`Conflicts: ${result.conflicts.length}`);

    if (options.strict && (result.warnings.length > 0 || result.conflicts.length > 0)) {
      logger.blank();
      logger.error('Validation failed in strict mode (warnings/conflicts treated as errors)');
    }
  }

  logger.blank();
}
