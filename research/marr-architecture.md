# MARR Architecture and Design

**Date:** 2026-02-14
**Status:** Technical architecture. Builds on marr-definition.md (authoritative).
**Purpose:** System design for MARR as a governance plane for AI-assisted development. Concrete enough to implement from.

---

## 1. System Overview

MARR is a governance plane that sits above AI agent systems. It does not execute code, run agents, or manage sessions. It publishes validated, scoped, version-controlled development standards that any agent platform consumes through its own mechanisms.

```
                        ┌─────────────────────────────────────────────┐
                        │            Engineering Manager              │
                        │   (authors standards, configures layers)    │
                        └──────────────────┬──────────────────────────┘
                                           │
                        ┌──────────────────▼──────────────────────────┐
                        │           MARR Governance Plane             │
                        │                                             │
                        │  ┌───────────┐ ┌──────────┐ ┌───────────┐  │
                        │  │ Standards │ │   CLI    │ │  Schema   │  │
                        │  │  (.md)    │ │ Toolchain│ │ Validator │  │
                        │  └───────────┘ └──────────┘ └───────────┘  │
                        │                                             │
                        │  ┌───────────┐ ┌──────────┐ ┌───────────┐  │
                        │  │  Multi-   │ │  Cross-  │ │ Conflict  │  │
                        │  │  Layer    │ │ Project  │ │   & Gap   │  │
                        │  │  Scoping  │ │  Sync    │ │ Analysis  │  │
                        │  └───────────┘ └──────────┘ └───────────┘  │
                        │                                             │
                        │  ┌──────────────────────────────────────┐   │
                        │  │        Export Surface                 │   │
                        │  │  standards.json  +  files on disk    │   │
                        │  └──────────────────────────────────────┘   │
                        └─────────────────────────────────────────────┘
                                           │
               ┌───────────────────────────┼───────────────────────────┐
               │                           │                           │
    ┌──────────▼──────────┐   ┌────────────▼──────────┐   ┌───────────▼─────────┐
    │   Platform Renderer │   │   Platform Renderer   │   │  Platform Renderer  │
    │    (CLAUDE.md)      │   │   (.cursorrules)      │   │   (PAI Skill)       │
    └──────────┬──────────┘   └────────────┬──────────┘   └───────────┬─────────┘
               │                           │                           │
    ┌──────────▼──────────┐   ┌────────────▼──────────┐   ┌───────────▼─────────┐
    │    Claude Code      │   │       Cursor          │   │        PAI          │
    └─────────────────────┘   └───────────────────────┘   └─────────────────────┘
```

The architecture enforces a strict boundary: MARR publishes standards to its export surface (files on disk + a `standards.json` manifest). Host agent systems consume standards through platform renderers that translate MARR's canonical format into host-native formats. MARR never reaches into the host; hosts reach into MARR.

---

## 2. Multi-Layer Scoping

### The Problem

Agent systems today offer at most two configuration layers (user + project). Real organizations need more. A security team needs to enforce standards that no individual developer can override. A team lead needs conventions that apply across all team repos but not the whole org. A developer needs personal preferences that follow them everywhere.

### The Layer Model

MARR defines four scoping layers with a defined precedence order:

```
Priority (default)
  ▲
  │  ┌──────────────┐
  │  │    User      │  ~/.config/marr/standards/
  │  │              │  Personal preferences (coding style, commit format)
  │  ├──────────────┤
  │  │   Project    │  .marr/standards/
  │  │              │  Repo-specific conventions (framework, architecture)
  │  ├──────────────┤
  │  │    Team      │  Resolved via sync source or env var
  │  │              │  Team conventions (API patterns, review process)
  │  ├──────────────┤
  │  │ Organization │  Resolved via sync source or env var
  │  │              │  Org-wide mandates (security, compliance, licensing)
  │  └──────────────┘
  │
  ▼
```

### Layer Resolution

Each layer resolves to a directory of standard files. Resolution uses three mechanisms, checked in order:

| Mechanism | How It Works | Example |
|---|---|---|
| **Filesystem path** | Known directory location | User: `~/.config/marr/standards/`, Project: `.marr/standards/` |
| **Environment variable** | `MARR_ORG_PATH`, `MARR_TEAM_PATH` | `MARR_ORG_PATH=/shared/org-standards` |
| **Sync configuration** | Defined in `.marr/sync.yaml` as a remote source | `source: git@github.com:company/standards.git` |

