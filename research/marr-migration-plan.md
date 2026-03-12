# MARR Migration Plan

**Date:** 2026-02-14
**Status:** Engineering roadmap. Builds on marr-definition.md (identity) and marr-architecture.md (target).
**Scope:** Migration from MARR v3.5.0 (methodology content library with CLI) to target architecture (governance plane for AI-assisted development).

---

## 1. Migration Overview

MARR v3.5.0 is a methodology content library. It ships 9 development standards as markdown files, a CLI for scaffolding and syncing them, and Zod-based schema validation. It works with Claude Code through `@`-imports and `CLAUDE.md`. It has two configuration layers (user + project) and no mechanism for programmatic discovery, cross-platform rendering, or organizational governance.

The target architecture (defined in marr-architecture.md) is a governance plane for AI-assisted development. The shift is structural:

| Dimension | v3.5.0 (Current) | Target |
|---|---|---|
| **Identity** | Content library with CLI tooling | Governance plane with content as adoption wedge |
| **Scoping** | 2 layers (user + project) | N layers (Org > Team > Project > User) with override policies |
| **Platforms** | Claude Code only | Any agent platform via renderers |
| **Discovery** | Parse `.md` files from disk | Machine-readable `standards.json` manifest |
| **Conflict detection** | None | Deterministic + optional semantic (LLM) |
| **Sync** | Basic file copy | Transport abstraction with sync policies |
| **Schema** | Zod only | JSON Schema (canonical) + Zod (runtime convenience) |
| **Standard identity** | Filenames | Stable `id` field in frontmatter |

The strategic rationale (from the definition doc): no single agent platform is incentivized to build governance tooling that supports its competitors. MARR occupies that gap. Content gets teams in the door; the governance toolchain is the moat.

This migration plan breaks the journey into 5 phases. Each phase is independently shippable and valuable. No phase requires the next to deliver value.

---

## 2. What Stays

These components carry forward with minor updates, not rewrites:

### 2.1 The 9 Bundled Standards

All 9 standards in `resources/project/common/` survive. Their body content is unchanged. Only frontmatter needs updates (adding `id`, optional `keyword_hints`, optional `enforcement` tags). See Section 7 for the specific frontmatter update pass.

Current standards:
1. `prj-development-workflow-standard.md`
2. `prj-version-control-standard.md`
3. `prj-testing-standard.md`
4. `prj-documentation-standard.md`
5. `prj-mcp-usage-standard.md`
6. `prj-ui-ux-standard.md`
7. `prj-writing-prompts-standard.md`
8. `prj-plan-execution-standard.md`
9. `prj-user-config-standard.md`

### 2.2 CLI Commands

All four existing commands survive. They get enhanced, not replaced:

| Command | Current Behavior | Enhancement |
|---|---|---|
| `marr init` | Scaffold `.claude/marr/` with standards | Add `--layer` flag, generate `standards.json`, create `.marr/` structure |
| `marr sync` | Copy standards between user/project layers | Add transport abstraction, sync policies, `.marr/sync.yaml` config |
| `marr validate` | Zod schema validation of frontmatter | Add JSON Schema validation, `--strict` flag, ID uniqueness check |
| `marr doctor` | Basic health check | Add conflict detection, gap analysis, `--deep` LLM mode, `--gaps` flag |

### 2.3 Standard Format

Markdown + YAML frontmatter. This is the canonical format. It does not change. New fields are additive.

### 2.4 Two-Layer Config

The existing user (`~/.claude/`) + project (`.claude/marr/`) layout remains the default. Multi-layer scoping (Org, Team) is opt-in. Existing users see no change unless they configure additional layers.

### 2.5 Zod Validation

Zod schemas stay as the TypeScript runtime validator. JSON Schema is added alongside as the canonical, language-agnostic schema. Zod is derived from or validated against the JSON Schema definition.

---

## 3. What Changes

