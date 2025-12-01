/**
 * Validate command - Validate MARR configuration
 */

import { Command } from 'commander';
import { join } from 'path';
import * as logger from '../utils/logger.js';
import * as fileOps from '../utils/file-ops.js';

interface ValidateOptions {
  strict?: boolean;
}

interface ValidationResult {
  errors: string[];
  warnings: string[];
}

export function validateCommand(program: Command): void {
  program
    .command('validate')
    .description('Validate MARR configuration in current project')
    .option('--strict', 'Treat warnings as errors (exit code 1)')
    .addHelpText('after', `
What it checks:
  • .claude/marr/MARR-PROJECT-CLAUDE.md exists and has required sections
  • .claude/marr/standards/ directory exists with standard files
  • Prompt files follow naming convention (prj-*)
  • CLAUDE.md has MARR import line

Examples:
  $ marr validate              Standard validation (warnings allowed)
  $ marr validate --strict     Fail if any warnings found

Exit codes:
  0  Validation passed
  1  Validation failed (errors, or warnings in strict mode)`)
    .action((options: ValidateOptions) => {
      const result = validateProject(options);
      displayResults(result, options);

      // Exit with error code if validation failed
      if (result.errors.length > 0) {
        process.exit(1);
      }

      if (options.strict && result.warnings.length > 0) {
        process.exit(1);
      }
    });
}

function validateProject(_options: ValidateOptions): ValidationResult {
  logger.section('MARR Configuration Validation');

  const result: ValidationResult = {
    errors: [],
    warnings: [],
  };

  // Check if we're in a MARR project
  validateMarrProject(result);

  // If not a MARR project, stop here
  if (result.errors.length > 0) {
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

  return result;
}

function validateMarrProject(result: ValidationResult): void {
  const marrDir = join(process.cwd(), '.claude', 'marr');
  const marrProjectClaudeMdPath = join(marrDir, 'MARR-PROJECT-CLAUDE.md');

  if (!fileOps.exists(marrDir)) {
    result.errors.push('.claude/marr/ directory not found');
    result.errors.push('This does not appear to be a MARR-initialized project');
    result.errors.push('Run: marr init --project');
    return;
  }

  if (!fileOps.exists(marrProjectClaudeMdPath)) {
    result.errors.push('.claude/marr/MARR-PROJECT-CLAUDE.md not found');
    result.errors.push('Run: marr init --project --force');
    return;
  }

  logger.success('.claude/marr/MARR-PROJECT-CLAUDE.md exists');
}

function validateMarrProjectClaudeMd(result: ValidationResult): void {
  const marrProjectClaudeMdPath = join(process.cwd(), '.claude', 'marr', 'MARR-PROJECT-CLAUDE.md');
  const content = fileOps.readFile(marrProjectClaudeMdPath);

  // Check for required sections
  if (!content.includes('Project Overview')) {
    result.warnings.push('MARR-PROJECT-CLAUDE.md missing "Project Overview" section');
  }

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

  // Check for recommended standard files
  const recommendedStandards = [
    'prj-git-workflow-standard.md',
    'prj-testing-standard.md',
    'prj-mcp-usage-standard.md',
    'prj-documentation-standard.md',
  ];

  for (const standard of recommendedStandards) {
    const standardPath = join(standardsDir, standard);
    if (!fileOps.exists(standardPath)) {
      result.warnings.push(`Missing recommended standard: standards/${standard}`);
    }
  }

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

function displayResults(result: ValidationResult, options: ValidateOptions): void {
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

  // Summary
  if (result.errors.length === 0 && result.warnings.length === 0) {
    logger.blank();
    logger.success('Validation passed! Configuration is valid.');
  } else {
    logger.section('Summary');
    logger.log(`Errors: ${result.errors.length}`);
    logger.log(`Warnings: ${result.warnings.length}`);

    if (options.strict && result.warnings.length > 0) {
      logger.blank();
      logger.error('Validation failed in strict mode (warnings treated as errors)');
    }
  }

  logger.blank();
}
