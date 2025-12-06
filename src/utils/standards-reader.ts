/**
 * Standards reader for MARR conflict detection
 *
 * Dynamically reads and parses MARR standards to extract directives,
 * rules, and anti-patterns for conflict detection.
 */

import { join, basename } from 'path';
import matter from 'gray-matter';
import * as fileOps from './file-ops.js';
import { StandardFrontmatterSchema, type StandardFrontmatter } from '../schema/standard.js';

/** A directive extracted from a standard */
export interface Directive {
  /** The directive text (e.g., "Always squash merge") */
  text: string;
  /** Type of directive */
  type: 'rule' | 'anti-pattern' | 'requirement';
  /** Source standard file */
  source: string;
  /** Standard title for display */
  standardTitle: string;
  /** Keywords extracted from the directive for matching */
  keywords: string[];
}

/** Parsed standard with extracted directives */
export interface ParsedStandard {
  path: string;
  filename: string;
  frontmatter: StandardFrontmatter;
  content: string;
  directives: Directive[];
}

/** Result of parsing - either success or error */
export type ParseResult =
  | { success: true; standard: ParsedStandard }
  | { success: false; path: string; error: string };

/**
 * Extract keywords from directive text for fuzzy matching
 */
function extractKeywords(text: string): string[] {
  // Remove common words and extract meaningful keywords
  const stopWords = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
    'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by',
    'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above',
    'below', 'between', 'under', 'again', 'further', 'then', 'once',
    'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few',
    'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
    'own', 'same', 'so', 'than', 'too', 'very', 'just', 'and', 'but',
    'if', 'or', 'because', 'until', 'while', 'although', 'that', 'this',
    'these', 'those', 'it', 'its', 'they', 'them', 'their', 'what', 'which',
    'who', 'whom', 'any', 'both', 'every',
  ]);

  // Extract words, normalize, and filter
  const words = text.toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  // Return unique keywords
  return [...new Set(words)];
}

/**
 * Extract directives from markdown content
 * Looks for Core Rules, Anti-Patterns, and Requirements sections
 */
function extractDirectives(content: string, source: string, title: string): Directive[] {
  const directives: Directive[] = [];
  const lines = content.split('\n');

  let currentSection: 'rule' | 'anti-pattern' | 'requirement' | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect section headers
    if (/^#+\s*Core\s+Rules/i.test(line)) {
      currentSection = 'rule';
      continue;
    }
    if (/^#+\s*Anti[- ]?Patterns/i.test(line)) {
      currentSection = 'anti-pattern';
      continue;
    }
    if (/^#+\s*(Requirements?|Must\s+Have)/i.test(line)) {
      currentSection = 'requirement';
      continue;
    }
    // Reset section on new heading
    if (/^#+\s/.test(line) && !line.includes('Rules') && !line.includes('Anti')) {
      currentSection = null;
      continue;
    }

    // Extract directives from current section
    if (currentSection) {
      // Match numbered rules: "1. **Rule name** because reason"
      const numberedMatch = line.match(/^\d+\.\s+\*\*([^*]+)\*\*\s*(.*)$/);
      if (numberedMatch) {
        const ruleText = numberedMatch[1].trim();
        const reason = numberedMatch[2].replace(/^because\s*/i, '').trim();
        directives.push({
          text: reason ? `${ruleText} (${reason})` : ruleText,
          type: currentSection,
          source,
          standardTitle: title,
          keywords: extractKeywords(`${ruleText} ${reason}`),
        });
        continue;
      }

      // Match bulleted anti-patterns: "- **Name** — description"
      const bulletMatch = line.match(/^[-*]\s+\*\*([^*]+)\*\*\s*[—–-]\s*(.*)$/);
      if (bulletMatch) {
        const name = bulletMatch[1].trim();
        const description = bulletMatch[2].trim();
        directives.push({
          text: `${name}: ${description}`,
          type: currentSection,
          source,
          standardTitle: title,
          keywords: extractKeywords(`${name} ${description}`),
        });
        continue;
      }

      // Match simple bullets: "- Rule text"
      const simpleBulletMatch = line.match(/^[-*]\s+(.+)$/);
      if (simpleBulletMatch && !simpleBulletMatch[1].startsWith('*')) {
        const text = simpleBulletMatch[1].trim();
        // Skip if it looks like a sub-item or explanation
        if (text.length > 10 && !text.startsWith('(') && !text.startsWith('[')) {
          directives.push({
            text,
            type: currentSection,
            source,
            standardTitle: title,
            keywords: extractKeywords(text),
          });
        }
      }
    }
  }

  return directives;
}

