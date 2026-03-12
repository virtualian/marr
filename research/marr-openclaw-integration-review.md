# MARR/OpenClaw Integration Review

**Date:** 2026-02-13
**Author:** Viki (PAI)
**Subject:** Audit of `@virtualian/marr` v3.5.0 against OpenClaw (formerly Clawdbot/Moltbot)

---

## Executive Summary

MARR (Making Agents Really Reliable) is a two-layer configuration system for AI coding agents that provides trigger-based, validated standards. This review maps MARR's 9 standards to OpenClaw equivalents, identifies a fundamental layer mismatch (MARR governs agents; OpenClaw IS the agent), and proposes an integration path through OpenClaw's workspace and skill systems.

**Key finding:** OpenClaw and MARR operate at different architectural layers. PAI wraps Claude Code (same runtime, governance layer on top). OpenClaw IS its own runtime — a persistent Gateway with its own tool system, session model, and messaging layer. MARR cannot integrate via `@`-imports (OpenClaw doesn't use Claude Code's CLAUDE.md loading). Instead, integration must flow through AGENTS.md injection or a standards-aware skill.

---

## 1. MARR Standards vs OpenClaw — Full Map

MARR ships 9 standards in `resources/project/common/`. Each is a markdown file with YAML frontmatter defining triggers, scope, and version.

| # | MARR Standard | OpenClaw Equivalent | Status |
|---|---|---|---|
| 1 | **Development Workflow** (STOP-GATE, issue types, release mgmt) | AGENTS.md has coding conventions and PR_WORKFLOW.md for OpenClaw contributors. But no STOP-GATE enforcement, no issue taxonomy, no release process for user projects. OpenClaw governs its own repo, not the user's. | **GAP** |
| 2 | **Version Control** (branch naming, squash merge, commit format, branch lifetime) | AGENTS.md enforces Conventional Commits, scoped staging via `scripts/committer`, multi-agent git safety ("never create/apply/drop stash unless requested"). But these are self-governance rules, not user-project standards. No branch naming policy, no lifetime enforcement. | **GAP** |
| 3 | **Testing** (behavior-focused, coverage philosophy) | Vitest with 70-80% coverage thresholds, TDD encouraged, TestPilot skill for auto-generating tests. But these apply to OpenClaw development, not user projects. No behavioral testing methodology standard imposed on users. | **GAP** (different paradigm) |
| 4 | **Documentation** (Diataxis: how-to/reference/explanation) | Skills require README.md, API.md, EXAMPLES.md, CONTRIBUTING.md. Docs hosted on Mintlify. But no Diataxis enforcement, no organizational standard for user project documentation. | **GAP** |
| 5 | **MCP Usage** (tool specificity, verification) | 8 core tools with hierarchical policy chains (Tool Profile -> Provider -> Global -> Agent -> Sandbox). Tool permission tiers (freely permitted vs requires approval). Sandbox isolation via Docker. MCP not native but available via community bridges (`openclaw-mcp`, `mcporter`). | **PARTIAL** |
| 6 | **UI/UX** (WCAG, mobile-first, accessibility) | Rich multi-channel UX (WhatsApp, Telegram, Slack, Discord, web, native apps). Canvas/A2UI for interactive HTML. Semantic Snapshots for browser interaction. But no WCAG enforcement, no accessibility standard, no mobile-first policy for user projects. | **GAP** |
| 7 | **Writing Prompts** (meta-standard for writing standards) | SOUL.md + AGENTS.md + SKILL.md format define how to write agent-facing content. The skill system has structural conventions (YAML frontmatter, directory layout). But no formal meta-standard for writing standards documents. | **PARTIAL** |
| 8 | **Plan Execution** (multi-agent coordination, file-based handoff) | Lane Queue system with per-session FIFO ordering. Cron/webhook/heartbeat automation. Multi-agent routing with deterministic bindings. Inter-session communication tools (`sessions_send`, `sessions_spawn`). But fundamentally different paradigm: runtime orchestration with persistent sessions vs file-based handoff with replaceable orchestrators. | **PARTIAL** (different paradigm) |
| 9 | **User Config** (Portability Test for scoping) | Per-agent workspace isolation (separate AGENTS.md, SOUL.md, memory per agent). Global `openclaw.json` with defaults-with-overrides pattern. But scoping is agent-based, not project-based. No portability test concept. No user/project separation equivalent. | **PARTIAL** |

**Score: 0 COVERED, 5 GAP, 4 PARTIAL** — OpenClaw has zero standards fully covered. This is expected: OpenClaw is an agent runtime, not a standards framework. The gaps reflect a layer mismatch, not missing features.

