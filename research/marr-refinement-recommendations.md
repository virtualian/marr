# MARR Refinement Recommendations

**Date:** 2026-02-13
**Author:** Viki (PAI)
**Subject:** How MARR should refine its own architecture to integrate with PAI and OpenClaw while remaining independent

---

## Premise

Two integration reviews exist — MARR/PAI and MARR/OpenClaw. Both ask the wrong question. They ask: "What should PAI/OpenClaw absorb from MARR?" The right question is: **What should MARR refine about itself to be a better integration partner — without losing its independence?**

MARR is a governance substrate. It publishes well-formed, validated, contextually-activated behavioral constraints that any agent system can consume. It is not part of PAI. It is not part of OpenClaw. It sits between a human's intent ("how I want agents to behave") and a host system's execution model ("how the agent actually runs").

This document recommends structural refinements to MARR itself. No changes to PAI or OpenClaw are proposed. Host systems build their own integrations; MARR makes that easier.

---

## 1. MARR's Structural Identity (Above the Content)

MARR ships 9 standards today. The specific standards are content — replaceable, evolving, growing. What matters architecturally are the **7 structural primitives** that make MARR more than "paste rules into your system prompt":

| # | Primitive | Essential Function |
|---|---|---|
| 1 | **Trigger System** | Conditional activation — map "what the agent is doing" to "which standards apply" |
| 2 | **Two-Layer Config** | Separate user-portable preferences from project-specific constraints |
| 3 | **Schema Validation** | Structural correctness — type system for governance documents |
| 4 | **Conflict Detection** | Semantic consistency — find contradictions between rules |
| 5 | **Cross-Project Sync** | Standards as distributable, versionable units across repos |
| 6 | **Standard Format** | Markdown + YAML frontmatter — human-readable, machine-parseable, host-agnostic |
| 7 | **Platform Agnosticism** | Works with any AI coding agent, not locked to one |

These primitives are the architecture. The 9 standards are instances. Refinements target the primitives.

---

## 2. The Core Tension

MARR's seven primitives reveal a single architectural tension: **governance intelligence vs host simplicity.**

- The more intelligence MARR embeds (semantic triggers, LLM-based conflict detection, section-level loading), the more it demands from the host system.
- The simpler MARR keeps its host requirements, the less value it provides over "just paste your rules into the system prompt."

The resolution: **capability tiers and protocol-based integration.** MARR defines sophisticated protocols but always provides simpler fallbacks. Hosts opt into the level of integration they can support. Value scales with integration depth but never requires it.

---

## 3. What MARR Must Not Become

To stay independent, MARR must resist becoming:

1. **An agent runtime** — MARR governs; it does not execute. The moment MARR runs tools, manages sessions, or orchestrates agents, it competes with its hosts.
2. **A configuration management system** — MARR distributes standards, not arbitrary config. Not Ansible for AI agents.
3. **A testing framework** — MARR defines testing standards but does not execute tests.
4. **A platform abstraction layer** — MARR's integration interface is not a universal agent API. MARR does not try to make all agents look the same.

---

## 4. Refinement Recommendations

Six refinements, in priority order. Each targets MARR's own architecture.

### 4.1 Ship a Standards Manifest

**Priority: Immediate (v3.6)**

**Problem:** MARR's standards live inside the npm package at `resources/project/common/`. External systems can only access them by installing the CLI globally and running `marr init`, or by extracting the npm tarball. Neither is friendly for programmatic consumption.

**Refinement:** Generate a `standards.json` manifest alongside each release — a machine-readable index of all bundled standards with their frontmatter metadata.

```json
{
  "marr": "3.6.0",
  "standards": [
    {
      "id": "marr:version-control",
      "title": "Version Control Standard",
      "version": 1,
      "scope": "All git operations, branching, commits, and GitHub configuration",
      "triggers": [
        "WHEN working with git branches, commits, or merges",
        "WHEN creating or reviewing pull requests"
      ],
      "filename": "prj-version-control-standard.md",
      "hash": "sha256:a1b2c3..."
    }
  ]
}
```

**What this enables:**
- PAI's LoadContext hook can discover standards without parsing every `.md` file
- OpenClaw's Gateway can index standards during startup
- Any system can programmatically determine which standards exist and what they govern
- Content hashes enable change detection without reading full files

**What this does NOT do:** It does not distribute standards into PAI or OpenClaw. They fetch the manifest and decide what to do with it.

### 4.2 Define a Trigger Evaluation Contract

**Priority: High (v3.7)**

**Problem:** MARR triggers are natural-language strings (`WHEN working with git branches`). This works when the LLM evaluates them inline, but fails for deterministic hosts. PAI's hooks run in under 100ms and need fast evaluation. OpenClaw's Gateway assembles context BEFORE the LLM sees the message — there is no LLM available at trigger-evaluation time.