/**
 * Parse a single standard file and extract directives
 */
export function parseStandard(filePath: string): ParseResult {
  if (!fileOps.exists(filePath)) {
    return { success: false, path: filePath, error: 'File not found' };
  }

  const content = fileOps.readFile(filePath);
  const filename = basename(filePath);

  // Parse frontmatter
  let parsed;
  try {
    parsed = matter(content);
  } catch (err) {
    return {
      success: false,
      path: filePath,
      error: `Failed to parse frontmatter: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  // Skip non-standard files
  if (parsed.data.marr !== 'standard') {
    return {
      success: false,
      path: filePath,
      error: 'Not a MARR standard (missing marr: standard)',
    };
  }

  // Validate frontmatter
  const result = StandardFrontmatterSchema.safeParse(parsed.data);
  if (!result.success) {
    return {
      success: false,
      path: filePath,
      error: `Invalid frontmatter: ${result.error.issues.map(i => i.message).join(', ')}`,
    };
  }

  // Extract directives from content
  const directives = extractDirectives(
    parsed.content,
    filename,
    result.data.title
  );

  return {
    success: true,
    standard: {
      path: filePath,
      filename,
      frontmatter: result.data,
      content: parsed.content,
      directives,
    },
  };
}

/**
 * Read all standards from a directory
 */
export function readStandardsFromDir(dir: string): ParsedStandard[] {
  if (!fileOps.exists(dir)) {
    return [];
  }

  const files = fileOps.listFiles(dir, false);
  const standards: ParsedStandard[] = [];

  for (const file of files) {
    if (!file.endsWith('.md') || basename(file) === 'README.md') {
      continue;
    }

    const result = parseStandard(file);
    if (result.success) {
      standards.push(result.standard);
    }
  }

  return standards;
}

/**
 * Read all installed MARR standards for a project
 * Checks both project-level and user-level standards
 */
export function readInstalledStandards(projectDir: string = process.cwd()): ParsedStandard[] {
  const standards: ParsedStandard[] = [];

  // Project-level standards
  const projectStandardsDir = join(projectDir, '.claude', 'marr', 'standards');
  standards.push(...readStandardsFromDir(projectStandardsDir));

  // User-level standards (if different from project)
  const userStandardsDir = join(fileOps.getMarrRoot(), 'standards');
  if (userStandardsDir !== projectStandardsDir && fileOps.exists(userStandardsDir)) {
    standards.push(...readStandardsFromDir(userStandardsDir));
  }

  return standards;
}

/**
 * Get all directives from installed standards
 */
export function getAllDirectives(projectDir: string = process.cwd()): Directive[] {
  const standards = readInstalledStandards(projectDir);
  return standards.flatMap(s => s.directives);
}

/**
 * Get directives grouped by topic (based on standard title)
 */
export function getDirectivesByTopic(projectDir: string = process.cwd()): Map<string, Directive[]> {
  const standards = readInstalledStandards(projectDir);
  const byTopic = new Map<string, Directive[]>();

  for (const standard of standards) {
    // Extract topic from title (e.g., "Workflow Standard" -> "workflow")
    const topic = standard.frontmatter.title
      .toLowerCase()
      .replace(/\s*standard\s*/i, '')
      .trim();

    const existing = byTopic.get(topic) || [];
    byTopic.set(topic, [...existing, ...standard.directives]);
  }

  return byTopic;
}
