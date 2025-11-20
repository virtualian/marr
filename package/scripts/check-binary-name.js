#!/usr/bin/env node

/**
 * Validates that the binary name is correct before publishing.
 *
 * This script ensures the binary name is 'marr' before publishing to npm.
 *
 * Usage: Called automatically by npm's prepublishOnly hook
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

const REQUIRED_BIN_NAME = 'marr';
const binName = Object.keys(packageJson.bin)[0];

if (binName !== REQUIRED_BIN_NAME) {
  console.error('\n❌ ERROR: Unexpected binary name!\n');
  console.error(`Current binary name: "${binName}"`);
  console.error(`Expected: "${REQUIRED_BIN_NAME}"\n`);
  console.error('Please ensure package.json has:');
  console.error('  "bin": {');
  console.error(`    "${REQUIRED_BIN_NAME}": "./dist/index.js"`);
  console.error('  }\n');
  process.exit(1);
}

console.log(`✅ Binary name check passed: "${binName}"`);
