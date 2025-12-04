- # MARR Standards Format - Implementation Spec

  ## Summary

  Standards are Markdown files with YAML frontmatter. The frontmatter contains metadata and trigger conditions; the body contains the prompt/instructions.

  ## File Format
  ```markdown
  ---
  marr: standard
  version: 1
  title: Example Standard
  scope: When this applies

  triggers:
    - WHEN creating or modifying documentation
    - WHEN working with README files or guides
    - WHEN deciding where documentation should live
  ---

  Markdown body with instructions...
  ```

  ## Frontmatter Schema

  - `marr`: literal `"standard"` (discriminator to ignore other frontmatter formats)
  - `version`: integer, currently `1`
  - `title`: string, required
  - `scope`: string, required
  - `triggers`: array of strings, at least one required

  ## Triggers

  Triggers are **natural language descriptions** of situations where the standard applies. They should be:

  - **Semantic**: Describe the situation, not specific files or keywords
  - **Broad**: It's better to trigger a standard than miss it
  - **Overlapping allowed**: Multiple standards can be triggered for the same task

  Every trigger MUST begin with "WHEN" to make it imperative.

  Example triggers:
  ```yaml
  triggers:
    - WHEN running, writing, or modifying tests
    - WHEN evaluating test coverage or testing strategy
    - WHEN making code changes that should have test coverage
  ```

  The AI agent MUST read the standard when any trigger condition is met (OR logic).

  ## CLI Commands
  ```bash
  marr standard create <name>       # scaffold with valid frontmatter
  marr standard validate [path]     # validate one file
  marr standard validate --all      # validate all standards
  marr standard list                # list standards with triggers
  ```

  ## Implementation

  1. Zod schema at `src/schema/standard.ts` — single source of truth
  2. Parse with `gray-matter` npm package
  3. Skip files where `marr !== 'standard'`
  4. Validate frontmatter with Zod, fail with file path and field errors
  5. CLI exits non-zero on validation failure for CI

  ## Key Decisions

  - Markdown + YAML frontmatter (not pure YAML/JSON/TOML)
  - `marr: standard` discriminator avoids conflicts with Cursor rules etc.
  - `version` field for future schema migration
  - Subcommand pattern: `marr standard <verb>` not `marr standard --verb`