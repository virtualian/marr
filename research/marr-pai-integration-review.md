# MARR/PAI Integration Review

**Date:** 2026-02-13
**Author:** Viki (PAI)
**Subject:** Audit of `@virtualian/marr` v3.5.0 against PAI v2.5

---

## Executive Summary

MARR (Making Agents Really Reliable) is a two-layer configuration system for AI coding agents that provides trigger-based, validated standards. This review maps MARR's 9 standards to PAI equivalents, identifies a missing PAI primitive ("Standard"), recommends against Diataxis-as-Pack, and proposes a project-level configuration system for PAI.

**Key finding:** PAI has an abstraction gap between always-on Steering Rules and user-invoked Skills. MARR independently discovered this gap and built a primitive for it: contextually-triggered standards. PAI should adopt this concept.

---

## 1. MARR Standards vs PAI — Full Map

MARR ships 9 standards in `resources/project/common/`. Each is a markdown file with YAML frontmatter defining triggers, scope, and version.

| # | MARR Standard | PAI Equivalent | Status |
|---|---|---|---|
| 1 | **Development Workflow** (STOP-GATE, issue types, release mgmt) | Steering Rules cover fragments ("Check Git Remote Before Push", "Ask Before Production Deployments") — but no formal workflow, no STOP-GATE, no issue taxonomy, no release process | **GAP** |
| 2 | **Version Control** (branch naming, squash merge, commit format, branch lifetime) | Steering Rule fragments + Claude Code built-in commit/PR instructions — no formal branch policy, naming convention, or lifetime enforcement | **GAP** |
| 3 | **Testing** (behavior-focused, coverage philosophy) | The Algorithm's VERIFY phase + ISC criteria. PAI verifies through ISC, not code tests. No testing methodology standard. | **GAP** (different paradigm) |
| 4 | **Documentation** (Diataxis: how-to/reference/explanation) | Pack READMEs have structure rules. Skill SKILL.md has format. But no Diataxis enforcement, no docs/ organization standard | **GAP** |
| 5 | **MCP Usage** (tool specificity, verification) | Skills/Tools system + SecurityValidator hook + PreToolUse hooks. Well-covered, just structured differently | **COVERED** |
| 6 | **UI/UX** (WCAG, mobile-first, accessibility) | Browser skill + Art skill exist, but no accessibility standard, no mobile-first policy | **GAP** |
| 7 | **Writing Prompts** (meta-standard for writing standards) | CreateSkill handles skill creation with validation. Pack system has structure rules. But no formal meta-standard for writing AI-facing documents | **PARTIAL** |
| 8 | **Plan Execution** (multi-agent coordination, file-based handoff) | **The PAI Algorithm is this** — 7-phase process, ISC, capability selection, parallel execution, thinking tools, composition patterns. PAI's version is more sophisticated. | **COVERED** (PAI exceeds) |
| 9 | **User Config** (Portability Test for scoping) | PAI's SYSTEM/USER two-tier architecture. But PAI applies this to steering rules and identity, not to standards broadly | **PARTIAL** |

### What MARR Has That PAI Doesn't

1. **Conditional activation via triggers** — Standards fire only when the agent's current task matches trigger conditions. Token-efficient and context-relevant. PAI loads steering rules unconditionally.

2. **Formal development workflow** — STOP-GATE (must create branch before ANY investigation), issue type taxonomy, release management protocol. PAI has no equivalent.

3. **Cross-project sync** — `marr sync` propagates standards between repos with diff review. PAI has no mechanism for keeping standards consistent across projects.

4. **Schema-validated standards** — Zod-enforced frontmatter, structural validation, conflict detection. PAI validates skills structurally (CreateSkill) but not standards.

5. **Conflict detection** — Semantic analysis catching contradictions between config and standards. PAI has no equivalent.

### What PAI Has That MARR Doesn't

1. **The Algorithm** — Full cognitive framework (OBSERVE→THINK→PLAN→BUILD→EXECUTE→VERIFY→LEARN) governing HOW work happens. MARR's Plan Execution standard is a subset.

2. **ISC (Ideal State Criteria)** — Per-task verifiable success criteria. MARR defines rules but not per-task success criteria.

3. **Thinking Tools** — Council, RedTeam, FirstPrinciples, Science, BeCreative — meta-cognitive tools selected per-task.

4. **Capability Composition** — Named patterns (Pipeline, Fan-out, TDD Loop, Gate, Escalation, Specialist) for combining agents.

5. **Memory System** — WORK/, LEARNING/, STATE/ directories capturing session history, learnings, ratings. MARR is stateless.

6. **Hook-driven lifecycle** — 14 hooks across 6 lifecycle events providing voice, security, context injection, observability. MARR relies on static markdown.

7. **Voice and observability** — Real-time feedback, tab titles, sentiment tracking, rating capture.

---

## 2. Diataxis as a Pack — Wrong Abstraction

