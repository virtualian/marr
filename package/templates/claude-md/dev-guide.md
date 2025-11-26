# {{PROJECT_NAME}} - Development Guide

> [!IMPORTANT]
>
> This is the Project-level configuration (Layer 2 of 2):
>
> - User file: `~/.claude/marr/CLAUDE.md` - contains User preferences & default standards
> - This file: `./CLAUDE.md` (at project root) contains Project-specific technical overrides
>
> **Precedence**
>
> Project `./CLAUDE.md` overrides technical standards but preserves personal preferences.

## Project Overview

**{{PROJECT_NAME}}** - {{DESCRIPTION}}

**Project Type:** {{PROJECT_TYPE}}

## Startup Imperatives

When starting work in this repository:
- Read all standards in ./prompts/
- Review architecture documentation
- Understand testing strategy
- Check current development phase/priorities

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

## Architecture

**High-Level Architecture:**
(Describe system architecture, major components, data flow)

**Key Design Decisions:**
- (Decision 1 and rationale)
- (Decision 2 and rationale)

**Technology Stack:**
- Language: (e.g., TypeScript, Python, Go)
- Framework: (e.g., React, Express, FastAPI)
- Database: (if applicable)
- Key Dependencies: (list major dependencies)

## Project Structure

```
{{PROJECT_NAME}}/
├── src/              # (Description)
├── tests/            # (Description)
├── docs/             # (Description)
├── scripts/          # (Description)
└── ...
```

**Key Directories:**
- `src/` - (Explanation of source organization)
- `tests/` - (Testing approach and organization)
- `docs/` - (Documentation structure)

## Development Workflow

### Getting Started

1. **Prerequisites:** (List required tools, versions)
2. **Installation:**
   ```bash
   # Installation commands
   ```
3. **Configuration:** (Environment setup, config files)
4. **First Run:**
   ```bash
   # Commands to run project
   ```

### Common Development Tasks

**Development Mode:**
```bash
# Command for development server/mode
```

**Running Tests:**
```bash
# Unit tests
# Integration tests
# E2E tests
```

**Building:**
```bash
# Build command
```

**Linting/Formatting:**
```bash
# Linting command
# Format command
```

## Testing Strategy

**Test Coverage Goals:**
- Critical paths: (percentage or description)
- Business logic: (percentage or description)
- UI components: (percentage or description)

**Testing Approach:**
(Describe testing philosophy: unit vs integration, mocking strategy, etc.)

## Code Conventions

**Naming Conventions:**
- Files: (convention)
- Functions: (convention)
- Classes: (convention)
- Constants: (convention)

**Code Organization:**
- (Principle 1)
- (Principle 2)

**Comments and Documentation:**
- (When to comment, what to document)

## Documentation Organization

Following prompts/prj-documentation-standard.md:
- `docs/` - (Role-first or Diataxis structure)
- `plans/` - Implementation plans for features
- `prompts/` - Project-level standards

## Deployment

**Deployment Process:**
(Describe deployment workflow, environments, CI/CD)

**Environments:**
- Development: (details)
- Staging: (details)
- Production: (details)

## Troubleshooting

**Common Issues:**
- (Issue 1 and solution)
- (Issue 2 and solution)

## Contributing

(If applicable: contribution guidelines, PR process, code review expectations)

## Additional Resources

- Main documentation: (link to docs/)
- API documentation: (if applicable)
- Architecture diagrams: (if applicable)
