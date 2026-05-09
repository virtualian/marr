/**
 * Tests for marr-manifest utility (hash, read/write, build, compare).
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, rmSync, existsSync, readdirSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import {
  hashFile,
  readManifest,
  writeManifest,
  buildManifest,
  compareManifest,
  manifestPath,
  type Manifest,
} from './marr-manifest.js';

function makeTmpDir(prefix: string): string {
  const dir = join(
    tmpdir(),
    `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  mkdirSync(dir, { recursive: true });
  return dir;
}

function cleanup(dir: string): void {
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
}

const VALID_HASH = 'a'.repeat(64);

function sampleManifest(overrides: Partial<Manifest> = {}): Manifest {
  return {
    schema_version: 1,
    marr_version: '3.5.0',
    installed_at: '2026-01-15T12:00:00.000Z',
    files: {
      'prj-testing-standard.md': VALID_HASH,
    },
    ...overrides,
  };
}

describe('hashFile', () => {
  let tmp: string;
  beforeEach(() => { tmp = makeTmpDir('marr-hashfile'); });
  afterEach(() => { cleanup(tmp); });

  it('produces deterministic SHA-256 hex of a known string', () => {
    const f = join(tmp, 'a.txt');
    writeFileSync(f, 'hello');
    assert.equal(
      hashFile(f),
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    );
  });

  it('returns the same hash for identical content across files', () => {
    const a = join(tmp, 'a.txt');
    const b = join(tmp, 'b.txt');
    writeFileSync(a, 'identical content');
    writeFileSync(b, 'identical content');
    assert.equal(hashFile(a), hashFile(b));
  });

  it('returns different hashes for different content', () => {
    const a = join(tmp, 'a.txt');
    const b = join(tmp, 'b.txt');
    writeFileSync(a, 'content A');
    writeFileSync(b, 'content B');
    assert.notEqual(hashFile(a), hashFile(b));
  });
});

describe('writeManifest + readManifest', () => {
  let tmp: string;
  beforeEach(() => { tmp = makeTmpDir('marr-rwmanifest'); });
  afterEach(() => { cleanup(tmp); });

  it('round-trips a manifest with deep equality', () => {
    const m = sampleManifest();
    writeManifest(tmp, m);
    const read = readManifest(tmp);
    assert.deepEqual(read, m);
  });

  it('write is atomic — no .tmp file remains afterwards', () => {
    writeManifest(tmp, sampleManifest());
    const remaining = readdirSync(tmp).filter((n) => n.endsWith('.tmp'));
    assert.deepEqual(remaining, []);
  });

  it('returns null when manifest file is missing', () => {
    assert.equal(readManifest(tmp), null);
  });

  it('returns null when manifest file is invalid JSON', () => {
    writeFileSync(manifestPath(tmp), '{ this is not json');
    assert.equal(readManifest(tmp), null);
  });

  it('returns null when JSON parses but fails schema validation', () => {
    writeFileSync(
      manifestPath(tmp),
      JSON.stringify({ schema_version: 99, marr_version: '3.5.0', installed_at: '2026-01-15T12:00:00.000Z', files: {} }),
    );
    assert.equal(readManifest(tmp), null);
  });

  it('returns null when JSON has wrong hash format', () => {
    writeFileSync(
      manifestPath(tmp),
      JSON.stringify({
        schema_version: 1,
        marr_version: '3.5.0',
        installed_at: '2026-01-15T12:00:00.000Z',
        files: { 'prj-foo-standard.md': 'too-short' },
      }),
    );
    assert.equal(readManifest(tmp), null);
  });
});

describe('buildManifest', () => {
  let tmp: string;
  let standardsDir: string;
  beforeEach(() => {
    tmp = makeTmpDir('marr-build');
    standardsDir = join(tmp, 'standards');
    mkdirSync(standardsDir, { recursive: true });
  });
  afterEach(() => { cleanup(tmp); });

  it('only includes prj-*-standard.md files; ignores README and other files', () => {
    writeFileSync(join(standardsDir, 'prj-testing-standard.md'), 'content A');
    writeFileSync(join(standardsDir, 'prj-version-control-standard.md'), 'content B');
    writeFileSync(join(standardsDir, 'README.md'), '# readme');
    writeFileSync(join(standardsDir, 'notes.txt'), 'random');
    writeFileSync(join(standardsDir, 'something-else.md'), 'no prefix');

    const manifest = buildManifest(standardsDir, '3.5.0');

    assert.deepEqual(
      Object.keys(manifest.files).sort(),
      ['prj-testing-standard.md', 'prj-version-control-standard.md'],
    );
    assert.equal(manifest.schema_version, 1);
    assert.equal(manifest.marr_version, '3.5.0');
    assert.match(manifest.installed_at, /^\d{4}-\d{2}-\d{2}T/);
  });

  it('hashes match hashFile output for each included file', () => {
    const path = join(standardsDir, 'prj-testing-standard.md');
    writeFileSync(path, 'standard content');
    const manifest = buildManifest(standardsDir, '3.5.0');
    assert.equal(manifest.files['prj-testing-standard.md'], hashFile(path));
  });

  it('respects fileFilter — only files passing the filter appear', () => {
    writeFileSync(join(standardsDir, 'prj-testing-standard.md'), 'a');
    writeFileSync(join(standardsDir, 'prj-version-control-standard.md'), 'b');
    writeFileSync(join(standardsDir, 'prj-documentation-standard.md'), 'c');

    const manifest = buildManifest(
      standardsDir,
      '3.5.0',
      (name) => name === 'prj-testing-standard.md',
    );

    assert.deepEqual(Object.keys(manifest.files), ['prj-testing-standard.md']);
  });

  it('returns empty files map when standards dir does not exist', () => {
    const m = buildManifest(join(tmp, 'does-not-exist'), '3.5.0');
    assert.deepEqual(m.files, {});
  });
});

describe('compareManifest — bootstrap (manifest=null)', () => {
  let tmp: string;
  let canonicalDir: string;
  let localDir: string;
  beforeEach(() => {
    tmp = makeTmpDir('marr-bootstrap');
    canonicalDir = join(tmp, 'canonical');
    localDir = join(tmp, 'local');
    mkdirSync(canonicalDir, { recursive: true });
    mkdirSync(localDir, { recursive: true });
  });
  afterEach(() => { cleanup(tmp); });

  it('classifies canonical-only files as added', () => {
    writeFileSync(join(canonicalDir, 'prj-testing-standard.md'), 'A');

    const diff = compareManifest(null, localDir, canonicalDir);
    assert.deepEqual(diff.added, ['prj-testing-standard.md']);
    assert.deepEqual(diff.unchanged, []);
    assert.deepEqual(diff.drifted, []);
    assert.deepEqual(diff.modified, []);
    assert.deepEqual(diff.orphan, []);
  });

  it('classifies matching local+canonical as unchanged', () => {
    writeFileSync(join(canonicalDir, 'prj-testing-standard.md'), 'same');
    writeFileSync(join(localDir, 'prj-testing-standard.md'), 'same');

    const diff = compareManifest(null, localDir, canonicalDir);
    assert.deepEqual(diff.unchanged, ['prj-testing-standard.md']);
    assert.deepEqual(diff.drifted, []);
  });

  it('classifies differing local+canonical as drifted', () => {
    writeFileSync(join(canonicalDir, 'prj-testing-standard.md'), 'canonical');
    writeFileSync(join(localDir, 'prj-testing-standard.md'), 'edited');

    const diff = compareManifest(null, localDir, canonicalDir);
    assert.deepEqual(diff.drifted, ['prj-testing-standard.md']);
    assert.deepEqual(diff.unchanged, []);
  });

  it('does not produce orphan or modified buckets in bootstrap mode', () => {
    writeFileSync(join(canonicalDir, 'prj-a-standard.md'), 'a');
    writeFileSync(join(canonicalDir, 'prj-b-standard.md'), 'b');
    writeFileSync(join(localDir, 'prj-a-standard.md'), 'a');
    writeFileSync(join(localDir, 'prj-c-standard.md'), 'extra'); // local-only file

    const diff = compareManifest(null, localDir, canonicalDir);
    assert.deepEqual(diff.modified, []);
    assert.deepEqual(diff.orphan, []);
  });
});

describe('compareManifest — with manifest', () => {
  let tmp: string;
  let canonicalDir: string;
  let localDir: string;
  beforeEach(() => {
    tmp = makeTmpDir('marr-withmanifest');
    canonicalDir = join(tmp, 'canonical');
    localDir = join(tmp, 'local');
    mkdirSync(canonicalDir, { recursive: true });
    mkdirSync(localDir, { recursive: true });
  });
  afterEach(() => { cleanup(tmp); });

  it('subscribed file with matching local & canonical hashes is unchanged', () => {
    writeFileSync(join(canonicalDir, 'prj-x-standard.md'), 'same');
    writeFileSync(join(localDir, 'prj-x-standard.md'), 'same');
    const baselineHash = hashFile(join(localDir, 'prj-x-standard.md'));

    const manifest = sampleManifest({ files: { 'prj-x-standard.md': baselineHash } });
    const diff = compareManifest(manifest, localDir, canonicalDir);
    assert.deepEqual(diff.unchanged, ['prj-x-standard.md']);
    assert.deepEqual(diff.modified, []);
    assert.deepEqual(diff.drifted, []);
  });

  it('subscribed file matching baseline but canonical advanced is modified (silent refresh)', () => {
    writeFileSync(join(localDir, 'prj-x-standard.md'), 'baseline');
    writeFileSync(join(canonicalDir, 'prj-x-standard.md'), 'baseline-v2');
    const baselineHash = hashFile(join(localDir, 'prj-x-standard.md'));

    const manifest = sampleManifest({ files: { 'prj-x-standard.md': baselineHash } });
    const diff = compareManifest(manifest, localDir, canonicalDir);
    assert.deepEqual(diff.modified, ['prj-x-standard.md']);
    assert.deepEqual(diff.unchanged, []);
    assert.deepEqual(diff.drifted, []);
  });

  it('subscribed file with local hash != baseline is drifted (user edited)', () => {
    writeFileSync(join(canonicalDir, 'prj-x-standard.md'), 'baseline');
    writeFileSync(join(localDir, 'prj-x-standard.md'), 'user-edit');
    const baselineHash = hashFile(join(canonicalDir, 'prj-x-standard.md'));

    const manifest = sampleManifest({ files: { 'prj-x-standard.md': baselineHash } });
    const diff = compareManifest(manifest, localDir, canonicalDir);
    assert.deepEqual(diff.drifted, ['prj-x-standard.md']);
    assert.deepEqual(diff.unchanged, []);
  });

  it('subscribed file deleted locally is drifted', () => {
    writeFileSync(join(canonicalDir, 'prj-x-standard.md'), 'baseline');
    // Deliberately do not write the local copy.

    const manifest = sampleManifest({ files: { 'prj-x-standard.md': VALID_HASH } });
    const diff = compareManifest(manifest, localDir, canonicalDir);
    assert.deepEqual(diff.drifted, ['prj-x-standard.md']);
  });

  it('canonical file not in manifest subscription is added', () => {
    writeFileSync(join(canonicalDir, 'prj-new-standard.md'), 'new');

    const manifest = sampleManifest({ files: {} });
    const diff = compareManifest(manifest, localDir, canonicalDir);
    assert.deepEqual(diff.added, ['prj-new-standard.md']);
  });

  it('manifest file not in canonical is orphan', () => {
    // No canonical, no local — only manifest references it.
    const manifest = sampleManifest({ files: { 'prj-removed-standard.md': VALID_HASH } });
    const diff = compareManifest(manifest, localDir, canonicalDir);
    assert.deepEqual(diff.orphan, ['prj-removed-standard.md']);
  });

  it('handles a mixed scenario across all five buckets', () => {
    // unchanged
    writeFileSync(join(canonicalDir, 'prj-u-standard.md'), 'u');
    writeFileSync(join(localDir, 'prj-u-standard.md'), 'u');
    const uHash = hashFile(join(localDir, 'prj-u-standard.md'));

    // modified
    writeFileSync(join(canonicalDir, 'prj-m-standard.md'), 'm-new');
    writeFileSync(join(localDir, 'prj-m-standard.md'), 'm-old');
    const mHash = hashFile(join(localDir, 'prj-m-standard.md'));

    // drifted
    writeFileSync(join(canonicalDir, 'prj-d-standard.md'), 'd-canonical');
    writeFileSync(join(localDir, 'prj-d-standard.md'), 'd-edited');
    const dHash = hashFile(join(canonicalDir, 'prj-d-standard.md'));

    // added (in canonical, not in subscription)
    writeFileSync(join(canonicalDir, 'prj-a-standard.md'), 'a');

    // orphan (in subscription, not in canonical)
    const orphanHash = VALID_HASH;

    const manifest = sampleManifest({
      files: {
        'prj-u-standard.md': uHash,
        'prj-m-standard.md': mHash,
        'prj-d-standard.md': dHash,
        'prj-o-standard.md': orphanHash,
      },
    });

    const diff = compareManifest(manifest, localDir, canonicalDir);
    assert.deepEqual(diff.unchanged, ['prj-u-standard.md']);
    assert.deepEqual(diff.modified, ['prj-m-standard.md']);
    assert.deepEqual(diff.drifted, ['prj-d-standard.md']);
    assert.deepEqual(diff.added, ['prj-a-standard.md']);
    assert.deepEqual(diff.orphan, ['prj-o-standard.md']);
  });
});
