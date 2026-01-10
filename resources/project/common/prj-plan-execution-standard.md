---
marr: standard
version: 2
title: Plan Execution Standard
scope: Planning and executing implementation work with coordinated agents

triggers:
  - WHEN executing an implementation plan from plans/
  - WHEN spawning sub-agents to perform plan tasks
  - WHEN resuming work on a partially-completed plan
  - WHEN coordinating multiple agents on a single plan
  - WHEN creating or structuring a new implementation plan
---

# Plan Execution Standard

> **AI Agent Instructions**: This document defines how implementation plans must be created and executed using coordinated agents. Follow these rules when creating or executing any plan.
>
> **Scope**: All planning and plan execution involving AI agents
>
> **Rationale**: Plans may exceed a single context window. File-based coordination with isolated agent directories enables reliable handoffs, parallel execution, and resumption without state corruption.

---

## Triggers

Read and apply this standard when:

- WHEN executing an implementation plan from plans/
- WHEN spawning sub-agents to perform plan tasks
- WHEN resuming work on a partially-completed plan
- WHEN coordinating multiple agents on a single plan
- WHEN creating or structuring a new implementation plan

---

## Core Rules (NEVER VIOLATE)

1. **Each task gets its own directory** because agents must never write to the same file concurrently
2. **Agents communicate through files, not shared state** because file handoffs survive context loss
3. **Orchestrator writes handoffs, agents write results** because clear ownership prevents conflicts
4. **Structured data for machine parsing, markdown for human reading** because both audiences matter
5. **Result files are the source of truth** because if it's not in a result file, it didn't happen
6. **Never modify another task's files** because each agent owns only its directory
7. **Verify ALL validation criteria before marking complete** because partial completion causes downstream failures
8. **Orchestrator must be replaceable** because token limits require fresh context mid-execution

---

# Input

## What Is a Plan

A plan is **externalized intent** — structured data that enables agents to coordinate, resume, and audit work across context boundaries.

Plans are infrastructure for agents, not documents for humans. If a human needs to understand a plan, they can ask an agent to explain it.

**Plan location:** `plans/{plan-name}.md`

**Plan requirements:**

| Function | What the plan must provide |
|----------|---------------------------|
| State externalization | Expected inputs/outputs per task |
| Coordination | Task identifiers, scope boundaries |
| Dependencies | Explicit list of task dependencies (e.g., `depends_on: [01, 02]`) |
| Resumption | Clear completion criteria, checkpointable progress |
| Audit | Expected outcomes to compare against actual |
| Human intervention | Tasks requiring manual action flagged with `requires_human: true` |
| Realistic validation | Success criteria based on tested/benchmarked values, not assumptions |
| Rollback procedures | How to undo changes if the plan fails mid-execution |

---

# Artifacts

## Directory Structure

Every implementation plan requires an execution directory with per-task subdirectories.

**Naming convention:** If the plan is `plans/foo-implementation.md`, the execution directory is `plans/foo-execution/`.

```
plans/foo-execution/
  foo-execution-state.md     # Lightweight status tracker (updated by orchestrator)
  foo-execution-result.md    # Final outcome summary
  tasks/
    01/
      handoff.md             # Input from orchestrator
      execution.log          # Agent's work log
      result.md              # Output to orchestrator
    02/
      handoff.md
      execution.log
      result.md
```

**Ownership rules:**
- The plan file is read-only during execution
- Orchestrator owns `execution-state.md` and updates it after each task
- Orchestrator creates task directories and writes `handoff.md` files
- Task agents write only to their assigned directory
- No agent may modify files in another task's directory

---

## Execution State File Specification

The orchestrator must maintain `execution-state.md` as a lightweight progress tracker. This avoids expensive directory scanning on resume.

**Format:**
```markdown
# Execution State

**Plan:** plans/foo-implementation.md
**Started:** 2025-12-31T01:00
**Updated:** 2025-12-31T02:30

| Task | Status | Updated |
|------|--------|---------|
| 01 | completed | 2025-12-31T01:05 |
| 02 | completed | 2025-12-31T01:10 |
| 03 | in_progress | 2025-12-31T02:30 |
| 04 | blocked | 2025-12-31T01:15 |
| 05 | pending | - |
```

