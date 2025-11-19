/**
 * Validate command - Validate MARR configuration
 */

import { Command } from 'commander';
import * as logger from '../utils/logger.js';

export function validateCommand(program: Command): void {
  program
    .command('validate')
    .description('Validate MARR configuration in current project')
    .option('--strict', 'Fail on warnings')
    .action((options) => {
      logger.section('MARR Configuration Validation');

      logger.info('Validate command - Implementation coming in STEP03');
      logger.info(`Strict mode: ${options.strict ? 'enabled' : 'disabled'}`);
    });
}
