# MCP Usage Standard

> **AI Agent Instructions**: This document defines how to use Model Context Protocol (MCP) tools in this project.
>
> **Scope**: Project-level standard (applies to this project only)
>
> **Rationale**: MCP tools are powerful but require clear usage patterns to avoid confusion.

---

## Core Principles (MANDATORY)

1. **ALWAYS be specific in tool requests** because ambiguous requests cause wrong tool selection
2. **ALWAYS use explicit tool names when unclear** because AI cannot read minds
3. **NEVER assume tool capabilities** because each MCP has specific, limited functionality

---

## MCP Tools Relevant to This Project

### Not Applicable (Yet)

This project is currently in the specification/planning phase and does not involve:
- UI component generation (v0 MCP)
- Accessibility testing (a11y MCP)
- Visual testing (playwright MCP)
- Component libraries (shadcn-ui MCP)

### Future Considerations

If this project develops initialization tools with UI:
- May use v0 for generating setup wizard interfaces
- May use playwright for testing installation flows
- May use a11y for ensuring accessible tooling

---

## Current Project Focus

**This project is about:**
- Creating specifications (markdown documents)
- Collecting examples (configuration files)
- Planning implementation (text-based plans)
- Writing validation tools (future - scripts/code)

**MCP tools are not currently needed** for the core work.

---

## When MCP Tools Become Relevant

**If building a web-based initialization tool:**
- Use v0 for UI generation
- Use tailwind for styling
- Use a11y for accessibility validation
- Use playwright for E2E testing

**If building CLI initialization tool:**
- MCP tools generally not applicable
- Focus on bash/Node.js scripting
- Use standard testing approaches

---

## This Project Specifics

- **Current phase**: Specification and planning
- **MCP usage**: Not currently applicable
- **Future**: May use for web-based tooling

---

**This MCP usage standard will be updated when the project enters implementation phase and MCP tools become relevant.**
