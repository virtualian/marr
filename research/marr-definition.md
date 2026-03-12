# MARR Definition

**Date:** 2026-02-14
**Status:** Authoritative reference. Post-debate, post-concession.
**Version:** Reflects MARR v3.5.0 identity after analytical refinement.

---

## 1. What MARR Is

MARR (Making Agents Really Reliable) is a governance plane for AI-assisted development. It provides a system for authoring, validating, scoping, distributing, and synchronizing development standards that AI coding agents consume. MARR does not run agents, orchestrate workflows, or execute code. It defines how work should be done and makes those definitions available to any agent platform through a common file format and a CLI toolchain. The analogy is Terraform: Terraform won because no single cloud provider would build multi-cloud infrastructure management. MARR occupies the same structural position -- no single agent platform (Anthropic, OpenAI, Google, Cursor) is incentivized to build governance tooling that supports its competitors.

---

## 2. What a MARR Standard Is

A standard is a structured methodology document that teaches an AI agent HOW to perform a class of work and specifies the constraints it MUST follow while doing so.

Standards are hybrid units. They are not pure constraints ("do X, don't do Y") and they are not pure methodology guides ("here is how to think about X"). They are both. The Diataxis documentation standard teaches the Diataxis methodology AND requires the agent to organize docs according to it. The version control standard teaches a branching strategy AND requires squash merges and conventional commits.

A standard is NOT a distinct primitive from a skill. A MARR standard could be delivered as a skill with governance metadata attached. The need for "standard" as a separate architectural primitive was an artifact of a false dichotomy between constraints and capabilities. The term "standard" is retained because it communicates the right intent -- these documents establish binding expectations, not optional guidance -- but the underlying structure is methodology content with governance metadata (triggers, scope, version, validation schema).

Standards are markdown files with YAML frontmatter. The frontmatter carries machine-readable metadata (trigger conditions, scope declaration, version number). The body carries the methodology and constraints in natural language, consumed by the LLM at runtime.

```yaml
---
marr: standard
version: 1
title: Version Control Standard
scope: All git operations, branching, commits, and GitHub configuration
triggers:
  - WHEN working with git branches, commits, or merges
  - WHEN creating or reviewing pull requests
---

# Version Control Standard

[Methodology and constraints here...]
```

---

## 3. MARR's Value Proposition

Content is the adoption wedge. Curated standards for version control, testing, documentation, and development workflow get engineering teams in the door. But content is not the moat. Anyone can write a markdown file with rules in it.

The moat is the governance tooling -- meta-capabilities that no individual agent platform is incentivized to build:

**Multi-layer scoping.** Standards can be scoped to Organization, Team, Project, or User levels with defined precedence and override policies. An organization can enforce security standards that individual developers cannot override. A developer can set personal coding style preferences that follow them across projects.

**Cross-project sync.** `marr sync` propagates standards between repositories with diff review. When the organization updates its testing standard, every project gets the update with a reviewable diff. Standards do not drift.

**Conflict and gap analysis.** `marr doctor` detects semantic contradictions between active standards and identifies governance gaps. If a user config says "always use conventional commits" and a project standard says "use semantic release format," MARR flags the conflict before the agent receives contradictory instructions.

**Cross-platform portability.** The same MARR standards render to CLAUDE.md (Claude Code), .cursorrules (Cursor), PAI Skills, OpenClaw AGENTS.md, and any future agent platform that reads text files. Write once, govern everywhere.

**Schema validation.** Standards are structurally validated against a defined schema. Malformed frontmatter, missing triggers, and invalid fields are caught at authoring time, not at runtime.

**The structural moat is cross-platform neutrality.** Anthropic will not build governance tooling that works with Cursor. OpenAI will not build standards management that supports Claude Code. Google will not build sync infrastructure for competitors' agent systems. MARR sits in the gap that competitive dynamics guarantee will remain empty.

**The buyer is the engineering manager** -- the person responsible for consistency, quality, and reproducibility across a team of developers using AI coding agents, potentially across different agent platforms.

---

## 4. What MARR Is NOT

**Not an agent runtime.** MARR governs agents; it does not execute them. It never runs tools, manages sessions, or orchestrates workflows. The moment it does, it competes with its host systems.

**Not a configuration management system.** MARR distributes standards, not arbitrary configuration. It is not Ansible for AI agents. It does not manage environment variables, deployment targets, or infrastructure state.

**Not a platform abstraction layer.** MARR does not try to make all agent platforms look the same. It does not provide a universal agent API or abstract away platform differences. Each platform has its own execution model; MARR provides governance content they all consume through their own mechanisms.

**Not a content library.** Content (the 9 bundled standards) is necessary for adoption but is not the product. The product is the governance toolchain: scoping, sync, conflict detection, validation, and cross-platform rendering. Content is the wedge; tooling is the moat.

**Not host-specific.** MARR never builds adapters, import pipelines, or integration code for specific agent platforms. It does not ship a PAI Pack, a ClawHub skill, or a Cursor extension. Host systems build their own integration. MARR provides the raw materials.

**Not novel in its activation pattern.** Trigger-based conditional activation using YAML frontmatter is an existing pattern used by PAI skills, Cursor rules, and GitHub Actions. MARR applies this pattern to development standards; it did not invent it.

