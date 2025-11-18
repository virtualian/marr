# Phase 1 Implementation Plan: MARR Core System

## Overview

This plan builds the foundational infrastructure for MARR (Making Agents Really Reliable), an AI agent configuration system. Phase 1 focuses on creating the core template repository structure, initialization tooling, helper script management, and validation tools that enable <3 minute project setup with 90%+ migration success rate.

## Objective

Build the core MARR system infrastructure in `~/.marr/` that provides:
- Template repository for user and project configurations
- Initialization tool for new projects
- Helper script management system
- Project CLAUDE.md templates (4 variations)
- Validation tools for configuration compliance
- Migration paths from existing configurations

**Expected Outcome:** Developers can initialize new projects or migrate existing ones to MARR standards in under 3 minutes with consistent, validated configurations.

---

## STEP01: Create ~/.marr/ Directory Structure

**Goal:** Establish the core directory structure and namespace for MARR system

- [ ] Create `~/.marr/` root directory to avoid conflicts with existing `~/.claude/`
- [ ] Create `~/.marr/templates/` for all template files
- [ ] Create `~/.marr/templates/user/` for user-level prompt templates
- [ ] Create `~/.marr/templates/project/` for project-level templates
- [ ] Create `~/.marr/templates/project/common/` for universal project prompts
- [ ] Create `~/.marr/templates/claude-md/` for CLAUDE.md templates
- [ ] Create `~/.marr/templates/helper-scripts/` for GitHub helper scripts
- [ ] Create `~/.marr/bin/` for MARR CLI tools
- [ ] Create `~/.marr/config/` for system configuration files
- [ ] Validate directory structure created successfully and all paths are accessible
- [ ] Draft commit message: "Create ~/.marr/ directory structure and namespace\n\nEstablish core MARR system directories:\n- templates/ for user and project configurations\n- bin/ for CLI tools\n- config/ for system settings\n\nUses ~/.marr/ namespace to avoid conflicts with existing ~/.claude/ installations.\n\nCommit for /phase1-marr-implementation/STEP01"

---

## STEP02: Copy Core Template Files

**Goal:** Populate template repository with user-level and common project-level standards

- [ ] Copy user-git-workflow-standard.md from examples/user-level/prompts to `~/.marr/templates/user/`
- [ ] Copy user-mcp-usage-standard.md from examples/user-level/prompts to `~/.marr/templates/user/`
- [ ] Copy user-testing-standard.md from examples/user-level/prompts to `~/.marr/templates/user/`
- [ ] Copy user-documentation-standard.md from prompts to `~/.marr/templates/user/` (Diataxis/role-first framework)
- [ ] Copy user-standard-for-standards.md from examples/user-level/prompts to `~/.marr/templates/user/`
- [ ] Create prj-git-workflow-standard.md template in `~/.marr/templates/project/common/`
- [ ] Create prj-testing-standard.md template in `~/.marr/templates/project/common/`
- [ ] Create prj-mcp-usage-standard.md template in `~/.marr/templates/project/common/`
- [ ] Create prj-documentation-standard.md template in `~/.marr/templates/project/common/`
- [ ] Quick consistency review: Check naming conventions (user-* vs prj-*), format uniformity, obvious gaps
- [ ] Document any inconsistencies or improvement needs in `research/prompt-rationalization-notes.md` for Phase 2
- [ ] Validate all template files are valid markdown and contain required sections
- [ ] Draft commit message: "Add core user and project template files\n\nPopulate template repository with:\n- User-level standards (git workflow, testing, MCP usage, documentation)\n- Common project-level standards (git, testing, MCP, documentation)\n- Standard-for-standards definition\n\nAll templates use WHAT/WHY imperative format.\nQuick consistency review completed; detailed rationalization deferred to Phase 2.\n\nCommit for /phase1-marr-implementation/STEP02"

---

## STEP03: Create CLAUDE.md Templates

**Goal:** Build four CLAUDE.md templates for different project needs

- [ ] Create `~/.marr/templates/claude-md/basic.md` - Simple project orientation template
- [ ] Create `~/.marr/templates/claude-md/standards.md` - Full standards-based template with prompt references
- [ ] Create `~/.marr/templates/claude-md/dev-guide.md` - Comprehensive development guide template (like specverse-lang)
- [ ] Create `~/.marr/templates/claude-md/status.md` - Status-tracking template (like MCP server projects)
- [ ] Include variable placeholders in templates: {{PROJECT_NAME}}, {{PROJECT_TYPE}}, {{DESCRIPTION}}
- [ ] Add required sections to each template per PRD requirements
- [ ] Add precedence rules and layer identification to all templates
- [ ] Validate templates contain all mandatory sections from PRD
- [ ] Update docs/prd.md if any template requirements discovered during creation
- [ ] Draft commit message: "Create four CLAUDE.md template variations\n\nTemplates:\n- basic.md: Simple project orientation\n- standards.md: Full standards with prompt references\n- dev-guide.md: Comprehensive development guide\n- status.md: Phase-based status tracking\n\nAll include variable substitution and mandatory sections.\n\nCommit for /phase1-marr-implementation/STEP03"

