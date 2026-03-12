# MARR Structural Primitives -- First Principles Decomposition

**Date:** 2026-02-13
**Method:** First Principles (Deconstruct / Challenge / Reconstruct)
**Constraint:** MARR stays independent. All refinements are to MARR itself.

---

## Meta-Analysis: What Is MARR, Structurally?

Before decomposing individual primitives, we need to name what MARR is at the highest abstraction level.

MARR is a **standards distribution and enforcement layer** that sits between a human's intent ("how I want agents to behave") and a host system's execution model ("how the agent actually runs"). It is neither the agent nor the orchestrator -- it is the **governance substrate** that any agent system can consume.

The structural question for each primitive: **How thin can the coupling be between MARR's governance logic and the host system's execution model?**

---

## Primitive 1: Trigger System

### Essential Function

**Problem it solves:** Token efficiency and contextual relevance. Without conditional activation, a system must either (a) load all standards into every context window (wasteful, noisy) or (b) rely on the human to manually specify which standards apply (fragile, error-prone). The trigger system automates the mapping from "what the agent is currently doing" to "which standards constrain that work."

This is the **selector function** -- it answers: given the universe of installed standards, which subset is relevant right now?

### Assumptions About the Host System

| Assumption | Type | Evidence |
|---|---|---|
| The host system has a concept of "current task" or "current message" that can be evaluated against trigger conditions | **Hard coupling** | Both PAI (hook receives session context) and OpenClaw (Gateway receives message) provide this, but the shape differs completely |
| Trigger evaluation is **semantic**, not keyword-based ("WHEN working with git branches" must understand intent, not grep for "git") | **Soft coupling** | Requires LLM inference for evaluation -- but MARR currently delegates this to the host's LLM, not its own |
| There is a **moment before execution** where standards can be injected into context | **Hard coupling** | PAI has SessionStart/LoadContext hooks; OpenClaw has context assembly phase. Both provide this, but the injection mechanism differs |
| Standards are evaluated **per-session or per-task**, not per-token | **Assumption** | Could be challenged -- some systems might want per-tool-call trigger re-evaluation |

### Integration Surface

The host system must provide:

1. **Task context** -- a representation of "what the agent is about to do" (message text, tool call, session metadata)
2. **Injection point** -- a mechanism to add content to the agent's context window before or during execution
3. **Evaluation capacity** -- either the host's own LLM evaluates triggers, or MARR provides an evaluation function the host calls

### Refinements for Universality

**R1.1: Define a Trigger Evaluation Protocol, not a trigger evaluation implementation.**

Currently, MARR's triggers are semantic strings ("WHEN working with git branches") that implicitly require LLM interpretation. This couples MARR to hosts that have LLM access at the trigger-evaluation moment. Instead, MARR should define a **Trigger Evaluation Protocol** -- a contract that says:

```
Input:  { triggers: string[], taskContext: TaskContext }
Output: { matches: string[], confidence: number[] }
```

Where `TaskContext` is a MARR-defined interface that host systems populate:

```typescript
interface TaskContext {
  message?: string;        // Current user message or task description
  tools?: string[];        // Tools about to be invoked
  files?: string[];        // Files currently being edited
  metadata?: Record<string, unknown>; // Host-specific context
}
```

The host system maps its native context into `TaskContext`. MARR provides a **reference evaluator** (LLM-based) but the protocol allows hosts to implement their own (rule-based, embedding-based, hybrid). PAI's hook can call the reference evaluator. OpenClaw's Gateway can implement a native one tuned to its message routing.

**R1.2: Support tiered trigger granularity.**

Current triggers are session-level (evaluated once at session start). But OpenClaw's Lane Queue processes multiple tasks per session, and PAI's Algorithm transitions through phases (OBSERVE, THINK, PLAN, BUILD, EXECUTE, VERIFY, LEARN) within a single session. MARR should define trigger evaluation at three granularities:

| Granularity | When Evaluated | Use Case |
|---|---|---|
| **Session** | Once at session/conversation start | Development workflow, documentation standards |
| **Task** | When a discrete task begins within a session | Version control (only when committing), testing (only when writing tests) |
| **Tool** | Before a specific tool invocation | MCP usage rules (only when calling specific tools) |

The standard's frontmatter declares which granularity it requires:

```yaml
triggers:
  granularity: task  # session | task | tool
  conditions:
    - WHEN working with git branches
```

