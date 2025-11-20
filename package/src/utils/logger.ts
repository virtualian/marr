/**
 * Logger utility for colored terminal output
 * Provides consistent, readable output for CLI commands
 */

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
} as const;

/**
 * Print error message in red
 */
export function error(message: string): void {
  console.error(`${colors.red}✗ ERROR: ${message}${colors.reset}`);
}

/**
 * Print success message in green
 */
export function success(message: string): void {
  console.log(`${colors.green}✓ ${message}${colors.reset}`);
}

/**
 * Print info message in blue
 */
export function info(message: string): void {
  console.log(`${colors.blue}${message}${colors.reset}`);
}

/**
 * Print warning message in yellow
 */
export function warning(message: string): void {
  console.log(`${colors.yellow}⚠ WARNING: ${message}${colors.reset}`);
}

/**
 * Print debug message in gray
 */
export function debug(message: string): void {
  console.log(`${colors.gray}[DEBUG] ${message}${colors.reset}`);
}

/**
 * Print section header in cyan
 */
export function section(message: string): void {
  console.log(`\n${colors.cyan}${message}${colors.reset}`);
}

/**
 * Print plain message without color
 */
export function log(message: string): void {
  console.log(message);
}

/**
 * Print blank line
 */
export function blank(): void {
  console.log();
}
