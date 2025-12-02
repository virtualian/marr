# Writing Prompts Standard

> **AI Agent Instructions**: This document defines how to create and modify prompt and standard files. Follow these rules when writing or updating any file in `.claude/marr/standards/`.
>
> **Scope**: Project-level standard (applies to this project only)
>
> **Rationale**: Well-written prompts ensure AI agents behave predictably and correctly.

---

## Core Rules (NEVER VIOLATE)

1. **Specify WHAT and WHY, never HOW** because AI agents must determine implementation
2. **Never include code, commands, or configuration** because prompts are directives, not tutorials
3. **Write unconditional imperatives** because standards are not suggestions
4. **Make every statement verifiable** because unenforceable rules are not standards
5. **Never modify standards without explicit approval** because standards are controlled documents

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
- Active voice, direct statements

**Correct examples:**
- "Use TypeScript for all new code because type safety reduces production errors"
- "Never commit secrets because exposed credentials compromise security"
- "Run tests before committing because untested changes introduce regressions"

**Incorrect examples:**
- "Run `npm install typescript` then configure tsconfig.json with..."
- "Consider using TypeScript if it makes sense for your project"
- "Here's an example configuration: { ... }"

### Structure Requirements

Each standard file must have:
1. **Header** - AI agent instructions, scope, rationale
2. **Core rules** - The non-negotiable requirements
3. **Detailed sections** - Expanded guidance organized by topic
4. **Anti-patterns** - Explicitly forbidden behaviors

---

## Writing Prompts

Prompts are directive documents that guide AI agent behavior. They follow the same principles as standards but may be more contextual.

### Prompt File Principles

- Write directives that specify **WHAT** and **WHY**, never **HOW**
- State requirements and rationale only
- Implementation details belong in project documentation, not prompts
- Prompts are read by AI agents, not humans following tutorials

### Naming Conventions

**Project-level prompts:**
- Format: `prj-{topic}-standard.md`
- Examples: `prj-git-workflow-standard.md`, `prj-testing-standard.md`

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

## Verifying Standard Quality

A well-written standard:

- [ ] Uses "must" or "must not" language
- [ ] Provides rationale for each requirement
- [ ] Contains no code or commands
- [ ] Can be objectively verified as followed or violated
- [ ] Has clear scope (when it applies)
- [ ] Lists explicit anti-patterns

---

**This standard ensures all project prompts are consistent, enforceable, and effective at guiding AI agent behavior.**
