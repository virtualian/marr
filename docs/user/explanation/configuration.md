# Configuration Guide

MARR uses a two-layer configuration system that separates personal preferences from project requirements.

## Why Two Layers?

AI agents need two types of guidance:

1. **Personal preferences** — How you like to work, communication style, approval requirements
2. **Project requirements** — Technical standards, team conventions, workflow rules

Separating these allows:
- Personal preferences to follow you across all projects
- Project requirements to be shared with your team
- Different projects to have different standards

## Layer 1: User Configuration

**Location**: `~/.claude/marr/MARR-USER-CLAUDE.md`

User configuration contains your personal working preferences that apply everywhere.

### What Belongs Here

- **Communication style** — How you want the agent to respond (concise vs. detailed)
- **Approval requirements** — What actions need your explicit approval
- **Work habits** — Preferences like "always edit existing files over creating new ones"
- **High-level principles** — Simplicity over cleverness, attribution restrictions

### Example User Preferences

```markdown
### Communication Style
- Keep responses concise unless detail is explicitly requested
- Answer questions directly without elaboration unless asked
- Be constructively critical - never assume the user is correct

### Approval Requirements
**ALWAYS get explicit user approval before:**
- ANY git commits
- ANY git pushes
- ANY PR creation or updates
```

### Loading Mechanism

Claude Code loads user configuration through the import chain:
1. `~/.claude/CLAUDE.md` contains `@~/.claude/marr/MARR-USER-CLAUDE.md`
2. This import directive tells Claude to read your MARR user config
3. Your preferences are applied to every session

## Layer 2: Project Configuration

**Location**: `.claude/marr/MARR-PROJECT-CLAUDE.md` (in each project)

Project configuration defines technical requirements and standards specific to a project.

### What Belongs Here

- **Standards registry** — Which standards apply to this project
- **Trigger conditions** — When each standard should be read
- **Project-specific rules** — Conventions unique to this codebase

### How Standards Work

The project config includes a Standards section that lists available standards with their triggers:

```markdown
## Standards

### `prj-workflow-standard.md`
Read this standard when:
- WHEN starting any feature, task, or implementation work
- WHEN working with git branches, commits, or pull requests
```

When an AI agent's task matches a trigger, it reads that standard before proceeding.

### Loading Mechanism

Project configuration loads through:
1. `./CLAUDE.md` contains `@.claude/marr/MARR-PROJECT-CLAUDE.md`
2. This import brings in the project's MARR config
3. Standards are read on-demand based on trigger conditions

## Configuration Hierarchy

When both layers define something, this is the precedence:

1. **Project standards** — Highest priority (project requirements override preferences)
2. **User preferences** — Applied when not overridden by project

For example:
- User config says "always ask before committing"
- Project standard says nothing about commits
- Result: Agent asks before committing (user preference applies)

But:
- User config says "commit messages can be informal"
- Project standard says "use conventional commit format"
- Result: Agent uses conventional commit format (project overrides)

## File Structure Overview

```
~/.claude/
├── CLAUDE.md                    # Entry point (imports MARR config)
└── marr/
    └── MARR-USER-CLAUDE.md      # Your personal preferences

your-project/
├── CLAUDE.md                    # Entry point (imports MARR config)
└── .claude/
    └── marr/
        ├── MARR-PROJECT-CLAUDE.md   # Project AI agent config
        ├── README.md                # Explains MARR structure
        └── standards/               # Project-level standards
            ├── prj-workflow-standard.md
            ├── prj-testing-standard.md
            └── ...
```

## Validation

Validate your configuration at any time:

```bash
# In your project directory
marr validate

# Strict mode (warnings become errors)
marr validate --strict
```

This checks:
- Required files exist and have correct structure
- Standards directory exists with proper naming
- Import references are valid
- No broken file references

## Next Steps

- [Customization Guide](../how-to/customization.md) — How to modify standards
- [Standards Reference](../reference/standards-reference.md) — What each standard does