**Refinement:** Formalize trigger evaluation as a contract with three components:

**A. The contract itself:**

```
Input:  { triggers: string[], taskContext: { message, tools?, files?, metadata? } }
Output: { matches: { standardId, confidence }[] }
```

Hosts implement evaluation however they want — LLM inference, keyword matching, embeddings, regex. MARR defines what goes in and what comes out.

**B. Optional structured hints in frontmatter:**

```yaml
triggers:
  - text: WHEN working with git branches, commits, or merges
    keyword_hints: [git, branch, commit, merge, rebase, cherry-pick]
    tool_hints: [Bash]
```

The natural-language string remains canonical. The `keyword_hints` and `tool_hints` are optional accelerators for deterministic evaluators. Existing standards work without them. New standards can include them.

**C. Test fixtures:**

A JSON file of evaluation test cases — "given this task description, these standards should match." This is MARR's way of defining trigger semantics without shipping an evaluator. Hosts can run the test fixtures against their own implementation to verify conformance.

```json
{
  "fixtures": [
    {
      "task": "Create a feature branch for the login refactor",
      "should_match": ["marr:version-control", "marr:development-workflow"],
      "should_not_match": ["marr:documentation", "marr:ui-ux"]
    }
  ]
}
```

**Why test fixtures matter:** Without them, every host interprets triggers differently. PAI might activate version-control when it sees a Bash tool call containing "git." OpenClaw might activate it only when the user's message contains "branch." Same triggers, different behavior. The fixtures are MARR's way of saying "this is what should match" without dictating how.

### 4.3 Ship a Reference Evaluator

**Priority: Medium (v3.8)**

**Problem:** If MARR only defines the contract, every host reimplements the same basic keyword matching. That is wasteful duplication.

**Refinement:** Ship a single pure function as `@virtualian/marr/evaluate`:

```typescript
export function evaluateTriggers(
  taskDescription: string,
  standards: StandardMeta[]
): MatchResult[];
```

**Constraints:**
- Pure function, zero side effects, zero dependencies beyond MARR itself
- Keyword-based matching as baseline (extract keywords from trigger text, score overlap with task description)
- NOT a runtime dependency — hosts CAN use it, or CAN implement their own
- Think of it as a reference implementation: the spec defines behavior, this demonstrates it

**What this is NOT:** This is not an adapter. It knows nothing about PAI hooks or OpenClaw Gateways. It operates on MARR's own concepts (standard metadata, trigger text, task description). Hosts call it from their own integration code.

### 4.4 Add Stable Standard Identifiers

**Priority: Medium (v3.6, alongside manifest)**

**Problem:** Standards are referenced by filename (`prj-version-control-standard.md`). Filenames can change across versions. Host systems that reference standards need stable identifiers.

**Refinement:** Add an `id` field to frontmatter:

```yaml
---
marr: standard
id: marr:version-control
version: 1
title: Version Control Standard
---
```

Identifiers are stable across MARR versions. Filenames can change; identifiers cannot. The manifest references standards by id. Host systems configure active standards by id, not filename.

### 4.5 Define Integration Conformance Levels

**Priority: Lower (v4.0, after real integrations exist)**

**Problem:** Without defined conformance levels, "MARR-compatible" is meaningless. A host that loads standards as static text and a host that evaluates triggers, detects conflicts, and syncs across projects both claim compatibility.

**Refinement:** Three levels with conformance test suites:

| Level | Name | Requirements | Example Hosts |
|---|---|---|---|
| **0** | File Consumer | Parse YAML frontmatter, present standards to agent | Cursor, Copilot |
| **1** | Trigger Evaluator | Level 0 + evaluate triggers against task context, select matching standards | PAI (hooks), OpenClaw (Gateway) |
| **2** | Full Integration | Level 1 + conflict detection, schema validation, cross-project sync | PAI + OpenClaw at maturity |

Each level has a conformance test suite (input/output pairs in JSON). Hosts declare their level and run the tests to prove it.

**Why defer:** Conformance levels derived from speculation are fragile. Derive them from real-world PAI and OpenClaw integrations. See what actually works, then codify.

### 4.6 Tag Directives by Enforcement Tier

**Priority: Future (v4.x, informed by real usage)**

**Problem:** MARR standards contain directives with different enforcement requirements. STOP-GATE requires runtime blocking (check current branch, halt if on main). "Use squash merge" requires only LLM compliance. Hosts cannot tell which is which.

**Refinement:** Categorize directives:

| Tier | Name | What It Needs | Example |
|---|---|---|---|
| **context** | Context-only | LLM reads the rule and complies | "Use conventional commit format" |
| **verify** | Verification-required | Host should check compliance after the fact | "Run tests before committing" |
| **enforce** | Enforcement-required | Host must block non-compliant actions | STOP-GATE, branch protection |

