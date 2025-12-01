# Project-Level Standard Templates

These standard files define **project-specific standards** that are copied to each project's `.claude/marr/standards/` directory during `marr init --project`.

## Structure

```
project/
└── common/           # Standard files (prj-*.md) for all projects
```

## Standard Categories

Standards cover core development concerns:

- **Git workflow** - Branching, commits, PRs
- **Testing** - Testing philosophy and approach
- **MCP usage** - Model Context Protocol tool patterns
- **Documentation** - Project documentation organization
- **Prompt writing** - How to write effective AI prompts

## Naming Convention

Project-level standards use the `prj-` prefix to distinguish them from user-level standards.

## How They Work

1. `marr init --project` copies `common/` files to `./.claude/marr/standards/`
2. Project `CLAUDE.md` imports `@.claude/marr/MARR-PROJECT-CLAUDE.md`
3. `MARR-PROJECT-CLAUDE.md` references `@.claude/marr/standards/` for auto-discovery
4. Claude Code loads all standards when working in that project

## Customization

After initialization, edit the files in your project's `.claude/marr/` directory to match project requirements. Changes are version-controlled with your project.

## Relationship to User-Level Prompts

- **User-level** = universal standards (same across all projects)
- **Project-level** = project-specific details (varies per project)

Project-level standards can override user-level technical details while preserving user preferences.
