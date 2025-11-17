# Claude Code Project Configuration System
## Functional Specification - Updated Analysis

**Version:** 2.0  
**Date:** 2025-11-15  
**Author:** Comprehensive analysis of all projects under /Users/ianmarr/projects/

---

## Executive Summary

Analysis of 9 active projects reveals significant evolution and variation in Claude Code configuration patterns. While the two-layer system (user + project) remains consistent, implementation details vary considerably. Several projects use simplified CLAUDE.md files without the comprehensive standards system, while others have fully adopted the prompt-based architecture.

### Key Findings

1. **Configuration Consistency**: Only 4 of 9 projects use comprehensive CLAUDE.md with referenced prompts
2. **Pattern Variations**: Three distinct configuration patterns identified
3. **Standards Evolution**: Evidence of standards migration from older to newer formats
4. **Missing Standardization**: Several projects use minimal or outdated configurations

---

## Project Configuration Patterns Identified

### Pattern 1: Comprehensive Standards-Based (4 projects)

**Projects:**
- gainfunction/website
- marrbox/set-up-and-admin
- sv/specverse-app-portal
- sv/specverse-lang (parent level)

**Characteristics:**
- Full two-layer CLAUDE.md system
- References prompts with `@prompts/filename.md` syntax
- Mandatory startup actions specified
- Project-specific prompt files in `./prompts/`
- Clear precedence rules (project overrides user technical, preserves preferences)

**Example Structure:**
```
project-root/
├── CLAUDE.md                          # References @prompts/prj-*.md
├── prompts/
│   ├── prompt-git-workflow-standard.md   # or prj-git-workflow-standard.md
│   ├── prompt-testing-standard.md         # or prj-testing-standard.md
│   └── prj-ui-ux-standard.md              # Project-specific
└── docs/                                  # Generated documentation
```

---

### Pattern 2: Simplified Project-Specific (3 projects)

**Projects:**
- npm-protect
- scoremyclays
- scoremyclays-onlook

**Characteristics:**
- Basic CLAUDE.md with project overview only
- No referenced prompt files
- No mandatory startup actions
- Focused on project documentation structure
- Minimal AI agent directives

**Example Structure:**
```
project-root/
├── CLAUDE.md                          # Simple project overview
├── docs/                              # Documentation
├── research/                          # Research reports
└── src/                               # Source code
```

**CLAUDE.md Content:**
- Project overview paragraph
- File structure documentation
- Command references (if applicable)
- Architecture notes (to be filled in)

---

### Pattern 3: Template/Default Configuration (2 projects)

**Projects:**
- sv/specverse-lang/templates/default
- sv/specverse-lang/ai-support-mcp-clean-impl

**Characteristics:**
- Template-based CLAUDE.md with placeholders
- References comprehensive AI-GUIDE.md
- Claude Code specific feature documentation
- Integration with specialized workflows (MCP servers, SpecVerse)

**Example Structure:**
```
project-root/
├── CLAUDE.md                          # Template with {{projectName}}
├── AI-GUIDE.md                        # Comprehensive tool guide
└── docs/                              # Generated or deployment docs
```

---

## User-Level Configuration Analysis

### Current User-Level Setup

**Location:** `~/.claude/`

**Files Present:**
```
~/.claude/
├── CLAUDE.md                          # User-level master configuration
└── prompts/
    ├── user-git-workflow-standard.md
    ├── user-mcp-usage-standard.md
    └── user-testing-standard.md
```

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

## Project Type Classification Enhancement

### Identified Project Types

1. **Web Development (React/Next.js)**
   - gainfunction/website
   - scoremyclays
   - scoremyclays-onlook
   - sv/specverse-app-portal
   
   **Required Standards:**
   - Git workflow
   - Testing (Vitest + Playwright)
   - UI/UX (if user-facing)
   - MCP usage (if using Claude-assisted development)

2. **Documentation Repository (MkDocs/Docusaurus)**
   - marrbox/set-up-and-admin
   
   **Required Standards:**
   - Git workflow
   - Documentation standards (Diataxis framework)

3. **Language/Tool Development (TypeScript/Node)**
   - sv/specverse-lang
   - sv/specverse-lang/ai-support-mcp-clean-impl
   
   **Required Standards:**
   - Git workflow
   - Testing (comprehensive, 5-tier)
   - API documentation
   - Feature addition process

