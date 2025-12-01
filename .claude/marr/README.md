# MARR Configuration

This directory contains project-level AI agent configuration managed by [MARR](https://github.com/virtualian/marr).

## Structure

```
.claude/marr/
├── MARR-PROJECT-CLAUDE.md    # Project overview and configuration
├── README.md                  # This file
└── standards/                 # Project-level standards
    ├── prj-git-workflow-standard.md
    ├── prj-testing-standard.md
    ├── prj-mcp-usage-standard.md
    └── prj-documentation-standard.md
```

## How It Works

1. Project root `./CLAUDE.md` imports `@.claude/marr/MARR-PROJECT-CLAUDE.md`
2. `MARR-PROJECT-CLAUDE.md` references `@.claude/marr/standards/` for standards
3. Claude Code automatically loads all configuration when working in this project

## Commands

```bash
marr validate           # Validate this configuration
marr clean --project    # Remove MARR configuration
marr init --project -f  # Reset to defaults
```

## Learn More

- [MARR Documentation](https://github.com/virtualian/marr)
- [Configuration Examples](https://github.com/virtualian/marr/tree/main/examples)