**Status values:**
- `pending` — Not started
- `in_progress` — Agent currently executing
- `completed` — Finished successfully
- `failed` — Finished with errors
- `blocked` — Awaiting resolution (human action, dependency issue)

**Orchestrator must update state file:**
- When starting a task → set `in_progress`
- When task completes → set `completed`, `failed`, or `blocked`
- Update timestamp on every change

**On resume, orchestrator reads only:**
1. `execution-state.md` to determine current status
2. Individual `result.md` files only when needed (gathering values for handoffs, investigating failures)

**Token efficiency:** Reading one state file (~100 tokens) vs scanning all result files (~3000+ tokens for 15 tasks).

---

## Handoff File Specification

The orchestrator must write `handoff.md` to provide task context to a task agent.

**A handoff must communicate:**

| What | Why |
|------|-----|
| Task identity | So the agent knows which task it's executing |
| What to accomplish | So the agent understands the goal, not implementation steps |
| Context from prior tasks | So the agent has values it depends on |
| Required outputs | So the agent knows what to capture for downstream tasks |
| Resource constraints | So the agent operates within bounds (e.g., command limits) |
| Fallback behaviors | So the agent handles known edge cases appropriately |

**Orchestrator must:**
- State WHAT and WHY, never HOW — the task agent determines implementation
- Aggregate values from prior `result.md` files into context
- Specify only values the task actually needs
- Define required outputs so the agent knows what to capture
- Anticipate failure modes and specify fallback behaviors

---

## Human Intervention Tasks

Some tasks require actions that agents cannot perform autonomously (web UI access, physical actions, approval workflows). Plans must identify these upfront.

**Identifying human tasks:**
- Web console access (admin dashboards, cloud provider UIs)
- Physical actions (hardware installation, cable connections)
- Approval workflows (PR reviews, access requests)
- Credential provisioning (API keys from external services)

**Plan must specify for human tasks:**
- `requires_human: true` flag in task definition
- What the human needs to do (specific actions, not goals)
- What values the human should capture and where to record them
- How to signal completion so execution can resume

**Orchestrator behavior for human tasks:**
- Create the task directory and handoff as normal
- Set `status: blocked` with `blocker: awaiting_human_action`
- Alert the human (if alerting configured) or document the block
- Do not proceed with dependent tasks until human completes and updates result file

**Human must:**
- Read the handoff to understand required actions
- Perform the actions as specified
- Write `result.md` with captured values and `status: completed`
- Notify orchestrator (or orchestrator detects on next scan)

---

## Result File Specification

The task agent must write `result.md` upon completion to report outcomes.

**A result must communicate:**

| What | Why |
|------|-----|
| Status (completed/failed/blocked) | So orchestrator knows whether to proceed, retry, or abort |
| Captured values | So downstream tasks have the data they depend on |
| Summary of what was done | So orchestrator has context for decisions |
| Files modified | So changes are traceable |
| Errors (if failed) | So orchestrator/human can diagnose and fix |
| Blockers (if blocked) | So orchestrator/human knows what to resolve |
| Deviations from plan | So audit trail captures what actually happened |

**Task agent must:**
- Write result file only after work is complete
- Include all values specified in required_outputs
- Provide accurate summary for orchestrator context
- List all files modified so changes are traceable

---

## Execution Log Specification

The task agent must append to `execution.log` during work for detailed audit trail.

**A log entry must communicate:**

| What | Why |
|------|-----|
| Timestamp | So events can be sequenced and correlated |
| Action taken | So the audit trail shows what happened |
| Command executed | So work can be reproduced |
| Output received | So results are captured for debugging |
| Observations/decisions | So rationale is preserved |

**Task agent must log:**
- All commands executed with their outputs
- Configuration decisions with rationale
- Errors encountered and how they were resolved
- Deviations from the plan with justification

**Log rules:**
- **Write immediately** — flush each entry to disk after action completes (enables `tail -f`)
- Append only — never modify prior entries
- Timestamp all entries
- Include enough detail to reproduce the work

---

# Process

## Orchestrator Protocol

The orchestrating agent must coordinate execution across tasks.

**Before spawning a task agent, the orchestrator must:**
1. Read `execution-state.md` to determine current state
2. Identify the next task to execute (respecting dependencies)
3. Read prior `result.md` files only as needed to gather context values for handoff
4. Write `handoff.md` for the target task
5. Update `execution-state.md` to mark task as `in_progress`
6. Spawn task agent in background with clear scope

