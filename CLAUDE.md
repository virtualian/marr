# marr

> [!IMPORTANT]
>
> This is the Project-level configuration (Layer 2 of 2):
>
> - User file: `~/.claude/CLAUDE.md` - contains User preferences & default standards
> - This file: `./CLAUDE.md` (at project root) contains Project-specific technical overrides
>
> **Precedence**
>
> Project `./CLAUDE.md` overrides technical standards but preserves personal preferences.

## Project Overview

**MARR (Making Agents Really Reliable)** is a Claude Code Project Configuration System that provides:
- Unified standards applied to all repositories (git workflow, testing, MCP usage)
- Two-layer configuration system (user-level + project-level)
- Real-world examples from production projects
- Templates for initializing new projects
- Optional project-specific standards (UI/UX, documentation parity, etc.)

**This repository is both:**
- The specification for the configuration system
- A working example of the system itself

## Startup Imperatives

When starting work in this repository:
- Read all standards in ./.marr/

## Project-Specific Reminders

- This repo follows its own specification in `docs/functional-specification.md`
- Examples in `examples/` are read-only references from other projects
- Changes to standards should update both spec and examples
- This repo uses the unified standards approach (no project type classification)

## Mandatory User Approval

**ALWAYS get explicit user approval before:**
- ANY git commits
- ANY git pushes
- ANY PR creation or updates

Show user exactly what will be committed/pushed before taking action.

## Standards Compliance

This project follows the standards defined in @.marr/

## Documentation Organization

- `docs/` - Functional specification and technical documentation
- `examples/` - Real-world configuration examples from active projects
- `plans/` - Implementation plans for building the system
- `.marr/` - Project-level standard prompt files

## Development

This repository is currently in the scaffold/planning phase:
- Functional specification defined
- Examples collected
- Ready for iterative refinement and implementation planning

## Meta-Note

This CLAUDE.md was created following the unified standards approach defined in this repo's own functional specification. It serves as a reference implementation.
