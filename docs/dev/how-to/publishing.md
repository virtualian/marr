# Publishing MARR

This guide publishes a new MARR release to npm and GitHub.

The Version Control Standard requires every tagged release to have **both** an updated section in `RELEASE_NOTES.md` and a published GitHub Release. This procedure produces both.

## Before Publishing

1. **All PRs for the release are merged to main**
2. **Local main is up to date** — `git checkout main && git pull`
3. **Working directory is clean** — `git status` shows nothing
4. **Tests pass** — `npm test` (see [testing.md](./testing.md))
5. **`RELEASE_NOTES.md` is up to date** — rename the `## Unreleased` heading to `## [vX.Y.Z] — YYYY-MM-DD` and add a matching `[vX.Y.Z]: https://github.com/virtualian/marr/releases/tag/vX.Y.Z` link reference at the bottom of the file
6. **`KNOWN_ISSUES.md` reflects current state** — new issues added, resolved issues removed
7. **You are logged in to npm** — `npm whoami` returns the publishing account; if not, run `npm login`

Steps 1–6 must be merged to main via PR before continuing. Do not run the release commands on a feature branch.

## Release Process

### 1. Bump Version, Commit, and Tag

```bash
npm version patch   # 3.6.0 → 3.6.1   (bug fixes only)
npm version minor   # 3.6.0 → 3.7.0   (new features, backward-compatible)
npm version major   # 3.6.0 → 4.0.0   (breaking changes)
```

`npm version` updates `package.json` and `package-lock.json`, creates a commit containing only the version bump, and creates an annotated tag — atomically.

### 2. Push Commit and Tag

```bash
git push && git push --tags
```

### 3. Publish to npm

```bash
npm publish --access public
```

The `prepublishOnly` hook re-runs the binary check, build, and tests as a final gate before the package is uploaded.

### 4. Create the GitHub Release

The Release body must mirror the new version's section in `RELEASE_NOTES.md`. Extract that section to a temporary file, then publish:

```bash
# Replace vX.Y.Z with the tag you just pushed
gh release create vX.Y.Z \
  --title "vX.Y.Z" \
  --notes-file <path-to-extracted-section.md>
```

### 5. Verify Publication

```bash
npm view @virtualian/marr version            # should match the new tag
gh release view vX.Y.Z                       # should show the published Release
npm install -g @virtualian/marr && marr --version
```

## Versioning Guidelines

Follow semantic versioning:

| Change Type | Version Bump | Example |
|-------------|--------------|---------|
| Bug fixes, doc updates | patch | 3.6.0 → 3.6.1 |
| New features (backward compatible) | minor | 3.6.0 → 3.7.0 |
| Breaking changes | major | 3.6.0 → 4.0.0 |

## Troubleshooting

**401 / 403 from npm** — Run `npm login` and verify with `npm whoami`

**Package name taken** — MARR uses `@virtualian/marr` (scoped package)

**Version already exists on npm** — You cannot republish the same version; bump and try again

**Tag pushed but `gh release create` fails** — The tag is on origin without a published Release. Re-run `gh release create vX.Y.Z` against the same tag.

**`prepublishOnly` failed** — The build or tests failed inside `npm publish`. Fix the issue on a feature branch, merge, and re-tag with the next patch version. Never reuse a published or pushed tag.
