# GitHub Helper Scripts

This directory contains helper scripts for GitHub operations that are not yet available in the native `gh` CLI.

## Available Scripts

### gh-add-subissue.sh

**Purpose:** Link a GitHub issue as a sub-issue of a parent issue using GitHub's GraphQL API.

**Usage:**
```bash
gh-add-subissue.sh <parent-issue-number> <sub-issue-number>
```

**Example:**
```bash
# Link issue #47 as a sub-issue of #45
gh-add-subissue.sh 45 47
```

**What it does:**
- Validates both parent and sub-issue exist
- Uses GitHub GraphQL API to create sub-issue relationship
- Provides clear success/failure feedback
- Includes proper error handling

---

### gh-list-subissues.sh

**Purpose:** List all sub-issues of a parent GitHub issue.

**Usage:**
```bash
gh-list-subissues.sh <parent-issue-number>
```

**Example:**
```bash
# List all sub-issues of issue #45
gh-list-subissues.sh 45
```

**What it does:**
- Queries GitHub GraphQL API for sub-issue relationships
- Displays sub-issue numbers, titles, and states
- Shows "No sub-issues found" if parent has no sub-issues
- Includes proper error handling

---

## Requirements

**Required Tools:**
- **gh CLI** - GitHub's official command-line tool
  - Install: https://cli.github.com/
  - Authenticate: `gh auth login`
- **jq** - Command-line JSON processor
  - macOS: `brew install jq`
  - Linux: `apt-get install jq` or `yum install jq`
  - Windows: Download from https://stedolan.github.io/jq/

**Authentication:**
The scripts require GitHub CLI to be authenticated with appropriate permissions:
```bash
gh auth login
```

**Repository Context:**
Scripts must be run from within a git repository that has a GitHub remote configured.

---

## Installation

### Option 1: Manual Installation

Copy scripts to a directory in your PATH:

```bash
# Copy to ~/bin/ (create if needed)
mkdir -p ~/bin
cp ~/.claude/marr/templates/helper-scripts/*.sh ~/bin/

# Make executable (if not already)
chmod +x ~/bin/gh-*.sh

# Add ~/bin to PATH if not already (add to ~/.zshrc or ~/.bashrc)
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Option 2: Automated Installation (Recommended)

Use the MARR installation tool:

```bash
marr-install-scripts
```

This will:
- Check for ~/bin/ directory (create if needed)
- Copy scripts from templates to ~/bin/
- Set executable permissions
- Verify ~/bin/ is in your PATH
- Provide instructions if PATH update needed

---

## Verification

**Test installation:**
```bash
# Should show usage information
gh-add-subissue.sh
gh-list-subissues.sh
```

**Check PATH:**
```bash
echo $PATH | grep "$HOME/bin"
```

If ~/bin is not in your PATH, add it:
```bash
export PATH="$HOME/bin:$PATH"
```

---

## Why These Scripts Exist

GitHub's `gh` CLI does not yet have native support for sub-issue management. These scripts use GitHub's GraphQL API to provide this functionality until native support is added.

**When native support arrives:**
These scripts should be deprecated in favor of official `gh` commands.

---

## Troubleshooting

### "gh: command not found"
Install GitHub CLI: https://cli.github.com/

### "jq: command not found"
Install jq:
- macOS: `brew install jq`
- Linux: `apt-get install jq` or `yum install jq`

### "Could not resolve to a Repository"
Ensure you're in a git repository with a GitHub remote:
```bash
git remote -v
```

### "GraphQL: Could not resolve to an issue"
Verify the issue number exists:
```bash
gh issue view <issue-number>
```

### Permission errors
Ensure GitHub CLI is authenticated with appropriate permissions:
```bash
gh auth status
gh auth refresh
```

---

## Technical Details

**API Used:** GitHub GraphQL API v4

**Permissions Required:**
- `repo` scope (full repository access)
- Read/write access to issues

**Rate Limiting:**
Scripts are subject to GitHub's GraphQL API rate limits. For normal usage, this should not be an issue.

---

## Examples

**Create a sub-issue hierarchy:**
```bash
# Main feature: issue #100
# Sub-tasks: issues #101, #102, #103

gh-add-subissue.sh 100 101
gh-add-subissue.sh 100 102
gh-add-subissue.sh 100 103

# View all sub-issues
gh-list-subissues.sh 100
```

**Verify sub-issue relationship:**
```bash
# List sub-issues to confirm they were added
gh-list-subissues.sh 100
```

---

## Contributing

These scripts are part of the MARR (Making Agents Really Reliable) configuration system.

Report issues or suggest improvements at: https://github.com/virtualian/repo-setup

---

## License

Part of MARR system. Use freely for GitHub sub-issue management.