### 3.1 Standards Frontmatter Schema

**Complexity: S**

Add new fields to the frontmatter schema. All new fields are optional except `id` (required after Phase 1).

```yaml
---
marr: standard
id: marr:version-control          # NEW: stable identifier (namespace:name)
version: 1
title: Version Control Standard
scope: All git operations, branching, commits, and GitHub configuration
triggers:
  - WHEN working with git branches, commits, or merges
  - WHEN creating or reviewing pull requests

# NEW optional fields
keyword_hints:                     # Tokens for deterministic trigger matching
  - git
  - branch
  - commit
  - merge
override_policy: user-wins         # Layer resolution policy
enforcement:                       # Per-directive enforcement classification
  default: context
  directives:
    - pattern: "NEVER make code changes on the main branch"
      tier: enforce
    - pattern: "Run tests before pushing"
      tier: verify
x-pai:                             # Host-specific extensions (MARR ignores)
  algorithm_phase: [BUILD, EXECUTE]
---
```

Changes to existing fields: none. All existing frontmatter remains valid.

### 3.2 Multi-Layer Scoping

**Complexity: M**

Extend from 2 fixed layers to N configurable layers with precedence:

- **User layer:** `~/.config/marr/standards/` (or existing `~/.claude/` path for backward compat)
- **Project layer:** `.marr/standards/` (or existing `.claude/marr/` path for backward compat)
- **Team layer:** Resolved via `MARR_TEAM_PATH` env var or `.marr/sync.yaml`
- **Org layer:** Resolved via `MARR_ORG_PATH` env var or `.marr/sync.yaml`

When Org and Team layers are not configured, they resolve to `null` and are skipped. The system degrades to the existing 2-layer behavior.

Override policies (`user-wins`, `project-wins`, `org-enforced`, `merge`) are declared per-standard in frontmatter. Default is `user-wins` (matches current behavior).

### 3.3 Sync Evolution

**Complexity: L**

Replace the current basic sync with a transport-abstracted system:

- Define `SyncTransport` interface (`list()`, `read()`, `diff()`)
- Ship `FileTransport` (local directory copy) and `GitTransport` (git clone/pull)
- Define but defer `RegistryTransport` (HTTP registry protocol)
- Add `.marr/sync.yaml` configuration file for sync sources
- Add sync policies: `auto-update`, `review-required`, `pin-version`
- Add `--dry-run`, `--force`, `--source` flags to `marr sync`

### 3.4 Doctor Enhancements

**Complexity: M**

Upgrade `marr doctor` from basic health check to conflict/gap analysis:

- **Stage 1 (deterministic):** Scope overlap detection, keyword intersection, layer tension check, version skew detection
- **Stage 2 (LLM, `--deep` flag):** Semantic conflict analysis, methodology incompatibility detection
- **Gap analysis (`--gaps` flag):** Map standards to engineering domain taxonomy, report uncovered domains
- **Extensible domain taxonomy:** Organizations define custom domains in `.marr/domains.yaml`
- **Cross-system detection (optional):** Read `.marr/host-governance.json` if present

### 3.5 NEW: `marr render`

**Complexity: M**

New command for cross-platform rendering:

```
marr render --target <platform> [--standard <id>] [--output <path>] [--all]
```

Targets at launch:
- `claude` -- CLAUDE.md compatible markdown (current behavior, formalized)
- `cursor` -- `.cursorrules` format
- `pai` -- PAI Skill format
- `openclaw` -- OpenClaw AGENTS.md format
- `system-prompt` -- Plain text universal fallback

Each renderer is a pure transform: MARR canonical format in, host-native format out. Renderers are one-way. MARR never parses host formats back.

### 3.6 NEW: `marr manifest`

**Complexity: S**

New command to generate `standards.json`:

```
marr manifest [--output <path>]
```

Outputs a machine-readable index of all resolved standards with metadata, versions, triggers, keyword hints, and content hashes. This is the programmatic discovery interface for host systems.