User and Project layers always resolve via filesystem. Organization and Team layers resolve via environment variables or sync configuration, since they typically live outside the current repository.

```
resolve_layer(layer):
  if layer == "user":
    return ~/.config/marr/standards/
  if layer == "project":
    return $CWD/.marr/standards/
  if layer == "team":
    return $MARR_TEAM_PATH or sync_source("team") or null
  if layer == "org":
    return $MARR_ORG_PATH or sync_source("org") or null
```

When a layer resolves to `null`, it is skipped. The minimum viable configuration is a single project layer. The full four-layer stack is opt-in.

### Precedence and Override Policies

When the same standard exists at multiple layers, MARR must decide which version wins. The resolution depends on the standard's `override_policy` field:

```yaml
# In standard frontmatter
override_policy: user-wins    # default
```

| Policy | Behavior | Use Case |
|---|---|---|
| `user-wins` | Highest-specificity layer takes precedence (User > Project > Team > Org) | Coding style, personal preferences |
| `project-wins` | Project layer overrides User for this standard | Framework conventions that must be consistent within a repo |
| `org-enforced` | Organization layer cannot be overridden by any lower layer | Security policies, compliance requirements |
| `merge` | All layers are merged; non-conflicting directives accumulate | Additive standards (e.g., a checklist that grows at each layer) |

Resolution algorithm:

```
resolve_standard(id):
  candidates = []
  for layer in [org, team, project, user]:
    if layer has standard with id:
      candidates.append((layer, standard))

  if candidates.length == 0:
    return null
  if candidates.length == 1:
    return candidates[0].standard

  policy = candidates[0].standard.override_policy  # org sets the floor
  switch policy:
    case "org-enforced":
      return candidates where layer == org
    case "project-wins":
      return candidates where layer == project, fallback to highest
    case "user-wins":
      return candidates where layer == user, fallback to highest
    case "merge":
      return merge_all(candidates)
```

### The Portability Test

The Portability Test is the decision function for layer placement: **"If I switch to a different project tomorrow, does this standard come with me?"**

| Answer | Layer | Examples |
|---|---|---|
| Yes, always | User | Commit message style, accessibility preferences, editor conventions |
| Only within this repo | Project | Framework-specific patterns, architecture decisions, repo structure |
| Within my team's repos | Team | API design patterns, review process, team coding conventions |
| Everywhere in the company | Organization | Security policies, compliance requirements, licensing rules |

`marr init` prompts for layer placement using this test. `marr sync` respects layer boundaries -- it never syncs user-layer standards into project-layer directories.

### Differentiation from Agent Systems

Agent systems provide at most two scoping layers:

| System | Layers | Gap |
|---|---|---|
| Claude Code | `~/.claude/` (user) + `.claude/` (project) | No team or org layer. No override policies. |
| Cursor | `.cursorrules` (project only) | No user layer at all. |
| PAI | `USER/` + `SYSTEM/` | Two layers, but no cross-project scoping. |
| Copilot | Global instructions + repo instructions | No granular override control. |

MARR adds the Org and Team layers, the override policy system, and the Portability Test as a principled decision function. This is governance infrastructure that no single agent platform is incentivized to build.

---

## 3. Cross-Project Sync

### The Problem

When the same standard exists in 10 projects, manual updates lead to drift. `marr sync` treats standards as distributable, versionable units -- propagating changes across repositories with diff review.

### Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Source A        │     │  Source B        │     │  Source C        │
│  (git remote)   │     │  (local dir)     │     │  (registry)      │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌────────────────────────────────────────────────────────────────────┐
│                     Sync Transport Abstraction                     │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ FileTransport│  │ GitTransport │  │ RegistryTransport        │ │
│  │ (local copy) │  │ (git clone)  │  │ (HTTP registry protocol) │ │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘ │
└────────────────────────────────┬───────────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     Sync Engine         │
                    │                         │
                    │  1. Fetch remote list   │
                    │  2. Compare versions    │
                    │  3. Generate diffs      │
                    │  4. Apply policy        │
                    │  5. Write updates       │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Local .marr/standards │
                    └─────────────────────────┘
```

### Sync Configuration

Sync sources are declared in `.marr/sync.yaml`:

```yaml
sources:
  - name: company-standards
    url: git@github.com:acme/marr-standards.git
    transport: git
    layer: org
    policy: review-required

  - name: frontend-team
    path: ../team-standards
    transport: file
    layer: team
    policy: auto-update

  - name: marr-defaults
    registry: https://registry.marr.dev
    transport: registry
    layer: project
    policy: pin-version
    pin: "1.2.0"
