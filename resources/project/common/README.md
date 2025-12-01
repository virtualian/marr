# Project Standards

This directory contains **project-specific standards** that Claude Code follows when working in this repository.

## Files

| File | Purpose |
|------|---------|
| `prj-git-workflow-standard.md` | Git branching, commits, PRs for this project |
| `prj-testing-standard.md` | Testing approach for this project |
| `prj-mcp-usage-standard.md` | MCP tool usage for this project |
| `prj-documentation-standard.md` | Documentation organization for this project |
| `prj-prompt-writing-standard.md` | How to write and modify prompts |

## How It Works

The project `MARR-PROJECT-CLAUDE.md` references this folder:
```markdown
@.claude/marr/standards/
```

Claude Code auto-discovers and loads all `.md` files when starting work in this project.

## Customization

Edit these files to match your project's specific needs:
- Technology stack requirements
- Team conventions
- Domain-specific rules
- Project-specific workflows

## Naming Convention

- `prj-` prefix = project-level (this project only)
- `user-` prefix = user-level (all projects, lives in `~/.claude/marr/`)

## Relationship to User-Level Standards

These project standards **extend or override** the user-level standards in `~/.claude/marr/`. User personal preferences are preserved; only technical details can be overridden.

## Validation

Run `marr validate` to check that:
- All required standard files exist
- Naming conventions are followed
- CLAUDE.md references are valid
