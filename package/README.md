# @virtualian/marr

**MARR (Making Agents Really Reliable)** - AI agent configuration system for consistent project context and standards.

[![npm version](https://img.shields.io/npm/v/@virtualian/marr.svg)](https://www.npmjs.com/package/@virtualian/marr)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## What is MARR?

MARR provides a two-layer configuration system for AI agents (Claude Code first):

1. **User-level configuration** (`~/.claude/marr/`) - Personal preferences and universal standards
2. **Project-level configuration** (`./CLAUDE.md` + `./prompts/`) - Project-specific technical requirements

**Key principle**: All repositories use the same comprehensive standards (git workflow, testing, MCP usage) regardless of project type or technology stack.

## Installation

```bash
npm install -g @virtualian/marr
```

## Quick Start

```bash
# One-time user setup (creates ~/.claude/marr/, installs helper scripts)
marr init --user

# Initialize a new project
marr init --project

# Or do both at once
marr init --all

# Validate configuration
marr validate
```

## Commands

### `marr init`

Initialize MARR configuration. Supports three modes:

**Usage:**
```bash
marr init [options]
```

**Options:**
- `-u, --user` - Set up user-level config (~/.claude/marr/, helper scripts in ~/bin/)
- `-p, --project [path]` - Set up project-level config (./CLAUDE.md, ./prompts/)
- `-a, --all [path]` - Set up both user and project config
- `-s, --standards <value>` - Standards to install: `all`, `list`, `none`, or comma-separated names
- `-n, --dry-run` - Show what would be created without actually creating
- `-f, --force` - Skip confirmation prompts

**Standards Selection:**

By default, `--project` prompts you to select which standards to install. Use `--standards` to skip the prompt:

```bash
# Interactive selection (default)
marr init --project

# Install all standards
marr init --project --standards all

# Install specific standards
marr init --project --standards git,testing

# Install no standards (CLAUDE.md only)
marr init --project --standards none

# List available standards
marr init --standards list
```

Available standards: `git`, `testing`, `mcp`, `docs`, `prompts`

**Examples:**
```bash
# One-time user setup (run once per machine)
marr init --user

# Initialize current directory (interactive standard selection)
marr init --project

# Initialize with all standards (no prompts)
marr init --project --standards all --force

# Initialize specific directory
marr init --project /path/to/project

# Both user + current project (new machine + new project)
marr init --all

# Preview what would be created
marr init --user --dry-run

# Force overwrite existing config
marr init --project --force
```

**What `--user` creates:**
```
~/.claude/
├── CLAUDE.md                   # Updated with MARR import
└── marr/
    └── CLAUDE.md               # Personal preferences

~/bin/
├── gh-add-subissue.sh          # GitHub helper script
└── gh-list-subissue.sh         # GitHub helper script
```

Note: Standards (git workflow, testing, MCP usage) live at **project level** only. This keeps projects self-contained and allows per-project customization.

**What `--project` creates:**
```
your-project/
├── CLAUDE.md                   # Project configuration
├── prompts/
│   ├── prj-git-workflow-standard.md
│   ├── prj-testing-standard.md
│   ├── prj-mcp-usage-standard.md
│   └── prj-documentation-standard.md
├── docs/                       # Documentation
└── plans/                      # Implementation plans
```

### `marr validate`

Validate MARR configuration in current project.

**Usage:**
```bash
marr validate [options]
```

**Options:**
- `--strict` - Fail on warnings (treat warnings as errors)

**What it checks:**
- CLAUDE.md exists and has required sections
- prompts/ directory exists
- Required prompt files present
- Naming conventions followed (user-*, prj-*)
- Prompt references (@prompts/) are valid
- No broken file references

**Examples:**
```bash
# Standard validation
marr validate

# Strict mode (warnings = errors)
marr validate --strict
```

**Exit codes:**
- `0` - Validation passed
- `1` - Validation failed (errors found, or warnings in strict mode)

### `marr clean`

Remove MARR configuration files.

**Usage:**
```bash
marr clean [options]
```

**Options:**
- `-u, --user` - Clean user-level config (~/.claude/marr/, helper scripts)
- `-p, --project` - Clean project-level config (./CLAUDE.md, ./prompts/)
- `-a, --all` - Clean both user and project config
- `-n, --dry-run` - Show what would be removed without actually removing
- `-f, --force` - Skip confirmation prompts

**Examples:**
```bash
# Preview what would be removed
marr clean --user --dry-run

# Remove user-level config
marr clean --user

# Remove project-level config
marr clean --project

# Remove everything
marr clean --all
```

## What MARR Provides

### Two-Layer Configuration

**User Level** (`~/.claude/marr/`):
- Personal preferences and working style
- Communication preferences
- Approval requirements (commits, pushes, PRs)
- Helper scripts for GitHub sub-issues

**Project Level** (`./CLAUDE.md` and `./prompts/`):
- Project-specific technical requirements
- Team conventions
- All standards (git workflow, testing, MCP usage, documentation)

### Standard Prompt Files

**Project-Level** (apply to specific project):
- `prj-git-workflow-standard.md` - Branch management, commit conventions
- `prj-testing-standard.md` - Testing philosophy and principles
- `prj-mcp-usage-standard.md` - MCP tool usage patterns
- `prj-documentation-standard.md` - Documentation organization

Standards live at project level only, keeping projects self-contained and allowing per-project customization.

### Helper Scripts

GitHub helper scripts installed to `~/bin/`:

```bash
# Link issue #47 as sub-issue of #45
gh-add-subissue.sh 45 47

# List all sub-issues of #45
gh-list-subissues.sh 45
```

**Requirements:**
- GitHub CLI (`gh`) must be installed
- `jq` must be installed for JSON parsing

## Common Workflows

### New Machine Setup

```bash
# Install MARR
npm install -g @virtualian/marr

# One-time user setup
marr init --user

# Verify installation
ls ~/.claude/marr/
ls ~/bin/*.sh
```

### Starting a New Project

```bash
# Create project directory
mkdir my-new-project && cd my-new-project

# Initialize with MARR
marr init --project

# Initialize git
git init
git add .
git commit -m "Initial commit with MARR configuration"

# Validate configuration
marr validate
```

### First Time (New Machine + New Project)

```bash
# Do everything at once
cd my-new-project
marr init --all

# Validate
marr validate
```

## Troubleshooting

### Command not found: marr

**Problem:** Shell can't find the `marr` command after installation.

**Solution:**
```bash
# Verify installation
npm list -g @virtualian/marr

# If installed but not found, check npm global bin path
npm config get prefix

# Add to PATH (if needed)
export PATH="$(npm config get prefix)/bin:$PATH"
```

### CLAUDE.md already exists

**Problem:** Running `marr init --project` in a directory that already has CLAUDE.md.

**Solution:**
This is expected behavior - MARR won't overwrite existing configuration. Either:
- Remove existing CLAUDE.md first
- Use `--force` flag to overwrite
- Initialize in a different directory

### Helper scripts not working

**Problem:** `gh-add-subissue.sh` command not found or permission denied.

**Solution:**
```bash
# Verify installation
ls -la ~/bin/*.sh

# Check if ~/bin is in PATH
echo $PATH | grep "$HOME/bin"

# If not in PATH, add it:
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify dependencies
gh --version  # GitHub CLI
jq --version  # JSON processor
```

### Validation warnings

**Problem:** `marr validate` shows warnings about prompt files.

**Solution:**
Warnings are informational - they suggest best practices but don't fail validation. Use `--strict` mode if you want to enforce all best practices:

```bash
marr validate --strict
```

## Requirements

- **Node.js**: >= 18.0.0
- **npm**: Latest version recommended
- **Optional**: GitHub CLI (`gh`) and `jq` for helper scripts

## Development

### Building from Source

```bash
# Clone repository
git clone https://github.com/virtualian/marr.git
cd marr/package

# Install dependencies
npm install

# Build TypeScript
npm run build

# Test locally
npm link
marr --version
```

### Project Structure

```
package/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── commands/
│   │   ├── init.ts           # marr init
│   │   ├── validate.ts       # marr validate
│   │   └── clean.ts          # marr clean
│   └── utils/
│       ├── logger.ts         # Colored output
│       ├── file-ops.ts       # File operations
│       └── marr-setup.ts     # First-run setup
├── templates/                # Bundled templates
│   ├── project/              # Project-level files
│   │   ├── common/           # Standard prompt files (prj-*.md)
│   │   ├── docs/             # Documentation folder template
│   │   └── plans/            # Plans folder template
│   ├── user/                 # User-level (README only)
│   └── helper-scripts/       # GitHub scripts
├── dist/                     # Compiled JavaScript (gitignored)
├── package.json
├── tsconfig.json
└── README.md
```

### Testing with testuser Account

The recommended way to test MARR is using a clean macOS user account for complete isolation. This tests the exact user experience including first-run setup, template installation, and all commands.

See [TESTING.md](./TESTING.md) for comprehensive testing documentation.

**Quick Test Cycle:**

```bash
# In package directory: Build test tarball
bash scripts/build-test-tarball.sh

# Switch to testuser and run automated tests
sudo su - testuser
bash /path/to/marr/package/scripts/test-in-testuser.sh
```

## License

ISC

## Repository

https://github.com/virtualian/marr

## Contributing

Issues and pull requests welcome! See the main MARR repository for contribution guidelines.

## Related Links

- [MARR Documentation](https://github.com/virtualian/marr/tree/main/docs)
- [Examples](https://github.com/virtualian/marr/tree/main/examples)
- [Issue Tracker](https://github.com/virtualian/marr/issues)

---

**MARR makes AI agents really reliable through consistent, validated configuration across all your projects.**