### What MARR Has That OpenClaw Doesn't

1. **Conditional activation via triggers** — Standards fire only when the agent's current task matches trigger conditions. OpenClaw's AGENTS.md is always-loaded; there is no mechanism for context-sensitive rule activation. This is the single largest gap.

2. **Formal development workflow for user projects** — STOP-GATE, issue type taxonomy, release management. OpenClaw governs its own development process but imposes no workflow on users' projects.

3. **Cross-project sync** — `marr sync` propagates standards between repos with diff review. OpenClaw has no equivalent; its isolation model is per-agent, not per-project.

4. **Schema-validated standards** — Zod-enforced frontmatter, structural validation, conflict detection between rules. OpenClaw validates its own config schema (`openclaw.json`) but has no validation for behavioral rules in AGENTS.md.

5. **Conflict detection** — Semantic analysis catching contradictions between user config and project standards. OpenClaw has tool policy precedence chains (deny wins), but no semantic conflict detection for behavioral rules.

6. **The Portability Test** — MARR's principle for deciding whether config is user-portable or project-specific. OpenClaw's agent isolation achieves a similar outcome by different means, but the explicit test as a design principle is absent.

### What OpenClaw Has That MARR Doesn't

1. **A complete agent runtime** — MARR configures agents; OpenClaw IS the agent. Gateway, sessions, tool execution, memory, messaging — the full stack from LLM inference to WhatsApp delivery.

2. **Persistent cross-session memory** — SQLite vector search with hybrid BM25/embedding retrieval. Daily logs, curated MEMORY.md, auto-compaction with pre-flush memory save. MARR is stateless between sessions.

3. **Autonomous execution** — Heartbeat polling, cron scheduling, webhook triggers, proactive notifications. MARR standards are passive documents; OpenClaw acts independently of user prompts.

4. **Multi-channel messaging** — WhatsApp, Telegram, Slack, Discord, Signal, iMessage, MS Teams, Google Chat, Matrix, web, CLI, native apps. MARR operates only within Claude Code's terminal.

5. **Multi-agent orchestration** — Per-agent workspace isolation, deterministic routing bindings, inter-session communication, sandbox isolation via Docker. MARR has no multi-agent awareness.

6. **ClawHub marketplace** — 5,700+ community-built skills with vector search, versioning, and ranking. MARR has no distribution mechanism beyond npm and `marr sync`.

7. **Identity system** — SOUL.md (personality), USER.md (human context), IDENTITY.md (presentation layer) as separate concerns. MARR bundles identity into user config without formal separation.

8. **Tool policy chains** — Hierarchical permission system (Tool -> Provider -> Global -> Agent -> Group -> Sandbox) with deny-wins precedence. MARR has no tool governance.

---

## 2. Standards as a Skill — Wrong Abstraction

**Recommendation: No.** Skill is the wrong abstraction for MARR standards in OpenClaw.

### First-Principles Reasoning

**What an OpenClaw Skill IS:** A SKILL.md file with YAML frontmatter, optional scripts, and references that teaches the agent HOW to perform a specific task. Skills are discoverable, installable (via ClawHub), and provide capabilities. You install a "coding-agent" skill and gain structured development guidance.

**What a MARR Standard IS:** A conditional rule set that constrains agent behavior when specific triggers match. Standards don't teach how to DO something — they constrain HOW something must be done. "Use squash merge" is a constraint, not a capability.

Packaging a MARR standard as an OpenClaw skill means the skill contains a markdown file saying "follow these rules when doing version control." That's a standard wearing a skill costume — the same problem PAI had with Diataxis-as-Pack.

### Why Other OpenClaw Primitives Also Don't Fit

| Primitive | Why Not |
|---|---|
| **AGENTS.md** | Closest match, but always-loaded (no conditional activation). Adding all 9 MARR standards to AGENTS.md bloats the system prompt. OpenClaw loads AGENTS.md on every session start regardless of task. |
| **SOUL.md** | Identity and personality. Standards are behavioral rules, not identity. |
| **HEARTBEAT.md** | Periodic checklist, not task-context-sensitive. Standards need to activate based on WHAT the agent is doing, not WHEN it checks in. |
| **Cron/Webhooks** | Time- or event-driven triggers. MARR triggers are semantic ("WHEN working with git branches"), not temporal. |
| **Skill** | Skills teach capabilities. Standards constrain behavior. Different primitive types. |

### The Gap

