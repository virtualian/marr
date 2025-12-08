# Testing MARR

This guide covers how to test MARR before publishing.

## Prerequisites

- macOS with a `testuser` account (for isolated testing)
- Node.js 18+ installed via nvm in testuser

## Quick Test Cycle

### 1. Build the Test Tarball

From your dev account:

```bash
cd /path/to/marr
npm run build
npm pack
```

This creates `virtualian-marr-X.X.X.tgz`.

### 2. Run Tests in Isolated Account

```bash
# Switch to testuser
sudo su - testuser

# Run the test script
bash /path/to/marr/tests/testuser/test-in-testuser.sh
```

The test script:
1. Installs MARR from the tarball
2. Tests `marr --version`
3. Tests `marr init --user` and verifies files
4. Tests `marr init --project` and verifies files
5. Tests `marr validate`
6. Tests `marr clean --dry-run`

### 3. Clean Up

```bash
# In testuser account
bash /path/to/marr/tests/testuser/cleanup-testuser.sh
```

## Setting Up testuser (One-Time)

### Create the Account

Create a standard user account named `testuser` via System Preferences.

### Install Node.js

```bash
sudo su - testuser
bash /path/to/marr/tests/testuser/setup-testuser.sh
```

This installs nvm and Node.js 18.

### Set Permissions

The testuser needs read access to the marr directory:

```bash
# From dev account
chmod -R o+rX /path/to/marr
```

## Manual Testing

If you prefer testing specific commands:

```bash
# In testuser account
npm install -g /path/to/marr/virtualian-marr-X.X.X.tgz

# Test individual commands
marr --version
marr init --user
marr init --project --force
marr validate
marr clean --project --dry-run
```

## What to Test

Before each release, verify:

- [ ] `marr init --user` creates `~/.claude/marr/` and helper scripts
- [ ] `marr init --project` creates `.claude/marr/` with standards
- [ ] `marr validate` passes on a fresh project
- [ ] `marr clean` removes files correctly
- [ ] All commands work from a clean state (no prior MARR)

## Troubleshooting

**"marr: command not found"** — Load nvm: `source ~/.nvm/nvm.sh`

**Permission denied on npm install** — Use nvm, not system Node.js

**Tarball not found** — Run `npm pack` in the marr directory first
