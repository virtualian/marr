# MARR Architecture

This document explains why MARR is designed the way it is.

## The Problem

AI coding agents lack consistent context across projects:

1. **Inconsistent behavior** — Same developer gets different agent behavior in different repos
2. **Configuration drift** — Each project has ad-hoc or missing configuration
3. **Manual overhead** — New projects require copy-paste setup that diverges over time
4. **No validation** — No way to check if configuration is correct or complete

## The Solution: Two-Layer Configuration

MARR separates configuration into two layers:

```
┌─────────────────────────────────────────┐
│  User Level (~/.claude/marr/)           │
│  - Personal preferences                 │
│  - Communication style                  │
│  - Approval requirements                │
└─────────────────────────────────────────┘
                 ↓ inherited by
┌─────────────────────────────────────────┐
│  Project Level (.claude/marr/)          │
│  - Project-specific requirements        │
│  - Technical standards                  │
│  - Team conventions                     │
└─────────────────────────────────────────┘
```

**Why two layers?**

- **User preferences follow you** — Your communication style and approval requirements apply everywhere
- **Project requirements are shared** — Team standards live in the repo, version-controlled with the code
- **Clear precedence** — Project technical requirements override user preferences when they conflict

## Why Standards Live at Project Level

Standards (workflow, testing, documentation, etc.) are installed per-project, not per-user.

**Reasons:**

1. **Self-contained projects** — Clone a repo and you have everything needed
2. **Per-project customization** — Different projects can have different standards
3. **Team sharing** — Standards are committed to the repo for the whole team
4. **No cross-project pollution** — Changing standards in one project doesn't affect others

## Claude Code Integration

MARR integrates with Claude Code via the import mechanism:

```
~/.claude/
├── CLAUDE.md                    ← Claude Code reads this
│   └── @~/.claude/marr/...      ← Import line added by MARR
└── marr/
    └── MARR-USER-CLAUDE.md      ← Your preferences
```

Claude Code only reads from `~/.claude/`. MARR places its user config there and uses the `@` import syntax to load it.

## Trigger-Based Standard Loading

Standards aren't read upfront — they're read on-demand based on trigger conditions.

```markdown
### `prj-workflow-standard.md`
Read this standard when:
- WHEN starting any feature, task, or implementation work
- WHEN working with git branches, commits, or pull requests
```

**Why triggers?**

- **Reduced noise** — Agents only read relevant standards
- **Clear scope** — Each standard declares when it applies
- **Composable** — Multiple standards can trigger for the same task

## Design Principles

### 1. Configuration is Code

All configuration lives in version-controlled files. No databases, no dashboards, no external services.

### 2. Claude Code First

Built specifically for Claude Code, with hooks for future multi-agent support. The markdown format is portable to other agents.

### 3. Opinionated Defaults

MARR ships with standards that encode best practices. Users can customize, but the defaults work out of the box.

### 4. Gradual Adoption

Start with `marr init --project` and get working config immediately. Customize over time as needs emerge.

## Documentation Structure

MARR's documentation follows the same principles it enforces: role-first organization with Diátaxis content types.

```
docs/
├── user/           # For people using MARR
│   ├── how-to/     # Task-oriented guides (getting started, customizing)
│   ├── reference/  # Lookup material (standards reference)
│   └── explanation/# Conceptual content (configuration system)
└── dev/            # For people developing MARR
    ├── how-to/     # Task-oriented guides (contributing, testing, publishing)
    └── explanation/# Conceptual content (architecture, specification)
```

**Why this structure?**

- **Role-first** — Users and developers have different needs. Splitting by role means you only see what's relevant.
- **Content types** — Diátaxis separates documentation by user mode: doing (how-to), looking up (reference), or understanding (explanation). Mixing these creates friction.
- **Scales without reorganization** — Adding new docs means finding the right role + content type, not restructuring.

The `prj-documentation-standard.md` codifies this for AI agents working on any MARR-enabled project.

## Future Direction

- **Multi-agent support** — Same config for Cursor, Codex, other AI agents
- **Community standards** — Share and contribute standards via GitHub
- **Team features** — Propagate standard updates across multiple projects
