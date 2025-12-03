---
title: Documentation Standard
scope: All documentation activities
rationale: Clear documentation organization ensures projects are discoverable and understandable.
triggers:
  - Creating, modifying, or deleting documentation files
  - Restructuring documentation organization
  - Deciding where documentation should live
---

# Documentation Standard

> **AI Agent Instructions**: This document defines documentation organization and maintenance. Follow these rules for all documentation work.

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
