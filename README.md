# **M**aking **A**gents **R**eally **R**eliable (**MARR**)

**MARR** is a configuration system for Claude Code that makes AI agents more predictable and effective through structured standards.

> Marr is my real surname. I needed a config folder that Anthropic would never accidentally claim in `.claude/`, so I just used my own name and retrofitted the backronym. Peak efficiency, minimal narcissism. Honest! 😄

[![npm version](https://img.shields.io/npm/v/@virtualian/marr.svg)](https://www.npmjs.com/package/@virtualian/marr)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## What is MARR?

MARR is an AI agent configuration system for consistent project context and standards. It provides a two-layer configuration system for AI agents (Claude Code first):

1. **User-level configuration** (`~/.claude/marr/`) - contains personal preferences and universal standards
2. **Project-level configuration** (`./CLAUDE.md` or `.claude/CLAUDE.md` imports `./.claude/marr/MARR-PROJECT-CLAUDE.md`) - contains project-specific standards requirements

All repositories where MARR is installed use the same MARR personal preferences and standards appropriate to project type or technology stack. MARR includes a personal preferences file and a set of optional standards. 

MARR files can be edited and new standards created. These can be synchronised across other MARR-enabled projects. 

Updated and new files can be contributed via GitHub issues and Pull Requests and may be included in future versions by default.

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
- `-p, --project [path]` - Set up project-level config (./MARR-PROJECT-CLAUDE.md, ./.claude/marr/)
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

# List available standards
marr init --standards list
```

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
    └── MARR-USER-CLAUDE.md     # Personal preferences
```

Note: Standards (git workflow, testing, MCP usage) live at **project level** only. This keeps projects self-contained and allows per-project customization.

**What `--project` creates:**
```
your-project/
├── CLAUDE.md                       # Project root config (imports MARR config)
└── .claude/
    └── marr/
        ├── MARR-PROJECT-CLAUDE.md  # Project-specific AI agent configuration
        ├── README.md               # Explains the MARR structure
        └── standards/              # Project-level standards (prj-*.md files)
            └── README.md
```

Note: If `./CLAUDE.md` already exists, MARR adds an import line to it. MARR-PROJECT-CLAUDE.md references `@.claude/marr/standards/` for automatic standard discovery.

### `marr validate`

Validate MARR configuration in current project.

**Usage:**
```bash
marr validate [options]
```

**Options:**
- `--strict` - Fail on warnings (treat warnings as errors)

**What it checks:**
- .claude/marr/MARR-PROJECT-CLAUDE.md exists and has required sections
- .claude/marr/standards/ directory exists
- Required prompt files present
- Naming conventions followed (prj-*)
- CLAUDE.md has MARR import line
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
- `-p, --project` - Clean project-level config (./.claude/marr/, MARR import from ./CLAUDE.md)
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

**Project Level** (`./CLAUDE.md` imports `./.claude/marr/MARR-PROJECT-CLAUDE.md`):
- Project-specific technical requirements
- Team conventions
- All standards (git workflow, testing, MCP usage, documentation) in `.claude/marr/standards/`

### Standard Prompt Files

**Project-Level** (apply to specific project):

Standards use the `prj-*.md` naming pattern and cover core development concerns: git workflow, testing, MCP usage, documentation, and prompt writing.

Standards live at project level only, keeping projects self-contained and allowing per-project customization.

## Common Workflows

### New Machine Setup

```bash
# Install MARR
npm install -g @virtualian/marr

# One-time user setup
marr init --user

# Verify installation
ls ~/.claude/marr/
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

### Permission denied during npm install -g

**Problem:** EACCES permission error when running `npm install -g @virtualian/marr`.

```
npm ERR! EACCES: permission denied, access '/usr/local/lib/node_modules'
```

**Solutions (pick one):**

**Option 1: Use npx (no global install needed)**
```bash
# Run MARR without installing globally
npx @virtualian/marr init --user
npx @virtualian/marr init --project
npx @virtualian/marr validate
```

**Option 2: Use nvm (recommended for developers)**
```bash
# Install nvm (manages Node versions, installs to user directory)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal, then:
nvm install node
npm install -g @virtualian/marr  # Now works without sudo
```

**Option 3: Change npm's default directory**
```bash
# Create a directory for global packages
mkdir ~/.npm-global

# Configure npm to use it
npm config set prefix '~/.npm-global'

# Add to PATH (add to ~/.zshrc or ~/.bashrc)
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

# Now install normally
npm install -g @virtualian/marr
```

**Note:** Avoid `sudo npm install -g` — it creates permission issues for future packages.

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
This is expected behavior - MARR will add its import line to your existing CLAUDE.md without overwriting your content. If you want to recreate the MARR import:
- Use `--force` flag to reset the import
- Or manually add: `@.claude/marr/MARR-PROJECT-CLAUDE.md` after the first heading

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

## Development

### Building from Source

```bash
# Clone repository
git clone https://github.com/virtualian/marr.git
cd marr

# Install dependencies
npm install

# Build TypeScript
npm run build

# Test locally
npm link
marr --version
```

### Releasing

```bash
# Bump version, build, commit, and tag
./scripts/release.sh patch   # 2.0.0 -> 2.0.1
./scripts/release.sh minor   # 2.0.0 -> 2.1.0
./scripts/release.sh major   # 2.0.0 -> 3.0.0

# Then push and publish
git push origin main --tags
npm publish --access public
```

### Project Structure

```
marr/
├── src/                      # TypeScript source
│   ├── index.ts              # CLI entry point
│   ├── commands/             # Command implementations
│   └── utils/                # Shared utilities
├── dist/                     # Compiled JavaScript (gitignored)
├── resources/                # Bundled resources
│   ├── project/              # Project-level standards
│   └── user/                 # User-level config
├── tests/                    # Test infrastructure
│   ├── testuser/             # Isolated user account tests
│   └── lib/                  # Test utilities
├── scripts/                  # Build and release scripts
├── docs/                     # Documentation
├── package.json
├── tsconfig.json
└── README.md
```

### Testing

See [docs/dev/how-to/testing.md](./docs/dev/how-to/testing.md) for testing documentation.

**Quick Test Cycle:**

```bash
# Build and create test tarball
npm run build

# Test in isolated user account
sudo su - testuser
bash /path/to/marr/tests/testuser/test-in-testuser.sh
```

## License

ISC

## Repository

https://github.com/virtualian/marr

## Contributing

Issues and pull requests welcome! See the main MARR repository for contribution guidelines.

## Documentation

- [Getting Started](./docs/user/how-to/getting-started.md) — Installation and first-time setup
- [Configuration Guide](./docs/user/explanation/configuration.md) — Understanding the two-layer system
- [Customization Guide](./docs/user/how-to/customization.md) — Modifying and creating standards
- [Standards Reference](./docs/user/reference/standards-reference.md) — What each bundled standard does

## Related Links

- [Architecture](./docs/dev/explanation/architecture.md)
- [Issue Tracker](https://github.com/virtualian/marr/issues)

---

**MARR makes AI agents really reliable through consistent, validated configuration across all your projects.**