```

### Sync Transport Interface

Each transport implements a common interface:

```typescript
interface SyncTransport {
  // List standards available from the source
  list(): Promise<StandardRef[]>;

  // Read a specific standard's full content
  read(ref: StandardRef): Promise<Standard>;

  // Generate a human-readable diff between local and remote
  diff(local: Standard, remote: Standard): string;
}

interface StandardRef {
  id: string;       // e.g., "marr:version-control"
  version: number;
  hash: string;     // Content hash for fast comparison
}
```

MARR ships `FileTransport` and `GitTransport`. `RegistryTransport` is defined but deferred until a registry exists. Third parties can implement additional transports.

### Sync Policies

| Policy | Behavior | Use Case |
|---|---|---|
| `auto-update` | Sync applies updates without interactive review | Trusted sources (internal team repos, org mandates) |
| `review-required` | Sync generates diff, prompts for approval before applying | External sources, major version changes |
| `pin-version` | Never auto-update; only syncs the pinned version | Stability-critical projects, locked environments |

### Sync Flow

```
marr sync:
  for each source in sync.yaml:
    remote_standards = transport.list()
    for each remote_standard:
      local = find_local(remote_standard.id, source.layer)

      if local == null:
        # New standard from source
        if policy == auto-update:
          write(remote_standard, source.layer)
        else:
          prompt_user("New standard: {id}. Install?")

      else if local.hash == remote_standard.hash:
        skip  # Already up to date

      else if remote_standard.version > local.version:
        diff = transport.diff(local, remote_standard)
        if policy == auto-update:
          write(remote_standard, source.layer)
          log("Updated {id}: v{old} -> v{new}")
        elif policy == review-required:
          display(diff)
          prompt_user("Apply update?")
        elif policy == pin-version:
          log("Skipped {id}: pinned at v{pin}")

      else if remote_standard.version < local.version:
        warn("Local {id} is newer than source. Skipping.")

      else:  # Same version, different hash
        warn("Content divergence in {id} at v{version}. Run marr doctor.")
```

### Version Comparison

Standards use integer versioning in frontmatter (`version: 1`, `version: 2`). Version comparison is numeric, not semver. A higher version number always represents a newer standard. Content hashes (`sha256` of the full file) detect changes within the same version -- which indicates drift and is flagged as a warning.

---

## 4. Conflict and Gap Analysis

### The Problem

When multiple standards are active simultaneously, they can contradict each other. When a user config says "always use conventional commits" and a project standard says "use semantic release format," the agent receives conflicting instructions. `marr doctor` detects these conflicts before they reach the agent.

### Conflict Types

| Type | Description | Detection Method | Example |
|---|---|---|---|
| **Direct contradiction** | Two standards give opposite instructions for the same action | Keyword overlap + semantic analysis | "Use tabs" vs "Use spaces" |
| **Scope overlap** | Two standards govern the same domain with different rules | Scope field comparison | Two standards both claim scope over "git commits" |
| **Layer tension** | A higher-precedence layer contradicts a lower layer for a standard without clear override policy | Layer resolution + override policy check | User prefers semicolons; org enforces no-semicolons |
| **Methodology incompatibility** | Two standards teach different methodologies for the same domain | Semantic analysis (LLM-based) | One standard teaches trunk-based development; another teaches gitflow |

### Detection Pipeline

`marr doctor` runs a two-stage pipeline: deterministic checks first, then optional semantic analysis.

```
marr doctor:

  Stage 1: Deterministic Detection (no LLM required)
  ─────────────────────────────────────────────────
  1. Parse all active standards across all resolved layers
  2. Extract scope fields and keyword_hints from frontmatter
  3. Build scope overlap matrix:
     for each pair (standard_a, standard_b):
       overlap = compare_scopes(a.scope, b.scope)
       keyword_overlap = intersect(a.keyword_hints, b.keyword_hints)
       if overlap > threshold or keyword_overlap.length > 0:
         flag_potential_conflict(a, b)
  4. Check layer tensions:
     for each standard_id present in multiple layers:
       check override_policy is defined and consistent
       if policy missing or contradictory: flag
  5. Check version skew:
     for each standard_id present in multiple sync sources:
       if versions differ: flag

  Stage 2: Semantic Detection (LLM-based, optional via --deep flag)
  ─────────────────────────────────────────────────────────────────
  6. For each flagged pair from Stage 1:
     Send both standard bodies to LLM with prompt:
       "Do these two standards contain contradictory instructions?
        Identify specific conflicting directives."
  7. For unflagged pairs with high scope similarity:
     Run semantic comparison to catch implicit conflicts
     (methodology incompatibilities that keywords miss)
