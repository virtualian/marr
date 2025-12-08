# **M**aking **A**gents **R**eally **R**eliable (**MARR**)

**MARR** is a configuration system for Claude Code that makes AI agents more predictable and effective through structured standards.

> Marr is my real surname. I needed a configuration folder that Anthropic would never accidentally claim in `.claude/`, so I just used my own name and retrofitted a backronym. Peak efficiency, minimal narcissism. Honest! 😄

[![npm version](https://img.shields.io/npm/v/@virtualian/marr.svg)](https://www.npmjs.com/package/@virtualian/marr)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## What is MARR?

MARR provides a two-layer configuration system for AI agents:

1. **User-level** (`~/.claude/marr/`) — Personal preferences applied across all projects
2. **Project-level** (`.claude/marr/`) — Project-specific standards and requirements

Standards cover git workflow, testing, MCP usage, documentation, and more. Projects stay self-contained while sharing common preferences.

## Quick Start

```bash
# Install
npm install -g @virtualian/marr

# One-time user setup
marr init --user

# Initialize a project
marr init --project

# Or both at once
marr init --all

# Validate configuration
marr validate
```

## Commands

| Command | Description |
|---------|-------------|
| `marr init --user` | Set up user-level config (run once per machine) |
| `marr init --project` | Initialize current project with MARR |
| `marr init --all` | Set up both user and project config |
| `marr validate` | Check configuration is valid |
| `marr clean` | Remove MARR configuration |
| `marr doctor` | Interactive conflict resolution |
| `marr standard` | Manage standards |
| `marr sync` | Sync standards between projects |

Run `marr <command> --help` for detailed options.

## Documentation

Full documentation at **[virtualian.github.io/marr](https://virtualian.github.io/marr)**

- [Getting Started](https://virtualian.github.io/marr/user/how-to/getting-started/)
- [Configuration Guide](https://virtualian.github.io/marr/user/explanation/configuration/)
- [CLI Reference](https://virtualian.github.io/marr/user/reference/cli-reference/)
- [Standards Reference](https://virtualian.github.io/marr/user/reference/standards-reference/)

## Development

```bash
git clone https://github.com/virtualian/marr.git
cd marr
npm install
npm run build
npm link
```

See the [Contributing Guide](https://virtualian.github.io/marr/dev/how-to/contributing/) for more.

## License

ISC
