# Product Requirements Document
## MARR: Making Agents Really Reliable

**Date:** 2025-11-26
**Status:** Draft
**Version:** 0.2

---

## Executive Summary

**MARR** (Making Agents Really Reliable) is a configuration system that provides AI coding agents with consistent project context and standards across all repositories. The system uses a two-layer approach:

- **User-level** (`~/.claude/marr/`) - Personal preferences and universal standards, integrated with Claude Code via import mechanism
- **Project-level** (`./MARR-PROJECT-CLAUDE.md` + `./.claude/marr/`) - Project-specific requirements and standards

MARR is installed via npm (`npm install -g @virtualian/marr`) and configured with a simple CLI.

**Key Innovation:** Treat AI agent directives as first-class project infrastructure, not ad-hoc notes.

---

## Problem Statement

### Current Pain Points

1. **Inconsistent Agent Behavior**
   - AI agents lack project context and standards
   - Same developer gets different agent behavior across projects
   - No consistency in git workflow, testing approach, or tool usage

2. **Configuration Drift**
   - Each project has ad-hoc or missing configuration
   - Standards improvements don't propagate to other projects
   - No clear pattern for organizing AI agent directives

3. **Manual Setup Overhead**
   - New projects require manual configuration creation
   - Copy-paste from other projects leads to drift
   - No validation or consistency checking

4. **Multi-Agent Fragmentation** (Future Concern)
   - Different AI agents may need different setups
   - Risk of lock-in to specific agent
   - Desire for portable configuration format

### Impact

- Wasted time re-explaining standards to AI agents
- Inconsistent code quality across projects
- Difficult collaboration when standards unclear
- Manual effort to set up each new project

---

## Vision

**A unified configuration system that enables AI agents to understand and follow developer standards consistently across all projects.**

### Guiding Principles

1. **Universal Standards** - Core practices (git workflow, testing, tool usage) apply everywhere
2. **Two-Layer Architecture** - User-level preferences + Project-level requirements
3. **Claude Code First** - Built for Claude Code, designed for future multi-agent support
4. **Version Controlled** - All configuration tracked in Git, no file versioning
5. **Gradual Adoption** - Can start simple, evolve to comprehensive
6. **Patterns from Code** - Implementation patterns emerge from codebase, not standardized

---

## User Personas

### Primary: Solo Developer with Multiple Projects

**Profile:** Developer maintaining 5-10 personal projects using AI agents

**Goals:**
- Consistent git workflow across all projects
- AI agents follow personal preferences automatically
- Quick project initialization with standards

**Pain Points:**
- Repeating same instructions to AI in each project
- Forgetting which standards apply where
- Manual setup for each new project

### Secondary: Team Lead

**Profile:** Managing team of developers using AI agents

**Goals:**
- Team follows consistent standards
- Easy onboarding of new team members and AI agents
- Standards propagate across team projects

**Pain Points:**
- Each developer has different AI agent behavior
- No enforcement of team standards
- Difficult to update standards across projects

---

## Use Cases

### UC1: First-Time User Setup

**Actor:** Developer (new to MARR)
**Goal:** Set up MARR user-level configuration
**Flow:**
1. Install MARR: `npm install -g @virtualian/marr`
2. Run: `marr init --user`
3. System creates `~/.claude/marr/` with user-level config and prompts
4. System adds import line to `~/.claude/CLAUDE.md`
5. System installs helper scripts to `~/bin/`
6. Claude Code now loads MARR user standards automatically

**Success Criteria:** Single command, <1 minute to complete

### UC2: Initialize New Project

**Actor:** Developer
**Goal:** Create new project with AI agent configuration
**Flow:**
1. Navigate to project directory
2. Run: `marr init --project`
3. System confirms target directory
4. System creates `./MARR-PROJECT-CLAUDE.md` and `./.claude/marr/` with project standards
5. Developer customizes project-specific details
6. AI agent immediately understands project standards

**Success Criteria:** <2 minutes from command to working configuration

### UC3: Remove MARR Configuration

**Actor:** Developer
**Goal:** Clean up MARR from user or project
**Flow:**
1. Run: `marr clean --user` or `marr clean --project`
2. System shows what will be removed
3. User confirms (or uses `--dry-run` to preview)
4. System removes configuration files cleanly

**Success Criteria:** Complete removal, no orphaned files

### UC4: Validate Configuration

**Actor:** Developer
**Goal:** Check configuration is correct
**Flow:**
1. Run: `marr validate` in project directory
2. System checks CLAUDE.md structure
3. System verifies prompt references
4. System reports errors and warnings

**Success Criteria:** Clear pass/fail with actionable feedback


---

## Requirements

### Core Requirements (Must Have)

**CR1: Two-Layer Configuration Model**
- User-level standards in `~/.claude/marr/` (universal preferences)
- Project-level standards in `./MARR-PROJECT-CLAUDE.md` and `./.claude/marr/` (project-specific)
- Claude Code integration via import mechanism (`@~/.claude/marr/MARR-USER-CLAUDE.md`)
- Clear precedence: Project technical requirements override user preferences
- **Rationale:** Separates personal from project-specific standards; integrates with Claude Code's native import system

