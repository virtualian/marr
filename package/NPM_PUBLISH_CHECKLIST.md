# npm Publish Checklist for marr-cli

## Pre-Publish Verification

### 1. Code Quality
- [x] All TypeScript compiles without errors
- [x] All commands tested manually (init, validate, install-scripts)
- [x] Error handling tested
- [x] Edge cases covered

### 2. Package Configuration
- [x] package.json metadata complete (name, version, description, author, license)
- [x] package.json keywords relevant for discovery
- [x] package.json repository URL correct
- [x] package.json files list correct (dist/, templates/, README.md, LICENSE)
- [x] .npmignore excludes source files
- [x] LICENSE file present

### 3. Documentation
- [x] README.md comprehensive and accurate
- [x] Installation instructions clear
- [x] All commands documented with examples
- [x] Troubleshooting guide included
- [x] Requirements listed

### 4. Templates
- [x] All templates bundled in package/templates/
- [x] CLAUDE.md templates (basic, standards, dev-guide, status)
- [x] Project-level prompts (prj-*.md)
- [x] User-level prompts (user-*.md)
- [x] Helper scripts (gh-*.sh)

### 5. Testing
- [x] npm link tested locally
- [x] Commands work after linking
- [x] First-run ~/.marr/ setup works
- [x] Template substitution works
- [x] Validation catches errors
- [x] Helper scripts install correctly

### 6. Package Verification
- [x] npm pack --dry-run shows correct files
- [ ] npm pack creates tarball without errors
- [ ] Extract and inspect tarball contents
- [ ] Install from tarball and test

## Pre-Publish Commands

```bash
# 1. Build package
npm run build

# 2. Run tests (if any)
npm test

# 3. Check package contents
npm pack --dry-run

# 4. Create tarball for manual verification
npm pack

# 5. Extract and inspect
tar -tzf marr-cli-1.0.0.tgz

# 6. Test installation from tarball
npm install -g marr-cli-1.0.0.tgz
marr --version
marr init -n test --dir /tmp/test
```

## npm Account Setup

### 1. Create npm Account
- Go to https://www.npmjs.com/signup
- Create account with email
- Verify email address

### 2. Login to npm
```bash
npm login
# Enter username, password, email
```

### 3. Verify Login
```bash
npm whoami
```

## Publishing

### 1. Publish to npm (First Time)
```bash
# From package/ directory
npm publish --access public

# Note: First publish of scoped packages requires --access public
# marr-cli is NOT scoped, so this is optional but safe
```

### 2. Verify Publication
```bash
# Check on npm registry
open https://www.npmjs.com/package/marr-cli

# Test installation
npm install -g marr-cli
marr --version
```

## Post-Publish

### 1. Update Main README
- [ ] Update npm registry link from "coming soon" to actual link
- [ ] Add installation badge
- [ ] Update version number if needed

### 2. Create GitHub Release
- [ ] Tag version: `git tag v1.0.0`
- [ ] Push tags: `git push --tags`
- [ ] Create GitHub release with changelog

### 3. Announce
- [ ] Update issue #10 with npm package link
- [ ] Close issue #10
- [ ] Document in project README

## Version Updates (Future)

### Semantic Versioning
- **Patch (1.0.x)**: Bug fixes, documentation updates
- **Minor (1.x.0)**: New features, backward compatible
- **Major (x.0.0)**: Breaking changes

### Update Process
```bash
# 1. Update version in package.json
npm version patch  # or minor, or major

# 2. Build and test
npm run build
npm test

# 3. Commit and tag
git add package.json
git commit -m "Bump version to x.x.x"
git tag vx.x.x

# 4. Publish
npm publish

# 5. Push changes
git push && git push --tags
```

## Troubleshooting

### Package name already taken
If `marr-cli` is already taken:
- Try alternative: `@virtualian/marr` (requires npm organization)
- Try alternative: `marr-config`, `marr-agent-cli`

### Permission denied
```bash
# Re-login to npm
npm logout
npm login
```

### 403 Forbidden
- Verify package name is available
- Check if you own the package name
- Verify npm account has publish permissions

### Package too large
```bash
# Check package size
npm pack --dry-run | grep Tarball
# Should be under 10MB

# If too large, check .npmignore
```

## Final Check

Before running `npm publish`:

- [ ] Working directory is `/Users/ianmarr/projects/marr/package`
- [ ] All code committed to Git
- [ ] Version number is correct in package.json
- [ ] README.md is accurate and complete
- [ ] npm account is logged in (`npm whoami`)
- [ ] Ready to publish!

## Publish Command

```bash
cd /Users/ianmarr/projects/marr/package
npm publish
```

---

**After successful publish, the package will be available at:**
https://www.npmjs.com/package/marr-cli
