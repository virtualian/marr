# MARR npm Package Implementation Plan

**Issue:** #10 - Add npm package for MARR installation
**Branch:** 10-npm-package-installation
**Objective:** Create `marr-cli` npm package for easy installation and usage

---

## Overview

Transform MARR from manual installation to npm-installable CLI tool while maintaining backward compatibility with existing `~/.marr/` infrastructure.

## Design Decisions

### Package Name
**Choice:** `marr-cli`
- ✅ Available on npm registry
- ✅ Descriptive and clear
- ✅ Follows CLI tool naming conventions
- ❌ `marr` is taken (existing package)
- ❌ `@virtualian/marr` requires npm organization

### CLI Framework
**Choice:** Commander.js
- ✅ Simple, intuitive API
- ✅ Lightweight (no dependencies)
- ✅ Well-documented
- ✅ Industry standard (webpack-cli, babel-cli)
- ❌ yargs is more feature-rich but overkill for our needs

### Implementation Language
**Choice:** Node.js (JavaScript/ESM)
- ✅ Cross-platform (Windows, Mac, Linux)
- ✅ Native npm integration
- ✅ Better error handling than bash
- ✅ Easier testing and maintenance
- ❌ Replaces existing bash scripts (rewrite required)

### Directory Structure
**Choice:** Preserve `~/.marr/` but managed by npm package
- ✅ Backward compatible with Phase 1
- ✅ User expectations already set
- ✅ Clear separation of templates and config
- ✅ Easy to locate and inspect

### Template Management
**Choice:** Bundle templates in package
- ✅ Offline usage
- ✅ Version controlled
- ✅ No network dependency after install
- ✅ Simple implementation

---

## Package Structure

```
marr-cli/
├── package.json
├── bin/
│   └── marr.js              # CLI entry point
├── lib/
│   ├── commands/
│   │   ├── init.js          # marr init command
│   │   ├── validate.js      # marr validate command
│   │   └── install-scripts.js  # marr install-scripts command
│   ├── templates/
│   │   ├── user/            # User-level prompt templates
│   │   ├── project/         # Project-level prompt templates
│   │   ├── claude-md/       # CLAUDE.md templates
│   │   └── helper-scripts/  # GitHub helper scripts
│   ├── utils/
│   │   ├── file-ops.js      # File operations
│   │   ├── logger.js        # Colored output
│   │   └── marr-setup.js    # ~/.marr/ initialization
│   └── config/
│       ├── marr-config.yaml
│       └── template-registry.yaml
├── test/
│   ├── init.test.js
│   ├── validate.test.js
│   └── install-scripts.test.js
├── README.md
└── LICENSE
```

---

## Commands

### `marr init`
Initialize new project with MARR configuration.

**Usage:**
```bash
marr init --name my-app --type "web application" --template standards
marr init -n my-app -t "CLI tool"
```

**Options:**
- `--name, -n <name>` - Project name (required)
- `--type, -t <type>` - Project type/description (default: "software project")
- `--template <template>` - CLAUDE.md template: basic|standards|dev-guide|status (default: basic)
- `--dir <path>` - Target directory (default: current directory)

**Actions:**
1. Verify `~/.marr/` exists (create if needed)
2. Check template exists
3. Create project structure (CLAUDE.md, prompts/, docs/, plans/, research/)
4. Copy CLAUDE.md template with substitutions
5. Copy project-level prompts
6. Validate configuration
7. Success message

### `marr validate`
Validate MARR configuration in current project.

**Usage:**
```bash
marr validate
marr validate --strict
```

**Options:**
- `--strict` - Fail on warnings

**Checks:**
- CLAUDE.md exists and has required sections
- prompts/ directory exists
- Required prompt files present (prj-git-workflow-standard.md, etc.)
- Naming conventions followed (user-*, prj-*)
- Prompt references (@prompts/) are valid
- No broken links

### `marr install-scripts`
Install GitHub helper scripts to ~/bin/.

**Usage:**
```bash
marr install-scripts
```

**Actions:**
1. Check ~/bin/ exists (create if needed)
2. Copy gh-add-subissue.sh and gh-list-subissues.sh
3. Make executable (chmod +x)
4. Check if ~/bin/ is in PATH
5. Show instructions if not

### `marr --version`
Show version information.

### `marr --help`
Show help for all commands.

---

## Installation Flow

### Global Installation (Recommended)
```bash
npm install -g marr-cli
marr init --name my-project --type "web app"
```

**First-run behavior:**
- Automatically creates `~/.marr/` infrastructure
- Copies all templates
- Creates config files
- Sets up directory structure

