# Project-Level Standard Templates

These standard files define **project-specific standards** that are copied to each project's `.claude/marr/standards/` directory during `marr init --project`.

## Structure

```
project/
└── common/           # Standard files for all projects
    ├── prj-git-workflow-standard.md
    ├── prj-testing-standard.md
    ├── prj-mcp-usage-standard.md
    ├── prj-documentation-standard.md
    └── prj-prompt-writing-standard.md
```

## Files

| File | Purpose |
|------|---------|
| `prj-git-workflow-standard.md` | Project-specific git rules |
| `prj-testing-standard.md` | Project-specific testing approach |
| `prj-mcp-usage-standard.md` | Project-specific MCP usage |
| `prj-documentation-standard.md` | Project documentation organization |
| `prj-prompt-writing-standard.md` | How to write effective prompts |

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
