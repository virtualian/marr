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
    .option('--strict', 'Fail on warnings')
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

  // Validate CLAUDE.md structure
  validateClaudeMd(result);

  // Validate prompts directory
  validatePromptsDirectory(result);

  // Validate prompt file naming
  validatePromptNaming(result);

  // Validate prompt references
  validatePromptReferences(result);

  return result;
}

function validateMarrProject(result: ValidationResult): void {
  const claudeMdPath = join(process.cwd(), 'CLAUDE.md');

  if (!fileOps.exists(claudeMdPath)) {
    result.errors.push('CLAUDE.md not found in current directory');
    result.errors.push('This does not appear to be a MARR-initialized project');
    return;
  }

  logger.success('CLAUDE.md exists');
}

function validateClaudeMd(result: ValidationResult): void {
  const claudeMdPath = join(process.cwd(), 'CLAUDE.md');
  const content = fileOps.readFile(claudeMdPath);

  // Check for required sections
  const requiredSections = [
    'Project Overview',
    'Project-level configuration',
  ];

  for (const section of requiredSections) {
    if (!content.includes(section)) {
      result.warnings.push(`CLAUDE.md missing recommended section: "${section}"`);
    }
  }

  // Check for Layer 2 marker
  if (!content.includes('Layer 2 of 2')) {
    result.warnings.push('CLAUDE.md missing "Layer 2 of 2" configuration marker');
  }

  // Check for project name
  const lines = content.split('\n');
  const firstHeading = lines.find(line => line.startsWith('# '));
  if (!firstHeading) {
    result.errors.push('CLAUDE.md missing project name heading (# Project Name)');
  }

  logger.success('CLAUDE.md structure validated');
}

function validatePromptsDirectory(result: ValidationResult): void {
  const promptsDir = join(process.cwd(), 'prompts');

  if (!fileOps.exists(promptsDir)) {
    result.errors.push('prompts/ directory not found');
    return;
  }

  if (!fileOps.isDirectory(promptsDir)) {
    result.errors.push('prompts/ exists but is not a directory');
    return;
  }

  // Check for required prompt files
  const requiredPrompts = [
    'prj-git-workflow-standard.md',
    'prj-testing-standard.md',
    'prj-mcp-usage-standard.md',
    'prj-documentation-standard.md',
  ];

  for (const prompt of requiredPrompts) {
    const promptPath = join(promptsDir, prompt);
    if (!fileOps.exists(promptPath)) {
      result.warnings.push(`Missing recommended prompt: ${prompt}`);
    }
  }

  logger.success('prompts/ directory validated');
}

function validatePromptNaming(result: ValidationResult): void {
  const promptsDir = join(process.cwd(), 'prompts');

  if (!fileOps.exists(promptsDir)) {
    return; // Already reported error
  }

  const files = fileOps.listFiles(promptsDir, false);

  for (const file of files) {
    const filename = file.substring(file.lastIndexOf('/') + 1);

    // Skip non-markdown files
    if (!filename.endsWith('.md')) {
      continue;
    }

    // Check naming convention
    if (!filename.startsWith('prj-') && !filename.startsWith('user-')) {
      result.warnings.push(`Prompt file doesn't follow naming convention: ${filename}`);
      result.warnings.push('  Expected: prj-* or user-*');
    }

    // Warn about user-level prompts in project prompts/
    if (filename.startsWith('user-')) {
      result.warnings.push(`User-level prompt found in project prompts/: ${filename}`);
      result.warnings.push('  User-level prompts should be in ~/.marr/prompts/');
    }
  }

  logger.success('Prompt file naming validated');
}

function validatePromptReferences(result: ValidationResult): void {
  const claudeMdPath = join(process.cwd(), 'CLAUDE.md');
  const content = fileOps.readFile(claudeMdPath);

  // Find @prompts/ references
  const promptRefs = content.match(/@prompts\/[\w-]+\.md/g) || [];

  if (promptRefs.length === 0) {
    result.warnings.push('No prompt references found in CLAUDE.md');
    result.warnings.push('  Consider using @prompts/prj-*.md references');
  }

  // Validate each reference
  for (const ref of promptRefs) {
    const filename = ref.substring('@prompts/'.length);
    const promptPath = join(process.cwd(), 'prompts', filename);

    if (!fileOps.exists(promptPath)) {
      result.errors.push(`Broken prompt reference: ${ref}`);
      result.errors.push(`  File not found: prompts/${filename}`);
    }
  }

  if (promptRefs.length > 0) {
    logger.success('Prompt references validated');
  }
}

function displayResults(result: ValidationResult, options: ValidateOptions): void {
  logger.blank();

  // Display errors
  if (result.errors.length > 0) {
    logger.section('Errors');
    for (const error of result.errors) {
      logger.error(error);
    }
    logger.blank();
  }

  // Display warnings
  if (result.warnings.length > 0) {
    logger.section('Warnings');
    for (const warning of result.warnings) {
      logger.warning(warning);
    }
    logger.blank();
  }

  // Summary
  if (result.errors.length === 0 && result.warnings.length === 0) {
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
