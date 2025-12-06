/**
 * Config scanner for MARR conflict detection
 *
 * Discovers and scans all configuration files, prompt files, and
 * other files that might define project standards or AI directives.
 */

import { join, basename, dirname } from 'path';
import * as fileOps from './file-ops.js';

/** Types of configuration files we recognize */
export type ConfigFileType =
  | 'claude-md'           // CLAUDE.md files
  | 'marr-config'         // MARR configuration files
  | 'marr-standard'       // MARR standard files
  | 'cursor-rules'        // .cursorrules
  | 'copilot-instructions'// .github/copilot-instructions.md
  | 'ai-prompt'           // Other AI prompt files
  | 'custom-standard'     // Custom standard/rule files
  | 'unknown';

/** A discovered configuration file */
export interface ConfigFile {
  /** Absolute path to the file */
  path: string;
  /** Filename */
  filename: string;
  /** Type of config file */
  type: ConfigFileType;
  /** Scope: user-level or project-level */
  scope: 'user' | 'project';
  /** File content */
  content: string;
  /** Files imported via @ syntax (if any) */
  imports: string[];
}

/** Result of scanning configurations */
export interface ScanResult {
  /** All discovered config files */
  files: ConfigFile[];
  /** User-level files */
  userFiles: ConfigFile[];
  /** Project-level files */
  projectFiles: ConfigFile[];
  /** Files that define standards (excluding MARR standards) */
  customStandards: ConfigFile[];
}

/** Known config file patterns and their types */
const CONFIG_PATTERNS: Array<{ pattern: RegExp; type: ConfigFileType }> = [
  { pattern: /^CLAUDE\.md$/i, type: 'claude-md' },
  { pattern: /^MARR-.*-CLAUDE\.md$/i, type: 'marr-config' },
  { pattern: /^prj-.*-standard\.md$/i, type: 'marr-standard' },
  { pattern: /^\.cursorrules$/i, type: 'cursor-rules' },
  { pattern: /^copilot-instructions\.md$/i, type: 'copilot-instructions' },
  { pattern: /\.?rules$/i, type: 'custom-standard' },
  { pattern: /prompts?\.md$/i, type: 'ai-prompt' },
  { pattern: /instructions?\.md$/i, type: 'ai-prompt' },
  { pattern: /guidelines?\.md$/i, type: 'custom-standard' },
  { pattern: /standards?\.md$/i, type: 'custom-standard' },
  { pattern: /conventions?\.md$/i, type: 'custom-standard' },
];

/**
 * Determine config file type from filename
 */
function getConfigType(filename: string): ConfigFileType {
  for (const { pattern, type } of CONFIG_PATTERNS) {
    if (pattern.test(filename)) {
      return type;
    }
  }
  return 'unknown';
}

/**
 * Extract @ imports from file content
 * Claude Code uses @path/to/file.md syntax for imports
 */
function extractImports(content: string): string[] {
  const imports: string[] = [];
  const importPattern = /^@([^\s]+\.md)\s*$/gm;

  let match;
  while ((match = importPattern.exec(content)) !== null) {
    imports.push(match[1]);
  }

  return imports;
}

/**
 * Check if content appears to define standards or rules
 */
function looksLikeStandard(content: string): boolean {
  const lowerContent = content.toLowerCase();

  // Check for common standard indicators
  const indicators = [
    'core rules',
    'anti-patterns',
    'never violate',
    'must follow',
    'always ',
    'never ',
    'forbidden',
    'required',
    'standards',
    'guidelines',
    'conventions',
  ];

  let matchCount = 0;
  for (const indicator of indicators) {
    if (lowerContent.includes(indicator)) {
      matchCount++;
    }
  }

  // If content has 3+ standard indicators, it likely defines standards
  return matchCount >= 3;
}

/**
 * Scan a single file and return ConfigFile if relevant
 */
function scanFile(filePath: string, scope: 'user' | 'project'): ConfigFile | null {
  if (!fileOps.exists(filePath)) {
    return null;
  }

  const filename = basename(filePath);
  const type = getConfigType(filename);

  // Skip unknown files unless they look like standards
  if (type === 'unknown') {
    // Only consider .md files
    if (!filename.endsWith('.md')) {
      return null;
    }

    // Check if content looks like a standard
    const content = fileOps.readFile(filePath);
    if (!looksLikeStandard(content)) {
      return null;
    }

    return {
      path: filePath,
      filename,
      type: 'custom-standard',
      scope,
      content,
      imports: extractImports(content),
    };
  }

  const content = fileOps.readFile(filePath);

  return {
    path: filePath,
    filename,
    type,
    scope,
    content,
    imports: extractImports(content),
  };
}

/**
 * Scan a directory for config files
 */
function scanDirectory(dir: string, scope: 'user' | 'project', recursive = false): ConfigFile[] {
  if (!fileOps.exists(dir)) {
    return [];
  }

  const files: ConfigFile[] = [];
  const entries = fileOps.listFiles(dir, recursive);

  for (const entry of entries) {
    // Skip MARR standards directory when scanning for custom standards
    if (entry.includes('.claude/marr/standards/')) {
      continue;
    }

    const result = scanFile(entry, scope);
    if (result) {
      files.push(result);
    }
  }

  return files;
}

