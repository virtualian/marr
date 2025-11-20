# {{PROJECT_NAME}}

> [!IMPORTANT]
>
> This is the Project-level configuration (Layer 2 of 2):
>
> - User file: `~/.marr/CLAUDE.md` - contains User preferences & default standards
> - This file: `./CLAUDE.md` (at project root) contains Project-specific technical overrides
>
> **Precedence**
>
> Project `./CLAUDE.md` overrides technical standards but preserves personal preferences.

## Project Overview

**{{PROJECT_NAME}}** is a {{PROJECT_TYPE}} project.

**Description:** {{DESCRIPTION}}

## Startup Imperatives

When starting work in this repository:
- Read all standards in ./prompts/
- Review project structure and conventions
- Check package.json / dependencies for available commands

## Mandatory User Approval

**ALWAYS get explicit user approval before:**
- ANY git commits
- ANY git pushes
- ANY PR creation or updates

Show user exactly what will be committed/pushed before taking action.

## Standards Compliance

This project follows the standards defined in:
- @prompts/prj-git-workflow-standard.md
- @prompts/prj-testing-standard.md
- @prompts/prj-mcp-usage-standard.md
- @prompts/prj-documentation-standard.md

## Project Specifics

**Technology Stack:**
(List: language, framework, key libraries)

**Architecture:**
(Brief description of project architecture)

**Development Workflow:**
(Common commands, build process, deployment)

## Documentation Organization

This project follows the documentation standard defined in prompts/prj-documentation-standard.md:
- `docs/` - (Describe organization: role-first or Diataxis-first)
- `plans/` - Implementation plans
- `prompts/` - Project-level standard prompt files

## Development

**Getting Started:**
1. (Setup instructions)
2. (Installation steps)
3. (First run commands)

**Common Tasks:**
- Development: (command)
- Testing: (command)
- Build: (command)
- Deploy: (command)
