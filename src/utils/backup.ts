/**
 * Backup utility for MARR
 *
 * Creates timestamped backups before modifying files
 */

import { copyFileSync, readdirSync, unlinkSync, statSync } from 'fs';
import { join, dirname, basename } from 'path';
import * as fileOps from './file-ops.js';
import * as logger from './logger.js';

/** Information about a backup file */
export interface BackupInfo {
  /** Original file that was backed up */
  originalPath: string;

  /** Path to the backup file */
  backupPath: string;

  /** When the backup was created */
  timestamp: Date;

  /** Size of the backup in bytes */
  size: number;
}

/**
 * Generate timestamp string for backup filename
 * Format: YYYYMMDD-HHMMSS
 */
function generateTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

/**
 * Parse timestamp from backup filename
 */
function parseTimestamp(filename: string): Date | null {
  // Match pattern: filename.YYYYMMDD-HHMMSS.bak
  const match = filename.match(/\.(\d{8})-(\d{6})\.bak$/);
  if (!match) return null;

  const dateStr = match[1];
  const timeStr = match[2];

  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1;
  const day = parseInt(dateStr.substring(6, 8));
  const hours = parseInt(timeStr.substring(0, 2));
  const minutes = parseInt(timeStr.substring(2, 4));
  const seconds = parseInt(timeStr.substring(4, 6));

  return new Date(year, month, day, hours, minutes, seconds);
}

/**
 * Create a backup of a file
 *
 * @param filePath - Path to the file to back up
 * @returns Path to the backup file, or null if file doesn't exist
 */
export function createBackup(filePath: string): string | null {
  if (!fileOps.exists(filePath)) {
    logger.debug(`Cannot backup non-existent file: ${filePath}`);
    return null;
  }

  const dir = dirname(filePath);
  const name = basename(filePath);
  const timestamp = generateTimestamp();
  const backupName = `${name}.${timestamp}.bak`;
  const backupPath = join(dir, backupName);

  try {
    copyFileSync(filePath, backupPath);
    logger.debug(`Created backup: ${backupPath}`);
    return backupPath;
  } catch (err) {
    logger.error(`Failed to create backup: ${(err as Error).message}`);
    return null;
  }
}

/**
 * Restore a file from backup
 *
 * @param backupPath - Path to the backup file
 * @returns true if restored successfully, false otherwise
 */
export function restoreBackup(backupPath: string): boolean {
  if (!fileOps.exists(backupPath)) {
    logger.error(`Backup file not found: ${backupPath}`);
    return false;
  }

  // Derive original path from backup path
  // Remove .YYYYMMDD-HHMMSS.bak suffix
  const originalPath = backupPath.replace(/\.\d{8}-\d{6}\.bak$/, '');

  if (originalPath === backupPath) {
    logger.error(`Invalid backup filename format: ${backupPath}`);
    return false;
  }

  try {
    copyFileSync(backupPath, originalPath);
    logger.success(`Restored from backup: ${originalPath}`);
    return true;
  } catch (err) {
    logger.error(`Failed to restore backup: ${(err as Error).message}`);
    return false;
  }
}

/**
 * List all backups in a directory for a specific file
 *
 * @param filePath - Path to the original file
 * @returns Array of backup info, sorted by timestamp (newest first)
 */
export function listBackups(filePath: string): BackupInfo[] {
  const dir = dirname(filePath);
  const name = basename(filePath);

  if (!fileOps.exists(dir)) {
    return [];
  }

  const backups: BackupInfo[] = [];
  const pattern = new RegExp(`^${escapeRegex(name)}\\.\\d{8}-\\d{6}\\.bak$`);

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      if (!pattern.test(entry)) continue;

      const backupPath = join(dir, entry);
      const timestamp = parseTimestamp(entry);

      if (!timestamp) continue;

      try {
        const stats = statSync(backupPath);
        backups.push({
          originalPath: filePath,
          backupPath,
          timestamp,
          size: stats.size,
        });
      } catch {
        // Skip files we can't stat
        continue;
      }
    }
  } catch {
    return [];
  }

  // Sort by timestamp, newest first
  return backups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Remove old backups, keeping only the most recent ones
 *
 * @param filePath - Path to the original file
 * @param keep - Number of backups to keep (default: 5)
 * @returns Number of backups removed
 */
export function cleanOldBackups(filePath: string, keep = 5): number {
  const backups = listBackups(filePath);

  if (backups.length <= keep) {
    return 0;
  }

  const toRemove = backups.slice(keep);
  let removed = 0;

  for (const backup of toRemove) {
    try {
      unlinkSync(backup.backupPath);
      logger.debug(`Removed old backup: ${backup.backupPath}`);
      removed++;
    } catch {
      // Continue even if we can't remove a backup
      continue;
    }
  }

  return removed;
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
