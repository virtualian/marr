# Documentation

This directory contains **project documentation** organized by role (who needs it).

## Structure

```
docs/
├── product/           # Product Owner/Manager
│   └── prd.md        # Product Requirements Document
├── implementation/    # Developer/Implementer
│   └── spec.md       # Technical specifications
└── user/             # User/Adopter
    └── getting-started.md
```

## Organization Principles

**Role-first organization**: Documents are grouped by who needs them, not by document type.

| Role | Content | Examples |
|------|---------|----------|
| Product | Strategic direction, requirements | PRD, roadmaps, success metrics |
| Implementation | Technical details for developers | Specs, architecture, API docs |
| User | Guides for people using the project | Getting started, how-tos |

## What Goes Here

- Technical specifications
- Architecture decisions
- API documentation
- Setup guides
- User documentation

## What Doesn't Go Here

- **Plans** → `plans/` directory (temporary implementation plans)
- **Research** → `research/` directory (exploratory notes)
- **Working documents** → `tasks/` directory (delete when done)
- **Prompt files** → `prompts/` directory (AI agent directives)

## File Naming

Use descriptive kebab-case names:
- `getting-started.md`
- `api-reference.md`
- `deployment-guide.md`

## Updates

Keep documentation current with the codebase. Outdated docs mislead more than no docs.
