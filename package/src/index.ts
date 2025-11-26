#!/usr/bin/env node

/**
 * MARR CLI - Making Agents Really Reliable
 * Main entry point for the marr command-line tool
 */

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import commands
import { initCommand } from './commands/init.js';
import { validateCommand } from './commands/validate.js';
import { cleanCommand } from './commands/clean.js';

// Get package.json for version
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8')
) as { version: string };

// Create CLI program
const program = new Command();

program
  .name('marr')
  .description('MARR - Making Agents Really Reliable\nAI agent configuration system for consistent project context and standards')
  .version(packageJson.version, '-v, --version', 'Show version number')
  .helpOption('-h, --help', 'Show help information');

// Register commands
initCommand(program);
validateCommand(program);
cleanCommand(program);

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
