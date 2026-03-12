# MARR Integration Council Debate

**Date:** 2026-02-13
**Format:** 4-perspective Council debate on MARR architectural refinements
**Context:** MARR v3.5.0 integration with PAI v2.5 and OpenClaw

---

## The Question

What structural refinements should MARR make to its OWN architecture to become a better integration partner for systems with fundamentally different architectures -- without losing its independence or platform-agnosticism?

---

## Council Members

| Seat | Role | Primary Concern |
|---|---|---|
| 1 | **MARR Maintainer** | Simplicity, platform-agnosticism, maintainability |
| 2 | **PAI Architect** | Hook-driven lifecycle, trigger evaluation, ISC system |
| 3 | **OpenClaw Contributor** | Gateway runtime, context assembly, ClawHub marketplace |
| 4 | **Standards Theorist** | Separation of concerns, extensibility, versioning |

---

## Question 1: Trigger Evaluation Protocol

**Should MARR define a standard "trigger evaluation protocol" that host systems implement? Or should MARR provide its own evaluator?**

---

### MARR Maintainer

MARR should define the protocol, not provide the evaluator. Today MARR's trigger evaluation is zero-code: triggers are natural language strings (`WHEN working with git branches`), and the evaluator is the LLM itself, guided by the Conditional Reading Protocol in `MARR-PROJECT-CLAUDE.md`. This is the simplest possible design. The LLM reads the trigger list, pattern-matches against its current task, and reads the relevant standard. No code runs. No API calls. No runtime dependency.

If MARR ships an evaluator, it becomes a runtime dependency. PAI would need to call it from hooks. OpenClaw would need to call it from the Gateway. Now MARR is no longer a configuration system -- it is middleware. Every bug in the evaluator blocks every host system. Every host's trigger evaluation context is different (PAI has ISC metadata; OpenClaw has session context and channel info), so a universal evaluator would either be too generic to be useful or too specific to be portable.

**Position:** MARR defines the trigger format and the evaluation contract (what inputs go in, what decisions come out). Host systems implement evaluation using their own runtime capabilities.

The contract should be: given a task description (string) and a list of standards with triggers, return the set of standards whose triggers match. How the matching happens -- LLM semantic matching, keyword matching, regex, embeddings -- is the host's choice.

### PAI Architect

A protocol is necessary, but it needs to be more precise than "LLM reads triggers and decides." PAI's hooks run in under 100ms. LLM-based trigger evaluation is non-deterministic and would need to happen inside the session, consuming tokens. PAI needs a deterministic, fast evaluation path.

What PAI actually needs: MARR triggers expressed in a form that a TypeScript function can evaluate against structured context. PAI's LoadContext hook already receives the tool name and session metadata. If MARR triggers included optional structured matchers alongside the natural language string, PAI could evaluate them deterministically in hooks without LLM inference.

Example: a trigger like `WHEN working with git branches, commits, or merges` could optionally include structured metadata:

```yaml
triggers:
  - text: WHEN working with git branches, commits, or merges
    tool_hints: [Bash]
    keyword_hints: [git, branch, commit, merge, rebase, cherry-pick]
```

The natural language string remains the canonical trigger (for LLM evaluation in simple hosts). The `tool_hints` and `keyword_hints` are optional accelerators that deterministic evaluators can use.

**Position:** MARR should define a trigger evaluation protocol with two tiers: (1) a baseline natural-language contract any LLM can fulfill, and (2) optional structured hints that deterministic evaluators can use for speed. MARR should NOT ship an evaluator. But MARR should define what the evaluator's input and output look like.

### OpenClaw Contributor

OpenClaw's Gateway assembles context BEFORE the LLM sees the message. Context assembly happens in `piembeddedrunner.ts` during the system prompt construction phase -- before inference. There is no LLM available to evaluate triggers at this point. OpenClaw must either (a) evaluate triggers deterministically during context assembly, or (b) inject ALL standards and let the LLM filter, which defeats the purpose.

This means for OpenClaw, MARR's current design (LLM evaluates triggers) does not work at all. The Gateway needs machine-evaluable trigger conditions.