OpenClaw needs a conditional rule system — behavioral constraints that:
- Activate only when the agent's current task matches trigger conditions
- Contain enough detail to be binding (not principle-level platitudes)
- Can be scoped per-project or per-agent
- Are distinct from always-on AGENTS.md governance

### OpenClaw's Abstraction Landscape

| OpenClaw Primitive | Activation | Scope | Detail Level |
|---|---|---|---|
| AGENTS.md | Always loaded | Per-agent | Operational rules |
| SOUL.md | Always loaded | Per-agent | Identity/personality |
| Skill (SKILL.md) | Discovered/invoked | Per-agent + ClawHub | Capability instruction |
| Cron/Webhook | Time/event | Per-agent | Task scheduling |
| Heartbeat | Periodic polling | Per-agent | Routine checklist |
| **Standard (missing)** | **Trigger-matched** | **Per-agent or per-project** | **Detailed constraints** |

That missing row is what MARR provides. OpenClaw needs to adopt this concept, just as PAI does.

---

## 3. Agent-Level vs Project-Level Configuration

### The Problem

OpenClaw's isolation model is per-AGENT, not per-project. Each agent gets its own workspace (`~/.openclaw/agents/<agentId>/`) with separate AGENTS.md, SOUL.md, memory, and sessions. But there is no mechanism for "when working in THIS repository, activate THESE standards."

This is a fundamental architectural difference from both PAI and MARR:
- **MARR** scopes standards per-project (`.claude/marr/` in each repo)
- **PAI** is proposing per-project config (`.pai/` in each repo)
- **OpenClaw** scopes config per-agent (each agent has its own workspace)

### Three Options Evaluated

#### Option A: Embed standards in AGENTS.md (minimal change)

Append MARR standard content directly to the agent's AGENTS.md file:

```markdown
# AGENTS.md (existing content)
...

## MARR Standards
### Version Control
- Always squash merge
- Branch naming: {issue}-{description}
- Maximum branch lifetime: 5 days
...
```

**Pros:** No new primitives. Works immediately. AGENTS.md is already the behavioral rules file.
**Cons:** Always-loaded (token waste). No conditional activation. No project-scoping — the agent applies these rules to ALL projects. No validation. Manual maintenance.

#### Option B: Standards-aware skill with workspace detection (moderate)

A dedicated skill that:
1. Detects the current working directory
2. Looks for `.marr/` or `.claude/marr/` config
3. Reads trigger conditions from installed standards
4. Injects relevant standards into the current session context

```
~/.openclaw/agents/main/skills/
  marr-standards/
    SKILL.md          # Skill that reads and applies MARR standards
    scripts/
      evaluate-triggers.ts  # Checks which standards apply
```

**Pros:** Conditional activation (via skill logic). Project-aware (reads from repo). Leverages existing skill infrastructure. Installable via ClawHub.
**Cons:** Skill invocation is not automatic — the agent must know to use it. Still a "standard wearing a skill costume" but with active trigger evaluation. Depends on the skill being installed.

#### Option C: Native standard primitive in OpenClaw (recommended)

Add a `standards/` directory to the agent workspace alongside AGENTS.md:

```
~/.openclaw/agents/main/
  AGENTS.md
  SOUL.md
  USER.md
  MEMORY.md
  standards/              # NEW
    version-control.md
    testing.md
    documentation.md
```

Standards are markdown files with YAML frontmatter (trigger conditions, scope, version). The Gateway's context assembly phase evaluates triggers against the current task and injects matching standards into the system prompt.

**Pros:** First-class conditional activation. Per-agent scoping (different agents get different standards). Compatible with MARR format. Gateway handles trigger evaluation natively. No skill invocation required.
**Cons:** Requires OpenClaw core changes. New primitive to maintain. Gateway must understand trigger semantics.

### Recommendation: Option C (with Option B as bridge)

Option C is the right long-term architecture. Option B works as an immediate bridge — a ClawHub skill that reads MARR standards from the current project directory and applies them contextually. When OpenClaw adopts native standards support, the skill becomes unnecessary.