---

## 5. The Export-Surface Principle

**MARR refines its export surface. It does not build import pipelines into host systems.**

MARR's boundary is the filesystem and the manifest. Standards are validated markdown files with YAML frontmatter, placed on disk in known locations. A machine-readable `standards.json` manifest indexes all published standards with their metadata, versions, and content hashes.

Host systems consume MARR through their own mechanisms:
- Claude Code reads standards via `@`-imports in CLAUDE.md
- PAI loads standards through LoadContext hooks at SessionStart
- OpenClaw reads standards during Gateway context assembly
- Cursor includes standards via .cursorrules
- Any system that reads text files can consume MARR standards

MARR does not know or care how the host loads, evaluates, or enforces standards. MARR publishes; hosts consume. The export surface is clean: files, a manifest, a schema, and a CLI for management operations (init, sync, validate, doctor). Everything beyond that boundary is the host's responsibility.

---

## 6. MARR's Relationship to Agent Systems

MARR is an intentional complement to agent platforms, not a competitor. It fills a specific gap: these systems are optimized for execution, not governance. They run tools, manage context, and produce output. They do not manage which behavioral standards apply to which work, synchronize those standards across projects, or detect conflicts between governance rules.

**Claude Code / Anthropic CLI:** Provides CLAUDE.md and project-level instructions but no standard management, no cross-project sync, no conditional activation based on task context. MARR standards load into Claude Code's context system. Claude Code provides the execution environment; MARR provides structured behavioral expectations.

**Cursor:** Provides .cursorrules for project-level agent configuration. No standard library, no multi-layer scoping, no sync between projects. MARR standards render to .cursorrules format.

**Copilot / Codex:** Provide system-level instructions and custom instructions. No governance toolchain. MARR standards can be included in custom instruction configurations.

**PAI (Personal AI):** Provides a cognitive execution framework (the Algorithm), lifecycle hooks, memory, and thinking tools. PAI's governance layer (Steering Rules) is always-on and coarse-grained. MARR provides the conditional, fine-grained standards layer PAI lacks. PAI's hooks provide the trigger evaluation and context injection mechanism. MARR provides the content and metadata those hooks consume.

**OpenClaw:** Provides a complete agent runtime -- Gateway, sessions, tools, multi-channel messaging, ClawHub marketplace. OpenClaw's behavioral governance (AGENTS.md) is always-loaded with no conditional path. MARR provides conditional activation of detailed standards based on task context. OpenClaw's context assembly phase is the natural integration point.

**Jules / Other emerging agents:** MARR's file-based output and standard schema mean any future agent system that reads markdown files can consume MARR standards without MARR knowing the system exists.

In every case, the relationship is the same: MARR publishes governance content. The agent system decides how and when to load it. MARR never reaches into the host; hosts reach into MARR.

---

## 7. Goals and Scope

**The goal is organizational coherence across agent-assisted development.**

When a team of developers uses AI coding agents -- potentially different agents, potentially across multiple projects -- MARR ensures they operate under consistent, validated, version-controlled behavioral standards. The same branching strategy, the same commit format, the same documentation structure, the same testing philosophy. Not because a human remembers to paste rules into each session, but because the governance plane enforces it structurally.

**Standard selection is gap-driven.** MARR does not attempt to standardize everything. It identifies domains where AI agents lack structured guidance and where inconsistency causes real problems. The current 9 standards cover: development workflow, version control, testing, documentation, MCP usage, UI/UX, writing prompts, plan execution, and user configuration scoping. Future standards target gaps surfaced by real usage, not speculative completeness.

**The scope is any engineering methodology domain where AI agents benefit from structured guidance.** This includes software development practices (branching, testing, documentation) but is not limited to them. Any repeatable class of work where an AI agent needs to know HOW to do it and WHAT constraints to follow is a candidate for a MARR standard.

**What is out of scope:**
- Runtime agent behavior (tool execution, session management, memory)
- Platform-specific features (hooks, plugins, extensions for individual agent systems)
- Arbitrary project configuration (environment variables, build settings, deployment targets)
- Enforcement -- MARR defines standards; host systems enforce them

---

## Concession Record

This definition incorporates three analytical concessions that stripped away the original inflated framing:

1. **Standards are not pure constraints.** They are hybrid methodology+constraint units. This was demonstrated by examining the Diataxis standard, which teaches a methodology AND requires adherence to it. The constraint/capability dichotomy was false.

2. **Trigger-based conditional activation is not novel.** PAI skills, Cursor rules, and GitHub Actions all use identical YAML frontmatter triggers. MARR applied an existing pattern to a new domain. It did not invent the pattern.

3. **"Standard" is not a distinct primitive from "Skill."** A standard could be delivered as a skill with governance metadata. The separate primitive was an artifact of the false constraint/capability dichotomy. The term is retained for clarity of intent, not architectural necessity.

These concessions collapsed the original "governance substrate" framing. What remained -- and what this document defines -- is MARR's actual identity: a governance plane whose value lies in cross-platform meta-capabilities (scoping, sync, conflict analysis, portability), not in content alone and not in architectural novelty.
