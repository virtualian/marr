import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  classifyClaudeMdPath,
  getMarrProjectImportLine,
  getAllMarrProjectImportLines,
  MARR_PROJECT_IMPORT_COMMENT,
} from './marr-import.js';

describe('classifyClaudeMdPath', () => {
  it('classifies root CLAUDE.md as root', () => {
    assert.strictEqual(classifyClaudeMdPath('/x/CLAUDE.md'), 'root');
    assert.strictEqual(classifyClaudeMdPath('/Users/me/projects/foo/CLAUDE.md'), 'root');
  });

  it('classifies .claude/CLAUDE.md as dotclaude', () => {
    assert.strictEqual(classifyClaudeMdPath('/x/.claude/CLAUDE.md'), 'dotclaude');
    assert.strictEqual(
      classifyClaudeMdPath('/Users/me/projects/foo/.claude/CLAUDE.md'),
      'dotclaude'
    );
  });

  it('classifies bare CLAUDE.md (no parent dir) as root', () => {
    assert.strictEqual(classifyClaudeMdPath('CLAUDE.md'), 'root');
  });

  it('does not misclassify deeper paths whose parent is not .claude', () => {
    assert.strictEqual(classifyClaudeMdPath('/x/.claude/sub/CLAUDE.md'), 'root');
  });
});

describe('getMarrProjectImportLine', () => {
  it('returns root form for root location', () => {
    assert.strictEqual(
      getMarrProjectImportLine('root'),
      '@.claude/marr/MARR-PROJECT-CLAUDE.md'
    );
  });

  it('returns sibling-relative form for dotclaude location', () => {
    assert.strictEqual(
      getMarrProjectImportLine('dotclaude'),
      '@marr/MARR-PROJECT-CLAUDE.md'
    );
  });
});

describe('getAllMarrProjectImportLines', () => {
  it('contains both forms', () => {
    const lines = getAllMarrProjectImportLines();
    assert.ok(lines.includes('@.claude/marr/MARR-PROJECT-CLAUDE.md'));
    assert.ok(lines.includes('@marr/MARR-PROJECT-CLAUDE.md'));
  });
});

describe('MARR_PROJECT_IMPORT_COMMENT', () => {
  it('is the canonical MARR comment marker', () => {
    assert.strictEqual(
      MARR_PROJECT_IMPORT_COMMENT,
      '<!-- MARR: Making Agents Really Reliable -->'
    );
  });
});
