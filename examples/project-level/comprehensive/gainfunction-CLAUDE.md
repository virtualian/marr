# Gain Function Website - Project CLAUDE.md

> [!IMPORTANT]
>
> This is the Project-level configuration (Layer 2 of 2):
>
> - User file: `~/.claude/CLAUDE.md` - contains User preferences & default standards
> - This file: `./CLAUDE.md` - contains Project-specific technical overrides
>
> **Precedence**: This file overrides technical standards from User CLAUDE.md but preserves personal preferences.

## MANDATORY: Project Prompts Compliance

**ALWAYS follow the directives in `prompts/` directory.**

All AI agents working on this project MUST adhere to:
- @prompts/prj-testing-standard.md
- @prompts/prj-ui-ux-standard.md

**Note:** Git workflow, MCP usage, and testing philosophy are user-level (`~/.claude/prompts/`)

**Rationale**: Project prompts define project-specific tools and configurations. User-level prompts define universal work patterns and philosophies.

## MANDATORY: UI/UX Design Tool

**ALWAYS use v0 MCP for all UI and UX design work.**

All visual design, component creation, and user interface development MUST use the v0 MCP tools:
- `mcp__v0-mcp__v0_generate_ui` for creating new UI components
- `mcp__v0-mcp__v0_generate_from_image` for converting designs to components
- `mcp__v0-mcp__v0_chat_complete` for iterative UI refinement

**Rationale**: v0 MCP provides specialized UI/UX generation capabilities that ensure design consistency and quality.
