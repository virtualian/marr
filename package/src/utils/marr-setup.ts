/**
 * MARR setup utility
 * Handles first-run initialization of ~/.claude/marr/ infrastructure
 * and integration with Claude Code via import mechanism.
 */

import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fileOps from './file-ops.js';
import * as logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Import line that MARR adds to ~/.claude/CLAUDE.md */
const MARR_IMPORT_LINE = '@~/.claude/marr/CLAUDE.md';

/** Comment marker to identify MARR's import */
const MARR_IMPORT_COMMENT = '<!-- MARR: Making Agents Really Reliable -->';

/** Full import block including comment for easy identification */
const MARR_IMPORT_BLOCK = `${MARR_IMPORT_COMMENT}\n${MARR_IMPORT_LINE}\n`;

/**
 * Get path to bundled templates directory
 */
export function getTemplatesDir(): string {
  // In built package: dist/utils/marr-setup.js -> templates/
  return join(__dirname, '../../templates');
}

/**
 * Check if MARR is already set up at ~/.claude/marr/
 */
export function isMarrSetup(): boolean {
  const marrRoot = fileOps.getMarrRoot();
  return fileOps.exists(marrRoot) && fileOps.isDirectory(marrRoot);
}

/**
 * Check if Claude Code import is already present in ~/.claude/CLAUDE.md
 */
export function hasMarrImport(): boolean {
  const claudeMdPath = fileOps.getUserClaudeMdPath();

  if (!fileOps.exists(claudeMdPath)) {
    return false;
  }

  try {
    const content = fileOps.readFile(claudeMdPath);
    return content.includes(MARR_IMPORT_LINE);
  } catch {
    return false;
  }
}

/**
 * Add MARR import line to ~/.claude/CLAUDE.md
 * Creates the file if it doesn't exist
 */
export function addMarrImport(): void {
  const claudeRoot = fileOps.getClaudeRoot();
  const claudeMdPath = fileOps.getUserClaudeMdPath();

  // Ensure ~/.claude/ exists
  fileOps.ensureDir(claudeRoot);

  if (!fileOps.exists(claudeMdPath)) {
    // Create new CLAUDE.md with just the import
    logger.info('Creating ~/.claude/CLAUDE.md with MARR import...');
    fileOps.writeFile(claudeMdPath, `${MARR_IMPORT_BLOCK}\n# User CLAUDE.md\n\nAdd your personal Claude Code configuration below.\n`);
    return;
  }

  // File exists - check if import already present
  if (hasMarrImport()) {
    logger.debug('MARR import already present in ~/.claude/CLAUDE.md');
    return;
  }

  // Prepend import to existing file
  logger.info('Adding MARR import to ~/.claude/CLAUDE.md...');
  const existingContent = fileOps.readFile(claudeMdPath);
  const newContent = `${MARR_IMPORT_BLOCK}\n${existingContent}`;
  fileOps.writeFile(claudeMdPath, newContent);
}

/**
 * Remove MARR import line from ~/.claude/CLAUDE.md
 */
export function removeMarrImport(): boolean {
  const claudeMdPath = fileOps.getUserClaudeMdPath();

  if (!fileOps.exists(claudeMdPath)) {
    return false;
  }

  const content = fileOps.readFile(claudeMdPath);

  if (!content.includes(MARR_IMPORT_LINE)) {
    return false;
  }

  // Remove the import block (comment + import line + trailing newline)
  let newContent = content.replace(MARR_IMPORT_BLOCK + '\n', '');

  // Fallback: remove just the import line if block pattern doesn't match
  if (newContent === content) {
    newContent = content.replace(MARR_IMPORT_LINE + '\n', '');
  }

  // Fallback: remove comment line separately if still present
  if (newContent.includes(MARR_IMPORT_COMMENT)) {
    newContent = newContent.replace(MARR_IMPORT_COMMENT + '\n', '');
  }

  fileOps.writeFile(claudeMdPath, newContent);
  return true;
}

/**
 * Initialize ~/.claude/marr/ infrastructure
 * Creates directory structure, copies templates, and adds import to CLAUDE.md
 */