4. **CLI/Tooling (Bash/Node.js)**
   - npm-protect
   
   **Required Standards:**
   - Git workflow
   - Script-level documentation parity
   - Testing (if applicable)

5. **MCP Server Implementation**
   - sv/specverse-lang/ai-support-mcp-clean-impl
   
   **Required Standards:**
   - Git workflow
   - Testing
   - Multi-environment deployment
   - Integration documentation

### Project Type Metadata Structure

```yaml
project-types:
  web-nextjs:
    name: "Next.js Web Application"
    required_prompts:
      - user-git-workflow-standard
      - user-testing-standard
      - user-mcp-usage-standard
      - prj-testing-standard
    optional_prompts:
      - prj-ui-ux-standard (if user-facing)
    directory_structure:
      - docs/
      - plans/
      - research/
      - prompts/
    technology_stack:
      - Next.js 14+
      - TypeScript
      - Vitest
      - Playwright
  
  documentation-mkdocs:
    name: "MkDocs Documentation Site"
    required_prompts:
      - user-git-workflow-standard
      - prompt-documentation-standard
    directory_structure:
      - docs/
      - prompts/
    technology_stack:
      - MkDocs
      - Material theme
      - Diataxis framework
  
  language-tooling:
    name: "Language/Tool Development"
    required_prompts:
      - user-git-workflow-standard
      - user-testing-standard
    directory_structure:
      - docs/
      - examples/
      - prompts/
      - src/
      - tests/
    technology_stack:
      - TypeScript
      - Node.js
      - Vitest (or similar)
  
  bash-tooling:
    name: "Bash/Node.js CLI Tooling"
    required_prompts:
      - user-git-workflow-standard
    directory_structure:
      - docs/ (with script-level parity)
      - scripts/
    special_requirements:
      - Script documentation parity
      - Pre-commit documentation check
  
  mcp-server:
    name: "MCP Server Implementation"
    required_prompts:
      - user-git-workflow-standard
      - user-testing-standard
    directory_structure:
      - docs/
      - src/
      - tests/
      - dist/ (build outputs)
    special_requirements:
      - Multi-environment build
      - Integration examples
```

---

## GitHub Helper Scripts Discovery

**Location:** `~/bin/` (in user's PATH)

**Scripts:**
- `gh-add-subissue.sh <parent-issue-number> <sub-issue-number>`
- `gh-list-subissues.sh <parent-issue-number>`

**Purpose:** GitHub sub-issues management until native gh CLI support

**Usage Pattern:**
```bash
# Link issue #47 as sub-issue of #45
gh-add-subissue.sh 45 47

# List all sub-issues of #45
gh-list-subissues.sh 45
```

**Referenced in:**
- User-level CLAUDE.md
- User-level user-git-workflow-standard.md
- Project-level prompt-git-workflow-standard.md (specverse-app-portal)

**Implementation Detail:** Uses GitHub GraphQL API with proper error handling

**Deprecation Plan:** When GitHub CLI adds native sub-issue support, deprecate these scripts

**Discovery:** This is a cross-project utility that should be documented in user-level standards and available via initialization

---

## Standards Evolution Tracking

### V1: Simplified Project Notes

**Examples:** npm-protect, scoremyclays, scoremyclays-onlook

**Characteristics:**
- Basic CLAUDE.md with project overview
- No referenced prompts
- File structure documentation
- Command references

**Purpose:** Project orientation for AI agents, not comprehensive standards

### V2: Two-Layer with Partial Standards

**Examples:** sv/specverse-app-portal (earlier state)

**Characteristics:**
- Two-layer CLAUDE.md system established
- References some prompts
- Startup imperatives present
- Incomplete prompt coverage

**Purpose:** Transition to comprehensive standards system

### V3: Full Standards-Based System

**Examples:** gainfunction/website, marrbox/set-up-and-admin, sv/specverse-app-portal (current)

**Characteristics:**
- Complete two-layer system
- Comprehensive prompt references
- Project-specific prompt files
- Mandatory sections all present
- Clear precedence rules

**Purpose:** Complete AI agent directive system with project-specific standards

### V4: Specialized Standards (Emerging)

**Examples:** sv/specverse-lang (comprehensive dev guide), npm-protect (doc parity)

**Characteristics:**
- CLAUDE.md serves multiple purposes (AI guide + dev docs)
- Project-specific standards (script doc parity, feature addition process)
- Extended sections for complex projects
- Integration of project workflows

**Purpose:** Project-specific adaptation of standards system

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
