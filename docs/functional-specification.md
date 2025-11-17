# Claude Code Project Configuration System
## Functional Specification - Corrected

**Version:** 2.1  
**Date:** 2025-11-15  
**Author:** Comprehensive analysis with corrections for CLAUDE.md purpose

---

## Executive Summary - CRITICAL CORRECTION

**CLAUDE.md PURPOSE (MANDATORY):**
CLAUDE.md files (both user-level and project-level) MUST contain ONLY imperative directives that AI agents MUST follow. They are NOT for:
- ❌ Status tracking (project progress, phase completion)
- ❌ Development notes (recent updates, bug fixes, technical details)
- ❌ Architecture documentation (unless it's a directive about how to work with that architecture)
- ❌ Historical information (version history, migration notes)

**What CLAUDE.md IS for:**
- ✅ Mandatory behaviors ("ALWAYS do X", "NEVER do Y")
- ✅ Standards references ("Follow @prompts/prj-testing-standard.md")
- ✅ Process directives ("Before starting work, do steps 1-5")
- ✅ Guard rails and boundaries ("MUST get approval before git operations")
- ✅ Configuration precedence rules
- ✅ Required startup actions

**Status and notes belong in separate files:**
- Project status → `PROJECT-STATUS.md` or `STATUS.md`
- Development notes → `DEVNOTES.md` or in project documentation
- Architecture documentation → `docs/ARCHITECTURE.md`
- Version history → `CHANGELOG.md`

---

## Current State Analysis - Configuration Patterns

### Pattern Analysis Results

**4 projects** follow correct pattern (CLAUDE.md = directives only):
- gainfunction/website ✅
- marrbox/set-up-and-admin ✅
- sv/specverse-app-portal ✅
- sv/specverse-lang (parent) ❌ (mixed directives + status/notes)

**3 projects** use simplified pattern (acceptable for early-stage):
- npm-protect (extended notes, not directives) ⚠️
- scoremyclays ✅
- scoremyclays-onlook ✅

**2 projects** INCORRECTLY mix status tracking with directives:
- sv/specverse-lang ❌ (12,845 lines mixing both)
- sv/specverse-lang/ai-support-mcp-clean-impl ❌ (status tracking in CLAUDE.md)

---

## Correct CLAUDE.md Structure

### User-Level CLAUDE.md (Correct)

**Purpose:** Universal imperative directives for ALL projects

**MUST contain:**
1. Guard rail authority statement ("CLAUDE.md directives are BINDING")
2. Configuration scope definition (user-level vs project-level)
3. Multi-agent recognition
4. Prompt file creation/modification standards
5. Attribution restrictions ("NEVER add AI attribution")
6. Communication style preferences
7. Work habits directives
8. Mandatory user approval rules (git operations)
9. Documentation organization standards
10. Tool usage standards
11. References to user-level prompts

**MUST NOT contain:**
- Project-specific information
- Status tracking
- Development notes
- Architecture documentation

**Current state:** `/Users/ianmarr/.claude/CLAUDE.md` is CORRECT ✅

---

### Project-Level CLAUDE.md (Correct)

**Purpose:** Project-specific imperative directives

**MUST contain:**
1. Layer identification ("Layer 2 of 2")
2. Precedence rules ("This overrides user technical, preserves preferences")
3. Startup imperatives ("ALWAYS do X when starting work in this project")
4. Project-specific reminders ("NEVER create files unless absolutely necessary")
5. Mandatory user approval (if different from user-level)
6. Project-specific constraints ("NEVER edit .env.local directly")
7. Standards references ("@prompts/prj-testing-standard.md")
8. Project-specific anti-patterns
9. Integration requirements

**MUST NOT contain:**
- Status tracking ("Phase 2 complete", "In progress: feature X")
- Recent updates and bug fixes
- Version history
- Technical details (unless they're directives)
- Architecture documentation (unless it's "how to work with" directives)

**Example - CORRECT:**
```markdown
## Environment Variables (MANDATORY)
- **NEVER edit `.env.local` directly** - All environment variables are managed through Vercel
- **ALWAYS use `vercel env pull`** to sync environment variables
```

**Example - INCORRECT:**
```markdown
## Project Status: Phase 2 Complete
✅ Completed Features:
- Hybrid resource system implemented
- HTTP API deployed

🔄 Currently In Progress:
- Orchestrator integration
```

---

## Projects Requiring Correction

### 1. sv/specverse-lang/CLAUDE.md (HIGH PRIORITY)

**Current state:** 12,845 lines mixing directives with extensive documentation

**Issues:**
- Contains "Project Overview" with status details (validated scale support)
- Contains "AI Support MCP Server status" (phase tracking)
- Contains "Recent Updates & Migration Notes" (historical information)
- Contains "Troubleshooting" section (documentation, not directives)
- Contains "Common issues & solutions" (documentation, not directives)

**Correct structure:**

**CLAUDE.md** (directives only):
```markdown
# SpecVerse Language v3.1 - AI Agent Directives

## Core Directives

**ALWAYS follow these rules when working on SpecVerse:**

1. **ALWAYS read appropriate SKILL.md** before working on features
2. **ALWAYS run full test suite** before committing (306+ tests)
3. **ALWAYS follow the 11-phase feature addition guide** when adding language features
4. **NEVER commit with test failures**
5. **ALWAYS use expected failures system** for known issues

## Required Documentation

**Before ANY feature work:**
- Read: `docs/guides/feature-addition-guide.md`
- Read: Appropriate SKILL.md file for task type

## Testing Requirements

**MANDATORY test compliance:**
- All 306+ tests must pass
- Expected failures properly documented in `tests/expected-failures.json`
- Use `npm run release-test` before any release

## Standards References

@docs/guides/feature-addition-guide.md (11-phase process)
@docs/guides/api-usage.md (for API changes)
```

**PROJECT-STATUS.md** (separate file for tracking):
```markdown
# SpecVerse Language - Project Status

## Current Version: v3.1.8

## Recent Achievements (August 2025)
- ✅ Complete repository cleanup
- ✅ Expected failures system accurate (1 expected failure)
- ✅ 100% test success rate (306+ tests)

## Architecture
[Move all architecture documentation here]

## Troubleshooting
[Move all troubleshooting guides here]

## Version History
[Move all migration notes and updates here]
```

---

### 2. sv/specverse-lang/ai-support-mcp-clean-impl/CLAUDE.md (HIGH PRIORITY)

**Current state:** Status tracking document masquerading as directives

**Issues:**
- Titled "Project Status: Phase 2 - Hybrid Resource System Complete"
- Contains "✅ Completed Features", "🔄 Currently In Progress", "📋 Pending Tasks"
- This is entirely status tracking, not directives

**Correct structure:**

**CLAUDE.md** (directives only):
```markdown
# SpecVerse AI Support MCP Server - AI Agent Directives

## Deployment Requirements (MANDATORY)

**When working on this MCP server:**

1. **ALWAYS test all deployment targets** before committing
   - Local deployment (`npm run start:local`)
   - Web deployment (`npm run start:web`)
   - Enterprise deployment (`npm run docker:compose`)

2. **NEVER break hybrid resource detection** - all code must work in both environments

3. **ALWAYS update deployment documentation** when changing build targets

4. **ALWAYS validate MCP protocol compliance** for all resource endpoints

## Build System Rules

**MANDATORY build requirements:**
- `npm run build:all` must succeed before commits
- All 4 deployment targets must build successfully
- Resource bundle must remain under 200KB

## Testing Requirements

**Required test coverage:**
- Hybrid resource system tests pass
- Deployment integration tests pass
- No deployment target can be broken

## Documentation Requirements

**Update these when making changes:**
- `docs/DEPLOYMENT_GUIDE.md` - for deployment process changes
- `docs/HYBRID_RESOURCE_SYSTEM.md` - for architecture changes
- Individual deployment guides in `docs/deployments/`

## Standards References

@docs/DEPLOYMENT_GUIDE.md
@docs/HYBRID_RESOURCE_SYSTEM.md
```

**STATUS.md** (separate file):
```markdown
# AI Support MCP Server - Project Status

## Current Phase: Phase 2 Complete

### ✅ Completed Features
- Hybrid resource system
- Multi-environment deployment
- HTTP API for web deployment

### 🔄 Currently In Progress
- Orchestrator integration
- Full workflow capabilities

### 📋 Pending Tasks
1. Add orchestrator bridge for local/enterprise deployments
2. Deploy web MCP server to cloud platform
[etc.]

[All the current content moves here]
```

---

### 3. npm-protect/CLAUDE.md (MEDIUM PRIORITY)

**Current state:** Extended project notes, not directives

**Issues:**
- Contains development history ("Session: 2025-11-02")
- Contains bug fix notes
- Contains technical implementation details
- Contains version history

**Recommendation:**

**CLAUDE.md** (convert to directives):
```markdown
# npm-protect - AI Agent Directives

## Documentation Parity Requirement (MANDATORY)

**CRITICAL**: This project requires script-level documentation parity.

**When modifying ANY script, MUST update:**
1. Corresponding `docs/*.md` file with same changes
2. `docs/README.md` if navigation affected
3. `docs/overview.md` if architecture changed
4. Test all cross-references
5. Update version numbers in both script and docs

**Pre-Commit Requirements:**
- [ ] Corresponding docs/ file(s) updated
- [ ] Code examples in docs tested
- [ ] Cross-references verified
- [ ] Performance characteristics updated if changed
- [ ] README.md updated if navigation changed
- [ ] Git commit message mentions doc updates

**What REQUIRES documentation updates:**
✅ New command-line options or parameters
✅ Changed default behavior
✅ New output formats or report types
✅ Modified algorithms or detection methods
✅ New dependencies or requirements
✅ Changed file locations or names
✅ New error messages or exit codes
✅ Performance improvements with measurable impact
✅ New security indicators or threat types

## Script Validation Requirements

**Before committing script changes:**
1. **ALWAYS update corresponding documentation** FIRST
2. **ALWAYS test documented examples** work correctly
3. **ALWAYS verify cross-references** still valid
4. **NEVER commit without doc updates**

## Anti-Patterns

❌ Updating script without updating docs
❌ Outdated examples in documentation
❌ Broken cross-references
❌ Missing performance characteristics updates
```

**DEVNOTES.md** (separate file for history):
```markdown
# npm-protect Development Notes

## Session: 2025-11-02 (Issue #9 - Consolidation)
[All the historical development notes move here]

## Session: 2025-10-31
[Bug fixes and features]

## Architecture
[Technical implementation details]

## Version History
[Version tracking]
```

---

## Revised Project Type Classification

### Project Types with Correct CLAUDE.md Usage

1. **Web Development (React/Next.js)**
   - **CLAUDE.md**: Project-specific directives, standards references
   - **Separate files**: Architecture docs, development notes
   - **Example**: gainfunction/website ✅

2. **Documentation Repository (MkDocs/Docusaurus)**
   - **CLAUDE.md**: Documentation standards, writing directives
   - **Separate files**: Project status, content organization
   - **Example**: marrbox/set-up-and-admin ✅

3. **Language/Tool Development (TypeScript/Node)**
   - **CLAUDE.md**: Testing requirements, feature addition process directives
   - **Separate files**: PROJECT-STATUS.md, ARCHITECTURE.md, DEVNOTES.md
   - **Example**: sv/specverse-lang ❌ (needs correction)

4. **CLI/Tooling (Bash/Node.js)**
   - **CLAUDE.md**: Documentation parity requirements, validation directives
   - **Separate files**: DEVNOTES.md, version history
   - **Example**: npm-protect ⚠️ (needs conversion)

5. **MCP Server Implementation**
   - **CLAUDE.md**: Deployment requirements, testing directives
   - **Separate files**: STATUS.md, deployment notes
   - **Example**: ai-support-mcp-clean-impl ❌ (needs correction)

---

## Correct Template Structure

### CLAUDE.md Templates (Revised)

**1. User-Level Template**
- Purpose: Universal directives
- Contents: Guard rails, communication style, approval requirements, standards
- NO status tracking, NO project-specific content

**2. Project-Level Basic Template**
- Purpose: Simple project directives for early-stage projects
- Contents: Layer ID, basic reminders, approval requirements
- NO status tracking

**3. Project-Level Standards Template**
- Purpose: Full standards-based directives
- Contents: Layer ID, standards references, project-specific rules
- NO status tracking

**4. Project-Level Specialized Template (NEW UNDERSTANDING)**
- Purpose: Domain-specific directive extensions
- Contents: Layer ID + domain-specific requirements (e.g., doc parity, multi-environment testing)
- NO status tracking
- Examples: bash-tooling (doc parity), mcp-server (deployment testing)

### Supporting Files Templates (NEW)

**1. PROJECT-STATUS.md Template**
- Purpose: Track project progress, phases, completion
- Used by: Complex projects with multiple phases (language development, MCP servers)

**2. DEVNOTES.md Template**
- Purpose: Development history, bug fixes, technical notes
- Used by: Projects with complex development history

**3. ARCHITECTURE.md Template**
- Purpose: System architecture documentation
- Used by: Complex technical projects

**4. CHANGELOG.md Template**
- Purpose: Version history, release notes
- Used by: All versioned projects

---

## Revised Initialization Configuration

```yaml
version: "2.1"

# CLAUDE.md purpose enforcement
claude_md:
  purpose: "Imperative directives only"
  forbidden_content:
    - status_tracking
    - development_notes
    - version_history
    - architecture_docs (unless directive-oriented)
  
  supporting_files:
    status: "PROJECT-STATUS.md"  # For phase tracking, progress
    devnotes: "DEVNOTES.md"      # For development history
    architecture: "docs/ARCHITECTURE.md"  # For system docs
    changelog: "CHANGELOG.md"    # For version history

# Project type definitions
project_types:
  web-nextjs:
    name: "Next.js Web Application"
    claude_md_template: "project-level-standards.md"
    supporting_files:
      - "docs/ARCHITECTURE.md" (optional)
    required_prompts:
      - "common/prj-git-workflow-standard.md"
      - "common/prj-testing-standard.md"
      - "web-nextjs/prj-ui-ux-standard.md"
    
  documentation-mkdocs:
    name: "MkDocs Documentation Site"
    claude_md_template: "project-level-standards.md"
    supporting_files:
      - "docs/CONTENT-ORGANIZATION.md" (optional)
    required_prompts:
      - "common/prj-git-workflow-standard.md"
      - "documentation-mkdocs/prompt-documentation-standard.md"
    
  language-tooling:
    name: "Language/Tool Development"
    claude_md_template: "project-level-specialized.md"
    supporting_files:
      - "PROJECT-STATUS.md" (recommended)
      - "DEVNOTES.md" (recommended)
      - "docs/ARCHITECTURE.md" (recommended)
      - "CHANGELOG.md" (required)
    required_prompts:
      - "common/prj-git-workflow-standard.md"
      - "common/prj-testing-standard.md"
      - "language-tooling/prj-feature-addition-guide.md"
    
  bash-tooling:
    name: "Bash/Node.js CLI Tooling"
    claude_md_template: "project-level-specialized.md"
    supporting_files:
      - "DEVNOTES.md" (recommended)
      - "CHANGELOG.md" (recommended)
    required_prompts:
      - "common/prj-git-workflow-standard.md"
      - "bash-tooling/prj-doc-parity-standard.md"
    
  mcp-server:
    name: "MCP Server Implementation"
    claude_md_template: "project-level-specialized.md"
    supporting_files:
      - "PROJECT-STATUS.md" (recommended)
      - "docs/DEPLOYMENT.md" (required)
    required_prompts:
      - "common/prj-git-workflow-standard.md"
      - "common/prj-testing-standard.md"
      - "mcp-server/prj-deployment-standard.md"

# Validation rules (ENHANCED)
validation:
  claude_md:
    forbidden_sections:
      - "Project Status"
      - "Current Phase"
      - "Completed Features"
      - "In Progress"
      - "Pending Tasks"
      - "Recent Updates"
      - "Bug Fixes"
      - "Version History"
      - "Development Notes"
    
    required_directive_language:
      - "MUST"
      - "ALWAYS"
      - "NEVER"
      - "REQUIRED"
      - "MANDATORY"
    
    detect_non_directives:
      - "✅" symbols (completion tracking)
      - "🔄" symbols (progress tracking)
      - "📋" symbols (task tracking)
      - Date stamps in section headers
      - Version numbers in section headers
```

---

## Updated Automation Features

### 1. Project Initialization Tool (ENHANCED)

**New Capability: Supporting Files**

When creating project, also create appropriate supporting files:
- For language-tooling: Create PROJECT-STATUS.md, DEVNOTES.md, docs/ARCHITECTURE.md templates
- For mcp-server: Create PROJECT-STATUS.md, docs/DEPLOYMENT.md templates
- For bash-tooling: Create DEVNOTES.md template
- For all: Create CHANGELOG.md template

**Validation:**
- Ensure CLAUDE.md contains ONLY directives
- Warn if status tracking detected in CLAUDE.md
- Suggest moving to appropriate supporting file

### 2. Configuration Validation Tool (ENHANCED)

**New Checks:**
- Detect status tracking in CLAUDE.md (forbidden sections)
- Detect development notes in CLAUDE.md
- Detect version history in CLAUDE.md
- Verify supporting files exist for project type
- Check for proper separation of concerns

**Auto-Fix Capabilities:**
- Extract status tracking from CLAUDE.md → PROJECT-STATUS.md
- Extract dev notes from CLAUDE.md → DEVNOTES.md
- Extract version history from CLAUDE.md → CHANGELOG.md
- Preserve only directives in CLAUDE.md

### 3. CLAUDE.md Cleanup Tool (NEW)

**Function:** Separate directives from non-directive content

**Features:**
- Scan CLAUDE.md for non-directive content
- Categorize content (status, notes, architecture, history)
- Create appropriate supporting files
- Extract and organize content
- Preserve only directives in CLAUDE.md
- Generate backup before modification

**Process:**
1. Parse CLAUDE.md into sections
2. Classify each section (directive vs non-directive)
3. For non-directive sections:
   - Determine target file (STATUS, DEVNOTES, ARCHITECTURE, CHANGELOG)
   - Extract content
   - Create/append to target file
4. Regenerate CLAUDE.md with only directive sections
5. Show summary of changes
6. Confirm before applying

### 4. Migration Tool (ENHANCED)

**New Migration Scenario:**
- Mixed content CLAUDE.md → Separated (directives in CLAUDE.md, other content in supporting files)

**Process:**
1. Detect mixed content
2. Use CLAUDE.md Cleanup Tool
3. Validate result
4. Update project type metadata if needed

---

## Implementation Phases (REVISED)

### Phase 0: Immediate Corrections (NEW - PRIORITY)

**Objective:** Fix projects with incorrect CLAUDE.md usage

**Tasks:**
1. Create supporting file templates (PROJECT-STATUS.md, DEVNOTES.md, etc.)
2. Build CLAUDE.md Cleanup Tool
3. Apply cleanup to problematic projects:
   - sv/specverse-lang (extract status/notes → supporting files)
   - sv/specverse-lang/ai-support-mcp-clean-impl (extract status → STATUS.md)
   - npm-protect (extract notes → DEVNOTES.md)

**Deliverables:**
- Supporting file templates
- CLAUDE.md Cleanup Tool
- Corrected projects with proper separation

### Phase 1: Template Repository Setup

[Previous content, PLUS:]
- Add supporting file templates
- Add CLAUDE.md purpose enforcement documentation
- Add validation rules for forbidden content

### Phase 2-7: [As previously defined]

---

## Critical Success Criteria (REVISED)

### 1. CLAUDE.md Purity (NEW - CRITICAL)

- **100% of CLAUDE.md files contain ONLY directives**
- No status tracking in any CLAUDE.md
- No development notes in any CLAUDE.md
- No version history in any CLAUDE.md
- All non-directive content properly separated into supporting files

### 2. Proper Separation of Concerns

- Status tracking → PROJECT-STATUS.md (where needed)
- Development notes → DEVNOTES.md (where needed)
- Architecture docs → docs/ARCHITECTURE.md
- Version history → CHANGELOG.md

### 3. Validation Catches Violations

- Tool detects status tracking in CLAUDE.md
- Tool detects development notes in CLAUDE.md
- Tool suggests appropriate supporting files
- Auto-fix capability available

### 4-5: [As previously defined]

---

## Appendix A: CLAUDE.md Violations Found

### Violation Summary

| Project | Violation Type | Severity | Action Required |
|---------|---------------|----------|-----------------|
| sv/specverse-lang | Status + Notes + History mixed with directives | HIGH | Extract to STATUS.md, DEVNOTES.md |
| ai-support-mcp-clean-impl | Entire file is status tracking | HIGH | Create CLAUDE.md with directives, move content to STATUS.md |
| npm-protect | Development notes instead of directives | MEDIUM | Create directive-based CLAUDE.md, move notes to DEVNOTES.md |

### Correct Examples

| Project | Reason | Pattern |
|---------|--------|---------|
| gainfunction/website | Pure directives, standards references | ✅ Correct |
| marrbox/set-up-and-admin | Pure directives, documentation standards | ✅ Correct |
| sv/specverse-app-portal | Pure directives, technical requirements | ✅ Correct |
| scoremyclays | Simple project overview (acceptable for early stage) | ✅ Acceptable |

---

## Appendix B: Supporting Files Purpose

**PROJECT-STATUS.md**
- Phase completion tracking
- Feature status (completed, in progress, pending)
- Milestone tracking
- Development roadmap

**DEVNOTES.md**
- Session notes with dates
- Bug fix history
- Technical implementation details
- Performance improvements log
- Development decisions and rationale

**docs/ARCHITECTURE.md**
- System architecture overview
- Component relationships
- Technology stack details
- Design patterns used
- Critical path information

**CHANGELOG.md**
- Version history
- Release notes
- Migration notes
- Breaking changes
- Deprecation notices

---

**End of Corrected Functional Specification**

**CRITICAL REMINDER:** CLAUDE.md is for imperative directives ONLY. All other content belongs in separate, purpose-specific files.
