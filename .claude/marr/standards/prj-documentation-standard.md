---
marr: standard
version: 1
title: Documentation Standard
scope: All documentation activities including READMEs, docs, and guides

triggers:
  - WHEN creating, modifying, or organizing project documentation
  - WHEN working with README files, guides, or technical specifications
  - WHEN deciding where documentation should live in the project structure
  - WHEN adding explanations, examples, or user-facing content
---

# Documentation Standard

> **AI Agent Instructions**: This document defines documentation organization and maintenance. Follow these rules for all documentation work.
>
> **Scope**: All documentation activities
>
> **Rationale**: Clear documentation organization ensures projects are discoverable and understandable.

---

## Triggers

**You MUST follow this standard when:**
- Creating or modifying documentation files
- Restructuring project documentation
- Adding READMEs or guides
- Updating existing documentation

---

## Core Rules (NEVER VIOLATE)

1. **Documentation lives in designated directories** because scattered docs are invisible
2. **Update docs when code changes** because outdated docs mislead users
3. **Use clear, direct language** because technical documentation is not marketing
4. **Provide examples** because concrete is clearer than abstract
5. **No AI attribution comments** because code and docs stand on merit, not origin

---

## Documentation Organization

### Recommended Structure

- **docs/** — Project documentation organized by audience or purpose
- **examples/** — Real-world reference implementations
- **plans/** — Implementation plans (if applicable)

### Directory Purposes

**docs/**
- Technical specifications and guides
- Organized by user role or topic
- Updated when system design changes

**examples/**
- Working code examples
- Real configurations from actual use
- Include README explaining each example

**plans/**
- Implementation plans for specific work
- Created per issue/feature
- Archived or deleted when complete

---

## Content Types (Diátaxis Framework)

Documentation content falls into three types for technical projects. Each type serves a different user need—keep them distinct.

See [Diátaxis](https://diataxis.fr/) for the full framework.

### How-To Guides (Task-Oriented)

**Purpose:** Help users accomplish specific tasks they've already decided to do.

- Solve a particular problem the user has chosen to tackle
- Assume competence—no teaching required
- Focus on practical steps to achieve the goal
- Title with the task: "How to configure X", "How to deploy Y"

### Reference (Information-Oriented)

**Purpose:** Provide technical descriptions of how the system works.

- Describe the machinery and how to operate it
- Structure around the code or product architecture
- Be accurate, comprehensive, and austere
- Optimized for lookup, not reading cover-to-cover

### Explanation (Understanding-Oriented)

**Purpose:** Clarify concepts, design decisions, and context.

- Discuss the "why" behind implementations
- Explore alternatives and trade-offs
- Connect ideas across the system
- No step-by-step instructions—this is about understanding

### Role-First Navigation (Optional)

When documentation serves multiple user roles with different needs, organize by role first:

```
docs/
  administrator/
    how-to/
    reference/
    explanation/
  user/
    how-to/
    reference/
```

Users think "I'm an administrator" before "I need a how-to guide." Role-first navigation reduces cognitive load.

### Avoiding Content Collapse

Documentation naturally wants to blur boundaries between types. Resist this.

**Warning signs:**
- How-to guides that digress into theory unrelated to the task
- Reference material that teaches rather than describes
- Explanation content with step-by-step instructions

**Fix:** Ask two questions:
1. Is this **action** (practical) or **cognition** (theoretical)?
2. Is this **acquisition** (learning) or **application** (problem-solving)?

The answers reveal where content belongs.

---

## Documentation Quality Standards

### Clarity
- Use simple, direct language
- Avoid jargon unless necessary
- Define terms when first used
- Use examples to clarify concepts

### Accuracy
- Keep docs synchronized with implementation
- Update examples when code changes
- Remove obsolete information
- Verify links and references work

### Completeness
- Cover all major features
- Provide examples for complex concepts
- Include rationale for key decisions
- Document exceptions and edge cases

### Discoverability
- Logical directory structure
- Clear file naming
- README files in each major directory
- Cross-references between related docs

---

## Writing Style

### Technical Documentation
- Clear, direct, technical
- Assume reader is technical
- Use examples to clarify
- Explain WHY, not just WHAT

### READMEs
- Start with what the project/directory does
- Include quick start or usage instructions
- Link to more detailed documentation
- Keep concise and scannable

---

## Anti-Patterns (FORBIDDEN)

- **Scattering documentation** — Use designated directories only
- **Creating redundant docs** — One source of truth per topic
- **Leaving outdated docs** — Update or remove, never ignore
- **Using marketing language** — This is technical documentation
- **Adding AI attribution** — No "Generated with AI" comments
- **Documenting obvious code** — Don't explain what is self-evident

---

**This documentation standard ensures projects remain discoverable, understandable, and maintainable.**
