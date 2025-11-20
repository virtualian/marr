# Testing MARR Package with testuser Account

## Overview

This guide explains how to test the MARR package in a clean macOS user account before publishing to npm. Testing in an isolated user account ensures we validate:

- Complete first-run experience (including `~/.marr/` setup)
- Template installation and substitution
- All three commands (`init`, `validate`, `install-scripts`)
- User-level and project-level prompt file creation
- Helper script installation

## Prerequisites

- macOS testuser account created
- Access to both ianmarr (dev) and testuser accounts

## One-Time Setup: Install Node.js in testuser

The testuser needs its own Node.js installation via nvm to avoid permission issues.

### Step 1: Switch to testuser

```bash
# From ianmarr account
sudo su - testuser
```

### Step 2: Run setup script

```bash
bash /Users/ianmarr/projects/marr/package/scripts/setup-testuser.sh
```

This script will:
- Install nvm (Node Version Manager)
- Install Node.js 18 LTS
- Configure the environment

### Step 3: Verify installation

```bash
node --version  # Should show v18.x.x
npm --version   # Should show npm version
```

### Step 4: Make nvm persistent (one-time)

Add to `~/.zshrc` (or `~/.bash_profile` if using bash):

```bash
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zshrc
```

Logout and login again to testuser for this to take effect.

---

## Testing Workflow

### Step 1: Build Test Tarball (in ianmarr account)

```bash
# Return to ianmarr account
exit  # from testuser

# Build test tarball
cd /Users/ianmarr/projects/marr/package
bash scripts/build-test-tarball.sh
```

This script:
- Builds the TypeScript source
- Creates a tarball (virtualian-marr-1.0.0.tgz)
- Tests the exact artifact users will install from npm

### Step 2: Run Automated Tests (in testuser account)

```bash
# Switch to testuser
sudo su - testuser

# Run comprehensive test suite
bash /Users/ianmarr/projects/marr/package/scripts/test-in-testuser.sh
```

The test script will:
1. ✅ Install MARR from tarball
2. ✅ Test `marr --version`
3. ✅ Test `marr init` with all template substitutions
4. ✅ Test `marr validate`
5. ✅ Verify generated files (CLAUDE.md, prompts/)
6. ✅ Verify `~/.marr/` setup (templates, scripts)
7. ✅ Test `marr install-scripts`
8. ✅ Verify helper scripts installed and executable

### Expected Output

```
🧪 MARR Package Testing in testuser Account
============================================

🧹 Cleaning previous test state...
📦 Installing MARR from tarball...
✅ Installation complete!

Testing commands...

Test 1: marr --version
1.0.0

Test 2: marr init
✅ Init complete

Test 3: marr validate
✅ Validation passed

Test 4: Checking generated files...
  ✅ CLAUDE.md exists
  ✅ prompts/ directory exists
  ✅ Git workflow prompt exists

Test 5: Checking ~/.marr/ setup...
  ✅ ~/.marr/ exists
  ✅ Templates directory exists
  ✅ Helper scripts directory exists

Test 6: marr install-scripts
  ✅ gh-add-subissue.sh installed
  ✅ gh-list-subissues.sh installed
  ✅ Scripts are executable

============================================
✅ ALL TESTS PASSED!
```

---

## Manual Testing (Alternative)

If you want to test manually instead of using the automated script:

### Step 1: Clean Previous State

```bash
# In testuser account - use cleanup script
bash /path/to/marr/package/scripts/cleanup-testuser.sh
```

### Step 2: Install from Tarball

```bash
npm install -g /Users/ianmarr/projects/marr/package/virtualian-marr-1.0.0.tgz
```

### Step 3: Test Commands

```bash
# Test version
marr --version

# Test init
mkdir ~/test-project
cd ~/test-project
marr init --name my-test --type "test app" --template standards

# Test validate
marr validate

# Test install-scripts
marr install-scripts
ls -la ~/bin/gh-*
```

### Step 4: Verify Generated Files

```bash
# Check project files
cat CLAUDE.md
ls -la prompts/
cat prompts/prj-git-workflow-standard.md

# Check user-level setup
ls -la ~/.marr/
ls -la ~/.marr/templates/
ls -la ~/.marr/helper-scripts/
```

---

## Cleaning Up After Testing

### Quick Clean - Use Cleanup Script (Recommended)

```bash
# In testuser account
bash /path/to/marr/package/scripts/cleanup-testuser.sh
```