Hosts that only support session-level evaluation can treat all granularities as session-level (graceful degradation). Hosts that support finer-grained evaluation get more precise activation.

**R1.3: Provide a deterministic fallback.**

Semantic evaluation is powerful but non-deterministic. MARR should support an optional `deterministic_triggers` field alongside semantic ones:

```yaml
triggers:
  semantic:
    - WHEN working with git branches
  deterministic:
    tools: ["git_*", "github_*"]
    files: ["*.git*", ".github/**"]
    keywords: ["branch", "merge", "commit", "pull request"]
```

Hosts choose which evaluation path to use. Systems with LLM access use semantic. Systems without (or systems prioritizing speed/determinism) use the deterministic fallback. Both are valid; MARR publishes both.

---

## Primitive 2: Two-Layer Config

### Essential Function

**Problem it solves:** The identity-versus-context problem. Some preferences belong to the **human** (coding style, commit message format, accessibility requirements) and should follow them across every project. Other preferences belong to the **project** (framework conventions, team agreements, deployment targets) and should stay with the repo. Conflating these leads to either (a) reconfiguring per project or (b) imposing personal preferences on team repos.

The Portability Test is the **decision function**: "If I switch to a different project tomorrow, does this config come with me?"

### Assumptions About the Host System

| Assumption | Type | Evidence |
|---|---|---|
| The host system has a concept of "user-level config" vs "project-level config" | **Soft coupling** | Claude Code has `~/.claude/` (user) vs `.claude/` (project). OpenClaw has agent workspace vs working directory. PAI has `USER/` vs `SYSTEM/`. All have this concept but implement it differently. |
| The user layer has higher precedence than the project layer (user preferences win) | **Assumption** | MARR assumes user overrides project. But in team contexts, the project might need to enforce constraints that override individual preference (e.g., "this project uses tabs, regardless of your preference"). Precedence should be configurable. |
| Both layers resolve to the same config schema | **Hard coupling** | User and project config must be mergeable -- they must share a common shape. |
| The host system provides a filesystem location for each layer | **Soft coupling** | All current hosts use filesystem directories, but future hosts might use databases, APIs, or cloud storage. |

### Integration Surface

The host system must provide:

1. **Two resolution paths** -- a user-scoped location and a project-scoped location where MARR can read/write config
2. **Merge semantics** -- how conflicts between layers are resolved (MARR defines defaults; host can override)
3. **Layer detection** -- how MARR knows "which project am I in?" (currently: working directory; could be: environment variable, API call, session metadata)

### Refinements for Universality

**R2.1: Make the layer model extensible beyond two.**

Two layers (user + project) is the minimum viable model, but real systems have more:

| Layer | Example | Precedence |
|---|---|---|
| **Platform** | MARR's built-in defaults | Lowest |
| **Organization** | Company-wide standards (enforced on all teams) | Low |
| **Team** | Team-specific conventions | Medium |
| **Project** | Repo-level config | High |
| **User** | Personal preferences | Highest (default) |

MARR should support an **ordered layer stack** where each layer can be defined by a resolution path. The default is two layers (user + project). Hosts and users can add layers. Merge semantics are defined per-standard: some standards allow user override (coding style); others enforce organizational floor (security policies, with `override: false`).

```yaml
# Standard frontmatter
override_policy: user-wins  # user-wins | project-wins | highest-specificity | merge
```

**R2.2: Abstract the Portability Test into a formal decision tree.**

The Portability Test is currently a mental model ("does this come with me?"). MARR should formalize it as a machine-readable classification:

```yaml
# In each config value's metadata
portability: portable     # Follows the human (user layer)
portability: anchored     # Stays with the project (project layer)
portability: inherited    # Comes from organization/team (org layer)
portability: default      # MARR platform default (platform layer)
```

When `marr init` generates config, each setting gets a `portability` tag. When `marr sync` propagates, it only syncs values matching the target layer's portability. This prevents the common error of syncing user preferences into project config.

**R2.3: Define layer resolution as a protocol, not a filesystem layout.**

Current implementation assumes `~/.claude/` and `.claude/marr/`. Instead, define:

```typescript
interface LayerResolver {
  resolve(layer: 'user' | 'project' | string): {
    read: () => Promise<Config>;
    write: (config: Config) => Promise<void>;
    path?: string;  // Optional filesystem path (for display/debugging)
  };
}
```

