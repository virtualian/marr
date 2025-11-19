# MARR - Making Agents Really Reliable

A unified configuration system for AI agents (Claude Code first) that provides consistent standards across all repositories.

## What This Is

MARR is a two-layer configuration system:

1. **User-level configuration** (`~/.marr/`) - Personal preferences and universal standards
2. **Project-level configuration** (`./CLAUDE.md` + `./prompts/`) - Project-specific technical requirements

**Key principle**: All repositories use the same comprehensive standards (git workflow, testing, MCP usage) regardless of project type or technology stack.

## Key Features

### Unified Standards Approach
- **No project type classification** - Same standards for all repos
- **Three core standards** included by default:
  - Git workflow (branching, commits, PRs)
  - Testing philosophy and practices
  - MCP tool usage patterns
- **Optional project-specific standards** can be added as needed

### Two-Layer System
- **User-level** (`~/.marr/`) - Personal preferences, communication style, work habits
- **Project-level** (`./CLAUDE.md`) - Technical requirements, project-specific rules
- **Precedence**: Project overrides user for technical details, preserves user preferences

### Git-Based Versioning
- All files tracked in Git (no version suffixes in filenames)
- Changes tracked via commit history
- Simple naming: `prj-git-workflow-standard.md` (not `v1.0.0`)

## Getting Started

### Install MARR
```bash
# Install helper scripts
marr-install-scripts

# Initialize new project
marr-init --name my-project --type "web app" --template standards

# Validate configuration
marr-validate
```

### Explore This Repository
```bash
# View complete system specification
cat docs/product/prd.md

# Explore configuration examples
ls examples/user-level/
ls examples/project-level/
```

### This Repository as Example
This repo follows its own specification:
- Has `CLAUDE.md` at project root
- Has `prompts/` with standard prompt files
- Demonstrates the unified standards approach

## Documentation

- **Product Requirements**: `docs/product/prd.md` - Vision and requirements
- **Examples**: `examples/README.md` - Real-world configuration examples
- **Project Config**: `CLAUDE.md` - This repo's configuration
- **Standards**: `prompts/*.md` - Project-level standard prompt files

## Repository

**GitHub**: virtualian/marr