### 3.7 NEW: JSON Schema Publication

**Complexity: S**

Publish a JSON Schema definition for the standard frontmatter format at a stable URL (`https://marr.dev/schemas/standard/v1`). Include in the npm package. Zod schemas are derived from or validated against this definition.

### 3.8 Documentation Reframe

**Complexity: S**

Update all docs, README, and package description to reflect the governance plane identity. Replace any "content library" or "governance substrate" framing. The message: MARR is a governance plane. Content is the adoption wedge. Tooling is the moat.

---

## 4. What Gets Dropped

The following items from the earlier refinement recommendations (marr-refinement-recommendations.md) are explicitly **not** carried forward:

| Dropped Item | Reason |
|---|---|
| **Trigger Evaluation Contract** | Trigger evaluation is host-specific. MARR defines trigger metadata (`triggers`, `keyword_hints`). Hosts implement evaluation however they want. A formal contract with `Input`/`Output` types is over-specification -- hosts have different context shapes, timing constraints, and evaluation strategies. The `keyword_hints` field gives deterministic hosts what they need without mandating a contract. |
| **Reference Evaluator library** (`@virtualian/marr/evaluate`) | Redundant if standards are consumed through host skill infrastructure. PAI has its own trigger evaluation in hooks. OpenClaw has its own in Gateway. Shipping a reference evaluator creates a dependency MARR should not own. If hosts want keyword matching, `keyword_hints` in the manifest gives them the data; they write the matching logic. |
| **Host-specific adapters** | Permanently rejected (per definition doc). MARR never ships a PAI Pack, a ClawHub package, or a Cursor extension. MARR refines its export surface. Hosts build import pipelines. |
| **"Governance substrate" framing** | Collapsed during the definition debate. The term over-claimed architectural novelty. MARR is a governance plane -- it publishes behavioral expectations. "Substrate" implied deeper infrastructure integration that does not exist and should not exist. |
| **Trigger test fixtures** | Dropped alongside the Trigger Evaluation Contract. Without a formal contract to test against, fixtures have no anchor. Hosts test their own trigger implementations against their own context shapes. |
| **Conformance level test suites** | Premature. Conformance levels are described in the architecture doc as consumption depth levels (Level 0/1/2), which is sufficient. Formal test suites should be derived from real integrations, not speculation. Revisit after at least two host integrations exist. |

---

## 5. Phased Roadmap

### Phase 1: Foundation (v3.6.0)

**Goal:** Make MARR programmatically consumable. Lowest risk, highest immediate value.

**Estimated duration:** 2-3 weeks

| Work Item | Complexity | Description |
|---|---|---|
| Add `id` field to frontmatter schema | S | Add to Zod schema. Required field. Format: `namespace:name`. |
| Update 9 bundled standards with `id` | S | Add `id` to each standard's frontmatter. Content unchanged. |
| Add `keyword_hints` to schema | S | Optional `string[]` field in frontmatter. |
| Add `keyword_hints` to bundled standards | S | Add keyword tokens to each standard's triggers. |
| Implement `marr manifest` command | S | Generate `standards.json` from resolved standard directories. |
| Publish JSON Schema for frontmatter | S | JSON Schema definition. Validate Zod against it. |
| Auto-generate manifest on `marr init` | S | `marr init` generates `standards.json` alongside scaffolding. |
| Auto-regenerate manifest on `marr sync` | S | `marr sync` updates `standards.json` after applying changes. |
| Update README and package description | S | Reframe from content library to governance plane. |

**Phase 1 deliverables:**
- Every standard has a stable `id`
- `standards.json` manifest exists for programmatic discovery
- JSON Schema published alongside Zod
- `keyword_hints` available for deterministic trigger matching
- Host systems can discover and index MARR standards without parsing markdown

**Phase 1 version bump:** v3.5.0 -> v3.6.0 (minor: new features, backward compatible)

