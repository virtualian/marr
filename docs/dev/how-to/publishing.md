# Publishing MARR

This guide covers how to publish a new MARR release to npm.

## Before Publishing

1. **Run the test suite** — See [testing.md](./testing.md)
2. **Verify all tests pass** in the testuser account
3. **Check you're on main** with a clean working directory

## Release Process

### 1. Bump Version

Use the release script:

```bash
./scripts/release.sh patch   # 2.0.0 → 2.0.1
./scripts/release.sh minor   # 2.0.0 → 2.1.0
./scripts/release.sh major   # 2.0.0 → 3.0.0
```

This script:
- Updates version in package.json
- Builds the TypeScript
- Creates a git commit and tag

### 2. Push to GitHub

```bash
git push origin main --tags
```

### 3. Publish to npm

```bash
npm publish --access public
```

### 4. Verify Publication

```bash
# Check npm registry
npm view @virtualian/marr

# Test installation
npm install -g @virtualian/marr
marr --version
```

## Versioning Guidelines

Follow semantic versioning:

| Change Type | Version Bump | Example |
|-------------|--------------|---------|
| Bug fixes, doc updates | patch | 2.0.0 → 2.0.1 |
| New features (backward compatible) | minor | 2.0.0 → 2.1.0 |
| Breaking changes | major | 2.0.0 → 3.0.0 |

## Troubleshooting

**403 Forbidden** — Run `npm login` and verify with `npm whoami`

**Package name taken** — MARR uses `@virtualian/marr` (scoped package)

**Version already exists** — You cannot republish the same version; bump and try again
