# Git Workflow Standard

> **AI Agent Instructions**: This document defines standardized practices for developing, reviewing, releasing, and deploying software using Git and GitHub. Follow these rules exactly for all code changes, regardless of size or complexity.
>
> **Quick Reference**: Developers should refer to `/BRANCHING.md` for a condensed quick reference guide.
> **IMPORTANT**: When this standard is updated, regenerate `/BRANCHING.md` to keep it synchronized.

## Core Rules (NEVER VIOLATE)

1. **Verify issue exists BEFORE any action** - Even in emergencies, confirm issue number exists in GitHub before investigation or branch creation
2. **Delete merged branches** - Follow industry standard (delete after successful merge)
3. **Always squash merge** - Keep main branch linear
4. **Branch from main only** (except hotfixes from production tags)
5. **Maximum 5-day branch lifetime** - Break down larger work (monitored weekly)
6. **Use issue-based branch naming** - `<issue-number>-<description>` format

## Process-First Mandate (EVEN IN EMERGENCIES)

**CRITICAL FOR AI AGENTS**: Perceived urgency does NOT bypass process.

### Before ANY Investigation or Code Changes

**ALWAYS perform these verification steps FIRST**, regardless of urgency language like "production is down" or "critical bug":

1. **Verify issue exists in GitHub** - Check that the referenced issue number actually exists
2. **Confirm issue has proper description** - Issue must clearly describe the problem
3. **Verify you're assigned or authorized** - Don't assume you should work on any issue
4. **Check for existing branch** - Another developer may already be working on it
5. **Create branch BEFORE investigation** - All code exploration must happen in issue-specific branch (NEVER investigate on main)

### When User Says "I created issue #XX"

**DO NOT assume - verify**:
```bash
# Use gh CLI to verify issue exists
gh issue view 91

# Check if issue is already assigned
gh issue view 91 --json assignees
```

### Urgency Response Pattern

```
User: "Production is down! Fix issue #91 authentication bug!"

CORRECT Response:
"Let me verify issue #91 exists first..."
[Checks GitHub: gh issue view 91]
[IF exists] "Confirmed. Creating hotfix branch..."
[Creates branch: git checkout -b hotfix/91-auth-bug]
[THEN investigates: Now I can investigate the bug in auth.ts]
[IF doesn't exist] "Issue #91 doesn't exist yet. Should I create it first?"

WRONG Response:
"Let me investigate the authentication bug..."
[Uses Read/Grep/Bash to investigate code WITHOUT creating branch first]
[Starts code investigation without verification OR branch]
```

### When User Requests Implementation Without Issue Numbers

**DO NOT start implementation - ask for issue numbers**:

```
User: "I'm working on the user profile system. I need to implement photo upload. What should I do?"

CORRECT Response:
"Before I can help with implementation, I need to verify your workflow setup:

1. Do you have a GitHub issue for this work? What's the issue number?
2. Is this part of a larger Feature, or an independent Story?

According to the Process-First Mandate, all development work must be tracked in GitHub issues. Please provide the issue number(s), or should I help you create the issues first?"

WRONG Response:
"Let me check the current codebase..."
[Uses Bash, Read, or Grep to investigate code WITHOUT issue/branch]
[Starts researching implementation details before having issue number]
[Investigates on main branch instead of issue-specific branch]
```

**Why This Matters**:
- Prevents work on non-existent issues
- Avoids duplicate work (issue may be assigned to someone else)
- Maintains traceability even under pressure
- Builds correct habits that scale across all work
- **Ensures ALL development work is tracked**, not just urgent fixes

## Issue Types & Categorization

This workflow uses GitHub issue types for work categorization:

### Issue Type Definitions

**Bug** - Observed behavior differs from expected/documented behavior. Must include what's happening vs what should happen.

**Feature** - Medium/large deliverable (noun) that will be broken down into Stories. Something concrete you can point to when complete.