Host systems implement this interface. Claude Code maps it to filesystem paths. OpenClaw maps it to agent workspace + working directory. A hypothetical cloud-hosted agent maps it to API endpoints. MARR's core logic never touches the filesystem directly -- it operates on the `LayerResolver` abstraction.

---

## Primitive 3: Schema Validation

### Essential Function

**Problem it solves:** Structural correctness of standards. Without validation, standards can be malformed (missing triggers, invalid frontmatter, undefined fields) and silently fail or behave unexpectedly. Schema validation ensures that every standard is **well-formed before it is evaluated** -- a compile-time check for governance documents.

This is the **type system** for standards. It catches structural errors before they become runtime failures.

### Assumptions About the Host System

| Assumption | Type | Evidence |
|---|---|---|
| Standards are files with YAML frontmatter that can be parsed | **Hard coupling** | Zod schema validates against parsed YAML. If a host stores standards differently (database, API), the validation needs a different input format. |
| The validation runs at authoring/install time, not at runtime | **Assumption** | Currently `marr validate` is a CLI command. But hosts might want runtime validation (OpenClaw validating standards loaded during context assembly). |
| Zod is available in the host's runtime | **Soft coupling** | Zod is a TypeScript/JavaScript library. Non-JS hosts (Python agents, Rust agents) cannot use it directly. |

### Integration Surface

The host system must provide:

1. **Standard content** -- the raw text of a standard for validation
2. **Schema version** -- which version of the MARR schema to validate against

That's it. Validation is the most self-contained primitive -- it needs nothing from the host except the content to validate.

### Refinements for Universality

**R3.1: Publish the schema as JSON Schema, not only as Zod.**

Zod is excellent for TypeScript but excludes non-JS ecosystems. MARR should publish its standard schema in **JSON Schema** format (the lingua franca of schema validation) with Zod as one of many possible runtime validators:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["marr", "version", "title", "scope", "triggers"],
  "properties": {
    "marr": { "const": "standard" },
    "version": { "type": "integer", "minimum": 1 },
    "title": { "type": "string" },
    "scope": { "type": "string" },
    "triggers": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 1
    }
  }
}
```

Any language with a JSON Schema validator (Python: `jsonschema`, Rust: `jsonschema-rs`, Go: `gojsonschema`) can validate MARR standards. Zod remains the TypeScript implementation but is no longer the canonical definition.

**R3.2: Define validation levels.**

Not all validation is equal. MARR should define explicit levels:

| Level | What It Checks | When to Run |
|---|---|---|
| **Structural** | Required fields present, correct types, valid YAML | `marr validate` (authoring time) |
| **Semantic** | Trigger conditions are meaningful, scope is coherent | `marr doctor` (review time) |
| **Compatibility** | No conflicts with other installed standards | `marr sync` (distribution time) |
| **Runtime** | Standard can be evaluated by the host's trigger system | Host-specific (integration time) |

Currently, MARR bundles these into one validation pass. Separating them lets hosts validate at the level they can support. A minimal host might only do structural validation. A sophisticated host does all four.

**R3.3: Support schema extensions for host-specific fields.**

Different hosts may need additional frontmatter fields. OpenClaw might want `agent_scope: [main, researcher]`. PAI might want `algorithm_phase: [BUILD, EXECUTE]`. MARR's schema should support:

```yaml
# Standard frontmatter
marr: standard
version: 1
title: Version Control
scope: Git operations
triggers:
  - WHEN working with git
# Host-specific extensions (validated by host, ignored by MARR core)
x-pai:
  algorithm_phase: [BUILD, EXECUTE]
x-openclaw:
  agent_scope: [main]
