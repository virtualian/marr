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
import { standardCommand } from './commands/standard.js';
import { doctorCommand } from './commands/doctor.js';

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
  .helpOption('-h, --help', 'Show help information')
  .addHelpCommand(false)
  .addHelpText('after', `
Examples:
  $ marr init --user              Set up user-level config (run once per machine)
  $ marr init --project           Initialize current project with MARR
  $ marr init --all               Set up both user and project config
  $ marr validate                 Check configuration is valid
  $ marr doctor                   Resolve conflicts interactively
  $ marr clean --project          Remove project MARR config
  $ marr standard validate --all  Validate all standard frontmatter
  $ marr standard list            List standards with triggers

Run 'marr <command> --help' for detailed help on each command.`);

// Register commands
initCommand(program);
validateCommand(program);
cleanCommand(program);
standardCommand(program);
doctorCommand(program);

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