What would work: a MARR-defined evaluation function that takes a message string and a standard's trigger metadata, and returns a match score. This could be as simple as keyword overlap scoring. OpenClaw would call this function during context assembly for each standard, include standards above a threshold, and move on.

But here is the tension: if MARR ships this evaluator as a library, MARR gains a runtime component. If MARR only defines the protocol, every host reimplements the same basic keyword matching. That is wasteful duplication.

**Position:** MARR should ship a tiny, zero-dependency trigger evaluation library (pure function, no side effects) alongside the protocol definition. Hosts CAN use it, or CAN implement their own. Think of it like a reference implementation -- not mandatory, but available. This is common in standards work: the spec defines behavior, a reference implementation demonstrates it. The library should be importable as a single function: `evaluateTriggers(taskDescription: string, standards: Standard[]): MatchedStandard[]`.

### Standards Theorist

This question cuts to the heart of the content/transport/evaluation separation. Looking at how successful standards handle this:

- **HTTP** defines the protocol, not the server. Apache and Nginx both implement it differently.
- **JSON Schema** defines validation rules but provides reference implementations in multiple languages.
- **OpenAPI** defines the spec. Swagger, Redocly, and others provide tooling.

The pattern that works: define the protocol normatively, provide a reference implementation informatively.

MARR should define three things formally:

1. **Trigger Format** (already done -- YAML frontmatter with string triggers). This is the content layer.
2. **Evaluation Contract** (new -- inputs, outputs, and matching semantics). This is the protocol layer.
3. **Reference Evaluator** (new -- a pure function demonstrating the contract). This is the informative implementation layer.

The contract should specify:
- **Input:** A task context object (at minimum, a string description; optionally, structured metadata like tool names, file paths, keywords)
- **Output:** An ordered list of matched standards with confidence scores
- **Matching semantics:** What counts as a match? MARR should specify minimum matching behavior (keyword overlap) and recommended matching behavior (semantic similarity)

The reference evaluator should be a single exported function with no dependencies beyond what MARR already uses. Hosts may adopt it directly or use it as a conformance test for their own implementation.

**Position:** Protocol-first with reference implementation. Define the evaluation contract as a normative specification. Ship a reference evaluator as an informative, zero-dependency pure function. Hosts choose whether to use, adapt, or replace it.

---

## Question 2: Distribution Model

**Should MARR's distribution model evolve beyond npm + `marr sync`? How?**

---

### MARR Maintainer

The current model works well for what MARR is. `npm install -g @virtualian/marr` gets you the CLI. `marr init` sets up a project. `marr sync` propagates between projects. Standards ship as markdown files bundled in the npm package. This is simple, reliable, and requires no infrastructure beyond what every developer already has.

Adding new distribution channels means maintaining them. A ClawHub package means understanding ClawHub's packaging format, versioning, and submission process. A PAI Pack means maintaining Pack metadata, INSTALL.md, VERIFY.md. Every channel MARR distributes through becomes a compatibility commitment.

I am open to making MARR's standard files EASIER for other systems to consume -- publishing the standards as a standalone artifact, for example. But MARR should not own the distribution into those systems. Let PAI build a Pack that consumes MARR standards. Let OpenClaw build a ClawHub skill that reads MARR files. MARR exports; others import.

**Position:** Keep npm as the primary channel. Add a secondary artifact: a standalone standards archive (zip/tarball of `resources/project/common/`) published alongside npm releases, with a stable download URL. This gives non-npm consumers a clean way to fetch MARR standards without installing the CLI. Do not build native PAI or OpenClaw distribution packages.

### PAI Architect

PAI's Pack system is the natural distribution channel for PAI users. PAI Packs have `INSTALL.md` (scripted setup), `VERIFY.md` (validation), skill files, hook configs. A `pai-marr-standards` Pack could:

1. Run `marr init --project --standards all` during INSTALL
2. Register a LoadContext hook that evaluates MARR triggers
3. Provide a `MARRStandards` skill for managing standards interactively

But the MARR Maintainer is right -- MARR should not build this Pack. PAI should build it, consuming MARR's standards files. What MARR needs to provide is a clean, versioned, machine-readable export of its standards library.

