# Quick Reference: Testing Scripts

## One-Time Setup

```bash
# As testuser
bash /path/to/marr/package/scripts/setup-testuser.sh
```

## Test Cycle

### 1. Build (as dev user)
```bash
cd /path/to/marr/package
bash scripts/build-test-tarball.sh
```

### 2. Test (as testuser)
```bash
bash /path/to/marr/package/scripts/test-in-testuser.sh
```

### 3. Clean (as testuser)
```bash
bash /path/to/marr/package/scripts/cleanup-testuser.sh
```

## All Scripts

| Script | User | Purpose |
|:-------|:-----|:--------|
| `setup-testuser.sh` | testuser | Install Node.js (one-time) |
| `build-test-tarball.sh` | dev | Build tarball from source |
| `test-in-testuser.sh` | testuser | Run full test suite |
| `cleanup-testuser.sh` | testuser | Reset to clean state |
| `check-binary-name.js` | dev | Validate for publishing |
| `verify-permissions.sh` | dev | Check testuser can access files |

## Common Workflows

### First Time Testing
```bash
# 1. Setup testuser
sudo su - testuser
bash /path/to/marr/package/scripts/setup-testuser.sh
exit

# 2. Build and test
cd /path/to/marr/package
bash scripts/build-test-tarball.sh

sudo su - testuser
bash /path/to/marr/package/scripts/test-in-testuser.sh
```

### Iterative Testing
```bash
# Make code changes, then:
bash scripts/build-test-tarball.sh

# As testuser:
sudo su - testuser
bash /path/to/marr/package/scripts/cleanup-testuser.sh
bash /path/to/marr/package/scripts/test-in-testuser.sh
```

### Testing First-Run Experience
```bash
# As testuser:
bash /path/to/marr/package/scripts/cleanup-testuser.sh  # Clean slate
bash /path/to/marr/package/scripts/test-in-testuser.sh  # Test fresh install
```

## Tips

- **Load nvm manually** if needed:
  ```bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  ```

- **Check permissions** if testuser can't access scripts:
  ```bash
  bash /path/to/marr/package/scripts/verify-permissions.sh
  ```

- **Paths are dynamic** - all scripts find package directory automatically

- **Scripts are portable** - works from any directory location