---

## STEP04: Copy and Document Helper Scripts

**Goal:** Make GitHub helper scripts available as part of MARR infrastructure

- [ ] Copy gh-add-subissue.sh from examples to `~/.marr/templates/helper-scripts/`
- [ ] Copy gh-list-subissues.sh from examples to `~/.marr/templates/helper-scripts/`
- [ ] Create `~/.marr/templates/helper-scripts/README.md` documenting each script's purpose and usage
- [ ] Add installation instructions to README for copying scripts to ~/bin/
- [ ] Add requirements section (gh CLI, jq) to README
- [ ] Verify scripts are executable (chmod +x)
- [ ] Test scripts work correctly with GitHub API
- [ ] Validate README documentation is complete and accurate
- [ ] Draft commit message: "Add GitHub helper scripts to MARR templates\n\nInclude:\n- gh-add-subissue.sh: Link sub-issue to parent\n- gh-list-subissues.sh: List all sub-issues\n- README with usage and installation instructions\n\nScripts use GitHub GraphQL API with proper error handling.\n\nCommit for /phase1-marr-implementation/STEP04"

---

## STEP05: Create System Configuration File

**Goal:** Define initialization configuration and naming conventions

- [ ] Create `~/.marr/config/marr-config.yaml` with project type definitions
- [ ] Define naming conventions (user-* prefix, prj-* prefix) in config
- [ ] Define reference syntax (@prompts/, @~/.marr/prompts/) in config
- [ ] Add required sections for user-level CLAUDE.md to config
- [ ] Add required sections for project-level CLAUDE.md to config
- [ ] Add validation rules for configurations to config
- [ ] Document config file format in `~/.marr/config/README.md`
- [ ] Validate config file parses correctly as YAML
- [ ] Draft commit message: "Create MARR system configuration file\n\nDefines:\n- Project type definitions\n- Naming conventions (user-*, prj-*)\n- Reference syntax\n- Required sections for CLAUDE.md files\n- Validation rules\n\nProvides single source of truth for MARR standards.\n\nCommit for /phase1-marr-implementation/STEP05"

---

## STEP06: Build Helper Script Installation Tool

**Goal:** Create tool to install helper scripts to ~/bin/

- [ ] Create `~/.marr/bin/marr-install-scripts` executable bash script
- [ ] Add check for ~/bin/ directory existence, create if needed
- [ ] Add ~/bin/ to PATH instructions if not already in PATH
- [ ] Implement copy of helper scripts from templates to ~/bin/
- [ ] Add verification that scripts are executable after copy
- [ ] Add success/failure reporting with clear messages
- [ ] Test installation on clean system without existing scripts
- [ ] Validate script handles edge cases (existing files, permission errors)
- [ ] Create usage documentation in `~/.marr/bin/README.md`
- [ ] Draft commit message: "Create helper script installation tool\n\nAdd marr-install-scripts to automate:\n- Helper script installation to ~/bin/\n- PATH verification and setup instructions\n- Executable permission setting\n\nIncludes error handling and user feedback.\n\nCommit for /phase1-marr-implementation/STEP06"

---

## STEP07: Build Basic Initialization Tool

**Goal:** Create minimal initialization tool for new projects

- [ ] Create `~/.marr/bin/marr-init` executable bash script
- [ ] Add command-line argument parsing (project-name, project-type)
- [ ] Implement directory structure creation based on project type
- [ ] Implement CLAUDE.md template selection and variable substitution
- [ ] Implement copying of standard prompt files to ./prompts/
- [ ] Add basic validation of generated configuration
- [ ] Add success reporting with next steps instructions
- [ ] Test initialization creates valid project structure
- [ ] Validate all generated files are properly formatted
- [ ] Create usage documentation in `~/.marr/bin/README.md`
- [ ] Draft commit message: "Create basic project initialization tool\n\nAdd marr-init supporting:\n- Project directory structure creation\n- CLAUDE.md template instantiation\n- Prompt file copying\n- Basic validation\n\nEnables <3 minute new project setup.\n\nCommit for /phase1-marr-implementation/STEP07"

---

## STEP08: Build Configuration Validation Tool

**Goal:** Create tool to validate existing MARR configurations