**Recommendation: No.** Pack is the wrong abstraction for Diataxis.

### First-Principles Reasoning

**What a Pack IS:** A distribution/installation unit that bundles executable capabilities — code, hooks, tools, workflows. Packs DO things. They have `src/`, `INSTALL.md`, `VERIFY.md`. You install `pai-browser` and gain the ability to automate browsers.

**What Diataxis IS:** Organizational rules about documentation structure. It doesn't DO anything. It constrains HOW you organize files. There's no code to install, no hooks to register, no tools to run.

Putting Diataxis in a Pack means the Pack contains a markdown file saying "organize docs this way." That's a standard wearing a Pack costume.

### Why Other PAI Primitives Also Don't Fit

| Primitive | Why Not |
|---|---|
| **Skill** | Skills are user-invoked capabilities with workflows. "Use the Diataxis skill" doesn't make sense — Diataxis isn't a workflow you run. |
| **Hook** | Hooks are PAI infrastructure, not project-configurable standards. You wouldn't install a hook for every standard. |
| **Steering Rule** | Closest match, but steering rules are always loaded (token waste when not doing docs), not granular enough, and not project-configurable. |

### The Gap

PAI needs a new primitive. Diataxis is a **conditional standard** — a detailed rule set that:
- Activates only when triggers match (creating/organizing documentation)
- Contains enough detail to be actionable (file structure, content type rules)
- Should be configurable per-project (not all projects need it)
- Is enforced as binding, not advisory

### PAI's Abstraction Landscape

| PAI Primitive | Activation | Scope | Detail Level |
|---|---|---|---|
| Steering Rule | Always loaded | Global | Principle-level |
| Skill | User-invoked | Global | Full workflow |
| Hook | System event | Global | Code-level |
| Pack | Installed once | Global | Distribution unit |
| **Standard (missing)** | **Trigger-matched** | **Per-project** | **Detailed rules** |

That missing row is what MARR calls a "standard." PAI needs to adopt this concept.

---

## 3. Project-Level PAI Configuration

### The Problem

PAI's configuration is entirely global. Everything lives in `~/.claude/`. When working across diverse projects, they all get identical PAI configuration. There's no mechanism for "in THIS project, use THESE standards and THESE skill priorities."

### Three Options Evaluated

#### Option A: Extend CLAUDE.md (minimal change)

Add structured PAI sections to project-root `CLAUDE.md`:

```markdown
# PAI Project Configuration

## Standards
- documentation: diataxis
- version-control: strict

## Skill Priorities
- Primary: Engineer, Browser
- Disabled: Art, VoiceServer
```

**Pros:** No new files, leverages existing Claude Code mechanism.
**Cons:** Mixes PAI config with other content. No validation. Not machine-parseable.

#### Option B: `.pai/project.json` (structured config)

```json
{
  "standards": {
    "enabled": ["diataxis", "version-control", "testing"],
    "disabled": ["ui-ux"]
  },
  "skills": {
    "priorities": ["Engineer", "Browser"],
    "disabled": ["Art", "VoiceServer"]
  },
  "algorithm": {
    "default_depth": "FULL"
  }
}
```

**Pros:** Machine-parseable. Validatable (Zod schema). Clear separation. Version-controllable.
**Cons:** New directory, new file format to maintain.

#### Option C: `.pai/` directory with standards/ (recommended)

```
project/
  .pai/
    project.json              # Project configuration
    standards/                # Project-specific standards
      diataxis.md
      version-control.md
      custom-api-standard.md
```

Mirrors MARR's `.claude/marr/` structure under PAI's namespace. Standards are markdown with YAML frontmatter (trigger conditions, scope, version). `project.json` declares which are active.

**Pros:** Self-contained, portable, supports custom per-project standards.
**Cons:** Most complex option. Overlaps with MARR if both are used.

### Recommendation: Option C

Use `.pai/` as the project-level config directory. Make the LoadContext hook (SessionStart) aware of it. When a session starts in a project with `.pai/`, the hook reads `project.json` and loads only the relevant standards — exactly like MARR's trigger-based lazy loading, integrated into PAI's existing hook infrastructure.

**Key design decision:** Standards are markdown files with YAML frontmatter (triggers, scope, version), stored in `.pai/standards/`, activated by project config. This gives you:
- MARR's conditional activation (triggers)
- MARR's per-project scoping (`.pai/` per repo)
- PAI's hook-driven lifecycle (LoadContext reads config)
- PAI's validation capability (CreateSkill-like schema validation)

---

## 4. Integration Proposal

### What Gets Absorbed Into PAI

