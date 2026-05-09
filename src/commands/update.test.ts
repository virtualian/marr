/**
 * End-to-end tests for the `marr update` CLI command.
 *
 * Spawns the built CLI as a subprocess (`node dist/index.js update ...`) and
 * exercises a tmp-dir "fake project" with copies of canonical standards.
 *
 * Note: the CLI resolves canonical standards relative to its own dist
 * location (`<repo>/resources/project/common`), so tests use the live
 * canonical files from this repo.
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  copyFileSync,
  existsSync,
  rmSync,
  statSync,
  readdirSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// dist/commands/update.test.js → repo root is two levels up from dist/.
const REPO_ROOT = resolve(__dirname, '..', '..');
const CLI_BIN = join(REPO_ROOT, 'dist', 'index.js');
const CANONICAL_DIR = join(REPO_ROOT, 'resources', 'project', 'common');

const STANDARDS_REL = join('.claude', 'marr', 'standards');
const MARR_REL = join('.claude', 'marr');
const MANIFEST_REL = join(MARR_REL, '.marr-version.json');

interface FakeProject {
  root: string;
  standardsDir: string;
  marrDir: string;
}

function makeFakeProject(prefix: string): FakeProject {
  const root = join(
    tmpdir(),
    `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  const marrDir = join(root, MARR_REL);
  const standardsDir = join(root, STANDARDS_REL);
  mkdirSync(standardsDir, { recursive: true });
  return { root, marrDir, standardsDir };
}

function cleanup(root: string): void {
  if (existsSync(root)) rmSync(root, { recursive: true, force: true });
}

/** Copy named canonical standards into the fake project so it looks initialised. */
function seedCanonicalCopies(project: FakeProject, names: string[]): void {
  for (const name of names) {
    const src = join(CANONICAL_DIR, name);
    if (!existsSync(src)) {
      throw new Error(`Test setup error: canonical file missing: ${src}`);
    }
    copyFileSync(src, join(project.standardsDir, name));
  }
}

/** List every canonical standard filename matching the prj-*-standard.md pattern. */
function listAllCanonicalStandards(): string[] {
  return readdirSync(CANONICAL_DIR).filter((n) => /^prj-.*-standard\.md$/.test(n));
}

/** Seed the fake project with copies of every canonical standard. */
function seedAllCanonicalCopies(project: FakeProject): string[] {
  const names = listAllCanonicalStandards();
  seedCanonicalCopies(project, names);
  return names;
}