```

### Gap Analysis

`marr doctor` also identifies governance gaps -- engineering domains that lack standards coverage.

```
marr doctor --gaps:

  1. Define domain taxonomy:
     [version-control, testing, documentation, security,
      api-design, error-handling, logging, monitoring,
      dependency-management, deployment, code-review,
      accessibility, performance, database, ...]

  2. Map installed standards to domains:
     for each standard:
       domains_covered = extract_domains(standard.scope, standard.keyword_hints)

  3. Report uncovered domains:
     gap_domains = all_domains - covered_domains
     for each gap:
       report("No standard covers: {domain}")
```

The domain taxonomy is extensible. Organizations can define their own domains in `.marr/domains.yaml`. Gap analysis is informational -- it suggests where standards might be needed, not where they are required.

### Cross-System Conflict Detection (Optional)

If a host system exposes its native governance rules through a `GovernanceExport` interface, `marr doctor` can detect conflicts between MARR standards and host-native rules.

```typescript
// Host systems optionally implement this
interface GovernanceExport {
  rules: Array<{
    source: string;     // e.g., "PAI Steering Rules", "AGENTS.md"
    content: string;    // The rule text
    scope: string;      // What domain it governs
  }>;
}
```

The export is a file written by the host system to a known location (e.g., `.marr/host-governance.json`). `marr doctor` reads it if present, ignores it if absent. This is opt-in and degrades gracefully.

---

## 5. Cross-Platform Rendering

### The Problem

Different agent platforms consume configuration in different formats. Claude Code reads `CLAUDE.md`. Cursor reads `.cursorrules`. PAI loads Skills through hooks. The same governance content must be expressible in all these formats without manual translation.

### The Render Pipeline

```
┌──────────────────────┐
│   MARR Standard      │
│   (canonical .md     │
│    with frontmatter) │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   marr render        │
│                      │
│   Reads standard,    │
│   selects renderer   │
│   by --target flag   │
└──────────┬───────────┘
           │
     ┌─────┼─────┬──────────┬──────────┬──────────┐
     ▼     ▼     ▼          ▼          ▼          ▼
  claude cursor  pai     openclaw   system    custom
   .md   rules  skill    agents.md  prompt   (plugin)
```

### Renderer Specifications

Each renderer transforms a MARR standard into a host-native format:

**Claude Code Renderer (`--target claude`)**

Output: Markdown content block suitable for inclusion in `CLAUDE.md` or `@`-import.

```markdown
<!-- MARR Standard: version-control v1 -->
<!-- Scope: All git operations, branching, commits, and GitHub configuration -->

# Version Control Standard

[Body content from the standard, unmodified]
```

Activation: Claude Code uses `@`-imports in CLAUDE.md to pull in rendered standards. Trigger evaluation is not native to Claude Code; the rendered file is included wholesale or omitted by the user.

**Cursor Renderer (`--target cursor`)**

Output: Rule block formatted for `.cursorrules`.

```
---
description: Version Control Standard - All git operations, branching, commits, and GitHub configuration
globs:
  - "**/.git*"
  - "**/.github/**"
---

[Body content from the standard, unmodified]
```

Maps MARR's `scope` to Cursor's `description` field. Maps `keyword_hints` file patterns to Cursor's `globs` field where applicable.

**PAI Skill Renderer (`--target pai`)**

Output: A PAI-compatible skill file with YAML frontmatter.

```yaml
---
name: MARR Version Control
version: 1.0.0
category: standards
trigger: WHEN working with git branches, commits, or merges
x-marr-id: marr:version-control
---

# Version Control Standard

[Body content from the standard, unmodified]
```

Maps MARR's `triggers` to PAI's `trigger` field. Maps `title` to `name`. Preserves MARR identity via `x-marr-id`.

**OpenClaw Renderer (`--target openclaw`)**

Output: Content block for inclusion in OpenClaw's `AGENTS.md` or as a standalone skill.

```markdown
## Standard: Version Control (marr:version-control v1)

