# Contributing to MARR

This guide covers how to set up a development environment and contribute to MARR.

## Setup

### Clone and Build

```bash
git clone https://github.com/virtualian/marr.git
cd marr
npm install
npm run build
```

### Run Locally

Link the package to test your changes:

```bash
npm link
marr --version
```

Now `marr` commands use your local build. Run `npm run build` after changes to update.

## Project Structure

```
marr/
├── src/                      # TypeScript source
│   ├── index.ts              # CLI entry point
│   ├── commands/             # Command implementations (init, validate, clean, sync)
│   ├── utils/                # Shared utilities
│   ├── schema/               # Standard validation schemas
│   └── types/                # TypeScript type definitions
├── resources/                # Bundled resources (copied to projects)
│   ├── project/              # Project-level templates and standards
│   └── user/                 # User-level config templates
├── tests/                    # Test infrastructure
├── scripts/                  # Build and release scripts
└── docs/                     # Documentation
```

### Key Directories

**`src/commands/`** — Each CLI command has its own file. Start here when modifying command behavior.

**`resources/project/common/`** — Bundled standards that ship with MARR. Edit these to change default standards.

**`resources/user/`** — User-level templates installed by `marr init --user`.

## Making Changes

### Workflow

1. Create a branch from main: `git checkout -b 123-description`
2. Make your changes
3. Build: `npm run build`
4. Test locally with `npm link`
5. Run the test suite — see [testing.md](./testing.md)
6. Submit a PR

### Adding a New Standard

1. Create the standard file in `resources/project/common/prj-{name}-standard.md`
2. Follow the frontmatter schema (see existing standards)
3. Update `resources/project/MARR-PROJECT-CLAUDE.md` to register the standard
4. Test with `marr init --project`

### Modifying a Command

1. Find the command in `src/commands/`
2. Make changes
3. Run `npm run build`
4. Test with `npm link` and run the command

## Testing

Before submitting a PR, test your changes in an isolated environment.

See [testing.md](./testing.md) for the full testing guide.

Quick check:

```bash
npm run build
npm link
marr --version
marr init --project --dry-run
```

## Code Style

- TypeScript with strict mode
- No external linting configured — follow existing patterns
- Keep functions focused and files small
- Prefer clarity over cleverness