**CR2: Standard Prompt Files**
- Git workflow standard (branching, commits, PRs)
- Testing standard (philosophy, priorities, coverage)
- MCP usage standard (tool usage patterns)
- Documentation standard (organization, maintenance)
- **Rationale:** Core development practices transcend project types

**CR3: Claude Code Integration**
- User-level config at `~/.claude/marr/` (inside Claude Code's config directory)
- Automatic import injection into `~/.claude/CLAUDE.md`
- Claude Code discovers MARR config via official import mechanism
- **Rationale:** Claude Code only reads from `~/.claude/`; MARR must integrate there

**CR4: Version Control Integration**
- All configuration in Git repositories
- No filename versioning (use Git history)
- Changes tracked like code
- **Rationale:** Configuration is code, treat it accordingly

**CR5: Simple CLI**
- `marr init --user` - Set up user-level configuration (one-time)
- `marr init --project [path]` - Set up project configuration
- `marr clean --user` / `--project` - Remove MARR configuration
- `marr validate` - Check configuration validity
- No template selection - MARR is opinionated with one standard structure
- **Rationale:** Single command per intent; standards not options

**CR6: Naming and Discovery**
- Consistent naming conventions (`user-*`, `prj-*`)
- Clear reference syntax (`@.claude/marr/`, `@~/.claude/marr/`)
- Self-documenting file structure
- **Rationale:** Discoverability and consistency

**CR7: Helper Scripts Management**
- GitHub sub-issue scripts (`gh-add-subissue.sh`, `gh-list-subissues.sh`)
- Installed to `~/bin/` as part of `marr init --user`
- Removed as part of `marr clean --user`
- **Rationale:** Configuration references scripts; single command installs everything

### Optional Requirements (Should Have)

**OR1: Project-Specific Standards**
- UI/UX standards for web projects
- Documentation standards for docs projects
- API standards for backend projects
- Doc-parity standards for CLI tools
- **Rationale:** Different project types need different domain standards

**OR2: Advanced Validation**
- Validation tool for existing configuration (`marr validate`)
- Check CLAUDE.md structure and required sections
- Verify prompt file references resolve correctly
- Check naming conventions compliance
- **Rationale:** Ensures configuration correctness

**OR3: Slash Command Integration**
- Document how slash commands (like /recap) access configuration
- Define integration points between command system and configuration
- **Note:** Slash commands are separate system, not part of this PRD
- **Rationale:** Extensibility point for command-based workflows

### Non-Requirements (Explicitly Out of Scope for v1)

**NR1:** Not a code generation system (AI agents generate code, not this system)
**NR2:** Not a replacement for project documentation (complements, not replaces)
**NR3:** Not prescriptive about technology choices (framework-agnostic)
**NR4:** Not for third-party project adoption (focus on projects you own/control)
**NR5:** Not team collaboration system (no approval workflows, team management)
**NR6:** Not a configuration UI/dashboard (command-line/file-based only)
**NR7:** Not an IDE or CI/CD integration (those are separate tools)

---

## System Architecture (High-Level)

### Configuration Layers

```
┌─────────────────────────────────────────┐
│  User Level (~/.claude/marr/)           │
│  - Universal preferences                │
│  - Communication style                  │
│  - Core standards (git, testing, MCP)   │
│  - Helper scripts (installed to ~/bin/) │
│  - Integrated via @import in CLAUDE.md  │
└─────────────────────────────────────────┘
                 ↓ inherits
┌─────────────────────────────────────────┐
│  Project Level (./MARR-PROJECT-CLAUDE.md, ./.claude/marr/)  │
│  - Project-specific requirements        │
│  - Domain standards (UI/UX, docs, etc.) │
│  - Technical constraints                │
│  - Can override user technical defaults │
└─────────────────────────────────────────┘
                 ↓ learns from
┌─────────────────────────────────────────┐
│  Codebase (implementation patterns)     │
│  - AI agents analyze existing code      │
│  - Patterns emerge organically          │
│  - Not standardized in prompts          │
└─────────────────────────────────────────┘
```

**Two-layer configuration + emergent patterns from code**

### Claude Code Integration

```
~/.claude/
├── CLAUDE.md              ← User's file (MARR adds import line)
│   └── @~/.claude/marr/MARR-USER-CLAUDE.md   ← Import injected by MARR
└── marr/                  ← MARR's managed directory
    └── MARR-USER-CLAUDE.md   ← MARR's user-level config

~/bin/                     ← Helper scripts (installed by marr init --user)
├── gh-add-subissue.sh
└── gh-list-subissues.sh
```

**MARR integrates with Claude Code via the official import mechanism**

### Multi-Agent Vision (Future)

```
┌──────────────┐
│ Claude Code  │ ◄─── v1: Primary focus
└──────────────┘
       │
       ▼
┌──────────────┐
│  CLAUDE.md   │
│  prompts/    │
│  (markdown)  │
└──────────────┘
       │
       ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│    Cursor    │  │    Jules     │  │   Codex      │ ◄─── Future
└──────────────┘  └──────────────┘  └──────────────┘
```

**Start with Claude Code, expand to other agents based on experience**

### Directory Structure (Standard Project)

```
project-root/
├── MARR-PROJECT-CLAUDE.md       # Project configuration
├── .claude/marr/                       # Project-level standards
│   ├── prj-git-workflow-standard.md
│   ├── prj-testing-standard.md
│   ├── prj-mcp-usage-standard.md
│   └── [domain-specific].md
├── docs/                        # Technical documentation
├── plans/                       # Implementation plans
├── research/                    # Research reports
└── src/                         # Source code
```

---

## Success Criteria

### Adoption Metrics

1. **Initialization Time:** New project setup <3 minutes
2. **Migration Success:** 90%+ of projects migrate without issues
3. **Consistency:** All projects have required sections in CLAUDE.md
4. **Multi-Agent:** Configuration works with 3+ different AI agents

### Quality Metrics

1. **Validation:** All configurations pass validation checks
2. **Completeness:** No missing required prompt files or sections
3. **Drift Prevention:** Template updates propagate successfully
4. **Naming:** 100% compliance with naming conventions

### User Experience Metrics

1. **Discovery:** Developers find configuration files intuitively
2. **Customization:** Easy to add project-specific standards
3. **Maintenance:** Standards updates <1 minute per project
4. **Portability:** Same config works across agents without modification

### Business Impact

1. **Time Saved:** 50%+ reduction in AI agent re-instruction time
2. **Code Quality:** Consistent standards across all projects
3. **Onboarding:** New team members productive faster
4. **Flexibility:** Easy to switch AI agents without configuration rework

---

## Future Considerations

### Phase 1 (Current - Core System)
- ✅ npm package `@virtualian/marr` published (v1.0.0)
- 🔄 `marr init --user` / `--project` commands (refactoring in progress)
- 🔄 `marr clean --user` / `--project` commands (refactoring in progress)
- ✅ `marr validate` command
- 🔄 Claude Code integration via import mechanism (implemented, needs testing)
- 🔄 Helper scripts installation to `~/bin/` (fold into `--user`)

### Phase 2 (Next - Refinement)
- Refine CLI UX based on usage feedback
- Add `--force` flag for scripting
- Improve validation error messages
- Project-specific standards (UI/UX, docs, API)

### Phase 3 (Near-term - Advanced Features)
- Slash command integration documentation
- Advanced validation and auto-fix
- Configuration drift detection

### Phase 4 (Long-term - Expansion)
- Multi-agent support (Cursor, Jules, Codex)
- Community standards sharing
- Team collaboration features

### Deferred to v2+
- Configuration UI/dashboard
- Team approval workflows
- Analytics and usage insights
- Agent-specific adaptations

---

## Dependencies and Constraints

### Dependencies
- Git for version control
- Markdown format support across AI agents
- File system access for AI agents
- GitHub CLI for helper scripts (optional)

### Constraints
- Must work with existing projects (backward compatible)
- Cannot require project modification for third-party adoption
- Must be agent-agnostic (no vendor lock-in)
- Configuration should be human-readable and editable

---

## Risks and Mitigations

### Risk: Agent Incompatibility

**Risk:** Some AI agents may not support CLAUDE.md format

**Mitigation:**
- Use standard markdown (lowest common denominator)
- Document agent-specific adaptations
- Test with multiple agents early

### Risk: Over-Standardization

**Risk:** Too many standards reduce flexibility

**Mitigation:**
- Keep core standards minimal (git, testing, MCP only)
- Make domain standards optional
- Support project-specific overrides

### Risk: Adoption Friction

**Risk:** Developers resist adding configuration to projects

**Mitigation:**
- Provide clear value proposition (time saved)
- Make initialization extremely easy (<3 min)
- Support gradual adoption (start simple)

### Risk: Template Drift

**Risk:** Project configurations diverge from templates over time

**Mitigation:**
- Validation tool detects drift
- Propagation tool updates projects
- Git history tracks all changes

---

## Appendix

### CLI Reference

```bash
# Installation
npm install -g @virtualian/marr

# User setup (one-time)
marr init --user          # or: marr init -u
marr clean --user         # Remove user config + scripts

# Project setup
marr init --project       # Current directory (confirms with user)
marr init --project /path # Specific path
marr clean --project      # Remove project config

# Both
marr init --all           # User + project
marr clean --all          # Remove both

# Validation
marr validate             # Check current project
marr validate --strict    # Warnings as errors

# Options
--dry-run                 # Preview without changes
--force                   # Skip confirmations
```

### Related Documents

- **User Standards:** `~/.claude/marr/prompts/user-*.md` (git workflow, testing, MCP usage)
- **Project Examples:** `examples/` (real-world implementations)

---

**End of Product Requirements Document**
