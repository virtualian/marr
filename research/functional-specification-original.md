# Claude Code Project Configuration System
## Functional Specification

**Date:** 2025-11-17

---

## Executive Summary

This specification defines a simplified, unified Claude Code configuration system that applies the same comprehensive standards to all repositories regardless of project type or technology stack.

### Key Principles

1. **Unified Standards**: All repositories use the same comprehensive configuration
2. **Two-Layer System**: User-level preferences + project-level technical standards
3. **No Project Type Classification**: Same standards apply universally
4. **Standards Included By Default**: Git workflow, testing, and MCP usage standards in every repo
5. **Git-Based Versioning**: All changes tracked through Git history, not filename versions

---

## Unified Repository Structure

All repositories follow the same standardized structure regardless of project type or technology:

```
project-root/
├── CLAUDE.md                          # Project-level configuration
├── prompts/
│   ├── prj-git-workflow-standard.md
│   ├── prj-testing-standard.md
│   └── prj-mcp-usage-standard.md
├── docs/                              # Technical documentation
├── plans/                             # Implementation plans
├── research/                          # Research reports
└── src/                               # Source code (if applicable)
```

### Standard Prompt Files (All Repositories)

Every repository includes these project-level standards:

1. **prj-git-workflow-standard.md** - Git workflow, branching, PR standards
2. **prj-testing-standard.md** - Testing philosophy and practices
3. **prj-mcp-usage-standard.md** - MCP tool usage patterns

**Naming Convention:** `prj-{standard-name}.md`

### Optional Project-Specific Standards

Projects may add additional standards as needed:
- `prj-ui-ux-standard.md` (for user-facing applications)
- `prj-documentation-standard.md` (for projects with significant documentation)
- `prj-api-standard.md` (for API development)
- `prj-doc-parity-standard.md` (for CLI/tooling projects with script documentation)

---

## User-Level Configuration

### Standard User-Level Setup

**Location:** `~/.claude/`

**Files Structure:**
```
~/.claude/
├── CLAUDE.md                          # User-level master configuration
├── prompts/
│   ├── user-git-workflow-standard.md
│   ├── user-mcp-usage-standard.md
│   └── user-testing-standard.md
└── prompt-templates/
    ├── prj-git-workflow-standard.md
    ├── prj-testing-standard.md
    ├── prj-mcp-usage-standard.md
    ├── CLAUDE-project.md
    └── metadata/
        └── template-registry.yaml
```

**Naming Convention:** `{prefix}-{name}.md` (no version suffixes)

**User CLAUDE.md Structure:**
- Guard rail authority directives
- Configuration scope definitions
- Multi-agent recognition
- Prompt file creation/modification standards
- Attribution restrictions
- Communication style preferences
- Work habits
- Mandatory user approval (git operations)
- Opinion/research request handling
- Plan creation standards
- Automated port management
- Security, Git workflow, Testing, Code organization standards
- Documentation organization (detailed directory structure)
- Tool usage standards
- GitHub sub-issues management (helper scripts in ~/bin/)
- Session recap management

**User-Level Prompt Files:**

1. **user-git-workflow-standard.md** (2,847 lines)
   - Process-First Mandate (even in emergencies)
   - Branch naming conventions
   - Standard/hotfix workflows
   - Branch lifetime management
   - Branch cleanup (industry standard)
   - Commit & PR standards
   - GitHub helper scripts (sub-issues management)
   - Anti-patterns

2. **user-mcp-usage-standard.md** (1,286 lines)
   - MCP tool specificity requirements
   - Tool-specific usage (v0, shadcn-ui, tailwind, a11y, playwright)
   - Common workflow patterns
   - Performance considerations
   - Troubleshooting guide

3. **user-testing-standard.md** (851 lines)
   - Testing philosophy (behavior vs implementation)
   - Two-layer testing strategy
   - Testing priorities (what to test/skip)
   - Coverage philosophy (realistic thresholds)
   - Anti-patterns

---

## Project-Level Configuration Variations

### Git Workflow Standard Variations

**SpecVerse App Portal Version** (`prompt-git-workflow-standard.md` - 1,633 lines):
- **Process-First Mandate** section (same as user-level)
- **Issue Types & Categorization** (Bug/Feature/Story/Task)
- **GitHub Sub-Issues for Feature/Story Hierarchies** (native support since April 2025)
- **Branch Type Rules** table (Independent Story, Feature, Story within Feature, Bug, Task, Hotfix)
- **Feature with Stories Workflow** (work on Feature branch directly)
- **Release Management** section (npm scripts: release:patch/minor/major)
- **Integration Requirements** section (references testing standards)

**Key Addition:** Native GitHub sub-issues integration and Feature/Story hierarchy management

---

### Testing Standard Variations

**SpecVerse App Portal Version** (`prompt-testing-standard.md` - 449 lines):
- **Project-agnostic** - focuses on WHAT and WHY
- **Two-Layer Testing Strategy** (Vitest + Playwright explicitly mentioned but as examples)
- **Testing Scope by Type** section
- **Anti-Patterns** section
- **Integration Requirements** section
- No specific coverage thresholds (left to project implementation)
- No specific testing stack (philosophical, not prescriptive)

**Difference from User-Level:** User-level is more philosophical/universal; project-level includes framework mentions but still focuses on principles

---

### UI/UX Standards (Project-Specific Only)

