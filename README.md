# Claude Code Project Configuration System

A unified, simplified configuration system for Claude Code that provides consistent standards across all repositories.

## What This Is

This repository defines and documents a **two-layer configuration system** for Claude Code:

1. **User-level configuration** (`~/.claude/`) - Personal preferences and universal standards
2. **Project-level configuration** (`./CLAUDE.md` + `./prompts/`) - Project-specific technical requirements

**Key principle**: All repositories use the same comprehensive standards (git workflow, testing, MCP usage) regardless of project type or technology stack.

## Repository Structure

```
repo-setup/
├── README.md                      # This file
├── CLAUDE.md                      # Project configuration (follows its own spec)
├── docs/
│   └── functional-specification.md # Complete system specification
├── examples/
│   ├── user-level/                # Example ~/.claude/ configuration
│   ├── project-level/             # Example project configurations
│   │   ├── comprehensive/         # Full standards implementations
│   │   └── simplified/            # Minimal configs with unique patterns
│   └── README.md                  # Examples documentation
├── prompts/
│   ├── prj-git-workflow-standard.md
│   ├── prj-testing-standard.md
│   └── prj-mcp-usage-standard.md
└── plans/                         # Implementation plans (future)
```

## Key Features

### Unified Standards Approach
- **No project type classification** - Same standards for all repos
- **Three core standards** included by default:
  - Git workflow (branching, commits, PRs)
  - Testing philosophy and practices
  - MCP tool usage patterns
- **Optional project-specific standards** can be added:
  - UI/UX standards (for user-facing apps)
  - Documentation standards (for doc sites)
  - Documentation Parity Protocol (for CLI tools)
  - API standards (for API development)

### Two-Layer System
- **User-level** (`~/.claude/`) - Personal preferences, communication style, work habits
- **Project-level** (`./CLAUDE.md`) - Technical requirements, project-specific rules
- **Precedence**: Project overrides user for technical details, preserves user preferences

### Git-Based Versioning
- All files tracked in Git (no version suffixes in filenames)
- Changes tracked via commit history
- Simple naming: `prj-git-workflow-standard.md` (not `v1.0.0`)

## Getting Started

### View the Specification
```bash
cat docs/functional-specification.md
```

### Explore Examples
```bash
# User-level configuration example
ls examples/user-level/

# Project-level examples
ls examples/project-level/comprehensive/
```

### This Repository as Example
This repo follows its own specification:
- Has `CLAUDE.md` at project root
- Has `prompts/` with three standard prompts
- Has `plans/` for implementation planning
- Demonstrates the unified standards approach

## Current Status

**Phase**: Scaffold and planning

**Completed**:
- ✅ Functional specification defined
- ✅ Examples collected from real projects
- ✅ Repository bootstrapped with own configuration
- ✅ Documentation Parity Protocol extracted

**Next Steps**:
- Refine functional specification iteratively
- Create implementation plans
- Build initialization and validation tools

## Documentation

- **Functional Spec**: `docs/functional-specification.md` - Complete system definition
- **Examples**: `examples/README.md` - Real-world configuration examples
- **Project Config**: `CLAUDE.md` - This repo's configuration
- **Standards**: `prompts/*.md` - Project-level standard prompt files

## Meta-Note

This repository is both:
1. **The specification** for a Claude Code configuration system
2. **A working example** of that system applied to itself

The repo "eats its own dog food" by following the unified standards approach it documents.

## Repository

**GitHub**: virtualian/repo-setup
**Branch**: create-scaffold (current development)
**Main**: Not yet merged (scaffold in progress)
