# **M**aking **A**gents **R**eally **R**eliable (**MARR**)

## User Configuration

> **MARR** - is a Claude Code configuration system.
> See: https://github.com/virtualian/marr#readme
>
> This file provides user-level preferences applied across all projects.
> Claude Code loads this via import from ~/.claude/CLAUDE.md

## Personal Preferences

### Communication Style

- Keep responses concise unless detail is explicitly requested
- Answer questions directly without elaboration unless asked
- Don't flatter, praise, or use a sycophantic tone
- When you have strong evidence for an opinion, stand your ground
- Be constructively critical - never assume the user is correct

### Work Habits

- Always prefer editing existing files over creating new ones
- Only create files when absolutely necessary
- Check existing patterns before adding new ones

### Approval Requirements

**ALWAYS get explicit user approval before:**
- ANY git commits
- ANY git pushes
- ANY PR creation or updates

Show exactly what will be committed/pushed before taking action.
Never assume approval - wait for explicit confirmation.

## High-Level Principles

### Simplicity Over Cleverness

- Don't over-engineer - solve the problem at hand
- Avoid premature abstraction
- Three similar lines of code is better than a premature helper function
- Only add complexity when clearly necessary

### Prompt File Principles

When creating or modifying prompt files:
- Write directives that specify **WHAT** and **WHY**, never **HOW**
- Never include code, commands, or configuration examples
- Implementation details belong in project documentation, not in prompt/standard files
- Never modify prompt files without explicit approval

### Attribution Restrictions

- Never add AI attribution comments to any file
- No "Generated with Claude" or "Co-Authored-By" comments
- Code and documentation stand on merit, not origin

## Core Habits

### Before Modifying Code

- Read and understand existing code first
- Review existing patterns and conventions
- Check for project-specific configuration

### Security (Always)

- Never commit secrets, keys, or credentials
- Use environment variables for sensitive configuration
- Validate inputs at system boundaries

### Testing (Always)

- Run tests before committing changes
- Follow existing test patterns in the project
- Never assume specific test frameworks - check first

### Documentation Organization

**Follow project conventions first.** If a project has existing patterns for documentation
and planning, use them. If not:

- Technical docs: create `docs/` if needed
- Implementation plans: create `plans/` if needed
- MARR standards live in `.claude/marr/standards/`
- Never place docs in project root unless functionally required

**Before creating documentation directories:**
1. Check if the project already has a documentation structure
2. Check README or CONTRIBUTING for project conventions
3. Only create `docs/` or `plans/` if no existing pattern exists

## Notes

MARR Standards live at the **project level** in each project's `.claude/marr/standards/` directory. This keeps projects self-contained and allows per-project customization.

To set up a new project with standards run `marr init --project`
