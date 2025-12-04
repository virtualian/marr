---
marr: standard
version: 1
title: Workflow Standard
scope: All development work involving git, branches, commits, and pull requests

triggers:
  - WHEN starting any feature, task, or implementation work
  - WHEN working with git branches, commits, or pull requests
  - WHEN making changes while on the main branch
  - WHEN preparing code for review or merge
---

# Workflow Standard

> **AI Agent Instructions**: This document defines the development workflow. Follow these rules for all implementation work.
>
> **Scope**: All development work involving git, branches, commits, and pull requests
>
> **Rationale**: Consistent workflow ensures traceability, prevents errors, and enables collaboration.

---

## Triggers

**You MUST follow this standard when:**
- Starting any feature, task, or implementation work
- Performing git operations (branching, committing, pushing)
- Creating or updating pull requests
- Working on the main branch

---

## Core Rules (NEVER VIOLATE)

1. **Verify issue exists BEFORE any action** because working without tracking causes chaos
2. **Delete merged branches** because clean repos prevent confusion
3. **Always squash merge** because linear history is easier to understand and debug
4. **Branch from main only** (except hotfixes from production tags) because branching from branches creates complexity
5. **Maximum 5-day branch lifetime** because short-lived branches reduce merge conflicts
6. **Use issue-based branch naming** because traceability matters

---

## Branch Naming Convention

**Standard Format**: `<issue-number>-<descriptive-name>`

**Examples:**
- `42-user-profile-view` (feature work)
- `67-fix-login-timeout` (bug fix)
- `89-update-dependencies` (maintenance task)

**Exception - Hotfixes**: `hotfix/<issue-number>-<description>`

---

## Development Workflow

**Starting Work:**
1. Start from current main branch
2. Pull latest changes
3. Create issue-based branch
4. Develop incrementally with meaningful commits
5. Push to remote with upstream tracking
6. Create draft PR immediately for CI checks
7. When ready, mark PR ready for review

---

## Commit Standards

**Format**: Clean, descriptive subject line (50 chars max) with optional body

**Rules:**
- NO issue numbers in commit messages — branch names provide traceability
- Use imperative mood ("Add feature" not "Added feature")
- Explain WHAT and WHY, not HOW

---

## PR Requirements

**Technical Requirements:**
- All CI checks must pass
- No merge conflicts with main
- Squash merge strategy enforced

**Quality Gates:**
- Tests pass (if applicable)
- Documentation updated (if applicable)
- Squash merge only

---

## Anti-Patterns (FORBIDDEN)

- **Working without an issue** — All work must be tracked
- **Long-lived branches** — Merge or close within 5 days
- **Merge commits** — Always squash merge
- **Branching from branches** — Branch from main only
- **Skipping CI checks** — All checks must pass before merge
- **Force pushing to shared branches** — Coordinate with collaborators first

---

**This workflow standard ensures traceable, clean, and maintainable development practices.**
