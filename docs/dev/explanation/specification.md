# MARR Concept and Specification

This document defines what MARR is, its core concepts, and the boundaries of the system.

## What is MARR?

**MARR (Making Agents Really Reliable)** is a configuration system that provides AI coding agents with consistent project context and standards.

MARR treats AI agent directives as first-class project infrastructure — not ad-hoc notes scattered across READMEs or chat sessions.

## The Problem MARR Solves

Without MARR:
- AI agents lack context about project standards
- Same developer gets different agent behavior across projects
- Configuration drifts between projects with no propagation mechanism
- New projects require manual setup that diverges over time
- No validation that configuration is correct or complete

With MARR:
- Standards are explicit, versioned, and validated
- Personal preferences follow you across all projects
- Project standards are shared with the team via version control
- New projects get working configuration in one command
- Validation catches configuration errors

## Core Concepts

### Standards

A **standard** is a binding constraint on AI agent behavior. Standards are not guidelines or suggestions — they are requirements.

Standards are markdown files with:
- **YAML frontmatter** — Machine-readable metadata
- **Core rules** — Non-negotiable requirements
- **Rationale** — Why each rule exists
- **Anti-patterns** — Explicitly forbidden behaviors

Standards live in `.claude/marr/standards/` and use the naming pattern `prj-{topic}-standard.md`.

### Triggers

A **trigger** is a condition that determines when a standard should be read.

Triggers are natural language descriptions of situations:
```yaml
triggers:
  - WHEN starting any feature, task, or implementation work
  - WHEN working with git branches, commits, or pull requests
```

When an AI agent's task matches a trigger, it reads that standard before proceeding. Multiple standards can trigger for the same task.

Triggers are semantic, not mechanical — they describe situations an agent can recognize, not file patterns or keywords.

### Two-Layer Configuration

MARR separates configuration into two layers:

**User layer** (`~/.claude/marr/`)
- Personal preferences that apply everywhere
- Communication style, approval requirements, work habits
- Installed once per machine

**Project layer** (`.claude/marr/`)
- Project-specific requirements
- Technical standards, team conventions
- Committed to version control, shared with team

**Precedence:** Project standards override user preferences when they conflict. A project can enforce stricter rules than a user's defaults.

### Import Mechanism

MARR integrates with Claude Code via markdown imports:

```
~/.claude/CLAUDE.md
  └── @~/.claude/marr/MARR-USER-CLAUDE.md    (user config)

./CLAUDE.md
  └── @.claude/marr/MARR-PROJECT-CLAUDE.md   (project config)
```

Claude Code reads `CLAUDE.md` files and follows import directives. MARR uses this mechanism rather than inventing a new one.

## System Boundaries

### What MARR Is

- A configuration system for AI agents
- A way to define and validate standards
- A CLI for initializing and managing configuration
- An opinionated set of default standards

### What MARR Is Not

- **Not a code generator** — AI agents generate code, MARR provides context
- **Not documentation** — Complements project docs, doesn't replace them
- **Not prescriptive about technology** — Framework and language agnostic
- **Not a team management system** — No approval workflows or access control
- **Not an IDE integration** — Works at the filesystem level

### Scope Boundaries

**In scope:**
- Configuration file structure and validation
- Standard file format and schema
- CLI commands for init, validate, clean, sync
- Bundled default standards
- Claude Code integration

**Out of scope:**
- Runtime agent behavior (that's the agent's job)
- Project-specific implementation patterns (emerge from code)
- CI/CD integration (use validation in your own pipelines)
- Multi-agent orchestration

## Design Principles

### Configuration is Code

All configuration lives in version-controlled files. No databases, dashboards, or external services. Changes are tracked like code.

### Claude Code First

Built for Claude Code, with portable markdown format for future multi-agent support. The configuration format isn't agent-specific.

### Opinionated Defaults

MARR ships with standards that encode best practices. Users can customize, but defaults work out of the box. There's one way to structure things, not many options.

### Gradual Adoption

Start with `marr init --project` and get working config immediately. Customize over time. No need to understand everything upfront.

### Standards Over Guidelines

MARR standards use imperative language ("must", "never") not soft suggestions ("should", "consider"). If something is optional, it doesn't belong in a standard.

## File Structure

```
~/.claude/
├── CLAUDE.md                        # User entry point
└── marr/
    └── MARR-USER-CLAUDE.md          # User preferences

project/
├── CLAUDE.md                        # Project entry point
└── .claude/
    └── marr/
        ├── MARR-PROJECT-CLAUDE.md   # Project config + standard registry
        ├── README.md                # Explains structure
        └── standards/
            ├── prj-workflow-standard.md
            ├── prj-testing-standard.md
            └── ...
```

## Bundled Standards

MARR ships with standards covering common development concerns:

| Standard | Scope |
|----------|-------|
| Workflow | Git branches, commits, pull requests |
| Testing | Test philosophy, priorities, coverage |
| Documentation | Organization, content types, maintenance |
| MCP Usage | Model Context Protocol tool usage |
| UI/UX | Accessibility, mobile-first, conversion |
| Writing Prompts | Creating standards and prompt files |

Projects choose which standards to install. Not every project needs every standard.

## Future Direction

- **Multi-agent support** — Same config for Cursor, Codex, other agents
- **Community standards** — Share and contribute via GitHub
- **Team propagation** — Sync standard updates across projects
