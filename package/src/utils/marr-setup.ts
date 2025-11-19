/**
 * MARR setup utility
 * Handles first-run initialization of ~/.marr/ infrastructure
 */

import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fileOps from './file-ops.js';
import * as logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get path to bundled templates directory
 */
export function getTemplatesDir(): string {
  // In built package: dist/utils/marr-setup.js -> templates/
  return join(__dirname, '../../templates');
}

/**
 * Check if MARR is already set up at ~/.marr/
 */
export function isMarrSetup(): boolean {
  const marrRoot = fileOps.getMarrRoot();
  return fileOps.exists(marrRoot) && fileOps.isDirectory(marrRoot);
}

/**
 * Initialize ~/.marr/ infrastructure
 * Creates directory structure and copies templates
 */
export function setupMarr(): void {
  const marrRoot = fileOps.getMarrRoot();

  if (isMarrSetup()) {
    logger.debug('MARR already set up at ~/.marr/');
    return;
  }

  logger.section('First-Run MARR Setup');
  logger.info('Creating ~/.marr/ infrastructure...');

  // Create directory structure
  const dirs = [
    marrRoot,
    join(marrRoot, 'bin'),
    join(marrRoot, 'config'),
    join(marrRoot, 'templates'),
    join(marrRoot, 'templates/user'),
    join(marrRoot, 'templates/project'),
    join(marrRoot, 'templates/project/common'),
    join(marrRoot, 'templates/claude-md'),
    join(marrRoot, 'templates/helper-scripts'),
  ];

  for (const dir of dirs) {
    fileOps.ensureDir(dir);
  }

  // Copy templates from package to ~/.marr/
  const templatesSource = getTemplatesDir();
  const templatesDest = join(marrRoot, 'templates');

  copyTemplates(templatesSource, templatesDest);

  logger.success('MARR infrastructure created at ~/.marr/');
  logger.blank();
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
  }
}
