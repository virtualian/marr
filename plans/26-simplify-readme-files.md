# Plan: Simplify README Files

> **Issue:** #26 - Simplify README files by removing implementation-specific details
>
> **Objective:** Remove hardcoded filenames from README files so documentation remains accurate even when files are renamed, added, or removed.
>
> **Expected Outcome:** READMEs describe concepts and patterns (e.g., `prj-*.md`) rather than listing specific filenames, reducing maintenance burden.

---

## Overview

README files currently list specific filenames that become stale when the codebase changes. This plan updates affected READMEs to focus on patterns and concepts rather than implementation details.

**Files requiring changes:**
1. `resources/project/README.md` - Lists 5 specific standard files
2. `resources/project/common/README.md` - Lists same 5 files in a table
3. `resources/user/README.md` - Lists 4 specific standard files
4. `README.md` (root) - Multiple sections list specific standard files

**Files NOT requiring changes:**
- `resources/helper-scripts/README.md` - Lists script names that ARE the public interface (users invoke these by name)

---

## STEP01: Update resources/project/README.md

- [ ] Remove explicit file listing from the structure tree, replace with pattern description
- [ ] Update the table to describe standard categories rather than specific files
- [ ] Keep the `prj-` naming convention explanation (this is a pattern, not an implementation detail)
- [ ] Verify the "How They Work" section still makes sense without specific filenames
- [ ] Validate changes don't break any existing references

**Draft commit message:**
```
Simplify resources/project/README.md to use patterns instead of filenames

Replace explicit file listings with pattern-based descriptions (prj-*.md)
so documentation stays accurate when standards are added or renamed.

Commit for /26-simplify-readme-files/STEP01
```

---

## STEP02: Update resources/project/common/README.md

- [ ] Remove the file-specific table listing individual standard files
- [ ] Replace with description of what the directory contains using patterns
- [ ] Keep the naming convention and customization sections
- [ ] Verify the README still serves its purpose (explaining the standards directory)
- [ ] Validate changes are consistent with STEP01 approach

**Draft commit message:**
```
Simplify resources/project/common/README.md to use patterns

Replace file-listing table with pattern-based description so docs
remain accurate as standards evolve.

Commit for /26-simplify-readme-files/STEP02
```

---

## STEP03: Update resources/user/README.md

- [ ] Remove explicit standard file references under "What Doesn't Go at User Level"
- [ ] Replace with pattern-based explanation (standards use `prj-` prefix in project's .claude/marr/standards/)
- [ ] Keep the conceptual explanation of user vs project level
- [ ] Validate changes are consistent with prior steps

**Draft commit message:**
```
Simplify resources/user/README.md to use patterns

Replace explicit file paths with pattern-based descriptions to prevent
staleness when project-level standards change.

Commit for /26-simplify-readme-files/STEP03
```

---

## STEP04: Update root README.md

- [ ] Review "What `--project` creates:" section - [ASSUMPTION: keep structure tree but simplify standards listing]
- [ ] Update "Standard Prompt Files" section to use patterns rather than file list
- [ ] Review "What it checks" in validate section for hardcoded file references
- [ ] Keep command examples and usage documentation unchanged (these are user-facing interfaces)
- [ ] Validate the README still serves its primary purpose (package documentation)

**Draft commit message:**
```
Simplify root README.md to reduce hardcoded filenames

Update standard file references to use patterns where appropriate while
preserving clear usage documentation for the CLI.

Commit for /26-simplify-readme-files/STEP04
```

---

## STEP05: Final Validation and Documentation

- [ ] Run `marr validate` to ensure no references are broken
- [ ] Review all changed files for consistency in approach
- [ ] Verify issue #26 acceptance criteria are met:
  - [ ] READMEs describe what/why, not specific filenames
  - [ ] Implementation details live in code, not docs
  - [ ] Docs remain accurate even after file changes
- [ ] Update any related documentation if needed

**Draft commit message:**
```
Complete issue #26: Validate simplified README files

All READMEs now use pattern-based references instead of hardcoded filenames.
Documentation will remain accurate as standards evolve.

Closes #26

Commit for /26-simplify-readme-files/STEP05
```

---

## Approach Notes

**Pattern vs. Filename:**
- ✅ Use: "Standards follow the `prj-*.md` naming pattern"
- ❌ Avoid: "prj-git-workflow-standard.md, prj-testing-standard.md, ..."

**Conceptual vs. Implementation:**
- ✅ Use: "Git workflow, testing, MCP usage, and documentation standards"
- ❌ Avoid: Listing exact filenames for each

**Keep specific when appropriate:**
- Helper script names (user invokes these by name)
- Configuration file paths (CLAUDE.md, MARR-PROJECT-CLAUDE.md are fixed)
- CLI command syntax (the public interface)