function sha256OfFile(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

/** Write a manifest reflecting the current on-disk hashes of given files. */
function writeManifestForCurrentDisk(project: FakeProject, names: string[]): void {
  const files: Record<string, string> = {};
  for (const name of names) {
    files[name] = sha256OfFile(join(project.standardsDir, name));
  }
  const manifest = {
    schema_version: 1,
    marr_version: '3.5.0',
    installed_at: '2026-01-15T12:00:00.000Z',
    files,
  };
  writeFileSync(join(project.root, MANIFEST_REL), JSON.stringify(manifest, null, 2) + '\n');
}

interface RunResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

function runUpdate(args: string[], cwd?: string): RunResult {
  const result = spawnSync('node', [CLI_BIN, 'update', ...args], {
    cwd: cwd ?? REPO_ROOT,
    encoding: 'utf8',
    timeout: 30_000,
  });
  return {
    status: result.status,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

/** Capture mtime + sha for every file under standards/, for "untouched" assertions. */
function snapshotStandards(project: FakeProject): Record<string, { mtime: number; size: number }> {
  const snap: Record<string, { mtime: number; size: number }> = {};
  if (!existsSync(project.standardsDir)) return snap;
  for (const name of readdirSync(project.standardsDir)) {
    const s = statSync(join(project.standardsDir, name));
    snap[name] = { mtime: s.mtimeMs, size: s.size };
  }
  return snap;
}

describe('marr update --check', () => {
  let project: FakeProject;
  beforeEach(() => { project = makeFakeProject('marr-update-check'); });
  afterEach(() => { cleanup(project.root); });

  it('exits 0 when project is in sync (manifest matches local + canonical)', () => {
    const all = seedAllCanonicalCopies(project);
    writeManifestForCurrentDisk(project, all);

    const result = runUpdate(['--project', project.root, '--check']);
    assert.equal(result.status, 0, `stdout: ${result.stdout}\nstderr: ${result.stderr}`);
  });

  it('exits 1 when there is local drift (file edited)', () => {
    const all = seedAllCanonicalCopies(project);
    writeManifestForCurrentDisk(project, all);

    // Edit one local file so its hash diverges from the manifest baseline.
    const target = join(project.standardsDir, 'prj-mcp-usage-standard.md');
    writeFileSync(target, readFileSync(target, 'utf8') + '\n# user edit\n');

    const result = runUpdate(['--project', project.root, '--check']);
    assert.equal(result.status, 1, `stdout: ${result.stdout}\nstderr: ${result.stderr}`);
    assert.match(result.stdout, /drifted:\s+1/);
  });

  it('exits 1 when manifest is missing (bootstrap with non-empty canonical)', () => {
    // Empty fake project → canonical has files, local has none → all are added.
    const result = runUpdate(['--project', project.root, '--check']);
    assert.equal(result.status, 1, `stdout: ${result.stdout}\nstderr: ${result.stderr}`);
  });

  it('does not modify any files', () => {
    const all = seedAllCanonicalCopies(project);
    writeManifestForCurrentDisk(project, all);
    const before = snapshotStandards(project);
    const manifestBefore = readFileSync(join(project.root, MANIFEST_REL), 'utf8');

    runUpdate(['--project', project.root, '--check']);

    const after = snapshotStandards(project);
    assert.deepEqual(after, before);
    const manifestAfter = readFileSync(join(project.root, MANIFEST_REL), 'utf8');
    assert.equal(manifestAfter, manifestBefore);
  });
});

describe('marr update --dry-run', () => {
  let project: FakeProject;
  beforeEach(() => { project = makeFakeProject('marr-update-dryrun'); });
  afterEach(() => { cleanup(project.root); });

  it('exits 0 and does not modify files when changes would be applied', () => {
    const all = seedAllCanonicalCopies(project);
    writeManifestForCurrentDisk(project, all);

    // Edit local so the run sees drift; --force makes it auto-refresh under dry-run.
    const target = join(project.standardsDir, 'prj-mcp-usage-standard.md');
    const originalContent = readFileSync(target, 'utf8');
    writeFileSync(target, originalContent + '\n# user edit\n');

    const before = snapshotStandards(project);
    const manifestBefore = readFileSync(join(project.root, MANIFEST_REL), 'utf8');

    const result = runUpdate(['--project', project.root, '--dry-run', '--force']);
    assert.equal(result.status ?? 0, 0, `stdout: ${result.stdout}\nstderr: ${result.stderr}`);

    const after = snapshotStandards(project);
    assert.deepEqual(after, before, 'standards files should be unchanged after dry-run');
    const manifestAfter = readFileSync(join(project.root, MANIFEST_REL), 'utf8');
    assert.equal(manifestAfter, manifestBefore, 'manifest should be unchanged after dry-run');
  });
});

describe('marr update --prune', () => {
  let project: FakeProject;
  beforeEach(() => { project = makeFakeProject('marr-update-prune'); });
  afterEach(() => { cleanup(project.root); });

  it('removes a manifest-tracked file that is not in canonical', () => {
    // Seed every canonical file so the only drift is the orphan we inject.
    const all = seedAllCanonicalCopies(project);
    writeManifestForCurrentDisk(project, all);

    // Inject an "orphan" entry into the manifest pointing to a fake file.
    // The local copy of the orphan lives on disk so prune actually removes it.
    const orphanName = 'prj-no-longer-canonical-standard.md';
    const orphanPath = join(project.standardsDir, orphanName);
    writeFileSync(orphanPath, '# orphan\n');

    const orphanHash = sha256OfFile(orphanPath);
    const manifestPath = join(project.root, MANIFEST_REL);
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    manifest.files[orphanName] = orphanHash;
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

    assert.ok(existsSync(orphanPath), 'precondition: orphan file exists before prune');

    const result = runUpdate(['--project', project.root, '--prune', '--force']);
    assert.equal(result.status ?? 0, 0, `stdout: ${result.stdout}\nstderr: ${result.stderr}`);

    assert.equal(existsSync(orphanPath), false, 'orphan file should be removed after --prune');

    // Manifest should no longer reference the orphan.
    const finalManifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    assert.equal(orphanName in finalManifest.files, false);
  });
});

describe('marr update — flag validation', () => {
  it('exits non-zero when --project flag is omitted (run from a non-project cwd)', () => {
    // Run from a tmp dir that is NOT a marr project; without --project, the
    // CLI defaults to cwd, which has no .claude/marr/, so it should error.
    const tmp = join(tmpdir(), `marr-noflag-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    mkdirSync(tmp, { recursive: true });
    try {
      const result = spawnSync('node', [CLI_BIN, 'update'], {
        cwd: tmp,
        encoding: 'utf8',
        timeout: 30_000,
      });
      assert.notEqual(result.status, 0, `stdout: ${result.stdout}\nstderr: ${result.stderr}`);
      const combined = (result.stdout ?? '') + (result.stderr ?? '');
      assert.match(
        combined,
        /--project|MARR project/i,
        'error message should mention --project or MARR project',
      );
    } finally {
      cleanup(tmp);
    }
  });
});
