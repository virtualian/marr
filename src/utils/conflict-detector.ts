/**
 * Conflict detector for MARR integration
 *
 * Scans user and project configurations to detect potential conflicts
 * with MARR standards and philosophy.
 */

import { join, basename } from 'path';
import * as fileOps from './file-ops.js';
import type {
  Conflict,
  ConflictReport,
  ConflictCategory,
  Resolution,
} from '../types/conflict.js';

/** MARR import markers */
const MARR_USER_IMPORT = '@~/.claude/marr/MARR-USER-CLAUDE.md';
const MARR_PROJECT_IMPORT = '@.claude/marr/MARR-PROJECT-CLAUDE.md';

/** Standard topic keywords for duplicate detection */
const STANDARD_TOPICS: Record<string, string[]> = {
  workflow: ['git', 'workflow', 'branch', 'commit', 'merge', 'squash'],
  testing: ['test', 'testing', 'spec', 'jest', 'vitest', 'pytest'],
  documentation: ['doc', 'documentation', 'readme', 'docs'],
  mcp: ['mcp', 'tool', 'server'],
  prompts: ['prompt', 'standard', 'rule'],
};

/** Patterns that contradict MARR philosophy */
interface ConflictPattern {
  pattern: RegExp;
  category: ConflictCategory;
  severity: 'error' | 'warning';
  description: string;
  marrExpects: string;
  marrSource?: string;
}

