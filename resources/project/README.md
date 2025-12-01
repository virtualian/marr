# Project-Level Prompt Templates

These prompt files define **project-specific standards** that are copied to each project's `.claude/marr/` directory during `marr init --project`.

## Structure

```
project/
└── common/           # Standard prompts for all projects
    ├── prj-git-workflow-standard.md
    ├── prj-testing-standard.md
    ├── prj-mcp-usage-standard.md
    └── prj-documentation-standard.md
```

## Files

| File | Purpose |
|------|---------|
| `prj-git-workflow-standard.md` | Project-specific git rules |
| `prj-testing-standard.md` | Project-specific testing approach |
| `prj-mcp-usage-standard.md` | Project-specific MCP usage |
| `prj-documentation-standard.md` | Project documentation organization |

## Naming Convention

Project-level prompts use the `prj-` prefix to distinguish them from user-level prompts (`user-`).

## How They Work

1. `marr init --project` copies `common/` files to `./.claude/marr/`
2. Project `CLAUDE.md` references them with `@.claude/marr/` (folder reference)
3. Claude Code loads all prompts in the folder when working in that project
4. New standards added to `.claude/marr/` are automatically discovered

## Customization

After initialization, edit the files in your project's `.claude/marr/` directory to match project requirements. Changes are version-controlled with your project.

## Relationship to User-Level Prompts

- **User-level** = universal standards (same across all projects)
- **Project-level** = project-specific details (varies per project)

Project-level standards can override user-level technical details while preserving user preferences.