**After task agent returns, the orchestrator must:**
1. Read the task's `result.md`
2. Verify status and required values are present
3. Update `execution-state.md` with new status (`completed`, `failed`, or `blocked`)
4. If failed or blocked, decide: retry, skip, or abort
5. If completed, proceed to next task

**Background execution rules:**
- Task agents must run in the background to preserve orchestrator context
- The `max_commands` constraint prevents runaway agents
- Orchestrator can monitor progress or work on other tasks while agents execute
- Use `TaskOutput` to retrieve results when agents complete

**Parallel execution rules:**
- Tasks with no dependencies on each other may execute concurrently
- Each task must have its own directory to prevent write conflicts
- Orchestrator must wait for all parallel tasks before proceeding to dependent tasks

**Orchestrator token management:**
- The orchestrator must be stateless enough to be replaced at any time
- All progress is externalized to `execution-state.md` — the orchestrator holds no unique state
- When approaching token limits, the orchestrator should checkpoint and terminate
- A fresh orchestrator can resume by reading `execution-state.md`
- Orchestrator should avoid accumulating task details; delegate to task agents

**Orchestrator handoff (when approaching token limit):**
1. Ensure `execution-state.md` is current
2. Ensure any in-progress task has its `handoff.md` written
3. Terminate current orchestrator
4. Spawn fresh orchestrator with prompt: "Resume execution of [plan]. Read execution-state.md to continue."

---

## Task Agent Protocol

Each task agent must execute a single task in isolation.

**On receiving a task, the agent must:**
1. Read `handoff.md` from the task directory
2. Note the `max_commands` limit and `fallback_behavior` rules
3. Read the relevant section of the plan for detailed requirements
4. Execute the task, appending to `execution.log`
5. Capture all required output values
6. Write `result.md` with status, values, and summary
7. Return summary to orchestrator

**Command budget rules:**
- Agent must track command count against `max_commands` limit
- When approaching limit, agent must conclude with available data
- If data is unavailable, agent must check `fallback_behavior` for guidance
- If no fallback specified, agent must document "unavailable" and proceed
- Agent must never retry the same approach more than twice

**Scope constraints:**
- Agent must execute only the assigned task
- Agent must write only to the assigned task directory
- Agent must not read or modify other task directories
- Agent must not assume values not provided in handoff

---

## Validation Gate

A task is not complete until ALL validation criteria from the plan are verified. This is the most common source of execution failures.

**Before marking a task complete, the agent must:**
1. Read the task's validation criteria from the plan
2. Execute each validation check explicitly
3. Document the result of each check in the execution log
4. Only set `status: completed` if ALL checks pass

**Validation documentation in result file:**
```markdown
## Validation

| Criterion | Result | Evidence |
|-----------|--------|----------|
| Service responds on port 8000 | PASS | curl returned 200 OK |
| Config file contains API key | PASS | grep confirmed key present |
| User can authenticate | FAIL | 401 Unauthorized |
```

**If any validation fails:**
- Do not mark the task complete
- Set `status: failed` with the failing criterion
- Document what was attempted and what failed
- Let orchestrator decide whether to retry or abort

**Common validation oversights:**
- Checking that a service started but not that it responds correctly
- Creating a config file but not verifying all required fields are present
- Installing software but not verifying it's in PATH or accessible
- Creating users but not testing they can actually authenticate

---

## Resumption Protocol

When resuming a partially-completed plan, the orchestrator must:

1. Read `execution-state.md` to get current status of all tasks
2. Identify tasks by status:
   - `pending` → not started
   - `completed` → done
   - `failed` → needs attention
   - `blocked` → needs resolution
   - `in_progress` → may have been interrupted (check result.md)
3. For `in_progress` tasks, check if `result.md` exists (agent may have completed before state was updated)
4. For failed tasks, read `result.md` errors and decide: retry or abort
5. Continue from the first incomplete task (respecting dependencies)
6. Read prior `result.md` files only as needed to gather values for handoffs

**Resume rules:**
- Orchestrator must never re-execute completed tasks unless explicitly requested
- Failed tasks may be retried after fixing the issue
- Blocked tasks require manual intervention before proceeding
- If `execution-state.md` is missing, fall back to scanning `result.md` files to rebuild state

