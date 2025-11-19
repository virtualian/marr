/**
 * Init command - Initialize new project with MARR configuration
 */

import { Command } from 'commander';
import * as logger from '../utils/logger.js';

export function initCommand(program: Command): void {
  program
    .command('init')
    .description('Initialize new project with MARR configuration')
    .option('-n, --name <name>', 'Project name (required)')
    .option('-t, --type <type>', 'Project type/description', 'software project')
    .option('--template <template>', 'CLAUDE.md template: basic|standards|dev-guide|status', 'basic')
    .option('--dir <path>', 'Target directory', '.')
    .action((options) => {
      logger.section('MARR Project Initialization');

      if (!options.name) {
        logger.error('Project name is required (--name or -n)');
        process.exit(1);
      }

      logger.info('Init command - Implementation coming in STEP02');
      logger.info(`Project: ${options.name}`);
      logger.info(`Type: ${options.type}`);
      logger.info(`Template: ${options.template}`);
      logger.info(`Directory: ${options.dir}`);
    });
}
