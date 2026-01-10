---
marr: standard
version: 1
title: Development Workflow Standard
scope: All development work involving issues, tasks, and release processes

triggers:
  - WHEN starting any task or implementation work
  - WHEN asked to investigate, look at, check, debug, or troubleshoot something
  - WHEN a user references an issue number or asks to work on a specific issue
  - WHEN implementing, building, adding, changing, or modifying functionality
  - WHEN creating or managing issues
  - WHEN preparing a release
  - WHEN responding to a production incident
---

# Development Workflow Standard

> **AI Agent Instructions**: This document defines the development process. Follow these rules for all implementation work.

---

## Core Rules (NEVER VIOLATE)

1. **Verify issue exists BEFORE any action** because working without tracking causes chaos
2. **NEVER start implementation without an issue number** because all work must be traceable
3. **Create branch BEFORE investigation** because even exploration should be tracked
4. **Update documentation when code changes** because outdated docs mislead users

---

## STOP-GATE: Branch Verification (MANDATORY)

**THIS SECTION IS A HARD GATE. COMPLETE THESE STEPS BEFORE ANY OTHER ACTION.**

When this standard is triggered, IMMEDIATELY verify branch status:

1. **Check current branch** — Determine which branch you are on
2. **If on main**: STOP. Create a feature branch BEFORE proceeding with any other action
3. **If on a feature branch**: Verify the branch name corresponds to the issue being worked on

**When on main and asked to investigate, fix, or work on something:**
- DO NOT read code files
- DO NOT run searches
- DO NOT explore the codebase
- DO NOT make any changes
- FIRST create the appropriate feature branch, THEN proceed

**Rationale:** Even "just looking" or "quick investigation" creates context that leads to changes. Branch first ensures all work—including exploration—is properly tracked and isolated.

**No exceptions. No "quick looks". Branch first, always.**

---

## Process-First Mandate

**CRITICAL FOR AI AGENTS**: Perceived urgency does NOT bypass process.

**Before ANY Investigation or Code Changes:**
1. Verify issue exists in GitHub
2. Confirm issue has proper description
3. Check for existing branch
4. Create branch BEFORE investigation

**When User Requests Implementation Without Issue Numbers:**
DO NOT start implementation. Ask for issue numbers first.

---

## Issue Types

| Type | Definition | Scope |
|:-----|:-----------|:------|
| **Bug** | Observed behaviour differs from expected/documented behaviour | Any size fix |
| **Feature** | Medium/large deliverable broken down into Stories | Multi-story work |
| **Story** | Small deliverable completable in <3 days | Single PR |
| **Task** | Bounded activity with clear completion criteria | Non-feature work |

---

## Work Initiation Checklist

Before starting any work:

- [ ] Issue exists with clear description
- [ ] Issue has appropriate type label
- [ ] No existing branch for this issue
- [ ] You understand the acceptance criteria
- [ ] You have created a feature branch (see Version Control Standard)

---

## Release Management

**When to Release:**
- **Patch** (0.0.X) — Bug fixes, no new functionality
- **Minor** (0.X.0) — New features, backwards compatible
- **Major** (X.0.0) — Breaking changes or significant new functionality 

**Release Checklist:**
1. All PRs for release are merged to main
2. All tests passing
3. Changelog/release notes prepared (if applicable)

**Creating the Release:**
See Version Control Standard for tagging process and mechanics.

---

## Hotfix Workflow

Hotfixes are emergency fixes for production issues.

**Process:**
1. Verify issue exists (create if needed with `hotfix` label)
2. Branch from production tag, NOT main (see Version Control Standard for branching rules)
3. Make minimal fix only
4. Create urgent PR to main
5. After merge, release immediately

**Hotfix Rules:**
- Minimal changes only — fix the issue, nothing else
- Skip normal review timeline if critical
- Document the incident after resolution

---

## Anti-Patterns (FORBIDDEN)

- **Working without an issue** — All work must be tracked
- **Investigating on main** — Even "just looking" must happen on a feature branch
- **Starting code before branching** — Branch first, then investigate
- **Bypassing process for "quick fixes"** — Process applies to all changes
- **Combining unrelated work** — One issue per branch (unless explicitly instructed)
- **Releasing without clean main** — All changes must be merged first
- **Leaving docs outdated** — Documentation must reflect current code

---

**This standard ensures traceable, accountable development practices.**
