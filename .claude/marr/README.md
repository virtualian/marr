# MARR Configuration Directory

**MARR (Making Agents Really Reliable)** is an AI agent configuration system that provides consistent project context and standards across all your projects.

For full documentation, see the [MARR repository](https://github.com/virtualian/marr#readme).

## How MARR Works

MARR uses a two-layer configuration system:

1. **User-level** (`~/.claude/marr/MARR-USER-CLAUDE.md`) - Personal preferences, communication style, approval requirements. Applied across all projects.

2. **Project-level** (this directory) - Project-specific standards and context. Overrides user config for technical standards while preserving user preferences.

## This Directory

```
.claude/marr/
├── MARR-PROJECT-CLAUDE.md   # Project configuration (imported by CLAUDE.md)
├── README.md                # This file
└── standards/               # Project-level standards
    ├── prj-git-workflow-standard.md
    ├── prj-testing-standard.md
    ├── prj-mcp-usage-standard.md
    ├── prj-documentation-standard.md
    ├── prj-what-is-a-standard.md
    └── prj-writing-prompts-standard.md
```

## How It Loads

1. Project root `CLAUDE.md` imports `@.claude/marr/MARR-PROJECT-CLAUDE.md`
2. MARR-PROJECT-CLAUDE.md lists standards with "Read before..." triggers
3. When a trigger is met, Claude Code reads the relevant standard
4. Standards define required behavior for that type of work

## Customization

Edit files in this directory to match your project's needs. Changes are version-controlled with your project.

Run `marr validate` to check configuration is correct.
