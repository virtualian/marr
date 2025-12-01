# MARR Directory Structure

> Reference document for MARR configuration layout

## User-Level Configuration

Location: `~/.claude/marr/`

```
~/.claude/
├── CLAUDE.md                      # User's main config (MARR adds import line)
└── marr/
    └── MARR-USER-CLAUDE.md        # Personal preferences, approval requirements

~/bin/
├── marr-gh-add-subissue.sh        # GitHub helper script
└── marr-gh-list-subissues.sh      # GitHub helper script
```

## Project-Level Configuration

Location: `./.claude/marr/` (inside project's .claude/ folder)

```
your-project/
├── CLAUDE.md                       # Project root config (imports MARR config)
└── .claude/
    └── marr/
        ├── MARR-PROJECT-CLAUDE.md  # Project-specific AI agent configuration
        ├── README.md               # Explains the MARR structure
        └── standards/              # Project-level standards (if installed)
            ├── prj-git-workflow-standard.md
            ├── prj-testing-standard.md
            ├── prj-mcp-usage-standard.md
            ├── prj-documentation-standard.md
            └── README.md
```

## Reference Syntax (Claude Code Import)

- User-level: `@~/.claude/marr/MARR-USER-CLAUDE.md`
- Project-level: `@.claude/marr/MARR-PROJECT-CLAUDE.md`
- Standards folder: `@.claude/marr/standards/` (auto-discovers all .md files)

## Naming Conventions

- User config: `MARR-USER-CLAUDE.md` (lives in `~/.claude/marr/`)
- Project config: `MARR-PROJECT-CLAUDE.md` (lives in `./.claude/marr/`)
- Project standards: `prj-*.md` (live in `./.claude/marr/standards/`)

## How It Works

1. `./CLAUDE.md` at project root imports `@.claude/marr/MARR-PROJECT-CLAUDE.md`
2. `MARR-PROJECT-CLAUDE.md` references `@.claude/marr/standards/` for standards
3. Claude Code loads all configuration when working in the project
4. User-level config (`~/.claude/marr/`) applies across all projects via `~/.claude/CLAUDE.md`

## Key Design Decisions

- **No docs/ or plans/ creation**: Projects may have their own conventions; MARR directs agents to follow existing patterns or create standard ones if needed
- **standards/ subfolder**: Enables future sibling features alongside standards
- **Import pattern**: Allows existing CLAUDE.md files to coexist with MARR config