**Found in:** gainfunction/website only

**File:** `prj-ui-ux-standard.md` (8,294 lines - extremely comprehensive)

**Major Sections:**
- Core Rules (accessibility, mobile-first, brand consistency, conversion optimization)
- Target Audience Requirements
- Accessibility Standards (WCAG 2.1 Level AA with brand color exceptions)
- Mobile-First Design Standards
- Brand Standards (reference to project design system)
- Component Standards (CTA, forms, cards, navigation)
- Conversion Optimization Standards
- Technology Stack Standards (Next.js 14+, TypeScript, Tailwind, shadcn/ui, v0 MCP)
- MCP Tool Usage Requirements (mandatory workflow)
- Visual Testing Standards
- Anti-Patterns (design and technical)
- Performance Standards
- Content Standards
- Responsive Breakpoint Standards
- Documentation Standards
- Review and Validation Checklist
- AI Agent Specific Instructions (component generation workflow)

**This is a fully-realized project-specific standard** demonstrating the full power of the prompt-based system.

---

### Documentation Standards (Project-Specific Only)

**Found in:** marrbox/set-up-and-admin

**File:** `prompt-documentation-standard.md` (6,411 lines - extremely comprehensive)

**Major Sections:**
- Diataxis framework explanation (Tutorials, How-To, Reference, Explanation)
- Role-First Navigation Architecture (Administrator, User, Power User)
- File Structure requirements (role-first, then content type)
- Markdown requirements
- Navigation structure
- Section index pages (two-level: role landing + content type)
- Content quality standards
- Cross-referencing guidelines
- External documentation reference policies
- Voice and tone by content type
- Writing style guidelines
- Code example standards by content type
- Validation checklist
- Implementation approach
- Common pitfalls and solutions

**This demonstrates how project-specific standards can define entirely different domains** (documentation framework vs UI/UX vs testing).

---

## npm-protect Project: Comprehensive Documentation Requirements

**Project Type:** Bash/Node.js Security Toolkit

**CLAUDE.md Structure:** Extended project notes rather than AI agent directives

**Critical Section: Documentation Maintenance**

The npm-protect project includes a comprehensive documentation maintenance protocol:

**Documentation Structure:**
```
docs/
├── README.md                          # Navigation index
├── overview.md                        # System architecture
├── npm-security-audit.md             # Documents npm-security-audit.sh
├── audit-installed-packages.md       # Documents audit-installed-packages.sh
├── recursive-audit-script.md         # Documents recursive-audit-script.sh
├── scheduled-audit-script.md         # Documents scheduled-audit-script.sh
├── package-validator.md              # Documents package-validator.js
├── npm-install-monitor.md            # Documents npm-install-monitor.js
├── credential-rotation-script.md     # Documents credential-rotation-script.sh
├── generate-summary-report.md        # Documents generate-summary-report.sh
├── npmrc-security-config.md          # Documents npmrc-security-config.sh
├── security-indicators.md            # Security threat documentation
├── output-formats.md                 # Report format specifications
├── integration-guidelines.md         # CI/CD and tooling integration
└── appendix.md                       # Troubleshooting and best practices
```

**Mandatory Update Protocol:**

Whenever a script is modified, MUST update:
1. Corresponding docs/ file with same changes
2. docs/README.md if navigation affected
3. docs/overview.md if architecture changed
4. Test all cross-references
5. Update version numbers in both script and docs

**What Requires Documentation Updates:**
- ✅ New command-line options or parameters
- ✅ Changed default behavior
- ✅ New output formats or report types
- ✅ Modified algorithms or detection methods
- ✅ New dependencies or requirements
- ✅ Changed file locations or names
- ✅ New error messages or exit codes
- ✅ Performance improvements with measurable impact
- ✅ New security indicators or threat types

**Pre-Commit Checklist:**
- [ ] Corresponding docs/ file(s) updated
- [ ] Code examples in docs tested
- [ ] Cross-references verified
- [ ] Performance characteristics updated if changed
- [ ] README.md updated if navigation changed
- [ ] Git commit message mentions doc updates

**This pattern is unique to npm-protect** and represents a different approach to documentation standards: script-level documentation parity rather than framework-level (Diataxis).

**Lesson:** Different project types need different documentation standards. Bash toolkit documentation ≠ Web app documentation ≠ MkDocs site documentation.

---

## SpecVerse Projects: Specialized Configurations

### SpecVerse Language (sv/specverse-lang)

**Project Type:** Language specification and tooling

**Unique Characteristics:**
- Very detailed CLAUDE.md (12,845 lines) serving as comprehensive development guide
- Multiple AI support implementations (MCP servers)
- Template system with default project CLAUDE.md
- Extensive API usage documentation
- Feature addition guide (systematic 11-phase approach)

**Key Sections:**
- Project Overview (with validated scale support)
- AI Support MCP Server status
- Architecture (core components)
- Development commands
- Testing architecture (5-tier system with 306+ tests)
- Expected failures management system
- Critical path information (parser, inference, AI workflow)
- Common issues & solutions
- Language features
- Programmatic API usage
- Feature development guide
- Testing guidelines
- Code quality standards
- Documentation
- Release process
- Troubleshooting
- VSCode extension
- Recent updates & migration notes

**This CLAUDE.md serves as both AI agent guide AND comprehensive developer documentation.**

