/**
 * Zod schema for MARR project manifest (`.claude/marr/.marr-version.json`).
 *
 * The manifest records the SHA-256 hash of every standard MARR has installed
 * into a project. It is the source of truth for `marr update`'s drift
 * detection and for distinguishing user-edited files from canonical
 * advancement.
 */

import { z } from 'zod';

const SHA256_HEX = z.string().regex(/^[0-9a-f]{64}$/, 'must be 64-char lowercase hex');
const SEMVER = z.string().regex(/^\d+\.\d+\.\d+(?:[-+].+)?$/, 'must be a semver string');
const ISO_TIMESTAMP = z.string().datetime({ offset: true }).or(z.string().datetime());

export const ManifestSchema = z.object({
  schema_version: z.literal(1),
  marr_version: SEMVER,
  installed_at: ISO_TIMESTAMP,
  files: z.record(z.string().min(1), SHA256_HEX),
});

export type Manifest = z.infer<typeof ManifestSchema>;

export const MANIFEST_FILENAME = '.marr-version.json';
