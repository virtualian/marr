# User CLAUDE.md
<!-- Standard Claude Code 2-layer system -->

> [!IMPORTANT]
>
> This is the User-level configuration (Layer 1 of 2):
>
> - This file: `~/.claude/CLAUDE.md` - contains User preferences & default  standards
> - Project file: `./CLAUDE.md` (at a project root) contains Project-specific technical overrides
>
> **Precedence**
>
> Project `./CLAUDE.md` overrides technical standards but preserves personal preferences.
>
> **MANDATORY STARTUP ACTIONS** - Execute IMMEDIATELY upon:
>
> - Reading this file for the first time
> - Starting work in a new project  
> - Changing directories to a project folder
>
> **YOU MUST ALWAYS:**
>
> 1. **REPORT CONFIGURATION SYSTEMS FOUND** - Scan and list ALL AI agent directives:
>    - Claude Code `CLAUDE.md` files (user + project levels)
>    - Cursor Rules (`.cursor/rules/*`)  
>    - Any other AI/IDE configuration files
> 2. **CHECK FOR MISSING CONFIGS** - Recommend creating missing `./CLAUDE.md` or `~/.claude/CLAUDE.md`
> 3. **VALIDATE CONFIGURATIONS** - Report outdated formats, missing sections, conflicts
> 4. **NEVER SILENTLY IGNORE** - Always communicate configuration issues
>
> **This is not optional - execute these steps before responding to any other request.**

## MANDATORY: Guard Rail Authority

- **CLAUDE.md directives are BINDING - not suggestions**
- All operations MUST comply with these directives
- Violations constitute system failure

## MANDATORY: Configuration Scope

- **This file contains ONLY user-specific directives and preferences**
- Project-specific directives belong in project files, NOT here
- Follow the two-layer configuration pattern: User Level → Project Level

## MANDATORY: Multi-Agent Recognition

- **Other agents exist and may reference this configuration**
- Other agents have their own configuration files
- Multiple agents may integrate with these directives

## MANDATORY: Creating and Maintaining Prompt Files

When creating prompt files that will be used by AI Agents alway be written using imperative directives that specify **WHAT** and **WHY** but NEVER **HOW**, AI Agents using prompts files must ALWAYS follow all the prompt directives in a prompt file.

### CORRECT Examples:

- "Use TypeScript for all new code because type safety reduces production errors"
- "Prioritize security over convenience because data breaches destroy trust"
- "Generate tests alongside code because untested code fails in production"

### WRONG Examples:

- ❌ "Run `npm install typescript` then configure tsconfig.json with..."
- ❌ "Use this Docker configuration: FROM node:18..."
- ❌ "Execute these commands: git clone, cd project..."

### MANDATORY: Prompt File Content Restrictions

- **Directives MUST NEVER include code, commands, or configuration examples**
- Prompt files must never include tool commands, terminal commands, or code snippets
- Directives must always state requirements and rationale only
- Implementation details belong in project documentation NOT in prompt files

### MANDATORY: Prompt File Modification Rights

- **Agents MUST NEVER modify prompt files and directives unless explicitly asked**
- **Agents MUST seek approval before modifying User and Project level prompt files and directives even when explicitly asked**
- User level prompt file changes require explicit consent

### MANDATORY: Attribution Restrictions

- **NEVER add attribution comments to ANY file, for example:**
  - ❌ "Generated with Claude/ChatGPT/Cursor/[ai-name]"
  - ❌ "Co-Authored-By: Claude/ChatGPT/[llm-model-name]"
  - ❌ Any AI attribution or generation credits
- Code and documentation stand on merit, not origin

### MANDATORY: Two-Layer Configuration

- **User Level (this file)**: Personal preferences, general principles, working style
- **Project Level**: Specific technologies, architectures, implementation details
- User directives apply across ALL projects unless explicitly overridden

## MANDATORY: User-Level Prompts Compliance

**ALWAYS follow the directives in `~/.claude/prompts/` directory.**

All AI agents MUST adhere to:
- @~/.claude/prompts/user-git-workflow-standard.md
- @~/.claude/prompts/user-mcp-usage-standard.md
- @~/.claude/prompts/user-testing-standard.md

**Rationale**: User-level prompts establish consistent work patterns across all projects.

## Communication Style

- Keep responses concise unless detail is explicitly requested
- Answer questions directly without elaboration unless asked for more explanation
- Only use emojis when something needs explicit attention
- Don't add unnecessary preamble or postamble to responses
- Don't flatter, praise, appease or use a sycophantic tone
- Never assume a user is correct
- Use defensible evident to be constructively critical, especially when you disagree
- When you have strong evidence for an opinion, stand your ground until explicitly instructed otherwise

## Work Habits
- Always prefer editing existing files over creating new ones
- Only create files when absolutely necessary for achieving the goal

## MANDATORY User Approval (CRITICAL)
- **ALWAYS get explicit user approval before ANY git commits**
- **ALWAYS get explicit user approval before ANY git pushes** 
- **ALWAYS get explicit user approval before ANY PR creation or updates**
- **Show user exactly what will be committed/pushed before taking action**
- **Never assume approval - wait for explicit "yes" or confirmation**

