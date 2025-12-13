/**
 * Tests for MARR standards reader
 *
 * Tests directive extraction from markdown content and standard parsing.
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { parseStandard, readStandardsFromDir, readInstalledStandards } from './standards-reader.js';

/** Create a temporary directory for test fixtures */
function createTempDir(): string {
  const dir = join(tmpdir(), `marr-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

/** Clean up temporary directory */
function cleanupTempDir(dir: string): void {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Create a test standard file */
function createStandardFile(dir: string, filename: string, content: string): string {
  const path = join(dir, filename);
  writeFileSync(path, content);
  return path;
}

describe('parseStandard', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('parses a valid standard with Core Rules', () => {
    const content = `---
marr: standard
version: 1
title: Testing Standard
scope: All testing activities
triggers:
  - WHEN writing or running tests
---

# Testing Standard

## Core Rules

1. **Always run tests** before committing changes
2. **Write tests first** when fixing bugs
3. **Use descriptive names** for test cases
`;

    const path = createStandardFile(tempDir, 'prj-testing-standard.md', content);
    const result = parseStandard(path);

    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.standard.frontmatter.title, 'Testing Standard');
      assert.strictEqual(result.standard.directives.length, 3);
      assert.strictEqual(result.standard.directives[0].type, 'rule');
      assert.ok(result.standard.directives[0].text.includes('Always run tests'));
    }
  });

  it('parses a valid standard with Anti-Patterns', () => {
    const content = `---
marr: standard
version: 1
title: Workflow Standard
scope: All workflow activities
triggers:
  - WHEN working with git
---

# Workflow Standard

## Anti-Patterns

- **Skipping tests** — Never skip tests to save time
- **Force pushing** — Avoid force pushing to shared branches
- **Large commits** — Break large changes into smaller commits
`;

    const path = createStandardFile(tempDir, 'prj-version-control-standard.md', content);
    const result = parseStandard(path);

    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.standard.directives.length, 3);
      assert.strictEqual(result.standard.directives[0].type, 'anti-pattern');
      assert.ok(result.standard.directives[0].text.includes('Skipping tests'));
    }
  });

  it('extracts keywords from directives', () => {
    const content = `---
marr: standard
version: 1
title: Testing Standard
scope: All testing activities
triggers:
  - WHEN writing tests
---

# Testing Standard

## Core Rules

1. **Always run tests** before committing changes
`;

    const path = createStandardFile(tempDir, 'prj-testing-standard.md', content);
    const result = parseStandard(path);

    assert.strictEqual(result.success, true);
    if (result.success) {
      const directive = result.standard.directives[0];
      assert.ok(directive.keywords.includes('always'));
      assert.ok(directive.keywords.includes('run'));
      assert.ok(directive.keywords.includes('tests'));
      assert.ok(directive.keywords.includes('committing'));
      // Stop words should be filtered out
      assert.ok(!directive.keywords.includes('before'));
    }
  });

  it('handles mixed sections (rules and anti-patterns)', () => {
    const content = `---
marr: standard
version: 1
title: Documentation Standard
scope: All documentation activities
triggers:
  - WHEN writing documentation
---

# Documentation Standard

## Core Rules

1. **Keep docs current** when code changes
2. **Use clear language** in all documentation

## Anti-Patterns

- **Stale documentation** — Never leave outdated docs
- **Missing examples** — Always include code examples
`;

    const path = createStandardFile(tempDir, 'prj-docs-standard.md', content);
    const result = parseStandard(path);

    assert.strictEqual(result.success, true);
    if (result.success) {
      const rules = result.standard.directives.filter(d => d.type === 'rule');
      const antiPatterns = result.standard.directives.filter(d => d.type === 'anti-pattern');

      assert.strictEqual(rules.length, 2);
      assert.strictEqual(antiPatterns.length, 2);
    }
  });

  it('rejects files without marr: standard', () => {
    const content = `---
title: Not a Standard
---

# Some Document

Just some text.
`;

    const path = createStandardFile(tempDir, 'not-a-standard.md', content);
    const result = parseStandard(path);

    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.includes('Not a MARR standard'));
    }
  });

  it('rejects files with invalid frontmatter', () => {
    const content = `---
marr: standard
version: 1
title: Missing Triggers
scope: Some scope
---

# Missing Triggers

No triggers defined.
`;

    const path = createStandardFile(tempDir, 'invalid-standard.md', content);
    const result = parseStandard(path);

    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.includes('Invalid frontmatter'));
    }
  });

  it('returns error for non-existent files', () => {
    const result = parseStandard('/nonexistent/path/standard.md');

    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.includes('File not found'));
    }
  });

  it('handles empty Core Rules section', () => {
    const content = `---
marr: standard
version: 1
title: Empty Standard
scope: Testing empty sections
triggers:
  - WHEN testing
---

# Empty Standard

## Core Rules

## Other Section

Some content here.
`;

    const path = createStandardFile(tempDir, 'empty-rules.md', content);
    const result = parseStandard(path);

    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.standard.directives.length, 0);
    }
  });

  it('handles simple bullet rules without bold formatting', () => {
    const content = `---
marr: standard
version: 1
title: Simple Rules Standard
scope: Testing simple bullets
triggers:
  - WHEN testing simple formats
---

# Simple Rules

## Core Rules

- Run all tests before pushing code
- Check for linting errors before commit
- Review your own changes first
`;

    const path = createStandardFile(tempDir, 'simple-rules.md', content);
    const result = parseStandard(path);

    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.standard.directives.length, 3);
      assert.ok(result.standard.directives[0].text.includes('Run all tests'));
    }
  });
});

describe('readStandardsFromDir', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('reads all valid standards from directory', () => {
    const standard1 = `---
marr: standard
version: 1
title: Testing Standard
scope: Testing
triggers:
  - WHEN testing
---

## Core Rules

1. **Run tests** always
`;

    const standard2 = `---
marr: standard
version: 1
title: Workflow Standard
scope: Workflow
triggers:
  - WHEN working with git
---

## Core Rules

1. **Use branches** for features
`;

    createStandardFile(tempDir, 'prj-testing-standard.md', standard1);
    createStandardFile(tempDir, 'prj-version-control-standard.md', standard2);

    const standards = readStandardsFromDir(tempDir);

    assert.strictEqual(standards.length, 2);
  });

  it('skips README.md files', () => {
    const standard = `---
marr: standard
version: 1
title: Testing Standard
scope: Testing
triggers:
  - WHEN testing
---

## Core Rules

1. **Run tests** always
`;

    createStandardFile(tempDir, 'prj-testing-standard.md', standard);
    createStandardFile(tempDir, 'README.md', '# Standards\n\nDocumentation here.');

    const standards = readStandardsFromDir(tempDir);

    assert.strictEqual(standards.length, 1);
    assert.strictEqual(standards[0].frontmatter.title, 'Testing Standard');
  });

  it('skips non-markdown files', () => {
    const standard = `---
marr: standard
version: 1
title: Testing Standard
scope: Testing
triggers:
  - WHEN testing
---

## Core Rules

1. **Run tests** always
`;

    createStandardFile(tempDir, 'prj-testing-standard.md', standard);
    createStandardFile(tempDir, 'config.json', '{"key": "value"}');
    createStandardFile(tempDir, 'notes.txt', 'Some notes');

    const standards = readStandardsFromDir(tempDir);

    assert.strictEqual(standards.length, 1);
  });

  it('skips invalid standards gracefully', () => {
    const validStandard = `---
marr: standard
version: 1
title: Valid Standard
scope: Testing
triggers:
  - WHEN testing
---

## Core Rules

1. **Run tests** always
`;

    const invalidStandard = `---
title: Invalid - missing marr
---

Some content.
`;

    createStandardFile(tempDir, 'prj-valid-standard.md', validStandard);
    createStandardFile(tempDir, 'prj-invalid-standard.md', invalidStandard);

    const standards = readStandardsFromDir(tempDir);

    assert.strictEqual(standards.length, 1);
    assert.strictEqual(standards[0].frontmatter.title, 'Valid Standard');
  });

  it('returns empty array for non-existent directory', () => {
    const standards = readStandardsFromDir('/nonexistent/directory');
    assert.deepStrictEqual(standards, []);
  });

  it('returns empty array for empty directory', () => {
    const standards = readStandardsFromDir(tempDir);
    assert.deepStrictEqual(standards, []);
  });
});

describe('readInstalledStandards', () => {
  let tempDir: string;
  let projectStandardsDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
    projectStandardsDir = join(tempDir, '.claude', 'marr', 'standards');
    mkdirSync(projectStandardsDir, { recursive: true });
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('reads project-level standards', () => {
    const standard = `---
marr: standard
version: 1
title: Project Testing Standard
scope: Testing
triggers:
  - WHEN testing
---

## Core Rules

1. **Run tests** always
`;

    createStandardFile(projectStandardsDir, 'prj-testing-standard.md', standard);

    const standards = readInstalledStandards(tempDir);

    assert.strictEqual(standards.length, 1);
    assert.strictEqual(standards[0].frontmatter.title, 'Project Testing Standard');
  });

  it('returns empty array when no standards directory exists', () => {
    const emptyDir = createTempDir();
    try {
      const standards = readInstalledStandards(emptyDir);
      assert.deepStrictEqual(standards, []);
    } finally {
      cleanupTempDir(emptyDir);
    }
  });
});