---

### Phase 2: Multi-Layer Scoping (v3.7.0)

**Goal:** Extend from 2 layers to N layers with override policies. Enable organizational governance.

**Estimated duration:** 3-4 weeks

| Work Item | Complexity | Description |
|---|---|---|
| Implement layer resolution engine | M | Resolve Org > Team > Project > User with `null` fallback for unconfigured layers. |
| Add `override_policy` to schema | S | Optional enum field (`user-wins`, `project-wins`, `org-enforced`, `merge`). Default: `user-wins`. |
| Add `override_policy` to bundled standards | S | Tag each standard with appropriate policy. Most will be `user-wins`. |
| Implement override resolution algorithm | M | Given a standard ID present in multiple layers, apply override policy to select the winner. |
| Add `MARR_ORG_PATH` / `MARR_TEAM_PATH` env var support | S | Environment variable resolution for Org and Team layers. |
| Add `.marr/config.yaml` for local config | S | Local MARR configuration (layer paths, defaults). |
| Migrate directory structure | S | Support `.marr/standards/` alongside existing `.claude/marr/`. Detect and use whichever exists. |
| Update `marr init` with `--layer` flag | S | Scaffold user-layer or project-layer standards. Add Portability Test prompts. |
| Update `marr validate` for multi-layer | S | Validate standards across all resolved layers. Check ID uniqueness per layer. |
| Update `marr manifest` for multi-layer | S | Manifest includes layer source for each standard. |

**Phase 2 deliverables:**
- Standards resolvable from up to 4 layers
- Override policies control which version wins when a standard exists at multiple layers
- Org and Team layers configurable via env vars
- Existing 2-layer users see no behavior change (new layers are `null` by default)

**Phase 2 version bump:** v3.6.0 -> v3.7.0

---

### Phase 3: Cross-Platform Rendering (v3.8.0)

**Goal:** Same standards, multiple agent platforms. Write once, govern everywhere.

**Estimated duration:** 3-4 weeks

| Work Item | Complexity | Description |
|---|---|---|
| Define renderer interface | S | Common transform interface: MARR standard in, host-native string out. |
| Implement Claude renderer | S | CLAUDE.md format. Mostly formalizes current behavior. |
| Implement Cursor renderer | M | `.cursorrules` format. Map `scope` to `description`, `keyword_hints` to `globs`. |
| Implement PAI renderer | M | PAI Skill format. Map `triggers` to `trigger`, `title` to `name`, add `x-marr-id`. |
| Implement OpenClaw renderer | M | AGENTS.md format. Structure as labeled content blocks. |
| Implement system-prompt renderer | S | Plain text universal fallback. Delimiter-wrapped content blocks. |
| Implement `marr render` command | M | CLI command with `--target`, `--standard`, `--output`, `--all` flags. |
| Add `x-*` extension support to schema | S | Pattern properties for host-specific metadata. MARR ignores; hosts validate their own. |
| Add render step to `marr init` | S | Optional `--render` flag generates host-native output during init. |

**Phase 3 deliverables:**
- `marr render` produces valid output for 5 platform targets
- Same standard consumable by Claude Code, Cursor, PAI, OpenClaw, and any system prompt
- `x-*` extensions allow host-specific metadata without schema pollution
- Rendered output is disposable and regenerable (canonical source is always the `.md` file)

**Phase 3 version bump:** v3.7.0 -> v3.8.0

---

### Phase 4: Enhanced Governance (v3.9.0)

**Goal:** Conflict detection, gap analysis, enforcement tiers. The governance toolchain becomes real.

**Estimated duration:** 4-5 weeks