This removes:
- npm package (`@virtualian/marr`)
- `~/.marr/` directory
- Helper scripts in `~/bin/`
- Test project directories

### Full Clean (including Node.js)

If you want to completely reset testuser and remove Node.js:

```bash
# Remove all MARR and Node.js
rm -rf ~/.marr
rm -rf ~/.nvm
rm -rf ~/bin
rm -rf ~/marr-test-*
rm -rf ~/.npm
```

**Note**: After full clean, you'll need to run `setup-testuser.sh` again to reinstall Node.js.

---

## Iterative Testing

When you make changes and need to retest:

### Quick Iteration Cycle

**In dev account:**
```bash
cd /path/to/marr/package

# Make your code changes
vim src/commands/init.ts

# Rebuild test tarball
bash scripts/build-test-tarball.sh
```

**In testuser account:**
```bash
# Clean and retest
bash /path/to/marr/package/scripts/cleanup-testuser.sh
bash /path/to/marr/package/scripts/test-in-testuser.sh
```

### Manual Quick Test

If you just want to test a specific command:

```bash
# In testuser account
npm uninstall -g @virtualian/marr
npm install -g /path/to/marr/package/virtualian-marr-1.0.0.tgz

# Test your changes
marr init --name test-$(date +%s)
```

---

## Troubleshooting

### Problem: `npm install -g` permission denied

**Cause**: Using system Node.js instead of nvm
**Solution**: Run setup script to install nvm

```bash
bash /Users/ianmarr/projects/marr/package/scripts/setup-testuser.sh
```

### Problem: `marr: command not found`

**Cause**: Node.js not in PATH
**Solution**: Load nvm

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

Make it permanent by adding to `~/.zshrc`:

```bash
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zshrc
```

### Problem: Test script fails with "Tarball not found"

**Cause**: Tarball not built yet
**Solution**: Build tarball first

```bash
# In ianmarr account
cd /Users/ianmarr/projects/marr/package
bash scripts/build-test-tarball.sh
```

### Problem: `~/.marr/` not created

**Cause**: First-run setup failed
**Solution**: Check marr-setup.ts logs

```bash
# Try running init with more verbosity
marr init --name test --template basic
ls -la ~/.marr/
```

---

## What Gets Tested

### Installation
- ✅ Global npm installation from tarball
- ✅ Binary command available in PATH
- ✅ Version command works

### First-Run Setup
- ✅ `~/.marr/` directory created
- ✅ Templates copied to `~/.marr/templates/`
- ✅ Helper scripts copied to `~/.marr/helper-scripts/`

### Init Command
- ✅ Creates CLAUDE.md with template substitutions
- ✅ Creates prompts/ directory
- ✅ Copies project-level prompt files
- ✅ Template variables replaced ({{PROJECT_NAME}}, {{PROJECT_TYPE}})
- ✅ File permissions correct

### Validate Command
- ✅ Validates CLAUDE.md exists
- ✅ Validates prompts/ directory exists
- ✅ Checks prompt file naming conventions
- ✅ Validates prompt references

### Install-Scripts Command
- ✅ Creates ~/bin/ directory if needed
- ✅ Copies helper scripts
- ✅ Sets executable permissions
- ✅ Provides PATH instructions if needed

---

## Best Practices

1. **Test before every publish** - Always run full test suite before publishing to npm
2. **Test in clean environment** - Use testuser account, not your dev account
3. **Test all templates** - Try each template type (basic, standards, dev-guide, status)
4. **Verify first-run** - Clean `~/.marr/` and test fresh installation experience
5. **Check permissions** - Ensure generated files have correct permissions
6. **Test error cases** - Try invalid inputs, missing files, etc.

---

## Integration with Development Workflow

### Development Cycle

1. Make changes in ianmarr account
2. Build test tarball: `bash scripts/build-test-tarball.sh`
3. Test in testuser: `bash scripts/test-in-testuser.sh`
4. If tests pass, commit changes
5. Repeat as needed

### Before Publishing

1. Run full test suite in testuser
2. Verify all tests pass
3. Clean up testuser state
4. Change binary to `marr` in package.json
5. Publish to npm
6. Restore binary to `marr-dev`
7. Test published version in testuser

---

## Summary

This testing workflow ensures:
- ✅ Complete validation of user experience
- ✅ Isolated testing environment
- ✅ Verification of all commands and features
- ✅ Confidence before publishing to npm

The testuser account provides true isolation and tests exactly what real users will experience when they install MARR.
