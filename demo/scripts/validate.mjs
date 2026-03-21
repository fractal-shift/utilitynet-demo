/**
 * UTILITYnet Demo — Master Validation Runner
 *
 * Usage:
 *   node scripts/validate.mjs                          — run all checks
 *   node scripts/validate.mjs --feature [feature-id]  — run one feature check
 *   node scripts/validate.mjs --tier T1               — run all T1 checks
 *
 * Exit codes:
 *   0 — all checks passed
 *   1 — one or more checks failed
 *   2 — doom loop detected (BLOCKED.md written)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = path.join(__dirname, '../FEATURE_REGISTRY.json');
const BLOCKED_PATH = path.join(__dirname, '../BLOCKED.md');
const DOOM_LOOP_THRESHOLD = 3;

// ── Parse args ────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const featureFilter = args.includes('--feature') ? args[args.indexOf('--feature') + 1] : null;
const tierFilter = args.includes('--tier') ? args[args.indexOf('--tier') + 1] : null;

// ── Load registry ─────────────────────────────────────────────────────
function loadRegistry() {
  return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
}

function saveRegistry(registry) {
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
}

// ── Run a single check ────────────────────────────────────────────────
async function runCheck(featureId, feature) {
  const checkPath = path.join(__dirname, '..', feature.validationScript);

  if (!fs.existsSync(checkPath)) {
    return {
      featureId,
      status: 'SKIP',
      reason: `Check script not found: ${feature.validationScript}`,
    };
  }

  try {
    const mod = await import(pathToFileURL(checkPath).href);
    if (typeof mod.check !== 'function') {
      return { featureId, status: 'SKIP', reason: 'Check script missing exported check() function' };
    }

    const result = await mod.check();
    // result must be: { pass: boolean, errors?: string[], warnings?: string[] }

    return {
      featureId,
      name: feature.name,
      tier: feature.tier,
      status: result.pass ? 'PASS' : 'FAIL',
      errors: result.errors || [],
      warnings: result.warnings || [],
    };
  } catch (err) {
    return {
      featureId,
      name: feature.name,
      tier: feature.tier,
      status: 'FAIL',
      errors: [err.message],
      warnings: [],
    };
  }
}

// ── Doom loop detection ───────────────────────────────────────────────
function checkDoomLoop(registry, featureId, errorMessage) {
  const feature = registry[featureId];
  const isSameError = feature.lastError && feature.lastError === errorMessage;
  if (isSameError && feature.failureCount >= DOOM_LOOP_THRESHOLD) {
    return true;
  }
  return false;
}

function writeBlockedFile(featureId, feature, errorMessage) {
  const content = `# BLOCKED — Human Intervention Required

**Feature:** ${featureId}  
**Name:** ${feature.name}  
**Tier:** ${feature.tier}  
**Failure count:** ${feature.failureCount + 1}  
**Timestamp:** ${new Date().toISOString()}  

## Repeating Error

\`\`\`
${errorMessage}
\`\`\`

## What Happened

This feature has failed validation ${feature.failureCount + 1} times with the same error.
Cursor has stopped attempting to fix this to avoid a doom loop.

## What Cursor Tried

See git history for attempted fixes on this feature.

## What Needs Human Decision

Cursor cannot resolve this automatically. The error above requires one of:
1. A design decision that changes the approach
2. A dependency that isn't installed or configured
3. A conflict with an existing LOCKED feature
4. An environment issue (missing env var, wrong Node version, etc.)

## How to Unblock

1. Investigate the error above
2. Make a decision or fix the root cause manually
3. Delete this file
4. Update FEATURE_REGISTRY.json: set failureCount to 0, lastError to null
5. Run: node scripts/validate.mjs --feature ${featureId}

**Do not delete this file without resolving the underlying issue.**
`;
  fs.writeFileSync(BLOCKED_PATH, content);
  console.error(`\n🚨 DOOM LOOP DETECTED — ${featureId}`);
  console.error(`   Same error after ${feature.failureCount + 1} attempts.`);
  console.error(`   BLOCKED.md written. Human intervention required.`);
  console.error(`   Error: ${errorMessage}\n`);
}

// ── Main ──────────────────────────────────────────────────────────────
async function main() {
  const registry = loadRegistry();

  // Check for existing BLOCKED.md — stop if present
  if (fs.existsSync(BLOCKED_PATH)) {
    console.error('\n🚨 BLOCKED.md exists — resolve it before running validation.');
    console.error('   Read BLOCKED.md for instructions.\n');
    process.exit(2);
  }

  // Select features to validate
  let features = Object.entries(registry);
  if (featureFilter) {
    features = features.filter(([id]) => id === featureFilter);
    if (features.length === 0) {
      console.error(`Feature not found: ${featureFilter}`);
      process.exit(1);
    }
  }
  if (tierFilter) {
    features = features.filter(([, f]) => f.tier === tierFilter);
  }

  // Skip LOCKED features (they are done — never revalidate unless explicitly requested)
  const toRun = features.filter(([, f]) => f.status !== 'LOCKED');
  const locked = features.filter(([, f]) => f.status === 'LOCKED');

  console.log(`\n🔍 UTILITYnet Demo — Validation Run`);
  console.log(`   Running: ${toRun.length} checks · Locked (skip): ${locked.length}\n`);

  const results = [];
  let doomLoopDetected = false;

  for (const [featureId, feature] of toRun) {
    process.stdout.write(`  [${feature.tier}] ${feature.name} ... `);
    const result = await runCheck(featureId, feature);
    results.push(result);

    if (result.status === 'PASS') {
      console.log('✅ PASS');
      registry[featureId].status = 'VALIDATED';
      registry[featureId].failureCount = 0;
      registry[featureId].lastError = null;
      registry[featureId].lastValidated = new Date().toISOString();
    } else if (result.status === 'SKIP') {
      console.log(`⏭  SKIP — ${result.reason}`);
    } else {
      const errorSummary = result.errors.join(' | ').substring(0, 200);
      console.log(`❌ FAIL`);
      result.errors.forEach(e => console.log(`     → ${e}`));

      // Doom loop check
      if (checkDoomLoop(registry, featureId, errorSummary)) {
        writeBlockedFile(featureId, feature, errorSummary);
        doomLoopDetected = true;
        registry[featureId].failureCount += 1;
        saveRegistry(registry);
        process.exit(2);
      }

      // Update failure tracking
      registry[featureId].status = 'FAILED';
      registry[featureId].failureCount = (registry[featureId].failureCount || 0) + 1;
      registry[featureId].lastError = errorSummary;
    }
  }

  saveRegistry(registry);

  // Summary
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const skipped = results.filter(r => r.status === 'SKIP').length;

  console.log(`\n─────────────────────────────────────────`);
  console.log(`  Results: ${passed} passed · ${failed} failed · ${skipped} skipped`);
  if (locked.length > 0) {
    console.log(`  Locked (not re-run): ${locked.length}`);
  }

  if (failed > 0) {
    console.log(`\n  Failed features:`);
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`    ❌ [${r.tier}] ${r.name}`);
      r.errors.slice(0, 2).forEach(e => console.log(`       → ${e}`));
    });
    console.log('');
    process.exit(1);
  }

  console.log(`\n  ✅ All checks passed.\n`);
  process.exit(0);
}

main().catch(err => {
  console.error('Validate runner crashed:', err.message);
  process.exit(1);
});
