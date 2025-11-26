/**
 * Init command - Initialize new project with MARR configuration
 */

import { Command } from 'commander';
import { join, resolve } from 'path';
import * as logger from '../utils/logger.js';
import * as fileOps from '../utils/file-ops.js';
import * as marrSetup from '../utils/marr-setup.js';

interface InitOptions {
  name: string;
  type: string;
  template: string;
  dir: string;
}

const VALID_TEMPLATES = ['basic', 'standards', 'dev-guide', 'status'];

export function initCommand(program: Command): void {
  program
    .command('init')
    .description('Initialize new project with MARR configuration')
    .option('-n, --name <name>', 'Project name (required)')
    .option('-t, --type <type>', 'Project type/description', 'software project')
    .option('--template <template>', 'CLAUDE.md template: basic|standards|dev-guide|status', 'basic')
    .option('--dir <path>', 'Target directory', '.')
    .action((options: InitOptions) => {
      try {
        initializeProject(options);
      } catch (err) {
        logger.error((err as Error).message);
        process.exit(1);
      }
    });
}

function initializeProject(options: InitOptions): void {
  logger.section('MARR Project Initialization');

  // Validate options
  validateOptions(options);

  // Ensure ~/.claude/marr/ is set up
  marrSetup.ensureMarrSetup();

  // Resolve target directory
  const targetDir = resolve(options.dir);
  logger.info(`Target directory: ${targetDir}`);

  // Check if CLAUDE.md already exists
  const claudeMdPath = join(targetDir, 'CLAUDE.md');
  if (fileOps.exists(claudeMdPath)) {
    logger.warning('CLAUDE.md already exists in target directory');
    logger.info('Skipping initialization to avoid overwriting existing configuration');
    process.exit(0);
  }

  // Create project structure
  createProjectStructure(targetDir);

  // Copy CLAUDE.md template
  copyCLAUDEmdTemplate(targetDir, options);

  // Copy project-level prompts
  copyProjectPrompts(targetDir);

  logger.blank();
  logger.success('Project initialized successfully!');
  logger.blank();
  logger.info('Next steps:');
  logger.log('  1. Review CLAUDE.md and customize for your project');
  logger.log('  2. Review prompts/ and adjust standards as needed');
  logger.log('  3. Run: marr validate');
  logger.blank();
}

function validateOptions(options: InitOptions): void {
  // Validate name
  if (!options.name || options.name.trim() === '') {
    logger.error('Project name is required (--name or -n)');
    process.exit(1);
  }

  // Validate template
  if (!VALID_TEMPLATES.includes(options.template)) {
    logger.error(`Invalid template: ${options.template}`);
    logger.info(`Valid templates: ${VALID_TEMPLATES.join(', ')}`);
    process.exit(1);
  }
}

function createProjectStructure(targetDir: string): void {
  logger.info('Creating project structure...');

  const dirs = [
    targetDir,
    join(targetDir, 'prompts'),
    join(targetDir, 'docs'),
    join(targetDir, 'plans'),
    join(targetDir, 'research'),
  ];

  for (const dir of dirs) {
    fileOps.ensureDir(dir);
  }

  logger.success('Project directories created');
}

function copyCLAUDEmdTemplate(targetDir: string, options: InitOptions): void {
  logger.info(`Copying CLAUDE.md template (${options.template})...`);

  const marrRoot = fileOps.getMarrRoot();
  const templatePath = join(marrRoot, 'templates/claude-md', `${options.template}.md`);

  if (!fileOps.exists(templatePath)) {
    logger.error(`Template file not found: ${templatePath}`);
    logger.info('Available templates: basic, standards, dev-guide, status');
    process.exit(1);
  }

  // Read template
  let content = fileOps.readFile(templatePath);

  // Substitute variables
  content = fileOps.substituteVars(content, {
    PROJECT_NAME: options.name,
    PROJECT_TYPE: options.type,
    PROJECT_DESCRIPTION: `A ${options.type}`,
  });

  // Write to target
  const destPath = join(targetDir, 'CLAUDE.md');
  fileOps.writeFile(destPath, content);

  logger.success('CLAUDE.md created');
}

function copyProjectPrompts(targetDir: string): void {
  logger.info('Copying project-level prompts...');

  const marrRoot = fileOps.getMarrRoot();
  const promptsSource = join(marrRoot, 'templates/project/common');
  const promptsDest = join(targetDir, 'prompts');

  const promptFiles = [
    'prj-git-workflow-standard.md',
    'prj-testing-standard.md',
    'prj-mcp-usage-standard.md',
    'prj-documentation-standard.md',
  ];

  for (const file of promptFiles) {
    const srcPath = join(promptsSource, file);
    const destPath = join(promptsDest, file);

    if (fileOps.exists(srcPath)) {
      fileOps.copyFile(srcPath, destPath);
    } else {
      logger.warning(`Prompt template not found: ${file}`);
    }
  }

  logger.success('Project prompts copied');
}
