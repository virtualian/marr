# Git Workflow Standard

> **AI Agent Instructions**: This document defines how to work with Git and GitHub. Follow these rules exactly for all code changes, regardless of size or complexity.
>
> **Scope**: User-level standard (applies across all projects)
>
> **Rationale**: Consistent git workflow prevents errors, maintains code quality, and enables team collaboration.

---

## Core Rules (NEVER VIOLATE)

1. **Verify issue exists BEFORE any action** because working without tracking causes chaos
2. **Delete merged branches** because clean repos prevent confusion (industry standard)
3. **Always squash merge** because linear history is easier to understand and debug
4. **Branch from main only** (except hotfixes from production tags) because branching from branches creates complexity
5. **Maximum 5-day branch lifetime** because short-lived branches reduce merge conflicts
6. **Use issue-based branch naming** because traceability matters

---

## Process-First Mandate (EVEN IN EMERGENCIES)

**CRITICAL FOR AI AGENTS**: Perceived urgency does NOT bypass process.

### Before ANY Investigation or Code Changes

**ALWAYS perform these verification steps FIRST**, regardless of urgency language:

1. **Verify issue exists** - Check that the referenced issue number actually exists
2. **Confirm issue has proper description** - Issue must clearly describe the problem
3. **Verify you're assigned or authorized** - Don't assume you should work on any issue
4. **Check for existing branch** - Another developer may already be working on it
5. **Create branch BEFORE investigation** - All code exploration must happen in issue-specific branch (NEVER investigate on main)

**Rationale:** Process prevents duplicate work, maintains traceability, and builds correct habits that scale.

---

### When User Says "I created issue #XX"

**DO NOT assume - verify:**
```bash
# Verify issue exists (example with gh CLI)
gh issue view 91

# Check if issue is already assigned
gh issue view 91 --json assignees
```

---

### Urgency Response Pattern

**CORRECT Response:**
```
User: "Production is down! Fix issue #91 authentication bug!"

AI Agent:
"Let me verify issue #91 exists first..."
[Checks: gh issue view 91]
[IF exists] "Confirmed. Creating hotfix branch..."
[Creates branch: git checkout -b hotfix/91-auth-bug]
[THEN investigates in branch]
[IF doesn't exist] "Issue #91 doesn't exist yet. Should I create it first?"
```

**WRONG Response:**
```
"Let me investigate the authentication bug..."
[Uses Read/Grep/Bash to investigate code WITHOUT creating branch first]
[Starts code investigation without verification OR branch]
```

**Why This Matters:**
- Prevents work on non-existent issues
- Avoids duplicate work (issue may be assigned to someone else)
- Maintains traceability even under pressure
- **Ensures ALL development work is tracked**, not just urgent fixes

---

### When User Requests Implementation Without Issue Numbers

**DO NOT start implementation - ask for issue numbers:**

**CORRECT Response:**
```
User: "I'm working on the user profile system. I need to implement photo upload."

AI Agent:
"Before I can help with implementation, I need to verify your workflow setup:

1. Do you have a GitHub issue for this work? What's the issue number?
2. Is this related to a larger feature or independent work?

According to the Process-First Mandate, all development work must be tracked.
Please provide the issue number(s), or should I help you create the issues first?"
```

**WRONG Response:**
```
"Let me check the current codebase..."
[Uses Bash, Read, or Grep to investigate code WITHOUT issue/branch]
[Starts researching implementation details before having issue number]
```

---

## Branch Naming & Workflow

### Branch Naming Convention

**Standard Format**: `<issue-number>-<descriptive-name>`

**Examples:**
- `42-user-profile-view` (feature work)
- `67-fix-login-timeout` (bug fix)
- `89-update-dependencies` (maintenance task)

**Exception - Hotfixes**: `hotfix/<issue-number>-<description>`
- `hotfix/156-security-patch` (critical production issues)

**Rationale:** Issue numbers provide traceability, descriptive names provide context.

---

### Standard Development Workflow

**Starting Work:**
```bash
# 1. Start from current main
git checkout main && git pull

# 2. Create issue-based branch
git checkout -b 42-user-profile-view

# 3. Develop incrementally
git add . && git commit -m "Add user profile view component"
git push -u origin 42-user-profile-view

# 4. Create draft PR immediately for CI checks
# 5. When ready: mark PR ready for review
```

**Rationale:** Draft PRs enable early CI feedback and visibility.

---

### Hotfix Workflow

**Even for critical production issues**, follow this sequence:

1. ✓ Verify issue exists (`gh issue view <number>`)
2. ✓ Confirm issue describes production impact
3. ✓ Identify production tag to branch from
4. ✓ Create hotfix branch with proper naming
5. ✓ Investigate and fix
6. ✓ Create urgent PR

**Then proceed:**
```bash
# 1. Verify issue exists FIRST
gh issue view 156

# 2. Branch from production tag, NOT main
git checkout v1.2.2  # Current production
git checkout -b hotfix/156-security-patch

# 3. Make minimal fix
git add . && git commit -m "Fix authentication bypass"

# 4. Push and create urgent PR
git push -u origin hotfix/156-security-patch
```

**Rationale:** Hotfixes from production tags ensure fix applies to what's actually deployed.

---

## Branch Lifetime Management

### Maximum Lifetimes

- **Standard work:** 5 days maximum
- **Bug fixes:** 2 days ideal
- **Hotfixes:** Hours (emergency response)