### Local Installation (Development)
```bash
npm install marr-cli
npx marr init --name my-project
```

---

## STEP01: Package Foundation

- [ ] Create `package/` directory in MARR repo
- [ ] Create `package/package.json` with metadata
- [ ] Set up Commander.js CLI framework
- [ ] Create `bin/marr.js` entry point
- [ ] Add basic command structure (init, validate, install-scripts)
- [ ] Implement colored logger utility
- [ ] Implement file operations utility
- [ ] Update all relevant documentation
- [ ] Validate: Run `node bin/marr.js --help` successfully
- [ ] Draft commit message for STEP01

**Commit Message:**
```
Create marr-cli package foundation

- Add package.json with marr-cli metadata
- Set up Commander.js CLI framework with bin/marr.js entry point
- Create basic command structure (init, validate, install-scripts)
- Implement utilities (logger, file-ops)
- Package ready for command implementation

Commit for /npm-package-implementation/STEP01
```

---

## STEP02: Implement `marr init` Command

- [ ] Create `lib/commands/init.js`
- [ ] Implement project initialization logic
- [ ] Add template substitution ({{PROJECT_NAME}}, {{PROJECT_TYPE}})
- [ ] Create directory structure (prompts/, docs/, plans/, research/)
- [ ] Copy CLAUDE.md template with substitutions
- [ ] Copy project-level prompt files
- [ ] Validate configuration after init
- [ ] Add comprehensive error handling
- [ ] Update all relevant documentation
- [ ] Validate: Run `marr init` successfully in test project
- [ ] Draft commit message for STEP02

**Commit Message:**
```
Implement 'marr init' command

- Create init.js command with full initialization logic
- Add template substitution for project variables
- Implement directory structure creation (prompts/, docs/, plans/, research/)
- Copy and customize CLAUDE.md templates
- Copy project-level prompt files
- Add validation after initialization
- Comprehensive error handling for all edge cases

Commit for /npm-package-implementation/STEP02
```

---

## STEP03: Implement `marr validate` Command

- [ ] Create `lib/commands/validate.js`
- [ ] Check CLAUDE.md exists and has required sections
- [ ] Verify prompts/ directory structure
- [ ] Validate required prompt files present
- [ ] Check naming conventions (user-*, prj-*)
- [ ] Verify prompt references (@prompts/) are valid
- [ ] Check for broken file references
- [ ] Add --strict mode for warnings-as-errors
- [ ] Update all relevant documentation
- [ ] Validate: Run `marr validate` on test project successfully
- [ ] Draft commit message for STEP03

**Commit Message:**
```
Implement 'marr validate' command

- Create validate.js with comprehensive configuration checks
- Check CLAUDE.md structure and required sections
- Verify prompts/ directory and required files
- Validate naming conventions (user-*, prj-*)
- Check prompt references and file links
- Add --strict mode for warnings-as-errors
- Clear, actionable error messages

Commit for /npm-package-implementation/STEP03
```

---

## STEP04: Implement `marr install-scripts` Command

- [ ] Create `lib/commands/install-scripts.js`
- [ ] Bundle GitHub helper scripts in package
- [ ] Check ~/bin/ exists (create if needed)
- [ ] Copy gh-add-subissue.sh and gh-list-subissues.sh
- [ ] Make scripts executable (chmod +x)
- [ ] Check if ~/bin/ is in PATH
- [ ] Show PATH setup instructions if needed
- [ ] Update all relevant documentation
- [ ] Validate: Run `marr install-scripts` successfully
- [ ] Draft commit message for STEP04

**Commit Message:**
```
Implement 'marr install-scripts' command

- Create install-scripts.js command
- Bundle GitHub helper scripts in package
- Implement ~/bin/ setup and script installation
- Make scripts executable automatically
- Check PATH and show setup instructions
- Handle edge cases (existing files, permissions)

Commit for /npm-package-implementation/STEP04
```

---

## STEP05: Bundle Templates and Config

- [ ] Copy all templates from ~/.marr/templates/ to package/lib/templates/
- [ ] Copy config files from ~/.marr/config/ to package/lib/config/
- [ ] Create ~/.marr/ setup utility in lib/utils/marr-setup.js
- [ ] Implement first-run detection
- [ ] Copy templates to ~/.marr/ on first run
- [ ] Preserve existing ~/.marr/ if present
- [ ] Update all relevant documentation
- [ ] Validate: First-run creates ~/.marr/ correctly
- [ ] Draft commit message for STEP05

