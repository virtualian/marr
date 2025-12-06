/**
 * Conflict detector for MARR integration
 *
 * Dynamically scans user and project configurations against installed
 * MARR standards to detect potential conflicts.
 */

import { join, basename } from 'path';
import * as fileOps from './file-ops.js';
import {
  readInstalledStandards,
  type Directive,
  type ParsedStandard,
} from './standards-reader.js';
import {
  scanAllConfigs,
  scanUserConfig,
  scanProjectConfig,
  getTransitiveImports,
  type ConfigFile,
} from './config-scanner.js';
import type {
  Conflict,
  ConflictReport,
  ConflictCategory,
  Resolution,
} from '../types/conflict.js';

/** MARR import markers */
const MARR_USER_IMPORT = '@~/.claude/marr/MARR-USER-CLAUDE.md';
const MARR_PROJECT_IMPORT = '@.claude/marr/MARR-PROJECT-CLAUDE.md';

/** Minimum keyword overlap to consider a potential conflict */
const MIN_KEYWORD_OVERLAP = 2;

/** Minimum similarity score (0-1) to flag as conflict */
const MIN_SIMILARITY_THRESHOLD = 0.3;

/**
 * Create standard resolutions for a conflict
 */
function createResolutions(category: ConflictCategory): Resolution[] {
  switch (category) {
    case 'directive_conflict':
      return [
        {
          key: 'k',
          label: 'Keep existing',
          description: 'Keep your current directive',
          recommended: false,
        },
        {
          key: 'm',
          label: 'Adopt MARR',
          description: 'Remove the conflicting directive',
          recommended: true,
        },
        {
          key: 's',
          label: 'Skip',
          description: 'Resolve later',
        },
      ];
    case 'duplicate_standard':
      return [
        {
          key: 'k',
          label: 'Keep yours',
          description: 'Keep your standard, disable MARR equivalent',
          recommended: false,
        },
        {
          key: 'm',
          label: 'Use MARR',
          description: 'Remove your standard, use MARR version',
          recommended: true,
        },
        {
          key: 'b',
          label: 'Keep both',
          description: 'Keep both (may cause conflicts)',
        },
        {
          key: 's',
          label: 'Skip',
          description: 'Resolve later',
        },
      ];
    case 'missing_import':
      return [
        {
          key: 'a',
          label: 'Add import',
          description: 'Add MARR import to CLAUDE.md',
          recommended: true,
        },
        {
          key: 's',
          label: 'Skip',
          description: 'Leave as is',
        },
      ];
    case 'override_after_import':
      return [
        {
          key: 'r',
          label: 'Remove override',
          description: 'Remove the conflicting section',
          recommended: true,
        },
        {
          key: 'k',
          label: 'Keep override',
          description: 'Keep your override (intentional)',
        },
        {
          key: 's',
          label: 'Skip',
          description: 'Resolve later',
        },
      ];
    default:
      return [
        {
          key: 's',
          label: 'Skip',
          description: 'Resolve later',
        },
      ];
  }
}

/**
 * Generate a unique conflict ID
 */
function generateConflictId(location: string, category: string, line?: number): string {
  const base = `${basename(location)}-${category}`;
  return line ? `${base}-L${line}` : base;
}

/**
 * Find line number of text in content
 */
function findLineNumber(content: string, searchText: string): number | undefined {
  const index = content.indexOf(searchText);
  if (index === -1) return undefined;
  return content.substring(0, index).split('\n').length;
}

/**
 * Extract keywords from text for matching
 */
function extractKeywords(text: string): Set<string> {
  const stopWords = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'to', 'of',
    'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through',
    'and', 'but', 'if', 'or', 'because', 'that', 'this', 'it', 'its',
    'they', 'them', 'their', 'what', 'which', 'who', 'any', 'all',
  ]);

  const words = text.toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  return new Set(words);
}

/**
 * Calculate keyword overlap between two sets
 */
