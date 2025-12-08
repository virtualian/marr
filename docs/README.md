# MARR Documentation

**MARR (Making Agents Really Reliable)** is a configuration system that provides AI coding agents with consistent project context and standards.

## Quick Start

```bash
# Install
npm install -g @virtualian/marr

# Set up user config (once per machine)
marr init --user

# Set up project config
marr init --project
```

## Why MARR?

- **Consistent behavior** — Same standards across all your projects
- **Two-layer config** — Personal preferences + project requirements
- **Validated** — Catch configuration errors before they cause problems
- **Version controlled** — Standards live in your repo, shared with your team

## Documentation

### For Users

- [Getting Started](user/how-to/getting-started.md) — Installation and first-time setup
- [Configuration Guide](user/explanation/configuration.md) — Understanding the two-layer system
- [Customization](user/how-to/customization.md) — Modifying and creating standards
- [Standards Reference](user/reference/standards-reference.md) — What each bundled standard does

### For Developers

- [Contributing](dev/how-to/contributing.md) — Setting up a dev environment
- [Testing](dev/how-to/testing.md) — Running the test suite
- [Publishing](dev/how-to/publishing.md) — Releasing to npm
- [Specification](dev/explanation/specification.md) — What MARR is and isn't
- [Architecture](dev/explanation/architecture.md) — Why MARR is designed this way

## Links

- [GitHub Repository](https://github.com/virtualian/marr)
- [npm Package](https://www.npmjs.com/package/@virtualian/marr)
- [Issue Tracker](https://github.com/virtualian/marr/issues)
