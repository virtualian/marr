/**
 * Tests for MARR project manifest zod schema.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ManifestSchema } from './manifest.js';

const VALID_HASH = 'a'.repeat(64);

function validManifest(): unknown {
  return {
    schema_version: 1,
    marr_version: '3.5.0',
    installed_at: '2026-01-15T12:00:00.000Z',
    files: {
      'prj-testing-standard.md': VALID_HASH,
    },
  };
}

describe('ManifestSchema', () => {
  it('accepts a valid manifest', () => {
    const result = ManifestSchema.safeParse(validManifest());
    assert.equal(result.success, true);
  });

  it('accepts a manifest with empty files map', () => {
    const m = validManifest() as Record<string, unknown>;
    m.files = {};
    const result = ManifestSchema.safeParse(m);
    assert.equal(result.success, true);
  });

  it('accepts an ISO timestamp with timezone offset', () => {
    const m = validManifest() as Record<string, unknown>;
    m.installed_at = '2026-01-15T12:00:00+01:00';
    const result = ManifestSchema.safeParse(m);
    assert.equal(result.success, true);
  });

  it('rejects schema_version other than literal 1', () => {
    const m = validManifest() as Record<string, unknown>;
    m.schema_version = 2;
    const result = ManifestSchema.safeParse(m);
    assert.equal(result.success, false);
  });

  it('rejects schema_version as a string', () => {
    const m = validManifest() as Record<string, unknown>;
    m.schema_version = '1';
    const result = ManifestSchema.safeParse(m);
    assert.equal(result.success, false);
  });

  it('rejects non-semver marr_version', () => {
    const m = validManifest() as Record<string, unknown>;
    m.marr_version = '3.5';
    const result = ManifestSchema.safeParse(m);
    assert.equal(result.success, false);
  });

  it('rejects marr_version with leading v', () => {
    const m = validManifest() as Record<string, unknown>;
    m.marr_version = 'v3.5.0';
    const result = ManifestSchema.safeParse(m);
    assert.equal(result.success, false);
  });

  it('accepts semver with prerelease suffix', () => {
    const m = validManifest() as Record<string, unknown>;
    m.marr_version = '3.5.0-rc.1';
    const result = ManifestSchema.safeParse(m);
    assert.equal(result.success, true);
  });

  it('rejects non-ISO installed_at', () => {
    const m = validManifest() as Record<string, unknown>;
    m.installed_at = '2026-01-15 12:00:00';
    const result = ManifestSchema.safeParse(m);
    assert.equal(result.success, false);
  });

  it('rejects installed_at as plain date', () => {
    const m = validManifest() as Record<string, unknown>;
    m.installed_at = '2026-01-15';
    const result = ManifestSchema.safeParse(m);
    assert.equal(result.success, false);
  });

  it('rejects hash that is too short', () => {
    const m = validManifest() as Record<string, unknown>;
    m.files = { 'prj-foo-standard.md': 'a'.repeat(63) };
    const result = ManifestSchema.safeParse(m);
    assert.equal(result.success, false);
  });

  it('rejects hash that is too long', () => {
    const m = validManifest() as Record<string, unknown>;
    m.files = { 'prj-foo-standard.md': 'a'.repeat(65) };
    const result = ManifestSchema.safeParse(m);
    assert.equal(result.success, false);
  });

  it('rejects uppercase hex in hash', () => {
    const m = validManifest() as Record<string, unknown>;
    m.files = { 'prj-foo-standard.md': 'A'.repeat(64) };
    const result = ManifestSchema.safeParse(m);
    assert.equal(result.success, false);
  });

  it('rejects invalid characters in hash', () => {
    const m = validManifest() as Record<string, unknown>;
    m.files = { 'prj-foo-standard.md': 'g'.repeat(64) };
    const result = ManifestSchema.safeParse(m);
    assert.equal(result.success, false);
  });

  it('rejects empty filename in files map', () => {
    const m = validManifest() as Record<string, unknown>;
    m.files = { '': VALID_HASH };
    const result = ManifestSchema.safeParse(m);
    assert.equal(result.success, false);
  });
});
