/**
 * Install Scripts command - Install GitHub helper scripts
 */

import { Command } from 'commander';
import * as logger from '../utils/logger.js';

export function installScriptsCommand(program: Command): void {
  program
    .command('install-scripts')
    .description('Install GitHub helper scripts to ~/bin/')
    .action(() => {
      logger.section('MARR Helper Scripts Installation');

      logger.info('Install-scripts command - Implementation coming in STEP04');
    });
}