Today, standards live in `resources/project/common/` inside the npm package. You can only get them by (a) installing the npm package globally and running `marr init`, or (b) extracting the npm tarball. Neither is friendly for programmatic consumption.

**Position:** MARR should publish a `standards.json` manifest alongside each release -- a machine-readable index of all bundled standards with their frontmatter metadata (title, scope, triggers, version). This manifest lets PAI (and OpenClaw) discover and fetch standards programmatically without installing the CLI. The actual standard files remain markdown with YAML frontmatter; the manifest is a computed index.

### OpenClaw Contributor

ClawHub has 5,700+ skills with vector search, versioning, and ranking. It is the obvious distribution channel for OpenClaw users. But ClawHub distributes SKILLS, not standards. MARR standards are not skills.

Two paths forward:

**Path A:** Publish MARR standards as a ClawHub "standards pack" (skill-shaped package containing standards files). This works today but is semantically wrong -- it is a standard wearing a skill costume, as the integration review identified.

**Path B:** Wait for OpenClaw to add a `standards` category to ClawHub, then publish natively. This is cleaner but depends on OpenClaw core development.

Either way, MARR itself should not be the publisher. A community member or the OpenClaw team should maintain the ClawHub package, consuming MARR's standards files.

What MARR can do to help: provide stable, versioned URLs for individual standards and the full standards catalog. Something like:

```
https://raw.githubusercontent.com/virtualian/marr/v3.5.0/resources/project/common/prj-version-control-standard.md
```

This already works via GitHub. MARR just needs to document it as a supported consumption path.

**Position:** MARR should NOT distribute through ClawHub or PAI Packs. MARR should make its standards trivially consumable by external systems: (1) a `standards.json` manifest, (2) documented GitHub raw URLs as a stable API, (3) the standalone archive the MARR Maintainer proposed. Let host ecosystems build their own distribution wrappers.

### Standards Theorist

Looking at successful standards distribution:

- **IETF RFCs** are published as numbered documents with stable URLs. Implementations reference them by number.
- **W3C specs** have versioned URLs, "latest" aliases, and machine-readable metadata (ReSpec).
- **JSON Schema** has a meta-schema and a registry of published schemas.

The pattern: standards are published as stable, versioned documents with machine-readable metadata. Distribution is separate from the standard itself.

MARR should formalize what it already partially has:

1. **Standard Identity** -- Each standard should have a stable identifier (not just a filename). Something like `marr:version-control:v1`. This decouples identity from distribution.

2. **Standards Registry** -- A machine-readable catalog of all MARR-published standards with identifiers, versions, dependencies (if any), and locations. This is the `standards.json` manifest others mentioned, but with formal semantics.

3. **Version Semantics** -- MARR standards already have `version: 1` in frontmatter. Formalize what version bumps mean: is v2 backward-compatible with v1? Can a host pin to v1 while v2 exists? MARR needs a compatibility policy.

4. **Location Independence** -- A standard's identity should not be tied to where it lives. `marr:version-control:v1` should resolve to the same content whether fetched from npm, GitHub raw, or a local `marr sync` copy. This means content-addressable identification (even something as simple as including a content hash in the manifest).

**Position:** Add a formal standards registry (`standards.json`) with stable identifiers, versioned URLs, and content hashes. Define version compatibility semantics. Let distribution happen through any channel -- npm, GitHub raw, ClawHub wrappers, PAI Packs -- all referencing the same canonical identifiers.

---

## Question 3: Adapters vs Universal Interface

**Should MARR define integration adapters (PAI adapter, OpenClaw adapter) or a universal integration interface?**

---

### MARR Maintainer

Neither. MARR should not define adapters OR a universal interface. MARR is a configuration system that produces markdown files with YAML frontmatter. Its output is already universal -- it is plain text files with a defined schema. Every system that can read files and parse YAML can consume MARR standards.

The moment MARR defines a "PAI adapter" it becomes coupled to PAI's hook API. The moment it defines an "OpenClaw adapter" it becomes coupled to OpenClaw's Gateway. PAI changes its hook signature? MARR's adapter breaks. OpenClaw changes context assembly? MARR's adapter breaks. MARR is now on two release trains it does not control.