---

## Value Passing Between Tasks

Values must flow from early tasks to later tasks through the orchestrator.

**Flow:**
1. Task N must capture values in its `result.md`
2. Orchestrator must read Task N's result
3. Orchestrator must include relevant values in Task N+1's `handoff.md`
4. Task N+1 must use values from its handoff context

**Value naming rules:**
- Use consistent, descriptive key names
- Document the source task for traceability
- Include units where applicable (e.g., `memory_gb`, `port_number`)

**Required values (must always be captured):**
- IP addresses and hostnames
- Ports and endpoints
- Version numbers of installed software
- File paths of created configurations
- Generated identifiers (not secrets themselves)

---

## Failure Handling

When a task fails:

**Task agent must:**
- Log the failure with complete error information
- Log any partial progress made
- Set `status: failed` in result file
- Include errors array with actionable messages
- Return failure summary to orchestrator

**Orchestrator must:**
- Read the failure details
- Decide: retry the task, skip it, or abort the plan
- If retrying, update handoff with adjusted context
- If aborting, document the reason

**Recovery rules:**
- A failed task's directory must remain intact for debugging
- Retry must write a new result file (overwrites previous)
- The execution log must preserve history of all attempts

---

## Post-Execution Verification

After all tasks complete, the orchestrator must verify the plan achieved its overall objective, not just that individual tasks passed.

**End-to-end verification must:**
- Test the complete user workflow, not just component health checks
- Verify config files are complete and functional (not just present)
- Confirm integrations work across component boundaries
- Document any gaps between task validation and real-world usage

**Verification scope:**
- Individual task validation confirms components work in isolation
- Post-execution verification confirms components work together
- Both are required for a plan to be considered successful

**If post-execution verification fails:**
- Document which integration or workflow failed
- Identify which task(s) produced incomplete results
- Create follow-up tasks to address gaps
- Do not close the plan as successful until verification passes

---

## Rollback Verification

Plans with rollback procedures must verify those procedures actually work.

**Before declaring a plan complete:**
- If the plan includes rollback procedures, test at least one
- Document the rollback test in the execution result
- If rollback fails, fix the procedure and re-test

**Rollback testing is optional when:**
- The plan is additive-only (no destructive changes)
- Rollback would cause unacceptable disruption
- The plan explicitly marks rollback as "document-only"

**When rollback testing is skipped:**
- Document why in the execution result
- Flag rollback procedures as "untested"

---

## Anti-Patterns (FORBIDDEN)

- **Writing to shared files** — Each agent writes only to its own directory
- **Storing state in memory only** — Files are the persistence layer
- **Skipping handoff files** — Always read handoff before acting
- **Modifying other task directories** — Strict directory ownership
- **Unstructured result files** — Use the specified frontmatter schema
- **Executing without logging** — All work must be recorded
- **Assuming context not in handoff** — Trust the handoff, verify if uncertain
- **Parallel writes to same directory** — One agent per task directory
- **Ignoring dependencies** — Always respect task dependency order
- **Marking complete without full validation** — Every criterion must be checked and documented
- **Assuming human tasks will be noticed** — Explicitly flag and block on human intervention
- **Using untested success criteria** — Validation targets must be based on real benchmarks
- **Orchestrator holding unique state** — All progress must be in execution-state.md, never only in context
- **Running orchestrator to token exhaustion** — Checkpoint and hand off before hitting limits

---

## Sources

This standard incorporates patterns from:
- Actor model with mailboxes for agent isolation
- Event sourcing for append-only execution logs
- Swarm handoff primitives for agent coordination

**Version 2 updates** based on Phase 1 execution lessons (see `research/phase1-execution-gaps-analysis.md`):
- Added validation gate requirements (Core Rule 7, Validation Gate section)
- Added human intervention task handling
- Added post-execution and rollback verification
- Enhanced plan requirements for realistic validation and rollback
- Added anti-patterns for common execution failures
- Replaced `execution-plan.md` (full plan copy) with `execution-state.md` (lightweight tracker)
- Updated orchestrator/resumption protocols to use state file for token efficiency
- Added orchestrator token management and handoff protocol (Core Rule 8)

---

**This standard ensures implementation plans can be executed reliably across multiple agents and context windows with clear contracts and no state corruption.**
