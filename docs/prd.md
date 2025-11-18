# Product Requirements Document
## MARR: Making Agents Really Reliable

**Date:** 2025-11-18
**Status:** Draft
**Version:** 0.1

---

## Executive Summary

**MARR** (Making Agents Really Reliable) is a configuration system that provides AI coding agents with consistent project context and standards across all repositories. The system uses a two-layer approach (user-level in `~/.marr/` + project-level in `./CLAUDE.md`) with version-controlled prompt files, starting with Claude Code and designed to support multiple agents in the future.

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

### UC1: Initialize New Project

**Actor:** Developer
**Goal:** Create new project with AI agent configuration
**Flow:**
1. Run initialization command with project type
2. System creates directory structure
3. System generates CLAUDE.md from template
4. System copies relevant standard prompt files
5. Developer customizes project-specific details
6. AI agent immediately understands project standards

**Success Criteria:** <3 minutes from command to working configuration

### UC2: Migrate Existing Project

**Actor:** Developer
**Goal:** Add configuration to existing project
**Flow:**
1. Run migration tool on existing project
2. System detects project type and current patterns
3. System suggests appropriate configuration
4. Developer approves or customizes
5. System generates configuration files
6. Developer commits configuration to Git

**Success Criteria:** Preserves existing project patterns, non-breaking

### UC3: Update Standards Across Projects

**Actor:** Developer
**Goal:** Propagate improved standard to all projects
**Flow:**
1. Update user-level standard file
2. Run propagation tool
3. System identifies projects using that standard
4. System previews changes for each project
5. Developer selectively approves updates
6. System applies updates and reports results

**Success Criteria:** Bulk update without manual editing


---

## Requirements

### Core Requirements (Must Have)

**CR1: Two-Layer Configuration Model**
- User-level standards in ~/.marr/ (universal preferences)
- Project-level standards in ./CLAUDE.md and ./prompts/ (project-specific)
- Clear precedence: Project technical requirements override user preferences
- **Rationale:** Separates personal from project-specific standards

**CR2: Standard Prompt Files**
- Git workflow standard (branching, commits, PRs)
- Testing standard (philosophy, priorities, coverage)
- MCP usage standard (tool usage patterns)
- **Rationale:** Core development practices transcend project types

**CR3: Claude Code First, Multi-Agent Ready**
- Built for Claude Code with standard markdown format
- Designed for future multi-agent support
- Configuration decisions deferred until multi-agent needs are clear
- **Rationale:** Start with one agent, expand based on real experience

**CR4: Version Control Integration**
- All configuration in Git repositories
- No filename versioning (use Git history)
- Changes tracked like code
- **Rationale:** Configuration is code, treat it accordingly

**CR5: Template System**
- Templates for common project types
- Variable substitution for project-specific details
- Multiple CLAUDE.md templates (basic, standards, dev-guide, status)
- **Rationale:** Accelerates project initialization

**CR6: Naming and Discovery**
- Consistent naming conventions (user-*, prj-*)
- Clear reference syntax (@prompts/, @~/.marr/prompts/)
- Self-documenting file structure
- **Rationale:** Discoverability and consistency

**CR7: Helper Scripts Management**
- GitHub sub-issue scripts (gh-add-subissue.sh, etc.)
- Installation to ~/bin/
- Update mechanism
- **Rationale:** Configuration references scripts, must ensure availability

### Optional Requirements (Should Have)

**OR1: Project-Specific Standards**
- UI/UX standards for web projects
- Documentation standards for docs projects
- API standards for backend projects
- Doc-parity standards for CLI tools
- **Rationale:** Different project types need different domain standards

**OR2: Automation Tools**
- Initialization tool for new projects
- Validation tool for existing configuration
- Migration tool for upgrading patterns
- Propagation tool for standard updates
- **Rationale:** Reduces manual effort, ensures consistency

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
│  User Level (~/.marr/)                  │
│  - Universal preferences                │
│  - Communication style                  │
│  - Core standards (git, testing, MCP)   │
│  - Helper scripts                       │
└─────────────────────────────────────────┘
                 ↓ inherits
┌─────────────────────────────────────────┐
│  Project Level (./CLAUDE.md, ./prompts/)│
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
├── CLAUDE.md                    # Project configuration
├── prompts/                     # Project-level standards
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

### Phase 1 (Immediate - Core System)
- Finalize PRD and get alignment
- Create implementation plan
- Build core template repository
- Implement helper script management
- Create initialization tool for new projects

### Phase 2 (Near-term - Automation & Quality)
- Validation tool for existing configuration
- Migration tool for upgrading patterns
- Propagation tool for standard updates
- Project-specific standards templates (UI/UX, docs, API)

### Phase 3 (Medium-term - Advanced Features)
- Slash command integration documentation
- Advanced validation and auto-fix
- Template versioning and updates
- Configuration drift detection

### Phase 4 (Long-term - Expansion)
- Multi-agent support (Cursor, Jules, Codex)
- Community template sharing
- Third-party project adoption patterns
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

## Appendix: Related Documents

- **Original Functional Spec:** `research/functional-specification-original.md` (historical reference)
- **User Standards:** `~/.marr/prompts/user-*.md` (git workflow, testing, MCP usage)
- **Project Examples:** `examples/` (real-world implementations)
- **Session Recap:** `recap/recap-2025-11-18-11h01m47s.md` (previous discussion)

---

**End of Product Requirements Document**
