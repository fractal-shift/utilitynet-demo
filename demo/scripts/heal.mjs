/**
 * heal.mjs — Self-healing wrapper
 *
 * Cursor runs this after a build step to validate and trigger fix iteration.
 * Usage: node scripts/heal.mjs --feature [feature-id]
 *
 * Exit codes:
 *   0 — feature validated and LOCKED
 *   1 — feature still failing (Cursor should inspect output and try again)
 *   2 — doom loop detected — stop, read BLOCKED.md, wait for human
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOCKED_PATH = path.join(__dirname, '../BLOCKED.md');

const args = process.argv.slice(2);
const featureId = args.includes('--feature') ? args[args.indexOf('--feature') + 1] : null;

if (!featureId) {
  console.error('Usage: node scripts/heal.mjs --feature [feature-id]');
  process.exit(1);
}

console.log(`\n🔧 Heal — running validation for: ${featureId}`);

try {
  execSync(`node scripts/validate.mjs --feature ${featureId}`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
  });
  // Exit 0 — passed
  console.log(`\n✅ ${featureId} — VALIDATED. Marking LOCKED in registry.`);

  // Mark LOCKED
  const registryPath = path.join(__dirname, '../FEATURE_REGISTRY.json');
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  if (registry[featureId]) {
    registry[featureId].status = 'LOCKED';
    registry[featureId].lockedAt = new Date().toISOString();
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
    console.log(`   Registry updated: ${featureId} → LOCKED\n`);
  }
  process.exit(0);

} catch (err) {
  if (err.status === 2) {
    // Doom loop
    console.error('\n🚨 DOOM LOOP — Cursor must stop and wait for human.');
    console.error('   Read BLOCKED.md for context.\n');
    process.exit(2);
  }
  // Validation failed (exit 1) — Cursor should read output and attempt fix
  console.log(`\n⚠️  ${featureId} — Still failing. Cursor: read the errors above and attempt a fix.`);
  console.log(`   Then run: node scripts/heal.mjs --feature ${featureId}\n`);
  process.exit(1);
}