function keywordOverlap(set1: Set<string>, set2: Set<string>): number {
  let overlap = 0;
  for (const word of set1) {
    if (set2.has(word)) {
      overlap++;
    }
  }
  return overlap;
}

/**
 * Check if text contains negation of a concept
 */
function containsNegation(text: string, concept: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerConcept = concept.toLowerCase();

  // Common negation patterns
  const negationPatterns = [
    `don't ${lowerConcept}`,
    `do not ${lowerConcept}`,
    `never ${lowerConcept}`,
    `no ${lowerConcept}`,
    `avoid ${lowerConcept}`,
    `skip ${lowerConcept}`,
    `without ${lowerConcept}`,
    `disable ${lowerConcept}`,
  ];

  return negationPatterns.some(pattern => lowerText.includes(pattern));
}

/**
 * Check if text contains affirmation of a concept
 */
function containsAffirmation(text: string, concept: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerConcept = concept.toLowerCase();

  // Common affirmation patterns
  const affirmationPatterns = [
    `always ${lowerConcept}`,
    `must ${lowerConcept}`,
    `require ${lowerConcept}`,
    `use ${lowerConcept}`,
    `prefer ${lowerConcept}`,
    `enable ${lowerConcept}`,
  ];

  return affirmationPatterns.some(pattern => lowerText.includes(pattern));
}

/**
 * Detect semantic conflicts between config content and MARR directives
 */
function detectDirectiveConflicts(
  configFile: ConfigFile,
  directives: Directive[]
): Conflict[] {
  const conflicts: Conflict[] = [];
  const contentKeywords = extractKeywords(configFile.content);

  for (const directive of directives) {
    const directiveKeywords = new Set(directive.keywords);
    const overlap = keywordOverlap(contentKeywords, directiveKeywords);

    // Skip if not enough keyword overlap
    if (overlap < MIN_KEYWORD_OVERLAP) {
      continue;
    }

    // Check for semantic conflicts based on directive type
    let isConflict = false;
    let conflictDescription = '';
    let matchedText = '';

    if (directive.type === 'rule') {
      // Rules are things you MUST do
      // Check if config contradicts by negating the rule
      const ruleKeyword = directive.keywords[0] || '';

      if (containsNegation(configFile.content, ruleKeyword)) {
        isConflict = true;
        conflictDescription = `Config may contradict MARR rule: "${directive.text}"`;

        // Try to find the conflicting line
        const lines = configFile.content.split('\n');
        for (const line of lines) {
          if (containsNegation(line, ruleKeyword)) {
            matchedText = line.trim();
            break;
          }
        }
      }
    } else if (directive.type === 'anti-pattern') {
      // Anti-patterns are things you must NOT do
      // Check if config encourages the anti-pattern
      const antiKeyword = directive.keywords[0] || '';

      if (containsAffirmation(configFile.content, antiKeyword)) {
        isConflict = true;
        conflictDescription = `Config may encourage forbidden pattern: "${directive.text}"`;

        // Try to find the conflicting line
        const lines = configFile.content.split('\n');
        for (const line of lines) {
          if (containsAffirmation(line, antiKeyword)) {
            matchedText = line.trim();
            break;
          }
        }
      }
    }

    if (isConflict && matchedText) {
      const line = findLineNumber(configFile.content, matchedText);
      conflicts.push({
        id: generateConflictId(configFile.path, 'directive_conflict', line),
        category: 'directive_conflict',
        severity: 'warning',
        location: configFile.path,
        line,
        existing: matchedText,
        marrExpects: directive.text,
        marrSource: directive.source,
        description: conflictDescription,
        resolutions: createResolutions('directive_conflict'),
      });
    }
  }

  return conflicts;
}

/**
 * Detect duplicate/overlapping standards
 */