```

The `x-` prefix convention (borrowed from HTTP headers) signals host-specific extensions. MARR validates its own fields; hosts validate their extensions. Neither breaks the other's validation.

---

## Primitive 4: Conflict Detection

### Essential Function

**Problem it solves:** Semantic contradictions between standards, between config layers, and between standards and host-system rules. Example: a user config says "always use conventional commits" while a project standard says "use semantic release format." Without conflict detection, both rules load and the agent receives contradictory instructions -- a silent governance failure.

This is the **consistency checker** -- it ensures the combined configuration space is coherent.

### Assumptions About the Host System

| Assumption | Type | Evidence |
|---|---|---|
| Conflicts are detectable by analyzing standard content semantically | **Hard coupling** | Requires LLM inference to determine if two rules contradict. This is the most computationally expensive primitive. |
| The host system can present conflicts to the user for resolution | **Soft coupling** | `marr doctor` uses CLI interaction. But OpenClaw might surface conflicts in a chat message. PAI might surface them via voice notification. |
| All active rules are knowable at analysis time | **Assumption** | MARR can analyze its own standards + user config. But it cannot see the host's native rules (PAI Steering Rules, OpenClaw AGENTS.md) unless they are exposed. |
| The conflict resolution is human-driven (not auto-resolved) | **Design choice** | Could be challenged -- some conflicts have obvious resolutions (more specific rule wins). |

### Integration Surface

The host system must provide:

1. **All active governance content** -- not just MARR standards but the host's own rules, so MARR can detect cross-system contradictions
2. **Conflict presentation mechanism** -- CLI, chat, notification, or API for surfacing detected conflicts to the user
3. **Resolution storage** -- where to persist the user's conflict resolution decisions

### Refinements for Universality

**R4.1: Define conflict types with resolution strategies.**

Not all conflicts are equal. MARR should classify them:

| Conflict Type | Example | Default Resolution |
|---|---|---|
| **Direct contradiction** | "Use tabs" vs "Use spaces" | Human must choose |
| **Scope overlap** | Two standards both govern "git commits" with different rules | More specific scope wins; human confirms |
| **Layer tension** | User prefers X; project requires Y | Determined by `override_policy` from Primitive 2 |
| **Implicit conflict** | Standard A implies behavior that violates Standard B | Detected by semantic analysis; flagged for human review |
| **Version skew** | Same standard at different versions across layers | Higher version wins (semver); human confirms breaking changes |

Each type gets a default resolution strategy. Hosts can override the strategy. Human confirmation is always available as a fallback.

**R4.2: Expose host governance as a readable interface.**

MARR cannot detect conflicts with rules it cannot see. Define a **Governance Export** protocol:

```typescript
interface GovernanceExport {
  rules: Array<{
    source: string;     // "PAI Steering Rules", "OpenClaw AGENTS.md"
    content: string;    // The rule text
    scope: string;      // What domain it governs
    precedence: number; // Where it sits in the host's priority chain
  }>;
}
```

Hosts that implement this interface enable MARR to detect cross-system conflicts. Hosts that do not still get intra-MARR conflict detection (standards vs standards, user vs project). This is opt-in -- MARR's conflict detection degrades gracefully without it rather than failing.

**R4.3: Support offline conflict detection.**

Current semantic analysis requires LLM access. MARR should also support a **deterministic conflict detector** using scope overlap analysis:

- If two standards declare overlapping `scope` values and contain rules about the same topic, flag as potential conflict
- Use keyword extraction (not LLM) to identify topic overlap
- Reserve LLM-based semantic analysis for `marr doctor --deep`

This gives fast, deterministic conflict detection in CI pipelines and environments without LLM access, with deeper semantic analysis available on demand.

---

## Primitive 5: Cross-Project Sync

### Essential Function

**Problem it solves:** Standards drift. When the same standard exists in 10 projects, manual updates lead to inconsistency. `marr sync` treats standards as **distributable, versionable units** -- propagating changes across repos with diff review, like a package manager for governance documents.

This is the **distribution function** -- it answers: how do standards move between contexts while maintaining consistency?

### Assumptions About the Host System

| Assumption | Type | Evidence |
|---|---|---|
| Standards live in the filesystem in each project | **Hard coupling** | `marr sync` operates on files in directories. If standards live in a database (OpenClaw's potential cloud storage), sync needs a different transport. |
| Projects are git repositories | **Soft coupling** | Sync uses git for version tracking and diff generation. Non-git projects need an alternative. |
| The user reviews diffs before applying | **Design choice** | Could be challenged for trusted sources -- an organization might want auto-sync without review. |
| Standards have versions that can be compared | **Hard coupling** | Sync depends on the `version` field in frontmatter to determine which direction to sync. |

### Integration Surface

The host system must provide:

1. **Standard storage location** -- where standards live in the host's project structure
2. **Version comparison** -- the ability to compare standard versions across locations
3. **Diff presentation** -- mechanism to show the user what changed (CLI, web UI, chat)
4. **Apply mechanism** -- the ability to write updated standards to the target location

### Refinements for Universality

**R5.1: Abstract sync transport.**

`marr sync` currently assumes filesystem-to-filesystem copy. Define a **Sync Transport** protocol:

```typescript
interface SyncTransport {
  list(): Promise<StandardRef[]>;           // List available standards
  read(ref: StandardRef): Promise<Standard>; // Read a standard's content
  write(standard: Standard): Promise<void>;  // Write/update a standard
  diff(a: Standard, b: Standard): string;    // Generate human-readable diff
}
```

Implementations:
- **FileTransport** -- current behavior, filesystem-based
- **GitTransport** -- operates on git branches/remotes directly
- **RegistryTransport** -- syncs from a central standards registry (npm-like)
- **ClawHubTransport** -- syncs from OpenClaw's marketplace
- **APITransport** -- syncs via HTTP API (cloud-hosted agents)

MARR ships FileTransport and GitTransport. Hosts provide their own transports for non-filesystem scenarios.

**R5.2: Support sync policies.**

Not all sync is "copy everything." Define sync policies:

```yaml
# .marr/sync.yaml
sources:
  - name: company-standards
    url: https://github.com/company/standards
    transport: git
    policy: auto-update     # auto-update | review-required | pin-version

  - name: marr-defaults
    transport: registry
    policy: review-required

  - name: team-overrides
    path: ../team-standards
    transport: file
    policy: auto-update
