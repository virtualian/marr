# Claude Code Project Configuration System
## Functional Specification

**Version:** 1.0  
**Date:** 2025-11-15  
**Author:** Analysis of existing CLAUDE.md configurations

---

## Executive Summary

The current system uses a two-layer configuration approach for Claude Code projects, with user-level defaults and project-specific overrides. Configuration is spread across CLAUDE.md files and referenced prompt files, requiring manual setup for each new project. This specification documents the current state to support development of an automated project initialization system.

---

## Current System Architecture

### Two-Layer Configuration Model

**Layer 1: User Level** (`~/.claude/CLAUDE.md`)
- Location: `~/.claude/CLAUDE.md`
- Purpose: Personal preferences, communication style, general principles
- Scope: Applies across ALL projects unless explicitly overridden
- Content: User-specific directives, general work habits, default standards

**Layer 2: Project Level** (`./CLAUDE.md` at project root)
- Location: Project root directory
- Purpose: Project-specific technical requirements and overrides
- Scope: Single project only
- Precedence: Overrides user-level technical standards while preserving personal preferences

### Startup Behavior Requirements

Claude Code must execute these actions immediately upon:
- Reading a CLAUDE.md file for the first time
- Starting work in a new project
- Changing directories to a project folder

**Mandatory Startup Actions:**
1. Report configuration systems found (Claude Code, Cursor Rules, other AI configs)
2. Check for missing configs and recommend creation
3. Validate configurations (outdated formats, missing sections, conflicts)
4. Never silently ignore configuration issues

---

## User-Level Configuration (`~/.claude/CLAUDE.md`)

### Core Directives

**Guard Rail Authority**
- CLAUDE.md directives are BINDING, not suggestions
- All operations MUST comply with directives
- Violations constitute system failure

**Configuration Scope**
- Contains ONLY user-specific directives and preferences
- Project-specific directives belong in project files
- Enforces two-layer configuration pattern

**Multi-Agent Recognition**
- Other agents exist and may reference this configuration
- Multiple agents may integrate with these directives

**Prompt File Creation Standards**
- Use imperative directives specifying WHAT and WHY, never HOW
- No code, commands, or configuration examples in prompt files
- State requirements and rationale only
- Implementation details belong in project documentation

**Prompt File Modification Rights**
- Agents MUST NEVER modify prompt files without explicit request
- Agents MUST seek approval before modifying user/project level prompts
- User level prompt file changes require explicit consent

**Attribution Restrictions**
- NEVER add attribution comments to any file
- No AI generation credits or co-author annotations
- Code and documentation stand on merit, not origin

### User-Level Prompt Standards

**Required Prompts Directory:** `~/.claude/prompts/`

**Standard Prompts (referenced but not provided):**
- `user-git-workflow-standard.md` - Consistent Git patterns across projects
- `user-mcp-usage-standard.md` - MCP tool usage guidelines
- `user-testing-standard.md` - General testing philosophy

**Rationale:** User-level prompts establish consistent work patterns across all projects

### Communication Style

- Concise responses unless detail requested
- Direct answers without elaboration unless asked
- Emojis only when explicit attention needed
- No unnecessary preamble or postamble
- No flattery, praise, or sycophantic tone
- Never assume user is correct
- Use defensible evidence for constructive criticism
- Stand ground when strong evidence supports opinion

### Work Habits

- Prefer editing existing files over creating new ones
- Create files only when absolutely necessary

### Mandatory User Approval (CRITICAL)

- ALWAYS get explicit approval before ANY git commits
- ALWAYS get explicit approval before ANY git pushes
- ALWAYS get explicit approval before ANY PR creation/updates
- Show user exactly what will be committed/pushed
- Never assume approval - wait for explicit confirmation

### Opinion and Research Requests

When asked for opinion/recommendation:
- Research challenge thoroughly
- Search web for reputable sources, especially official documentation
- Provide at least three viable options
- Give clear recommendations with reasoning
- Do NOT include implementation plans
- Factor implementation complexity considering AI assistance
- Save research reports in `research/` directory
- DO NOT take planning/implementation action after research
- Wait for explicit instruction before proceeding

### Plan Creation Standards

Plans are prompt files for AI Agent consumption:
- Save in `plans/` with unique, simple snake-case names
- Write as markdown documents for AI Agent execution
- ALWAYS research using reputable sources
- Highlight assumptions with `[ASSUMPTION: seek clarification]`

**Plan Structure:**
- Overview of the plan
- Clear objective statement and expected outcome
- Steps named "STEP01", "STEP02", etc.

