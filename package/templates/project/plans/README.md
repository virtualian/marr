# Implementation Plans

This directory contains **implementation plans** for AI agents to execute.

## Purpose

Plans are **prompt files** that guide AI agents through multi-step implementations. They provide structure for complex tasks that span multiple commits.

## Plan Structure

Each plan follows this format:

```markdown
# Plan Title

## Overview
Brief description of what this plan achieves.

## Objective
Clear statement of the expected outcome.

## STEP01: [Step Name]
- [ ] Task 1
- [ ] Task 2
- [ ] Update relevant documentation
- [ ] Validate all prior tasks completed
- [ ] Draft commit message for this step

## STEP02: [Step Name]
...
```

## Conventions

**Naming**: Use descriptive snake_case names related to the issue or feature:
- `phase1-user-auth.md`
- `42-refactor-api-client.md`
- `fix-payment-flow.md`

**Steps**: Each step should be:
- 3-10 tasks that logically commit together
- Include documentation updates
- Include validation task
- End with commit message draft

**Tasks**: Written as imperatives (WHAT not HOW):
- ✅ "Add user authentication endpoint"
- ❌ "Run `npm install passport` then create auth.js..."

## Lifecycle

1. **Created**: When starting planned work
2. **In Progress**: Steps checked off as completed
3. **Complete**: All steps done, plan can be archived or deleted

## What Goes Here

- Multi-step implementation plans
- Feature development roadmaps
- Refactoring plans
- Migration plans

## What Doesn't Go Here

- **Permanent documentation** → `docs/` directory
- **Research notes** → `research/` directory
- **AI agent directives** → `prompts/` directory
