/**
 * Zod schema for MARR standard frontmatter
 *
 * Defines the structure and validation rules for standard file frontmatter.
 * This is the single source of truth for frontmatter validation.
 *
 * Triggers are natural language descriptions of situations where the standard
 * applies. They should be semantic and broad - it's better to trigger a standard
 * than miss it. Multiple standards can be triggered for the same task.
 */

import { z } from 'zod';

// Triggers are simple strings - natural language descriptions of when to apply
// Examples:
//   - "Creating or modifying documentation"
//   - "Working with tests or test coverage"
//   - "Making git commits or pull requests"
export const TriggerSchema = z.string().min(1);

// Main frontmatter schema for MARR standards
export const StandardFrontmatterSchema = z.object({
  marr: z.literal('standard'),
  version: z.number().int().positive(),
  title: z.string().min(1),
  scope: z.string().min(1),
  triggers: z.array(TriggerSchema).min(1),
});

// Type inference from schemas
export type Trigger = z.infer<typeof TriggerSchema>;
export type StandardFrontmatter = z.infer<typeof StandardFrontmatterSchema>;

// Helper to format trigger for display (now just returns the string)
export function formatTrigger(trigger: Trigger): string {
  return trigger;
}
