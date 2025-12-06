/**
 * Conflict detection types for MARR integration
 *
 * Used by validate (detection) and doctor (resolution) commands
 */

/** Severity levels for detected conflicts */
export type ConflictSeverity = 'error' | 'warning';

/** Categories of conflicts that can be detected */
export type ConflictCategory =
  | 'directive_conflict'    // User directive contradicts MARR
  | 'duplicate_standard'    // User has own version of a MARR standard
  | 'missing_import'        // CLAUDE.md exists but no MARR import
  | 'override_after_import'; // User explicitly overrides MARR after import

/** A detected conflict between user config and MARR standards */
export interface Conflict {
  /** Unique identifier for this conflict */
  id: string;

  /** Conflict category */
  category: ConflictCategory;

  /** Severity level */
  severity: ConflictSeverity;

  /** File where conflict was found */
  location: string;

  /** Line number if applicable */
  line?: number;

  /** What the user currently has */
  existing: string;

  /** What MARR standard says (if applicable) */
  marrExpects?: string;

  /** Source standard file (if applicable) */
  marrSource?: string;

  /** Human-readable description of the conflict */
  description: string;

  /** Possible resolutions */
  resolutions: Resolution[];
}

/** A possible resolution for a conflict */
export interface Resolution {
  /** Short label for the resolution */
  label: string;

  /** Key to select this resolution (e.g., 'k' for keep) */
  key: string;

  /** Description of what this resolution does */
  description: string;

  /** Whether this is the recommended resolution */
  recommended?: boolean;
}

/** Result of running conflict detection */
export interface ConflictReport {
  /** When the report was generated */
  timestamp: string;

  /** Scope that was checked */
  scope: 'user' | 'project' | 'both';

  /** Total files scanned */
  filesScanned: number;

  /** Detected conflicts */
  conflicts: Conflict[];

  /** Summary counts */
  summary: {
    errors: number;
    warnings: number;
    total: number;
  };
}

/** Action taken to resolve a conflict */
export interface ResolutionAction {
  /** The conflict that was resolved */
  conflictId: string;

  /** Which resolution was chosen */
  resolution: string;

  /** Backup file created (if any) */
  backupPath?: string;

  /** Whether the action succeeded */
  success: boolean;

  /** Error message if failed */
  error?: string;
}

/** Summary of doctor command actions */
export interface DoctorSummary {
  /** When doctor was run */
  timestamp: string;

  /** Total conflicts found */
  conflictsFound: number;

  /** Actions taken */
  actions: ResolutionAction[];

  /** Summary counts */
  summary: {
    resolved: number;
    skipped: number;
    failed: number;
  };
}
