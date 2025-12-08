# Getting Started with MARR

This guide walks you through installing and setting up MARR for the first time.

## Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** (comes with Node.js)

## Installation

Install MARR globally:

```bash
npm install -g @virtualian/marr
```

Verify the installation:

```bash
marr --version
```

### Troubleshooting Installation

If you see a permission error (`EACCES`), you have three options:

1. **Use npx** (no global install needed):
   ```bash
   npx @virtualian/marr init --user
   ```

2. **Use nvm** (recommended for developers):
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   # Restart terminal
   nvm install node
   npm install -g @virtualian/marr
   ```

3. **Change npm's default directory**:
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
   source ~/.zshrc
   npm install -g @virtualian/marr
   ```

## First-Time Setup

MARR uses a two-layer configuration system. You need to set up both layers:

### Step 1: User-Level Setup (Once Per Machine)

Run this once on each machine where you use MARR:

```bash
marr init --user
```

This creates:
- `~/.claude/marr/MARR-USER-CLAUDE.md` — Your personal preferences

### Step 2: Project-Level Setup (Once Per Project)

Navigate to your project and run:

```bash
marr init --project
```

This creates:
- `CLAUDE.md` — Project root config (or updates existing)
- `.claude/marr/MARR-PROJECT-CLAUDE.md` — Project AI agent configuration
- `.claude/marr/standards/` — Project-specific standards

You'll be prompted to select which standards to install. Choose the ones relevant to your project.

### Combined Setup (New Machine + New Project)

For a brand new setup, you can do both at once:

```bash
marr init --all
```

## Validating Your Setup

After setup, validate that everything is configured correctly:

```bash
marr validate
```

This checks:
- Required files exist
- Configuration structure is correct
- File references are valid
- Naming conventions are followed

## What Happens Next

Once MARR is set up, AI agents (like Claude Code) will:

1. **Load your user preferences** from `~/.claude/marr/MARR-USER-CLAUDE.md`
2. **Load project configuration** from `.claude/marr/MARR-PROJECT-CLAUDE.md`
3. **Follow triggered standards** from `.claude/marr/standards/` based on what task they're doing

The agent reads standards on-demand based on trigger conditions. For example, when working with git, the workflow standard is triggered and read.

## Next Steps

- [Configuration Guide](../explanation/configuration.md) — Understand the two-layer system in depth
- [Customization Guide](./customization.md) — Modify standards for your needs
- [Standards Reference](../reference/standards-reference.md) — Learn what each standard does
