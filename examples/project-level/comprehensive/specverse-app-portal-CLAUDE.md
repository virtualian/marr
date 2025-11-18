# Project CLAUDE.md - SpecVerse App Portal
<!-- Standard Claude Code 2-layer system -->

## How This Works
This is the **project-level** configuration (Layer 2 of 2):
- **User file**: `~/.claude/CLAUDE.md` - Developer's personal preferences & defaults
- **This file**: `./CLAUDE.md` (project root) - Project-specific requirements

**Priority**: This file overrides user's technical defaults but respects their personal preferences.

**IMPORTANT IMPERATIVES FOR CLAUDE CODE:**
1. **At startup**, report: "Using 2-layer CLAUDE.md: User + SpecVerse project configs"
2. **If user CLAUDE.md is missing**, suggest: "No user config found. Create ~/.claude/CLAUDE.md for personal preferences?"
3. **If this file seems outdated** (missing deps, wrong versions), suggest updates
4. **Check for conflicts** between user and project configs and report them
5. **Never silently fail** - always communicate configuration issues

## Project-Specific Reminders
- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary for achieving the goal
- ALWAYS prefer editing existing files to creating new ones
- NEVER proactively create documentation files (*.md) or README files

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
- Technical documentation, standards, and setup guides should be in the `docs/` folder
- Plans should be in `plans/` directory
- Research reports should be in `research/` directory
- NEVER place documentation files in the project root unless they serve a specific functional purpose (like README.md, BRANCHING.md for quick reference)
- Each type of document has its proper location based on purpose

## Environment Variables (MANDATORY)
- **NEVER edit `.env.local` directly** - All environment variables are managed through Vercel
- **ALWAYS use `vercel env pull`** to sync environment variables from Vercel
- **NEVER hardcode URLs or secrets** - Use environment variables from Vercel
- **OAuth development uses fixed ngrok URLs**: Configured in ngrok service, referenced via Vercel env vars
- **Use AUTH_URL, not NEXTAUTH_URL** - NextAuth v5 uses AUTH_URL (NEXTAUTH_URL is deprecated)
- **ENSURE proper formatting** - All environment variables must be properly formatted. URL values in particular must not contain embedded newlines or carriage returns
- **CREATE vars correctly** - When adding Vercel env vars, use `printf` instead of `echo` to avoid trailing newlines: `printf "value" | vercel env add VAR_NAME development`

## Standards (MANDATORY)

**Git Workflow:**
@prompts/prompt-git-workflow-standard.md

**Testing Standards:**
@prompts/prompt-testing-standard.md

**Testing Constraints:**
- **NEVER run tests in watch mode** - Tests must run once and exit
- **No file watching during tests** - Tests must complete and exit after running

Quick references: [BRANCHING.md](./BRANCHING.md) | [TESTING.md](./TESTING.md)

## What This Project Expects
Claude Code should:
1. **Check for developer's `~/.claude/CLAUDE.md`** for personal preferences
2. **Respect personal preferences** like communication style, work habits
3. **Override only technical defaults** with this project's specific requirements
4. **Follow this project's conventions** for consistency across all contributors
5. **ALWAYS follow the Git Workflow Standards above** - this is non-negotiable

---
*Note: This project configuration overrides technical defaults from ~/.claude/CLAUDE.md while preserving personal preferences*