export function setupMarr(): void {
  const marrRoot = fileOps.getMarrRoot();

  if (isMarrSetup()) {
    logger.debug('MARR already set up at ~/.claude/marr/');
    // Still ensure import is present
    if (!hasMarrImport()) {
      addMarrImport();
    }
    return;
  }

  logger.section('First-Run MARR Setup');
  logger.info('Creating ~/.claude/marr/ infrastructure...');

  // Create directory structure
  const dirs = [
    marrRoot,
    join(marrRoot, 'prompts'),
    join(marrRoot, 'templates'),
    join(marrRoot, 'templates/claude-md'),
    join(marrRoot, 'templates/prompts'),
    join(marrRoot, 'helper-scripts'),
  ];

  for (const dir of dirs) {
    fileOps.ensureDir(dir);
  }

  // Copy templates from package to ~/.claude/marr/
  const templatesSource = getTemplatesDir();
  const templatesDest = join(marrRoot, 'templates');

  copyTemplates(templatesSource, templatesDest);

  // Copy user-level prompts to ~/.claude/marr/prompts/
  copyUserPrompts();

  // Create MARR's CLAUDE.md
  createMarrClaudeMd();

  // Add import to user's ~/.claude/CLAUDE.md
  addMarrImport();

  logger.success('MARR infrastructure created at ~/.claude/marr/');
  logger.info('Claude Code will now load MARR configuration via import.');
  logger.blank();
}

/**
 * Copy user-level prompt templates to ~/.claude/marr/prompts/
 */
function copyUserPrompts(): void {
  const templatesDir = getTemplatesDir();
  const userPromptsSource = join(templatesDir, 'user-prompts');
  const userPromptsDest = join(fileOps.getMarrRoot(), 'prompts');

  if (!fileOps.exists(userPromptsSource)) {
    logger.debug('No user prompts to copy');
    return;
  }

  const files = fileOps.listFiles(userPromptsSource, false);

  for (const srcFile of files) {
    const filename = srcFile.split('/').pop() || '';
    const destFile = join(userPromptsDest, filename);

    try {
      fileOps.copyFile(srcFile, destFile);
    } catch (err) {
      logger.warning(`Failed to copy user prompt: ${filename}`);
    }
  }
}

/**
 * Create MARR's user-level CLAUDE.md at ~/.claude/marr/CLAUDE.md
 */
function createMarrClaudeMd(): void {
  const marrClaudeMdPath = fileOps.getMarrClaudeMdPath();

  // Check for template
  const templatePath = join(getTemplatesDir(), 'user-claude-md', 'CLAUDE.md');

  if (fileOps.exists(templatePath)) {
    fileOps.copyFile(templatePath, marrClaudeMdPath);
    return;
  }

  // Fallback: create minimal CLAUDE.md
  const content = `# MARR User Configuration

> This file is managed by MARR (Making Agents Really Reliable).
> Claude Code loads this via import from ~/.claude/CLAUDE.md

## User-Level Standards

Import user-level prompts:

@~/.claude/marr/prompts/user-git-workflow-standard.md
@~/.claude/marr/prompts/user-testing-standard.md
@~/.claude/marr/prompts/user-mcp-usage-standard.md

## Personal Preferences

Add your personal Claude Code preferences below.
`;

  fileOps.writeFile(marrClaudeMdPath, content);
}

/**
 * Copy templates recursively
 */
function copyTemplates(src: string, dest: string): void {
  if (!fileOps.exists(src)) {
    logger.warning(`Templates source not found: ${src}`);
    return;
  }

  const files = fileOps.listFiles(src, true);

  for (const srcFile of files) {
    const relativePath = srcFile.substring(src.length + 1);
    const destFile = join(dest, relativePath);

    try {
      fileOps.copyFile(srcFile, destFile);
    } catch (err) {
      logger.warning(`Failed to copy template: ${relativePath}`);
    }
  }
}

/**
 * Ensure MARR is set up (setup if needed)
 */
export function ensureMarrSetup(): void {
  if (!isMarrSetup()) {
    setupMarr();
  } else if (!hasMarrImport()) {
    // MARR directory exists but import missing - add it
    addMarrImport();
  }
}

/**
 * Get the import line constant (for use in clean command)
 */
export function getMarrImportLine(): string {
  return MARR_IMPORT_LINE;
}
