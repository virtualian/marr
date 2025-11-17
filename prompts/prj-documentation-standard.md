# Documentation Standard

> **AI Agent Instructions**: This document defines documentation organization and maintenance for this project. Follow these rules for all documentation work.
>
> **Scope**: Project-level standard (applies to this project only)
>
> **Rationale**: Clear documentation organization ensures the configuration system is discoverable and understandable.

---

## Core Rules (NEVER VIOLATE)

1. **Documentation lives in designated directories** because scattered docs are invisible
2. **Update docs when specs change** because outdated docs mislead users
3. **Use clear, direct language** because this is a technical specification, not marketing
4. **Provide examples** because concrete is clearer than abstract
5. **No AI attribution comments** because code stands on merit, not origin

---

## Documentation Organization

### Directory Structure

```
repo-setup/
├── docs/                          # Technical specifications
│   └── functional-specification.md
├── examples/                      # Real-world reference implementations
│   ├── user-level/
│   ├── project-level/
│   └── README.md
├── plans/                         # Implementation plans
│   └── {plan-name}.md
└── prompts/                       # Standard prompt files
    └── prj-*.md
```

### Directory Purposes

**docs/**
- Purpose: Technical specifications and design documents
- Audience: Developers and AI agents implementing the system
- Format: Detailed, comprehensive markdown
- Updates: When system design changes

**examples/**
- Purpose: Real working configurations from production projects
- Audience: Users looking for reference implementations
- Format: Actual config files with README documentation
- Updates: When collecting new patterns or updating existing examples

**plans/**
- Purpose: Implementation plans for AI agents
- Audience: AI agents executing work
- Format: Step-by-step task lists with validation
- Updates: Created per issue/feature, archived when complete

**prompts/**
- Purpose: Project-level standard directives
- Audience: AI agents working in this repo
- Format: WHAT and WHY, never HOW
- Updates: When project standards evolve

---

## Documentation Standards by Type

### Functional Specifications (docs/)

**Required Sections:**
- Date (for quick reference)
- Overview/Executive Summary
- Detailed specifications
- Rationale for key decisions
- Examples where helpful

**Writing Style:**
- Clear, direct, technical
- Assume reader is technical
- Use examples to clarify
- Explain WHY, not just WHAT

**Maintenance:**
- Update when system design changes
- Keep examples current
- Remove obsolete sections
- Track major changes via Git history

### Examples (examples/)

**Structure:**
- Organized by category (user-level, project-level)
- Include README.md explaining patterns
- Actual files from real projects (not synthetic)
- Document what makes each example valuable

**Maintenance:**
- Update when source projects evolve
- Add new patterns as discovered
- Remove patterns no longer relevant
- Keep README.md current with directory structure

### Plans (plans/)

**Format:**
- Title: Clear description of objective
- Overview: What this plan achieves
- Steps: STEP01, STEP02, etc.
- Each step: 3-10 tasks in checklist format
- Validation: How to confirm step completed

**Naming:**
- Descriptive snake_case names
- Related to issue/branch if applicable
- Example: `initialize_new_repo.md`

**Lifecycle:**
- Created: When starting planned work
- Updated: As work progresses
- Completed: All steps checked off
- Archived: Can be deleted or kept for reference

### Prompts (prompts/)

**Format:**
- Imperative directives (MUST, NEVER, ALWAYS)
- State WHAT and WHY, never HOW
- No code examples or commands
- Rationale for each rule

**Naming:**
- `prj-{standard-name}.md`
- Examples: `prj-git-workflow-standard.md`

**Maintenance:**
- Update when project standards change
- Ensure consistency with user-level prompts
- Test changes on this repo first

---

## Documentation Quality Standards

### Clarity
- Use simple, direct language
- Avoid jargon unless necessary
- Define terms when first used
- Use examples to clarify concepts

### Accuracy
- Keep docs synchronized with implementation
- Update examples when source projects change
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

## Anti-Patterns (FORBIDDEN)

❌ **Don't scatter documentation** - Use designated directories only
❌ **Don't create redundant docs** - One source of truth per topic
❌ **Don't leave outdated docs** - Update or remove, never ignore
❌ **Don't use marketing language** - This is technical documentation
❌ **Don't add AI attribution** - No "Generated with Claude" comments

---

## This Project Specifics

### Current Documentation

**Functional Spec:**
- Location: `docs/functional-specification.md`
- Status: Living document, actively refined
- Updates: As system design evolves

**Examples:**
- Location: `examples/`
- Source: Real projects (gainfunction, marrbox, specverse-app-portal, npm-protect)
- Status: Reference implementations
- Updates: When source projects evolve or new patterns discovered

**Plans:**
- Location: `plans/`
- Status: Empty (ready for implementation planning)
- Usage: Created as needed for specific work

**Standards:**
- Location: `prompts/`
- Files: Git workflow, testing, MCP usage, documentation (this file)
- Status: Initial versions, will evolve with project

### Documentation Workflow

**When updating functional spec:**
1. Make changes to `docs/functional-specification.md`
2. Update examples if affected
3. Update this repo's CLAUDE.md if needed
4. Verify cross-references still valid
5. Commit with clear message

**When adding examples:**
1. Copy from source project
2. Update `examples/README.md`
3. Document what pattern this demonstrates
4. Commit with source project reference

**When creating plans:**
1. Create in `plans/` with descriptive name
2. Follow plan format (overview, steps, validation)
3. Work through steps
4. Delete or archive when complete

---

## Integration with Other Standards

**Git Workflow:**
- Documentation updates are code changes
- Commit documentation with related code
- Include doc updates in commit messages

**Testing:**
- Validate examples still work
- Check links and references
- Verify directory structure correct

**MCP Usage:**
- Not applicable to documentation work
- Focus on clear markdown writing

---

**This documentation standard ensures the configuration system remains discoverable, understandable, and maintainable.**