**Scope:** All git operations, branching, commits, and GitHub configuration
**Activation:** When working with git branches, commits, or merges

[Body content from the standard, unmodified]
```

**System Prompt Renderer (`--target system-prompt`)**

Output: Plain text block for appending to any system prompt. No special formatting. This is the universal fallback -- any LLM-based agent that accepts text instructions can consume this output.

```
=== STANDARD: Version Control (v1) ===
Scope: All git operations, branching, commits, and GitHub configuration

[Body content from the standard, unmodified]

=== END STANDARD ===
```

### The Manifest as Discovery Interface

The `standards.json` manifest is the machine-readable index that host systems use for programmatic discovery:

```json
{
  "marr_version": "3.6.0",
  "generated": "2026-02-14T00:00:00Z",
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
      "keyword_hints": ["git", "branch", "commit", "merge", "rebase", "pull request"],
      "override_policy": "user-wins",
      "file": "standards/version-control.md",
      "hash": "sha256:a1b2c3d4e5f6..."
    }
  ]
}
```

Host systems read the manifest to discover available standards, evaluate triggers against the manifest metadata, and then read only the standard files they need. This avoids parsing every markdown file at startup.

### Stable Identifiers

Every standard has a stable `id` field in frontmatter (e.g., `marr:version-control`). Identifiers follow the format `namespace:name`:

- `marr:` -- bundled MARR standards
- `org:` -- organization-defined standards
- `team:` -- team-defined standards
- `user:` -- user-defined standards
- Custom namespaces for third-party standard collections

Identifiers are stable across versions. Filenames can change; identifiers cannot. All cross-references (sync configuration, rendered output, manifest entries) use identifiers, not filenames.

---

## 6. Standard Format

The standard format is markdown with YAML frontmatter. This is a serialization choice -- it satisfies the constraints of being human-readable, machine-parseable, and host-agnostic using formats developers already know. It is not a MARR innovation.

### Required Frontmatter Fields

```yaml
---
marr: standard              # Type discriminator. Always "standard".
id: marr:version-control    # Stable identifier. Namespace:name format.
version: 1                  # Integer version number. Monotonically increasing.
title: Version Control Standard  # Human-readable title.
scope: >-                   # Natural language description of what this standard governs.
  All git operations, branching, commits, and GitHub configuration
triggers:                   # Conditions under which this standard should activate.
  - WHEN working with git branches, commits, or merges
  - WHEN creating or reviewing pull requests
---
```

### Optional Fields

```yaml
---
# ... required fields ...

# Override policy for multi-layer resolution
override_policy: user-wins   # user-wins | project-wins | org-enforced | merge

# Keyword hints for deterministic trigger evaluation
keyword_hints:
  - git
  - branch
  - commit
  - merge

# Enforcement tier tags (future, informed by real usage)
enforcement:
  default: context           # context | verify | enforce
  directives:
    - pattern: "STOP-GATE"
      tier: enforce
    - pattern: "MUST run tests"
      tier: verify

# Host-specific extensions
x-pai:
  algorithm_phase: [BUILD, EXECUTE]
x-openclaw:
  agent_scope: [main]
x-cursor:
  globs: ["**/.git*"]
---
```

### Field Specifications

| Field | Type | Required | Description |
|---|---|---|---|
| `marr` | `"standard"` | Yes | Type discriminator. Must be the string `"standard"`. |
| `id` | `string` | Yes | Stable identifier in `namespace:name` format. |
| `version` | `integer` | Yes | Version number. Minimum 1. Incremented on content changes. |
| `title` | `string` | Yes | Human-readable title. Used in rendered output and manifest. |
| `scope` | `string` | Yes | Natural language description of the governance domain. |
| `triggers` | `string[]` | Yes | Array of activation conditions. Minimum 1 entry. |
| `override_policy` | `enum` | No | Layer resolution policy. Default: `user-wins`. |
| `keyword_hints` | `string[]` | No | Tokens for deterministic trigger matching. |
| `enforcement` | `object` | No | Per-directive enforcement tier classification. |
| `x-*` | `any` | No | Host-specific extensions. MARR ignores these; hosts validate their own. |

### Schema Validation

The canonical schema is JSON Schema. This allows validation in any language ecosystem.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://marr.dev/schemas/standard/v1",
  "type": "object",
  "required": ["marr", "id", "version", "title", "scope", "triggers"],
  "properties": {
    "marr": { "const": "standard" },
    "id": {
      "type": "string",
      "pattern": "^[a-z][a-z0-9-]*:[a-z][a-z0-9-]*$"
    },
    "version": {
      "type": "integer",
      "minimum": 1
    },
    "title": {
      "type": "string",
      "minLength": 1
    },
    "scope": {
      "type": "string",
      "minLength": 1
    },
    "triggers": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 1
    },
    "override_policy": {
      "type": "string",
      "enum": ["user-wins", "project-wins", "org-enforced", "merge"]
    },
    "keyword_hints": {
      "type": "array",
      "items": { "type": "string" }
    },
    "enforcement": {
      "type": "object",
      "properties": {
        "default": {
          "type": "string",
          "enum": ["context", "verify", "enforce"]
        },
        "directives": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["pattern", "tier"],
            "properties": {
              "pattern": { "type": "string" },
              "tier": { "type": "string", "enum": ["context", "verify", "enforce"] }
            }
          }
        }
      }
    }
  },
  "patternProperties": {
    "^x-": {}
  },
  "additionalProperties": false
}
```

