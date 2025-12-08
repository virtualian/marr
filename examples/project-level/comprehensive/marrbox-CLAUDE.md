# Project CLAUDE.md - MarrBox Documentation
<!-- Standard Claude Code 2-layer system -->

## How This Works
This is the **project-level** configuration (Layer 2 of 2):
- **User file**: `~/.claude/CLAUDE.md` - Developer's personal preferences & defaults
- **This file**: `./CLAUDE.md` (project root) - Project-specific requirements

**Priority**: This file overrides user's technical defaults but respects their personal preferences.

**IMPORTANT IMPERATIVES FOR CLAUDE CODE:**
1. **At startup**, report: "Using 2-layer CLAUDE.md: User + project configs"
2. **If user CLAUDE.md is missing**, suggest: "No user config found. Create ~/.claude/CLAUDE.md for personal preferences?"
3. **If this file seems outdated** (missing deps, wrong versions), suggest updates
4. **Check for conflicts** between user and project configs and report them
5. **Never silently fail** - always communicate configuration issues

## Project Type
This is a **documentation repository** for MarrBox Services, containing:
- Setup guides and configuration documentation
- Research and analysis reports
- Implementation plans
- AI Agent prompt standards
- Archived technical documentation

## Project-Specific Reminders
- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary for achieving the goal
- ALWAYS prefer editing existing files to creating new ones
- Documentation creation IS the purpose of this repository - create docs when explicitly requested

## MANDATORY User Approval (CRITICAL)
- **ALWAYS get explicit user approval before ANY git commits**
- **ALWAYS get explicit user approval before ANY git pushes**
- **ALWAYS get explicit user approval before ANY PR creation or updates**
- **Show user exactly what will be committed/pushed before taking action**
- **Never assume approval - wait for explicit "yes" or confirmation**

## GitHub Auto-Linking Prevention (CRITICAL)
- **NEVER use `#number` pattern in PR descriptions** - GitHub auto-links `#1`, `#2`, `#3` etc. as issue references
- **Use alternative phrasing** to avoid false issue links:
  - ❌ WRONG: "Core Rule #1", "Rule #3", "Step #2"
  - ✅ CORRECT: "Core Rule 1", "Rule number 3", "Step 2", "First rule", "Third rule"
- **Applies to**: PR descriptions, commit messages, documentation, comments
- **Why**: `#1` in text creates incorrect link to issue #1, confusing reviewers and breaking PR context

## Documentation Organization
This repository follows a structured organization pattern:
- **`docs/`** - Published documentation, guides, and setup instructions
- **`research/`** - Research reports and analysis
- **`plans/`** - Implementation plans for future work
- **`prompts/`** - AI Agent prompt standards and directives
- **`archive/`** - Historical documentation and deprecated guides
- **`futures/`** - Future planning and roadmaps
- **Root level** - Quick reference files (README.md, BRANCHING.md) and configuration

## Agent Configuration (MANDATORY)

**Primary Agent Sources:**
- Claude and Claude Code are the primary sources for all Agents working in this repository
- All Agents (including Cursor and others) must follow the Anthropic Agent configuration defined in this repo's CLAUDE.md

**Agent Requirements:**
- All Agents must adhere to the standards and workflows defined in this repository
- Agent behavior must be consistent with the Git Workflow standards
- Any Agent working in this repository must respect the project-specific configuration

## Standards (MANDATORY)

**Git Workflow:**
@prompts/prompt-git-workflow-standard.md

All work in this repository must follow the Git Workflow standards defined in the prompts directory.

Quick reference: [BRANCHING.md](./BRANCHING.md)

**Documentation Standards:**
@prompts/prompt-documentation-standard.md

All documentation must follow the Diataxis framework and standards defined in the documentation standard prompt.

## What This Project Expects
Claude Code should:
1. **Check for developer's `~/.claude/CLAUDE.md`** for personal preferences
2. **Respect personal preferences** like communication style, work habits
3. **Override only technical defaults** with this project's specific requirements
4. **Follow this project's conventions** for consistency across all contributors
5. **ALWAYS follow the Git Workflow Standards above** - this is non-negotiable
6. **Understand this is a documentation repository** - creating documentation when requested is core to this project's purpose

---
*Note: This project configuration overrides technical defaults from ~/.claude/CLAUDE.md while preserving personal preferences*