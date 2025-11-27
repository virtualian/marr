/**
 * Init command - Initialize MARR configuration
 *
 * Two modes:
 * - --user: Set up user-level config (~/.claude/marr/, import, helper scripts)
 * - --project: Set up project-level config (./CLAUDE.md, ./prompts/)
 * - --all: Both user + project
 */

import { Command } from 'commander';
import { join, resolve } from 'path';
import * as readline from 'readline';
import * as logger from '../utils/logger.js';
import * as fileOps from '../utils/file-ops.js';
import * as marrSetup from '../utils/marr-setup.js';

interface InitOptions {
  user: boolean;
  project: string | boolean;
  all: string | boolean;
  dryRun: boolean;
  force: boolean;
}

export function initCommand(program: Command): void {
  program
    .command('init')
    .description('Initialize MARR configuration')
    .option('-u, --user', 'Set up user-level config (~/.claude/marr/, helper scripts)')
    .option('-p, --project [path]', 'Set up project-level config (./CLAUDE.md, ./prompts/)')
    .option('-a, --all [path]', 'Set up both user and project config')
    .option('-n, --dry-run', 'Show what would be created without actually creating')
    .option('-f, --force', 'Skip confirmation prompts')
    .action(async (options: InitOptions) => {
      try {
        await executeInit(options);
      } catch (err) {
        logger.error((err as Error).message);
        process.exit(1);
      }
    });
}

async function executeInit(options: InitOptions): Promise<void> {
  const { user, project, all, dryRun, force } = options;

  // No flags provided - show help
  if (!user && !project && !all) {
    logger.section('MARR Initialization');
    logger.blank();
    logger.info('Usage: marr init [options]');
    logger.blank();
    logger.log('Options:');
    logger.log('  -u, --user           Set up user-level config (~/.claude/marr/, helper scripts)');
    logger.log('  -p, --project [path] Set up project-level config (./CLAUDE.md, ./prompts/)');
    logger.log('  -a, --all [path]     Set up both user and project config');
    logger.log('  -n, --dry-run        Show what would be created without actually creating');
    logger.log('  -f, --force          Skip confirmation prompts');
    logger.blank();
    logger.info('Examples:');
    logger.log('  marr init --user               # One-time user setup');
    logger.log('  marr init --project            # Initialize current directory');
    logger.log('  marr init --project /path/to   # Initialize specific directory');
    logger.log('  marr init --all                # Both user + current project');
    logger.blank();
    return;
  }

  // Determine what to initialize
  const initUser = user || all !== undefined;
  const initProject = project !== undefined || all !== undefined;

  // Get project path if initializing project
  let projectPath: string | undefined;
  if (initProject) {
    // --all can have a path, --project can have a path
    if (typeof all === 'string') {
      projectPath = resolve(all);
    } else if (typeof project === 'string') {
      projectPath = resolve(project);
    } else {
      projectPath = process.cwd();
    }
  }

  // Show what will happen
  logger.section(dryRun ? 'MARR Initialization (Dry Run)' : 'MARR Initialization');

  // Run user init if requested
  if (initUser) {
    await initializeUser(dryRun, force);
  }

  // Run project init if requested
  if (initProject && projectPath) {
    await initializeProject(projectPath, dryRun, force);
  }

  // Summary
  logger.blank();
  if (dryRun) {
    logger.info('Dry run complete. Run without --dry-run to apply changes.');
  } else {
    logger.success('MARR initialization complete!');
  }
}

/**
 * Initialize user-level configuration
 * - Creates ~/.claude/marr/ with MARR configuration
 * - Adds import line to ~/.claude/CLAUDE.md
 * - Installs helper scripts to ~/bin/
 */