```

| Policy | Behavior |
|---|---|
| `auto-update` | Sync applies without review (trusted source) |
| `review-required` | Sync generates diff, waits for approval |
| `pin-version` | Never auto-update; manual version bumps only |

**R5.3: Publish a standards registry protocol.**

Beyond file sync, MARR should define a **Standards Registry Protocol** -- an API contract for publishing and discovering standards:

```
GET /standards                          -> List all standards
GET /standards/{name}                   -> Get standard metadata
GET /standards/{name}/versions          -> List versions
GET /standards/{name}/versions/{v}      -> Get specific version content
POST /standards                         -> Publish a new standard
```

This enables:
- `marr install version-control` (from registry)
- ClawHub to implement the protocol (OpenClaw integration)
- Organizations to host private registries
- CI/CD pipelines to validate against registry versions

---

## Primitive 6: Standard Format

### Essential Function

**Problem it solves:** The representation problem. Standards must be simultaneously **human-readable** (authors write and review them in prose), **machine-parseable** (systems extract triggers, version, scope for programmatic use), and **host-agnostic** (the same standard works in Claude Code, OpenClaw, Cursor, Copilot).

Markdown with YAML frontmatter is the chosen format -- it satisfies all three constraints with a format that developers already know.

### Assumptions About the Host System

| Assumption | Type | Evidence |
|---|---|---|
| The host can parse YAML | **Soft coupling** | YAML parsers exist for every language, but some hosts might prefer TOML, JSON, or other frontmatter formats |
| The host can render/interpret markdown | **Soft coupling** | Markdown is the de facto standard for LLM context, but the interpretation is "pass the text to the LLM," not "render HTML" |
| The standard body is consumed by an LLM, not a program | **Hard coupling** | The body of a standard is natural language instructions for an AI agent. Non-LLM consumers (linters, CI checks) can only use the frontmatter. |
| File-based storage | **Soft coupling** | Standards are `.md` files. Could be stored differently (database records, API responses) as long as the format is preserved. |

### Integration Surface

The host system must provide:

1. **YAML parser** -- to extract frontmatter
2. **Context injection** -- the ability to pass markdown text to the LLM as part of its context
3. **Standard discovery** -- a way to find standards (filesystem glob, database query, API call)

### Refinements for Universality

**R6.1: Define a canonical AST (Abstract Syntax Tree) for standards.**

The file format is the serialization. Under it should be a canonical in-memory representation:

```typescript
interface MARRStandard {
  // Frontmatter (structured)
  meta: {
    marr: 'standard';
    version: number;
    title: string;
    scope: string;
    triggers: TriggerConfig;
    override_policy?: OverridePolicy;
    extensions?: Record<string, unknown>;  // x-pai, x-openclaw, etc.
  };

  // Body (natural language)
  body: string;

