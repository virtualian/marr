# marr-cli npm Package - Implementation Complete

**Issue**: #10 - Add npm package for MARR installation
**Updated**: Issue #15 - Refactor CLI to simplified --user/--project design
**Status**: Complete - Ready for npm publish
**Date**: 2025-11-26

---

## Summary

The `marr-cli` npm package provides a professional, npm-installable CLI tool for MARR. The CLI has been refactored (issue #15) to use a simplified `--user`/`--project` design that better separates concerns.

## CLI Reference (Current Design)

```bash
# User setup (one-time per machine)
marr init --user          # or: marr init -u

# Project setup
marr init --project       # Current directory (confirms with user)
marr init --project /path # Specific path

# Both
marr init --all           # User + current project

# Cleanup
marr clean --user         # Remove ~/.claude/marr/ + import + ~/bin/ scripts
marr clean --project      # Remove ./CLAUDE.md + ./prompts/
marr clean --all          # Both

# Validation
marr validate             # Check current project
marr validate --strict    # Warnings as errors

# Options (apply to init and clean)
--dry-run                 # Preview without changes
--force                   # Skip confirmations
```

## Key Changes (Issue #15)

### Removed
- `marr install-scripts` command (folded into `--user`)
- Template selection (`--template` flag)
- Multiple CLAUDE.md templates (basic, standards, dev-guide, status)
- `--name` and `--type` options (project name derived from directory)

### Added
- `--user` / `-u` flag for user-level setup
- `--project` / `-p [path]` flag for project-level setup
- `--all` / `-a [path]` flag for both
- `--dry-run` / `-n` for preview mode
- `--force` / `-f` for skipping confirmations
- Confirmation prompt for project path
- Warning if config already exists
- Helper script cleanup in `marr clean --user`

### Behavior Changes
- `marr init` with no flags shows help (previously required `--name`)
- Helper scripts installed as part of `--user`, not separate command
- Single project template (simpler, cleaner)
- Clean command now removes `~/bin/` scripts with `--user`

## Architecture

```
package/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── commands/
│   │   ├── init.ts           # marr init (--user/--project/--all)
│   │   ├── validate.ts       # marr validate
│   │   └── clean.ts          # marr clean
│   └── utils/
│       ├── logger.ts         # Colored output
│       ├── file-ops.ts       # File operations
│       └── marr-setup.ts     # First-run setup
├── templates/
│   ├── project/common/       # 4 project prompts
│   ├── user/                 # User-level prompts
│   └── helper-scripts/       # 2 GitHub scripts
├── dist/                     # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Testing

### To Test Changes

```bash
cd /Users/ianmarr/projects/marr/package

# Build
npm run build

# Test locally
npm link

# Test commands
marr init                    # Should show help
marr init --user --dry-run   # Preview user setup
marr init --project --dry-run # Preview project setup
marr clean --user --dry-run  # Preview cleanup (includes ~/bin/ scripts)
```

### Full Test with testuser

```bash
# Build tarball
bash scripts/build-test-tarball.sh

# Test in clean environment
sudo su - testuser
bash /path/to/marr/package/scripts/test-in-testuser.sh
```

## Success Criteria (Issue #15)

- [x] `marr init --user` creates `~/.claude/marr/`, adds import, installs scripts to `~/bin/`
- [x] `marr init --project` prompts for confirmation, creates `./CLAUDE.md` + `./prompts/`
- [x] `marr init --project /path` works with explicit path
- [x] Warning shown if running init a second time (config exists)
- [x] `marr clean --user` removes scripts from `~/bin/`
- [x] `marr install-scripts` command removed
- [x] Template selection removed (no `--template` flag)
- [x] `marr init` with no flags shows help
- [ ] All tests pass
- [x] Documentation updated

## What's Ready

### For Users
1. **Installation**: `npm install -g @virtualian/marr`
2. **User Setup**: `marr init --user`
3. **Project Setup**: `marr init --project`
4. **Validation**: `marr validate`
5. **Cleanup**: `marr clean --user/--project/--all`

### For Developers
1. **Source Code**: Complete TypeScript implementation
2. **Build Process**: `npm run build`
3. **Local Testing**: `npm link`
4. **Documentation**: README.md updated

---

## Conclusion

The CLI has been refactored to a cleaner `--user`/`--project` design that better separates concerns and simplifies the user experience. The `install-scripts` command has been folded into `--user`, and template selection has been removed in favor of a single, opinionated project template.

**Status**: Ready for testing and publication
**Next Action**: Run tests, then npm publish
