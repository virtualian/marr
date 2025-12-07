/**
 * Project Registry - Track MARR-configured projects for sync
 *
 * Stores a list of project paths in ~/.claude/marr/projects.json
 * Used by `marr sync` to discover source and target projects.
 */

import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import * as fileOps from './file-ops.js';

interface ProjectRegistry {
  projects: string[];
}

const REGISTRY_FILE = 'projects.json';

/**
 * Get path to the registry file
 */
export function getRegistryPath(): string {
  return join(fileOps.getMarrRoot(), REGISTRY_FILE);
}

/**
 * Load the project registry, creating empty one if it doesn't exist
 */
export function loadRegistry(): ProjectRegistry {
  const registryPath = getRegistryPath();

  if (!existsSync(registryPath)) {
    return { projects: [] };
  }

  try {
    const content = readFileSync(registryPath, 'utf8');
    const data = JSON.parse(content) as ProjectRegistry;

    // Validate structure
    if (!Array.isArray(data.projects)) {
      return { projects: [] };
    }

    return data;
  } catch {
    return { projects: [] };
  }
}

/**
 * Save the project registry
 */
export function saveRegistry(registry: ProjectRegistry): void {
  const registryPath = getRegistryPath();
  fileOps.ensureDir(fileOps.getMarrRoot());
  writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n', 'utf8');
}

/**
 * Check if a path is a MARR-configured project
 */
export function isMarrProject(projectPath: string): boolean {
  const marrConfigPath = join(projectPath, '.claude', 'marr', 'MARR-PROJECT-CLAUDE.md');
  return existsSync(marrConfigPath);
}

/**
 * Register a project in the registry
 * Returns true if newly added, false if already registered
 */
export function registerProject(projectPath: string): boolean {
  const registry = loadRegistry();
  const normalizedPath = projectPath.replace(/\/$/, ''); // Remove trailing slash

  if (registry.projects.includes(normalizedPath)) {
    return false;
  }

  registry.projects.push(normalizedPath);
  registry.projects.sort(); // Keep sorted for consistent ordering
  saveRegistry(registry);
  return true;
}

/**
 * Unregister a project from the registry
 * Returns true if removed, false if wasn't registered
 */
export function unregisterProject(projectPath: string): boolean {
  const registry = loadRegistry();
  const normalizedPath = projectPath.replace(/\/$/, '');

  const index = registry.projects.indexOf(normalizedPath);
  if (index === -1) {
    return false;
  }

  registry.projects.splice(index, 1);
  saveRegistry(registry);
  return true;
}

/**
 * List all registered projects
 */
export function listProjects(): string[] {
  const registry = loadRegistry();
  return registry.projects;
}

/**
 * List registered projects that still exist and have MARR config
 * Useful for filtering out deleted/moved projects
 */
export function listValidProjects(): string[] {
  const registry = loadRegistry();
  return registry.projects.filter(isMarrProject);
}

/**
 * Clean up registry by removing projects that no longer exist or have MARR config
 * Returns list of removed paths
 */
export function cleanRegistry(): string[] {
  const registry = loadRegistry();
  const validProjects = registry.projects.filter(isMarrProject);
  const removed = registry.projects.filter((p) => !validProjects.includes(p));

  if (removed.length > 0) {
    saveRegistry({ projects: validProjects });
  }

  return removed;
}
