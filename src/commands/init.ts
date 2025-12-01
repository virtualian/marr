/**
 * Init command - Initialize MARR configuration
 *
 * Two modes:
 * - --user: Set up user-level config (~/.claude/marr/, import, helper scripts)
 * - --project: Set up project-level config (./CLAUDE.md, ./.marr/)
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
  standards: string;
  dryRun: boolean;
  force: boolean;
}

/** Available project standards */
const AVAILABLE_STANDARDS = [
  { name: 'git', file: 'prj-git-workflow-standard.md', description: 'Git workflow and branch management' },
  { name: 'testing', file: 'prj-testing-standard.md', description: 'Testing philosophy and practices' },
  { name: 'mcp', file: 'prj-mcp-usage-standard.md', description: 'MCP tool usage patterns' },
  { name: 'docs', file: 'prj-documentation-standard.md', description: 'Documentation organization' },
  { name: 'prompts', file: 'prj-prompt-writing-standard.md', description: 'How to write and modify prompts' },
];

export function initCommand(program: Command): void {
  program
    .command('init')
    .description('Initialize MARR configuration')
    .option('-u, --user', 'Set up user-level config (~/.claude/marr/, helper scripts)')
    .option('-p, --project [path]', 'Set up project-level config (./CLAUDE.md, ./.marr/)')
    .option('-a, --all [path]', 'Set up both user and project config')
    .option('-s, --standards <value>', 'Standards: all, none, list, or names (git,testing,mcp,docs,prompts)')
    .option('-n, --dry-run', 'Preview what would be created without creating')
    .option('-f, --force', 'Overwrite existing files, skip confirmations')
    .addHelpText('after', `
What gets created:
  --user      ~/.claude/marr/MARR-USER-CLAUDE.md, import in ~/.claude/CLAUDE.md, ~/bin/*.sh scripts
  --project   ./CLAUDE.md, ./.marr/*.md, ./docs/, ./plans/

Standards available (use with --project):
  git       Git workflow and branch management
  testing   Testing philosophy and practices
  mcp       MCP tool usage patterns
  docs      Documentation organization
  prompts   How to write and modify prompts

Examples:
  $ marr init --user                       First-time setup (run once per machine)
  $ marr init --project                    Interactive standard selection
  $ marr init --project --standards all    Install all standards
  $ marr init --project -s git,testing     Install specific standards only
  $ marr init --project -s none            CLAUDE.md only, no standards
  $ marr init --all                        Both user + project setup
  $ marr init --project --dry-run          Preview what would be created
  $ marr init --project --force            Overwrite existing config`)
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
  const { user, project, all, standards, dryRun, force } = options;

  // Handle --standards list (show available and exit)
  if (standards === 'list') {
    logger.section('Available Standards');
    logger.blank();
    for (const std of AVAILABLE_STANDARDS) {
      logger.log(`  ${std.name.padEnd(10)} ${std.description}`);
    }
    logger.blank();
    logger.info('Usage: marr init --project --standards git,testing,mcp,docs');
    logger.info('   or: marr init --project --standards all');
    logger.blank();
    return;
  }

  // No flags provided - show help
  if (!user && !project && !all) {
    logger.section('MARR Initialization');
    logger.blank();
    logger.info('Usage: marr init [options]');
    logger.blank();
    logger.log('Options:');
    logger.log('  -u, --user              Set up user-level config (~/.claude/marr/, helper scripts)');
    logger.log('  -p, --project [path]    Set up project-level config (./CLAUDE.md, ./.marr/)');
    logger.log('  -a, --all [path]        Set up both user and project config');
    logger.log('  -s, --standards <value> Standards: all, list, or names (git,testing,mcp,docs)');
    logger.log('  -n, --dry-run           Show what would be created without actually creating');
    logger.log('  -f, --force             Skip confirmation prompts');
    logger.blank();
    logger.info('Examples:');
    logger.log('  marr init --user                    # One-time user setup');
    logger.log('  marr init --project                 # Initialize with interactive selection');
    logger.log('  marr init --project --standards all # Initialize with all standards');
    logger.log('  marr init --project -s git,testing  # Initialize with specific standards');
    logger.log('  marr init --project -s list         # Show available standards');
    logger.log('  marr init --all                     # Both user + current project');
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
    await initializeProject(projectPath, standards, dryRun, force);
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
    logger.info('Would create: ~/.claude/marr/MARR-USER-CLAUDE.md');
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

  // Get scripts from bundled resources
  const resourcesDir = marrSetup.getResourcesDir();
  const scriptsSource = join(resourcesDir, 'helper-scripts');

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
 * Check if ~/bin is in PATH and provide clear instructions if not
 */
function checkPath(binDir: string): void {
  const pathEnv = process.env.PATH || '';
  // Check both expanded path and $HOME/bin pattern
  const homeDir = fileOps.getHomeDir();
  const isInPath = pathEnv.split(':').some(p =>
    p === binDir || p === `${homeDir}/bin` || p === '$HOME/bin'
  );

  if (isInPath) {
    logger.success('~/bin is in your PATH - helper scripts are ready to use');
    return;
  }

  logger.blank();
  logger.warning('~/bin is NOT in your PATH');
  logger.info('Helper scripts installed but won\'t be found until you add ~/bin to PATH.');
  logger.blank();

  const shell = process.env.SHELL || '';
  let shellConfig = '~/.profile';  // fallback
  let shellName = 'shell';

  if (shell.includes('zsh')) {
    shellConfig = '~/.zshrc';
    shellName = 'zsh';
  } else if (shell.includes('bash')) {
    // macOS uses .bash_profile, Linux uses .bashrc
    shellConfig = process.platform === 'darwin' ? '~/.bash_profile' : '~/.bashrc';
    shellName = 'bash';
  } else if (shell.includes('fish')) {
    shellConfig = '~/.config/fish/config.fish';
    shellName = 'fish';
  }

  logger.info(`Add to your ${shellName} config (${shellConfig}):`);
  logger.blank();

  if (shell.includes('fish')) {
    logger.log(`  echo 'set -gx PATH $HOME/bin $PATH' >> ${shellConfig}`);
  } else {
    logger.log(`  echo 'export PATH="$HOME/bin:$PATH"' >> ${shellConfig}`);
  }

  logger.blank();
  logger.info('Then restart your terminal or run:');

  if (shell.includes('fish')) {
    logger.log(`  source ${shellConfig}`);
  } else {
    logger.log(`  source ${shellConfig}`);
  }

  logger.blank();
  logger.info('After that, these commands will work:');
  logger.log('  gh-add-subissue.sh <parent> <sub>');
  logger.log('  gh-list-subissues.sh <parent>');
}

/**
 * Initialize project-level configuration
 * - Creates ./CLAUDE.md from template
 * - Creates ./.marr/ with project-level standards
 */
async function initializeProject(targetDir: string, standards: string | undefined, dryRun: boolean, force: boolean): Promise<void> {
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
  const marrPath = join(targetDir, '.marr');

  // Check if config already exists
  if (fileOps.exists(claudeMdPath) && !force) {
    logger.warning(`CLAUDE.md already exists at ${targetDir}`);
    logger.info('Use --force to overwrite existing configuration');
    return;
  }

  // Determine which standards to install
  let selectedStandards: typeof AVAILABLE_STANDARDS;

  if (standards === 'all') {
    selectedStandards = AVAILABLE_STANDARDS;
  } else if (standards === 'none' || standards === '') {
    // Explicit "none" or empty string means no standards
    selectedStandards = [];
  } else if (standards) {
    // Parse comma-separated list
    const requestedNames = standards.split(',').map(s => s.trim().toLowerCase()).filter(s => s);
    selectedStandards = AVAILABLE_STANDARDS.filter(std => requestedNames.includes(std.name));

    // Warn about unknown standards
    const knownNames = AVAILABLE_STANDARDS.map(s => s.name);
    const unknownNames = requestedNames.filter(name => !knownNames.includes(name));
    if (unknownNames.length > 0) {
      logger.warning(`Unknown standards ignored: ${unknownNames.join(', ')}`);
      logger.info(`Available: ${knownNames.join(', ')}`);
    }
  } else if (!dryRun) {
    // Interactive selection
    selectedStandards = await selectStandards();
  } else {
    // Dry run without --standards shows all (for preview purposes)
    selectedStandards = AVAILABLE_STANDARDS;
  }

  if (dryRun) {
    logger.info(`Would create: ${claudeMdPath}`);
    logger.info(`Would create: ${marrPath}/`);
    for (const std of selectedStandards) {
      logger.info(`Would create: ${marrPath}/${std.file}`);
    }
    logger.info(`Would create: ${marrPath}/README.md`);
    logger.info(`Would create: ${join(targetDir, 'docs')}/README.md`);
    logger.info(`Would create: ${join(targetDir, 'plans')}/README.md`);
    return;
  }

  // Create directories
  const dirs = [
    targetDir,
    marrPath,
    join(targetDir, 'docs'),
    join(targetDir, 'plans'),
  ];

  for (const dir of dirs) {
    fileOps.ensureDir(dir);
  }

  // Create CLAUDE.md from template
  createProjectClaudeMd(targetDir, selectedStandards);

  // Copy selected project-level prompts
  copyProjectPrompts(targetDir, selectedStandards);

  // Copy README files to docs/ and plans/
  copyFolderReadmes(targetDir);

  logger.blank();
  logger.success('Project configuration created!');
  logger.blank();
  logger.info('Next steps:');
  logger.log('  1. Review CLAUDE.md and customize for your project');
  if (selectedStandards.length > 0) {
    logger.log('  2. Review .marr/ and adjust standards as needed');
  }
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
 * Interactive prompt for selecting which standards to install
 */
async function selectStandards(): Promise<typeof AVAILABLE_STANDARDS> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        resolve(answer);
      });
    });
  };

  logger.info('Select standards to install (Enter to skip, "all" for all):');
  logger.blank();

  const selected: typeof AVAILABLE_STANDARDS = [];

  for (const std of AVAILABLE_STANDARDS) {
    const answer = await question(`  Install ${std.name}? (${std.description}) [y/N/all] `);
    const normalized = answer.toLowerCase().trim();

    if (normalized === 'all') {
      rl.close();
      logger.blank();
      return AVAILABLE_STANDARDS;
    }

    if (normalized === 'y' || normalized === 'yes') {
      selected.push(std);
    }
  }

  rl.close();
  logger.blank();

  if (selected.length === 0) {
    logger.info('No standards selected. Project will have CLAUDE.md only.');
  } else {
    logger.info(`Selected: ${selected.map(s => s.name).join(', ')}`);
  }

  return selected;
}

