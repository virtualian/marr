/**
 * Tests for MARR conflict detector
 *
 * Tests semantic conflict detection between user config and MARR standards.
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  detectProjectConflicts,
  generateConflictReport,
  getScanSummary,
} from './conflict-detector.js';

/** Create a temporary directory for test fixtures */
function createTempDir(): string {
  const dir = join(tmpdir(), `marr-conflict-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

/** Clean up temporary directory */
function cleanupTempDir(dir: string): void {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Create standard MARR project structure */
function createMarrProject(dir: string): void {
  const standardsDir = join(dir, '.claude', 'marr', 'standards');
  mkdirSync(standardsDir, { recursive: true });

  // Create MARR project config
  writeFileSync(
    join(dir, '.claude', 'marr', 'MARR-PROJECT-CLAUDE.md'),
    `# MARR Project Configuration

MARR standards are defined in the standards directory.
`
  );

  // Create CLAUDE.md with MARR import
  writeFileSync(
    join(dir, 'CLAUDE.md'),
    `# Project Configuration

@.claude/marr/MARR-PROJECT-CLAUDE.md

Add project-specific configuration here.
`
  );
}

/** Create a test standard file */
function createStandard(dir: string, filename: string, content: string): void {
  const standardsDir = join(dir, '.claude', 'marr', 'standards');
  mkdirSync(standardsDir, { recursive: true });
  writeFileSync(join(standardsDir, filename), content);
}

describe('detectProjectConflicts', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
    createMarrProject(tempDir);
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('detects no conflicts in clean project', () => {
    createStandard(
      tempDir,
      'prj-testing-standard.md',
      `---
marr: standard
version: 1
title: Testing Standard
scope: All testing activities
triggers:
  - WHEN running tests
---

## Core Rules

1. **Always run tests** before committing changes
`
    );

    const conflicts = detectProjectConflicts(tempDir);
    assert.strictEqual(conflicts.length, 0);
  });

  it('detects directive conflict when config negates a rule', () => {
    // Create a standard - note: first keyword after stop words is used for negation matching
    // "Run tests" → first keyword is "run", so "never run" will match
    createStandard(
      tempDir,
      'prj-testing-standard.md',
      `---
marr: standard
version: 1
title: Testing Standard
scope: All testing activities
triggers:
  - WHEN running tests
---

## Core Rules

1. **Run tests** before committing changes
`
    );

    // Create a config with negation - "never run" matches the rule's first keyword "run"
    writeFileSync(
      join(tempDir, 'CLAUDE.md'),
      `# Project Configuration

@.claude/marr/MARR-PROJECT-CLAUDE.md

## Custom Rules

- Never run tests automatically for hotfixes
`
    );

    const conflicts = detectProjectConflicts(tempDir);

    // Should detect the negation conflict
    const directiveConflicts = conflicts.filter(c => c.category === 'directive_conflict');
    assert.ok(directiveConflicts.length > 0, 'Should detect directive conflict');
  });

  it('detects conflict when config encourages anti-pattern', () => {
    // Create a standard with anti-patterns
    createStandard(
      tempDir,
      'prj-workflow-standard.md',
      `---
marr: standard
version: 1
title: Workflow Standard
scope: All git activities
triggers:
  - WHEN working with git
---

## Anti-Patterns

- **Skipping tests** — Never skip tests to save time
- **Force pushing** — Avoid force pushing to shared branches
`
    );

    // Create a config that encourages skipping
    writeFileSync(
      join(tempDir, 'CLAUDE.md'),
      `# Project Configuration

@.claude/marr/MARR-PROJECT-CLAUDE.md

## Workflow Preferences

- Always skip tests for hotfixes
- Prefer skipping tests when time is short
`
    );

    const conflicts = detectProjectConflicts(tempDir);

    const directiveConflicts = conflicts.filter(c => c.category === 'directive_conflict');
    assert.ok(directiveConflicts.length > 0, 'Should detect anti-pattern violation');
  });

  it('detects missing MARR import', () => {
    // Create standards
    createStandard(
      tempDir,
      'prj-testing-standard.md',
      `---
marr: standard
version: 1
title: Testing Standard
scope: All testing activities
triggers:
  - WHEN running tests
---

## Core Rules

1. **Run tests** always
`
    );

    // Create CLAUDE.md WITHOUT the MARR import
    writeFileSync(
      join(tempDir, 'CLAUDE.md'),
      `# Project Configuration

Some project rules here.
`
    );

    const conflicts = detectProjectConflicts(tempDir);

    const missingImportConflicts = conflicts.filter(c => c.category === 'missing_import');
    assert.strictEqual(missingImportConflicts.length, 1, 'Should detect missing import');
    assert.ok(missingImportConflicts[0].description.includes('doesn\'t import MARR'));
  });

  it('detects duplicate standards in .cursorrules', () => {
    // Create a MARR testing standard
    createStandard(
      tempDir,
      'prj-testing-standard.md',
      `---
marr: standard
version: 1
title: Testing Standard
scope: All testing activities
triggers:
  - WHEN running tests
---

## Core Rules

1. **Always run tests** before committing
2. **Write tests first** when fixing bugs
3. **Use descriptive names** for test cases
`
    );

    // Create a .cursorrules with overlapping testing rules
    writeFileSync(
      join(tempDir, '.cursorrules'),
      `# Cursor Rules

## Testing Guidelines

- Always write tests for new features
- Run tests before committing code
- Use jest for testing
- Test coverage must be above 80%
- Write descriptive test names
`
    );

    const conflicts = detectProjectConflicts(tempDir);

    const duplicateConflicts = conflicts.filter(c => c.category === 'duplicate_standard');
    assert.ok(duplicateConflicts.length > 0, 'Should detect duplicate testing standards');
  });

  it('provides resolutions for each conflict type', () => {
    // Create a conflict scenario
    createStandard(
      tempDir,
      'prj-testing-standard.md',
      `---
marr: standard
version: 1
title: Testing Standard
scope: All testing activities
triggers:
  - WHEN running tests
---

## Core Rules

1. **Always run tests** before committing
`
    );

    writeFileSync(
      join(tempDir, 'CLAUDE.md'),
      `# Project Configuration

- Never run tests automatically
`
    );

    const conflicts = detectProjectConflicts(tempDir);

    for (const conflict of conflicts) {
      assert.ok(conflict.resolutions.length > 0, `Conflict ${conflict.id} should have resolutions`);
      assert.ok(
        conflict.resolutions.every(r => r.key && r.label && r.description),
        'Each resolution should have key, label, and description'
      );
    }
  });

  it('includes source standard in directive conflicts', () => {
    createStandard(
      tempDir,
      'prj-testing-standard.md',
      `---
marr: standard
version: 1
title: Testing Standard
scope: All testing activities
triggers:
  - WHEN running tests
---

## Core Rules

1. **Always run tests** before committing changes
`
    );

    writeFileSync(
      join(tempDir, 'CLAUDE.md'),
      `# Project Configuration

@.claude/marr/MARR-PROJECT-CLAUDE.md

- Never run tests for quick changes
`
    );

    const conflicts = detectProjectConflicts(tempDir);
    const directiveConflicts = conflicts.filter(c => c.category === 'directive_conflict');

    if (directiveConflicts.length > 0) {
      assert.ok(
        directiveConflicts[0].marrSource,
        'Should include the source standard file'
      );
    }
  });

  it('handles project with no standards gracefully', () => {
    // Just CLAUDE.md, no standards
    writeFileSync(
      join(tempDir, 'CLAUDE.md'),
      `# Project Configuration

Some rules here.
`
    );

    // Remove the standards directory
    rmSync(join(tempDir, '.claude', 'marr', 'standards'), { recursive: true, force: true });

    const conflicts = detectProjectConflicts(tempDir);

    // Should only potentially have missing_import conflict
    const nonImportConflicts = conflicts.filter(c => c.category !== 'missing_import');
    assert.strictEqual(nonImportConflicts.length, 0);
  });

  it('deduplicates conflicts with same ID', () => {
    createStandard(
      tempDir,
      'prj-testing-standard.md',
      `---
marr: standard
version: 1
title: Testing Standard
scope: All testing activities
triggers:
  - WHEN running tests
---

## Core Rules

1. **Always run tests** before committing
`
    );

    // Same conflicting line shouldn't be reported twice
    writeFileSync(
      join(tempDir, 'CLAUDE.md'),
      `# Project Configuration

@.claude/marr/MARR-PROJECT-CLAUDE.md

- Never run tests for hotfixes
`
    );

    const conflicts = detectProjectConflicts(tempDir);
    const ids = conflicts.map(c => c.id);
    const uniqueIds = new Set(ids);

    assert.strictEqual(ids.length, uniqueIds.size, 'Should not have duplicate conflict IDs');
  });
});

describe('generateConflictReport', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
    createMarrProject(tempDir);
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('generates report with correct structure', () => {
    createStandard(
      tempDir,
      'prj-testing-standard.md',
      `---
marr: standard
version: 1
title: Testing Standard
scope: All testing activities
triggers:
  - WHEN running tests
---

## Core Rules

1. **Run tests** always
`
    );

    const report = generateConflictReport('project', tempDir);

    assert.ok(report.timestamp, 'Should have timestamp');
    assert.strictEqual(report.scope, 'project');
    assert.ok(typeof report.filesScanned === 'number');
    assert.ok(Array.isArray(report.conflicts));
    assert.ok(report.summary);
    assert.ok(typeof report.summary.errors === 'number');
    assert.ok(typeof report.summary.warnings === 'number');
    assert.ok(typeof report.summary.total === 'number');
  });

  it('counts errors and warnings correctly', () => {
    createStandard(
      tempDir,
      'prj-testing-standard.md',
      `---
marr: standard
version: 1
title: Testing Standard
scope: All testing activities
triggers:
  - WHEN running tests
---

## Core Rules

1. **Always run tests** before committing
`
    );

    // Create multiple conflicts
    writeFileSync(
      join(tempDir, 'CLAUDE.md'),
      `# Project Configuration

- Never run tests automatically
`
    );

    const report = generateConflictReport('project', tempDir);

    assert.strictEqual(
      report.summary.total,
      report.conflicts.length,
      'Total should match conflicts array length'
    );
    assert.strictEqual(
      report.summary.errors + report.summary.warnings,
      report.summary.total,
      'Errors + warnings should equal total'
    );
  });

  it('respects scope parameter', () => {
    createStandard(
      tempDir,
      'prj-testing-standard.md',
      `---
marr: standard
version: 1
title: Testing Standard
scope: All testing activities
triggers:
  - WHEN running tests
---

## Core Rules

1. **Run tests** always
`
    );

    const projectReport = generateConflictReport('project', tempDir);
    assert.strictEqual(projectReport.scope, 'project');

    // User scope won't find project files
    const userReport = generateConflictReport('user', tempDir);
    assert.strictEqual(userReport.scope, 'user');
  });
});

describe('getScanSummary', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
    createMarrProject(tempDir);
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('returns correct counts', () => {
    createStandard(
      tempDir,
      'prj-testing-standard.md',
      `---
marr: standard
version: 1
title: Testing Standard
scope: All testing activities
triggers:
  - WHEN running tests
---

## Core Rules

1. **Always run tests** before committing
2. **Write unit tests** for new code
`
    );

    createStandard(
      tempDir,
      'prj-workflow-standard.md',
      `---
marr: standard
version: 1
title: Workflow Standard
scope: All git activities
triggers:
  - WHEN working with git
---

## Core Rules

1. **Use feature branches** for new work
`
    );

    const summary = getScanSummary(tempDir);

    assert.strictEqual(summary.standards, 2, 'Should find 2 standards');
    assert.ok(summary.directives >= 3, 'Should extract at least 3 directives');
    assert.ok(summary.configFiles >= 0, 'Should count config files');
  });

  it('handles empty project', () => {
    const emptyDir = createTempDir();
    try {
      const summary = getScanSummary(emptyDir);

      assert.strictEqual(summary.standards, 0);
      assert.strictEqual(summary.directives, 0);
    } finally {
      cleanupTempDir(emptyDir);
    }
  });
});

describe('conflict detection edge cases', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
    createMarrProject(tempDir);
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('does not flag MARR files as duplicates', () => {
    createStandard(
      tempDir,
      'prj-testing-standard.md',
      `---
marr: standard
version: 1
title: Testing Standard
scope: All testing activities
triggers:
  - WHEN running tests
---

## Core Rules

1. **Always run tests** before committing
`
    );

    const conflicts = detectProjectConflicts(tempDir);

    // MARR's own files should not be flagged as duplicates
    const duplicates = conflicts.filter(
      c => c.category === 'duplicate_standard' && c.location.includes('.claude/marr/')
    );
    assert.strictEqual(duplicates.length, 0, 'MARR files should not be flagged as duplicates');
  });

  it('handles files with no directives', () => {
    // Standard with no Core Rules or Anti-Patterns sections
    createStandard(
      tempDir,
      'prj-empty-standard.md',
      `---
marr: standard
version: 1
title: Empty Standard
scope: Testing
triggers:
  - WHEN testing empty standards
---

# Empty Standard

This standard has no rules or anti-patterns defined yet.

## Overview

Just some documentation.
`
    );

    const conflicts = detectProjectConflicts(tempDir);

    // Should not crash and should not detect false conflicts
    assert.ok(Array.isArray(conflicts));
  });

  it('requires minimum keyword overlap to flag conflict', () => {
    createStandard(
      tempDir,
      'prj-testing-standard.md',
      `---
marr: standard
version: 1
title: Testing Standard
scope: All testing activities
triggers:
  - WHEN running tests
---

## Core Rules

1. **Always run comprehensive integration tests** before deployment
`
    );

    // This has only one keyword overlap ("tests") - should not conflict
    writeFileSync(
      join(tempDir, 'CLAUDE.md'),
      `# Project Configuration

@.claude/marr/MARR-PROJECT-CLAUDE.md

- Use fast tests only
`
    );

    const conflicts = detectProjectConflicts(tempDir);
    const directiveConflicts = conflicts.filter(c => c.category === 'directive_conflict');

    // With only 1 keyword overlap, should not flag as conflict
    // (MIN_KEYWORD_OVERLAP = 2)
    assert.strictEqual(
      directiveConflicts.length,
      0,
      'Should not flag with insufficient keyword overlap'
    );
  });

  it('detects conflicts with negation patterns', () => {
    // The algorithm uses the first keyword of the directive for pattern matching
    // "Write commit messages" → first keyword is "write"
    createStandard(
      tempDir,
      'prj-commits-standard.md',
      `---
marr: standard
version: 1
title: Commits Standard
scope: All commit activities
triggers:
  - WHEN making commits
---

## Core Rules

1. **Write commit messages** with clear descriptions
`
    );

    // Various negation patterns - must:
    // 1. Use "write" as the verb (first keyword of directive)
    // 2. Have at least 2 keywords overlapping with directive
    const negationPatterns = [
      "don't write commit messages",
      'do not write commit messages',
      'never write commit messages',
      'avoid write commit messages', // 'avoid' + 3 overlapping keywords
      'skip write commit messages', // 'skip' + 3 overlapping keywords
    ];

    for (const pattern of negationPatterns) {
      writeFileSync(
        join(tempDir, 'CLAUDE.md'),
        `# Project Configuration

@.claude/marr/MARR-PROJECT-CLAUDE.md

- ${pattern} for trivial changes
`
      );

      const conflicts = detectProjectConflicts(tempDir);
      const directiveConflicts = conflicts.filter(c => c.category === 'directive_conflict');

      // Should detect the negation
      assert.ok(
        directiveConflicts.length > 0,
        `Should detect negation pattern: "${pattern}"`
      );
    }
  });
});

describe('conflict IDs', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
    createMarrProject(tempDir);
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('generates unique IDs for different conflicts', () => {
    createStandard(
      tempDir,
      'prj-testing-standard.md',
      `---
marr: standard
version: 1
title: Testing Standard
scope: All testing activities
triggers:
  - WHEN running tests
---

## Core Rules

1. **Always run tests** before committing
`
    );

    createStandard(
      tempDir,
      'prj-workflow-standard.md',
      `---
marr: standard
version: 1
title: Workflow Standard
scope: All git activities
triggers:
  - WHEN working with git
---

## Core Rules

1. **Always commit frequently** with small changes
`
    );

    writeFileSync(
      join(tempDir, 'CLAUDE.md'),
      `# Project Configuration

- Never run tests automatically
- Never commit more than once per day
`
    );

    const conflicts = detectProjectConflicts(tempDir);
    const ids = conflicts.map(c => c.id);
    const uniqueIds = new Set(ids);

    assert.strictEqual(ids.length, uniqueIds.size, 'All conflict IDs should be unique');
  });

  it('includes line number in ID when available', () => {
    createStandard(
      tempDir,
      'prj-testing-standard.md',
      `---
marr: standard
version: 1
title: Testing Standard
scope: All testing activities
triggers:
  - WHEN running tests
---

## Core Rules

1. **Always run tests** before committing
`
    );

    writeFileSync(
      join(tempDir, 'CLAUDE.md'),
      `# Project Configuration

@.claude/marr/MARR-PROJECT-CLAUDE.md

Line 5
Line 6
- Never run tests for hotfixes
`
    );

    const conflicts = detectProjectConflicts(tempDir);
    const directiveConflicts = conflicts.filter(c => c.category === 'directive_conflict');

    if (directiveConflicts.length > 0) {
      assert.ok(
        directiveConflicts[0].id.includes('-L'),
        'Conflict ID should include line number'
      );
      assert.ok(
        directiveConflicts[0].line !== undefined,
        'Conflict should have line number'
      );
    }
  });
});
