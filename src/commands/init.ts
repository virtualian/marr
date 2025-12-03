/**
 * Init command - Initialize MARR configuration
 *
 * Two modes:
 * - --user: Set up user-level config (~/.claude/marr/, import, helper scripts)
 * - --project: Set up project-level config (./.claude/marr/, import in ./CLAUDE.md)
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

/** Required standard - always installed regardless of selection */
const REQUIRED_STANDARD = 'prj-what-is-a-standard.md';

/** Available project standards with trigger conditions */
const AVAILABLE_STANDARDS = [
  { name: 'workflow', file: 'prj-workflow-standard.md', description: 'Workflow and branch management', trigger: 'Read before starting work, git commits, PRs' },
  { name: 'testing', file: 'prj-testing-standard.md', description: 'Testing philosophy and practices', trigger: 'Read before running or writing tests' },
  { name: 'mcp', file: 'prj-mcp-usage-standard.md', description: 'MCP tool usage patterns', trigger: 'Read before using MCP tools' },
  { name: 'docs', file: 'prj-documentation-standard.md', description: 'Documentation organization', trigger: 'Read before creating or modifying documentation' },
  { name: 'prompts', file: 'prj-writing-prompts-standard.md', description: 'How to write and modify prompts', trigger: 'Read before modifying prompt or standard files' },
  { name: 'ui-ux', file: 'prj-ui-ux-standard.md', description: 'UI/UX development standards', trigger: 'Read before UI/UX work or component generation' },
];

