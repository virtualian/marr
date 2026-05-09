/**
 * Manifest helpers for `marr update`.
 *
 * The project manifest records SHA-256 hashes of every standard MARR has
 * installed. By comparing local hashes, manifest hashes (the recorded
 * baseline), and canonical hashes (the bundled npm package) we classify
 * each file into one of five buckets — see `compareManifest`.
 */

import { createHash } from 'crypto';
import { renameSync, readFileSync } from 'fs';
import { join, basename } from 'path';
import * as fileOps from './file-ops.js';
import { ManifestSchema, MANIFEST_FILENAME, type Manifest } from '../schema/manifest.js';

export { MANIFEST_FILENAME, type Manifest };

/** Files in `<dir>/standards/` that MARR considers standards. */
const STANDARD_FILE_PATTERN = /^prj-.*-standard\.md$/;

/** Whether a filename is a MARR project standard (`prj-*-standard.md`). */
export function isStandardFilename(name: string): boolean {
  return STANDARD_FILE_PATTERN.test(name);
}

/** SHA-256 hex digest of a file's raw bytes. */
export function hashFile(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

/** Path to the manifest inside `.claude/marr/`. */
export function manifestPath(marrDir: string): string {
  return join(marrDir, MANIFEST_FILENAME);
}

/**
 * Read and validate the manifest. Returns null when missing or invalid —
 * callers fall through to bootstrap.
 */
export function readManifest(marrDir: string): Manifest | null {
  const path = manifestPath(marrDir);
  if (!fileOps.exists(path)) return null;

  try {
    const parsed: unknown = JSON.parse(fileOps.readFile(path));
    const result = ManifestSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Write the manifest atomically: write tmp + rename, so a SIGINT mid-write
 * never leaves a partial JSON file on disk.
 */
export function writeManifest(marrDir: string, manifest: Manifest): void {
  fileOps.ensureDir(marrDir);
  const finalPath = manifestPath(marrDir);
  const tmpPath = `${finalPath}.tmp`;
  const content = JSON.stringify(manifest, null, 2) + '\n';
  fileOps.writeFile(tmpPath, content);
  renameSync(tmpPath, finalPath);
}

/**
 * Build a manifest from the standards currently in a directory.
 * Used by `init` (record what was installed) and `update` (record new state).
 */
export function buildManifest(
  standardsDir: string,
  marrVersion: string,
  fileFilter?: (filename: string) => boolean,
): Manifest {
  const files: Record<string, string> = {};
  if (fileOps.exists(standardsDir)) {
    for (const path of fileOps.listFiles(standardsDir, false)) {
      const name = basename(path);
      if (!isStandardFilename(name)) continue;
      if (fileFilter && !fileFilter(name)) continue;
      files[name] = hashFile(path);
    }
  }
  return {
    schema_version: 1,
    marr_version: marrVersion,
    installed_at: new Date().toISOString(),
    files,
  };
}

export interface ManifestDiff {
  /** Local hash == manifest hash == canonical hash. Skip. */
  unchanged: string[];
  /** Local hash == manifest hash, canonical advanced. Silent refresh. */
  modified: string[];
  /** Local hash != manifest hash. User edited. Prompt. */
  drifted: string[];
  /** In canonical, missing from manifest. Available — prompt to install. */
  added: string[];
  /** In manifest, missing from canonical. Prune candidate. */
  orphan: string[];
}

/**
 * Classify every relevant file into one of the 5 buckets.
 *
 * - `manifest` is the recorded baseline (or null = bootstrap).
 * - `localStandardsDir` is the consumer project's standards directory.
 * - `canonicalStandardsDir` is the bundled `resources/project/common`.
 *
 * In bootstrap (manifest is null) we treat the local directory as the
 * subscribed set: files present locally that match canonical are `unchanged`;
 * files present locally that differ from canonical are `drifted`; files in
 * canonical but not locally are `added`. There are no orphans yet.
 */
export function compareManifest(
  manifest: Manifest | null,
  localStandardsDir: string,
  canonicalStandardsDir: string,
): ManifestDiff {
  const diff: ManifestDiff = {
    unchanged: [],
    modified: [],
    drifted: [],
    added: [],
    orphan: [],
  };

  const canonicalFiles = listStandards(canonicalStandardsDir);
  const localFiles = new Set(listStandards(localStandardsDir));

  if (manifest === null) {
    // Bootstrap: subscription = current local files.
    for (const name of canonicalFiles) {
      if (!localFiles.has(name)) {
        diff.added.push(name);
        continue;
      }
      const localHash = hashFile(join(localStandardsDir, name));
      const canonicalHash = hashFile(join(canonicalStandardsDir, name));
      if (localHash === canonicalHash) {
        diff.unchanged.push(name);
      } else {
        diff.drifted.push(name);
      }
    }
    return diff;
  }

  const subscribed = new Set(Object.keys(manifest.files));
  const canonicalSet = new Set(canonicalFiles);

  // Files in subscription: classify as unchanged / modified / drifted.
  for (const name of subscribed) {
    if (!canonicalSet.has(name)) {
      diff.orphan.push(name);
      continue;
    }
    const baselineHash = manifest.files[name];
    const canonicalHash = hashFile(join(canonicalStandardsDir, name));
    const localPath = join(localStandardsDir, name);
    const localHash = localFiles.has(name) ? hashFile(localPath) : null;

    if (localHash === null) {
      // Subscribed file deleted locally — treat as drifted (user removed it).
      diff.drifted.push(name);
    } else if (localHash !== baselineHash) {
      diff.drifted.push(name);
    } else if (baselineHash !== canonicalHash) {
      diff.modified.push(name);
    } else {
      diff.unchanged.push(name);
    }
  }

  // Files in canonical not in subscription: available to add.
  for (const name of canonicalFiles) {
    if (!subscribed.has(name)) {
      diff.added.push(name);
    }
  }

  return diff;
}

function listStandards(dir: string): string[] {
  if (!fileOps.exists(dir)) return [];
  return fileOps
    .listFiles(dir, false)
    .map((p) => basename(p))
    .filter(isStandardFilename);
}