const CONFLICT_PATTERNS: ConflictPattern[] = [
  // Git workflow conflicts
  {
    pattern: /\b(always|prefer|use)\s+(merge\s+commits?|regular\s+merges?)\b/i,
    category: 'directive_conflict',
    severity: 'warning',
    description: 'Contradicts MARR squash merge preference',
    marrExpects: 'Always squash merge for clean history',
    marrSource: 'prj-workflow-standard.md',
  },
  {
    pattern: /\b(auto[- ]?commit|commit\s+automatically|without\s+approval)\b/i,
    category: 'directive_conflict',
    severity: 'warning',
    description: 'Contradicts MARR approval requirements',
    marrExpects: 'Always get explicit user approval before commits',
    marrSource: 'MARR-USER-CLAUDE.md',
  },
  {
    pattern: /\b(force\s+push|push\s+--force)\b/i,
    category: 'directive_conflict',
    severity: 'warning',
    description: 'Force pushing can cause issues',
    marrExpects: 'Avoid force pushing to shared branches',
    marrSource: 'prj-workflow-standard.md',
  },
  // Attribution conflicts
  {
    pattern: /\b(add|include|use)\s+(claude|ai|generated)\s+(attribution|credit|comment)/i,
    category: 'directive_conflict',
    severity: 'warning',
    description: 'Contradicts MARR attribution restrictions',
    marrExpects: 'Never add AI attribution comments to any file',
    marrSource: 'MARR-USER-CLAUDE.md',
  },
  {
    pattern: /\bgenerated\s+(with|by)\s+claude\b/i,
    category: 'directive_conflict',
    severity: 'warning',
    description: 'Contains AI attribution directive',
    marrExpects: 'No "Generated with Claude" or "Co-Authored-By" comments',
    marrSource: 'MARR-USER-CLAUDE.md',
  },
  // Testing conflicts
  {
    pattern: /\b(skip|don't\s+run|no)\s+tests?\b/i,
    category: 'directive_conflict',
    severity: 'warning',
    description: 'Contradicts MARR testing requirements',
    marrExpects: 'Run tests before committing changes',
    marrSource: 'MARR-USER-CLAUDE.md',
  },
];

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
 * Find line number of a pattern match in content
 */
function findLineNumber(content: string, match: RegExpMatchArray): number {
  const beforeMatch = content.substring(0, match.index);
  return beforeMatch.split('\n').length;
}

/**
 * Scan a file for directive conflicts
 */
function scanForDirectiveConflicts(filePath: string, content: string): Conflict[] {
  const conflicts: Conflict[] = [];

  for (const pattern of CONFLICT_PATTERNS) {
    const matches = content.matchAll(new RegExp(pattern.pattern, 'gi'));

    for (const match of matches) {
      const line = findLineNumber(content, match);
      conflicts.push({
        id: generateConflictId(filePath, pattern.category, line),
        category: pattern.category,
        severity: pattern.severity,
        location: filePath,
        line,
        existing: match[0],
        marrExpects: pattern.marrExpects,
        marrSource: pattern.marrSource,
        description: pattern.description,
        resolutions: createResolutions(pattern.category),
      });
    }
  }

  return conflicts;
}

/**
 * Check for duplicate standards in a directory
 */
function scanForDuplicateStandards(promptsDir: string): Conflict[] {
  const conflicts: Conflict[] = [];

  if (!fileOps.exists(promptsDir)) {
    return conflicts;
  }

  const files = fileOps.listFiles(promptsDir, true);

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const filename = basename(file).toLowerCase();
    const content = fileOps.readFile(file).toLowerCase();

    // Check if file name or content matches any standard topic
    for (const [topic, keywords] of Object.entries(STANDARD_TOPICS)) {
      const matchesName = keywords.some(kw => filename.includes(kw));
      const matchesContent = keywords.filter(kw => content.includes(kw)).length >= 2;

      if (matchesName || matchesContent) {
        conflicts.push({
          id: generateConflictId(file, 'duplicate_standard'),
          category: 'duplicate_standard',
          severity: 'warning',
          location: file,
          existing: `Custom ${topic} standard`,
          marrExpects: `MARR provides prj-${topic}-standard.md`,
          marrSource: `prj-${topic}-standard.md`,
          description: `You have a custom ${topic} standard that may conflict with MARR`,
          resolutions: createResolutions('duplicate_standard'),
        });
        break; // One conflict per file
      }
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
export function detectUserConflicts(): Conflict[] {
  const conflicts: Conflict[] = [];
  const claudeRoot = fileOps.getClaudeRoot();
  const claudeMdPath = fileOps.getUserClaudeMdPath();

  // Check for missing import
  const missingImport = checkMissingImport(claudeMdPath, MARR_USER_IMPORT, 'user');
  if (missingImport) {
    conflicts.push(missingImport);
  }

  // Scan CLAUDE.md for directive conflicts
  if (fileOps.exists(claudeMdPath)) {
    const content = fileOps.readFile(claudeMdPath);
    conflicts.push(...scanForDirectiveConflicts(claudeMdPath, content));
  }

  // Check for duplicate standards in ~/.claude/prompts/
  const promptsDir = join(claudeRoot, 'prompts');
  conflicts.push(...scanForDuplicateStandards(promptsDir));

  return conflicts;
}

/**
 * Detect conflicts in project-level configuration
 */
export function detectProjectConflicts(projectDir: string = process.cwd()): Conflict[] {
  const conflicts: Conflict[] = [];

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

    // Scan for directive conflicts
    const content = fileOps.readFile(claudeMdPath);
    conflicts.push(...scanForDirectiveConflicts(claudeMdPath, content));
  }

  // Check for duplicate standards in .claude/prompts/
  const promptsDir = join(projectDir, '.claude', 'prompts');
  conflicts.push(...scanForDuplicateStandards(promptsDir));

  return conflicts;
}

/**
 * Generate a full conflict report
 */
export function generateConflictReport(
  scope: 'user' | 'project' | 'both' = 'both'
): ConflictReport {
  const conflicts: Conflict[] = [];
  let filesScanned = 0;

  if (scope === 'user' || scope === 'both') {
    conflicts.push(...detectUserConflicts());
    filesScanned += 2; // CLAUDE.md + prompts dir
  }

  if (scope === 'project' || scope === 'both') {
    conflicts.push(...detectProjectConflicts());
    filesScanned += 3; // CLAUDE.md (2 locations) + prompts dir
  }

  const errors = conflicts.filter(c => c.severity === 'error').length;
  const warnings = conflicts.filter(c => c.severity === 'warning').length;

  return {
    timestamp: new Date().toISOString(),
    scope,
    filesScanned,
    conflicts,
    summary: {
      errors,
      warnings,
      total: conflicts.length,
    },
  };
}
