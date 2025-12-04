/**
 * Standard command - Manage MARR standards with structured frontmatter
 *
 * Subcommands:
 * - validate: Validate frontmatter in standard files
 * - list: List all standards with their triggers
 * - create: Scaffold a new standard with valid frontmatter
 */

import { Command } from 'commander';
import { join, basename } from 'path';
import { statSync } from 'fs';
import matter from 'gray-matter';
import * as logger from '../utils/logger.js';
import * as fileOps from '../utils/file-ops.js';
import {
  StandardFrontmatterSchema,
  StandardFrontmatter,
  formatTrigger,
} from '../schema/standard.js';

// Default paths relative to project root
const STANDARDS_DIR = join('.claude', 'marr', 'standards');
const CONFIG_FILE = join('.claude', 'marr', 'MARR-PROJECT-CLAUDE.md');

// Section markers for sync
const STANDARDS_SECTION_START = '## Standards';
const STANDARDS_SECTION_END = '---';

interface ParsedStandard {
  path: string;
  filename: string;
  frontmatter: StandardFrontmatter;
  content: string;
}

interface ValidationError {
  path: string;
  errors: string[];
}

/**
 * Parse a standard file and validate its frontmatter
 */
function parseStandardFile(filePath: string): ParsedStandard | ValidationError {
  const content = fileOps.readFile(filePath);
  const filename = basename(filePath);

  // Parse frontmatter
  let parsed;
  try {
    parsed = matter(content);
  } catch (err) {
    return {
      path: filePath,
      errors: [`Failed to parse YAML frontmatter: ${err instanceof Error ? err.message : String(err)}`],
    };
  }

  // Skip files without marr: standard discriminator
  if (parsed.data.marr !== 'standard') {
    return {
      path: filePath,
      errors: ['Missing or invalid "marr: standard" discriminator'],
    };
  }

  // Validate against schema
  const result = StandardFrontmatterSchema.safeParse(parsed.data);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      const path = issue.path.join('.');
      return path ? `${path}: ${issue.message}` : issue.message;
    });
    return { path: filePath, errors };
  }

  return {
    path: filePath,
    filename,
    frontmatter: result.data,
    content: parsed.content,
  };
}

/**
 * Check if parse result is an error
 */
function isValidationError(result: ParsedStandard | ValidationError): result is ValidationError {
  return 'errors' in result;
}

/**
 * Find all standard files in a directory
 */
function findStandardFiles(dir: string): string[] {
  if (!fileOps.exists(dir)) {
    return [];
  }

  const files = fileOps.listFiles(dir, false);
  return files.filter((f) => f.endsWith('.md') && basename(f) !== 'README.md');
}

/**
 * Validate subcommand - validate frontmatter in standard files
 */
function handleValidate(pathArg: string | undefined, options: { all?: boolean }): void {
  const standardsDir = join(process.cwd(), STANDARDS_DIR);

  let filesToValidate: string[] = [];

  if (options.all) {
    // Validate all standards in directory
    filesToValidate = findStandardFiles(standardsDir);
    if (filesToValidate.length === 0) {
      logger.warning(`No standard files found in ${STANDARDS_DIR}/`);
      process.exit(1);
    }
    logger.section(`Validating ${filesToValidate.length} standard(s)`);
  } else if (pathArg) {
    // Validate specific file
    const fullPath = pathArg.startsWith('/') ? pathArg : join(process.cwd(), pathArg);
    if (!fileOps.exists(fullPath)) {
      logger.error(`File not found: ${pathArg}`);
      process.exit(1);
    }
    filesToValidate = [fullPath];
    logger.section(`Validating ${basename(fullPath)}`);
  } else {
    // No path and no --all flag
    logger.error('Please specify a file path or use --all to validate all standards');
    process.exit(1);
  }

  // Validate each file
  const errors: ValidationError[] = [];
  const valid: ParsedStandard[] = [];

  for (const file of filesToValidate) {
    const result = parseStandardFile(file);
    if (isValidationError(result)) {
      errors.push(result);
    } else {
      valid.push(result);
    }
  }

  // Display results
  for (const v of valid) {
    logger.success(`${v.filename}: valid`);
  }

  for (const e of errors) {
    logger.error(`${basename(e.path)}:`);
    for (const err of e.errors) {
      logger.log(`  - ${err}`);
    }
  }

  // Summary
  logger.blank();
  if (errors.length === 0) {
    logger.success(`All ${valid.length} standard(s) valid`);
  } else {
    logger.error(`${errors.length} of ${filesToValidate.length} standard(s) invalid`);
    process.exit(1);
  }
}

/**
 * List subcommand - list all standards with their triggers
 */