What MARR should provide is documentation. A "MARR Integration Guide" that describes: here is the standard file format, here is the frontmatter schema, here is how triggers work, here is the evaluation contract. PAI and OpenClaw read the guide and build their own integration.

**Position:** No adapters, no universal interface. MARR's output IS the interface -- markdown files with YAML frontmatter. Provide integration documentation, not integration code. The cleanest interface is the one that already exists: files on disk.

### PAI Architect

I disagree with "files on disk is the interface." PAI's integration point is hooks -- TypeScript functions that receive JSON and produce output. "Files on disk" requires PAI to write boilerplate: find the standards directory, parse frontmatter, evaluate triggers, format output for context injection. Every PAI user writing a MARR integration hook would write the same boilerplate.

MARR should provide a universal integration interface -- not adapters. A thin TypeScript library that:

```typescript
import { loadStandards, evaluateTriggers, formatForInjection } from '@virtualian/marr/integration';

// In a PAI LoadContext hook:
const standards = loadStandards(projectDir);
const matched = evaluateTriggers(standards, { task: input.message, tools: ['Bash'] });
const context = formatForInjection(matched, 'markdown');
console.log(context);
```

Three functions. Zero PAI-specific knowledge. OpenClaw could call the same functions in its Gateway. Cursor could call them in its extension. The interface is universal because it operates on MARR's own concepts (standards, triggers, formatted output), not on any host's concepts.

This is not an adapter. It does not know about hooks or Gateways. It is a library for working with MARR standards programmatically. The difference matters: adapters couple MARR to hosts. A standards library couples hosts to MARR's format, which they are already coupled to by definition.

**Position:** MARR should provide a universal integration library -- `@virtualian/marr/integration` -- that exports functions for loading, evaluating, and formatting standards. Not adapters. Not host-specific code. A library for working with MARR's own format.

### OpenClaw Contributor

The PAI Architect's library proposal makes sense, but with a critical caveat: it must be isomorphic. OpenClaw's Gateway runs in Node.js, but not all hosts do. If the library is TypeScript-only, it only serves Node.js hosts.

The real question is: what is the minimal viable interface? I think it is THREE artifacts:

1. **The schema** -- A JSON Schema (or Zod schema exported as JSON Schema) defining the standard file format. Any language can validate against this.

2. **The reference evaluator** -- A pure function in TypeScript/JavaScript. Hosts that run Node.js can import it directly. Others use it as a spec.

3. **The format specification** -- A prose document defining what the evaluator SHOULD do, so non-JS hosts can implement it.

This is better than a monolithic library because it separates concerns: validation, evaluation, and specification are independent.

**Position:** MARR should export its schema as JSON Schema (in addition to Zod), ship a reference evaluator as a standalone module, and provide a specification document. This three-artifact approach serves all hosts regardless of language or runtime.

### Standards Theorist

Adapters are an anti-pattern for standards. Adapters create N implementations to maintain (one per host). When the standard changes, all adapters must update. When a host changes, its adapter must update. This is an O(N*M) maintenance problem.

A universal interface is better but still couples the standard to a specific technology (TypeScript, in this case).

The standards-world solution is **profiles and conformance levels**:

1. **Level 0 -- File Consumer:** Can read MARR standard files, parse YAML frontmatter, and present standards to users. No trigger evaluation. (Simplest possible integration.)

2. **Level 1 -- Trigger Evaluator:** Can evaluate trigger conditions against a task context and select matching standards. Includes keyword-based matching at minimum. (Programmatic integration.)

3. **Level 2 -- Full Integration:** Can evaluate triggers, detect conflicts between standards, validate new standards against the schema, and sync standards between projects. (Complete MARR feature parity.)

Each level has a conformance test suite (even if it is just a set of test cases in a JSON file). A host declares "we implement Level 1" and runs the test suite to prove it. MARR publishes the conformance tests; hosts run them.

This decouples MARR from any specific implementation while ensuring interoperability. PAI implements Level 2 because they want full integration. OpenClaw implements Level 1 because they just need trigger evaluation in the Gateway. Cursor implements Level 0 because they just want to show standards in a sidebar.