| MARR Concept | PAI Integration | How |
|---|---|---|
| **Trigger-based standards** | New PAI primitive: **Standard** | Markdown files with YAML frontmatter. Stored in `.pai/standards/`. Loaded by LoadContext hook when triggers match. |
| **User/Project scoping** | **`.pai/` project config** | New `project.json` per repo. LoadContext hook reads it. Existing `USER/` layer remains for portable preferences. |
| **Portability Test** | **Formalized as steering rule** | Add to SYSTEM/AISTEERINGRULES.md: "Apply the Portability Test when deciding if config belongs in USER/ or .pai/" |
| **Standard content** | **Seed standards for the new system** | MARR's 9 standards become the initial standard library, installable into any project's `.pai/standards/` |
| **Conflict detection concept** | **Validation tool** | A `pai validate` command that checks for contradictions between active standards and steering rules |

### What Stays Separate

| MARR Concept | Why Separate |
|---|---|
| **`marr` CLI tool** | Platform-agnostic (works with Cursor, Copilot, not just PAI). Should continue as standalone for non-PAI users. |
| **`marr sync`** | Cross-project sync is valuable but independent of PAI's architecture. PAI projects can use `marr sync` to propagate standards. |
| **`marr doctor`** | Interactive conflict resolution is MARR CLI functionality, not a PAI primitive. |
| **`@` import mechanism** | MARR uses Claude Code's `@` imports. PAI uses hook injection. Different loading mechanisms, both valid. |

### New PAI Primitives Needed

#### 1. Standard

A conditional, trigger-based rule set that activates when context matches.

```markdown
.pai/standards/diataxis.md
---
name: Diataxis Documentation
version: 1
scope: Documentation organization
triggers:
  - WHEN creating or organizing documentation
  - WHEN deciding where to place a new document
  - WHEN restructuring docs/ directory
---

# Diataxis Documentation Standard

[Detailed rules here...]
```

**Characteristics:**
- Conditional (trigger-matched, not always-loaded)
- Per-project (lives in `.pai/standards/`)
- Detailed (full specification, not principle-level)
- Schema-validated (YAML frontmatter with required fields)
- Binding (violations are errors, not suggestions)

#### 2. Project Config

```json
// .pai/project.json
{
  "pai": "1.0",
  "standards": ["diataxis", "version-control", "testing"],
  "skills": {
    "priorities": ["Engineer", "Browser"],
    "disabled": []
  },
  "steering": {
    "overrides": {}
  }
}
```

Loaded by LoadContext hook at SessionStart. Controls which standards are active, which skills are prioritized, and any steering rule overrides.

#### 3. Standard Library

Curated, installable collection of standards — initially seeded from MARR's 9:

```
pai standard install diataxis    # Copies to .pai/standards/
pai standard list                # Shows available standards
pai standard validate            # Checks frontmatter + consistency
```

Could be a new Skill, a new Tool, or delegated to MARR CLI.

### Architecture After Integration

```
┌─────────────────────────────────────────────────────┐
│                   PAI (post-integration)             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  GLOBAL (always active)                             │
│  ├── Algorithm (7-phase, ISC, thinking tools)       │
│  ├── Steering Rules (SYSTEM + USER)                 │
│  ├── Hooks (14 lifecycle hooks)                     │
│  ├── Skills (28 capabilities)                       │
│  └── Memory (WORK, LEARNING, STATE)                 │
│                                                     │
│  PER-PROJECT (new — activated by .pai/)             │
│  ├── project.json (which standards are active)      │
│  ├── standards/ (trigger-matched rule sets)    NEW  │
│  └── overrides (steering rule adjustments)          │
│                                                     │
│  DISTRIBUTION (unchanged)                           │
│  └── Packs (installable capability bundles)         │
│                                                     │
│  EXTERNAL TOOLS (separate, interoperable)           │
│  └── MARR CLI (sync, doctor, validate)              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Migration Path

| Phase | Work | Dependencies |
|---|---|---|
| 1 | Define Standard primitive format (YAML frontmatter schema, trigger syntax) | None |
| 2 | Add `.pai/` directory support to LoadContext hook | Phase 1 |
| 3 | Convert MARR's 9 standards into PAI Standard format as seed library | Phase 1 |
| 4 | Build `pai standard` tooling (install, validate, list) — possibly as new Skill | Phase 2 |
| 5 | Add project.json support for skill priorities and steering overrides | Phase 2 |

MARR CLI continues to exist for non-PAI users and for cross-project sync. PAI users can use either system — they're complementary, not competing.

---

## Key Takeaways

1. **PAI has 4 gaps** where MARR provides standards PAI lacks: development workflow, version control, testing methodology, documentation organization, and UI/UX.

2. **Diataxis should not be a Pack.** Packs distribute capabilities; Diataxis is a constraint set. PAI needs a "Standard" primitive.

3. **PAI's global-only configuration is the biggest architectural gap.** Per-project config via `.pai/` with LoadContext hook integration solves this.

4. **MARR and PAI are complementary.** MARR handles cross-platform standards distribution and sync. PAI handles cognitive execution and verification. The integration adds project-level standards to PAI while preserving MARR for non-PAI users.

5. **The trigger-based lazy loading pattern is MARR's key innovation** and should be adopted directly, not approximated.
