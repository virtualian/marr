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
    - intent: code_review
    - file_patterns: ["*.py", "*.ts"]
    - keywords: ["review", "check this"]
    - always: true
  ---
  
  Markdown body with instructions...
  ```

  ## Frontmatter Schema

  - `marr`: literal `"standard"` (discriminator to ignore other frontmatter formats)
  - `version`: integer, currently `1`
  - `title`: string, required
  - `scope`: string, required  
  - `triggers`: array of trigger objects, at least one required

  ## Triggers

  The `triggers` array contains one or more trigger objects. Each object represents a distinct condition. Any matching trigger activates the standard (OR logic).

  | Trigger Type    | Value    | Description                        |
  | --------------- | -------- | ---------------------------------- |
  | `always`        | `true`   | Always load this standard          |
  | `intent`        | string   | Match against inferred user intent |
  | `file_patterns` | string[] | Match against files in context     |
  | `keywords`      | string[] | Match against user message         |

  Each trigger object must contain exactly one of these types.

  Example with multiple triggers:
  ```yaml
  triggers:
    - intent: code_review
    - intent: refactoring
    - file_patterns: ["*.py", "*.ts"]
    - keywords: ["review", "check this code"]
  ```

  This standard activates if intent is `code_review` OR intent is `refactoring` OR any matching file pattern OR any matching keyword.

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