**Position:** Define integration conformance levels, not adapters or interfaces. Publish conformance test suites (input/output pairs in JSON). Let each host implement the level they need, in any language, verified by the test suite. No code from MARR to maintain per-host.

---

## Question 4: Responsibility Boundaries

**What is the right boundary between MARR's responsibility and the host system's responsibility?**

---

### MARR Maintainer

MARR is responsible for:

1. **Standard content** -- Writing, maintaining, and versioning the standards themselves
2. **Standard format** -- Defining and evolving the YAML frontmatter schema
3. **Standard validation** -- Ensuring standards conform to the schema (`marr validate`)
4. **Standard distribution** -- Making standards available via npm and documented URLs
5. **Cross-project sync** -- Propagating standards between projects (`marr sync`)
6. **Conflict detection** -- Finding contradictions between standards (`marr doctor`)

The host system is responsible for:

1. **Standard loading** -- Getting standard files into the agent's context
2. **Trigger evaluation** -- Deciding which standards apply to the current task
3. **Standard enforcement** -- Making the agent follow the activated standard
4. **Integration plumbing** -- Connecting MARR's files to the host's lifecycle

MARR does NOT enforce standards. It defines and distributes them. Enforcement is always the host's job because enforcement requires understanding the agent's runtime, which MARR deliberately does not have.

**Position:** MARR owns content, format, validation, distribution, and sync. Hosts own loading, evaluation, enforcement, and integration. The boundary is the file system: MARR puts validated files on disk; hosts read and act on them.

### PAI Architect

I mostly agree with the MARR Maintainer, but the boundary needs to be sharper on one point: **who owns trigger semantics?**

MARR defines triggers as natural language strings. But what do they MEAN, operationally? When a trigger says `WHEN working with git branches`, what constitutes "working with git branches"?

- Running `git branch`? Yes.
- Reading a file that happens to be tracked by git? Ambiguous.
- Discussing git branching strategy in a conversation with no code changes? Maybe.
- Spawning a sub-agent that will do git work? Depends.

If MARR does not define trigger semantics, every host interprets them differently. PAI might activate the version control standard when it sees a Bash tool call containing "git." OpenClaw might activate it only when the user's message contains "branch" or "commit." Same triggers, different behavior. Users who switch between hosts get inconsistent standard activation.

MARR should own trigger semantics to the extent of providing:
- Example test cases ("given this task, these standards should match")
- Edge case guidance ("a planning conversation about git strategy should NOT activate the standard; only activate when git operations are imminent")
- A matching baseline ("at minimum, keyword overlap; at best, semantic intent matching")

**Position:** MARR owns trigger definition AND trigger semantics (via test cases and guidance). Hosts own trigger evaluation implementation. The semantics bridge the gap: MARR says what SHOULD match; hosts figure out HOW to match it.

### OpenClaw Contributor

The boundary gets complicated when MARR standards contain directives that require runtime capabilities MARR does not have.

Take MARR's Development Workflow standard and its STOP-GATE: "Check current branch. If on main: STOP. Create a feature branch BEFORE proceeding." This is a runtime enforcement requirement. It requires:
- Executing `git branch` to check the current branch
- Blocking further action until a branch is created
- State tracking (has the gate been passed?)

MARR defines the STOP-GATE. But who enforces it? The host. PAI can enforce it with a PreToolUse hook that checks the branch before allowing Bash commands. OpenClaw can enforce it with a tool policy that requires branch verification before git operations. But MARR wrote the rule without knowing how enforcement would work.

