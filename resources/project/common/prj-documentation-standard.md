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

> **AI Agent Instructions**: Follow these rules for all documentation work.
>
> **Scope**: All documentation activities
>
> **Rationale**: Consistent documentation organization ensures projects remain discoverable and maintainable.

---

## Core Rules (NEVER VIOLATE)

1. **All documentation lives in `docs/`** because scattered docs are invisible
2. **Organize by role first, then content type** because users identify by role before need
3. **Keep content types distinct** because mixed purposes confuse readers
4. **Update docs when code changes** because outdated docs mislead users
5. **No AI attribution** because content stands on merit, not origin
6. **Keep release documentation current** because stale release notes and known issues erode trust

---

## Release Documentation

The following files MUST be kept current at all times, and MUST be updated before creating any new release:

| File | Purpose | Update trigger |
|---|---|---|
| `README.md` | Project overview and getting started | Any change to project structure, setup steps, or features |
| `docs/README.md` | Docs site landing page | Any change to documentation structure or content |
| `RELEASE_NOTES.md` | Cumulative changelog by version | Before every release — add the new version section |
| `KNOWN_ISSUES.md` | Active issues and limitations | When issues are discovered, resolved, or planned for a release |

**Before creating a release:**
- [ ] `RELEASE_NOTES.md` has a section for the new version with all changes
- [ ] `KNOWN_ISSUES.md` reflects current state — new issues added, resolved issues noted
- [ ] `README.md` releases table includes the new version
- [ ] `docs/README.md` release references are current

`RELEASE_NOTES.md` and `CHANGELOG.md` serve the same purpose; pick one name per project and stay consistent. Projects already using `CHANGELOG.md` MAY keep that name — the file's role is unchanged.

See Version Control Standard for the release process steps that consume these files (tag, GitHub Release).

---

## Structure

All project documentation MUST be organized by user role, then by content type within each role.

**Content types** follow the [Diátaxis framework](https://diataxis.fr/). Consult the framework documentation to understand its principles before organizing documentation:
- **how-to/** — Task-oriented guides for accomplishing specific goals
- **reference/** — Technical descriptions of system components
- **explanation/** — Conceptual content about design decisions and trade-offs

**Role-first organization** means users navigate to their role before choosing content type. This matches how users think: "I'm an administrator" comes before "I need a how-to guide."

---

## Content Type Requirements

### How-To Guides
- MUST solve a specific task the user has chosen to do
- MUST assume competence — no teaching, just steps
- MUST title with the task: "How to configure X", "How to deploy Y"

### Reference
- MUST describe the system accurately and completely
- MUST be structured around code or product architecture
- MUST be optimized for lookup, not sequential reading

### Explanation
- MUST discuss the "why" behind implementations
- MUST NOT include step-by-step instructions
- MUST connect concepts across the system

---

## Quality Requirements

- Use clear, direct language — technical documentation is not marketing
- Keep docs synchronized with implementation — remove obsolete content
- Provide examples for complex concepts — concrete is clearer than abstract
- Maintain one source of truth per topic — no redundant documentation

---

## Exceptions

**Platform conventions take precedence.** GitHub repository and community files belong at project root per GitHub's conventions.

**Documentation systems define their own structure.** When using Docusaurus, MkDocs, Sphinx, or similar systems, follow their conventions — but integrate role-first organization and Diátaxis content types where the system allows.

**Non-compliant documentation requires user input.** When existing documentation does not meet this standard, ask the user whether they want to maintain, refine, restructure, or recreate it.

---

## Anti-Patterns (FORBIDDEN)

- **Placing docs outside `docs/`** — All documentation in designated directory
- **Mixing content types** — How-to guides with theory, reference that teaches, explanations with procedures
- **Leaving stale docs** — Update or remove, never ignore
- **Creating redundant docs** — One authoritative source per topic
- **Releasing without updating release docs** — `RELEASE_NOTES.md` (or `CHANGELOG.md`), `KNOWN_ISSUES.md`, and READMEs must be current before any release
