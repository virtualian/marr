# Testing Scripts

These scripts support testing the MARR package in an isolated testuser account.

## Scripts

### `setup-testuser.sh`
Sets up Node.js environment in testuser account using nvm.

**Usage** (run as testuser):
```bash
bash /path/to/marr/scripts/setup-testuser.sh
```

**What it does:**
- Installs nvm (Node Version Manager)
- Installs Node.js 18 LTS
- Configures environment

**Run once per testuser account.**

---

### `build-test-tarball.sh`
Builds a test tarball from the current source code.

**Usage** (run from repo root):
```bash
cd /path/to/marr
bash scripts/build-test-tarball.sh
```

**What it does:**
- Runs `npm run build` to compile TypeScript
- Runs `npm pack` to create tarball
- Creates tarball in tests/ directory

**Run after making code changes.**

---

### `test-in-testuser.sh`
Comprehensive automated test suite for MARR package.

**Usage** (run as testuser):
```bash
bash /path/to/marr/tests/testuser/test-in-testuser.sh
```

**What it does:**
1. Installs MARR from tarball
2. Tests `marr --version`
3. Tests `marr init` with template substitution
4. Tests `marr validate`
5. Verifies generated files (CLAUDE.md, prompts/)
6. Verifies `~/.claude/marr/` setup and import integration

**Prerequisites:** Node.js installed via setup-testuser.sh

---

### `check-binary-name.js`
Validates binary name before publishing to npm.

**Usage:**
```bash
npm run check-bin
```

**What it does:**
- Checks that package.json has `"marr"` as binary name
- Prevents accidental publication with wrong name
- Called automatically by `prepublishOnly` hook

**You shouldn't need to run this manually.**

---

### `cleanup-testuser.sh`
Removes all MARR artifacts from testuser account to reset to clean state.

**Usage** (run as testuser):
```bash
bash /path/to/marr/scripts/cleanup-testuser.sh
```

**What it does:**
- Uninstalls `@virtualian/marr` npm package
- Removes `~/.claude/marr/` directory
- Removes MARR import from `~/.claude/CLAUDE.md`
- Removes test project directories (`marr-test-*`)

**When to use:**
- Before testing first-run experience
- Between test iterations to verify clean install
- When debugging installation issues
- To fully reset testuser environment

---

## Permissions

For testuser to access these scripts, set appropriate permissions on the repo directory:

```bash
# Make repo directory accessible to testuser
# Adjust the path to where you cloned the repo
REPO_PATH="/path/to/marr"

chmod o+rx "$HOME"
chmod o+rx "$(dirname "$REPO_PATH")"
chmod o+rx "$REPO_PATH"
chmod -R o+rX "$REPO_PATH/tests"
chmod 755 "$REPO_PATH/scripts"
```

These permissions allow testuser to:
- Traverse the directory path
- Read scripts and tarball
- Execute scripts

**Note**: If your repo is in a location accessible to all users (like `/tmp` or `/usr/local/src`), you may not need to modify home directory permissions.

---

## Typical Workflow

**Initial Setup (one-time):**
```bash
# As testuser (adjust path to your repo location)
sudo su - testuser
bash /path/to/marr/scripts/setup-testuser.sh
exit
```

**Testing Cycle:**
```bash
# As dev user: Build tarball
cd /path/to/marr
npm run build

# As testuser: Run tests
sudo su - testuser
bash /path/to/marr/tests/testuser/test-in-testuser.sh
exit
```

---

See [docs/dev/how-to/testing.md](../docs/dev/how-to/testing.md) for comprehensive testing documentation.
