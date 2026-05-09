/**
 * MARR project import line helpers.
 *
 * Claude Code resolves @path imports relative to the file containing them.
 * The MARR project import line therefore depends on which CLAUDE.md location
 * the project uses:
 *
 *   ./CLAUDE.md          → @.claude/marr/MARR-PROJECT-CLAUDE.md
 *   ./.claude/CLAUDE.md  → @marr/MARR-PROJECT-CLAUDE.md
 */

import { basename, dirname } from 'path';

/** Comment marker that precedes the MARR import line in CLAUDE.md */
export const MARR_PROJECT_IMPORT_COMMENT = '<!-- MARR: Making Agents Really Reliable -->';

/** Which CLAUDE.md location a project uses */
export type ProjectClaudeMdLocation = 'root' | 'dotclaude';

/**
 * Classify a CLAUDE.md path by its location relative to the project.
 *
 * `dotclaude` means the file lives at `<project>/.claude/CLAUDE.md`.
 * `root` covers everything else — i.e. `<project>/CLAUDE.md`.
 */
export function classifyClaudeMdPath(claudeMdPath: string): ProjectClaudeMdLocation {
  return basename(dirname(claudeMdPath)) === '.claude' ? 'dotclaude' : 'root';
}

/**
 * Return the MARR project import line for the given CLAUDE.md location.
 */
export function getMarrProjectImportLine(location: ProjectClaudeMdLocation): string {
  return location === 'dotclaude'
    ? '@marr/MARR-PROJECT-CLAUDE.md'
    : '@.claude/marr/MARR-PROJECT-CLAUDE.md';
}

const ALL_LOCATIONS: readonly ProjectClaudeMdLocation[] = ['root', 'dotclaude'];

const ALL_IMPORT_LINES: readonly string[] = Object.freeze(
  ALL_LOCATIONS.map(getMarrProjectImportLine)
);

/**
 * Return all MARR project import line forms.
 *
 * Used by clean / conflict-detection to recognise an import irrespective of
 * which CLAUDE.md location wrote it — including legacy installs that wrote
 * the wrong form into `.claude/CLAUDE.md` before this bug was fixed (#106).
 */
export function getAllMarrProjectImportLines(): readonly string[] {
  return ALL_IMPORT_LINES;
}