| Work Item | Complexity | Description |
|---|---|---|
| Implement deterministic conflict detection | M | Scope overlap matrix, keyword intersection, layer tension check, version skew detection. |
| Implement `--deep` LLM semantic analysis | M | Send flagged pairs to LLM for contradiction detection. Methodology incompatibility check. |
| Implement gap analysis (`--gaps`) | M | Map standards to engineering domain taxonomy. Report uncovered domains. |
| Define extensible domain taxonomy | S | Default taxonomy + `.marr/domains.yaml` for custom domains. |
| Add `enforcement` field to schema | S | Optional object with `default` tier and per-directive `pattern`/`tier` pairs. |
| Tag bundled standard directives | M | Review all 9 standards. Tag key directives with `context`/`verify`/`enforce` tiers. |
| Add cross-system conflict detection | S | Read `.marr/host-governance.json` if present. Include host rules in conflict analysis. |
| Update `marr doctor` CLI | S | Add `--deep`, `--gaps`, `--fix` flags. Structured output with severity levels. |
| Add `--strict` flag to `marr validate` | S | Treat warnings as errors. For CI pipeline integration. |

**Phase 4 deliverables:**
- `marr doctor` detects scope overlaps, keyword conflicts, and layer tensions without LLM
- `--deep` mode catches semantic contradictions and methodology incompatibilities
- Gap analysis identifies uncovered engineering domains
- Enforcement tier tags classify directive severity for host systems
- CI-friendly validation with `--strict`

**Phase 4 version bump:** v3.8.0 -> v3.9.0

---

### Phase 5: Sync Evolution (v4.0.0)

**Goal:** Transport abstraction, sync policies, registry protocol. Standards as distributable units at organizational scale.

**Estimated duration:** 4-6 weeks

| Work Item | Complexity | Description |
|---|---|---|
| Define `SyncTransport` interface | S | TypeScript interface: `list()`, `read()`, `diff()`. |
| Implement `FileTransport` | S | Local directory copy. Simplest transport. |
| Implement `GitTransport` | M | Git clone/pull. Diff via git. Most common transport for teams. |
| Define `RegistryTransport` interface | S | HTTP protocol spec for future registry. Interface only -- no registry server. |
| Implement `.marr/sync.yaml` config | S | Sync source configuration: name, url/path, transport, layer, policy. |
| Implement sync policies | M | `auto-update`, `review-required`, `pin-version`. Policy enforcement during sync. |
| Add `--dry-run` to `marr sync` | S | Show what would change without applying. |
| Add `--force` to `marr sync` | S | Override pin-version policy for manual version bumps. |
| Add `--source` to `marr sync` | S | Sync only from a named source. |
| Implement content hash comparison | S | SHA-256 hashing for fast change detection. Detect drift within same version. |
| Pre-apply validation | S | Run `marr validate` on incoming standards before applying sync updates. |
| Post-sync manifest regeneration | S | Auto-regenerate `standards.json` after sync completes. |

**Phase 5 deliverables:**
- Sync abstracted over transport (file, git, future registry)
- Sync policies control update behavior per source
- Organizations can distribute standards via git repos with policy-controlled propagation
- Content hash comparison enables fast change detection
- Drift detection flags same-version content divergence

**Phase 5 version bump:** v3.9.0 -> v4.0.0 (major: sync architecture is a significant capability expansion)

---

## 6. Backward Compatibility

Each phase maintains compatibility with existing MARR v3.5 users through the following constraints:

### Phase 1 (Foundation)
- The `id` field is required in the schema going forward, but `marr validate` emits a **warning** (not error) for standards missing `id` during a transition period (one release cycle). After v3.7.0, `id` becomes a hard requirement.
- `keyword_hints` is optional. Existing standards work without them.
- `standards.json` is additive. Existing workflows that do not use the manifest are unaffected.
- JSON Schema is published alongside Zod. Existing Zod validation is unchanged.