Zod serves as the TypeScript implementation of this schema, generated from or validated against the JSON Schema definition. The JSON Schema is canonical; Zod is a runtime convenience.

### Validation Levels

| Level | What It Checks | When | Tool |
|---|---|---|---|
| **Structural** | Required fields present, correct types, valid YAML | Authoring time | `marr validate` |
| **Semantic** | Scope is meaningful, triggers are non-trivial, ID is unique | Review time | `marr doctor` |
| **Compatibility** | No conflicts with other installed standards | Sync time | `marr sync` (pre-apply check) |

---

## 7. CLI Architecture

The `marr` CLI is the user-facing interface to all governance operations. Each subcommand maps to a specific architectural capability.

### Command Map

```
marr
├── init          # Scaffold standards in a project
├── sync          # Cross-project synchronization
├── doctor        # Conflict and gap analysis
├── validate      # Schema validation
├── render        # Cross-platform rendering
└── manifest      # Generate standards.json
```

### `marr init`

Scaffolds MARR in a project directory.

```
marr init [--layer user|project] [--from <source>]

Actions:
  1. Create .marr/ directory structure:
     .marr/
     ├── standards/          # Standard files
     ├── sync.yaml           # Sync source configuration
     └── config.yaml         # Local MARR configuration

  2. If --from specified, sync initial standards from source
  3. If --layer user, scaffold in ~/.config/marr/ instead
  4. Run marr validate on all scaffolded standards
  5. Generate initial standards.json manifest

Output:
  .marr/ directory populated with valid standards
  standards.json manifest in project root
```

### `marr sync`

Synchronizes standards from configured sources.

```
marr sync [--source <name>] [--dry-run] [--force]

Actions:
  1. Read .marr/sync.yaml for source configuration
  2. For each source (or specified --source):
     a. Initialize appropriate SyncTransport
     b. Fetch remote standard list
     c. Compare versions and hashes against local
     d. Generate diffs for changed standards
     e. Apply sync policy (auto-update, review-required, pin-version)
  3. Run marr validate on any updated standards
  4. Regenerate standards.json manifest

Flags:
  --dry-run    Show what would change without applying
  --force      Override pin-version policy (manual version bump)
  --source     Sync only from the named source

Output:
  Updated standard files
  Sync log showing what changed
  Updated standards.json
```

### `marr doctor`

Runs conflict detection and gap analysis.

```
marr doctor [--deep] [--gaps] [--fix]

Actions:
  Stage 1 (always):
    1. Parse all active standards across all resolved layers
    2. Run deterministic conflict detection:
       - Scope overlap analysis
       - Keyword intersection
       - Layer tension check
       - Version skew detection
    3. Report findings with severity levels

  Stage 2 (--deep flag, requires LLM):
    4. Run semantic conflict analysis on flagged pairs
    5. Check for methodology incompatibilities
    6. If .marr/host-governance.json exists, include host rules

  Gap analysis (--gaps flag):
    7. Map standards to engineering domains
    8. Report uncovered domains

Flags:
  --deep       Enable LLM-based semantic analysis
  --gaps       Include gap analysis
  --fix        Interactively resolve detected conflicts

Output:
  Conflict report with severity and resolution suggestions
  Gap report listing uncovered engineering domains
```

### `marr validate`

Validates standards against the JSON Schema.

