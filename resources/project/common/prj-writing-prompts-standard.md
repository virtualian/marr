---
title: Writing Prompts Standard
scope: All prompts and standards
rationale: Well-written prompts ensure AI agents behave predictably and correctly.
triggers:
  - Creating or modifying prompt or standard files
  - Editing any CLAUDE.md file
  - Reviewing prompts or standards for quality
---

# Writing Prompts Standard

> **AI Agent Instructions**: This document defines how to create and modify prompt and standard files. ALWAYS follow these rules when writing or updating any prompt or standard.

---

## Prerequisite

**READ `prj-what-is-a-standard.md` FIRST**, then READ ALL lines in this file. DO NOT only read sections.

Standards are binding constraints, not guidelines. Understanding what a standard is ensures you write them correctly.

---

## What Are Standards and Prompts?

**Standards and prompts are instructions for AI agents.** They are not documentation for humans.

- **Standards** are prompt files that define binding constraints on AI agent behavior
- **Prompts** are directive documents that guide AI agents toward specific outcomes
- Both are read and followed by AI agents, not by human developers
- The audience is always an AI agent—write accordingly

When you write a prompt or standard, you are programming AI behavior through natural language directives.

---

## Core Rules (NEVER VIOLATE)

1. **Always be User and Project Agnostic** because they must be applicable for any user or project 
2. **Specify WHAT and WHY, never HOW** because AI agents must determine implementation
3. **Never include code, commands, or configuration** because prompts are directives, not tutorials
4. **Write unconditional imperatives** because standards are not suggestions
5. **Make every statement verifiable** because unenforceable rules are not standards
6. **Never modify standards without explicit approval** because standards are controlled documents

---

## Writing Standards

### Content Requirements

**MUST include:**
- Clear statement of what the standard requires
- Rationale (WHY) for each requirement
- Explicit scope (what situations it applies to)

**MUST NOT include:**
- Code snippets or examples
- Terminal commands
- Configuration files
- Step-by-step implementation instructions

### Language Requirements

**Use imperative language:**
- "Must" or "Must not" for requirements
- "Always" or "Never" for absolute rules
- "When" X happens do Y
- Active voice, direct statements

**Correct examples:**
- "ALWAYS use TypeScript for all new code because type safety reduces production errors"
- "NEVER commit secrets because exposed credentials compromise security"
- "ALWAYS run tests before committing because untested changes introduce regressions"
- "WHEN starting work on a feature ALWAYS follow the mandated workflow"

**Incorrect examples:**
- "Run `npm install typescript` then configure tsconfig.json with..."
- "Consider using TypeScript if it makes sense for your project"
- "Here's an example configuration: { ... }"
- "The workflow document defines procedures"

### Structure Requirements

Each standard file must have:
1. **Frontmatter** - YAML metadata block with title, scope, rationale, triggers
2. **Header** - Title and AI agent instructions
3. **Core rules** - The non-negotiable requirements
4. **Detailed sections** - Expanded guidance organized by topic
5. **Anti-patterns** - Explicitly forbidden behaviors

### Frontmatter Specification

**Every standard MUST begin with YAML frontmatter** because structured metadata enables tooling and consistent parsing.

**Required fields:**
- `title` - The standard name (matches the H1 heading)
- `scope` - What situations or activities this standard covers
- `rationale` - Why this standard exists (one sentence)
- `triggers` - List of conditions that mandate reading this standard

**Format:**
- Frontmatter is enclosed between `---` delimiters
- Triggers are a YAML list (each item starts with `- `)
- Triggers describe situations, not mental states
- Triggers must be specific and actionable

**The frontmatter replaces the separate Triggers section** because having triggers in frontmatter enables programmatic access while reducing document redundancy.

---

## Writing Prompts

Prompts are directive documents that guide AI agent behavior. They follow the same principles as standards but allow contextual application.

### Prompt File Principles

- Write directives that specify **WHAT** and **WHY**, never **HOW**
- Write **Triggers** defining **WHEN** directives apply and/or do not apply 
- State requirements and rationale only
- Implementation details belong in project documentation, not prompts
- Prompts are read by AI agents, not humans following tutorials

### Naming Conventions

**Project-level prompts:**
- Format: `prj-{topic}-standard.md`
- Examples: `prj-workflow-standard.md`, `prj-testing-standard.md`

**Location:**
- All prompts live in `.claude/marr/standards/` directory
- Referenced from `MARR-PROJECT-CLAUDE.md` in the Standards table

---

## Version Control

- All standard changes must be committed with clear rationale
- Breaking changes to standards require documentation updates
- Deprecated rules must be explicitly removed, not commented out

---

## Anti-Patterns (FORBIDDEN)

- **Including implementation details** - No code, commands, or config examples
- **Using soft language** - No "should", "consider", "might want to"
- **Writing tutorials** - Standards are not how-to guides
- **Context-dependent exceptions** - If there's an exception, make it explicit in the standard
- **Unverifiable requirements** - Every rule must be objectively checkable
- **Modifying without approval** - Standards are controlled documents

---

## Verifying Prompts and Standards Quality

A well-written standard:

- [ ] Is user and project agnostic
- [ ] Uses "must" or "must not" language
- [ ] Provides rationale for each requirement
- [ ] Does not contain code or commands
- [ ] Can be objectively verified as followed or violated
- [ ] Has clear scope (when it applies)
- [ ] Lists explicit anti-patterns

---

**This standard ensures all project prompts are consistent, enforceable, and effective at guiding AI agent behavior.**
