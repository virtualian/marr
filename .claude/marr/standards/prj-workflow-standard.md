# Workflow Standard

> **AI Agent Instructions**: This document defines the development workflow for this project. Git and GitHub are the tools, but the standard governs how all implementation work proceeds.
>
> **Scope**: Project-level standard (applies to this project only)
>
> **Rationale**: Consistent workflow ensures traceability, prevents errors, and enables collaboration.

---

## Core Rules (NEVER VIOLATE)

1. **Verify issue exists BEFORE any action** because working without tracking causes chaos
2. **Delete merged branches** because clean repos prevent confusion (industry standard)
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

## Standard Development Workflow

**Starting Work:**
```bash
# 1. Start from current main
git checkout main && git pull

# 2. Create issue-based branch
git checkout -b 42-bootstrap-configuration

# 3. Develop incrementally
git add . && git commit -m "Add project CLAUDE.md and prompts"
git push -u origin 42-bootstrap-configuration

# 4. Create draft PR immediately for CI checks
# 5. When ready: mark PR ready for review
```

---

## Commit Standards

**Format**: Clean, descriptive subject line (50 chars) with optional body

**NO issue numbers in commit messages** - Branch names provide traceability

**Examples:**
```bash
git commit -m "Add project bootstrap configuration"
git commit -m "Create functional specification document"
```

---

## PR Requirements

**Technical Requirements:**
- All CI checks must pass
- No merge conflicts with main
- Squash merge strategy enforced

**Quality Gates:**
- [ ] Tests pass (if applicable)
- [ ] Documentation updated
- [ ] Squash merge only

---

## This Project Specifics

- **Repository**: virtualian/repo-setup
- **Main branch**: main
- **Merge strategy**: Squash only
- **Branch cleanup**: Automatic after merge

---

**This workflow standard ensures traceable, clean, and maintainable development practices.**