- [ ] Create `~/.marr/bin/marr-validate` executable bash script
- [ ] Implement check for project CLAUDE.md existence
- [ ] Implement check for required sections in CLAUDE.md
- [ ] Implement check for referenced prompt files existence
- [ ] Implement naming convention validation (prj-* prefix)
- [ ] Implement directory structure validation
- [ ] Add detailed error reporting with line numbers and suggestions
- [ ] Add warning vs error classification
- [ ] Test validation on example projects (comprehensive and simplified)
- [ ] Validate tool correctly identifies compliance and violations
- [ ] Update `~/.marr/bin/README.md` with validation tool usage
- [ ] Draft commit message: "Create configuration validation tool\n\nAdd marr-validate checking:\n- Required CLAUDE.md sections\n- Prompt file references\n- Naming conventions\n- Directory structure\n\nProvides detailed error reports and remediation suggestions.\n\nCommit for /phase1-marr-implementation/STEP08"

---

## STEP09: Add Template Registry and Metadata

**Goal:** Create metadata system for tracking templates and versions

- [ ] Create `~/.marr/config/template-registry.yaml` listing all available templates
- [ ] Add template metadata (name, description, use cases) to registry
- [ ] Add template variable definitions to registry
- [ ] Add template dependencies (required prompt files) to registry
- [ ] Document template registry format in `~/.marr/config/README.md`
- [ ] Validate registry is valid YAML and complete
- [ ] Update marr-init to read from template registry
- [ ] Test template selection using registry
- [ ] Draft commit message: "Add template registry and metadata system\n\nCreate template-registry.yaml with:\n- Template catalog (CLAUDE.md, prompts)\n- Metadata and use cases\n- Variable definitions\n- Dependency tracking\n\nEnables dynamic template discovery and validation.\n\nCommit for /phase1-marr-implementation/STEP09"

---

## STEP10: Integration Testing and Documentation

**Goal:** Verify complete Phase 1 system works end-to-end

- [ ] Test complete workflow: marr-install-scripts → marr-init → marr-validate
- [ ] Verify initialization time is <3 minutes for new project
- [ ] Test initialization with each CLAUDE.md template type
- [ ] Test validation catches common configuration errors
- [ ] Verify helper scripts work after installation
- [ ] Update main README.md with Phase 1 capabilities
- [ ] Create `~/.marr/README.md` with system overview and quick start
- [ ] Document known limitations and Phase 2 roadmap
- [ ] Verify all documentation is accurate and complete
- [ ] Draft commit message: "Complete Phase 1: Core MARR system integration\n\nPhase 1 deliverables:\n- ~/.marr/ template repository\n- Helper script management\n- Project initialization tool (marr-init)\n- Configuration validation (marr-validate)\n- Four CLAUDE.md templates\n\nAchieves <3 min project setup with validation.\n\nCommit for /phase1-marr-implementation/STEP10"

---

## Success Criteria Checklist

After completing all steps, verify Phase 1 meets PRD requirements:

**Core Requirements (CR1-CR7):**
- [ ] CR1: Two-layer configuration model implemented (~/.marr/ + ./CLAUDE.md)
- [ ] CR2: Standard prompt files available (git, testing, MCP)
- [ ] CR3: Claude Code first, markdown format
- [ ] CR4: All configs in Git (no file versioning)
- [ ] CR5: Template system operational (4 CLAUDE.md types)
- [ ] CR6: Naming conventions enforced (user-*, prj-*)
- [ ] CR7: Helper scripts managed and installable

**Success Metrics:**
- [ ] Initialization time: <3 minutes (CR from PRD)
- [ ] Template compliance: 100% (all templates valid)
- [ ] Naming compliance: 100% (prj-* enforced)
- [ ] Validation accuracy: Catches common errors

**Phase 1 Deliverables:**
- [ ] Core template repository operational
- [ ] Initialization tool functional
- [ ] Helper script management working
- [ ] Validation tool detecting issues
- [ ] Documentation complete

---

## Notes and Assumptions

**[ASSUMPTION: User has ~/.claude/ already configured]** - MARR uses ~/.marr/ to avoid conflicts, but assumes user may have existing ~/.claude/ that should remain untouched.

**[ASSUMPTION: User has gh CLI installed]** - Helper scripts require GitHub CLI and jq. Installation tool should check for these dependencies.

**[ASSUMPTION: Projects use Git]** - All MARR projects assumed to be Git repositories as per PRD CR4.

**Repository Location:** This plan creates infrastructure in ~/.marr/ but does NOT modify the repo-setup project itself (that's for Phase 2).

**Migration Note:** Phase 1 creates NEW project initialization; migrating EXISTING projects to MARR is Phase 2 scope.