**Story** - Small deliverable (noun) of concrete value, completable in <3 days. Represents visible progress toward larger goals.

**Task** - Bounded activity (verb) rather than deliverable. Must have clear completion criteria you can verify.

### Issue Type Decision Tree

```
Does this represent observed vs expected behavior difference?
├─ YES → Bug issue type
└─ NO → Is this a concrete deliverable?
    ├─ YES → Is it large/complex (>3 days)?
    │   ├─ YES → Feature issue type (break into Stories)
    │   └─ NO → Story issue type
    └─ NO → Task issue type (bounded activity)
```

## Creating GitHub Issues

### Issue Creation Standards

**When creating GitHub issues, follow these guidelines:**

**What to Include:**
- **Clear title** that describes the issue concisely
- **Issue description** that provides context and explains what needs to be addressed
- **Issue type** (Bug, Feature, Story, Task) assigned correctly
- **Investigation instructions** for whoever works on the issue

**What NOT to Include:**
- **Detailed solutions** - Don't prescribe implementation before investigation
- **Specific technical approaches** - Allow the implementer to research and recommend
- **Complete acceptance criteria** - High-level criteria only; details emerge during investigation

**Standard Investigation Instructions:**

Every issue should include instructions for the assignee to:
1. Investigate potential solutions
2. Make recommendations based on research
3. Consider feedback and update the issue with decisions made
4. Wait for explicit instruction to begin implementation

### Issue Creation Examples

**Good Issue (Feature)**:
```markdown
## Overview
The git workflow standard needs directives for how AI agents should create GitHub issues.

## Required Directives
When creating GitHub issues, AI agents should:
- Record description and create suitable title
- NOT investigate in detail or specify detailed solution
- Include investigation instructions for assignee

## Acceptance Criteria
- [ ] Add new section to git workflow standard
- [ ] Include directives for what to include/exclude
- [ ] Update AI Agent Specific Instructions

## Next Steps for Assignee
1. Research existing issue creation standards
2. Draft proposed directives
3. Share recommendations for feedback
4. Update this issue with decisions made
5. Wait for explicit approval to implement
```

**Poor Issue (Over-Specified)**:
```markdown
## Overview
Need to update git workflow standard.

## Implementation
Add this exact text to line 115 in prompt-git-workflow-standard.md:
[detailed implementation specified]

Then update these 5 files in this specific way:
[prescriptive step-by-step instructions]
```

**Why the Poor Example Fails:**
- Prescribes exact implementation without investigation
- Doesn't allow for research or alternative approaches
- Skips the important step of making recommendations
- Treats assignee as code executor rather than problem solver

## GitHub Sub-Issues for Feature/Story Hierarchies

**Since April 2025**, GitHub sub-issues provide native support for organizing Features with their component Stories.

### Sub-Issues Capabilities

- **Up to 8 levels of nesting** - Sub-issues can contain their own sub-issues
- **100 sub-issues per parent** - More than enough for complex features
- **Automatic progress tracking** - Parent issues show completion percentage
- **Visual hierarchy** - Clear parent-child relationships in GitHub UI
- **Automatic inheritance** - Sub-issues inherit Projects and Milestones from parents

### Feature/Story Organization with Sub-Issues

**Recommended Structure**:
```
Feature Issue #45: User Profile System (parent)
├── Story #46: Profile Viewing (sub-issue)
├── Story #47: Profile Editing (sub-issue)
├── Story #48: Profile Photo Upload (sub-issue)
└── Bug #49: Fix Avatar Sizing (sub-issue)
```

