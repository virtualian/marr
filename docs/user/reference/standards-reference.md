# Standards Reference

This document describes each bundled standard that ships with MARR.

## Overview

MARR includes six standards covering common development concerns:

| Standard | Purpose |
|----------|---------|
| [Workflow](#workflow-standard) | Git branches, commits, and pull requests |
| [Testing](#testing-standard) | Running, writing, and evaluating tests |
| [Documentation](#documentation-standard) | Creating and organizing docs |
| [MCP Usage](#mcp-usage-standard) | Using Model Context Protocol tools |
| [UI/UX](#uiux-standard) | Component design and accessibility |
| [Writing Prompts](#writing-prompts-standard) | Creating AI agent instructions |

---

## Workflow Standard

**File**: `prj-workflow-standard.md`

**Triggers**:
- When starting any feature, task, or implementation work
- When working with git branches, commits, or pull requests
- When making changes while on the main branch
- When preparing code for review or merge

### Core Rules

1. **Never make code changes on main** — All work happens on feature branches
2. **Verify issue exists before any action** — All work must be tracked
3. **Delete merged branches** — Keep the repository clean
4. **Always squash merge** — Linear history is easier to debug
5. **Branch from main only** — No branches from branches (except hotfixes)
6. **Maximum 5-day branch lifetime** — Short-lived branches reduce conflicts
7. **Use issue-based branch naming** — Format: `<issue-number>-<descriptive-name>`

### Key Practices

- **Branch naming**: `42-user-profile-view`, `67-fix-login-timeout`
- **Commit messages**: Imperative mood, 50 chars max, no issue numbers
- **PR requirements**: CI passes, no conflicts, squash merge only

---

## Testing Standard

**File**: `prj-testing-standard.md`

**Triggers**:
- When running, writing, or modifying tests
- When evaluating test coverage or testing strategy
- When investigating test failures or flaky tests
- When making code changes that should have test coverage

### Core Rules

1. **Test behavior, not implementation** — Users care about outcomes
2. **Focus on critical paths** — That's where bugs have the highest impact
3. **Meaningful tests over metrics** — Quality trumps quantity
4. **Never commit with test failures** — Broken tests break everyone

### Testing Priorities

**Always test**:
- Critical user workflows
- Data validation and transformation
- Error handling paths
- Security-sensitive operations
- Integration points between systems

**Skip testing**:
- Framework functionality
- Third-party library behavior
- Trivial getters/setters
- UI appearance (unless critical)

### Coverage Philosophy

Coverage is a guide, not a goal. A well-tested critical path is more valuable than 100% coverage of trivial code.

---

## Documentation Standard

**File**: `prj-documentation-standard.md`

**Triggers**:
- When creating, modifying, or organizing project documentation
- When working with README files, guides, or technical specifications
- When deciding where documentation should live in the project structure
- When adding explanations, examples, or user-facing content

### Core Rules

1. **All documentation lives in `docs/`** — Scattered docs are invisible
2. **Organize by role first, then content type** — Users identify by role before need
3. **Keep content types distinct** — Mixed purposes confuse readers
4. **Update docs when code changes** — Outdated docs mislead users
5. **No AI attribution** — Content stands on merit

### Content Types (Diátaxis Framework)

| Type | Purpose | Key Requirement |
|------|---------|-----------------|
| **how-to/** | Task-oriented guides | Steps only, assume competence |
| **reference/** | Technical descriptions | Structured for lookup |
| **explanation/** | Design decisions | The "why", no procedures |

---

## MCP Usage Standard

**File**: `prj-mcp-usage-standard.md`

**Triggers**:
- When using MCP tools or integrating external services
- When selecting which tool to use for a task
- When troubleshooting tool behavior or failures
- When configuring or setting up MCP servers

### Core Rules

1. **Be specific in tool requests** — Ambiguous requests cause wrong tool selection
2. **Use explicit tool names when unclear** — AI cannot infer intent from vague descriptions
3. **Never assume tool capabilities** — Each MCP has specific, limited functionality
4. **Verify tool availability before use** — Not all environments have all MCPs

### Best Practices

- Confirm tools are available before using them
- Match tools to specific tasks
- Provide all required parameters explicitly
- Handle errors gracefully—don't retry without understanding the failure

---

## UI/UX Standard

**File**: `prj-ui-ux-standard.md`

**Triggers**:
- When creating or modifying UI components or layouts
- When making visual design or styling decisions
- When implementing user interactions, forms, or navigation
- When evaluating accessibility or usability

### Core Rules

1. **Always prioritize accessibility** — Legal compliance and usability are non-negotiable
2. **Always use mobile-first design** — Mobile traffic dominates modern web
3. **Always validate with accessibility tools** — Automated validation catches issues early
4. **Always maintain brand consistency** — Professional appearance builds trust
5. **Always optimize for conversion** — Business goals require measurable outcomes

### Accessibility Requirements

- WCAG 2.1 Level AA compliance mandatory
- 4.5:1 minimum color contrast for text
- 48x48px minimum touch targets
- Keyboard navigation support
- Screen reader compatibility

### Mobile-First Priorities

1. **Mobile (375px-430px)** — Primary design target
2. **Tablet (768px-1024px)** — Secondary
3. **Desktop (1280px+)** — Tertiary

---

## Writing Prompts Standard

**File**: `prj-writing-prompts-standard.md`

**Triggers**:
- When creating or modifying prompt files or standards
- When editing CLAUDE.md or MARR configuration files
- When reviewing prompts or standards for quality
- When defining rules or constraints for AI agent behavior

### Core Rules

1. **Always be user and project agnostic** — Standards must apply anywhere
2. **Specify WHAT and WHY, never HOW** — AI agents determine implementation
3. **Never include code, commands, or configuration** — Prompts are directives, not tutorials
4. **Write unconditional imperatives** — Standards are not suggestions
5. **Make every statement verifiable** — Unenforceable rules are not standards
6. **Never modify standards without explicit approval** — Controlled documents

### Required Structure

Every standard file must have:
1. YAML frontmatter (metadata)
2. Header with AI agent instructions
3. Core rules (non-negotiable requirements)
4. Detailed sections (expanded guidance)
5. Anti-patterns (forbidden behaviors)

### Trigger Design

Triggers are natural language descriptions of situations:
- Begin with "WHEN"
- Describe situations, not keywords
- Broad triggers are better than narrow ones
- Multiple standards can trigger for the same task

---

## Choosing Standards

Not every project needs every standard. Select based on your needs:

| If your project... | Consider these standards |
|-------------------|-------------------------|
| Uses git | Workflow |
| Has tests | Testing |
| Has documentation | Documentation |
| Uses AI tools | MCP Usage |
| Has a UI | UI/UX |
| Has AI config files | Writing Prompts |

Install only what you need:

```bash
# Interactive selection
marr init --project

# All standards
marr init --project --standards all

# List available
marr init --standards list
```