export function initCommand(program: Command): void {
  program
    .command('init')
    .description('Initialize MARR configuration')
    .option('-u, --user', 'Set up user-level config (~/.claude/marr/, helper scripts)')
    .option('-p, --project [path]', 'Set up project-level config (./.claude/marr/, import in ./CLAUDE.md)')
    .option('-a, --all [path]', 'Set up both user and project config')
    .option('-s, --standards <value>', 'Standards: all, none, list, or names (workflow,testing,mcp,docs,prompts,ui-ux)')
    .option('-n, --dry-run', 'Preview what would be created without creating')
    .option('-f, --force', 'Overwrite existing files, skip confirmations')
    .addHelpText('after', `
What gets created:
  --user      ~/.claude/marr/MARR-USER-CLAUDE.md, import in ~/.claude/CLAUDE.md, ~/bin/*.sh scripts
  --project   ./.claude/marr/MARR-PROJECT-CLAUDE.md, ./.claude/marr/standards/*.md, import in ./CLAUDE.md

Standards available (use with --project):
  workflow  Workflow and branch management
  testing   Testing philosophy and practices
  mcp       MCP tool usage patterns
  docs      Documentation organization
  prompts   How to write and modify prompts
  ui-ux     UI/UX development standards

Note: prj-what-is-a-standard.md is always installed (required).

Examples:
  $ marr init --user                       First-time setup (run once per machine)
  $ marr init --project                    Interactive standard selection
  $ marr init --project --standards all    Install all standards
  $ marr init --project -s workflow,testing Install specific standards only
  $ marr init --project -s none            Required standard only, no optional standards
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
    logger.log('  -p, --project [path]    Set up project-level config (./.claude/marr/, import in ./CLAUDE.md)');
    logger.log('  -a, --all [path]        Set up both user and project config');
    logger.log('  -s, --standards <value> Standards: all, list, or names (workflow,testing,mcp,docs,prompts,ui-ux)');
    logger.log('  -n, --dry-run           Show what would be created without actually creating');
    logger.log('  -f, --force             Skip confirmation prompts');
    logger.blank();
    logger.info('Examples:');
    logger.log('  marr init --user                    # One-time user setup');
    logger.log('  marr init --project                 # Initialize with interactive selection');
    logger.log('  marr init --project --standards all # Initialize with all standards');
    logger.log('  marr init --project -s workflow,testing  # Initialize with specific standards');
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
    'marr-gh-add-subissue.sh',
    'marr-gh-list-subissues.sh',
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
  logger.log('  marr-gh-add-subissue.sh <parent> <sub>');
  logger.log('  marr-gh-list-subissues.sh <parent>');
}

/**
 * Initialize project-level configuration
 * - Creates ./.claude/marr/MARR-PROJECT-CLAUDE.md
 * - Creates ./.claude/marr/prompts/ with project-level standards
 * - Adds import line to ./CLAUDE.md (creates if needed)
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

  const marrPath = join(targetDir, '.claude', 'marr');
  const standardsPath = join(marrPath, 'standards');
  const marrProjectClaudeMdPath = join(marrPath, 'MARR-PROJECT-CLAUDE.md');

  // Detect which CLAUDE.md location the project uses (or default to root)
  const rootClaudeMdPath = join(targetDir, 'CLAUDE.md');
  const dotClaudeClaudeMdPath = join(targetDir, '.claude', 'CLAUDE.md');

  // Priority: 1) ./CLAUDE.md if exists, 2) ./.claude/CLAUDE.md if exists, 3) create ./CLAUDE.md
  let projectClaudeMdPath: string;
  if (fileOps.exists(rootClaudeMdPath)) {
    projectClaudeMdPath = rootClaudeMdPath;
  } else if (fileOps.exists(dotClaudeClaudeMdPath)) {
    projectClaudeMdPath = dotClaudeClaudeMdPath;
  } else {
    projectClaudeMdPath = rootClaudeMdPath; // Default: create at root (more discoverable)
  }

  // Check if MARR config already exists
  if (fileOps.exists(marrProjectClaudeMdPath) && !force) {
    logger.warning(`MARR-PROJECT-CLAUDE.md already exists at .claude/marr/`);
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
    logger.info(`Would create: ${marrPath}/`);
    logger.info(`Would create: ${marrProjectClaudeMdPath}`);
    logger.info(`Would create: ${marrPath}/README.md`);
    // Standards directory always created (required standard is always installed)
    logger.info(`Would create: ${standardsPath}/`);
    logger.info(`Would create: ${standardsPath}/${REQUIRED_STANDARD} (required)`);
    for (const std of selectedStandards) {
      logger.info(`Would create: ${standardsPath}/${std.file}`);
    }
    if (fileOps.exists(projectClaudeMdPath)) {
      logger.info(`Would add: MARR import to ${projectClaudeMdPath}`);
    } else {
      logger.info(`Would create: ${projectClaudeMdPath} with MARR import`);
    }
    return;
  }

  // Create directories (standards directory always created for required standard)
  fileOps.ensureDir(marrPath);
  fileOps.ensureDir(standardsPath);

  // Copy MARR-PROJECT-CLAUDE.md template
  copyMarrProjectClaudeMd(marrPath);

  // Create .claude/marr/README.md
  createMarrReadme(marrPath);

  // Copy required standard (always installed)
  copyRequiredStandard(standardsPath);

  // Copy selected project-level standards
  if (selectedStandards.length > 0) {
    copyProjectStandards(standardsPath, selectedStandards);
  }

  // Handle project root CLAUDE.md
  addProjectClaudeMdImport(projectClaudeMdPath, targetDir);

  logger.blank();
  logger.success('Project configuration created!');
  logger.blank();
  logger.info('Next steps:');
  logger.log('  1. Review .claude/marr/MARR-PROJECT-CLAUDE.md and customize for your project');
  logger.log('  2. Review .claude/marr/standards/ and adjust as needed');
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
    logger.info('No standards selected. Project will have MARR-PROJECT-CLAUDE.md only.');
  } else {
    logger.info(`Selected: ${selected.map(s => s.name).join(', ')}`);
  }

  return selected;
}

/** MARR import line for project CLAUDE.md */
const MARR_PROJECT_IMPORT_LINE = '@.claude/marr/MARR-PROJECT-CLAUDE.md';
const MARR_PROJECT_IMPORT_COMMENT = '<!-- MARR: Making Agents Really Reliable -->';

/**
 * Copy MARR-PROJECT-CLAUDE.md template to .claude/marr/
 */
function copyMarrProjectClaudeMd(marrPath: string): void {
  const resourcesDir = marrSetup.getResourcesDir();
  const srcPath = join(resourcesDir, 'project/MARR-PROJECT-CLAUDE.md');
  const destPath = join(marrPath, 'MARR-PROJECT-CLAUDE.md');

  if (fileOps.exists(srcPath)) {
    fileOps.copyFile(srcPath, destPath);
    logger.success('Created: .claude/marr/MARR-PROJECT-CLAUDE.md');
  } else {
    logger.warning('MARR-PROJECT-CLAUDE.md template not found');
  }
}

/**
 * Copy the required standard (always installed regardless of selection)
 */
function copyRequiredStandard(standardsPath: string): void {
  const resourcesDir = marrSetup.getResourcesDir();
  const srcPath = join(resourcesDir, 'project/common', REQUIRED_STANDARD);
  const destPath = join(standardsPath, REQUIRED_STANDARD);

  if (fileOps.exists(srcPath)) {
    fileOps.copyFile(srcPath, destPath);
    logger.success(`Created: .claude/marr/standards/${REQUIRED_STANDARD} (required)`);
  } else {
    logger.warning(`Required standard not found: ${REQUIRED_STANDARD}`);
  }
}

/**
 * Create README.md for .claude/marr/ directory
 */
function createMarrReadme(marrPath: string): void {
  const destPath = join(marrPath, 'README.md');

  const content = `# MARR Project Configuration

This directory contains MARR (Making Agents Really Reliable) configuration for this project.

## Structure

\`\`\`
.claude/marr/
├── MARR-PROJECT-CLAUDE.md   # Project-specific AI agent configuration
├── README.md                # This file
└── standards/               # Project-level standards
    ├── prj-what-is-a-standard.md  # Required - always installed
    ├── prj-workflow-standard.md
    ├── prj-testing-standard.md
    └── ...
\`\`\`

## How It Works

1. Project root \`CLAUDE.md\` imports \`@.claude/marr/MARR-PROJECT-CLAUDE.md\`
2. MARR-PROJECT-CLAUDE.md defines trigger conditions for standards
3. When a trigger is met, the AI agent reads that standard before proceeding

## Customization

Edit files in this directory to match your project's needs. Changes are version-controlled with your project.

## Validation

Run \`marr validate\` to check configuration is correct.
`;

  fileOps.writeFile(destPath, content);
  logger.success('Created: .claude/marr/README.md');
}

/**
 * Copy project-level standards to standards/ directory
 */
function copyProjectStandards(standardsPath: string, selectedStandards: typeof AVAILABLE_STANDARDS): void {
  const resourcesDir = marrSetup.getResourcesDir();
  const standardsSource = join(resourcesDir, 'project/common');

  // Copy selected standard files
  for (const std of selectedStandards) {
    const srcPath = join(standardsSource, std.file);
    const destPath = join(standardsPath, std.file);

    if (fileOps.exists(srcPath)) {
      fileOps.copyFile(srcPath, destPath);
      logger.success(`Created: .claude/marr/standards/${std.file}`);
    } else {
      logger.warning(`Resource not found: ${std.file}`);
    }
  }

  // Note: No README in standards/ - it would be loaded as a prompt by Claude Code
}

/**
 * Add MARR import to project root CLAUDE.md
 * Creates file if it doesn't exist, adds import if it does
 */
function addProjectClaudeMdImport(claudeMdPath: string, targetDir: string): void {
  const projectName = targetDir.split('/').pop() || 'Project';

  if (!fileOps.exists(claudeMdPath)) {
    // Create new CLAUDE.md with MARR import
    const content = `# ${projectName}

${MARR_PROJECT_IMPORT_COMMENT}
${MARR_PROJECT_IMPORT_LINE}

Add project-specific Claude Code configuration here.
`;
    fileOps.writeFile(claudeMdPath, content);
    logger.success('Created: CLAUDE.md with MARR import');
    return;
  }

  // File exists - check if import already present
  const existingContent = fileOps.readFile(claudeMdPath);
  if (existingContent.includes(MARR_PROJECT_IMPORT_LINE)) {
    logger.info('MARR import already present in CLAUDE.md');
    return;
  }

  // Add import after first heading or at top
  const lines = existingContent.split('\n');
  const firstHeadingIndex = lines.findIndex(line => line.startsWith('# '));

  const importBlock = `\n${MARR_PROJECT_IMPORT_COMMENT}\n${MARR_PROJECT_IMPORT_LINE}\n`;

  let newContent: string;
  if (firstHeadingIndex >= 0) {
    // Insert after first heading
    lines.splice(firstHeadingIndex + 1, 0, importBlock);
    newContent = lines.join('\n');
  } else {
    // Prepend to file
    newContent = importBlock + '\n' + existingContent;
  }

  fileOps.writeFile(claudeMdPath, newContent);
  logger.success('Added: MARR import to CLAUDE.md');
}