/**
 * Scan user-level configuration (~/.claude/)
 */
export function scanUserConfig(): ConfigFile[] {
  const files: ConfigFile[] = [];
  const claudeRoot = fileOps.getClaudeRoot();

  // Main CLAUDE.md
  const claudeMd = scanFile(join(claudeRoot, 'CLAUDE.md'), 'user');
  if (claudeMd) {
    files.push(claudeMd);
  }

  // MARR user config
  const marrConfig = scanFile(join(claudeRoot, 'marr', 'MARR-USER-CLAUDE.md'), 'user');
  if (marrConfig) {
    files.push(marrConfig);
  }

  // Prompts directory (custom prompts/standards)
  const promptsDir = join(claudeRoot, 'prompts');
  files.push(...scanDirectory(promptsDir, 'user', true));

  // Commands directory (may contain standards)
  const commandsDir = join(claudeRoot, 'commands');
  files.push(...scanDirectory(commandsDir, 'user', true));

  return files;
}

/**
 * Scan project-level configuration
 */
export function scanProjectConfig(projectDir: string = process.cwd()): ConfigFile[] {
  const files: ConfigFile[] = [];

  // Root CLAUDE.md
  const rootClaudeMd = scanFile(join(projectDir, 'CLAUDE.md'), 'project');
  if (rootClaudeMd) {
    files.push(rootClaudeMd);
  }

  // .claude/CLAUDE.md (alternative location)
  const dotClaudeClaudeMd = scanFile(join(projectDir, '.claude', 'CLAUDE.md'), 'project');
  if (dotClaudeClaudeMd) {
    files.push(dotClaudeClaudeMd);
  }

  // MARR project config
  const marrConfig = scanFile(join(projectDir, '.claude', 'marr', 'MARR-PROJECT-CLAUDE.md'), 'project');
  if (marrConfig) {
    files.push(marrConfig);
  }

  // .claude/prompts/ directory
  const promptsDir = join(projectDir, '.claude', 'prompts');
  files.push(...scanDirectory(promptsDir, 'project', true));

  // .claude/commands/ directory
  const commandsDir = join(projectDir, '.claude', 'commands');
  files.push(...scanDirectory(commandsDir, 'project', true));

  // .cursorrules
  const cursorrules = scanFile(join(projectDir, '.cursorrules'), 'project');
  if (cursorrules) {
    files.push(cursorrules);
  }

  // .github/copilot-instructions.md
  const copilotInstructions = scanFile(
    join(projectDir, '.github', 'copilot-instructions.md'),
    'project'
  );
  if (copilotInstructions) {
    files.push(copilotInstructions);
  }

  // docs/ directory - check for standard-like files
  const docsDir = join(projectDir, 'docs');
  if (fileOps.exists(docsDir)) {
    // Only scan top-level docs, don't recurse deeply
    const docsFiles = scanDirectory(docsDir, 'project', false);
    // Only include files that look like standards
    files.push(...docsFiles.filter(f => f.type === 'custom-standard'));
  }

  return files;
}

/**
 * Full scan of both user and project configurations
 */
export function scanAllConfigs(projectDir: string = process.cwd()): ScanResult {
  const userFiles = scanUserConfig();
  const projectFiles = scanProjectConfig(projectDir);
  const allFiles = [...userFiles, ...projectFiles];

  // Identify custom standards (non-MARR files that define standards)
  const customStandards = allFiles.filter(f =>
    f.type === 'custom-standard' ||
    f.type === 'cursor-rules' ||
    f.type === 'copilot-instructions' ||
    (f.type === 'ai-prompt' && looksLikeStandard(f.content))
  );

  return {
    files: allFiles,
    userFiles,
    projectFiles,
    customStandards,
  };
}

/**
 * Resolve an import path relative to a config file
 */
export function resolveImport(importPath: string, fromFile: string): string {
  // Handle home directory expansion
  if (importPath.startsWith('~/')) {
    return join(fileOps.getHomeDir(), importPath.slice(2));
  }

  // Handle absolute paths
  if (importPath.startsWith('/')) {
    return importPath;
  }

  // Relative path from the importing file's directory
  return join(dirname(fromFile), importPath);
}

/**
 * Get all files transitively imported by a config file
 */
export function getTransitiveImports(
  configFile: ConfigFile,
  visited: Set<string> = new Set()
): ConfigFile[] {
  const imports: ConfigFile[] = [];

  for (const importPath of configFile.imports) {
    const resolvedPath = resolveImport(importPath, configFile.path);

    // Avoid cycles
    if (visited.has(resolvedPath)) {
      continue;
    }
    visited.add(resolvedPath);

    const imported = scanFile(resolvedPath, configFile.scope);
    if (imported) {
      imports.push(imported);
      // Recursively get imports
      imports.push(...getTransitiveImports(imported, visited));
    }
  }

  return imports;
}
