# Release Notes

All notable user-visible changes to MARR are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/) conventions, grouping entries as Added / Changed / Fixed / Removed / Security per the project's version-control standard.

This file is the canonical, in-repo history. Each section is mirrored in a corresponding [GitHub Release](https://github.com/virtualian/marr/releases).

## Unreleased

### Added
- Mandate release notes and GitHub Release for every tagged release ([#112](https://github.com/virtualian/marr/pull/112), closes [#89](https://github.com/virtualian/marr/issues/89))

### Security
- Override `brace-expansion` to fix transitive ReDoS ([#110](https://github.com/virtualian/marr/pull/110))
- Bump `yaml` from 2.8.1 to 2.8.3 ([#104](https://github.com/virtualian/marr/pull/104))
- Bump `picomatch` from 4.0.3 to 4.0.4 ([#103](https://github.com/virtualian/marr/pull/103))
- Bump `flatted` from 3.3.3 to 3.4.2 ([#102](https://github.com/virtualian/marr/pull/102))
- Bump `minimatch` from 3.1.2 to 3.1.5 ([#101](https://github.com/virtualian/marr/pull/101))

---

## [v3.5.0] — 2026-01-10

### Added
- User config standard ([#97](https://github.com/virtualian/marr/pull/97), tracks [#23](https://github.com/virtualian/marr/issues/23))
- Plan execution standard ([#98](https://github.com/virtualian/marr/pull/98), tracks [#95](https://github.com/virtualian/marr/issues/95))
- STOP-GATE pattern for branch verification in the workflow standard ([#99](https://github.com/virtualian/marr/pull/99), tracks [#93](https://github.com/virtualian/marr/issues/93))

### Changed
- Adopt `npm version` for the release workflow ([#100](https://github.com/virtualian/marr/pull/100), tracks [#90](https://github.com/virtualian/marr/issues/90))
- Improve `marr validate` error messages with better context ([#32](https://github.com/virtualian/marr/pull/32))

---

## [v3.1.0] — 2025-12-13

**BREAKING:** the workflow standard was split into two separate standards. Projects referencing the old combined name MUST update to the new split filenames.

### Changed
- **BREAKING:** Split workflow standard into `prj-development-workflow-standard.md` and `prj-version-control-standard.md` ([#87](https://github.com/virtualian/marr/pull/87))

---

## [v3.0.0] — 2025-12-08

**BREAKING:** helper scripts were removed in favor of GitHub CLI extensions. Workflows depending on the bundled helpers MUST migrate to `gh` extensions.

### Added
- `marr sync` command to propagate standards between projects ([#61](https://github.com/virtualian/marr/pull/61))
- Diátaxis framework guidance in the documentation standard ([#62](https://github.com/virtualian/marr/pull/62), tracks [#52](https://github.com/virtualian/marr/issues/52))
- Comprehensive Jekyll-compatible documentation site ([#66](https://github.com/virtualian/marr/pull/66), [#68](https://github.com/virtualian/marr/pull/68))
- Docs link in `MARR-PROJECT-CLAUDE.md` template ([#76](https://github.com/virtualian/marr/pull/76))

### Changed
- Workflow standard strengthened to prevent main-branch changes ([#60](https://github.com/virtualian/marr/pull/60))
- Documentation standard refactored for coherence and self-compliance ([#64](https://github.com/virtualian/marr/pull/64))
- Public-release readiness pass ([#72](https://github.com/virtualian/marr/pull/72))

### Fixed
- README reflects the actual standards directory structure ([#59](https://github.com/virtualian/marr/pull/59))

### Removed
- **BREAKING:** Helper scripts in favor of `gh` extensions ([#70](https://github.com/virtualian/marr/pull/70))

---

## [v2.2.0] — 2025-12-06

### Added
- `marr standard sync` command ([#54](https://github.com/virtualian/marr/pull/54))
- Conflict detection and `marr doctor` command ([#56](https://github.com/virtualian/marr/pull/56))
- Structured frontmatter and CLI commands for standards ([#51](https://github.com/virtualian/marr/pull/51))

### Changed
- Updated MARR templates with improved configuration patterns ([#48](https://github.com/virtualian/marr/pull/48))

---

## [v2.1.0] — 2025-12-02

### Added
- New project standards available via `marr init` ([#46](https://github.com/virtualian/marr/pull/46))

### Changed
- Restructured MARR directory layout with `standards/` subfolder ([#33](https://github.com/virtualian/marr/pull/33))
- Project-level CLAUDE.md template refinements ([#34](https://github.com/virtualian/marr/pull/34))
- `MARR-USER-CLAUDE.md` moved to a template file for cleaner installs ([#40](https://github.com/virtualian/marr/pull/40))

### Fixed
- CLI issues across the developer experience surface ([#25](https://github.com/virtualian/marr/pull/25), bundles [#18](https://github.com/virtualian/marr/issues/18)–[#22](https://github.com/virtualian/marr/issues/22))

---

## [v2.0.0] — 2025-11-28

First public npm release as `@virtualian/marr`.

### Added
- npm package distribution ([#1](https://github.com/virtualian/marr/pull/1))
- `marr init --user` and `marr init --project` CLI surface ([#17](https://github.com/virtualian/marr/pull/17))
- Two-layer configuration: `~/.claude/marr/` user-level + `./.claude/marr/` project-level ([#16](https://github.com/virtualian/marr/pull/16))
- Project standards system (workflow, documentation, version control, MCP, testing) ([#7](https://github.com/virtualian/marr/pull/7))
- Role-first documentation organisation ([#5](https://github.com/virtualian/marr/pull/5))

### Changed
- Project rebranded from `repo-setup` to `marr` ([#9](https://github.com/virtualian/marr/pull/9))

[v3.5.0]: https://github.com/virtualian/marr/releases/tag/v3.5.0
[v3.1.0]: https://github.com/virtualian/marr/releases/tag/v3.1.0
[v3.0.0]: https://github.com/virtualian/marr/releases/tag/v3.0.0
[v2.2.0]: https://github.com/virtualian/marr/releases/tag/v2.2.0
[v2.1.0]: https://github.com/virtualian/marr/releases/tag/v2.1.0
[v2.0.0]: https://github.com/virtualian/marr/releases/tag/v2.0.0