**Commit Message:**
```
Bundle templates and implement ~/.marr/ setup

- Copy all templates to package/lib/templates/
- Copy config files to package/lib/config/
- Create marr-setup.js utility for first-run initialization
- Implement ~/.marr/ creation with all templates
- Preserve existing ~/.marr/ installations
- Backward compatible with Phase 1 manual setup

Commit for /npm-package-implementation/STEP05
```

---

## STEP06: Testing and Documentation

- [ ] Create test suite for init command
- [ ] Create test suite for validate command
- [ ] Create test suite for install-scripts command
- [ ] Test installation flow (npm install -g locally)
- [ ] Test first-run ~/.marr/ setup
- [ ] Write comprehensive README.md for package
- [ ] Update main MARR README.md with npm installation
- [ ] Add troubleshooting section
- [ ] Create examples for common use cases
- [ ] Update all relevant documentation
- [ ] Validate: All tests pass, installation works end-to-end
- [ ] Draft commit message for STEP06

**Commit Message:**
```
Add testing and comprehensive documentation

- Create test suites for all commands
- Test installation and first-run flow
- Write comprehensive package README.md
- Update main MARR README.md with npm instructions
- Add troubleshooting guide
- Document common use cases with examples
- All tests passing, installation validated

Commit for /npm-package-implementation/STEP06
```

---

## STEP07: Publish Preparation

- [ ] Review package.json metadata
- [ ] Add LICENSE file to package
- [ ] Add .npmignore file
- [ ] Test local installation with `npm link`
- [ ] Test global installation in clean environment
- [ ] Verify all commands work after global install
- [ ] Create npm publish checklist
- [ ] Update all relevant documentation
- [ ] Validate: Package ready for npm publish
- [ ] Draft commit message for STEP07

**Commit Message:**
```
Prepare package for npm publication

- Review and finalize package.json metadata
- Add LICENSE and .npmignore
- Test local installation with npm link
- Test global installation in clean environment
- Verify all commands functional after install
- Create npm publish checklist
- Package ready for publication

Commit for /npm-package-implementation/STEP07
```

---

## STEP08: Final Validation and Documentation

- [ ] Run complete integration test
- [ ] Test installation on macOS
- [ ] Test installation on Linux (if available)
- [ ] Update docs/user/ with npm installation guide
- [ ] Update examples with npm workflow
- [ ] Create migration guide for Phase 1 users
- [ ] Update README.md with npm-first workflow
- [ ] Update all relevant documentation
- [ ] Validate: All documentation accurate and complete
- [ ] Draft commit message for STEP08

**Commit Message:**
```
Complete npm package implementation

- Run full integration tests
- Test cross-platform installation
- Update all documentation with npm workflow
- Create migration guide for existing users
- Update examples and troubleshooting
- Package ready for npm publish
- Issue #10 complete

Commit for /npm-package-implementation/STEP08
```

---

## Technical Considerations

### Backward Compatibility
- ✅ Preserve `~/.marr/` directory structure
- ✅ Existing manual installations continue working
- ✅ npm package enhances, doesn't replace

### Cross-Platform Support
- ✅ Node.js runs on Windows, Mac, Linux
- ✅ File operations use path.join() for correct separators
- ✅ Shell scripts have .sh extension but npm handles execution

### Version Management
- ✅ npm handles updates automatically
- ✅ Templates bundled in package (versioned together)
- ✅ Config changes tracked in package version

### User Experience
- ✅ Single command installation: `npm install -g marr-cli`
- ✅ Automatic ~/.marr/ setup on first run
- ✅ Clear, colored terminal output
- ✅ Helpful error messages

---

## Success Criteria

- [ ] Package published to npm registry
- [ ] `npm install -g marr-cli` works
- [ ] `marr init` creates valid project configuration
- [ ] `marr validate` catches configuration errors
- [ ] `marr install-scripts` sets up helper scripts
- [ ] Documentation updated with npm workflow
- [ ] Backward compatible with Phase 1
- [ ] Tests passing for all commands

---

## Open Questions

1. **Should we publish to npm immediately or test privately first?**
   - Recommendation: Test with `npm link` first, then publish to npm

2. **Should Phase 1 bash scripts remain or be deprecated?**
   - Recommendation: Keep for now, mark as legacy in docs

3. **Should we create a migration tool for existing users?**
   - Recommendation: Phase 2 feature, not required for initial npm package

4. **Should templates be updateable separately from package?**
   - Recommendation: Phase 3 feature, bundle for now

---

## Next Steps After Completion

1. Publish to npm registry
2. Announce availability
3. Update GitHub releases
4. Monitor for issues
5. Plan Phase 2: Migration and propagation tools