**Branch Implementation**:
- **Feature branch**: `45-user-profile-system` (from parent issue #45)
- **All Stories work on Feature branch** - no separate Story branches
- **GitHub handles progress tracking** automatically as Stories close
- **Maintains 1-1 issue-to-branch relationship** at Feature level

### When to Use Sub-Issues vs Independent Issues

**Use Sub-Issues When**:
- Stories are part of a larger Feature that ships together
- Stories share common infrastructure or dependencies
- Coordinated release of multiple Stories is beneficial
- Integrated testing across Stories is needed

**Use Independent Issues When**:
- Story can ship independently to production
- No dependencies on other Stories
- Immediate value delivery without waiting for Feature completion
- Single Story delivers complete user value

### Decision Tree: Sub-Issues vs Independent Branches

```
Is this a Story?
├─ YES → Is it part of a larger Feature?
│   ├─ YES → Create as sub-issue of Feature
│   │        Work on Feature branch (45-user-profile-system)
│   │        GitHub tracks progress automatically
│   └─ NO → Create as independent issue
│            Create own branch (42-profile-view)
│            Merge independently to main
└─ NO → Create as independent issue with own branch
```

## Branch Naming & Workflow

### Branch Naming Convention

**Standard Format**: `<issue-number>-<descriptive-name>`

**Examples**:
- `42-user-profile-view` (Story or Feature)
- `67-fix-login-timeout` (Bug)
- `89-update-dependencies` (Task)

**Exception - Hotfixes**: `hotfix/<issue-number>-<description>`
- `hotfix/156-security-patch` (Critical production issues)
- **Why the exception?** Emergency identification during high-pressure situations. Different workflow (from production tag) justifies different naming. The ONE exception actually validates the rule by contrast.

### Branch Type Rules

| Issue Type | Branch Workflow |
|:-----------|:---------------|
| **Independent Story** | Gets own branch: `42-profile-view` → merges to main |
| **Feature** | Gets own branch: `45-user-profiles` → merges to main when complete |
| **Story within Feature** | Work happens directly on Feature branch (no separate branch) |
| **Bug** | Gets own branch: `67-login-timeout` → merges to main |
| **Task** | Gets own branch: `89-update-deps` → merges to main |
| **Hotfix** | `hotfix/156-security-patch` from production tag → merges to main |

### Branch Workflow Decision Tree

```
Is this a critical production issue?
├─ YES → hotfix/<issue-number>-<description> from production tag
└─ NO → What type of work?
    ├─ Independent Story → <issue-number>-<description> from main
    ├─ Feature → <issue-number>-<description> from main
    ├─ Story within Feature → Work on existing Feature branch
    ├─ Bug → <issue-number>-<description> from main
    └─ Task → <issue-number>-<description> from main
```

## Standard Development Workflow

### Starting Work

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

### Feature with Stories Workflow

```bash
# 1. Create Feature branch
git checkout main && git pull
git checkout -b 45-user-profiles

# 2. Work on Story 1 directly on Feature branch
git add . && git commit -m "Add profile viewing capability"

# 3. Work on Story 2 directly on Feature branch
git add . && git commit -m "Add profile editing capability"

# 4. When Feature complete, merge to main
# All Stories worked on same branch, delivered together
```

### Hotfix Workflow

**Even for critical production issues**, follow this sequence:

1. ✓ Verify issue exists in GitHub (`gh issue view <number>`)
2. ✓ Confirm issue describes production impact
3. ✓ Identify production tag to branch from
4. ✓ Create hotfix branch with proper naming
5. ✓ Investigate and fix
6. ✓ Create urgent PR

**Then proceed with hotfix workflow:**

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
# Create urgent PR to main
```

## Branch Lifetime Management

### Maximum Lifetimes by Issue Type

| Issue Type | Maximum Lifetime | Enforcement |
|:-----------|:----------------|:------------|
| **Story** | 3 days | By definition - if >3 days, it's a Feature |
| **Feature** | 5 days | Issue sizing - break into Stories if needed |
| **Bug** | 2 days | Quick fixes - escalate if complex |
| **Task** | 5 days | Bounded activities |
| **Hotfix** | Hours | Emergency response only |

**Rationale for 5-Day Limit**:
- Industry research shows branches <1 day correlate with high-performing teams
- The 5-day limit is conservative but practical for team coordination
- Short branches prevent merge conflicts and reduce integration risk
- Enforced through issue sizing rather than branch monitoring
- Balances trunk-based development benefits with real-world collaboration needs

### Exceeding Limits

If work cannot complete within limits:
1. **Break down the issue** into smaller issues (preferred)
2. **Merge partial work** with feature flags if appropriate
3. **Create new branch** with new issue number if needed
4. **Document why** limits were exceeded (retrospective learning)

## Branch Cleanup

**Industry Standard**: Delete branches immediately after successful merge to main.

**Why delete branches?**
- Keeps repository clean and navigable
- Reduces cognitive overhead for team
- Industry best practice (nearly universal)
- Git history preserves all work permanently
- Tags mark important milestones when needed

### Automation (FREE - No GitHub Actions Minutes)

**GitHub Repository Setting** (REQUIRED):
- Enable **"Automatically delete head branches"** in repository settings
- Location: Settings → General → Pull Requests
- **Cost**: FREE - Native GitHub feature, no Actions minutes consumed

**Local Automation** (OPTIONAL):
```bash
# Install git post-merge hook for automatic local cleanup
./scripts/install-hooks.sh

# Or run batch cleanup manually/periodically
./scripts/cleanup-merged-branches.sh --dry-run  # Preview
./scripts/cleanup-merged-branches.sh            # Execute
```

**Manual Cleanup**:
```bash
# Delete local branch
git branch -d 42-user-profile-view

# Delete remote branch (if GitHub auto-delete not enabled)
git push origin --delete 42-user-profile-view
```


## Commit & PR Standards

### Commit Messages

**NO issue numbers in commit messages** - This is intentional, not an oversight.

**Rationale**:
- Branch names already contain issue numbers (`45-user-profile-system`)
- GitHub automatically links commits to issues via branch name
- Cleaner git history without redundant metadata
- Commit subjects focus on **what** changed and **why**
- Industry best practice (Conventional Commits specification)

**Format**: Clean, descriptive subject line (50 chars) with optional body

**Examples**:
```bash
git commit -m "Add user profile view component"
git commit -m "Fix timeout handling in authentication"
git commit -m "Update dependencies for security patches"

# With detailed body if needed
git commit -m "Add profile caching for performance" -m "Implements Redis caching layer to reduce database queries by 60%. Cache invalidation on profile updates."
```

**Anti-Pattern**:
```bash
# ❌ DON'T include issue numbers
git commit -m "Add profile view (#45)"
git commit -m "[#45] Add profile view"
git commit -m "fix: profile view (closes #45)"
```

### PR Requirements

**Technical Requirements**:
- All CI checks must pass
- At least one approval from code owner
- No merge conflicts with main
- Squash merge strategy enforced

**Quality Gates**:
- [ ] Tests pass
- [ ] Linting passes
- [ ] Security scan passes
- [ ] 1+ code review approval
- [ ] Squash merge only

## Release Management

This workflow uses automated release scripts that handle version bumping, tagging, and deployment.

### Release Scripts

**Available Commands**:
```bash
npm run release:patch    # Patch release (0.0.X) - bug fixes
npm run release:hotfix   # Same as patch - emergency fixes
npm run release:minor    # Minor release (0.X.0) - new features
npm run release:major    # Major release (X.0.0) - breaking changes
```

**What the script does**:
1. Ensures you're on `main` branch with clean working directory
2. Pulls latest changes from remote
3. Bumps version in `package.json` and `package-lock.json`
4. Creates git commit for version bump
5. Creates and pushes git tag (`v0.11.1`, `v0.12.0`, etc.)
6. Deploys to production automatically
7. Provides deployment URL and monitoring links

**Example Usage**:
```bash
# Bug fix release
npm run release:patch

# New feature release
npm run release:minor

# Emergency production fix
npm run release:hotfix
```

**Script Location**: `scripts/release.sh` - See file for implementation details.

**Requirements**: Must be on `main` branch with clean working directory.

## Anti-Patterns (FORBIDDEN)

❌ Merge commits to main (breaks linear history)
❌ Branches living >5 days (break down work)
❌ Direct commits to main (use PRs only)
❌ Hotfix from main (use production tags)
❌ Generic branch names like `42-updates`
❌ Type prefixes in issue titles ("Feature: User Profile")
❌ Issue numbers in commit messages (let Git auto-link)
❌ Keeping merged branches indefinitely (delete after merge)

## Integration Requirements

**MANDATORY INTEGRATION**: These git workflow standards work in conjunction with Testing Standards. Both must be followed simultaneously - no exceptions.

**Testing Standards Reference**: @prompts/testing-standard.md

All commits and PRs must satisfy both git workflow requirements AND testing requirements. No code changes can be committed without passing tests and meeting coverage thresholds.

## AI Agent Specific Instructions

When working on projects using this workflow:

### Process-First Rules (MANDATORY)

1. **ALWAYS verify issue exists FIRST** - Use `gh issue view <number>` before any action
2. **NEVER skip verification due to urgency** - "Production down" does NOT bypass process
3. **NEVER start implementation without issue number** - Ask for issue number if not provided
4. **CREATE branch BEFORE investigation** - Never use Bash, Read, Grep, or any code exploration tools before creating an issue-specific branch
5. **Respond with process, not action** - When asked "what would you do?", describe the verification steps first

### Branch and Issue Management

6. **Always check issue number** before creating branches
7. **Use exact naming format**: `<issue-number>-<description>`
8. **Never use feature/ or fix/ prefixes** (except hotfix/ for emergencies)
9. **Check if Story is part of Feature** - if yes, work on Feature branch
10. **Keep branches under 5 days** - break down larger work

### Issue Creation Rules

11. **Create concise, descriptive titles** - Focus on what, not how
12. **Provide context, not solutions** - Describe the problem or need, not the implementation
13. **NEVER prescribe detailed solutions** - Let the assignee investigate and recommend approaches
14. **ALWAYS include investigation instructions** - Tell assignee to research, recommend, update issue, and wait for approval
15. **Keep acceptance criteria high-level** - Details emerge during investigation

### Commit and Push Approval (MANDATORY)

16. **ALWAYS request explicit approval before committing** - Never assume permission to commit
17. **ALWAYS request explicit approval before pushing** - Never assume permission to push
18. **Show commit message for approval** - Present the exact commit message before committing
19. **Show what will be committed** - Use `git status` to show staged changes before committing
20. **Wait for explicit "yes" or confirmation** - Do not proceed without clear approval

### Development Workflow

21. **Create draft PRs immediately** for CI feedback
22. **Follow squash merge strategy** always
23. **Delete branches after merge** - follow industry standard
24. **Use npm release scripts** - `npm run release:patch/minor/major` for releases

### Examples: Process-First Responses

**Example 1: Urgency with Issue Number**

```
User: "Production is down! There's a critical auth bug. I've created issue #91. What would you do?"

CORRECT (Process-First):
"I'll follow the hotfix process:
1. First, verify issue #91 exists: gh issue view 91
2. Identify current production tag
3. Create hotfix branch: hotfix/91-auth-bug
4. THEN investigate the authentication issue (in the branch)
5. Implement minimal fix
6. Create urgent PR to main

Let me start by verifying issue #91..."
[After verification and branch creation, THEN uses Read/Grep in branch]

WRONG (Action-First):
"Let me investigate the authentication bug in auth.ts..."
[Uses Read/Grep/Bash WITHOUT verifying issue or creating branch]
```

**Example 2: Implementation Request Without Issue Number**

```
User: "I'm working on the user profile system. I need to implement photo upload. What should I do?"

CORRECT (Process-First):
"Before I can help with implementation, I need to verify your workflow setup:

1. Do you have a GitHub issue for this work? What's the issue number?
2. Is this part of a larger Feature, or an independent Story?

According to the Process-First Mandate, all development work must be tracked in GitHub issues. Please provide the issue number(s), or should I help you create the issues first?"

WRONG (Action-First):
"Let me check the current codebase..."
[Uses Bash/Read/Grep to investigate WITHOUT issue number or branch]
[Starts researching implementation details before having issue number]
[Investigates implementation on main branch]
```

**Example 3: Creating a GitHub Issue**

```
User: "Create an issue to add dark mode support to the documentation site"

CORRECT (Context, Not Solution):
gh issue create --title "Add dark mode support to documentation site" --body "## Overview

Users have requested the ability to toggle between light and dark themes in the documentation.

## Context

The current documentation uses Material for MkDocs which has built-in dark mode support, but it may need configuration.

## Next Steps for Assignee

1. Research Material for MkDocs dark mode capabilities
2. Investigate alternative approaches if needed
3. Make recommendations for implementation approach
4. Update this issue with decisions and rationale
5. Wait for explicit instruction to begin implementation

## Acceptance Criteria

- [ ] Dark mode toggle available to users
- [ ] Theme preference persists across sessions
- [ ] All content readable in both themes"

WRONG (Over-Specified):
gh issue create --title "Configure palette toggle in mkdocs.yml" --body "## Implementation

Add these exact lines to mkdocs.yml at line 47:

\`\`\`yaml
theme:
  palette:
    - scheme: default
      toggle:
        icon: material/brightness-7
        name: Switch to dark mode
    - scheme: slate
      toggle:
        icon: material/brightness-4
        name: Switch to light mode
\`\`\`

Then update the CSS in docs/stylesheets/extra.css..."
[Continues with detailed implementation steps]
```

**Why Example 3 CORRECT Works:**
- Provides context about the need
- Doesn't prescribe exact implementation
- Gives assignee space to research and recommend
- Includes investigation instructions
- High-level acceptance criteria

**Why Example 3 WRONG Fails:**
- Prescribes exact implementation without investigation
- Doesn't allow for alternative approaches
- Treats assignee as code executor, not problem solver
- Skips important research and recommendation phase

**Example 4: Commit Approval Workflow**

```
[After completing work on issue #46]

CORRECT (Request Approval):
"I've completed the changes for issue #46. Here's what will be committed:

[Shows git status output]

Proposed commit message:
```
Add GitHub issue creation standards to git workflow

Defines clear guidelines for AI agents on how to create GitHub issues:
- What to include: clear title, context, investigation instructions
- What NOT to include: detailed solutions, prescriptive implementations
- Standard investigation workflow for assignees
- Examples of good and poor issue creation
```

May I commit and push these changes?"

[Waits for user response]

WRONG (Assumes Approval):
"Work complete. Committing and pushing changes..."
[Runs git commit && git push without asking]
[Does not show what will be committed]
[Does not wait for approval]
```

**Why Example 4 CORRECT Works:**
- Shows exactly what will be committed (git status)
- Presents commit message for review
- Explicitly asks for permission
- Waits for user confirmation

**Why Example 4 WRONG Fails:**
- Assumes permission without asking
- Doesn't show user what's being committed
- No opportunity for user to review or object
- Violates user autonomy and project control

**MANDATORY**: All AI agents working on projects using this workflow must follow these Git Workflow standards. No exceptions for any code changes, regardless of urgency, size, or perceived complexity.

**IMPORTANT**: When this standard is updated, regenerate `/BRANCHING.md` immediately to keep quick reference synchronized.

---

*This prompt serves as both AI instruction and human documentation. Follow core principles rather than rigid adherence to every detail. When in doubt, prioritize simple, clean workflows that maintain code quality and team velocity.*