```
marr validate [<file>...] [--strict]

Actions:
  1. If files specified, validate those files
  2. Otherwise, validate all .md files in resolved standard directories
  3. Parse YAML frontmatter
  4. Validate against JSON Schema
  5. Check ID uniqueness across all layers
  6. Report errors and warnings

Flags:
  --strict     Treat warnings as errors (for CI pipelines)

Exit codes:
  0  All standards valid
  1  Validation errors found
```

### `marr render`

Renders standards to host-native formats.

```
marr render --target <platform> [--standard <id>] [--output <path>]

Targets:
  claude        -> CLAUDE.md compatible markdown
  cursor        -> .cursorrules format
  pai           -> PAI Skill format
  openclaw      -> OpenClaw AGENTS.md format
  system-prompt -> Plain text for any system prompt

Actions:
  1. Resolve active standards (all layers, with override resolution)
  2. For each standard (or specified --standard):
     a. Select renderer for target platform
     b. Transform frontmatter to host-native metadata
     c. Emit rendered output
  3. Write to --output path, or stdout if not specified

Flags:
  --target     Required. Target platform.
  --standard   Render only the specified standard (by id).
  --output     Output file path. Default: stdout.
  --all        Render all resolved standards into a single output file.

Output:
  Rendered standard(s) in host-native format
```

### `marr manifest`

Generates the `standards.json` manifest.

```
marr manifest [--output <path>]

Actions:
  1. Resolve all standard directories across all layers
  2. Parse frontmatter from each standard
  3. Compute content hashes
  4. Generate standards.json with full metadata

Flags:
  --output     Output path. Default: ./standards.json

Output:
  standards.json file with all standard metadata
```

---

## 8. Integration Model

### The Export-Surface Principle in Practice

MARR's integration boundary is deliberately simple. There are no adapters, no SDKs, no runtime dependencies. Host systems integrate with MARR through two interfaces:

1. **The filesystem** -- standard files in known directories
2. **The manifest** -- `standards.json` for programmatic discovery

### Consumption Depth Levels

Host systems integrate with MARR at varying depths. Each level adds capability without requiring the previous level's implementation to change.

```
Level 0: File Consumer
──────────────────────
Host reads .md files from a directory. Includes them in agent context.
No trigger evaluation. No conflict detection. No sync.

  How it works:
    1. User runs `marr render --target <host> --all --output <file>`
    2. Host reads the rendered file as part of its normal config loading
    3. All rendered standards are active all the time

  Example hosts: Cursor (.cursorrules), Copilot (custom instructions)
  Implementation effort: Zero (user runs marr render manually)


Level 1: Contextual Activation
──────────────────────────────
Host reads standards.json, evaluates triggers against task context,
and loads only matching standards.

  How it works:
    1. Host reads standards.json at startup or session start
    2. On each task/message, host extracts task context
    3. Host evaluates trigger conditions (keyword matching, LLM, or hybrid)
    4. Host loads only matching standard files into agent context

  Example hosts: PAI (LoadContext hook), Claude Code (with wrapper script)
  Implementation effort: Moderate (host builds trigger evaluation logic)


Level 2: Full Governance Integration
─────────────────────────────────────
Host participates in the full governance lifecycle: trigger evaluation,
layer resolution, conflict awareness, and optionally governance export.

  How it works:
    1. Everything from Level 1
    2. Host resolves multi-layer scoping (reads from user + project + team + org)
    3. Host applies override policies during standard resolution
    4. Host optionally exports its own governance rules for cross-system
       conflict detection (.marr/host-governance.json)
    5. Host uses enforcement tier tags to determine compliance behavior

  Example hosts: PAI (at maturity), OpenClaw (at maturity)
  Implementation effort: Significant (host builds full governance integration)
```

### What Hosts Build (Not MARR)

The following are explicitly the host system's responsibility:

| Responsibility | Why It's the Host's |
|---|---|
| Trigger evaluation logic | Each host has different context shapes and timing constraints |
| Context injection mechanism | Each host loads context differently (`@`-imports, hooks, system prompts) |
| Enforcement behavior | Each host has different tool policy and execution models |
| User-facing conflict presentation | CLI, chat, web UI -- depends on the host's interface |
| Standard caching and performance optimization | Depends on the host's architecture |

MARR provides the raw materials: validated standard files, a manifest for discovery, a schema for validation, keyword hints for deterministic matching, and a CLI for management. Everything beyond that boundary is the host's engineering problem.

### The Filesystem Contract

