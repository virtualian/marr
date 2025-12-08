/**
 * Init command - Initialize MARR configuration
 *
 * Two modes:
 * - --user: Set up user-level config (~/.claude/marr/, import)
 * - --project: Set up project-level config (./.claude/marr/, import in ./CLAUDE.md)
 * - --all: Both user + project
 */

import { Command } from 'commander';
import { join, resolve, basename } from 'path';
import * as readline from 'readline';
import matter from 'gray-matter';
import * as logger from '../utils/logger.js';
import * as fileOps from '../utils/file-ops.js';
import * as marrSetup from '../utils/marr-setup.js';
import { registerProject } from '../utils/project-registry.js';

interface InitOptions {
  user: boolean;
  project: string | boolean;
  all: string | boolean;
  standards: string;
  dryRun: boolean;
  force: boolean;
}

/** Standard metadata extracted from frontmatter */
interface StandardInfo {
  name: string;       // Short name derived from filename (e.g., 'workflow')
  file: string;       // Full filename (e.g., 'prj-workflow-standard.md')
  title: string;      // From frontmatter
  description: string; // From frontmatter scope
}

/**
 * Discover available standards from resources/project/common/
 * Reads frontmatter to extract metadata
 */
function discoverAvailableStandards(): StandardInfo[] {
  const resourcesDir = marrSetup.getResourcesDir();
  const standardsSource = join(resourcesDir, 'project/common');

  if (!fileOps.exists(standardsSource)) {
    return [];
  }

  const files = fileOps.listFiles(standardsSource, false);
  const standards: StandardInfo[] = [];

  for (const filePath of files) {
    const filename = basename(filePath);

    // Only process prj-*-standard.md files
    if (!filename.startsWith('prj-') || !filename.endsWith('-standard.md')) {
      continue;
    }

    try {
      const content = fileOps.readFile(filePath);
      const parsed = matter(content);

      // Skip files without valid frontmatter
      if (parsed.data.marr !== 'standard') {
        continue;
      }

      // Extract short name from filename: prj-workflow-standard.md -> workflow
      const name = filename
        .replace(/^prj-/, '')
        .replace(/-standard\.md$/, '');

      standards.push({
        name,
        file: filename,
        title: parsed.data.title || name,
        description: parsed.data.scope || 'No description',
      });
    } catch {
      // Skip files that can't be parsed
      continue;
    }
  }

  // Sort alphabetically by name for consistent ordering
  return standards.sort((a, b) => a.name.localeCompare(b.name));
}

// Cache discovered standards (lazy loaded)
let _availableStandards: StandardInfo[] | null = null;

function getAvailableStandards(): StandardInfo[] {
  if (_availableStandards === null) {
    _availableStandards = discoverAvailableStandards();
  }
  return _availableStandards;
}