Tagging could be inline in the standard body or in frontmatter metadata. Hosts use the tier to determine which directives they can fully support vs which will degrade gracefully.

**Why defer:** Gather data from PAI and OpenClaw integrations about which directives actually fail in practice. Tag informed by evidence, not speculation.

---

## 5. Responsibility Boundary

The integration boundary between MARR and any host system:

| Phase | MARR Owns | Host Owns | Interface |
|---|---|---|---|
| **Authoring** | Schema, validation, scaffolding | N/A | `StandardFrontmatterSchema` |
| **Distribution** | Publishing, versioning, manifest | Discovery, fetching, installation | `standards.json` + files |
| **Activation** | Trigger definition, semantics, test fixtures | Trigger evaluation, context injection | Evaluation contract |
| **Enforcement** | Directive content, (future) enforcement tier tags | Runtime checks, blocking, verification | Directive tier tags |

MARR puts validated files on disk and publishes a manifest. Hosts read files, evaluate triggers, inject standards, and enforce compliance. The boundary is the file system and the manifest. MARR never reaches into the host; hosts reach into MARR.

---

## 6. How PAI and OpenClaw Differ as Hosts

The same MARR refinements serve both systems, but through different integration surfaces:

| Dimension | PAI Integration Surface | OpenClaw Integration Surface |
|---|---|---|
| **Loading mechanism** | LoadContext hook at SessionStart reads `standards.json`, loads matching standards | Gateway context assembly phase reads `standards.json` during system prompt construction |
| **Trigger evaluation** | Hook calls reference evaluator (or implements own) with session context | Gateway calls reference evaluator (or implements own) with message context |
| **Config layers** | `~/.claude/` (user) + `.pai/` (project) | Agent workspace (per-agent) + working directory (per-project) |
| **Distribution** | PAI Pack wraps MARR standards + hook for activation | ClawHub package wraps MARR standards + context assembly integration |
| **Enforcement** | PreToolUse hooks can enforce verify/enforce-tier directives | Tool policy chains can enforce verify/enforce-tier directives |

**Key point:** PAI and OpenClaw build their own integration code. MARR provides the manifest, the evaluation contract, the reference evaluator, and the test fixtures. How each host uses these is their own decision.

---

## 7. What MARR Does NOT Need to Do

Explicitly out of scope for MARR:

| Proposal | Why Not |
|---|---|
| **Ship a PAI Pack** | PAI's responsibility. MARR provides raw materials. |
| **Ship a ClawHub package** | OpenClaw's responsibility. MARR provides raw materials. |
| **Build host-specific adapters** | Creates coupling MARR should never have. Permanently rejected. |
| **Define a universal agent API** | MARR governs agents; it does not abstract them. |
| **Absorb PAI's Algorithm or OpenClaw's Gateway concepts** | MARR stays in the governance layer. Execution is the host's domain. |
| **Handle compliance reporting** | Premature. Build after integrations exist and compliance is measurable. |

---

## 8. Implementation Roadmap

| Phase | Deliverable | MARR Version | Dependencies |
|---|---|---|---|
| **1** | `standards.json` manifest + stable identifiers + documented GitHub raw URLs | v3.6 | None |
| **2** | Trigger evaluation contract (spec + test fixtures) + optional `keyword_hints` in schema | v3.7 | Phase 1 |
| **3** | Reference evaluator (`@virtualian/marr/evaluate`) | v3.8 | Phase 2 |
| **4** | Conformance levels + test suites (derived from real integrations) | v4.0 | Real PAI + OpenClaw integrations |
| **5** | Directive enforcement tier tags (informed by usage data) | v4.x | Phase 4 |

Each phase is independently valuable. Phase 1 alone makes MARR programmatically consumable. Phase 2 alone formalizes trigger semantics. No phase requires changes to PAI or OpenClaw — they choose when and how to integrate.

---

## 9. The Principle

**MARR refines its export surface. It does not build import pipelines into host systems.**

The boundary stays at the file system and the manifest. MARR publishes validated standards with machine-readable metadata, a defined evaluation contract, and optional reference tooling. PAI, OpenClaw, and every future host system builds their own integration on their own terms, at the conformance level they choose.

MARR is the governance substrate. Everything else is the host's responsibility.

---

## Supporting Analysis

This document synthesizes two analytical workstreams:

1. **First Principles Decomposition** — 7 structural primitives decomposed to essential functions, host assumptions, integration surfaces, and 20 specific refinements. Full analysis: `~/tmp/marr-structural-primitives.md`

2. **Council Debate** — 4 perspectives (MARR Maintainer, PAI Architect, OpenClaw Contributor, Standards Theorist) debating trigger evaluation, distribution, adapters vs interfaces, and responsibility boundaries. Full transcript: `~/tmp/marr-council-debate.md`