function handleList(): void {
  const standardsDir = join(process.cwd(), STANDARDS_DIR);

  if (!fileOps.exists(standardsDir)) {
    logger.warning(`Standards directory not found: ${STANDARDS_DIR}/`);
    logger.log('Run: marr init --project');
    process.exit(1);
  }

  const files = findStandardFiles(standardsDir);

  if (files.length === 0) {
    logger.warning('No standard files found');
    process.exit(0);
  }

  logger.section('MARR Standards');

  for (const file of files) {
    const result = parseStandardFile(file);

    if (isValidationError(result)) {
      logger.warning(`${basename(file)} (invalid frontmatter)`);
      continue;
    }

    const { frontmatter } = result;
    logger.log(`\n${frontmatter.title}`);
    logger.log(`  File: ${basename(file)}`);
    logger.log(`  Scope: ${frontmatter.scope}`);
    logger.log('  Triggers:');
    for (const trigger of frontmatter.triggers) {
      logger.log(`    - ${formatTrigger(trigger)}`);
    }
  }

  logger.blank();
}

/**
 * Create subcommand - scaffold a new standard with valid frontmatter
 */
function handleCreate(name: string): void {
  const standardsDir = join(process.cwd(), STANDARDS_DIR);

  if (!fileOps.exists(standardsDir)) {
    logger.error(`Standards directory not found: ${STANDARDS_DIR}/`);
    logger.log('Run: marr init --project');
    process.exit(1);
  }

  // Normalize filename
  let filename = name;
  if (!filename.startsWith('prj-')) {
    filename = `prj-${filename}`;
  }
  if (!filename.endsWith('.md')) {
    filename = `${filename}.md`;
  }

  const filePath = join(standardsDir, filename);

  if (fileOps.exists(filePath)) {
    logger.error(`File already exists: ${filename}`);
    process.exit(1);
  }

  // Create title from filename
  const title = filename
    .replace(/^prj-/, '')
    .replace(/-standard\.md$/, '')
    .replace(/\.md$/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') + ' Standard';

  const template = `---
marr: standard
version: 1
title: ${title}
scope: TODO - describe when this standard applies

triggers:
  - WHEN [describe a situation where this standard applies]
  - WHEN [describe another triggering situation]
---

# ${title}

> **AI Agent Instructions**: [Brief instruction for agents]
>
> **Scope**: [When this applies]
>
> **Rationale**: [Why this standard exists]

---

## Triggers

**You MUST follow this standard when:**
- [Trigger condition 1]
- [Trigger condition 2]

---

## Core Rules (NEVER VIOLATE)

1. **[Rule name]** because [reason]
2. **[Rule name]** because [reason]

---

## [Section Name]

[Content]

---

## Anti-Patterns (FORBIDDEN)

- **[Anti-pattern name]** — [Why it's forbidden]

---

**[Closing statement about the standard's purpose]**
`;

  fileOps.writeFile(filePath, template);
  logger.success(`Created: ${STANDARDS_DIR}/${filename}`);
  logger.log('\nNext steps:');
  logger.log('  1. Edit the file to add your standard content');
  logger.log('  2. Update the frontmatter triggers');
  logger.log('  3. Run: marr standard validate ' + filename);
}

/**
 * Verify file is owned by current user (security check)
 * Returns true if owned by current user, false otherwise
 */
function isOwnedByCurrentUser(filePath: string): boolean {
  try {
    const stat = statSync(filePath);
    const currentUid = process.getuid?.();
    // On Windows, getuid returns undefined - skip ownership check
    if (currentUid === undefined) {
      return true;
    }
    return stat.uid === currentUid;
  } catch {
    return false;
  }
}

/**
 * Generate standard entry with triggers as bullet list
 */
function generateStandardEntry(standard: ParsedStandard): string {
  const triggers = standard.frontmatter.triggers.map(formatTrigger);
  const bulletList = triggers.map((t) => `- ${t}`).join('\n');

  return `### \`${standard.filename}\`
Read this standard when:
${bulletList}`;
}

/**
 * Sync subcommand - generate standards section from frontmatter
 */
function handleSync(options: { dryRun?: boolean }): void {
  const standardsDir = join(process.cwd(), STANDARDS_DIR);
  const configPath = join(process.cwd(), CONFIG_FILE);

  // Check standards directory exists
  if (!fileOps.exists(standardsDir)) {
    logger.error(`Standards directory not found: ${STANDARDS_DIR}/`);
    logger.log('Run: marr init --project');
    process.exit(1);
  }

  // Check config file exists
  if (!fileOps.exists(configPath)) {
    logger.error(`Config file not found: ${CONFIG_FILE}`);
    logger.log('Run: marr init --project');
    process.exit(1);
  }

  const files = findStandardFiles(standardsDir);

  if (files.length === 0) {
    logger.warning('No standard files found');
    process.exit(0);
  }

  logger.section('Syncing standards section');

  // Parse and verify ownership of each standard
  const validStandards: ParsedStandard[] = [];
  const skipped: { path: string; reason: string }[] = [];

  for (const file of files) {
    // Security: verify file ownership
    if (!isOwnedByCurrentUser(file)) {
      skipped.push({ path: file, reason: 'not owned by current user' });
      continue;
    }

    const result = parseStandardFile(file);

    if (isValidationError(result)) {
      skipped.push({ path: file, reason: 'invalid frontmatter' });
      continue;
    }

    validStandards.push(result);
  }

  // Report skipped files
  if (skipped.length > 0) {
    logger.warning(`Skipped ${skipped.length} file(s):`);
    for (const s of skipped) {
      logger.log(`  - ${basename(s.path)}: ${s.reason}`);
    }
    logger.blank();
  }

  if (validStandards.length === 0) {
    logger.error('No valid standards to sync');
    process.exit(1);
  }

  // Sort standards alphabetically by filename for consistent output
  validStandards.sort((a, b) => a.filename.localeCompare(b.filename));

  // Generate standard entries
  const entries = validStandards.map(generateStandardEntry);
  const newSection = `${STANDARDS_SECTION_START}

\`standards/\` contains standard prompt files that must be followed when working on a related activity.

**IMPORTANT: Conditional Reading Protocol**

1. **DO NOT read standards proactively** — Only read a standard when its trigger condition matches your current task
2. **Evaluate triggers against your current task** — Before each task, scan the trigger list below and identify which (if any) apply
3. **Read triggered standards before proceeding** — When a trigger matches, read the full standard file immediately
4. **Multiple triggers = multiple reads** — If more than one trigger matches, read all corresponding standards

${entries.join('\n\n')}

${STANDARDS_SECTION_END}`;

  // Read config file
  const configContent = fileOps.readFile(configPath);

  // Find and replace existing standards section
  const lines = configContent.split('\n');
  let sectionStartIndex = -1;
  let sectionEndIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === STANDARDS_SECTION_START) {
      sectionStartIndex = i;
    } else if (sectionStartIndex !== -1 && sectionEndIndex === -1) {
      // Look for the closing --- that ends this section
      if (lines[i].trim() === STANDARDS_SECTION_END) {
        sectionEndIndex = i + 1; // Include the ---
        break;
      }
    }
  }

  if (sectionStartIndex === -1) {
    logger.error('Could not find Standards section in config file');
    logger.log('Expected section header: ' + STANDARDS_SECTION_START);
    process.exit(1);
  }

  // Handle missing end marker
  if (sectionEndIndex === -1) {
    logger.error('Could not find end of Standards section (---)');
    process.exit(1);
  }

  // Build new content
  const newLines = [
    ...lines.slice(0, sectionStartIndex),
    ...newSection.split('\n'),
    ...lines.slice(sectionEndIndex),
  ];
  const newContent = newLines.join('\n');

  // Dry run: show diff
  if (options.dryRun) {
    logger.log('Dry run - would update standards section:\n');
    logger.log(newSection);
    logger.blank();
    logger.log(`${validStandards.length} standard(s) would be synced`);
    return;
  }

  // Write updated config
  fileOps.writeFile(configPath, newContent);

  logger.success(`Updated ${CONFIG_FILE}`);
  logger.log(`Synced ${validStandards.length} standard(s)`);
}