### SpecVerse App Portal (sv/specverse-app-portal)

**Project Type:** Next.js web application

**Configuration:**
- Standard two-layer CLAUDE.md
- References prompt-git-workflow-standard.md and prompt-testing-standard.md
- Environment variable management directives (Vercel-specific)
- Testing constraints (no watch mode)

**Environment Variables Section:**
- NEVER edit .env.local directly
- ALWAYS use `vercel env pull`
- OAuth development with fixed ngrok URLs
- AUTH_URL vs NEXTAUTH_URL (NextAuth v5)
- Proper formatting requirements (no embedded newlines)
- Creation with printf instead of echo

**This demonstrates project-specific technical requirements** overlaid on standard prompts.

### AI Support MCP Implementation (ai-support-mcp-clean-impl)

**Project Type:** MCP server implementation

**Configuration:**
- Simple CLAUDE.md focused on implementation status
- Phase-based development tracking
- Multi-environment deployment documentation
- Integration points documentation

**Structure:**
- Project Status (phase completion tracking)
- Completed Features (documentation system, hybrid resources, build system, HTTP API)
- Currently In Progress
- Pending Tasks
- Architecture Overview
- Key Components
- Resource System
- Build System
- Development Commands
- Integration Points
- File Structure
- Next Steps

**This is more of a project status document than AI agent directive file.**

---

## Configuration Metadata Discovery

### Mandatory Sections Identified

**User-Level CLAUDE.md Must Have:**
1. Guard rail authority statement
2. Configuration scope definition
3. Multi-agent recognition
4. Prompt file creation/modification standards
5. Attribution restrictions
6. Communication style preferences
7. Work habits
8. Mandatory user approval for git operations
9. Documentation organization standards
10. Tool usage standards

**Project-Level CLAUDE.md Must Have:**
1. Layer identification (Layer 2 of 2)
2. Precedence rules statement
3. Startup imperatives for Claude Code
4. Project-specific reminders
5. Mandatory user approval (git operations)
6. GitHub auto-linking prevention (if using GitHub)
7. Documentation organization (if applicable)
8. Standards references (if using prompts)

### Prompt File Naming Conventions

**User-Level Prompts:**
- Prefix: `user-`
- Example: `user-git-workflow-standard.md`
- Location: `~/.claude/prompts/`

**Project-Level Prompts:**
- Prefix: `prj-` or `prompt-` (both patterns observed)
- Example: `prj-testing-standard.md` or `prompt-testing-standard.md`
- Location: `./prompts/`

**Recommendation:** Standardize on `prj-` prefix for clarity (shorter, clearer distinction from user-level)

### Reference Syntax

**In CLAUDE.md files:**
```markdown
@prompts/prj-testing-standard.md
@prompts/prompt-git-workflow-standard.md
@~/.claude/prompts/user-testing-standard.md
```

**Observed variations:**
- With `@` prefix (most common)
- Without `@` prefix (some projects)
- Full path (`@~/.claude/prompts/`) vs relative path (`@prompts/`)

**Recommendation:** Standardize on `@prompts/filename.md` for project-level, `@~/.claude/prompts/filename.md` for user-level

---

## Universal Standards Application

### All Repositories Include

**Required Standards (Every Repository):**
1. **Git Workflow Standard** - Branching, commits, PRs, issue tracking
2. **Testing Standard** - Testing philosophy and practices
3. **MCP Usage Standard** - Tool usage patterns for AI-assisted development

**Common Directory Structure:**
```
project-root/
├── CLAUDE.md
├── prompts/
│   ├── prj-git-workflow-standard.md
│   ├── prj-testing-standard.md
│   └── prj-mcp-usage-standard.md
├── docs/
├── plans/
├── research/
└── src/ (or appropriate source directory)
```

**Technology Agnostic:** Standards apply whether project uses:
- Next.js, React, Vue (web frameworks)
- TypeScript, JavaScript, Python, Bash (languages)
- MkDocs, Docusaurus (documentation)
- CLI tools, MCP servers, libraries (project types)

**Rationale:** Core development practices (git workflow, testing philosophy, tool usage) transcend technology choices.

---

## Helper Scripts

