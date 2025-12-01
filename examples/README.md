# Configuration Examples

This directory contains real-world examples of Claude Code configuration files collected from active projects.

## Directory Structure

```
examples/
├── user-level/                        # User-level configuration (~/.claude/)
│   ├── CLAUDE.md                      # User master configuration
│   ├── prompts/                       # User-level standards
│   │   ├── user-git-workflow-standard.md
│   │   ├── user-mcp-usage-standard.md
│   │   └── user-testing-standard.md
│   ├── gh-add-subissue.sh            # Helper script for GitHub sub-issues
│   └── gh-list-subissues.sh          # Helper script to list sub-issues
│
├── project-level/
│   ├── comprehensive/                 # Full standards-based projects
│   │   ├── gainfunction-CLAUDE.md
│   │   ├── gainfunction-prompts/
│   │   ├── marrbox-CLAUDE.md
│   │   ├── marrbox-prompts/
│   │   ├── specverse-app-portal-CLAUDE.md
│   │   └── specverse-app-portal-prompts/
│   │
│   └── simplified/                    # Minimal configuration (special cases)
│       └── npm-protect-CLAUDE.md      # Notable for documentation parity protocol
│
└── README.md                          # This file
```

## Configuration Patterns

### User-Level Configuration
**Location:** `~/.claude/`

Contains personal preferences and standards that apply across ALL projects:
- Communication style preferences
- Work habits and approval requirements
- Core standards (git workflow, testing, MCP usage)
- Helper scripts for GitHub operations

### Project-Level: Comprehensive
**Examples:** gainfunction, marrbox, specverse-app-portal

Full two-layer configuration system:
- Project CLAUDE.md references prompt files
- Project-specific standards in `./.marr/`
- May include domain-specific standards (UI/UX, documentation, etc.)

### Project-Level: Simplified
**Examples:** npm-protect

Basic project orientation with unique patterns:
- Simple CLAUDE.md with project overview
- No separate prompt files
- **npm-protect notable for:** Documentation Parity Protocol
  - Mandatory doc updates when scripts change
  - Pre-commit checklist for documentation
  - Script to detect stale documentation
  - "If it's not documented, it doesn't exist" philosophy

## Usage

These examples serve as:
1. **Reference** - See how different projects implement standards
2. **Templates** - Starting points for new project configurations
3. **Comparison** - Understand different configuration approaches
4. **Migration** - Guide for upgrading simplified to comprehensive configs

## Key Insights

### User vs Project Configuration
- **User-level:** Personal preferences, universal standards
- **Project-level:** Technical requirements, project-specific rules
- **Precedence:** Project overrides user for technical details, preserves user preferences

### Standards Files
All prompt files follow WHAT/WHY structure (never HOW):
- Define requirements and rationale
- No code examples or commands
- Imperative directives only

### Naming Conventions
- User prompts: `user-{standard-name}.md`
- Project prompts: `prj-{standard-name}.md` or `prompt-{standard-name}.md`
- Reference syntax: `@.marr/filename.md` or `@~/.claude/marr/filename.md`

## Target State (Per Functional Spec)

All repositories should converge to unified standards:
- Same three core standards: git workflow, testing, MCP usage
- Optional project-specific additions (UI/UX, documentation, API, etc.)
- No project type classification
- Consistent naming: `prj-{standard-name}.md`
