/**
 * Install Scripts command - Install GitHub helper scripts
 */

import { Command } from 'commander';
import { join } from 'path';
import * as logger from '../utils/logger.js';
import * as fileOps from '../utils/file-ops.js';
import * as marrSetup from '../utils/marr-setup.js';

export function installScriptsCommand(program: Command): void {
  program
    .command('install-scripts')
    .description('Install GitHub helper scripts to ~/bin/')
    .action(() => {
      try {
        installScripts();
      } catch (err) {
        logger.error((err as Error).message);
        process.exit(1);
      }
    });
}

function installScripts(): void {
  logger.section('MARR Helper Scripts Installation');

  // Ensure MARR is set up
  marrSetup.ensureMarrSetup();

  // Ensure ~/bin/ exists
  const binDir = join(fileOps.getHomeDir(), 'bin');
  fileOps.ensureDir(binDir);
  logger.info(`Target directory: ${binDir}`);

  // Get scripts from ~/.claude/marr/templates/helper-scripts/
  const marrRoot = fileOps.getMarrRoot();
  const scriptsSource = join(marrRoot, 'templates/helper-scripts');

  const scripts = [
    'gh-add-subissue.sh',
    'gh-list-subissues.sh',
  ];

  let installedCount = 0;

  for (const script of scripts) {
    const srcPath = join(scriptsSource, script);
    const destPath = join(binDir, script);

    if (!fileOps.exists(srcPath)) {
      logger.warning(`Script not found: ${script}`);
      continue;
    }

    // Check if script already exists
    if (fileOps.exists(destPath)) {
      logger.info(`Updating: ${script}`);
    } else {
      logger.info(`Installing: ${script}`);
    }

    // Copy script
    fileOps.copyFile(srcPath, destPath);

    // Make executable
    fileOps.makeExecutable(destPath);

    installedCount++;
  }

  logger.blank();
  logger.success(`Installed ${installedCount} script(s) to ~/bin/`);

  // Check if ~/bin is in PATH
  checkPath(binDir);

  logger.blank();
  logger.info('Helper scripts:');
  logger.log('  gh-add-subissue.sh <parent-issue> <sub-issue>');
  logger.log('  gh-list-subissues.sh <parent-issue>');
  logger.blank();
}

function checkPath(binDir: string): void {
  const pathEnv = process.env.PATH || '';
  const isInPath = pathEnv.split(':').some(p => p === binDir);

  if (!isInPath) {
    logger.blank();
    logger.warning('~/bin/ is not in your PATH');
    logger.info('Add it to your shell configuration:');
    logger.blank();

    // Detect shell
    const shell = process.env.SHELL || '';

    if (shell.includes('zsh')) {
      logger.log('  echo \'export PATH="$HOME/bin:$PATH"\' >> ~/.zshrc');
      logger.log('  source ~/.zshrc');
    } else if (shell.includes('bash')) {
      logger.log('  echo \'export PATH="$HOME/bin:$PATH"\' >> ~/.bashrc');
      logger.log('  source ~/.bashrc');
    } else {
      logger.log('  export PATH="$HOME/bin:$PATH"');
    }
  } else {
    logger.success('~/bin/ is in your PATH');
  }
}
