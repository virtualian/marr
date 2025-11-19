# marr-cli

**MARR (Making Agents Really Reliable)** - AI agent configuration system for consistent project context and standards.

## Installation

```bash
npm install -g marr-cli
```

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

**Options:**
- `-n, --name <name>` - Project name (required)
- `-t, --type <type>` - Project type/description (default: "software project")
- `--template <template>` - CLAUDE.md template: basic|standards|dev-guide|status (default: "basic")
- `--dir <path>` - Target directory (default: ".")

**Example:**
```bash
marr init -n my-app -t "web application" --template standards
```

### `marr validate`

Validate MARR configuration in current project.

**Options:**
- `--strict` - Fail on warnings

**Example:**
```bash
marr validate --strict
```

### `marr install-scripts`

Install GitHub helper scripts to `~/bin/`.

**Example:**
```bash
marr install-scripts
```

## What MARR Provides

### Two-Layer Configuration

**User Level** (`~/.marr/`):
- Universal standards (git workflow, testing, MCP usage, documentation)
- Personal preferences and working style
- Templates for all projects

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

## Development Status

**Current Version:** 1.0.0
**Status:** Foundation complete (STEP01)

### Implemented
- ✅ TypeScript CLI framework with Commander.js
- ✅ Command structure (init, validate, install-scripts)
- ✅ Logger and file operations utilities
- ✅ Build and development tooling

### Coming Soon
- 🚧 Full `marr init` implementation (STEP02)
- 🚧 Full `marr validate` implementation (STEP03)
- 🚧 Full `marr install-scripts` implementation (STEP04)
- 🚧 Template bundling (STEP05)
- 🚧 Testing and documentation (STEP06)

## Requirements

- Node.js >= 18.0.0
- npm

## License

ISC

## Repository

https://github.com/virtualian/marr
