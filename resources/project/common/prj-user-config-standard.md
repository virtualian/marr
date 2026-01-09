---
marr: standard
version: 1
title: User Configuration Standard
scope: Content decisions for user-level CLAUDE.md and MARR-USER-CLAUDE.md

triggers:
  - WHEN modifying ~/.claude/CLAUDE.md or MARR-USER-CLAUDE.md
  - WHEN adding preferences intended to apply across all projects
  - WHEN deciding whether content belongs in user config or project config
---

# User Configuration Standard

> **AI Agent Instructions**: Follow these rules when modifying user-level configuration.
>
> **Scope**: All modifications to user CLAUDE.md files
>
> **Rationale**: User configuration must be portable across all projects. Content that assumes specific technologies, teams, or codebases belongs in project configuration.

---

## Core Rules (NEVER VIOLATE)

1. **User config must pass the portability test** because it applies to every project
2. **Never add technology-specific rules** because projects use different stacks
3. **Never add team conventions** because users work on different teams
4. **Never add code style rules** because style varies by project
5. **Behavior preferences only** because technical requirements are project-specific

---

## The Portability Test

Before adding content to user configuration, ask:

**"Would this work in a random new project I might start tomorrow?"**

- If YES → user config is appropriate
- If NO → belongs in project config

A TypeScript project, a Python codebase, and a Go microservice all need different technical rules. User config provides consistent *behavior* while project config defines *technical requirements*.

---

## What Belongs in User Config

- **Communication style** — Tone, verbosity, formality preferences
- **Approval requirements** — What actions need explicit approval (commits, pushes, PRs)
- **Work habits** — Preferences like "prefer editing existing files over creating new"
- **High-level principles** — Simplicity over cleverness, attribution restrictions
- **Universal safety rules** — Never commit secrets, validate inputs at boundaries
- **Default behaviors** — Expectations for every project (e.g., run tests before committing)

---

## What Does NOT Belong in User Config

- **Technology-specific rules** — TypeScript strictness, Python formatting, Go conventions
- **Code style rules** — Indentation, naming conventions, formatting preferences
- **Team conventions** — Commit message formats, PR templates, review processes
- **Tool configurations** — Linter rules, build settings, CI preferences
- **Workflow processes** — Sprint practices, release procedures, branching strategies
- **Implementation guidance** — Code patterns, architectural decisions, library preferences

---

## Anti-Patterns (FORBIDDEN)

- **Adding project-specific content** — User config is not a place for one project's rules
- **Including code or commands** — User config is behavioral guidance, not implementation
- **Duplicating project standards** — If a project standard covers it, don't repeat in user config
- **Technology assumptions** — Never assume TypeScript, Python, React, or any specific stack
- **Team assumptions** — Never assume specific team practices or organizational conventions
