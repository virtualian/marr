# MARR Project Configuration

> **MARR (Making Agents Really Reliable)** - A Claude Code configuration system.
> See: https://github.com/virtualian/marr#readme
>
> This file provides project-level configuration.
> It is imported by `./CLAUDE.md` at the project root.

## Standards

- **Git Workflow** (`.claude/marr/standards/prj-git-workflow-standard.md`): Read before any git commit, push, or PR operation
- **Testing** (`.claude/marr/standards/prj-testing-standard.md`): Read before running or writing tests
- **Documentation** (`.claude/marr/standards/prj-documentation-standard.md`): Read before creating or modifying documentation
- **MCP Usage** (`.claude/marr/standards/prj-mcp-usage-standard.md`): Read before using MCP tools

## Project Overview

**MARR** is a Claude Code configuration system CLI that provides:
- Two-layer configuration (user-level + project-level)
- Unified standards (git workflow, testing, MCP usage, documentation)
- Templates for initializing new projects
- Validation of configuration consistency

**This repository is both:**
- The source code for the `marr` npm package
- A working example of MARR configuration itself

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js >= 18
- **Build**: TypeScript compiler (tsc)
- **Package Manager**: npm
- **Distribution**: npm registry (@virtualian/marr)

## Architecture

```
src/
├── index.ts              # CLI entry point (commander.js)
├── commands/             # Command implementations
│   ├── init.ts           # marr init (user/project setup)
│   ├── validate.ts       # marr validate
│   └── clean.ts          # marr clean
└── utils/                # Shared utilities
    ├── file-ops.ts       # File system operations
    ├── logger.ts         # Console output formatting
    └── marr-setup.ts     # User-level setup logic

resources/
├── project/              # Project-level templates
│   └── common/           # Standard files (prj-*.md)
├── user/                 # User-level templates (future use)
└── helper-scripts/       # GitHub helper scripts
```

## Key Commands

```bash
npm run build             # Compile TypeScript
npm run build:watch       # Watch mode compilation
npm link                  # Link for local development
marr --version            # Verify installation
```

## Development Notes

### Testing Approach

MARR uses isolated user account testing to verify clean installations:
- Test account: `testuser` on development machine
- Test script: `tests/testuser/test-in-testuser.sh`
- Tests verify: user setup, project setup, validation, cleanup

### Release Process

```bash
./scripts/release.sh patch   # Bump version
git push origin main --tags
npm publish --access public
```

## Documentation Organization

- Technical docs and guides: `docs/`
- Implementation plans: `plans/`
- Research notes: `research/`
- Configuration examples: `examples/`

Follow existing project patterns. This repo uses the structure above.