### Phase 2 (Multi-Layer Scoping)
- The default layer configuration is User + Project (the existing 2-layer model). Org and Team layers resolve to `null` unless explicitly configured.
- `override_policy` defaults to `user-wins`, which matches current behavior (user config overrides project config).
- The `.marr/standards/` directory is supported alongside the existing `.claude/marr/` path. If both exist, `.marr/` takes precedence with a deprecation warning for `.claude/marr/`.
- `marr init` without `--layer` scaffolds in the project layer, matching current behavior.

### Phase 3 (Cross-Platform Rendering)
- `marr render` is a new command. Existing commands are unchanged.
- The Claude renderer formalizes the current output format. Users already rendering to CLAUDE.md manually see identical output.
- `x-*` extensions are optional. Standards without them validate normally.
- Rendered output files are separate from canonical standard files. Existing standard files are never modified by rendering.

### Phase 4 (Enhanced Governance)
- `marr doctor` without flags retains its current behavior (basic health check) plus adds deterministic conflict detection (additive).
- `--deep` and `--gaps` are opt-in flags. No LLM usage without explicit request.
- `enforcement` field is optional. Standards without it are treated as `context` tier (LLM reads and complies -- the current implicit behavior).
- `--strict` is opt-in. Default validation behavior unchanged.

### Phase 5 (Sync Evolution)
- `marr sync` without a `.marr/sync.yaml` file falls back to current behavior (copy between user/project layers).
- New flags (`--dry-run`, `--force`, `--source`) are additive.
- The `SyncTransport` interface is internal. Existing users interact through the same `marr sync` CLI.
- `FileTransport` replicates the current copy behavior as the default transport.

### Migration Path Summary

A user on v3.5.0 upgrades to each version and sees:

| Version | What Changes for Existing Users |
|---|---|
| v3.6.0 | Warning on `marr validate` if standards lack `id`. New `marr manifest` command available. |
| v3.7.0 | `id` now required (fix warnings from v3.6). New `--layer` flag on `marr init`. Everything else opt-in. |
| v3.8.0 | New `marr render` command available. Existing workflow unchanged. |
| v3.9.0 | `marr doctor` output is richer (more diagnostics). New flags available. No behavior change without flags. |
| v4.0.0 | `marr sync` gains transport and policy support. Without `.marr/sync.yaml`, behavior is unchanged. |

---

## 7. Standard Content Updates

Each of the 9 bundled standards needs a frontmatter update pass. This is metadata surgery, not content rewrite.

### 7.1 Changes Per Standard

For every standard:

1. **Add `id` field** -- Assign a stable identifier in `marr:name` format.
2. **Add `keyword_hints`** -- Extract keyword tokens from trigger text for deterministic matching.
3. **Add `override_policy`** -- Default `user-wins` for most. `project-wins` where repo consistency matters.
4. **Tag enforcement tiers (Phase 4)** -- Review "Core Rules" and "NEVER VIOLATE" sections. Tag `enforce` for hard constraints, `verify` for checkable requirements, leave the rest as `context`.
5. **Reframe governance-only language** -- Where standard body text frames itself as pure constraint, add or adjust phrasing to reflect the hybrid methodology+constraint nature.

### 7.2 Standard ID Assignments

| Current Filename | Assigned ID | Override Policy |
|---|---|---|
| `prj-development-workflow-standard.md` | `marr:development-workflow` | `project-wins` |
| `prj-version-control-standard.md` | `marr:version-control` | `project-wins` |
| `prj-testing-standard.md` | `marr:testing` | `project-wins` |
| `prj-documentation-standard.md` | `marr:documentation` | `project-wins` |
| `prj-mcp-usage-standard.md` | `marr:mcp-usage` | `user-wins` |
| `prj-ui-ux-standard.md` | `marr:ui-ux` | `project-wins` |
| `prj-writing-prompts-standard.md` | `marr:writing-prompts` | `user-wins` |
| `prj-plan-execution-standard.md` | `marr:plan-execution` | `user-wins` |
| `prj-user-config-standard.md` | `marr:user-config` | `user-wins` |

### 7.3 Example: Updated Frontmatter

