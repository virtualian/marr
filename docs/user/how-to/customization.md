# Customization Guide

MARR is designed to be customized. Standards are starting points, not fixed rules.

## Customization Options

You can customize MARR at multiple levels:

| Level | Scope | Location |
|-------|-------|----------|
| **User preferences** | All projects | `~/.claude/marr/MARR-USER-CLAUDE.md` |
| **Project standards** | Single project | `.claude/marr/standards/prj-*.md` |
| **Standard selection** | Single project | `marr init --project --standards` |

## Editing User Preferences

Your user preferences live at `~/.claude/marr/MARR-USER-CLAUDE.md`.

Edit this file directly to change:
- Communication style preferences
- Approval requirements
- Work habit preferences
- High-level principles

Changes take effect immediately in new sessions.

## Editing Project Standards

Standards live in `.claude/marr/standards/` within each project.

### Modifying an Existing Standard

1. Open the standard file (e.g., `prj-version-control-standard.md`)
2. Edit the rules to match your project's needs
3. Commit the changes with your project

**Example: Relaxing the branch lifetime rule**

The version control standard says "Maximum 5-day branch lifetime." If your team uses weekly sprints:

```markdown
## Core Rules

...
6. **Maximum 7-day branch lifetime** because branches should merge by sprint end
...
```

### Removing Rules

Delete rules that don't apply. Standards are for your project—remove what doesn't fit.

**Example: Removing the squash merge requirement**

If your team prefers merge commits for traceability, delete the squash merge rule and add your own:

```markdown
## Core Rules

...
4. **Always use merge commits** because full commit history aids debugging
...
```

### Adding Project-Specific Rules

Add rules unique to your codebase:

```markdown
## Project-Specific Rules

7. **All API routes require authentication middleware** because this is a multi-tenant system
8. **Database queries must use the query builder** because raw SQL bypasses our audit logging
```

## Creating New Standards

Create new standards for project-specific concerns.

### Naming Convention

- **Format**: `prj-{topic}-standard.md`
- **Examples**: `prj-security-standard.md`, `prj-api-standard.md`

### Required Structure

Every standard needs:

1. **YAML frontmatter** — Metadata for the standard
2. **Header** — AI agent instructions
3. **Core rules** — Non-negotiable requirements
4. **Anti-patterns** — Forbidden behaviors

### Frontmatter Template

```yaml
---
marr: standard
version: 1
title: Your Standard Title
scope: Brief description of when this applies

triggers:
  - WHEN first trigger condition
  - WHEN second trigger condition
---
```

### Registering the Standard

Add your new standard to `.claude/marr/MARR-PROJECT-CLAUDE.md`:

```markdown
### `prj-your-standard.md`
Read this standard when:
- WHEN your trigger condition
- WHEN another trigger condition
```

## Selecting Standards During Init

Choose which bundled standards to install:

```bash
# Interactive selection (default)
marr init --project

# Install all standards
marr init --project --standards all

# Install none (start from scratch)
marr init --project --standards none

# List available standards
marr init --standards list
```

## Syncing Customizations

If you've customized standards and want to propagate changes to other projects:

```bash
# Sync standards from source project to target
marr sync --from /path/to/source --to /path/to/target
```

This copies your `.claude/marr/` directory while preserving project-specific settings.

## Contributing Improvements

If your customizations would benefit others:

1. Open an issue describing the improvement
2. Submit a pull request to the MARR repository
3. Your changes may be included in future MARR releases

Standards in `resources/project/common/` become the defaults for new projects.

## Best Practices

### Do

- Keep standards focused on outcomes, not implementation
- Provide rationale for each rule
- Remove rules that don't apply to your project
- Update standards as your project evolves

### Don't

- Add implementation details (code, commands) to standards
- Create standards for one-off situations
- Use soft language ("should", "consider") — standards are requirements
- Duplicate rules across multiple standards

## Next Steps

- [Standards Reference](../reference/standards-reference.md) — Understand each bundled standard
- [Configuration Guide](../explanation/configuration.md) — Review how configuration works