This creates a risk: MARR writes standards that assume enforcement capabilities the host does not have. A simple host (like Cursor's CLAUDE.md consumer) cannot enforce STOP-GATEs at all -- it just shows the standard as context and hopes the LLM complies.

**Position:** MARR should categorize standard directives by enforcement requirements:

- **Context-only directives** -- Rules the LLM can follow with no runtime support (e.g., "use squash merge"). Just inject the text; compliance depends on the LLM.
- **Verification-required directives** -- Rules that need runtime checks (e.g., STOP-GATE). The host SHOULD verify compliance, but the standard works (degraded) without verification.
- **Enforcement-required directives** -- Rules that MUST be enforced by the host runtime (e.g., "block commits without an issue number"). Useless without runtime support.

MARR should tag directives with their enforcement tier in the frontmatter or in the standard body. This lets hosts know which directives they can fully support and which will degrade.

### Standards Theorist

The right boundary follows the Interface Segregation Principle: MARR should present narrow, well-defined interfaces rather than one broad one.

Looking at the boundaries across the full lifecycle:

| Phase | MARR Responsibility | Host Responsibility | Interface |
|---|---|---|---|
| **Authoring** | Schema, validation, scaffolding | N/A | `StandardFrontmatterSchema` |
| **Distribution** | Publishing, versioning, sync | Discovery, installation | Standards registry + files |
| **Activation** | Trigger definition, semantics, test cases | Trigger evaluation, context injection | Evaluation contract |
| **Enforcement** | Directive content, enforcement tier tags | Runtime checks, blocking, verification | Directive type tags |
| **Observability** | Define what compliance looks like | Report compliance, detect violations | Compliance report format |

The missing piece is **observability**. MARR defines rules. Hosts enforce them. But who checks whether enforcement is working? Today, nobody. MARR should define a compliance report format -- a structured output that a host can produce after a session, listing which standards were activated, which directives were followed, and which were violated.

This creates a feedback loop: MARR can use compliance reports from real sessions to refine trigger semantics and directive tagging. Hosts can use compliance reports to improve their enforcement. Users can use compliance reports to see whether their agent is actually following the standards they installed.

**Position:** The boundary should follow the lifecycle phases above. The most impactful addition is the observability layer: MARR defines what compliance means and what a compliance report looks like. Hosts produce the reports. This closes the loop and makes the entire system measurable.

---

## Synthesis: Agreement and Disagreement

### Where All Four Agree

1. **MARR should NOT ship host-specific adapters.** Every council member rejects the adapter model. The coupling is too expensive.

2. **MARR's standard file format IS the primary interface.** Markdown files with YAML frontmatter are already universally consumable. This does not need to change.

3. **A machine-readable standards manifest is needed.** Everyone agrees MARR needs a `standards.json` (or equivalent) index of published standards with metadata.

4. **Trigger semantics need formalization.** Raw natural-language triggers are insufficient for deterministic hosts. Some form of structured hint, test case, or baseline matching spec is needed.

5. **Host systems should build their own integration code.** PAI should build the PAI Pack. OpenClaw should build the ClawHub package. MARR provides the raw materials.

### Where They Disagree

| Question | Disagreement | Poles |
|---|---|---|
| **Reference evaluator** | Should MARR ship an evaluator? | Maintainer says NO (just docs). PAI Architect and OpenClaw Contributor say YES (as a library). Theorist says YES (as a reference implementation with conformance tests). |
| **Structured trigger hints** | Should triggers have machine-readable metadata beyond the text? | PAI Architect says YES (tool_hints, keyword_hints). Maintainer says RESIST (complexity). OpenClaw Contributor says DEFER (let the evaluator handle it). Theorist says YES (via conformance levels). |
| **Enforcement tier tagging** | Should MARR tag directives by enforcement requirements? | OpenClaw Contributor says YES (critical for hosts with limited capabilities). Maintainer says MAYBE (risks over-engineering). PAI Architect says USEFUL but SECONDARY. Theorist says YES (part of the directive format). |
| **Compliance reporting** | Should MARR define a compliance report format? | Theorist says YES (closes the feedback loop). Maintainer says OUT OF SCOPE (MARR is configuration, not observability). PAI Architect says INTERESTING (ISC already does this differently). OpenClaw Contributor says PREMATURE (build it when we have data). |

---

## Final Recommendations

Based on the Council debate, here are the recommended MARR refinements in priority order:

### 1. Ship a Standards Manifest (consensus)

**What:** Add a generated `standards.json` to each MARR release that indexes all bundled standards with their frontmatter metadata (id, title, version, scope, triggers, filename, content hash).

**Why:** Every council member identified this gap. PAI, OpenClaw, and unknown future hosts all need machine-readable standard discovery. This is the lowest-effort, highest-value change.

**Implementation:** Add a build step that reads `resources/project/common/*.md`, extracts frontmatter, and writes `dist/standards.json`. Publish alongside the npm package. Also publish to a stable GitHub release asset URL.

### 2. Define Trigger Evaluation Contract (consensus with graduated detail)

**What:** Formalize what trigger evaluation means: input format (task context), output format (matched standards with confidence), and minimum matching behavior.

**Why:** MARR's triggers are natural language today. This works when the LLM evaluates them, but fails for deterministic hosts. The contract bridges the gap without MARR shipping an evaluator.

**Implementation:**
- Document the evaluation contract in MARR's docs (normative spec).
- Publish a set of test cases: "given this task description, these standards should match" (JSON fixture file).
- Optionally add `keyword_hints` to the frontmatter schema as an OPTIONAL field. Do not require it. Existing standards work without it. New standards can include it for deterministic evaluators.

### 3. Ship a Reference Evaluator (majority support, optional consumption)

**What:** A single pure function (`evaluateTriggers`) exported from `@virtualian/marr/evaluate` that takes a task description and an array of standard metadata, and returns matched standards.

**Why:** Three of four council members support this. It eliminates duplicated effort across hosts. Being a pure function with zero side effects means it does not make MARR a runtime dependency -- hosts can vendor it, fork it, or ignore it.

**Implementation:** Keyword-based matching as baseline. Match trigger keyword_hints (or extracted keywords from trigger text) against task description words. Return standards ranked by match score above a configurable threshold.

### 4. Add Stable Standard Identifiers (medium priority)

**What:** Give each standard a stable, version-independent identifier: `marr:version-control`, `marr:testing`, etc. Include in frontmatter as `id` field.

**Why:** Enables host systems to reference standards by identity rather than filename. Filenames can change across MARR versions; identifiers should not.

**Implementation:** Add optional `id` field to `StandardFrontmatterSchema`. Populate in all bundled standards. Include in `standards.json` manifest.

### 5. Define Conformance Levels (lower priority, higher maturity)

**What:** Formalize three integration levels (File Consumer, Trigger Evaluator, Full Integration) with conformance test suites.

**Why:** Helps host systems understand what they are committing to. Prevents partial integrations from being marketed as "MARR-compatible."

**Implementation:** Defer until at least two hosts (PAI and OpenClaw) have integrations. Derive conformance levels from real-world integration experience rather than speculating.

### 6. Investigate Enforcement Tier Tags (future consideration)

**What:** Tag standard directives as context-only, verification-required, or enforcement-required.

**Why:** Helps hosts understand which directives they can actually enforce. Prevents degraded compliance from going unnoticed.

**Implementation:** Do not add to v3.x. Gather data from PAI and OpenClaw integrations about which directives fail in practice. Add tier tags in v4 informed by real usage patterns.

### Deferred

- **Compliance reporting format** -- Too early. Build after integrations exist and compliance becomes measurable.
- **ClawHub distribution** -- OpenClaw team's responsibility, not MARR's. MARR provides the standards manifest; OpenClaw builds the ClawHub package.
- **PAI Pack** -- PAI team's responsibility. MARR provides the standards manifest and reference evaluator; PAI builds the Pack.
- **Adapter code** -- Permanently rejected. Adapters create coupling MARR should never have.

---

## Implementation Roadmap

| Phase | Deliverable | MARR Version |
|---|---|---|
| **Phase 1** | `standards.json` manifest + stable identifiers + documented GitHub raw URLs | v3.6 |
| **Phase 2** | Trigger evaluation contract (spec + test fixtures) + optional `keyword_hints` in schema | v3.7 |
| **Phase 3** | Reference evaluator (`@virtualian/marr/evaluate`) | v3.8 |
| **Phase 4** | Conformance levels + test suites (after real integrations exist) | v4.0 |

**Guiding principle throughout:** MARR refines its own architecture to be a better export surface. It does not build import pipelines into host systems. The boundary stays at the file system and the manifest. Hosts integrate on their own terms.