Before (v3.5.0):

```yaml
---
marr: standard
version: 1
title: Version Control Standard
scope: All git operations, branching, commits, and GitHub configuration
triggers:
  - WHEN working with git branches, commits, or merges
  - WHEN creating or reviewing pull requests
  - WHEN configuring repository settings
  - WHEN auditing version control compliance
---
```

After (v3.6.0):

```yaml
---
marr: standard
id: marr:version-control
version: 1
title: Version Control Standard
scope: All git operations, branching, commits, and GitHub configuration
triggers:
  - WHEN working with git branches, commits, or merges
  - WHEN creating or reviewing pull requests
  - WHEN configuring repository settings
  - WHEN auditing version control compliance
keyword_hints:
  - git
  - branch
  - commit
  - merge
  - rebase
  - pull request
  - push
  - cherry-pick
override_policy: project-wins
---
```

Body content: unchanged.

### 7.4 Effort Estimate

- Frontmatter updates (9 standards): **S** -- mechanical, completable in a single session
- Enforcement tier tagging (9 standards): **M** -- requires reviewing each standard's directives and classifying them. Deferred to Phase 4.
- Language reframing: **S** -- minor phrasing adjustments in body text where pure-constraint framing exists. Deferred to Phase 4.

---

## 8. Success Criteria

The migration is working when these conditions are met:

### Phase 1 Success
- [ ] All 9 bundled standards have stable `id` fields
- [ ] `marr manifest` generates a valid `standards.json`
- [ ] JSON Schema published and validating correctly alongside Zod
- [ ] At least one external system can read `standards.json` and discover standards programmatically

### Phase 2 Success
- [ ] Multi-layer config working with at least Org + Project + User (3 layers)
- [ ] Override policies correctly resolve conflicts between layers
- [ ] Existing 2-layer users experience no behavior change after upgrade

### Phase 3 Success
- [ ] `marr render` producing valid output for at least 3 platform formats (Claude, Cursor, system-prompt as minimum)
- [ ] At least one non-Claude-Code integration consuming rendered output or the manifest
- [ ] Rendered output round-trips: original standard -> render -> host loads successfully

### Phase 4 Success
- [ ] `marr doctor` deterministic mode detects scope overlaps and layer tensions without false positives in the bundled standard set
- [ ] Gap analysis identifies at least 3 uncovered engineering domains given the current 9 standards
- [ ] `--deep` mode (when LLM available) catches at least one semantic conflict that deterministic mode misses

### Phase 5 Success
- [ ] `marr sync` works with at least 2 transport types (file + git)
- [ ] Sync policies correctly enforce `auto-update`, `review-required`, and `pin-version` behaviors
- [ ] An organization can distribute standards to 3+ projects via a shared git repo with reviewable diffs
- [ ] Content hash comparison detects drift within same-version standards

