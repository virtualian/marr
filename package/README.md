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

**First Run:** The CLI automatically creates `~/.claude/marr/` infrastructure and copies all templates on first use.

## Quick Start

```bash
# Initialize a new project
marr init --name my-project --type "web application" --template standards

# Validate configuration
marr validate

# Install helper scripts
marr install-scripts
```

## Commands

### `marr init`

Initialize new project with MARR configuration.

**Usage:**
```bash
marr init --name <name> [options]
```

**Options:**
- `-n, --name <name>` - Project name (required)
- `-t, --type <type>` - Project type/description (default: "software project")
- `--template <template>` - CLAUDE.md template (default: "basic")
  - `basic` - Simple project orientation
  - `standards` - Full standards with prompt references
  - `dev-guide` - Comprehensive development guide
  - `status` - Phase-based status tracking
- `--dir <path>` - Target directory (default: current directory)

**Examples:**
```bash
# Basic initialization
marr init -n my-app -t "web application"

# With standards template
marr init -n my-api -t "REST API" --template standards

# Specify target directory
marr init -n tool -t "CLI" --dir ~/projects/tool
```

**What it creates:**
```
your-project/
├── CLAUDE.md                   # Project configuration
├── prompts/
│   ├── prj-git-workflow-standard.md
│   ├── prj-testing-standard.md
│   ├── prj-mcp-usage-standard.md
│   └── prj-documentation-standard.md
├── docs/                       # Documentation
├── plans/                      # Implementation plans
└── research/                   # Research notes
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
- ✅ CLAUDE.md exists and has required sections
- ✅ prompts/ directory exists
- ✅ Required prompt files present
- ✅ Naming conventions followed (user-*, prj-*)
- ✅ Prompt references (@prompts/) are valid
- ✅ No broken file references

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

### `marr install-scripts`

Install GitHub helper scripts to `~/bin/`.

**Usage:**
```bash
marr install-scripts
```

**What it installs:**
- `gh-add-subissue.sh` - Link sub-issue to parent issue
- `gh-list-subissues.sh` - List all sub-issues of parent

**Examples:**
```bash
# After installation, use scripts:
gh-add-subissue.sh 45 47      # Link issue #47 as sub-issue of #45
gh-list-subissues.sh 45       # List all sub-issues of #45
```

**Requirements:**
- GitHub CLI (`gh`) must be installed
- `jq` must be installed for JSON parsing

**PATH setup:**
The command will detect if `~/bin/` is in your PATH and provide setup instructions if needed.

## What MARR Provides

### Two-Layer Configuration

**User Level** (`~/.claude/marr/`):
- Universal standards (git workflow, testing, MCP usage, documentation)
- Personal preferences and working style
- Templates for all projects
- Helper scripts

**Project Level** (`./CLAUDE.md` and `./prompts/`):
- Project-specific technical requirements
- Team conventions
- Domain-specific standards

### Standard Prompt Files

**User-Level** (apply to all projects):
- `user-git-workflow-standard.md` - Branch management, commit conventions
- `user-testing-standard.md` - Testing philosophy and principles
- `user-mcp-usage-standard.md` - MCP tool usage patterns
- `user-documentation-standard.md` - Diataxis framework, role-first organization

**Project-Level** (apply to specific project):
- `prj-git-workflow-standard.md` - Project git rules
- `prj-testing-standard.md` - Project testing approach
- `prj-mcp-usage-standard.md` - Project MCP usage
- `prj-documentation-standard.md` - Project documentation organization

### Unified Standards Approach

MARR includes three core standards by default for all projects:

1. **Git Workflow** - Branching, commits, PRs, issue management
2. **Testing Philosophy** - Test behavior not implementation, coverage principles
3. **MCP Tool Usage** - Consistent patterns for v0, playwright, a11y, shadcn-ui, tailwind

Optional project-specific standards can be added as needed (UI/UX, API design, etc.).

## Common Workflows

### Starting a New Project

```bash
# 1. Create project directory
mkdir my-new-project && cd my-new-project

# 2. Initialize with MARR
marr init -n my-new-project -t "web application" --template standards

# 3. Initialize git
git init
git add .
git commit -m "Initial commit with MARR configuration"

# 4. Validate configuration
marr validate

# 5. Start coding!
```

### Validating Existing Project

```bash
# Quick validation
marr validate

# Strict validation (fail on warnings)
marr validate --strict
```

### Installing Helper Scripts

```bash
# One-time installation
marr install-scripts

# Scripts are now available globally:
gh-add-subissue.sh <parent> <sub>
gh-list-subissues.sh <parent>
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

**Problem:** Running `marr init` in a directory that already has CLAUDE.md.

**Solution:**
This is expected behavior - MARR won't overwrite existing configuration. Either:
- Remove existing CLAUDE.md first
- Initialize in a different directory
- Manually update your configuration

### Templates not found

**Problem:** Error about missing templates after installation.

**Solution:**
```bash
# Check if ~/.claude/marr/ exists
ls ~/.claude/marr/

# If missing, reinstall package
npm install -g @virtualian/marr

# First run should recreate ~/.claude/marr/
marr init -n test --dir /tmp/test
```

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

Common warnings:
- Missing recommended prompts → Add standard prompt files
- User-level prompts in project → Move to `~/.claude/marr/prompts/`
- No prompt references → Add `@prompts/prj-*.md` references to CLAUDE.md

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
marr-cli/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── commands/
│   │   ├── init.ts           # marr init
│   │   ├── validate.ts       # marr validate
│   │   └── install-scripts.ts  # marr install-scripts
│   └── utils/
│       ├── logger.ts         # Colored output
│       ├── file-ops.ts       # File operations
│       └── marr-setup.ts     # First-run setup
├── templates/                # Bundled templates
│   ├── claude-md/           # CLAUDE.md templates
│   ├── project/common/      # Project-level prompts
│   ├── user/                # User-level prompts
│   └── helper-scripts/      # GitHub scripts
├── dist/                    # Compiled JavaScript (gitignored)
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Setting Up Development Environment

```bash
cd package
npm install
npm run build
```

### Development Workflow

```bash
# Watch mode for automatic rebuilds
npm run dev

# Build for testing
npm run build
```

### Testing with testuser Account

The recommended way to test MARR is using a clean macOS user account for complete isolation. This tests the exact user experience including first-run setup, template installation, and all commands.

See [TESTING.md](./TESTING.md) for comprehensive testing documentation.

**Quick Test Cycle:**

```bash
# In package directory: Build test tarball
bash scripts/build-test-tarball.sh

# Switch to testuser and run automated tests
# (Use the actual path where you cloned the repo)
sudo su - testuser
bash /path/to/marr/package/scripts/test-in-testuser.sh
```

### Publishing

```bash
# Build and publish
npm run build
npm publish

# The prepublishOnly hook will run check-bin, build, and tests automatically
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