**Each STEP Requirements:**
- Task list format: `- [ ] task [task imperative - WHAT not HOW]`
- 3-10 tasks that can be logically committed together
- Include task to update all relevant documentation
- Include validation task confirming prior task completion
- Draft commit message referencing plan: `Commit for /[plan-name]/STEPNN`
- Obtain permission to commit using generated message
- Draft commit message and obtain approval BEFORE committing

### Automated Port Management

When starting development:
1. Check `.env.local` for `PORT=` setting
2. Check port registry in `~/projects/PORTS.md`
3. If not found, automatically assign next available port and update registry

### Security Best Practices

- Always follow security best practices
- Never expose or commit secrets/keys
- Use environment variables for sensitive configuration
- Validate inputs and sanitize outputs

### Git Workflow Standards

- Use meaningful commit messages
- Keep commits focused and atomic
- Never commit sensitive files (`.env`, secrets, keys)
- Use `.gitignore` appropriately
- Use GitHub's auto-close syntax: `Closes #123` or `Fixes #123` (not verbose forms)

### Testing Principles

- Write tests for critical functionality
- Follow existing test patterns in each project
- Never assume specific frameworks - check project setup first
- Run tests before committing changes

### Code Organization

- Follow existing project structure and conventions
- Use consistent naming patterns within each project
- Keep functions and components focused and single-purpose
- Extract reusable logic into utilities

### Documentation Organization

**Directory Structure:**
- Technical documentation and setup guides: `docs/` folder
- Plans: `plans/` directory
- Research reports: `research/` directory
- Working documents for active tasks: `tasks/task-name-GUID/` directory
- Prompt files: `prompts/` directory (except official AI Agent files)
- NEVER place docs in project root unless functional purpose (e.g., README.md)

**Working Documents (`tasks/`):**
- Create task-specific directories: `tasks/task-name-GUID/`
- Use short descriptive task-name with GUID
- Working documents include: analysis notes, drafts, WIP research, decisions
- DELETE task directories upon completion
- Only preserve if containing unique insights not captured elsewhere

### Tool Usage Standards

- Check existing dependencies before suggesting new libraries
- Use project-specific package managers (npm, yarn, pnpm)
- Follow project's linting and formatting rules
- Use project-specific build and deployment commands
- Use TodoWrite tool for complex multi-step tasks

### GitHub Sub-Issues Management

- ALWAYS use helper scripts for GitHub sub-issues until native CLI support
- Scripts in `~/bin/` (should be in PATH):
  - `gh-add-subissue.sh <parent> <sub>` - Link sub-issue to parent
  - `gh-list-subissues.sh <parent>` - List all sub-issues
- NEVER use raw `gh api graphql` commands for sub-issues
- Deprecate scripts when GitHub CLI adds native support

### Session Recap Management

- Check for existing recaps at session start in project's `recap/` directory
- Use `/recap` command for session summaries
- Maintain continuity from previous sessions when recap files exist

---

## Project-Level Configuration (`./CLAUDE.md`)

### Project Types Observed

**1. Web Development Project** (gainfunction/website)
- Next.js 14+ with React
- TypeScript (strict mode)
- Testing: Vitest (unit), Playwright (E2E)
- UI/UX: v0 MCP for all design work
- Styling: Tailwind CSS, shadcn/ui components

**2. Documentation Repository** (marrbox/set-up-and-admin)
- MkDocs + Material + Diataxis framework
- Role-first navigation architecture
- Strict documentation standards
- Git workflow standards

### Project-Specific Prompt Integration

**Pattern:**
```markdown
## MANDATORY: Project Prompts Compliance

**ALWAYS follow the directives in `prompts/` directory.**

All AI agents working on this project MUST adhere to:
- @prompts/prj-testing-standard.md
- @prompts/prj-ui-ux-standard.md
```

**Project prompts are stored in:** `./prompts/` at project root

**Naming Convention:**
- `prj-` prefix for project-specific prompts
- `user-` prefix for user-level prompts (in `~/.claude/prompts/`)

### Project-Specific Directives Observed

**Git Workflow:**
- GitHub auto-linking prevention (avoid `#number` patterns in PRs)
- Project-specific branching strategies
- Agent configuration requirements (all agents must follow Anthropic standards)

**Testing Configuration:**
- Specific testing stack (Vitest, Playwright, etc.)
- Coverage thresholds by component type
- Framework-specific testing guidelines

**UI/UX Standards:**
- WCAG 2.1 Level AA compliance
- Mobile-first design requirements
- Brand color exception policies
- MCP tool usage workflow (v0 → shadcn/ui → tailwind → a11y → playwright)
- Accessibility validation requirements