### Overall Migration Success
- [ ] Standards consumable by at least 3 different agent platforms (Claude Code + 2 others)
- [ ] `marr render` producing valid output for at least 3 platform formats
- [ ] At least one non-Claude-Code integration consuming the manifest
- [ ] No existing v3.5.0 user workflow broken at any phase boundary

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Breaking existing users** | Medium | High | Backward compatibility is a hard constraint at every phase. New fields are optional. New commands are additive. Existing behavior preserved unless user opts into new features. One-release-cycle deprecation warnings before breaking changes. |
| **Over-engineering** | Medium | Medium | Each phase is independently shippable and valuable. If Phase 3 never ships, Phase 1+2 still deliver real value (manifest + multi-layer). If Phase 5 never ships, the current sync still works. No phase depends on future phases for its value proposition. |
| **Platform absorption** | High | High | Speed. The governance layer gap exists because platforms are not incentivized to fill it. This window closes if a platform (Anthropic, Cursor, etc.) decides to build cross-platform governance. Mitigation is to capture the position before the window closes. Phase 1+2 are the highest priority because manifest + multi-layer scoping are the hardest for platforms to replicate (they have no incentive to support competitors). |
| **Content quality declining during tooling focus** | Medium | Medium | Maintain content curation alongside tooling development. Each phase includes a standard content review pass (even if minor). The 9 bundled standards are the adoption wedge -- if they degrade, the governance tooling has nothing to govern. Budget at least 20% of each phase for content quality. |
| **Adoption friction from directory structure change** | Low | Medium | Support both `.claude/marr/` (legacy) and `.marr/` (target) paths. Auto-detect which exists. Emit deprecation warnings, not errors. Provide a `marr migrate` helper (or fold into `marr init --migrate`) to move from old to new structure. |
| **Renderer maintenance burden** | Medium | Low | Renderers are one-way, stateless transforms. They are simple by design. Platform format changes are handled by updating the renderer, not the standard. If a platform's format changes dramatically, the old renderer still produces valid output for the old format -- users update renderers at their own pace. |
| **Scope creep into host territory** | Low | High | The definition doc's boundary is the hard constraint: MARR publishes; hosts consume. Any proposed feature that requires knowledge of a specific host's runtime, API, or execution model is rejected. The Export-Surface Principle is the architectural firewall. |
| **JSON Schema / Zod drift** | Low | Low | Automated tests validate that Zod schemas and JSON Schema produce identical validation results for a shared test suite. If they diverge, CI fails. JSON Schema is canonical; Zod is regenerated. |

---

## Appendix A: Phase Dependency Graph

```
Phase 1 (Foundation)
  │
  ├──► Phase 2 (Multi-Layer Scoping)
  │       │
  │       ├──► Phase 4 (Enhanced Governance)
  │       │
  │       └──► Phase 5 (Sync Evolution)
  │
  └──► Phase 3 (Cross-Platform Rendering)
```

Phase 1 is the prerequisite for all other phases (stable IDs and manifest are foundational).

Phase 2 and Phase 3 are independent of each other and can be built in parallel.

Phase 4 depends on Phase 2 (conflict detection needs multi-layer resolution).

Phase 5 depends on Phase 2 (sync policies interact with layer model).

Phase 3 has no downstream dependencies -- it is a standalone capability.

---

## Appendix B: Directory Structure Migration

Current (v3.5.0):
```
project/
├── .claude/
│   └── marr/
│       ├── prj-version-control-standard.md
│       ├── prj-testing-standard.md
│       └── ...
│
~/.claude/
└── [user standards]
```

Target (v4.0.0):
```
project/
├── .marr/
│   ├── standards/
│   │   ├── version-control.md
│   │   ├── testing.md
│   │   └── ...
│   ├── sync.yaml
│   └── config.yaml
├── standards.json
│
~/.config/marr/
└── standards/
    ├── coding-style.md
    └── commit-format.md
```

The `prj-` filename prefix is dropped. Standards are identified by `id`, not filename. The `.claude/marr/` path is supported as a legacy fallback with deprecation warnings until v5.0.

---

## Appendix C: Decisions Not Yet Made

These decisions are deferred until real usage data informs them:

| Decision | When to Decide | What Informs It |
|---|---|---|
| Whether to rename the npm package from `@virtualian/marr` | After Phase 3 (when multi-platform is real) | Whether the package serves only Claude Code users or a broader audience |
| Whether to build a registry server | After Phase 5 (when sync is proven) | Whether git transport is sufficient or organizations need centralized discovery |
| Whether to support standard inheritance (one standard extends another) | After Phase 4 (when conflict detection is robust) | Whether standard authors request it and whether conflict detection can handle it |
| Whether enforcement tier tags need runtime validation tooling | After Phase 4 (when tiers exist in real standards) | Whether hosts actually use tier tags to change enforcement behavior |
| Whether to formalize conformance levels with test suites | After 2+ host integrations exist | Derived from real integration patterns, not speculation |