/**
 * Create project CLAUDE.md from template
 */
function createProjectClaudeMd(targetDir: string, selectedStandards: typeof AVAILABLE_STANDARDS): void {
  const destPath = join(targetDir, 'CLAUDE.md');

  // Get project name from directory
  const projectName = targetDir.split('/').pop() || 'Project';

  // Build standards compliance section - reference folder instead of individual files
  // This allows new standards to be auto-discovered without updating CLAUDE.md
  let standardsSection = '';
  if (selectedStandards.length > 0) {
    standardsSection = `## Standards Compliance

This project follows the standards defined in @.marr/

`;
  }

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

${standardsSection}## Development Notes

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
 * Copy project-level prompts to ./.marr/
 */
function copyProjectPrompts(targetDir: string, selectedStandards: typeof AVAILABLE_STANDARDS): void {
  const resourcesDir = marrSetup.getResourcesDir();
  const promptsSource = join(resourcesDir, 'project/common');
  const marrDest = join(targetDir, '.marr');

  // Copy selected standard files
  for (const std of selectedStandards) {
    const srcPath = join(promptsSource, std.file);
    const destPath = join(marrDest, std.file);

    if (fileOps.exists(srcPath)) {
      fileOps.copyFile(srcPath, destPath);
      logger.success(`Created: .marr/${std.file}`);
    } else {
      logger.warning(`Resource not found: ${std.file}`);
    }
  }

  // Always copy README.md
  const readmeSrc = join(promptsSource, 'README.md');
  const readmeDest = join(marrDest, 'README.md');
  if (fileOps.exists(readmeSrc)) {
    fileOps.copyFile(readmeSrc, readmeDest);
    logger.success('Created: .marr/README.md');
  }
}

/**
 * Copy README files to docs/ and plans/ directories
 */
function copyFolderReadmes(targetDir: string): void {
  const resourcesDir = marrSetup.getResourcesDir();

  const folders = ['docs', 'plans'];

  for (const folder of folders) {
    const srcPath = join(resourcesDir, 'project', folder, 'README.md');
    const destPath = join(targetDir, folder, 'README.md');

    if (fileOps.exists(srcPath)) {
      fileOps.copyFile(srcPath, destPath);
      logger.success(`Created: ${folder}/README.md`);
    }
  }
}
