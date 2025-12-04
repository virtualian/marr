/**
 * Tests for MARR standard frontmatter schema
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  StandardFrontmatterSchema,
  TriggerSchema,
  formatTrigger,
} from './standard.js';

describe('TriggerSchema', () => {
  it('validates a trigger string', () => {
    const result = TriggerSchema.safeParse('WHEN creating or modifying documentation');
    assert.strictEqual(result.success, true);
  });

  it('rejects empty string', () => {
    const result = TriggerSchema.safeParse('');
    assert.strictEqual(result.success, false);
  });

  it('rejects non-string values', () => {
    const result = TriggerSchema.safeParse({ intent: 'testing' });
    assert.strictEqual(result.success, false);
  });

  it('validates WHEN-prefixed trigger descriptions', () => {
    const triggers = [
      'WHEN working with tests or test coverage',
      'WHEN making commits or pull requests',
      'WHEN deciding where documentation should live',
    ];
    for (const trigger of triggers) {
      const result = TriggerSchema.safeParse(trigger);
      assert.strictEqual(result.success, true, `Failed for: ${trigger}`);
    }
  });
});

describe('StandardFrontmatterSchema', () => {
  it('validates complete frontmatter with WHEN-prefixed triggers', () => {
    const result = StandardFrontmatterSchema.safeParse({
      marr: 'standard',
      version: 1,
      title: 'Documentation Standard',
      scope: 'All documentation activities',
      triggers: [
        'WHEN creating or modifying documentation, READMEs, or guides',
        'WHEN deciding where documentation should live in the project',
      ],
    });
    assert.strictEqual(result.success, true);
  });

  it('rejects missing marr discriminator', () => {
    const result = StandardFrontmatterSchema.safeParse({
      version: 1,
      title: 'Test Standard',
      scope: 'All test activities',
      triggers: ['Working with tests'],
    });
    assert.strictEqual(result.success, false);
  });

  it('rejects wrong marr value', () => {
    const result = StandardFrontmatterSchema.safeParse({
      marr: 'other',
      version: 1,
      title: 'Test Standard',
      scope: 'All test activities',
      triggers: ['Working with tests'],
    });
    assert.strictEqual(result.success, false);
  });

  it('rejects missing triggers', () => {
    const result = StandardFrontmatterSchema.safeParse({
      marr: 'standard',
      version: 1,
      title: 'Test Standard',
      scope: 'All test activities',
    });
    assert.strictEqual(result.success, false);
  });

  it('rejects empty triggers array', () => {
    const result = StandardFrontmatterSchema.safeParse({
      marr: 'standard',
      version: 1,
      title: 'Test Standard',
      scope: 'All test activities',
      triggers: [],
    });
    assert.strictEqual(result.success, false);
  });

  it('validates multiple WHEN-prefixed triggers', () => {
    const result = StandardFrontmatterSchema.safeParse({
      marr: 'standard',
      version: 1,
      title: 'Testing Standard',
      scope: 'All testing activities',
      triggers: [
        'WHEN running, writing, or modifying tests',
        'WHEN evaluating test coverage or testing strategy',
        'WHEN making code changes that should have test coverage',
      ],
    });
    assert.strictEqual(result.success, true);
  });
});

describe('formatTrigger', () => {
  it('returns the trigger string unchanged', () => {
    const trigger = 'WHEN creating or modifying documentation';
    assert.strictEqual(formatTrigger(trigger), trigger);
  });

  it('preserves WHEN-prefixed descriptions', () => {
    const trigger = 'WHEN working with git branches, commits, or pull requests';
    assert.strictEqual(formatTrigger(trigger), trigger);
  });
});
