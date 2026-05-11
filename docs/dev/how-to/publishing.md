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
7. **npm auth is set up for publishing** — see [Authenticating to npm](#authenticating-to-npm) below. Run `npm whoami` and `npm publish --dry-run --access public` to surface auth problems *before* the tag is cut

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

## Authenticating to npm

Modern npm accounts default to **2FA: Auth and Writes** — every publish demands a second factor, not just login. There are two CLI-friendly paths.

### Interactive OTP (TOTP authenticator)

Use this if your second factor is an authenticator app (Google Authenticator, 1Password, etc.):

```bash
npm publish --access public                       # prompts for the 6-digit code
# or pre-supplied:
npm publish --access public --otp <6-digit-code>
```

This path does **not** work with a passkey second factor — npm cannot prompt a passkey through a terminal.

### Granular Access Token with 2FA bypass

The portable path; required for passkey-only accounts and recommended for any non-interactive publish.

1. Visit `https://www.npmjs.com/settings/<account>/tokens`
2. Create a **Granular Access Token**
3. **Tick "Allow this token to bypass 2FA when publishing or modifying packages"** — this checkbox is near the top of the form. Without it, the token produces a 403 at publish time: *"Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages."*
4. Scope the token to `@virtualian/marr` with *Read and write* permissions
5. Publish using a one-shot userconfig so the token never lands in `~/.npmrc`:

```bash
echo "//registry.npmjs.org/:_authToken=<TOKEN>" > /tmp/release-npmrc
chmod 600 /tmp/release-npmrc
npm publish --access public --userconfig /tmp/release-npmrc
rm -f /tmp/release-npmrc
```

Revoke and regenerate the token after each release if it has appeared anywhere outside your password manager.

### Verify before tagging

The cheapest gate is a dry-run from the project before `npm version`:

```bash
npm whoami                                    # confirms you are logged in
npm publish --dry-run --access public         # exercises auth without uploading
```

A failure here means the tag should not be cut yet.

## Troubleshooting

**401 / 403 from npm** — Auth misconfiguration. See [Authenticating to npm](#authenticating-to-npm). A 403 with the "Two-factor authentication or granular access token with bypass 2fa enabled is required" message means your token was created without the 2FA-bypass checkbox enabled.

**Package name taken** — MARR uses `@virtualian/marr` (scoped package)

**Version already exists on npm** — You cannot republish the same version; bump and try again

**Tag pushed but `gh release create` fails** — The tag is on origin without a published Release. Re-run `gh release create vX.Y.Z` against the same tag.

**`prepublishOnly` failed** — The build or tests failed inside `npm publish`. Fix the issue on a feature branch, merge, and re-tag with the next patch version. Never reuse a published or pushed tag.