**If work cannot complete within limits:**
1. **Break down the work** into smaller chunks (preferred)
2. **Merge partial work** with feature flags if appropriate
3. **Create new branch** with new issue number if needed
4. **Document why** limits were exceeded (retrospective learning)

**Rationale:** Short-lived branches prevent merge conflicts and reduce integration risk.

---

## Branch Cleanup

**Industry Standard**: Delete branches immediately after successful merge to main.

**Why delete branches:**
- Keeps repository clean and navigable
- Reduces cognitive overhead
- Git history preserves all work permanently
- Tags mark important milestones when needed

**Automation Options:**
- Enable "Automatically delete head branches" in GitHub repository settings (FREE)
- Use git hooks for local cleanup
- Run manual cleanup scripts periodically

**Manual Cleanup:**
```bash
# Delete local branch
git branch -d 42-user-profile-view

# Delete remote branch (if auto-delete not enabled)
git push origin --delete 42-user-profile-view
```

**Rationale:** Clean repos are easier to navigate and understand.

---

## Commit & PR Standards

### Commit Messages

**Format**: Clean, descriptive subject line (50 chars) with optional body

**Examples:**
```bash
git commit -m "Add user profile view component"
git commit -m "Fix timeout handling in authentication"
git commit -m "Update dependencies for security patches"

# With detailed body if needed
git commit -m "Add profile caching for performance" \
  -m "Implements Redis caching layer to reduce database queries by 60%.
  Cache invalidation on profile updates."
```

**Issue Number Policy:**
- **NO issue numbers in commit messages** - Branch names already contain issue numbers
- GitHub automatically links commits to issues via branch name
- Cleaner git history without redundant metadata
- Follows Conventional Commits specification

**Anti-Pattern:**
```bash
# ❌ DON'T include issue numbers
git commit -m "Add profile view (#45)"
git commit -m "[#45] Add profile view"
git commit -m "fix: profile view (closes #45)"
```

**Rationale:** Branch names provide traceability; commit messages focus on WHAT and WHY.

---

### PR Requirements

**Technical Requirements:**
- All CI checks must pass
- At least one approval from code owner (if team workflow)
- No merge conflicts with main
- Squash merge strategy enforced

**Quality Gates:**
- [ ] Tests pass
- [ ] Linting passes
- [ ] Security scan passes (if configured)
- [ ] Code review approval (if team workflow)
- [ ] Squash merge only

**Rationale:** Quality gates prevent broken code from reaching main.

---

## Anti-Patterns (FORBIDDEN)

❌ **Direct commits to main** - Use PRs only for code review and CI

❌ **Branches living >5 days** - Break down work into smaller chunks

❌ **Merge commits to main** - Breaks linear history, use squash merge

❌ **Hotfix from main** - Use production tags to ensure fix applies to deployed code

❌ **Generic branch names** - `42-updates` says nothing, use `42-user-profile-view`

❌ **Issue numbers in commit messages** - Let Git auto-link via branch names

❌ **Keeping merged branches** - Delete after merge (industry standard)

❌ **Starting work without issue number** - All work must be tracked

---

## AI Agent Specific Instructions

When working with Git and GitHub:

### Process-First Rules (MANDATORY)

1. **ALWAYS verify issue exists FIRST** - Use `gh issue view <number>` before any action
2. **NEVER skip verification due to urgency** - "Production down" does NOT bypass process
3. **NEVER start implementation without issue number** - Ask for issue number if not provided
4. **CREATE branch BEFORE investigation** - Never use Bash, Read, Grep, or any code exploration tools before creating an issue-specific branch
5. **Respond with process, not action** - When asked "what would you do?", describe the verification steps first

### Branch Management

6. **Always check issue number** before creating branches
7. **Use exact naming format**: `<issue-number>-<description>`
8. **Never use feature/ or fix/ prefixes** (except hotfix/ for emergencies)
9. **Keep branches under 5 days** - break down larger work

### Commit and PR

10. **NO issue numbers in commit messages** - Branch name provides traceability
11. **Follow squash merge strategy** always
12. **Delete branches after merge** - follow industry standard

---

## Integration with Project Standards

**This user-level git workflow works with project-specific standards:**

Project-level prompts may define:
- Issue type taxonomies (Bug/Feature/Story/Task)
- Release management processes
- Project-specific testing requirements
- Team-specific PR review processes

**User-level standards (this file) define HOW you work.**
**Project-level standards define WHAT the project requires.**

When project standards conflict with user standards, project takes precedence for that specific project.

---

## Summary: Quick Reference

### Before Starting Work
1. ✓ Verify issue exists (`gh issue view <number>`)
2. ✓ Create issue-based branch (`<number>-<description>`)
3. ✓ Work in branch, commit incrementally
4. ✓ Create draft PR for early feedback
5. ✓ Mark PR ready when complete

### After Work Complete
1. ✓ All CI checks pass
2. ✓ Code review approved (if team workflow)
3. ✓ Squash merge to main
4. ✓ Delete merged branch
5. ✓ Close related issue

### Emergency Hotfix
1. ✓ Verify issue exists
2. ✓ Branch from production tag (not main)
3. ✓ Minimal fix only
4. ✓ Urgent PR
5. ✓ Deploy immediately after merge

---

**This git workflow standard ensures traceable, clean, and maintainable code history across all projects.**