/**
 * Register the standard command with subcommands
 */
export function standardCommand(program: Command): void {
  const cmd = program
    .command('standard')
    .description('Manage MARR standards with structured frontmatter')
    .addHelpText('after', `
Examples:
  $ marr standard validate prj-testing-standard.md
  $ marr standard validate --all
  $ marr standard list
  $ marr standard create my-new-standard
  $ marr standard sync --dry-run`);

  // validate subcommand
  cmd
    .command('validate [path]')
    .description('Validate frontmatter in standard file(s)')
    .option('--all', 'Validate all standards in .claude/marr/standards/')
    .addHelpText('after', `
Examples:
  $ marr standard validate prj-testing-standard.md
  $ marr standard validate .claude/marr/standards/prj-workflow-standard.md
  $ marr standard validate --all

Exit codes:
  0  All standards valid
  1  One or more standards invalid`)
    .action(handleValidate);

  // list subcommand
  cmd
    .command('list')
    .description('List all standards with their triggers')
    .addHelpText('after', `
Example:
  $ marr standard list`)
    .action(handleList);

  // create subcommand
  cmd
    .command('create <name>')
    .description('Create a new standard with valid frontmatter')
    .addHelpText('after', `
Examples:
  $ marr standard create my-new-standard
  $ marr standard create prj-custom-standard

The 'prj-' prefix and '.md' extension are added automatically if missing.`)
    .action(handleCreate);

  // sync subcommand
  cmd
    .command('sync')
    .description('Generate trigger table from standard frontmatter')
    .option('--dry-run', 'Preview changes without writing')
    .addHelpText('after', `
Examples:
  $ marr standard sync           # Update trigger table
  $ marr standard sync --dry-run # Preview changes

Updates the trigger table in MARR-PROJECT-CLAUDE.md from frontmatter.
Files not owned by current user are skipped for security.`)
    .action(handleSync);
}
