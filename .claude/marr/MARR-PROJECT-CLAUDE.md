# MARR Project Configuration

> **AI Agent Instructions**: This document is the entry point for project-level AI agent configuration. Read this file at the start of any session and follow its directives.
>
> **Scope**: All AI agent work in this project
>
> **Rationale**: Centralized configuration ensures consistent agent behavior across all tasks.

---

MARR (Making Agents Really Reliable) provides project-level AI agent configuration.

See `.claude/marr/README.md` for how MARR works.

## What is a Standard

A standard is a **binding constraint** on how you work.

Standards define the boundary between acceptable and unacceptable work. They are not guidelines, recommendations, or best practices. They are **requirements**. If you violate a standard, your work is incorrect.

**Standards are law:**
- They override preferences, convenience, and optimization
- They are not subject to interpretation or context-dependent judgment
- When a standard conflicts with efficiency or elegance, **the standard wins**
- When context seems to suggest an exception, **there is no exception** unless the standard explicitly provides one

**Standards are controlled documents:**
- Never modify standards without explicit user approval
- Even when asked to modify, seek confirmation first

---

## Standards

`standards/` contains standard prompt files that must be followed when working on a related activity.

In the table below the **Trigger** column is a condition that mandates the reading of its corresponding **Standard** before proceeding. When a Trigger is met, read its Standard immediately—the trigger is the authorization to read the Standard. When more than one Trigger is met, read all the corresponding Standards before proceeding further.

| Trigger | Standard |
|---------|----------|
| WHEN starting any feature, task, or implementation work. Also: git operations, branching, commits, PRs. Always when on main branch. | `prj-workflow-standard.md` |
| WHEN running, writing, or modifying tests. Also: any code change that requires test coverage. | `prj-testing-standard.md` |
| WHEN using MCP tools or integrating external services. | `prj-mcp-usage-standard.md` |
| WHEN creating or modifying documentation files (READMEs, docs/, plans/). Also: restructuring project documentation. | `prj-documentation-standard.md` |
| WHEN creating or modifying files in `.claude/marr/`. Also: editing any CLAUDE.md file. | `prj-writing-prompts-standard.md` |

---

## Anti-Patterns (FORBIDDEN)

- **Skipping triggered standards** — Never assume familiarity; always read the standard when triggered
- **Partial standard reads** — Read the entire standard, not just sections that seem relevant
- **Proceeding before reading** — The trigger must be satisfied before continuing work
- **Treating standards as suggestions** — Standards are requirements, not recommendations
- **Making context-dependent exceptions** — If there is no explicit exception in the standard, there is no exception
- **Modifying without approval** — Standards are controlled documents requiring explicit consent
