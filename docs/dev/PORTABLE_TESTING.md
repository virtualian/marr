# Portable Testing Setup

## Overview

The MARR testing infrastructure is now **portable** and **path-independent**. All scripts automatically detect their location and work from any directory.

## Key Features

### 1. Dynamic Path Detection

All scripts use `${BASH_SOURCE[0]}` to find their location:

```bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
```

This means:
- ✅ Works from any location on the filesystem
- ✅ No hardcoded `/Users/ianmarr/` paths
- ✅ Portable across machines and users
- ✅ Works in CI/CD environments

### 2. Self-Contained Scripts

**setup-testuser.sh**:
- Installs nvm and Node.js
- Finds package directory automatically
- Provides next steps with actual paths

**test-in-testuser.sh**:
- Loads nvm automatically
- Finds tarball relative to script location
- Verifies Node.js availability
- Shows detected package directory

**build-test-tarball.sh**:
- Builds from script's parent directory
- Works regardless of where you run it from

### 3. No User-Specific Assumptions

The scripts no longer assume:
- ❌ Username is "ianmarr"
- ❌ Projects are in `/Users/ianmarr/projects`
- ❌ Any specific directory structure

Instead they assume:
- ✅ Scripts are in `package/scripts/`
- ✅ Tarball is in `package/`
- ✅ Relative structure is consistent

## Usage

### For Your Machine

```bash
# Setup testuser (one-time)
sudo su - testuser
bash /Users/ianmarr/projects/marr/package/scripts/setup-testuser.sh

# Build and test
cd /Users/ianmarr/projects/marr/package
bash scripts/build-test-tarball.sh

sudo su - testuser
bash /Users/ianmarr/projects/marr/package/scripts/test-in-testuser.sh
```

### For Other Developers

```bash
# Clone repo
git clone https://github.com/virtualian/marr.git
cd marr/package

# Setup their testuser
sudo su - testuser
bash scripts/setup-testuser.sh

# Build and test
bash scripts/build-test-tarball.sh

sudo su - testuser
bash scripts/test-in-testuser.sh
```

### For CI/CD

```bash
# Works from any location
git clone https://github.com/virtualian/marr.git /tmp/marr
cd /tmp/marr/package

# Scripts find everything automatically
bash scripts/build-test-tarball.sh
bash scripts/test-in-testuser.sh  # If CI has nvm
```

## Permissions

The only machine-specific setup is making the package directory accessible to testuser:

```bash
# Generic approach (adjust REPO_PATH to your location)
REPO_PATH="/Users/username/projects/marr"

chmod o+rx "$(dirname "$(dirname "$REPO_PATH")")"  # Parent of projects
chmod o+rx "$(dirname "$REPO_PATH")"                # projects/
chmod o+rx "$REPO_PATH"                             # marr/
chmod -R o+rX "$REPO_PATH/package"                  # package/ and contents
chmod 755 "$REPO_PATH/package/scripts"              # scripts/
```

Or use a shared location:

```bash
# Clone to shared directory
git clone https://github.com/virtualian/marr.git /usr/local/src/marr
# Already accessible to all users, no permission changes needed
```

## Benefits

### For Development
- Move the repo anywhere - scripts still work
- Multiple developers can clone and test
- No configuration files to edit

### For Collaboration
- Other developers can run tests immediately
- No "adjust this path" instructions needed
- Works on any Unix-like system

### For CI/CD
- Can clone to temporary directories
- No environment-specific configuration
- Scripts are self-contained

## What Still Needs Manual Setup

1. **testuser account creation** - macOS System Preferences
2. **Directory permissions** - Allow testuser to access scripts
3. **nvm installation** - Run setup-testuser.sh once

Everything else is automatic!

## Testing Portability

To verify portability, try:

```bash
# Copy to a different location
cp -r /Users/ianmarr/projects/marr /tmp/marr-test
cd /tmp/marr-test/package

# Build and run tests - should work identically
bash scripts/build-test-tarball.sh
bash scripts/test-in-testuser.sh
```

The scripts will automatically adapt to the new location.

---

**The testing infrastructure is now fully portable and ready for collaboration, CI/CD, and sharing!** 🚀
