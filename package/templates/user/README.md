# User-Level Prompt Templates

These prompt files define **universal standards** that apply across all your projects. They are installed to `~/.claude/marr/prompts/` during `marr init --user`.

## Files

| File | Purpose |
|------|---------|
| `user-git-workflow-standard.md` | Git branching, commits, PRs, issue management |
| `user-testing-standard.md` | Testing philosophy and principles |
| `user-mcp-usage-standard.md` | MCP tool usage patterns |
| `user-documentation-standard.md` | Documentation organization (Diataxis framework) |
| `user-standard-for-standards.md` | Meta-standard for writing prompt files |

## Naming Convention

User-level prompts use the `user-` prefix to distinguish them from project-level prompts (`prj-`).

## How They Work

1. `marr init --user` copies these to `~/.claude/marr/prompts/`
2. `~/.claude/marr/CLAUDE.md` references them with `@~/.claude/marr/prompts/user-*.md`
3. Claude Code loads them for every project via the import chain

## Customization

After installation, you can edit the files in `~/.claude/marr/prompts/` to match your personal preferences. Your edits persist across MARR updates.

To reset to defaults, run `marr clean --user` then `marr init --user`.

## Relationship to Project-Level Prompts

- **User-level** = universal standards (same across all projects)
- **Project-level** = project-specific details (varies per project)

User preferences are preserved when project standards override technical details.