export function initCommand(program: Command): void {
  program
    .command('init')
    .description('Initialize MARR configuration')
    .option('-u, --user', 'Set up user-level config (~/.claude/marr/)')
    .option('-p, --project [path]', 'Set up project-level config (./.claude/marr/, import in ./CLAUDE.md)')
    .option('-a, --all [path]', 'Set up both user and project config')
    .option('-s, --standards <value>', 'Standards: all, none, list, or names (workflow,testing,mcp,docs,prompts,ui-ux)')
    .option('-n, --dry-run', 'Preview what would be created without creating')
    .option('-f, --force', 'Overwrite existing files, skip confirmations')
    .addHelpText('after', `
What gets created:
  --user      ~/.claude/marr/MARR-USER-CLAUDE.md, import in ~/.claude/CLAUDE.md
  --project   ./.claude/marr/MARR-PROJECT-CLAUDE.md, ./.claude/marr/standards/*.md, import in ./CLAUDE.md

Standards are discovered from bundled resources. Use --standards list to see available.

Examples:
  $ marr init --user                       First-time setup (run once per machine)
  $ marr init --project                    Interactive standard selection
  $ marr init --project --standards all    Install all standards
  $ marr init --project -s workflow,testing Install specific standards only
  $ marr init --project -s none            No standards (config file only)
  $ marr init --project -s list            Show available standards
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
    const availableStandards = getAvailableStandards();
    logger.section('Available Standards');
    logger.blank();
    if (availableStandards.length === 0) {
      logger.warning('No standards found in bundled resources');
    } else {
      for (const std of availableStandards) {
        logger.log(`  ${std.name.padEnd(12)} ${std.description}`);
      }
      logger.blank();
      const names = availableStandards.map(s => s.name).join(',');
      logger.info(`Usage: marr init --project --standards ${names}`);
      logger.info('   or: marr init --project --standards all');
    }
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
    logger.log('  -s, --standards <value> Standards: all, none, list, or comma-separated names');
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
 */
async function initializeUser(dryRun: boolean, force: boolean): Promise<void> {
  logger.info('User-level setup...');
  logger.blank();

  // Check if already set up
  if (marrSetup.isMarrSetup()) {
    if (!force) {
      logger.warning('User-level MARR configuration already exists at ~/.claude/marr/');
      logger.info('Use --force to overwrite existing configuration');
      logger.blank();

      // Still check for import
      if (!marrSetup.hasMarrImport() && !dryRun) {
        marrSetup.addMarrImport();
        logger.success('Added MARR import to ~/.claude/CLAUDE.md');
      }

      return;
    }
  }

  if (dryRun) {
    logger.info('Would create: ~/.claude/marr/');
    logger.info('Would create: ~/.claude/marr/MARR-USER-CLAUDE.md');
    logger.info('Would add: MARR import to ~/.claude/CLAUDE.md');
    return;
  }

  // Set up MARR infrastructure
  marrSetup.setupMarr();
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
  const availableStandards = getAvailableStandards();
  let selectedStandards: StandardInfo[];

  if (standards === 'all') {
    selectedStandards = availableStandards;
  } else if (standards === 'none' || standards === '') {
    // Explicit "none" or empty string means no standards
    selectedStandards = [];
  } else if (standards) {
    // Parse comma-separated list
    const requestedNames = standards.split(',').map(s => s.trim().toLowerCase()).filter(s => s);
    selectedStandards = availableStandards.filter(std => requestedNames.includes(std.name));

    // Warn about unknown standards
    const knownNames = availableStandards.map(s => s.name);
    const unknownNames = requestedNames.filter(name => !knownNames.includes(name));
    if (unknownNames.length > 0) {
      logger.warning(`Unknown standards ignored: ${unknownNames.join(', ')}`);
      logger.info(`Available: ${knownNames.join(', ')}`);
    }
  } else if (!dryRun) {
    // Interactive selection
    selectedStandards = await selectStandards(availableStandards);
  } else {
    // Dry run without --standards shows all (for preview purposes)
    selectedStandards = availableStandards;
  }

  if (dryRun) {
    logger.info(`Would create: ${marrPath}/`);
    logger.info(`Would create: ${marrProjectClaudeMdPath}`);
    logger.info(`Would create: ${marrPath}/README.md`);
    if (selectedStandards.length > 0) {
      logger.info(`Would create: ${standardsPath}/`);
      for (const std of selectedStandards) {
        logger.info(`Would create: ${standardsPath}/${std.file}`);
      }
    }
    if (fileOps.exists(projectClaudeMdPath)) {
      logger.info(`Would add: MARR import to ${projectClaudeMdPath}`);
    } else {
      logger.info(`Would create: ${projectClaudeMdPath} with MARR import`);
    }
    return;
  }

  // Create directories
  fileOps.ensureDir(marrPath);

  // Copy MARR-PROJECT-CLAUDE.md template
  copyMarrProjectClaudeMd(marrPath);

  // Create .claude/marr/README.md
  createMarrReadme(marrPath);

  // Copy selected project-level standards
  if (selectedStandards.length > 0) {
    fileOps.ensureDir(standardsPath);
    copyProjectStandards(standardsPath, selectedStandards);
  }

  // Handle project root CLAUDE.md
  addProjectClaudeMdImport(projectClaudeMdPath, targetDir);

  // Register project in sync registry
  registerProject(targetDir);

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
async function selectStandards(availableStandards: StandardInfo[]): Promise<StandardInfo[]> {
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

  const selected: StandardInfo[] = [];

  for (const std of availableStandards) {
    const answer = await question(`  Install ${std.name}? (${std.description}) [y/N/all] `);
    const normalized = answer.toLowerCase().trim();

    if (normalized === 'all') {
      rl.close();
      logger.blank();
      return availableStandards;
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
└── standards/               # Project-level standards (optional)
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

## Commands

- \`marr validate\` - Check configuration is correct
- \`marr standard list\` - List installed standards
- \`marr standard sync\` - Regenerate trigger list from frontmatter
`;

  fileOps.writeFile(destPath, content);
  logger.success('Created: .claude/marr/README.md');
}

/**
 * Copy project-level standards to standards/ directory
 */
function copyProjectStandards(standardsPath: string, selectedStandards: StandardInfo[]): void {
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