function detectDuplicateStandards(
  configFile: ConfigFile,
  installedStandards: ParsedStandard[]
): Conflict[] {
  const conflicts: Conflict[] = [];

  // Skip MARR files - they're not duplicates
  if (configFile.type === 'marr-config' || configFile.type === 'marr-standard') {
    return conflicts;
  }

  // Only check files that look like they define standards
  if (configFile.type !== 'custom-standard' &&
      configFile.type !== 'cursor-rules' &&
      configFile.type !== 'copilot-instructions') {
    return conflicts;
  }

  const contentKeywords = extractKeywords(configFile.content);

  for (const standard of installedStandards) {
    // Extract topic from standard title
    const topic = standard.frontmatter.title
      .toLowerCase()
      .replace(/\s*standard\s*/i, '')
      .trim();

    // Get keywords from standard content
    const standardKeywords = new Set<string>();
    for (const directive of standard.directives) {
      for (const kw of directive.keywords) {
        standardKeywords.add(kw);
      }
    }
    // Add topic keywords
    topic.split(/\s+/).forEach(w => standardKeywords.add(w));

    const overlap = keywordOverlap(contentKeywords, standardKeywords);
    const similarity = overlap / Math.max(standardKeywords.size, 1);

    if (overlap >= MIN_KEYWORD_OVERLAP && similarity >= MIN_SIMILARITY_THRESHOLD) {
      conflicts.push({
        id: generateConflictId(configFile.path, 'duplicate_standard'),
        category: 'duplicate_standard',
        severity: 'warning',
        location: configFile.path,
        existing: `Custom ${topic} rules in ${configFile.filename}`,
        marrExpects: `MARR provides ${standard.filename}`,
        marrSource: standard.filename,
        description: `File "${configFile.filename}" appears to define ${topic} rules that overlap with MARR standard`,
        resolutions: createResolutions('duplicate_standard'),
      });
    }
  }

  return conflicts;
}

/**
 * Check for missing MARR import in CLAUDE.md
 */
function checkMissingImport(
  filePath: string,
  expectedImport: string,
  scope: 'user' | 'project'
): Conflict | null {
  if (!fileOps.exists(filePath)) {
    return null;
  }

  const content = fileOps.readFile(filePath);

  if (content.includes(expectedImport)) {
    return null;
  }

  return {
    id: generateConflictId(filePath, 'missing_import'),
    category: 'missing_import',
    severity: 'warning',
    location: filePath,
    existing: 'No MARR import found',
    marrExpects: `Import: ${expectedImport}`,
    description: `${scope === 'user' ? 'User' : 'Project'} CLAUDE.md exists but doesn't import MARR`,
    resolutions: createResolutions('missing_import'),
  };
}

/**
 * Detect conflicts in user-level configuration
 */
export function detectUserConflicts(projectDir: string = process.cwd()): Conflict[] {
  const conflicts: Conflict[] = [];
  const claudeMdPath = fileOps.getUserClaudeMdPath();

  // Get installed standards and directives
  const standards = readInstalledStandards(projectDir);
  const directives = standards.flatMap(s => s.directives);

  // Check for missing import
  const missingImport = checkMissingImport(claudeMdPath, MARR_USER_IMPORT, 'user');
  if (missingImport) {
    conflicts.push(missingImport);
  }

  // Scan all user config files
  const userFiles = scanUserConfig();

  for (const file of userFiles) {
    // Skip MARR's own files
    if (file.type === 'marr-config' || file.type === 'marr-standard') {
      continue;
    }

    // Check for directive conflicts
    conflicts.push(...detectDirectiveConflicts(file, directives));

    // Check for duplicate standards
    conflicts.push(...detectDuplicateStandards(file, standards));

    // Also check transitively imported files
    const imports = getTransitiveImports(file);
    for (const imported of imports) {
      if (imported.type !== 'marr-config' && imported.type !== 'marr-standard') {
        conflicts.push(...detectDirectiveConflicts(imported, directives));
        conflicts.push(...detectDuplicateStandards(imported, standards));
      }
    }
  }

  return deduplicateConflicts(conflicts);
}