  // Derived (computed at parse time)
  derived: {
    hash: string;           // Content hash for change detection
    wordCount: number;      // For token budget estimation
    sections: string[];     // H2/H3 headings for partial loading
  };
}
```

Hosts work with the AST, not the file. This decouples MARR from the markdown-with-YAML-frontmatter serialization while keeping it as the default.

**R6.2: Support partial loading for large standards.**

Some standards are detailed -- multiple pages of rules. Loading the entire body into every context window wastes tokens. MARR should support **section-level triggers**:

```yaml
triggers:
  - WHEN working with git branches
sections:
  branching: "WHEN creating or switching branches"
  merging: "WHEN merging or rebasing"
  commits: "WHEN writing commit messages"
```

The body is divided by markdown headings. When the trigger matches, only the relevant sections load. A standard about version control might have 2,000 words total, but only the 400-word "commits" section loads when the agent is writing a commit message.

This requires hosts to support section-level injection (parsing the body by headings and injecting subsets). Hosts that do not support this load the full body (graceful degradation).

**R6.3: Define a standard header protocol for non-file transports.**

When standards travel over APIs, registries, or messaging systems, the YAML frontmatter becomes HTTP headers or JSON metadata. MARR should define the mapping:

| Frontmatter Field | HTTP Header | JSON Field |
|---|---|---|
| `marr` | `X-MARR-Type` | `type` |
| `version` | `X-MARR-Version` | `version` |
| `title` | `X-MARR-Title` | `title` |
| `scope` | `X-MARR-Scope` | `scope` |
| `triggers` | `X-MARR-Triggers` (JSON array) | `triggers` |

This enables standards to be transmitted, cached, and validated regardless of whether they are stored as files.

---

## Primitive 7: Platform Agnosticism

### Essential Function

**Problem it solves:** Lock-in. AI coding agents are a rapidly evolving ecosystem. Today it's Claude Code, Cursor, and Copilot. Tomorrow it could be new entrants with completely different architectures. Standards should outlive any particular agent platform. Platform agnosticism ensures that investing in MARR standards is not a bet on a single agent tool.

This is the **portability guarantee** -- MARR standards work everywhere an AI agent works.

### Assumptions About the Host System

| Assumption | Type | Evidence |
|---|---|---|
| The host system is an AI coding agent that reads natural language instructions | **Hard coupling** | Standards are natural language documents consumed by LLMs. A non-LLM system cannot use them. |
| The host has SOME mechanism for loading context (files, system prompts, tool descriptions) | **Soft coupling** | Every agent has this, but the mechanism varies wildly: `@`-imports (Claude Code), workspace files (OpenClaw), `.cursorrules` (Cursor), custom system prompts (Copilot) |
| The host operates in a project/repository context | **Assumption** | MARR's project-level config assumes a working directory. Chat-only agents without filesystem access break this assumption. |
| The user has CLI access to run `marr` commands | **Soft coupling** | `marr init`, `marr sync`, `marr validate` are CLI tools. Environments without CLI (web-based agents, mobile) need alternatives. |

### Integration Surface

The host system must provide:

1. **Context loading mechanism** -- ANY way to inject text into the agent's context
2. **Filesystem access** -- for reading standards from the project directory (optional but enabling)
3. **User interaction** -- for conflict resolution and sync review (CLI, chat, UI)

### Refinements for Universality

**R7.1: Define a Host Adapter interface.**

Platform agnosticism should not be accidental (it happens to work) but architectural (there is a defined contract). MARR should publish a **Host Adapter** specification:

```typescript
interface MARRHostAdapter {
  // Identity
  platform: string;              // "claude-code" | "openclaw" | "cursor" | etc.
  capabilities: HostCapabilities;

  // Layer Resolution (Primitive 2)
  resolveLayer(layer: string): LayerResolver;

  // Trigger Evaluation (Primitive 1)
  getTaskContext(): TaskContext;
  evaluateTriggers?(triggers: TriggerConfig, context: TaskContext): TriggerResult;

  // Context Injection (core requirement)
  injectStandard(standard: MARRStandard): Promise<void>;

  // Governance Export (Primitive 4, optional)
  exportGovernance?(): GovernanceExport;

  // Sync Transport (Primitive 5, optional)
  getSyncTransport?(): SyncTransport;
}