**Location:** `~/bin/` (in user's PATH)

**Standard Helper Scripts:**
- `gh-add-subissue.sh` - Link sub-issue to parent issue
- `gh-list-subissues.sh` - List all sub-issues of parent

**Usage Pattern:**
```bash
# Link issue #47 as sub-issue of #45
gh-add-subissue.sh 45 47

# List all sub-issues of #45
gh-list-subissues.sh 45
```

**Implementation:** Uses GitHub GraphQL API with proper error handling

**Installation:** Helper scripts installed to `~/bin/` during initialization and available system-wide

---

## Version Control

All configuration files, templates, and standards are tracked in Git repositories:

### User-Level Configuration
- Repository: `~/.claude/` (Git-tracked)
- All changes tracked via Git commits
- No version suffixes in filenames

### Project-Level Configuration
- Repository: Each project's Git repository
- Prompt files in `./prompts/` directory
- All changes tracked via project Git history

### Template Updates
- Templates stored in `~/.claude/prompt-templates/`
- Updates pulled from central repository
- Git history shows template evolution

---

## Optional Standard: Documentation Parity Protocol

### Overview

For CLI tools, bash scripts, and executable tooling projects, code and documentation must maintain strict parity. This pattern is inspired by the npm-protect project.

**When to use:** Projects where users primarily interact through command-line scripts rather than application UI.

### Core Principle

**"If it's not documented, it doesn't exist."**

Every script change that affects user behavior MUST have a corresponding documentation update before commit.

### Documentation Structure

```
project-root/
├── scripts/
│   ├── script-one.sh
│   ├── script-two.sh
│   └── shared-lib.sh
└── docs/
    ├── README.md                  # Navigation index
    ├── overview.md                # System architecture
    ├── script-one.md              # Mirrors script-one.sh
    ├── script-two.md              # Mirrors script-two.sh
    └── shared-lib.md              # Mirrors shared-lib.sh
```

### Mandatory Update Protocol

**When modifying a script, ALWAYS update:**

1. **Corresponding docs file** - Same changes to documentation
2. **docs/README.md** - If navigation/features affected
3. **docs/overview.md** - If architecture changed
4. **Cross-references** - Test all links still work
5. **Version numbers** - Both script headers and docs

### What Requires Documentation Updates

**✅ ALWAYS UPDATE:**
- New command-line options or parameters
- Changed default behavior
- New output formats or report types
- Modified algorithms or detection methods
- New dependencies or requirements
- Changed file locations or names
- New error messages or exit codes
- Performance improvements with measurable impact

**⚠️ CONSIDER UPDATING:**
- Bug fixes that affect behavior
- Internal refactoring that changes how features work
- Optimization affecting performance characteristics

**❌ NO UPDATE NEEDED:**
- Code comments only
- Variable name changes (internal)
- Pure refactoring with no behavioral changes

### Documentation Quality Standards

Each script documentation file MUST include:
- **Purpose** - What the script does
- **Functionality** - How it works (technical details)
- **Input Parameters** - All command-line options
- **Output Format** - What the script produces
- **Performance Characteristics** - Speed, memory, scalability
- **Use Cases** - Real-world examples
- **Cross-references** - Links to related docs

### Pre-Commit Checklist

Before committing script changes:
- [ ] Corresponding docs/ file(s) updated
- [ ] Code examples in docs tested
- [ ] Cross-references verified
- [ ] Performance characteristics updated if changed
- [ ] README.md updated if navigation changed
- [ ] Git commit message mentions doc updates

### Detection Script

Detect stale documentation:

```bash
#!/bin/bash
# Find scripts modified after their documentation

for script in scripts/*.sh scripts/*.js; do
  doc="docs/$(basename "$script" .sh).md"
  doc="${doc%.js.md}.md"

  if [ -f "$doc" ]; then
    script_time=$(stat -f %m "$script" 2>/dev/null || stat -c %Y "$script")
    doc_time=$(stat -f %m "$doc" 2>/dev/null || stat -c %Y "$doc")

    if [ "$script_time" -gt "$doc_time" ]; then
      echo "⚠️  $script modified after $doc"
    fi
  else
    echo "❌ Missing documentation for $script"
  fi
done
```

### Example Commit Message

```
Fix output directory bug in audit-script.sh

- Convert OUTPUT_DIR to absolute path before cd
- Fixes "No such file or directory" errors
- Update docs/audit-script.md:
  - Add troubleshooting section
  - Update performance characteristics
  - Add example for custom output directory

Fixes #123
```

### Consequences of Outdated Documentation

- Users follow incorrect instructions → broken workflows
- Wrong parameters documented → errors and confusion
- Outdated examples → frustration and time waste
- Missing features → underutilization of tools
- Incorrect performance info → wrong architecture decisions

### Implementation in CLAUDE.md

Projects using this standard should include in their CLAUDE.md:

```markdown
## Documentation Parity (CRITICAL)

This project uses the Documentation Parity Protocol.

**MANDATORY:** When modifying any script, update corresponding docs/ file.

See `prj-doc-parity-standard.md` for complete requirements.
```

**Rationale:** CLI tools are discovered and understood through documentation. Outdated docs are worse than no docs—they actively mislead users.

---

## Missing Standardization Opportunities

### Projects Needing Upgrade

1. **npm-protect**
   - Current: Simple project notes
   - Needs: Git workflow standard, testing standard (if applicable)
   - Blocker: Bash/Node hybrid might not fit standard patterns
   - Solution: Create bash-tooling project type with script doc parity

2. **scoremyclays / scoremyclays-onlook**
   - Current: Simple project notes
   - Needs: Git workflow, testing, UI/UX standards
   - Blocker: Early development stage, architecture not established
   - Solution: Initialize with web-nextjs template when architecture solidifies

### Template Gaps Identified

1. **No bash-tooling template**
   - npm-protect pattern unique
   - Script doc parity concept not templated
   - Pre-commit doc check not standardized

2. **No comprehensive-dev-guide template**
   - sv/specverse-lang pattern of CLAUDE.md as both AI guide + dev docs
   - Extended documentation sections
   - Feature addition processes

3. **No MCP server template**
   - ai-support-mcp-clean-impl pattern
   - Phase-based status tracking
   - Multi-environment deployment
   - Integration documentation

---

## Prompt Template Repository Structure (Revised)

```
~/.claude/prompt-templates/
├── user/
│   ├── user-git-workflow-standard.md          # Universal git workflow
│   ├── user-mcp-usage-standard.md             # Universal MCP usage
│   └── user-testing-standard.md               # Universal testing philosophy
│
├── project/
│   ├── common/
│   │   ├── prj-git-workflow-standard.md       # Project git workflow (with sub-issues)
│   │   └── prj-testing-standard.md            # Project testing standard
│   │
│   ├── web-nextjs/
│   │   ├── prj-ui-ux-standard.md              # UI/UX comprehensive standard
│   │   └── prj-testing-standard.md            # Next.js/Vitest/Playwright specific
│   │
│   ├── documentation-mkdocs/
│   │   └── prompt-documentation-standard.md   # Diataxis framework standard
│   │
│   ├── language-tooling/
│   │   └── prj-feature-addition-guide.md      # Systematic feature addition
│   │
│   ├── bash-tooling/
│   │   └── prj-doc-parity-standard.md         # Script documentation parity
│   │
│   └── mcp-server/
│       └── prj-deployment-standard.md         # Multi-environment deployment
│
├── claude-md/
│   ├── user-level-template.md                 # User ~/.claude/CLAUDE.md template
│   ├── project-level-basic.md                 # Simple project CLAUDE.md
│   ├── project-level-standards.md             # Full standards-based CLAUDE.md
│   ├── project-level-dev-guide.md             # Comprehensive dev guide CLAUDE.md
│   └── project-level-status.md                # Status-tracking CLAUDE.md
│
└── metadata/
    ├── project-types.yaml                     # Project type definitions
    ├── required-sections.yaml                 # CLAUDE.md mandatory sections
    ├── naming-conventions.yaml                # File/prefix naming rules
    └── directory-structures.yaml              # Standard directory layouts
```

---

## Initialization Configuration (Enhanced)

**Proposed:** `~/.claude/init-config.yaml`

```yaml
version: "2.0"

# Project type definitions
project_types:
  web-nextjs:
    name: "Next.js Web Application"
    claude_md_template: "project-level-standards.md"
    required_prompts:
      - "common/prj-git-workflow-standard.md"
      - "common/prj-testing-standard.md"
      - "web-nextjs/prj-ui-ux-standard.md"
    optional_prompts:
      - "user-mcp-usage-standard.md"
    directories:
      - "docs/"
      - "plans/"
      - "research/"
      - "prompts/"
      - "src/"
    gitignore_template: "web-nextjs"
    
  documentation-mkdocs:
    name: "MkDocs Documentation Site"
    claude_md_template: "project-level-standards.md"
    required_prompts:
      - "common/prj-git-workflow-standard.md"
      - "documentation-mkdocs/prompt-documentation-standard.md"
    directories:
      - "docs/"
      - "prompts/"
    gitignore_template: "documentation"
    
  language-tooling:
    name: "Language/Tool Development"
    claude_md_template: "project-level-dev-guide.md"
    required_prompts:
      - "common/prj-git-workflow-standard.md"
      - "common/prj-testing-standard.md"
      - "language-tooling/prj-feature-addition-guide.md"
    directories:
      - "docs/"
      - "examples/"
      - "prompts/"
      - "src/"
      - "tests/"
    gitignore_template: "typescript"
    
  bash-tooling:
    name: "Bash/Node.js CLI Tooling"
    claude_md_template: "project-level-standards.md"
    required_prompts:
      - "common/prj-git-workflow-standard.md"
      - "bash-tooling/prj-doc-parity-standard.md"
    directories:
      - "docs/"
      - "scripts/"
    gitignore_template: "bash"
    special_setup:
      - "Configure pre-commit doc check"
    
  mcp-server:
    name: "MCP Server Implementation"
    claude_md_template: "project-level-status.md"
    required_prompts:
      - "common/prj-git-workflow-standard.md"
      - "common/prj-testing-standard.md"
      - "mcp-server/prj-deployment-standard.md"
    directories:
      - "docs/"
      - "src/"
      - "tests/"
      - "dist/"
    gitignore_template: "typescript"

# User-level configuration
user_config:
  location: "~/.claude/CLAUDE.md"
  prompts_directory: "~/.claude/prompts/"
  helper_scripts_directory: "~/bin/"
  
  required_prompts:
    - "user-git-workflow-standard.md"
    - "user-mcp-usage-standard.md"
    - "user-testing-standard.md"
  
  required_helper_scripts:
    - "gh-add-subissue.sh"
    - "gh-list-subissues.sh"

# Template locations
templates:
  root: "~/.claude/prompt-templates/"
  user_prompts: "user/"
  project_prompts: "project/"
  claude_md: "claude-md/"
  metadata: "metadata/"

# Naming conventions
naming:
  user_prompts:
    prefix: "user-"
    suffix: "-standard.md"
  project_prompts:
    prefix: "prj-"
    suffix: "-standard.md"
  reference_syntax:
    user: "@~/.claude/prompts/"
    project: "@prompts/"

# Directory structure standards
directories:
  common:
    - "docs/"
    - "prompts/"
  
  planning:
    - "plans/"
    - "research/"
    - "tasks/"
  
  code:
    - "src/"
    - "tests/"

# Required CLAUDE.md sections
required_sections:
  user_level:
    - "Guard Rail Authority"
    - "Configuration Scope"
    - "Multi-Agent Recognition"
    - "Prompt File Creation Standards"
    - "Attribution Restrictions"
    - "Communication Style"
    - "Work Habits"
    - "Mandatory User Approval"
    - "Documentation Organization"
    - "Tool Usage Standards"
  
  project_level:
    - "Layer Identification"
    - "Precedence Rules"
    - "Startup Imperatives"
    - "Project-Specific Reminders"
    - "Mandatory User Approval"
    - "Standards References"

# Validation rules
validation:
  user_claude_md:
    required_sections: true
    prompt_references_exist: true
    
  project_claude_md:
    required_sections: true
    prompt_files_exist: true
    valid_reference_syntax: true
    
  prompt_files:
    no_code_examples: true
    imperative_directives: true
    what_and_why_only: true
```

---

## Updated Pain Points

### 1. Inconsistent Adoption

**Issue:** Projects at different stages of standards adoption
- 4 projects: Full standards system
- 3 projects: Minimal configuration
- 2 projects: Template/specialized

**Impact:** 
- Inconsistent AI agent behavior across projects
- Unclear which pattern to follow for new projects
- Standards not universally applied

**Solution:** Migration tool to upgrade projects + clear documentation

### 2. Missing Templates for Specialized Patterns

**Issue:** Unique patterns (bash-tooling, dev-guide, status-tracking) not templated

**Impact:**
- Cannot easily replicate successful patterns
- Manual extraction from existing projects
- Risk of incomplete replication

**Solution:** Extract and template these patterns

### 3. Naming Convention Inconsistencies

**Issue:** Both `prj-` and `prompt-` prefixes observed

**Impact:**
- Confusion about correct naming
- Inconsistent references in CLAUDE.md
- Harder to discover available prompts

**Solution:** Standardize on `prj-` prefix, migration tool to update existing

### 4. No Central Prompt Repository

**Issue:** Prompts are project-local, no central version control

**Impact:**
- Prompt improvements don't propagate
- Version drift between projects
- No easy way to update all projects

**Solution:** Central template repository with versioning

### 5. Helper Scripts Not Universally Available

**Issue:** GitHub helper scripts referenced but may not be installed

**Impact:**
- References to scripts that don't exist
- Manual installation required
- Inconsistent availability

**Solution:** Include helper scripts in initialization process

---

## Updated Automation Features

### 1. Project Initialization Tool (Enhanced)

**Function:** Create new project with proper Claude Code configuration

**Inputs:**
- Project name
- Project type (web-nextjs, documentation-mkdocs, language-tooling, bash-tooling, mcp-server)
- Project root directory
- Optional: Use simplified CLAUDE.md (for early-stage projects)

**Outputs:**
- Created directory structure
- Generated CLAUDE.md from appropriate template
- Copied relevant prompt files to ./prompts/
- Created .gitignore with appropriate entries
- Created initial README.md
- Installed helper scripts (if not already in ~/bin/)
- Generated initial quick reference files (BRANCHING.md, TESTING.md, etc.)

**Process:**
1. Validate user-level ~/.claude/CLAUDE.md exists
2. Prompt for project type if not specified
3. Create project root directory
4. Create standard subdirectories based on type
5. Generate CLAUDE.md from template with substitutions
6. Copy project-type-specific prompts to ./prompts/
7. Copy required user-level prompts if referenced
8. Install helper scripts to ~/bin/ if needed
9. Create .gitignore if doesn't exist
10. Generate quick reference files
11. Report what was created
12. Suggest next steps

**New Capability:** Handle simplified vs full standards configuration

### 2. Configuration Validation Tool (Enhanced)

**Function:** Validate existing project configuration

**Checks:**
- User-level ~/.claude/CLAUDE.md exists and valid
- Project-level ./CLAUDE.md exists and valid
- All referenced prompt files exist
- Required sections present in CLAUDE.md
- No conflicts between user and project configs
- Directory structure matches expectations
- Startup behavior requirements documented
- Naming conventions followed (prj- prefix)
- Helper scripts available (~/bin/)

**Output:**
- Validation report with errors and warnings
- Suggestions for fixes
- Migration recommendations if using old patterns
- Optional auto-fix for common issues

**New Capability:** Detect configuration pattern (v1/v2/v3/v4) and recommend upgrades

### 3. Prompt Template Management (Enhanced)

**Function:** Centralized management of prompt templates

**Features:**
- List available templates by category
- Update template from repository
- Add new template
- Version tracking
- Template documentation
- Extract template from existing project
- Compare project prompt to template (detect drift)

**New Capability:** Extract patterns from existing projects to create templates

### 4. Project Migration Tool (New)

**Function:** Update existing project to current standards

**Features:**
- Detect current configuration pattern (v1/v2/v3/v4)
- Analyze project to determine appropriate target pattern
- Generate migration plan
- Apply updates to CLAUDE.md
- Update prompt files
- Rename files to follow naming conventions (prj- prefix)
- Preserve project-specific customizations
- Generate backup before migration
- Rollback capability

**Migration Scenarios:**
- v1 (simplified) → v3 (full standards)
- v2 (partial) → v3 (full standards)
- v3 → v3 (update to latest template version)
- prompt- prefix → prj- prefix
- Add missing helper scripts

### 5. Standards Propagation Tool (New)

**Function:** Update all projects when user-level standards change

**Features:**
- Detect which projects use centralized standards
- Identify projects needing update
- Preview changes for each project
- Selective update (choose which projects)
- Batch update all projects
- Generate update report

**Use Case:** When user-level prompt changes, propagate to all projects that reference it

### 6. Helper Script Manager (New)

**Function:** Manage GitHub helper scripts and other utilities

**Features:**
- Install helper scripts to ~/bin/
- Update helper scripts
- Verify helper scripts exist
- Add new helper scripts
- Documentation for each script

**Managed Scripts:**
- gh-add-subissue.sh
- gh-list-subissues.sh
- (Future additions)

---

## Implementation Phases (Revised)

### Phase 1: Template Repository Setup

1. Create central template repository structure (`~/.claude/prompt-templates/`)
2. Extract templates from existing projects:
   - User-level prompts (already exist)
   - Project-level prompts (common, type-specific)
   - CLAUDE.md templates (4 variations)
   - Metadata files
3. Document template customization points
4. Create initialization configuration file (init-config.yaml)
5. Version templates (v1.0.0)

**Deliverables:**
- Complete template repository
- Template documentation
- Versioned templates
- init-config.yaml

### Phase 2: Helper Script Management

1. Extract helper scripts from user environment
2. Create helper script manager tool
3. Document each helper script
4. Add installation verification
5. Create update mechanism

**Deliverables:**
- Helper script repository in templates
- Script manager tool
- Installation verification
- Update mechanism

### Phase 3: Initialization Tool

1. Build project type detection/selection
2. Implement directory structure creation
3. Implement template instantiation with variable substitution
4. Add validation and reporting
5. Integrate helper script installation
6. Generate quick reference files

**Deliverables:**
- Working initialization tool
- Project type templates
- Quick reference generation
- Helper script integration

### Phase 4: Validation Tool

1. Build configuration parser
2. Implement validation rules
3. Create reporting system
4. Add auto-fix capabilities
5. Add pattern detection (v1/v2/v3/v4)

**Deliverables:**
- Configuration validator
- Validation report generator
- Auto-fix for common issues
- Pattern detection

### Phase 5: Migration Tool

1. Implement pattern detection
2. Build migration path planning
3. Create safe update application
4. Add rollback capabilities
5. Handle naming convention updates
6. Preserve customizations

**Deliverables:**
- Migration tool
- Pattern detection
- Migration plans
- Rollback capability

### Phase 6: Template Management

1. Build template browser
2. Implement template update
3. Create template extraction from projects
4. Add version tracking
5. Implement drift detection

**Deliverables:**
- Template browser
- Update mechanism
- Extraction tool
- Version tracking

### Phase 7: Standards Propagation

1. Detect projects using standards
2. Identify update needs
3. Preview changes
4. Selective/batch update
5. Generate reports

**Deliverables:**
- Propagation tool
- Change preview
- Batch update capability
- Update reports

---

## Success Criteria (Revised)

A successful automation system would:

### 1. Reduce Setup Time
- New project initialization: <3 minutes (including prompt selection)
- Configuration validation: <30 seconds
- Template updates: <1 minute per project
- Helper script installation: <30 seconds

### 2. Ensure Consistency
- All projects have required CLAUDE.md sections
- All projects have appropriate prompt files
- Naming conventions followed universally (prj- prefix)
- No format drift between projects
- Standards updates propagate reliably
- Helper scripts universally available

### 3. Maintain Flexibility
- Easy customization of templates
- Project-specific overrides supported
- Multiple project types supported (5 types identified)
- Multiple configuration patterns supported (v1/v2/v3/v4)
- Extension to new project types straightforward
- Extraction of patterns from successful projects

### 4. Provide Reliability
- Validation catches configuration errors
- Migration preserves customizations
- Rollback available for updates
- Clear error messages and recovery paths
- Drift detection between project and templates
- Version tracking for templates

### 5. Support Evolution
- Easy addition of new project types
- Template versioning and updates
- Pattern extraction from projects
- Standards propagation across projects
- Backward compatibility with older patterns

---

## Critical Discoveries

### 1. Configuration Pattern Evolution

**Discovery:** Four distinct configuration patterns (v1/v2/v3/v4) exist in practice

**Implication:** Tool must support multiple patterns and provide migration paths

**Action:** Pattern detection and migration capabilities essential

### 2. Project-Specific Standards Domains

**Discovery:** Different projects need completely different standards:
- UI/UX (gainfunction)
- Documentation framework (marrbox)
- Script doc parity (npm-protect)
- Feature addition process (specverse-lang)

**Implication:** Standards system must support domain-specific extensions

**Action:** Project type system with optional standards modules

### 3. GitHub Helper Scripts Critical

**Discovery:** Helper scripts for GitHub sub-issues referenced across multiple projects

**Implication:** Helper scripts are infrastructure, not optional

**Action:** Helper script management must be part of initialization

### 4. Naming Convention Inconsistency

**Discovery:** Both `prj-` and `prompt-` prefixes in use

**Implication:** Need to standardize and provide migration

**Action:** Standardize on `prj-`, create migration tool

### 5. Simplified Configuration Valid Pattern

**Discovery:** Not all projects need full standards system (early-stage, simple projects)

**Implication:** Tool must support both simplified and comprehensive configurations

**Action:** Multiple CLAUDE.md templates, option to start simple and upgrade later

### 6. CLAUDE.md Serves Multiple Purposes

**Discovery:** Some projects use CLAUDE.md as both AI guide AND developer documentation (specverse-lang)

**Implication:** Templates must support different purposes

**Action:** Multiple template types (basic, standards, dev-guide, status-tracking)

### 7. Documentation Parity Pattern

**Discovery:** npm-protect requires script-level documentation parity with pre-commit checks

**Implication:** Different documentation standards for different project types

**Action:** Project-type-specific documentation standards

---

## Appendix A: Configuration Examples by Project

### Comprehensive Standards (gainfunction/website)

**CLAUDE.md:**
- Layer identification
- Mandatory startup actions
- Mandatory UI/UX design tool
- References: prj-testing-standard.md, prj-ui-ux-standard.md
- Project prompts compliance section

**Prompts:**
- prj-testing-standard.md (523 lines)
- prj-ui-ux-standard.md (8,294 lines)

**Pattern:** v3 - Full standards with domain-specific (UI/UX) extension

---

### Documentation Repository (marrbox/set-up-and-admin)

**CLAUDE.md:**
- Layer identification
- Project type: Documentation repository
- Agent configuration (all agents follow Anthropic standards)
- Standards: Git workflow, Documentation standards
- GitHub sub-issues helper scripts

**Prompts:**
- prompt-git-workflow-standard.md
- prompt-documentation-standard.md (6,411 lines - comprehensive Diataxis)

**Pattern:** v3 - Full standards with domain-specific (documentation) extension

---

### Web Application (sv/specverse-app-portal)

**CLAUDE.md:**
- Layer identification
- Environment variables (Vercel-specific)
- Testing constraints (no watch mode)
- Standards: Git workflow, Testing standards

**Prompts:**
- prompt-git-workflow-standard.md (1,633 lines - with sub-issues)
- prompt-testing-standard.md (449 lines)

**Pattern:** v3 - Full standards with project-specific technical requirements

---

### Language Tool (sv/specverse-lang)

**CLAUDE.md:**
- Extremely comprehensive (12,845 lines)
- Serves as AI guide AND developer documentation
- Project overview with scale validation
- Architecture, development commands, testing
- API usage documentation
- Feature development guide
- Troubleshooting, release process

**Prompts:** None (all embedded in CLAUDE.md)

**Pattern:** v4 - Specialized comprehensive dev guide

---

### Simplified (scoremyclays, scoremyclays-onlook)

**CLAUDE.md:**
- Project overview paragraph
- Commands (if applicable)
- Architecture (to be filled)
- Project structure

**Prompts:** None

**Pattern:** v1 - Simplified project notes

---

### Bash Tooling (npm-protect)

**CLAUDE.md:**
- Extended project notes
- Recent updates & bug fixes
- Architecture
- Technical details
- ⚠️ CRITICAL: Documentation Maintenance section
- File structure
- Development commands
- Integration examples

**Prompts:** None

**Pattern:** v4 - Specialized with documentation parity requirements

---

## Appendix B: Standards File Sizes

**User-Level Prompts:**
- user-git-workflow-standard.md: 2,847 lines
- user-mcp-usage-standard.md: 1,286 lines
- user-testing-standard.md: 851 lines

**Project-Level Prompts:**
- prompt-git-workflow-standard.md (specverse-app-portal): 1,633 lines
- prompt-testing-standard.md (specverse-app-portal): 449 lines
- prj-testing-standard.md (gainfunction): 523 lines
- prj-ui-ux-standard.md (gainfunction): 8,294 lines (extremely comprehensive)
- prompt-documentation-standard.md (marrbox): 6,411 lines

**Observation:** Standards files are substantial, comprehensive documents. Not simple checklists.

---

## Appendix C: Complete File Locations Summary

**User Level:**
- `~/.claude/CLAUDE.md` - User configuration (comprehensive)
- `~/.claude/prompts/` - User-level prompt standards
  - `user-git-workflow-standard.md`
  - `user-mcp-usage-standard.md`
  - `user-testing-standard.md`
- `~/bin/` - Helper scripts (GitHub sub-issues)
  - `gh-add-subissue.sh`
  - `gh-list-subissues.sh`
- `~/projects/PORTS.md` - Port registry (automated port management)

**Project Level (Full Standards Pattern):**
- `./CLAUDE.md` - Project configuration
- `./prompts/` - Project-specific prompts
  - `prj-testing-standard.md` or `prompt-testing-standard.md`
  - `prj-ui-ux-standard.md` (web projects with UI)
  - `prompt-documentation-standard.md` (documentation projects)
  - `prompt-git-workflow-standard.md` (some projects)
- `./docs/` - Technical documentation
- `./plans/` - Implementation plans
- `./research/` - Research reports
- `./tasks/` - Working documents (task-name-GUID)
- `./recap/` - Session recaps
- `./BRANCHING.md` - Quick reference (generated from git workflow)
- `./TESTING.md` - Quick reference (generated from testing standard)

**Proposed Template Repository:**
- `~/.claude/prompt-templates/` - Centralized templates
  - `user/` - User-level templates
  - `project/` - Project-type templates
    - `common/` - Common project prompts
    - `web-nextjs/`, `documentation-mkdocs/`, `language-tooling/`, etc.
  - `claude-md/` - CLAUDE.md templates
  - `metadata/` - Configuration metadata
- `~/.claude/init-config.yaml` - Initialization configuration

---

**End of Updated Functional Specification**
