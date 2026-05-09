# Audit — Downstream MARR Layers vs Canonical (Issue #107)

> Branch: `107-audit-downstream-marr-layers`
> Date: 2026-05-09
> Scope: `~/.claude/marr/` (user layer) and `~/projects/*/.claude/marr/` (consumer projects), compared against canonical `resources/`

## Summary

| Layer | Files | Identical | Divergent | Only-Downstream | Only-Canonical |
|---|---|---|---|---|---|
| `~/.claude/marr/` | 2 | 1 | 0 | 1 (`projects.json`, install state — N/A) | 1 (`README.md` not installed) |
| `ask-viki` | 8 | 5 | 3 | 0 | 4 standards |
| `learn-offline-first-apps` | 8 | 4 | 4 | 0 | 5 standards |
| `npm-scanner` | 6 | 2 | 4 | 1 (`prj-workflow-standard.md` — old name) | 7 standards |
| `pai` | 7 | 4 | 3 | 0 | 5 standards |
| `scoremyclays` | 11 | 9 | 2 | 0 | 0 |

**Most up-to-date consumer:** `scoremyclays` (only 2 minor divergences, both stale-canonical).
**Most stale consumer:** `npm-scanner` (renamed file, old naming convention, missing 7 of 9 standards).

## Backport Candidates (downstream → canonical)

| # | Source | File | Change | Action | Cross-ref |
|---|---|---|---|---|---|
| B1 | `learn-offline-first-apps` | `prj-documentation-standard.md` | Adds **Release Documentation** section (RELEASE_NOTES.md, KNOWN_ISSUES.md, README pre-release checklist) + new Core Rule 6 + new anti-pattern | **Import** — generalizable, addresses #89 | Partial overlap with #89; distinct from #105 |
| B2 | `learn-offline-first-apps` | `prj-documentation-standard.md` | Adds **Diagrams** section mandating Mermaid for all diagrams | **Skip — fold into #105** (confirmed: content originated in marrbox-platform; the marrbox import will deliver the Mermaid mandate) | Resolved as #105 |
| B3 | `pai` | `prj-development-workflow-standard.md` | Adds **Issue Work Sequence** section (read-issue-body → branch → enter Algorithm, in that order) | **Adapt** — useful, but generalize the `gh issue view ... --repo virtualian/pai` example to be project-agnostic | None |
| B4 | `scoremyclays` | `prj-plan-execution-standard.md` | Removes one stale `research/phase1-execution-gaps-analysis.md` reference | **Import** — trivial cleanup | None |

## Drift (canonical → downstream — out of scope for #107, but flag for `marr update`)

| # | Affected | File | Drift |
|---|---|---|---|
| D1 | ask-viki, learn-offline-first-apps, pai | `prj-development-workflow-standard.md` | Pre-#93 — missing STOP-GATE Branch Verification section |
| D2 | ask-viki, learn-offline-first-apps, pai | `prj-version-control-standard.md` | Pre-#90 — older release/tagging guidance (no `npm version`) |
| D3 | ask-viki, learn-offline-first-apps, pai, npm-scanner | `MARR-PROJECT-CLAUDE.md` | Pre-#88 hotfix — outdated standards references |
| D4 | All except scoremyclays | `README.md` | 10-byte newer canonical version (1046 vs 1056) |
| D5 | npm-scanner | `prj-workflow-standard.md` | Old filename — superseded by `prj-development-workflow-standard.md` rename |
| D6 | npm-scanner | `prj-writing-prompts-standard.md` | Stale example references the old `prj-workflow-standard.md` filename |

## Reject / N/A

| # | Item | Reason |
|---|---|---|
| R1 | `~/.claude/marr/projects.json` | Install state, not a standard |
| R2 | `pai/.claude/marr/.DS_Store` | macOS metadata; unrelated |
| R3 | npm-scanner's older filenames | Old snapshot, not new content |

## Already-Tracked (open issues)

| Issue | Title | Relation to findings |
|---|---|---|
| #105 | Import release documentation standards from marrbox-platform | Distinct from B1 (different content). May share Mermaid mandate with B2 — verify provenance. |
| #91 | Add PR timing guidance to version control standard | No overlap with findings — independent work |
| #89 | Workflow/Versioning standards lack CHANGELOG / GH Release / Release Notes | **B1 directly addresses this** — recommend folding B1 into #89 instead of new issue |
| #92 | Checklist: Introducing New Technologies and Services | No overlap |
| #106 | marr init writes incorrect import path | Bug, unrelated |

## Recommended Next Actions

1. **B1 + #89** — Open PR against `prj-documentation-standard.md` (and possibly `prj-version-control-standard.md`) adding the Release Documentation section. Closes/folds into #89.
2. **B2** — Resolved: Mermaid section came from marrbox-platform; folded into #105. No separate work.
3. **B3** — Open new "Propose:" issue for the Issue Work Sequence section, then PR after triage. Generalize the gh-cli example.
4. **B4** — Bundle into the next minor release; trivial.
5. **Drift (D1–D6)** — Out of scope for this issue. Track separately as "downstream re-install needed" — possibly a `marr update --project` enhancement.
6. **npm release** — Triggered after B1, B2, B3, B4 land on main. Patch or minor depending on whether new sections count as features.

## Open Choices

- ~~**OC1:** Doc location~~ — **Resolved:** keep in `Plans/`.
- ~~**OC2:** B2 Mermaid provenance~~ — **Resolved:** from marrbox-platform; folded into #105.
- **OC3:** B3 (Issue Work Sequence) — bundle with B1 in same PR, or separate proposal issue + PR? (Open)
- **OC4:** Drift D1–D6 — out of scope for #107 entirely, or open a sister "downstream-update" tracking issue now? (Open)

## Appendix: Hash Matrix

Canonical hashes (from `resources/`):
- `project/MARR-PROJECT-CLAUDE.md` = `6a6f57f8…`
- `project/README.md` = `f8beebb4…`
- `project/common/prj-development-workflow-standard.md` = `7120bf6e…`
- `project/common/prj-documentation-standard.md` = `fb53453e…`
- `project/common/prj-mcp-usage-standard.md` = `2e82d3a8…`
- `project/common/prj-plan-execution-standard.md` = `314b685c…`
- `project/common/prj-testing-standard.md` = `f6e04669…`
- `project/common/prj-ui-ux-standard.md` = `a2322efc…`
- `project/common/prj-user-config-standard.md` = `cb15ace7…`
- `project/common/prj-version-control-standard.md` = `e58a489e…`
- `project/common/prj-writing-prompts-standard.md` = `c6586f68…`
- `user/MARR-USER-CLAUDE.md` = `8a5b6dc9…`
- `user/README.md` = `0e3ef0ac…`

Per-consumer divergences (full hashes available via `shasum -a 256` on each path).
