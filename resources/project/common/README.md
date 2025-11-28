# Project Prompts

This directory contains **project-specific standards** that Claude Code follows when working in this repository.

## Files

| File | Purpose |
|------|---------|
| `prj-git-workflow-standard.md` | Git branching, commits, PRs for this project |
| `prj-testing-standard.md` | Testing approach for this project |
| `prj-mcp-usage-standard.md` | MCP tool usage for this project |
| `prj-documentation-standard.md` | Documentation organization for this project |

## How It Works

The project `CLAUDE.md` references these files:
```markdown
@prompts/prj-git-workflow-standard.md
@prompts/prj-testing-standard.md
@prompts/prj-mcp-usage-standard.md
@prompts/prj-documentation-standard.md
```

Claude Code loads them when starting work in this project.

## Customization

Edit these files to match your project's specific needs:
- Technology stack requirements
- Team conventions
- Domain-specific rules
- Project-specific workflows

## Naming Convention

- `prj-` prefix = project-level (this project only)
- `user-` prefix = user-level (all projects, lives in `~/.claude/marr/prompts/`)

## Relationship to User-Level Standards

These project standards **extend or override** the user-level standards in `~/.claude/marr/prompts/`. User personal preferences are preserved; only technical details can be overridden.

## Validation

Run `marr validate` to check that:
- All required prompt files exist
- Naming conventions are followed
- CLAUDE.md references are valid
