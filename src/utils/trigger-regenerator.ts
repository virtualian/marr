/**
 * Trigger Table Regenerator
 *
 * Regenerates the Standards section in MARR-PROJECT-CLAUDE.md
 * from the frontmatter in standard files.
 *
 * Used by `marr sync` after copying standards to target projects.
 */

import { join, basename } from 'path';
import { statSync } from 'fs';
import matter from 'gray-matter';
import * as fileOps from './file-ops.js';
import { StandardFrontmatterSchema, StandardFrontmatter, formatTrigger } from '../schema/standard.js';

const STANDARDS_DIR = join('.claude', 'marr', 'standards');
const CONFIG_FILE = join('.claude', 'marr', 'MARR-PROJECT-CLAUDE.md');
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
 * Verify file is owned by current user (security check)
 */
function isOwnedByCurrentUser(filePath: string): boolean {
  try {
    const stat = statSync(filePath);
    const currentUid = process.getuid?.();
    if (currentUid === undefined) {
      return true;
    }
    return stat.uid === currentUid;
  } catch {
    return false;
  }
}

/**
 * Parse a standard file and validate its frontmatter
 */
function parseStandardFile(filePath: string): ParsedStandard | ValidationError {
  const content = fileOps.readFile(filePath);
  const filename = basename(filePath);

  let parsed;
  try {
    parsed = matter(content);
  } catch (err) {
    return {
      path: filePath,
      errors: [`Failed to parse YAML frontmatter: ${err instanceof Error ? err.message : String(err)}`],
    };
  }

  if (parsed.data.marr !== 'standard') {
    return {
      path: filePath,
      errors: ['Missing or invalid "marr: standard" discriminator'],
    };
  }

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
 * Generate standard entry with triggers as bullet list
 */
function generateStandardEntry(standard: ParsedStandard): string {
  const triggers = standard.frontmatter.triggers.map(formatTrigger);
  const bulletList = triggers.map((t) => `- ${t}`).join('\n');

  return `### \`${standard.filename}\`
Read this standard when:
${bulletList}`;
}

export interface RegenerateResult {
  success: boolean;
  standardsCount: number;
  skipped: { path: string; reason: string }[];
  error?: string;
}

/**
 * Regenerate the trigger table in a project's MARR-PROJECT-CLAUDE.md
 *
 * @param projectPath - Path to the project root
 * @returns Result object with success status and details
 */
export function regenerateTriggerTable(projectPath: string): RegenerateResult {
  const standardsDir = join(projectPath, STANDARDS_DIR);
  const configPath = join(projectPath, CONFIG_FILE);

  // Check standards directory exists
  if (!fileOps.exists(standardsDir)) {
    return {
      success: false,
      standardsCount: 0,
      skipped: [],
      error: `Standards directory not found: ${STANDARDS_DIR}/`,
    };
  }

  // Check config file exists
  if (!fileOps.exists(configPath)) {
    return {
      success: false,
      standardsCount: 0,
      skipped: [],
      error: `Config file not found: ${CONFIG_FILE}`,
    };
  }

  const files = findStandardFiles(standardsDir);

  if (files.length === 0) {
    return {
      success: true,
      standardsCount: 0,
      skipped: [],
    };
  }

  // Parse and verify ownership of each standard
  const validStandards: ParsedStandard[] = [];
  const skipped: { path: string; reason: string }[] = [];

  for (const file of files) {
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

  if (validStandards.length === 0) {
    return {
      success: false,
      standardsCount: 0,
      skipped,
      error: 'No valid standards to process',
    };
  }

  // Sort standards alphabetically for consistent output
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
      if (lines[i].trim() === STANDARDS_SECTION_END) {
        sectionEndIndex = i + 1;
        break;
      }
    }
  }

  if (sectionStartIndex === -1) {
    return {
      success: false,
      standardsCount: validStandards.length,
      skipped,
      error: 'Could not find Standards section in config file',
    };
  }

  if (sectionEndIndex === -1) {
    return {
      success: false,
      standardsCount: validStandards.length,
      skipped,
      error: 'Could not find end of Standards section (---)',
    };
  }

  // Build new content
  const newLines = [
    ...lines.slice(0, sectionStartIndex),
    ...newSection.split('\n'),
    ...lines.slice(sectionEndIndex),
  ];
  const newContent = newLines.join('\n');

  // Write updated config
  fileOps.writeFile(configPath, newContent);

  return {
    success: true,
    standardsCount: validStandards.length,
    skipped,
  };
}
