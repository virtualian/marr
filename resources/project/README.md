# MARR Project Configuration

**MARR** (**M**aking **A**gents **R**eally **R**eliable) is a configuration system for Claude Code that makes AI agents more predictable and effective through structured standards.

> Marr is my real surname. I needed a configuration folder that Anthropic would never accidentally claim in `.claude/`, so I just used my own name and retrofitted a backronym. Peak efficiency, minimal narcissism. Honest! 😄

This directory contains project-specific AI agent configuration managed by [MARR](https://virtualian.github.io/marr).

## Structure

```
.claude/marr/
├── MARR-PROJECT-CLAUDE.md   # Main project config
├── README.md                # This file
└── standards/               # Project standards (prj-*.md)
```

## Standards

Standards in `standards/` define rules for:
- Git workflow
- Testing
- MCP tool usage
- Documentation
- Prompt writing

Edit these files to customize for your project.

## Keeping Standards Current

Run `marr update --project` to refresh canonical standards from the installed MARR package. Use `--check` for a non-modifying drift report. Locally-edited files are protected by a per-file prompt and timestamped backup.

## Documentation

Full docs at **[virtualian.github.io/marr](https://virtualian.github.io/marr)**