```
Project root
├── .marr/
│   ├── standards/              # Project-layer standard files
│   │   ├── version-control.md
│   │   ├── testing.md
│   │   └── documentation.md
│   ├── sync.yaml               # Sync source configuration
│   └── config.yaml             # MARR local configuration
├── standards.json              # Machine-readable manifest (generated)
└── [host-specific files]       # e.g., CLAUDE.md, .cursorrules (rendered)

User home
└── .config/
    └── marr/
        └── standards/          # User-layer standard files
            ├── coding-style.md
            └── commit-format.md
```

This is the contract. MARR writes to `.marr/` and `standards.json`. Hosts read from these locations. The filesystem is the interface. No IPC, no sockets, no shared memory, no runtime coordination.

---

## Appendix A: Data Flow Summary

```
Author writes standard (.md + YAML frontmatter)
        │
        ▼
  marr validate ──── Schema check (JSON Schema)
        │
        ▼
  marr init / manual placement into layer directory
        │
        ▼
  marr manifest ──── Generate standards.json
        │
        ├──── marr sync ──── Propagate to/from other projects
        │
        ├──── marr doctor ── Detect conflicts and gaps
        │
        ├──── marr render ── Transform to host-native format
        │
        ▼
  Host system reads standards.json or rendered files
        │
        ▼
  Host evaluates triggers against current task context
        │
        ▼
  Matching standards injected into agent context
        │
        ▼
  Agent operates under governance constraints
```

## Appendix B: Design Decisions and Rationale

| Decision | Rationale |
|---|---|
| Integer versions, not semver | Standards are single documents, not libraries. Breaking changes are rare enough that semver adds complexity without value. The version integer means "revision count." |
| JSON Schema as canonical, Zod as impl | JSON Schema is language-agnostic. Zod is convenient for TypeScript but would exclude Python, Rust, Go hosts from validation. |
| Filesystem as primary interface | Every agent platform can read files. No platform requires a specific IPC mechanism. Files are the lowest common denominator with the broadest reach. |
| No built-in trigger evaluator | Trigger evaluation is deeply host-specific. MARR defining one would either be too simple (keywords only) or too opinionated (requiring LLM access). Hosts know their own context best. |
| Override policy on the standard, not the layer | The standard author knows whether their standard should be overridable. A security standard should declare `org-enforced` at authoring time, not rely on the org admin configuring the layer correctly. |
| Renderers are one-way transforms | MARR renders to host formats. It does not parse host formats back into MARR standards. The canonical format is always the MARR `.md` file. Rendered output is disposable and regenerable. |
| No registry in v1 | A registry adds operational complexity (hosting, auth, availability). File and git transports cover the immediate need. Registry transport is defined in the architecture but deferred until demand exists. |
| `x-` prefix for host extensions | Borrowed from HTTP headers. Allows host-specific metadata without polluting the core schema. MARR validates its own fields; hosts validate their own extensions. Neither breaks the other. |

## Appendix C: Glossary

| Term | Definition |
|---|---|
| **Standard** | A structured methodology document (markdown + YAML frontmatter) that teaches an AI agent how to perform a class of work and specifies constraints it must follow. |
| **Governance plane** | The architectural layer that defines behavioral expectations for AI agents without executing agent logic. MARR is a governance plane. |
| **Export surface** | The set of interfaces MARR exposes for external consumption: files on disk and the standards.json manifest. |
| **Layer** | A scoping level (Org, Team, Project, User) that determines where a standard applies and how it participates in override resolution. |
| **Override policy** | A per-standard declaration of how conflicts between layers are resolved (user-wins, project-wins, org-enforced, merge). |
| **Portability Test** | The decision function for layer placement: "If I switch projects, does this standard come with me?" |
| **Sync transport** | An abstraction for fetching standards from a remote source (file, git, registry). |
| **Renderer** | A transform that converts a MARR standard from canonical format to a host-native format. |
| **Manifest** | The `standards.json` file that indexes all published standards with metadata, versions, and content hashes. |
| **Consumption depth** | The level at which a host integrates with MARR: Level 0 (file consumer), Level 1 (contextual activation), Level 2 (full governance integration). |
| **Keyword hints** | Optional tokens in standard frontmatter that enable deterministic trigger evaluation without LLM access. |
| **Enforcement tier** | A classification of directive severity: context (LLM reads it), verify (host checks compliance), enforce (host blocks non-compliance). |
