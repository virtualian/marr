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
 * Get path to bundled templates directory (in npm package)
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
 * Creates CLAUDE.md with personal preferences and adds import to ~/.claude/CLAUDE.md
 *
 * Note: Templates stay in the npm package - they're read directly when creating projects.
 * Only personal configuration lives in ~/.claude/marr/
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

  logger.info('Creating ~/.claude/marr/ configuration...');

  // Create minimal directory structure
  fileOps.ensureDir(marrRoot);

  // Create MARR's CLAUDE.md with personal preferences
  createMarrClaudeMd();

  // Add import to user's ~/.claude/CLAUDE.md
  addMarrImport();

  logger.success('Created: ~/.claude/marr/CLAUDE.md');
}

/**
 * Create MARR's user-level CLAUDE.md at ~/.claude/marr/CLAUDE.md
 * Contains personal preferences, principles, and core habits
 * Standards (git workflow, testing, etc.) live at project level
 */
function createMarrClaudeMd(): void {
  const marrClaudeMdPath = fileOps.getMarrClaudeMdPath();

  const content = `# MARR User Configuration

> This file is managed by MARR (Making Agents Really Reliable).
> Claude Code loads this via import from ~/.claude/CLAUDE.md

## Personal Preferences

### Communication Style

- Keep responses concise unless detail is explicitly requested
- Answer questions directly without elaboration unless asked
- Don't flatter, praise, or use a sycophantic tone
- When you have strong evidence for an opinion, stand your ground
- Be constructively critical - never assume the user is correct

### Work Habits

- Always prefer editing existing files over creating new ones
- Only create files when absolutely necessary
- Check existing patterns before adding new ones

### Approval Requirements

**ALWAYS get explicit user approval before:**
- ANY git commits
- ANY git pushes
- ANY PR creation or updates

Show exactly what will be committed/pushed before taking action.
Never assume approval - wait for explicit confirmation.

## High-Level Principles

### Simplicity Over Cleverness

- Don't over-engineer - solve the problem at hand
- Avoid premature abstraction
- Three similar lines of code is better than a premature helper function
- Only add complexity when clearly necessary

### Prompt File Principles

When creating or modifying prompt files:
- Write directives that specify **WHAT** and **WHY**, never **HOW**
- Never include code, commands, or configuration examples
- Implementation details belong in project documentation, not prompts
- Never modify prompt files without explicit approval

### Attribution Restrictions

- Never add AI attribution comments to any file
- No "Generated with Claude" or "Co-Authored-By" comments
- Code and documentation stand on merit, not origin

## Core Habits

### Before Modifying Code

- Read and understand existing code first
- Review existing patterns and conventions
- Check for project-specific configuration

### Security (Always)

- Never commit secrets, keys, or credentials
- Use environment variables for sensitive configuration
- Validate inputs at system boundaries

### Testing (Always)

- Run tests before committing changes
- Follow existing test patterns in the project
- Never assume specific test frameworks - check first

### Documentation Organization

- Technical docs go in \`docs/\`
- Plans go in \`plans/\`
- Prompts go in \`prompts/\`
- Never place docs in project root unless functionally required

## Notes

Standards (git workflow, testing, MCP usage, documentation) live at the **project level**
in each project's \`prompts/\` directory. This keeps projects self-contained and allows
per-project customization.

Run \`marr init --project\` to set up a new project with standard prompts.
`;

  fileOps.writeFile(marrClaudeMdPath, content);
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