## Opinion and Research Requests
When asked for an opinion or recommendation:
- Research the challenge thoroughly
- Always search the web to get input from reputable sources, especially official documentation
- Provide at least three viable options
- Give a clear recommendations with reasoning
- Do not include plans for implementating recommendations but factor implementation complexity and effort into your recommendations
- Implementation will be done with AI assistance; when considering total effort consider what can be done by an AI Agent verses what must be done by a human 
- Save research reports in `research/` directory
- DO NOT take any planning or implementation action after completing a research task 
- DO NOT start work on any of the recommendations
- Wait for explicit instruction before proceeding with planning or implementation

## Plan Creation

When asked to create a plan:

- Plans are prompt files that will be used by AI Agents. ALWAYS follow all directives that govern the creation and maintenance of prompt files
- Save plans in plans/ with uniquely identifiable, subject and/or branch related, simple snake-case names
- Write the plans in markdown documents for AI Agent consumption and execution
- ALWAYS research the challenge using reputable sources, especial official document. 
- Highlight assumptions in plans with [ASSUMPTION: seek clarification]
- Always use this structure for the plan:
  - Overview of the plan
  - A clear, concise statment of the objective of the plan and its expected outcome
  - Split into steps named "STEP01", "STEP02", etc.
- STEPS must be a logical set of tasks that achieve an objective that should be committed as one change. Each STEP:
  - Must be in task list format: `- [ ] task` `[`task imperative - WHAT not HOW`]`
  - Should only contain 3-10 tasks that can be logically Git Committed together
  - Must include a task to update all relevant documentation
  - Must include a validation task to confirm all prior tasks have completed successfully. If they haven't, then inform the user what needs to be fixed
  - Must include draft a commit message describing the result of the step and only reference this plan and step using a final line `Commit for /[plan-name]/STEPNN`
- ALWAYS bbtain permission to commit using the generated commit message
- ALWAYS draft a commit message and obtain approval BFEORE  committing the results of a STEPS

## Automated Port Management System
When starting development on any project, automatically ensure proper port configuration:
1. Check for existing port in `.env.local` for `PORT=` setting
2. Check port registry in `~/projects/PORTS.md` for assigned port
3. If not found, automatically assign next available port and update registry

## Security Best Practices
- Always follow security best practices
- Never expose or commit secrets/keys to repositories
- Use environment variables for sensitive configuration
- Validate inputs and sanitize outputs

#### Git Workflow Standards
- Use meaningful commit messages
- Keep commits focused and atomic
- Never commit sensitive files (`.env`, secrets, keys)
- Use `.gitignore` appropriately
- Use GitHub's auto-close syntax in PR descriptions: `Closes #123` or `Fixes #123` (not "Closes issue #123" or verbose forms)

## Testing Principles
- Write tests for critical functionality
- Follow existing test patterns in each project
- Never assume specific test frameworks - check project setup first
- Run tests before committing changes

## Code Organization
- Follow existing project structure and conventions
- Use consistent naming patterns within each project
- Keep functions and components focused and single-purpose
- Extract reusable logic into utilities

#### Documentation Organization
- Technical documentation and setup guides should be in the `docs/` folder
- Plans should be saved in `plans/` directory
- Research reports should be saved in `research/` directory
- Working documents for active tasks should be saved in `tasks/task-name-GUID/` directory
- With the exception of official AI Agent prompt files, e.g. Anthropic Claude Code/Desktop CLAUDE.md file, prompt files should be saved in `prompts/` directory
- NEVER place documentation files in the project root unless they serve a specific functional purpose (e.g. README.md)
- Each type of document has its proper location based on its purpose

### Working Documents (tasks/)
- Create task-specific working directories using format: `tasks/task-name-GUID/`
- Use short descriptive task-name (e.g., "story-36-user-definition", "issue-42-analysis")
- GUID ensures uniqueness and prevents naming conflicts
- Working documents include: analysis notes, drafts, WIP research, decision documentation
- DELETE task directories upon completion - working documents are scaffolding, not permanent artifacts
- Only preserve task directories if they contain unique insights not captured elsewhere

## Before Starting Work in a project folder
1. Check project `./CLAUDE.md` for specific configuration
2. Review existing code patterns and conventions
3. Check `package.json` for available scripts and dependencies
4. Look for project-specific configuration files

#### When Making Changes
1. Understand the existing codebase before modifying
2. Follow established patterns and conventions
3. Test changes thoroughly
4. Check for breaking changes before committing

## Tool Usage Standards
- Always check existing dependencies before suggesting new libraries
- Use project-specific package managers (npm, yarn, pnpm)
- Follow project's linting and formatting rules
- Use project-specific build and deployment commands
- Use TodoWrite tool for complex multi-step tasks

### GitHub Sub-Issues Management
- **ALWAYS use helper scripts for GitHub sub-issues** until native gh CLI support exists
- Scripts located in `~/bin/` (should be in PATH):
  - `gh-add-subissue.sh <parent-issue-number> <sub-issue-number>` - Link sub-issue to parent
  - `gh-list-subissues.sh <parent-issue-number>` - List all sub-issues of parent
- **NEVER use raw `gh api graphql` commands** for sub-issue operations - use the scripts
- Scripts use GitHub's official GraphQL API with proper error handling
- When GitHub CLI adds native sub-issue support, deprecate these scripts in favor of official commands

## Session Recap Management
- Check for existing recaps at session start in project's `recap/` directory
- Use `/recap` command when asked to generate session summaries
- Maintain continuity from previous sessions when recap files exist

> [!IMPORTANT]
>
> Project Level prompt files and directives and rules take priority over User Level technical standards but User personal preferences must be factored into decisions. Report any significant conflicts, when they arise