**Key design decision:** Standards in the agent workspace use the same YAML frontmatter format as MARR (triggers, scope, version). This enables:
- Direct import from MARR's standard library
- `marr sync` compatibility (sync standards to OpenClaw's workspace)
- Format consistency across PAI, MARR, and OpenClaw ecosystems

---

## 4. Integration Proposal

### What Gets Absorbed Into OpenClaw

| MARR Concept | OpenClaw Integration | How |
|---|---|---|
| **Trigger-based standards** | New workspace primitive: `standards/` directory | Markdown files with YAML frontmatter. Stored in agent workspace. Gateway evaluates triggers during context assembly. |
| **User/Project scoping** | **Project detection in context assembly** | Gateway checks current working directory for `.marr/standards/` or `.claude/marr/standards/`. Loads project-specific standards alongside agent-level standards. |
| **Portability Test** | **Agent vs project standard placement** | Agent workspace standards = portable (follow the agent). Project directory standards = project-specific (stay with the repo). |
| **Standard content** | **Seed standards for ClawHub** | MARR's 9 standards converted to OpenClaw-compatible format and published to ClawHub as a standards pack. |
| **Conflict detection concept** | **Tool policy extension** | Extend OpenClaw's existing tool policy chain to include standard-level constraints. Deny-wins precedence already exists for tools; extend to behavioral rules. |

### What Stays Separate

| MARR Concept | Why Separate |
|---|---|
| **`marr` CLI tool** | Platform-agnostic. Works with Claude Code, Cursor, Copilot — not tied to OpenClaw. OpenClaw users can use `marr init` to create standards, then place them in their agent workspace. |
| **`marr sync`** | Cross-project sync operates at the filesystem level. OpenClaw agents can consume synced standards without knowing about the sync mechanism. |
| **`marr doctor`** | Conflict resolution is MARR CLI functionality. OpenClaw would need its own conflict detection tuned to its AGENTS.md + standards interaction. |
| **`@` import mechanism** | Claude Code-specific. OpenClaw uses its own workspace file loading, not `@`-imports. |
| **`marr validate`** | Structural validation could be replicated in OpenClaw's existing Zod schema system, but `marr validate` works independently. |

### New OpenClaw Primitives Needed

#### 1. Standard (Workspace Primitive)

A conditional, trigger-based rule set that activates when the current task matches.

```markdown
~/.openclaw/agents/main/standards/version-control.md
---
marr: standard
version: 1
title: Version Control Standard
scope: All git operations, branching, commits, and GitHub configuration
triggers:
  - WHEN working with git branches, commits, or merges
  - WHEN creating or reviewing pull requests
  - WHEN configuring repository settings
---

# Version Control Standard

[Detailed rules here...]
```

**Characteristics:**
- Conditional (trigger-matched during context assembly, not always-loaded)
- Per-agent AND per-project (agent workspace standards + project directory standards)
- Detailed (full specification, not AGENTS.md-level operational rules)
- Schema-validated (YAML frontmatter with required fields, validated by Zod)
- Binding (violations are errors, not suggestions)

#### 2. Context Assembly Enhancement

The Gateway's context assembly phase (`src/agents/piembeddedrunner.ts`) currently loads:
1. IDENTITY.md -> 2. SKILLS.md -> 3. MEMORY.md -> 4. Discovered skills

Add step 2.5: **Standard evaluation**
1. Load standards from `standards/` directory
2. Evaluate trigger conditions against the current message/task
3. Inject matching standards into the system prompt
4. Optionally check project directory for project-scoped standards

#### 3. ClawHub Standards Category

Extend ClawHub to support a "standards" category alongside skills:

```
openclaw skill search --type standard "version control"
openclaw skill install marr-version-control --type standard
```

Standards install to `standards/` instead of `skills/`. Same YAML frontmatter format, different activation semantics.

### Architecture After Integration

```
┌──────────────────────────────────────────────────────┐
│              OpenClaw (post-integration)               │
├──────────────────────────────────────────────────────┤
│                                                        │
│  GATEWAY (always active)                               │
│  ├── Message routing + session management              │
│  ├── Tool execution + sandbox isolation                │
│  ├── Context assembly (enhanced with standards)  MOD   │
│  └── Lane Queue + concurrency control                  │
│                                                        │
│  PER-AGENT (workspace)                                 │
│  ├── AGENTS.md (operational rules, always-loaded)      │
│  ├── SOUL.md (identity/personality)                    │
│  ├── USER.md (human context)                           │
│  ├── MEMORY.md + daily logs + vector search            │
│  ├── skills/ (capabilities)                            │
│  └── standards/ (trigger-matched rules)          NEW   │
│                                                        │
│  PER-PROJECT (detected from working directory)         │
│  ├── .marr/standards/ or .claude/marr/standards/       │
│  └── Project-scoped standards override agent defaults  │
│                                                        │
│  DISTRIBUTION (ClawHub)                                │
│  ├── Skills (5,700+ capabilities)                      │
│  └── Standards (new category)                    NEW   │
│                                                        │
│  EXTERNAL TOOLS (separate, interoperable)              │
│  └── MARR CLI (init, sync, doctor, validate)           │
│                                                        │
└──────────────────────────────────────────────────────┘
```

### Migration Path

| Phase | Work | Dependencies |
|---|---|---|
| 1 | **Bridge skill:** Build a ClawHub skill (`marr-standards`) that reads `.marr/standards/` from the current project directory and injects matching standards | None |
| 2 | **Standard format:** Adopt MARR's YAML frontmatter schema (`marr: standard`, version, title, scope, triggers) as the OpenClaw standard format | None |
| 3 | **Workspace support:** Add `standards/` directory to agent workspace, loaded during context assembly | Phase 2 |
| 4 | **Trigger evaluation:** Implement semantic trigger matching in the Gateway's context assembly phase | Phase 3 |
| 5 | **ClawHub category:** Add "standards" as a new category in ClawHub alongside skills | Phase 2 |
| 6 | **Project detection:** Enhance context assembly to check current working directory for project-scoped standards | Phase 3 |

Phase 1 provides immediate value — a ClawHub skill that any OpenClaw user can install today to get MARR standard support. Phases 2-6 build native support over time.

MARR CLI continues to exist for cross-platform use (Claude Code, Cursor, Copilot). OpenClaw users can use `marr init` to create standards and `marr sync` to propagate them, then place standards in their agent workspace.

---

## 5. Key Differences from PAI Integration

This review deliberately mirrors the MARR/PAI integration review. But the integration story is fundamentally different:

| Dimension | PAI Integration | OpenClaw Integration |
|---|---|---|
| **Layer relationship** | Same layer (both wrap Claude Code) | Different layers (MARR governs; OpenClaw is governed) |
| **Loading mechanism** | Hook injection (LoadContext at SessionStart) | Context assembly in Gateway runtime |
| **Integration entry point** | `.pai/` directory with `project.json` | Agent workspace `standards/` + project directory detection |
| **Conditional activation** | Hook evaluates triggers | Gateway evaluates triggers during context assembly |
| **Distribution** | No marketplace; manual install | ClawHub as standards distribution channel |
| **Scoping model** | Per-project (`.pai/` per repo) | Per-agent (workspace) + per-project (working directory) |
| **Bridge mechanism** | LoadContext hook reads `.pai/project.json` | Bridge skill reads `.marr/standards/` from CWD |
| **Config format** | `project.json` (JSON) + standards (markdown) | `openclaw.json` (JSON5) + standards (markdown) |

**The fundamental insight:** PAI and OpenClaw both need the same missing primitive (conditional, trigger-based standards), but they need it for different reasons. PAI needs it because its governance layer (Steering Rules) is too coarse-grained. OpenClaw needs it because its governance layer (AGENTS.md) is always-on with no conditional path. The solution is architecturally different but conceptually identical.

---

## Key Takeaways

1. **OpenClaw has zero MARR standards fully covered.** This is not a deficiency — it reflects a layer mismatch. MARR governs agent behavior; OpenClaw IS the agent. They solve different problems.

2. **Standards should not be skills.** Skills teach capabilities; standards constrain behavior. OpenClaw needs a native `standards/` workspace primitive, just as PAI needs a native Standard primitive.

3. **OpenClaw's per-agent isolation model creates a scoping gap.** MARR and PAI are per-project; OpenClaw is per-agent. Integration requires both agent-level standards (portable with the agent) and project-level standards (detected from the working directory).

4. **A ClawHub bridge skill provides immediate value.** A skill that reads MARR standards from the current project directory and evaluates triggers against the current task gives OpenClaw users standards support today, without waiting for core changes.

5. **The trigger-based lazy loading pattern is MARR's key innovation** — and it's missing from both PAI and OpenClaw. Both systems load behavioral rules unconditionally (PAI's Steering Rules, OpenClaw's AGENTS.md). Both need conditional activation.

6. **OpenClaw's autonomous execution creates unique integration opportunities.** Heartbeat + cron could periodically validate standard compliance across projects — something neither PAI nor MARR can do today. An agent that proactively checks "are my projects following their standards?" is a capability only an always-on runtime can provide.

7. **MARR, PAI, and OpenClaw are complementary at three different layers.** MARR provides the standards content and cross-platform sync. PAI provides the cognitive execution framework (Algorithm, ISC, thinking tools). OpenClaw provides the persistent agent runtime (Gateway, sessions, memory, messaging). A complete stack uses all three.