interface HostCapabilities {
  triggerGranularity: 'session' | 'task' | 'tool';
  sectionLoading: boolean;
  conflictPresentation: 'cli' | 'chat' | 'ui' | 'api';
  layerCount: number;
  governanceExport: boolean;
}
```

Each host implements this interface. MARR's core logic operates on the interface, never on host-specific details. The adapter declares its capabilities, and MARR degrades gracefully when capabilities are missing.

**R7.2: Publish a "Minimum Viable Host" specification.**

Not every host needs to implement everything. Define tiers:

| Tier | Requirements | What Works |
|---|---|---|
| **Tier 1: Passive** | Can load a markdown file into agent context | Standards work but no conditional activation, no conflict detection, no sync |
| **Tier 2: Active** | Tier 1 + trigger evaluation + two-layer config | Full MARR experience with conditional activation and user/project scoping |
| **Tier 3: Integrated** | Tier 2 + governance export + sync transport + section loading | Full MARR integration including cross-system conflict detection and efficient loading |

Most hosts start at Tier 1 (just load the files) and can progressively adopt higher tiers. This prevents MARR from requiring too much from simple hosts while enabling sophisticated integration with complex ones.

Cursor and Copilot are likely Tier 1 today (load `.cursorrules` or system prompt -- MARR standards can be manually included). Claude Code is Tier 2 (hook-based loading, two-layer config). PAI and OpenClaw could reach Tier 3 with the integration work described in the integration reviews.

**R7.3: Provide platform-specific bootstrap packages.**

For each supported platform, MARR should publish a minimal bootstrap that maps the Host Adapter to the platform's native mechanisms:

| Platform | Bootstrap Mechanism | What It Does |
|---|---|---|
| **Claude Code** | `@`-imports in CLAUDE.md | Loads MARR standards via Claude Code's native import system |
| **Cursor** | `.cursorrules` include | Embeds active standards in Cursor's rule system |
| **OpenClaw** | ClawHub skill or native `standards/` | Gateway-integrated standard loading |
| **PAI** | `.pai/standards/` + LoadContext hook | Hook-driven standard injection |
| **Generic** | CLI tool + system prompt append | `marr context` outputs active standards as text for manual/scripted injection |

The bootstrap is the **thinnest possible layer** between MARR and the host. Everything else (trigger evaluation, conflict detection, sync) operates on the abstract interfaces.

---

## Cross-Cutting Analysis

### Dependency Graph Between Primitives

```
Standard Format (6)
    |
    v
Schema Validation (3) -----> Conflict Detection (4)
    |                              |
    v                              v
Trigger System (1) <------- Two-Layer Config (2)
    |                              |
    v                              v
Platform Agnosticism (7) <-- Cross-Project Sync (5)
```

- **Standard Format** is the foundation -- every other primitive operates on standards in this format
- **Schema Validation** depends on the format; Conflict Detection depends on validated standards
- **Trigger System** and **Two-Layer Config** are co-dependent (triggers determine what loads; layers determine where it comes from)
- **Platform Agnosticism** is the integration layer -- it depends on all other primitives having clean interfaces
- **Cross-Project Sync** depends on format (to compare), validation (to verify), and the layer model (to know what to sync where)

### The Fundamental Tension

MARR's seven primitives reveal a single architectural tension: **governance intelligence vs host simplicity**.

- The more intelligence MARR embeds (semantic triggers, LLM conflict detection, section-level loading), the more it requires from the host
- The simpler MARR keeps its host requirements, the less value it provides over "just paste your rules into the system prompt"

The refinements above resolve this tension through **capability tiers and protocol-based integration**. MARR defines sophisticated protocols but always provides simpler fallbacks. Hosts opt into the level of integration they can support. The value proposition scales with integration depth but never requires it.

### What MARR Is NOT (and Must Not Become)

To stay independent, MARR must resist becoming:

1. **An agent runtime** -- MARR governs; it does not execute. The moment MARR runs tools, manages sessions, or orchestrates agents, it competes with its hosts.
2. **A configuration management system** -- MARR distributes standards, not arbitrary config. It should not become Ansible for AI agents.
3. **A testing framework** -- MARR can define testing standards but should not execute tests. Host systems test; MARR says how.
4. **A platform abstraction layer** -- MARR's Host Adapter is an integration interface, not a universal agent API. MARR should not try to make all agents look the same.

MARR is the **governance substrate**. It publishes well-formed, validated, contextually-activated behavioral constraints that any agent system can consume. Everything else is the host's responsibility.