**Documentation Standards:**
- Diataxis framework implementation
- Role-first navigation architecture
- External documentation reference policies
- Content validation checklists

---

## Referenced Prompt File Patterns

### Testing Standard (`prj-testing-standard.md`)

**Structure:**
- Testing stack specification
- Coverage thresholds (global and component-specific)
- Testing scope (unit vs E2E)
- Framework-specific guidelines
- Integration with other project standards
- Project-specific anti-patterns

**Key Principle:** Defines project-specific tools and thresholds only; testing philosophy lives at user level

### UI/UX Standard (`prj-ui-ux-standard.md`)

**Structure:**
- Core rules (NEVER VIOLATE section)
- Target audience requirements
- Accessibility standards (WCAG compliance)
- Mobile-first design standards
- Brand standards (reference to project design system)
- Component standards (CTAs, forms, cards, navigation)
- Conversion optimization standards
- Technology stack requirements
- MCP tool usage workflow
- Visual testing standards
- Anti-patterns (forbidden designs and techniques)
- Performance standards
- Content standards
- Documentation standards
- Review and validation checklist
- Integration with other standards
- AI agent-specific instructions

**Key Principle:** Standards define quality requirements, not specific implementations; allows same standards across projects with brand details in project docs

### Documentation Standard (`prompt-documentation-standard.md`)

**Structure:**
- Diataxis framework explanation (Tutorials, How-To, Reference, Explanation)
- Role-first navigation architecture
- Content quality standards
- Technical specifications (file structure, markdown, navigation)
- Cross-referencing guidelines
- External documentation reference policies
- Voice and tone by content type
- Writing style guidelines
- Code example standards
- Validation checklist
- Implementation approach
- Common pitfalls and solutions

**Key Principle:** Comprehensive documentation framework with clear separation of content types and user roles

---

## Identified Pain Points in Current System

### Manual Setup Required

1. **Directory Structure Creation**
   - Must manually create `prompts/` directory in each project
   - Must create `docs/`, `plans/`, `research/`, `tasks/` as needed
   - No automated scaffolding

2. **CLAUDE.md File Creation**
   - Must manually create project-level `./CLAUDE.md`
   - Must copy/adapt boilerplate from other projects
   - Risk of inconsistent configurations across projects

3. **Prompt File Management**
   - Must identify which prompts are needed for project type
   - Must copy appropriate prompts from other projects
   - Must adapt prompts to new project specifics
   - No central template repository

4. **Configuration Validation**
   - No automated validation of CLAUDE.md structure
   - No check for required sections
   - No conflict detection between user and project configs

5. **Documentation Burden**
   - User must remember to reference prompts with `@prompts/filename.md` syntax
   - Must manually maintain prompt file lists in CLAUDE.md
   - No automated discovery of available prompts

### Inconsistency Risk

1. **Format Drift**
   - Different projects may use different CLAUDE.md structures
   - Prompt files may have inconsistent formatting
   - No enforcement of mandatory sections

2. **Standards Evolution**
   - When user-level standards change, no mechanism to propagate to projects
   - When prompt templates improve, manual update to existing projects
   - Version drift between projects

3. **Missing Configurations**
   - Easy to forget required prompts for project type
   - No checklist for essential configuration elements
   - Startup validation helps but doesn't prevent initial omission

---

## Configuration Metadata Required for Automation

To enable automated project setup, the system needs:

### Project Type Classification

**Identified Types:**
- Web development (Next.js/React/TypeScript)
- Documentation repository (MkDocs/Material/Diataxis)
- General development (inferred from future projects)

**Required Metadata per Type:**
- Required directory structure
- Required prompt files
- Technology stack defaults
- Testing framework defaults
- Documentation framework (if applicable)

### Prompt Template Repository

**Location:** Should be centralized, version-controlled location
**Structure:**
```
~/.claude/prompt-templates/
  user/
    user-git-workflow-standard.md
    user-mcp-usage-standard.md
    user-testing-standard.md
  project/
    web-development/
      prj-testing-standard.md
      prj-ui-ux-standard.md
    documentation/
      prompt-documentation-standard.md
```

### CLAUDE.md Templates

**Location:** Same template repository
**Types:**
- User-level template (for initial setup)
- Project-level templates by project type
- Common sections that appear in all types

### Initialization Configuration File

**Proposed:** `~/.claude/init-config.yaml`
**Contents:**
- Project type definitions
- Directory structure requirements by type
- Required prompts by type
- Template locations
- Default values for common settings

---

## Proposed Automation Features