async function initializeUser(dryRun: boolean, force: boolean): Promise<void> {
  logger.info('User-level setup...');
  logger.blank();

  const binDir = join(fileOps.getHomeDir(), 'bin');

  // Check if already set up
  if (marrSetup.isMarrSetup()) {
    if (!force) {
      logger.warning('User-level MARR configuration already exists at ~/.claude/marr/');
      logger.info('Use --force to overwrite existing configuration');
      logger.blank();

      // Still check for import and scripts
      if (!marrSetup.hasMarrImport() && !dryRun) {
        marrSetup.addMarrImport();
        logger.success('Added MARR import to ~/.claude/CLAUDE.md');
      }

      // Still install/update scripts
      await installHelperScripts(binDir, dryRun);
      return;
    }
  }

  if (dryRun) {
    logger.info('Would create: ~/.claude/marr/');
    logger.info('Would create: ~/.claude/marr/CLAUDE.md');
    logger.info('Would add: MARR import to ~/.claude/CLAUDE.md');
    await installHelperScripts(binDir, true);
    return;
  }

  // Set up MARR infrastructure
  marrSetup.setupMarr();

  // Install helper scripts
  await installHelperScripts(binDir, false);
}

/**
 * Install helper scripts to ~/bin/
 */
async function installHelperScripts(binDir: string, dryRun: boolean): Promise<void> {
  logger.info('Helper scripts...');

  // Ensure ~/bin/ exists
  if (!dryRun) {
    fileOps.ensureDir(binDir);
  }

  // Get scripts from bundled templates
  const templatesDir = marrSetup.getTemplatesDir();
  const scriptsSource = join(templatesDir, 'helper-scripts');

  const scripts = [
    'gh-add-subissue.sh',
    'gh-list-subissues.sh',
  ];

  for (const script of scripts) {
    const srcPath = join(scriptsSource, script);
    const destPath = join(binDir, script);

    if (!fileOps.exists(srcPath)) {
      logger.warning(`Script not found in package: ${script}`);
      continue;
    }

    if (dryRun) {
      if (fileOps.exists(destPath)) {
        logger.info(`Would update: ~/bin/${script}`);
      } else {
        logger.info(`Would install: ~/bin/${script}`);
      }
      continue;
    }

    // Copy and make executable
    fileOps.copyFile(srcPath, destPath);
    fileOps.makeExecutable(destPath);

    if (fileOps.exists(destPath)) {
      logger.success(`Installed: ~/bin/${script}`);
    }
  }

  // Check PATH
  if (!dryRun) {
    checkPath(binDir);
  }
}

/**
 * Check if ~/bin is in PATH and warn if not
 */
function checkPath(binDir: string): void {
  const pathEnv = process.env.PATH || '';
  const isInPath = pathEnv.split(':').some(p => p === binDir);

  if (!isInPath) {
    logger.blank();
    logger.warning('~/bin/ is not in your PATH');
    logger.info('Add it to your shell configuration:');
    logger.blank();

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
  }
}

/**
 * Initialize project-level configuration
 * - Creates ./CLAUDE.md from template
 * - Creates ./prompts/ with project-level standards
 */
async function initializeProject(targetDir: string, dryRun: boolean, force: boolean): Promise<void> {
  logger.blank();
  logger.info('Project-level setup...');
  logger.info(`Target: ${targetDir}`);
  logger.blank();

  // Confirm path unless --force
  if (!force && !dryRun) {
    const confirmed = await confirmPath(targetDir);
    if (!confirmed) {
      logger.info('Cancelled.');
      return;
    }
  }

  const claudeMdPath = join(targetDir, 'CLAUDE.md');
  const promptsPath = join(targetDir, 'prompts');

  // Check if config already exists
  if (fileOps.exists(claudeMdPath) && !force) {
    logger.warning(`CLAUDE.md already exists at ${targetDir}`);
    logger.info('Use --force to overwrite existing configuration');
    return;
  }

  if (dryRun) {
    logger.info(`Would create: ${claudeMdPath}`);
    logger.info(`Would create: ${promptsPath}/`);
    logger.info(`Would create: ${promptsPath}/prj-git-workflow-standard.md`);
    logger.info(`Would create: ${promptsPath}/prj-testing-standard.md`);
    logger.info(`Would create: ${promptsPath}/prj-mcp-usage-standard.md`);
    logger.info(`Would create: ${promptsPath}/prj-documentation-standard.md`);
    logger.info(`Would create: ${promptsPath}/README.md`);
    logger.info(`Would create: ${join(targetDir, 'docs')}/README.md`);
    logger.info(`Would create: ${join(targetDir, 'plans')}/README.md`);
    return;
  }

  // Create directories
  const dirs = [
    targetDir,
    promptsPath,
    join(targetDir, 'docs'),
    join(targetDir, 'plans'),
  ];

  for (const dir of dirs) {
    fileOps.ensureDir(dir);
  }

  // Create CLAUDE.md from template
  createProjectClaudeMd(targetDir);

  // Copy project-level prompts
  copyProjectPrompts(targetDir);

  // Copy README files to docs/ and plans/
  copyFolderReadmes(targetDir);

  logger.blank();
  logger.success('Project configuration created!');
  logger.blank();
  logger.info('Next steps:');
  logger.log('  1. Review CLAUDE.md and customize for your project');
  logger.log('  2. Review prompts/ and adjust standards as needed');
  logger.log('  3. Run: marr validate');
}

