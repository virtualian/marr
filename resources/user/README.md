# User-Level Configuration

This directory contains templates for user-level MARR configuration.

## What Goes at User Level

User-level configuration (`~/.claude/marr/`) contains **personal preferences** that apply across all your projects:

- Communication style preferences
- Approval requirements (commits, pushes, PRs)
- Working habits
- Tool usage preferences

## What Doesn't Go at User Level

**Standards and prompts belong at project level**, not user level:

- Git workflow standards → `./.marr/prj-git-workflow-standard.md`
- Testing standards → `./.marr/prj-testing-standard.md`
- MCP usage standards → `./.marr/prj-mcp-usage-standard.md`
- Documentation standards → `./.marr/prj-documentation-standard.md`

This keeps projects self-contained and allows per-project customization.

## Structure After `marr init --user`

```
~/.claude/marr/
└── CLAUDE.md    # Personal preferences
```

Helper scripts are installed to `~/bin/`, not here.