### 1. Project Initialization Command

**Function:** Create new project with proper Claude Code configuration

**Inputs:**
- Project name
- Project type (web-development, documentation, general)
- Project root directory

**Outputs:**
- Created directory structure
- Generated `./CLAUDE.md` from template
- Copied relevant prompt files to `./prompts/`
- Created `.gitignore` with appropriate entries
- Created initial README.md (optional)

**Process:**
1. Validate user-level `~/.claude/CLAUDE.md` exists
2. Prompt for project type if not specified
3. Create project root directory
4. Create standard subdirectories based on type
5. Generate `./CLAUDE.md` from template with project name
6. Copy project-type-specific prompts to `./prompts/`
7. Create `.gitignore` if doesn't exist
8. Report what was created
9. Suggest next steps

### 2. Configuration Validation Tool

**Function:** Validate existing project configuration

**Checks:**
- User-level `~/.claude/CLAUDE.md` exists and valid
- Project-level `./CLAUDE.md` exists and valid
- All referenced prompt files exist
- Required sections present in CLAUDE.md
- No conflicts between user and project configs
- Directory structure matches expectations
- Startup behavior requirements documented

**Output:**
- Validation report with errors and warnings
- Suggestions for fixes
- Optional auto-fix for common issues

### 3. Prompt Template Management

**Function:** Centralized management of prompt templates

**Features:**
- List available templates
- Update template from repository
- Add new template
- Version tracking
- Template documentation

### 4. Project Migration Tool

**Function:** Update existing project to current standards

**Features:**
- Detect current configuration version
- Generate migration plan
- Apply updates to CLAUDE.md
- Update prompt files
- Preserve project-specific customizations

---

## Implementation Recommendations

### Phase 1: Template Repository Setup
1. Create central template repository structure
2. Extract templates from existing projects
3. Document template customization points
4. Create initialization configuration file

### Phase 2: Initialization Tool
1. Build project type detection/selection
2. Implement directory structure creation
3. Implement template instantiation
4. Add validation and reporting

### Phase 3: Validation Tool
1. Build configuration parser
2. Implement validation rules
3. Create reporting system
4. Add auto-fix capabilities

### Phase 4: Migration Tool
1. Version detection
2. Migration path planning
3. Safe update application
4. Rollback capabilities

---

## Dependencies and Requirements

### File System Access
- Read/write to `~/.claude/`
- Read/write to project directories
- Create directories and files

### Template Processing
- Variable substitution in templates
- Conditional content based on project type
- Preserve user customizations during updates

### Validation Logic
- YAML/Markdown parsing
- Reference resolution (`@prompts/filename.md` syntax)
- Conflict detection
- Required section verification

### User Interaction
- Prompt for missing information
- Confirm destructive operations
- Progress reporting
- Error handling and recovery

---

## Success Criteria

A successful automation system would:

1. **Reduce Setup Time**
   - New project initialization: <2 minutes
   - Configuration validation: <30 seconds
   - Template updates: <1 minute

2. **Ensure Consistency**
   - All projects have required CLAUDE.md sections
   - All projects have appropriate prompt files
   - No format drift between projects
   - Standards updates propagate reliably

3. **Maintain Flexibility**
   - Easy customization of templates
   - Project-specific overrides supported
   - Multiple project types supported
   - Extension to new project types straightforward

4. **Provide Reliability**
   - Validation catches configuration errors
   - Migration preserves customizations
   - Rollback available for updates
   - Clear error messages and recovery paths

---

## Appendix: File Locations Summary

**User Level:**
- `~/.claude/CLAUDE.md` - User configuration
- `~/.claude/prompts/` - User-level prompt standards
  - `user-git-workflow-standard.md`
  - `user-mcp-usage-standard.md`
  - `user-testing-standard.md`
- `~/bin/` - Helper scripts (GitHub sub-issues)
- `~/projects/PORTS.md` - Port registry

**Project Level:**
- `./CLAUDE.md` - Project configuration
- `./prompts/` - Project-specific prompts
  - `prj-testing-standard.md`
  - `prj-ui-ux-standard.md`
  - `prompt-documentation-standard.md`
- `./docs/` - Technical documentation
- `./plans/` - Implementation plans
- `./research/` - Research reports
- `./tasks/` - Working documents (task-name-GUID)
- `./recap/` - Session recaps

**Proposed Template Repository:**
- `~/.claude/prompt-templates/` - Centralized templates
  - `user/` - User-level templates
  - `project/` - Project-type templates
- `~/.claude/init-config.yaml` - Initialization configuration

---

**End of Functional Specification**
