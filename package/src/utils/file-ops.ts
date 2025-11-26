/**
 * File operations utility
 * Provides common file system operations with error handling
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
  readdirSync,
  statSync,
  chmodSync,
} from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import * as logger from './logger.js';

/**
 * Get user's home directory
 */
export function getHomeDir(): string {
  return homedir();
}

/**
 * Get Claude Code config directory (~/.claude)
 */
export function getClaudeRoot(): string {
  return join(getHomeDir(), '.claude');
}

/**
 * Get MARR root directory (~/.claude/marr)
 * MARR stores its configuration inside Claude Code's config directory
 * so that Claude Code can discover it via imports.
 */
export function getMarrRoot(): string {
  return join(getClaudeRoot(), 'marr');
}

/**
 * Get path to user's Claude Code CLAUDE.md file
 */
export function getUserClaudeMdPath(): string {
  return join(getClaudeRoot(), 'CLAUDE.md');
}

/**
 * Get path to MARR's user-level CLAUDE.md file
 */
export function getMarrClaudeMdPath(): string {
  return join(getMarrRoot(), 'CLAUDE.md');
}

/**
 * Check if path exists
 */
export function exists(path: string): boolean {
  return existsSync(path);
}

/**
 * Create directory if it doesn't exist
 */
export function ensureDir(path: string, recursive = true): void {
  if (!exists(path)) {
    mkdirSync(path, { recursive });
  }
}

/**
 * Read file contents
 */
export function readFile(path: string, encoding: BufferEncoding = 'utf8'): string {
  try {
    return readFileSync(path, encoding);
  } catch (err) {
    logger.error(`Failed to read file: ${path}`);
    logger.error((err as Error).message);
    process.exit(1);
  }
}

/**
 * Write file contents
 */
export function writeFile(path: string, content: string, encoding: BufferEncoding = 'utf8'): void {
  try {
    ensureDir(dirname(path));
    writeFileSync(path, content, encoding);
  } catch (err) {
    logger.error(`Failed to write file: ${path}`);
    logger.error((err as Error).message);
    process.exit(1);
  }
}

/**
 * Copy file from source to destination
 */
export function copyFile(src: string, dest: string): void {
  try {
    ensureDir(dirname(dest));
    copyFileSync(src, dest);
  } catch (err) {
    logger.error(`Failed to copy file: ${src} -> ${dest}`);
    logger.error((err as Error).message);
    process.exit(1);
  }
}

/**
 * Make file executable
 */
export function makeExecutable(path: string): void {
  try {
    chmodSync(path, 0o755);
  } catch (err) {
    logger.warning(`Failed to make file executable: ${path}`);
    logger.debug((err as Error).message);
  }
}

/**
 * Check if path is a directory
 */
export function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

/**
 * List files in directory
 */
export function listFiles(path: string, recursive = false): string[] {
  if (!exists(path) || !isDirectory(path)) {
    return [];
  }

  const files: string[] = [];
  const entries = readdirSync(path);

  for (const entry of entries) {
    const fullPath = join(path, entry);
    if (isDirectory(fullPath)) {
      if (recursive) {
        files.push(...listFiles(fullPath, true));
      }
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Substitute template variables in content
 */
export function substituteVars(content: string, vars: Record<string, string>): string {
  let result = content;
  for (const [key, value] of Object.entries(vars)) {
    const pattern = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(pattern, value);
  }
  return result;
}