/**
 * Ask user to confirm target directory
 */
async function confirmPath(targetDir: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`Create MARR configuration in ${targetDir}? [y/N] `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * Create project CLAUDE.md from template
 */
function createProjectClaudeMd(targetDir: string): void {
  const destPath = join(targetDir, 'CLAUDE.md');

  // Get project name from directory
  const projectName = targetDir.split('/').pop() || 'Project';

  // Simple template - no fancy multi-template system
  const content = `# ${projectName}

> [!IMPORTANT]
>
> This is the Project-level configuration (Layer 2 of 2):
>
> - User file: \`~/.claude/CLAUDE.md\` - contains User preferences & default standards
> - This file: \`./CLAUDE.md\` (at project root) contains Project-specific information
>
> **Precedence**
>
> Project \`./CLAUDE.md\` overrides technical standards but preserves personal preferences.

## Project Overview

**${projectName}** - [Add project description]

## Startup Imperatives

When starting work in this repository:
- Review the project structure
- Check for any project-specific configuration files

## Standards Compliance

This project follows the standards defined in:
- @prompts/prj-git-workflow-standard.md
- @prompts/prj-testing-standard.md
- @prompts/prj-mcp-usage-standard.md
- @prompts/prj-documentation-standard.md

## Development Notes

Add project-specific notes, conventions, or important reminders here.

## Dependencies

List key dependencies or tools required for this project.

## Common Tasks

Document common development tasks, commands, or workflows.
`;

  fileOps.writeFile(destPath, content);
  logger.success('Created: CLAUDE.md');
}

/**
 * Copy project-level prompts to ./prompts/
 */
function copyProjectPrompts(targetDir: string): void {
  const templatesDir = marrSetup.getTemplatesDir();
  const promptsSource = join(templatesDir, 'project/common');
  const promptsDest = join(targetDir, 'prompts');

  const promptFiles = [
    'prj-git-workflow-standard.md',
    'prj-testing-standard.md',
    'prj-mcp-usage-standard.md',
    'prj-documentation-standard.md',
    'README.md',
  ];

  for (const file of promptFiles) {
    const srcPath = join(promptsSource, file);
    const destPath = join(promptsDest, file);

    if (fileOps.exists(srcPath)) {
      fileOps.copyFile(srcPath, destPath);
      logger.success(`Created: prompts/${file}`);
    } else {
      logger.warning(`Template not found: ${file}`);
    }
  }
}

/**
 * Copy README files to docs/ and plans/ directories
 */
function copyFolderReadmes(targetDir: string): void {
  const templatesDir = marrSetup.getTemplatesDir();

  const folders = ['docs', 'plans'];

  for (const folder of folders) {
    const srcPath = join(templatesDir, 'project', folder, 'README.md');
    const destPath = join(targetDir, folder, 'README.md');

    if (fileOps.exists(srcPath)) {
      fileOps.copyFile(srcPath, destPath);
      logger.success(`Created: ${folder}/README.md`);
    }
  }
}