/**
 * Detect conflicts in project-level configuration
 */
export function detectProjectConflicts(projectDir: string = process.cwd()): Conflict[] {
  const conflicts: Conflict[] = [];

  // Get installed standards and directives
  const standards = readInstalledStandards(projectDir);
  const directives = standards.flatMap(s => s.directives);

  // Check both possible CLAUDE.md locations
  const rootClaudeMdPath = join(projectDir, 'CLAUDE.md');
  const dotClaudeClaudeMdPath = join(projectDir, '.claude', 'CLAUDE.md');

  const claudeMdPath = fileOps.exists(rootClaudeMdPath)
    ? rootClaudeMdPath
    : fileOps.exists(dotClaudeClaudeMdPath)
      ? dotClaudeClaudeMdPath
      : null;

  // Check for missing import
  if (claudeMdPath) {
    const missingImport = checkMissingImport(claudeMdPath, MARR_PROJECT_IMPORT, 'project');
    if (missingImport) {
      conflicts.push(missingImport);
    }
  }

  // Scan all project config files
  const projectFiles = scanProjectConfig(projectDir);

  for (const file of projectFiles) {
    // Skip MARR's own files
    if (file.type === 'marr-config' || file.type === 'marr-standard') {
      continue;
    }

    // Check for directive conflicts
    conflicts.push(...detectDirectiveConflicts(file, directives));

    // Check for duplicate standards
    conflicts.push(...detectDuplicateStandards(file, standards));

    // Also check transitively imported files
    const imports = getTransitiveImports(file);
    for (const imported of imports) {
      if (imported.type !== 'marr-config' && imported.type !== 'marr-standard') {
        conflicts.push(...detectDirectiveConflicts(imported, directives));
        conflicts.push(...detectDuplicateStandards(imported, standards));
      }
    }
  }

  return deduplicateConflicts(conflicts);
}

/**
 * Remove duplicate conflicts (same file + category + line)
 */
function deduplicateConflicts(conflicts: Conflict[]): Conflict[] {
  const seen = new Set<string>();
  return conflicts.filter(conflict => {
    if (seen.has(conflict.id)) {
      return false;
    }
    seen.add(conflict.id);
    return true;
  });
}

/**
 * Generate a full conflict report
 */
export function generateConflictReport(
  scope: 'user' | 'project' | 'both' = 'both',
  projectDir: string = process.cwd()
): ConflictReport {
  const conflicts: Conflict[] = [];
  let filesScanned = 0;

  if (scope === 'user' || scope === 'both') {
    const userFiles = scanUserConfig();
    filesScanned += userFiles.length;
    conflicts.push(...detectUserConflicts(projectDir));
  }

  if (scope === 'project' || scope === 'both') {
    const projectFiles = scanProjectConfig(projectDir);
    filesScanned += projectFiles.length;
    conflicts.push(...detectProjectConflicts(projectDir));
  }

  const dedupedConflicts = deduplicateConflicts(conflicts);
  const errors = dedupedConflicts.filter(c => c.severity === 'error').length;
  const warnings = dedupedConflicts.filter(c => c.severity === 'warning').length;

  return {
    timestamp: new Date().toISOString(),
    scope,
    filesScanned,
    conflicts: dedupedConflicts,
    summary: {
      errors,
      warnings,
      total: dedupedConflicts.length,
    },
  };
}

/**
 * Get summary of what will be scanned
 */
export function getScanSummary(projectDir: string = process.cwd()): {
  standards: number;
  directives: number;
  configFiles: number;
  customStandards: number;
} {
  const standards = readInstalledStandards(projectDir);
  const directives = standards.flatMap(s => s.directives);
  const scanResult = scanAllConfigs(projectDir);

  return {
    standards: standards.length,
    directives: directives.length,
    configFiles: scanResult.files.length,
    customStandards: scanResult.customStandards.length,
  };
}
