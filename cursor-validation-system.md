# Cursor Instruction: Complete Validation System
**Repo:** fractalshift/utilitynet-demo  
**Build this FIRST before any feature work.**  
**Every check is real — no stubs.**

---

## How Cursor Uses This System

Build loop for every feature:
```
1. Read FEATURE_REGISTRY.json — confirm feature is PENDING, not LOCKED
2. Build the feature per NORTH_STAR.md
3. Run: node scripts/heal.mjs --feature [feature-id]
4. If exit 0 → LOCKED, move to next feature in tier order
5. If exit 1 → read errors, fix, re-run heal
6. If same error 3x → write BLOCKED.md, stop, wait for human
```

**LOCKED features are never modified for any reason.**  
**New scope → add to NORTH_STAR.md with a tier → add to registry → build in order.**  
**Never implement new scope mid-feature.**

---

## File 1: `demo/FEATURE_REGISTRY.json`

```json
{
  "T1-001-finance-module": {
    "tier": "T1",
    "name": "Finance Module — Full React Implementation",
    "status": "PENDING",
    "validationScript": "scripts/checks/finance-module.mjs",
    "failureCount": 0,
    "lastError": null,
    "lastValidated": null,
    "lockedAt": null
  },
  "T1-002-mock-server": {
    "tier": "T1",
    "name": "Mock Integration Server",
    "status": "PENDING",
    "validationScript": "scripts/checks/mock-server.mjs",
    "failureCount": 0,
    "lastError": null,
    "lastValidated": null,
    "lockedAt": null
  },
  "T1-003-integration-hooks": {
    "tier": "T1",
    "name": "Finance Integration Hooks (all 4)",
    "status": "PENDING",
    "validationScript": "scripts/checks/integration-hooks.mjs",
    "failureCount": 0,
    "lastError": null,
    "lastValidated": null,
    "lockedAt": null
  },
  "T1-004-billing-workflows": {
    "tier": "T1",
    "name": "Billing — Rebill / Reversal / Correction",
    "status": "PENDING",
    "validationScript": "scripts/checks/billing-workflows.mjs",
    "failureCount": 0,
    "lastError": null,
    "lastValidated": null,
    "lockedAt": null
  },
  "T1-005-enrollment-flows": {
    "tier": "T1",
    "name": "Enrollment — Failed Credit + Deposit + Activation Date",
    "status": "PENDING",
    "validationScript": "scripts/checks/enrollment-flows.mjs",
    "failureCount": 0,
    "lastError": null,
    "lastValidated": null,
    "lockedAt": null
  },
  "T1-006-playwright-finance": {
    "tier": "T1",
    "name": "Playwright run-finance.mjs",
    "status": "PENDING",
    "validationScript": "scripts/checks/playwright-finance.mjs",
    "failureCount": 0,
    "lastError": null,
    "lastValidated": null,
    "lockedAt": null
  },
  "T1-007-playwright-enrollment-extended": {
    "tier": "T1",
    "name": "Playwright run-enrollment — credit failure extension",
    "status": "PENDING",
    "validationScript": "scripts/checks/playwright-enrollment.mjs",
    "failureCount": 0,
    "lastError": null,
    "lastValidated": null,
    "lockedAt": null
  },
  "T2-001-coach-rail": {
    "tier": "T2",
    "name": "Coach Rail + Tutorial Mode",
    "status": "PENDING",
    "validationScript": "scripts/checks/coach-rail.mjs",
    "failureCount": 0,
    "lastError": null,
    "lastValidated": null,
    "lockedAt": null
  },
  "T2-002-audio-generation": {
    "tier": "T2",
    "name": "ElevenLabs Audio Generation + Cached Files",
    "status": "PENDING",
    "validationScript": "scripts/checks/audio-files.mjs",
    "failureCount": 0,
    "lastError": null,
    "lastValidated": null,
    "lockedAt": null
  },
  "T2-003-marketers-flows": {
    "tier": "T2",
    "name": "Marketers — Margin, Prudential, Statements",
    "status": "PENDING",
    "validationScript": "scripts/checks/marketers-flows.mjs",
    "failureCount": 0,
    "lastError": null,
    "lastValidated": null,
    "lockedAt": null
  },
  "T2-004-analytics-flows": {
    "tier": "T2",
    "name": "Analytics — Drill-down, Compliance, Ad-hoc",
    "status": "PENDING",
    "validationScript": "scripts/checks/analytics-flows.mjs",
    "failureCount": 0,
    "lastError": null,
    "lastValidated": null,
    "lockedAt": null
  },
  "T2-005-admin-security": {
    "tier": "T2",
    "name": "Admin Security Controls Display",
    "status": "PENDING",
    "validationScript": "scripts/checks/admin-security.mjs",
    "failureCount": 0,
    "lastError": null,
    "lastValidated": null,
    "lockedAt": null
  },
  "T2-006-watchdog-panel": {
    "tier": "T2",
    "name": "Watchdog OS Monitoring Panel",
    "status": "PENDING",
    "validationScript": "scripts/checks/watchdog-panel.mjs",
    "failureCount": 0,
    "lastError": null,
    "lastValidated": null,
    "lockedAt": null
  },
  "T2-007-crm-propagation": {
    "tier": "T2",
    "name": "CRM Change Propagation to Billing + Finance",
    "status": "PENDING",
    "validationScript": "scripts/checks/crm-propagation.mjs",
    "failureCount": 0,
    "lastError": null,
    "lastValidated": null,
    "lockedAt": null
  },
  "T2-008-playwright-marketers-extended": {
    "tier": "T2",
    "name": "Playwright run-marketers — margin + statement extension",
    "status": "PENDING",
    "validationScript": "scripts/checks/playwright-marketers.mjs",
    "failureCount": 0,
    "lastError": null,
    "lastValidated": null,
    "lockedAt": null
  },
  "T2-009-playwright-settlement-extended": {
    "tier": "T2",
    "name": "Playwright run-settlement — scenario switching extension",
    "status": "PENDING",
    "validationScript": "scripts/checks/playwright-settlement.mjs",
    "failureCount": 0,
    "lastError": null,
    "lastValidated": null,
    "lockedAt": null
  },
  "T2-010-playwright-analytics-extended": {
    "tier": "T2",
    "name": "Playwright run-analytics — drill-down extension",
    "status": "PENDING",
    "validationScript": "scripts/checks/playwright-analytics.mjs",
    "failureCount": 0,
    "lastError": null,
    "lastValidated": null,
    "lockedAt": null
  },
  "T3-001-settlement-exception-categories": {
    "tier": "T3",
    "name": "Settlement Exception Categorization",
    "status": "PENDING",
    "validationScript": "scripts/checks/settlement-categories.mjs",
    "failureCount": 0,
    "lastError": null,
    "lastValidated": null,
    "lockedAt": null
  },
  "T3-002-enrollment-thin-file": {
    "tier": "T3",
    "name": "Enrollment — Thin File Scenario",
    "status": "PENDING",
    "validationScript": "scripts/checks/enrollment-thin-file.mjs",
    "failureCount": 0,
    "lastError": null,
    "lastValidated": null,
    "lockedAt": null
  },
  "T3-003-watchdog-feed-down-demo": {
    "tier": "T3",
    "name": "Watchdog Feed-Down Demo Moment",
    "status": "PENDING",
    "validationScript": "scripts/checks/watchdog-feed-down.mjs",
    "failureCount": 0,
    "lastError": null,
    "lastValidated": null,
    "lockedAt": null
  }
}
```

---

## File 2: `demo/scripts/validate.mjs`

```javascript
/**
 * UTILITYnet Demo — Master Validation Runner
 * Usage:
 *   node scripts/validate.mjs                    — all pending
 *   node scripts/validate.mjs --feature [id]     — one feature
 *   node scripts/validate.mjs --tier T1          — all T1
 *   node scripts/validate.mjs --all              — including LOCKED
 * Exit: 0=pass, 1=fail, 2=doom loop
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = path.join(__dirname, '../FEATURE_REGISTRY.json');
const BLOCKED_PATH = path.join(__dirname, '../BLOCKED.md');
const DOOM_LOOP_THRESHOLD = 3;

const args = process.argv.slice(2);
const featureFilter = args.includes('--feature') ? args[args.indexOf('--feature') + 1] : null;
const tierFilter = args.includes('--tier') ? args[args.indexOf('--tier') + 1] : null;
const runAll = args.includes('--all');

function loadRegistry() { return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8')); }
function saveRegistry(r) { fs.writeFileSync(REGISTRY_PATH, JSON.stringify(r, null, 2)); }

async function runCheck(featureId, feature) {
  const checkPath = path.join(__dirname, '../', feature.validationScript);
  if (!fs.existsSync(checkPath)) return { featureId, status: 'SKIP', reason: `Not found: ${feature.validationScript}` };
  try {
    const mod = await import(pathToFileURL(checkPath).href + '?t=' + Date.now());
    if (typeof mod.check !== 'function') return { featureId, status: 'SKIP', reason: 'Missing check() export' };
    const result = await mod.check();
    return { featureId, name: feature.name, tier: feature.tier, status: result.pass ? 'PASS' : 'FAIL', errors: result.errors || [], warnings: result.warnings || [] };
  } catch (err) {
    return { featureId, name: feature.name, tier: feature.tier, status: 'FAIL', errors: [err.message], warnings: [] };
  }
}

function writeBLOCKED(featureId, feature, errorMessage) {
  fs.writeFileSync(BLOCKED_PATH, `# BLOCKED — Human Intervention Required\n\n**Feature:** ${featureId}\n**Name:** ${feature.name}\n**Tier:** ${feature.tier}\n**Failures:** ${feature.failureCount + 1}\n**Time:** ${new Date().toISOString()}\n\n## Repeating Error\n\`\`\`\n${errorMessage}\n\`\`\`\n\n## What To Do\n1. Read the error above and fix the root cause manually\n2. Delete this file\n3. Reset in FEATURE_REGISTRY.json: failureCount → 0, lastError → null\n4. Run: node scripts/heal.mjs --feature ${featureId}\n`);
  console.error(`\n🚨 DOOM LOOP — ${featureId} failed ${feature.failureCount + 1}x with same error. BLOCKED.md written.\n`);
}

async function main() {
  const registry = loadRegistry();
  if (fs.existsSync(BLOCKED_PATH)) { console.error('\n🚨 BLOCKED.md exists — resolve before running validation.\n'); process.exit(2); }

  let features = Object.entries(registry);
  if (featureFilter) features = features.filter(([id]) => id === featureFilter);
  if (tierFilter) features = features.filter(([, f]) => f.tier === tierFilter);
  if (!runAll) features = features.filter(([, f]) => f.status !== 'LOCKED');

  const locked = Object.entries(registry).filter(([, f]) => f.status === 'LOCKED').length;
  console.log(`\n🔍 UTILITYnet Validation — ${features.length} checks · ${locked} locked\n`);

  const results = [];
  for (const [featureId, feature] of features) {
    process.stdout.write(`  [${feature.tier}] ${feature.name} ... `);
    const result = await runCheck(featureId, feature);
    results.push(result);
    if (result.status === 'PASS') {
      console.log('✅ PASS');
      registry[featureId].status = 'VALIDATED'; registry[featureId].failureCount = 0;
      registry[featureId].lastError = null; registry[featureId].lastValidated = new Date().toISOString();
    } else if (result.status === 'SKIP') {
      console.log(`⏭  SKIP — ${result.reason}`);
    } else {
      const errorSummary = result.errors.join(' | ').substring(0, 300);
      console.log('❌ FAIL');
      result.errors.forEach(e => console.log(`     → ${e}`));
      const isSameError = registry[featureId].lastError === errorSummary;
      registry[featureId].failureCount = (registry[featureId].failureCount || 0) + 1;
      registry[featureId].lastError = errorSummary;
      registry[featureId].status = 'FAILED';
      if (isSameError && registry[featureId].failureCount >= DOOM_LOOP_THRESHOLD) {
        writeBLOCKED(featureId, registry[featureId], errorSummary);
        saveRegistry(registry); process.exit(2);
      }
    }
  }

  saveRegistry(registry);
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const skipped = results.filter(r => r.status === 'SKIP').length;
  console.log(`\n─────────────────────────────────\n  ✅ ${passed} passed  ❌ ${failed} failed  ⏭ ${skipped} skipped\n`);
  if (failed > 0) {
    results.filter(r => r.status === 'FAIL').forEach(r => { console.log(`  ❌ [${r.tier}] ${r.name}`); r.errors.slice(0, 3).forEach(e => console.log(`     → ${e}`)); });
    console.log(''); process.exit(1);
  }
  console.log('  All checks passed.\n'); process.exit(0);
}
main().catch(err => { console.error('Validate crashed:', err.message); process.exit(1); });
```

---

## File 3: `demo/scripts/heal.mjs`

```javascript
/**
 * heal.mjs — validates a feature and locks it if passing
 * Usage: node scripts/heal.mjs --feature [feature-id]
 * Exit: 0=locked, 1=still failing, 2=doom loop
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = path.join(__dirname, '../FEATURE_REGISTRY.json');
const BLOCKED_PATH = path.join(__dirname, '../BLOCKED.md');
const args = process.argv.slice(2);
const featureId = args.includes('--feature') ? args[args.indexOf('--feature') + 1] : null;

if (!featureId) { console.error('Usage: node scripts/heal.mjs --feature [feature-id]'); process.exit(1); }
console.log(`\n🔧 Heal: ${featureId}`);

try {
  execSync(`node scripts/validate.mjs --feature ${featureId}`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  if (registry[featureId]) { registry[featureId].status = 'LOCKED'; registry[featureId].lockedAt = new Date().toISOString(); fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2)); }
  console.log(`\n✅ ${featureId} → LOCKED\n`); process.exit(0);
} catch (err) {
  if (err.status === 2) {
    console.error('\n🚨 DOOM LOOP — read BLOCKED.md and wait for human\n');
    if (fs.existsSync(BLOCKED_PATH)) console.error(fs.readFileSync(BLOCKED_PATH, 'utf-8'));
    process.exit(2);
  }
  console.log(`\n⚠️  Still failing. Fix errors above then re-run:\n   node scripts/heal.mjs --feature ${featureId}\n`);
  process.exit(1);
}
```

---

## File 4: All Check Scripts (`demo/scripts/checks/`)

---

### `checks/mock-server.mjs`

```javascript
export async function check() {
  const errors = [];
  const BASE = 'http://localhost:3101';
  try {
    const h = await fetch(`${BASE}/health`);
    const d = await h.json();
    if (!d.ok) errors.push('Health: ok !== true');
  } catch { return { pass: false, errors: ['Mock server not running on :3101 — run: npm run mock'] }; }

  // Scenario status has all 4 services
  try {
    const d = await (await fetch(`${BASE}/scenario/status`)).json();
    for (const s of ['aeso', 'rbc', 'credit', 'altagas']) { if (!d.active?.[s]) errors.push(`Scenario status missing service: ${s}`); }
  } catch (e) { errors.push(`Scenario status: ${e.message}`); }

  // AESO routes
  for (const p of ['/api/mock/aeso/usage', '/api/mock/aeso/price', '/api/mock/aeso/feed-status']) {
    try {
      const r = await fetch(`${BASE}${p}`); if (!r.ok) { errors.push(`AESO ${p} → ${r.status}`); continue; }
      const d = await r.json();
      if (p.includes('usage') && !d.records) errors.push('AESO usage: missing records array');
      if (p.includes('price') && !d.poolPrice) errors.push('AESO price: missing poolPrice');
    } catch (e) { errors.push(`AESO ${p}: ${e.message}`); }
  }

  // RBC routes
  for (const p of ['/api/mock/rbc/balance', '/api/mock/rbc/transactions', '/api/mock/rbc/feed-status']) {
    try {
      const r = await fetch(`${BASE}${p}`); if (!r.ok) { errors.push(`RBC ${p} → ${r.status}`); continue; }
      const d = await r.json();
      if (p.includes('balance') && !d.statementBalance) errors.push('RBC balance: missing statementBalance');
      if (p.includes('transactions') && !d.transactions) errors.push('RBC transactions: missing array');
    } catch (e) { errors.push(`RBC ${p}: ${e.message}`); }
  }

  // Credit check — default pass
  try {
    const d = await (await fetch(`${BASE}/api/mock/credit/check`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ applicantName: 'Test', postalCode: 'T5A 0A1' }) })).json();
    if (d.status !== 'APPROVED') errors.push(`Credit default: expected APPROVED, got ${d.status}`);
  } catch (e) { errors.push(`Credit check: ${e.message}`); }

  // credit-fail scenario
  try {
    await fetch(`${BASE}/scenario/credit-fail`, { method: 'POST' });
    const d = await (await fetch(`${BASE}/api/mock/credit/check`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ applicantName: 'Test' }) })).json();
    if (d.status !== 'DECLINED') errors.push(`credit-fail: expected DECLINED got ${d.status}`);
    if (!d.depositRequired) errors.push('credit-fail: depositRequired should be true');
    await fetch(`${BASE}/scenario/credit-pass`, { method: 'POST' });
  } catch (e) { errors.push(`credit-fail scenario: ${e.message}`); }

  // AltaGas invoice
  try {
    const d = await (await fetch(`${BASE}/api/mock/altagas/invoice`)).json();
    if (!d.lineItems) errors.push('AltaGas invoice: missing lineItems');
  } catch (e) { errors.push(`AltaGas: ${e.message}`); }

  // altagas-variance
  try {
    await fetch(`${BASE}/scenario/altagas-variance`, { method: 'POST' });
    const d = await (await fetch(`${BASE}/api/mock/altagas/invoice`)).json();
    if (d.variance !== 1640) errors.push(`altagas-variance: expected variance=1640, got ${d.variance}`);
    await fetch(`${BASE}/scenario/altagas-clean`, { method: 'POST' });
  } catch (e) { errors.push(`altagas-variance: ${e.message}`); }

  // aeso-variance
  try {
    await fetch(`${BASE}/scenario/aeso-variance`, { method: 'POST' });
    const d = await (await fetch(`${BASE}/api/mock/aeso/usage`)).json();
    if (!d.records?.some(r => r.flags?.includes('USAGE_SPIKE'))) errors.push('aeso-variance: no USAGE_SPIKE flag found');
    await fetch(`${BASE}/scenario/aeso-happy`, { method: 'POST' });
  } catch (e) { errors.push(`aeso-variance: ${e.message}`); }

  // Watchdog aggregated
  try {
    const d = await (await fetch(`${BASE}/api/mock/watchdog/feeds`)).json();
    if (!Array.isArray(d.feeds) || d.feeds.length !== 4) errors.push(`Watchdog: expected 4 feeds, got ${d.feeds?.length}`);
    if (typeof d.alertCount !== 'number') errors.push('Watchdog: missing alertCount');
  } catch (e) { errors.push(`Watchdog: ${e.message}`); }

  // RBC payment
  try {
    const d = await (await fetch(`${BASE}/api/mock/rbc/payment`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ payeeId: 'test', amount: 1000, description: 'test' }) })).json();
    if (!d.confirmationNumber) errors.push('RBC payment: missing confirmationNumber');
  } catch (e) { errors.push(`RBC payment: ${e.message}`); }

  // AltaGas dispute
  try {
    const d = await (await fetch(`${BASE}/api/mock/altagas/dispute`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ invoiceNumber: 'ALTA-001', reason: 'test' }) })).json();
    if (!d.disputeId) errors.push('AltaGas dispute: missing disputeId');
  } catch (e) { errors.push(`AltaGas dispute: ${e.message}`); }

  // Reset all
  try {
    const d = await (await fetch(`${BASE}/scenario/reset/all`, { method: 'POST' })).json();
    if (!d.ok) errors.push('Reset all: failed');
  } catch (e) { errors.push(`Reset all: ${e.message}`); }

  return { pass: errors.length === 0, errors };
}
```

---

### `checks/finance-module.mjs`

```javascript
import { chromium } from 'playwright';

async function go(url = 'http://localhost:5173') {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
  try {
    const m = page.locator('[data-demo="api-key-modal"], [data-demo="api-key-dismiss"]');
    if (await m.first().isVisible({ timeout: 2000 })) { await m.first().click(); await page.waitForTimeout(400); }
  } catch {}
  return { browser, page };
}

export async function check() {
  const errors = [];
  let browser;
  try {
    ({ browser, page: p } = await go());
    var p = p;
    if (!await p.locator('[data-demo="nav-finance"]').isVisible({ timeout: 3000 }).catch(() => false))
      return { pass: false, errors: ['Finance nav missing: add data-demo="nav-finance" to sidebar'] };
    await p.locator('[data-demo="nav-finance"]').click(); await p.waitForTimeout(800);

    for (const v of ['$2.34M', '$184,200', '$1.21M', '$1.82M'])
      if (!await p.locator(`text=${v}`).first().isVisible({ timeout: 2000 }).catch(() => false)) errors.push(`KPI missing: ${v}`);

    for (const t of ['February 2026 month-end reconciliation complete', 'March 2026 month-end target'])
      if (!await p.locator(`text=${t}`).isVisible({ timeout: 2000 }).catch(() => false)) errors.push(`Alert missing: ${t}`);

    for (const tab of ['General Ledger', 'Accounts Receivable', 'Accounts Payable', 'Reconciliation'])
      if (!await p.locator(`text=${tab}`).first().isVisible({ timeout: 2000 }).catch(() => false)) errors.push(`Tab missing: ${tab}`);

    if (!await p.locator('[data-demo="finance-gl-table"]').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('GL table: data-demo="finance-gl-table" missing');
    for (const a of ['Energy Revenue', 'Marketer Commissions Payable', 'Accounts Receivable', 'AESO Settlement Payable', 'Operating Cash — RBC', 'Hedge Risk Reserve'])
      if (!await p.locator(`text=${a}`).first().isVisible({ timeout: 2000 }).catch(() => false)) errors.push(`GL account missing: ${a}`);
    for (const b of ['btn-post-journal', 'btn-export-gl', 'btn-audit-log'])
      if (!await p.locator(`[data-demo="${b}"]`).isVisible({ timeout: 2000 }).catch(() => false)) errors.push(`GL button missing: ${b}`);

    // AR tab
    await p.locator('text=Accounts Receivable').first().click(); await p.waitForTimeout(400);
    if (!await p.locator('[data-demo="finance-ar-table"]').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('AR table missing');
    for (const n of ['Sunrise Industrial Ltd.', 'Northern Oilsands Corp.'])
      if (!await p.locator(`text=${n}`).first().isVisible({ timeout: 1000 }).catch(() => false)) errors.push(`AR row missing: ${n}`);

    // AP tab + approve
    await p.locator('text=Accounts Payable').first().click(); await p.waitForTimeout(400);
    if (!await p.locator('[data-demo="finance-ap-table"]').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('AP table missing');
    const approveBtn = p.locator('[data-demo="btn-approve-ap"]').first();
    if (!await approveBtn.isVisible({ timeout: 2000 }).catch(() => false)) { errors.push('AP approve button missing'); }
    else {
      await approveBtn.click(); await p.waitForTimeout(1000);
      if (!await p.locator('text=Approved').first().isVisible({ timeout: 2000 }).catch(() => false)) errors.push('AP approve: row status did not update');
    }

    // Reconciliation tab
    await p.locator('text=Reconciliation').first().click(); await p.waitForTimeout(400);
    if (!await p.locator('[data-demo="finance-bank-recon"]').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Bank recon card missing');
    if (!await p.locator('[data-demo="finance-month-end-checklist"]').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Month-end checklist missing');
    if (!await p.locator('text=balanced — no variance').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Bank recon: "balanced — no variance" not found');
    if (!await p.locator('text=Emberlyn Assist').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Emberlyn Assist button missing');
  } catch (err) { errors.push(`Playwright: ${err.message}`); } finally { await browser?.close(); }
  return { pass: errors.length === 0, errors };
}
```

---

### `checks/integration-hooks.mjs`

```javascript
import { chromium } from 'playwright';

async function go() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
  try { const m = page.locator('[data-demo="api-key-modal"], [data-demo="api-key-dismiss"]'); if (await m.first().isVisible({ timeout: 2000 })) { await m.first().click(); await page.waitForTimeout(400); } } catch {}
  return { browser, page };
}

export async function check() {
  const errors = [];
  let browser, p;
  try {
    ({ browser, page: p } = await go());

    // Hook 1 — Billing → Finance
    await p.locator('[data-demo="nav-billing"]').click().catch(() => errors.push('Billing nav missing'));
    await p.waitForTimeout(600);
    if (!await p.locator('[data-demo="btn-post-billing-to-gl"]').isVisible({ timeout: 3000 }).catch(() => false)) {
      errors.push('Hook 1: btn-post-billing-to-gl missing in Billing');
    } else {
      await p.locator('[data-demo="btn-post-billing-to-gl"]').click(); await p.waitForTimeout(2000);
      if (!await p.locator('text=JE-2026-0089').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Hook 1: JE-2026-0089 not in toast');
      if (!await p.locator('text=Posted to GL').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Hook 1: button did not disable to "Posted to GL"');
    }

    // Hook 2 — Settlement → Finance
    await p.locator('[data-demo="nav-settlement"]').click().catch(() => errors.push('Settlement nav missing'));
    await p.waitForTimeout(600);
    if (!await p.locator('[data-demo="btn-send-settlement-to-finance"]').isVisible({ timeout: 3000 }).catch(() => false)) {
      errors.push('Hook 2: btn-send-settlement-to-finance missing');
    } else {
      await p.locator('[data-demo="btn-send-settlement-to-finance"]').click(); await p.waitForTimeout(2000);
      if (!await p.locator('text=JE-2026-0091').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Hook 2: JE-2026-0091 not in toast');
    }

    // Hook 3 — Marketers → Finance
    await p.locator('[data-demo="nav-marketers"]').click().catch(() => errors.push('Marketers nav missing'));
    await p.waitForTimeout(600);
    if (!await p.locator('[data-demo="btn-post-commissions-to-gl"]').isVisible({ timeout: 3000 }).catch(() => false)) {
      errors.push('Hook 3: btn-post-commissions-to-gl missing');
    } else {
      await p.locator('[data-demo="btn-post-commissions-to-gl"]').click(); await p.waitForTimeout(2000);
      if (!await p.locator('text=JE-2026-0088').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Hook 3: JE-2026-0088 not in toast');
    }

    // Hook 4 — CRM elements
    await p.locator('[data-demo="nav-customers"]').click().catch(() => errors.push('Customers nav missing'));
    await p.waitForTimeout(600);
    if (!await p.locator('[data-demo="crm-billing-link"]').isVisible({ timeout: 3000 }).catch(() => false)) errors.push('Hook 4: crm-billing-link missing');

    // Finance GL should show Updated pills after hooks fired
    await p.locator('[data-demo="nav-finance"]').click().catch(() => {}); await p.waitForTimeout(600);
    if (!await p.locator('text=Updated').first().isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Finance GL: no Updated pills after integration hooks posted');

    // Marketer journal entries table
    await p.locator('[data-demo="nav-marketers"]').click().catch(() => {}); await p.waitForTimeout(600);
    if (!await p.locator('[data-demo="marketer-journal-entries-table"]').isVisible({ timeout: 3000 }).catch(() => false)) errors.push('marketer-journal-entries-table missing');
  } catch (err) { errors.push(`Playwright: ${err.message}`); } finally { await browser?.close(); }
  return { pass: errors.length === 0, errors };
}
```

---

### `checks/billing-workflows.mjs`

```javascript
import { chromium } from 'playwright';

export async function check() {
  const errors = [];
  let browser, p;
  try {
    browser = await chromium.launch({ headless: true });
    p = await browser.newPage();
    await p.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
    try { const m = p.locator('[data-demo="api-key-modal"], [data-demo="api-key-dismiss"]'); if (await m.first().isVisible({ timeout: 2000 })) { await m.first().click(); await p.waitForTimeout(400); } } catch {}
    await p.locator('[data-demo="nav-billing"]').click().catch(() => errors.push('Billing nav missing'));
    await p.waitForTimeout(600);

    // Rebill
    if (!await p.locator('[data-demo^="btn-rebill-"]').first().isVisible({ timeout: 3000 }).catch(() => false)) {
      errors.push('Rebill button missing — seed invoice with status "Dispute Resolved"');
    } else {
      await p.locator('[data-demo^="btn-rebill-"]').first().click(); await p.waitForTimeout(500);
      if (!await p.locator('text=Rebill').first().isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Rebill modal did not open');
      await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    }

    // Reversal
    let revVisible = await p.locator('[data-demo="btn-reverse-invoice"]').first().isVisible({ timeout: 1000 }).catch(() => false);
    if (!revVisible) {
      const ov = p.locator('[data-demo^="btn-overflow-"]').first();
      if (await ov.isVisible({ timeout: 1000 }).catch(() => false)) { await ov.click(); await p.waitForTimeout(300); revVisible = await p.locator('[data-demo="btn-reverse-invoice"]').first().isVisible({ timeout: 1000 }).catch(() => false); }
    }
    if (!revVisible) { errors.push('Reverse invoice button missing'); }
    else {
      await p.locator('[data-demo="btn-reverse-invoice"]').first().click(); await p.waitForTimeout(400);
      if (!await p.locator('text=Confirm Reversal').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Reversal modal did not open');
      await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    }

    // Correct & Repost
    if (!await p.locator('[data-demo="btn-correct-repost"]').first().isVisible({ timeout: 3000 }).catch(() => false)) {
      errors.push('Correct & Repost button missing in exceptions queue');
    } else {
      await p.locator('[data-demo="btn-correct-repost"]').first().click(); await p.waitForTimeout(400);
      if (!await p.locator('text=Corrected Usage').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Correct & Repost: "Corrected Usage" field not shown');
      await p.keyboard.press('Escape');
    }
  } catch (err) { errors.push(`Playwright: ${err.message}`); } finally { await browser?.close(); }
  return { pass: errors.length === 0, errors };
}
```

---

### `checks/enrollment-flows.mjs`

```javascript
import { chromium } from 'playwright';

export async function check() {
  const errors = [];
  let browser, p;
  try {
    browser = await chromium.launch({ headless: true });
    p = await browser.newPage();
    await p.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
    try { const m = p.locator('[data-demo="api-key-modal"], [data-demo="api-key-dismiss"]'); if (await m.first().isVisible({ timeout: 2000 })) { await m.first().click(); await p.waitForTimeout(400); } } catch {}
    await p.locator('[data-demo="nav-customers"]').click().catch(() => errors.push('Customers nav missing'));
    await p.waitForTimeout(600);

    const startBtn = p.locator('[data-demo="enrollment-start-btn"]');
    if (!await startBtn.isVisible({ timeout: 3000 }).catch(() => false)) { errors.push('enrollment-start-btn missing'); }
    else {
      await startBtn.click(); await p.waitForTimeout(600);

      if (!await p.locator('[data-demo="activation-date-field"]').isVisible({ timeout: 3000 }).catch(() => false)) errors.push('activation-date-field missing');

      const toggle = p.locator('[data-demo="toggle-failed-credit"]');
      if (!await toggle.isVisible({ timeout: 3000 }).catch(() => false)) {
        errors.push('toggle-failed-credit missing');
      } else {
        await toggle.click(); await p.waitForTimeout(400);
        const submit = p.locator('[data-demo="enrollment-submit-btn"], button:has-text("Submit"), button:has-text("Run Credit Check")').first();
        if (await submit.isVisible({ timeout: 1000 }).catch(() => false)) { await submit.click(); await p.waitForTimeout(1500); }
        if (!await p.locator('[data-demo="credit-failed-state"], text=492').first().isVisible({ timeout: 3000 }).catch(() => false)) errors.push('Failed credit state not shown (credit-failed-state or score 492)');
        if (!await p.locator('[data-demo="btn-require-deposit"]').isVisible({ timeout: 2000 }).catch(() => false)) { errors.push('btn-require-deposit missing'); }
        else {
          await p.locator('[data-demo="btn-require-deposit"]').click(); await p.waitForTimeout(400);
          if (!await p.locator('[data-demo="btn-mark-deposit-received"]').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('btn-mark-deposit-received missing');
        }
        if (!await p.locator('[data-demo="btn-reject-enrollment"]').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('btn-reject-enrollment missing');
        if (!await p.locator('[data-demo="btn-manual-override"]').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('btn-manual-override missing');
      }
    }
  } catch (err) { errors.push(`Playwright: ${err.message}`); } finally { await browser?.close(); }
  return { pass: errors.length === 0, errors };
}
```

---

### `checks/playwright-finance.mjs`

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  const errors = [];
  const scriptPath = path.join(__dirname, '../../scripts/run-finance.mjs');
  const runAllPath = path.join(__dirname, '../../scripts/run-all.mjs');
  const runnerPath = path.join(__dirname, '../../scripts/demo-runner.mjs');

  if (!fs.existsSync(scriptPath)) return { pass: false, errors: ['run-finance.mjs not found'] };
  const c = fs.readFileSync(scriptPath, 'utf-8');

  for (const t of ['nav-finance', 'finance-tab-gl', 'finance-tab-ar', 'finance-tab-ap', 'finance-tab-recon', 'btn-approve-ap'])
    if (!c.includes(t)) errors.push(`run-finance.mjs missing: ${t}`);
  if (!c.includes('showStatus')) errors.push('run-finance.mjs: missing showStatus');
  if (!c.includes('showScenarioSummary')) errors.push('run-finance.mjs: missing showScenarioSummary');
  if (!c.includes('scrollReadEmberlynResponse')) errors.push('run-finance.mjs: missing Emberlyn interaction');
  if (!c.includes('Finance Module')) errors.push('run-finance.mjs: missing scenario summary text');

  if (fs.existsSync(runAllPath)) {
    const ac = fs.readFileSync(runAllPath, 'utf-8');
    if (!ac.includes('run-finance')) errors.push("run-all.mjs: doesn't import run-finance");
    const fp = ac.indexOf("'finance'"), ep = ac.indexOf("'enrollment'");
    if (fp === -1) errors.push("run-all.mjs: 'finance' missing from SCENARIOS");
    if (fp !== -1 && ep !== -1 && fp > ep) errors.push("run-all.mjs: 'finance' must be before 'enrollment'");
  }

  if (fs.existsSync(runnerPath)) {
    const rc = fs.readFileSync(runnerPath, 'utf-8');
    if (!rc.includes('setMockScenario')) errors.push('demo-runner.mjs: missing setMockScenario export');
    if (!rc.includes('localhost:3101')) errors.push('demo-runner.mjs: setMockScenario not using localhost:3101');
  }

  try { execSync(`node --check ${scriptPath}`, { stdio: 'pipe', timeout: 5000 }); }
  catch (e) { errors.push(`Syntax error: ${(e.stderr?.toString() || e.message).substring(0, 200)}`); }

  return { pass: errors.length === 0, errors };
}
```

---

### `checks/playwright-enrollment.mjs`

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  const errors = [];
  const ep = path.join(__dirname, '../../scripts/run-enrollment.mjs');
  const rp = path.join(__dirname, '../../scripts/demo-runner.mjs');

  if (!fs.existsSync(ep)) return { pass: false, errors: ['run-enrollment.mjs not found'] };
  const ec = fs.readFileSync(ep, 'utf-8');
  const rc = fs.existsSync(rp) ? fs.readFileSync(rp, 'utf-8') : '';

  if (!ec.includes('credit-fail')) errors.push('Missing: credit-fail scenario');
  if (!ec.includes('credit-pass')) errors.push('Missing: credit-pass reset');
  if (!ec.includes('setMockScenario')) errors.push('Missing: setMockScenario calls');
  if (!ec.includes('toggle-failed-credit')) errors.push('Missing: toggle-failed-credit target');
  if (!ec.includes('btn-require-deposit')) errors.push('Missing: btn-require-deposit target');
  if (!ec.includes('activation-date')) errors.push('Missing: activation-date target');
  if (!rc.includes('setMockScenario')) errors.push('demo-runner.mjs: missing setMockScenario export');

  try { execSync(`node --check ${ep}`, { stdio: 'pipe', timeout: 5000 }); }
  catch (e) { errors.push(`Syntax: ${(e.stderr?.toString() || e.message).substring(0, 200)}`); }

  return { pass: errors.length === 0, errors };
}
```

---

### `checks/coach-rail.mjs`

```javascript
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  const errors = [];

  // File existence
  for (const f of ['src/components/CoachRail.jsx', 'src/components/CoachRail.css', 'src/components/TutorialModeToggle.jsx', 'src/hooks/useTutorialAudio.js', 'src/hooks/useTutorialHighlight.js', 'src/data/tutorial-scenarios.js'])
    if (!fs.existsSync(path.join(__dirname, '../../', f))) errors.push(`Missing: ${f}`);

  // tutorial-scenarios.js contents
  const sp = path.join(__dirname, '../../src/data/tutorial-scenarios.js');
  if (fs.existsSync(sp)) {
    const sc = fs.readFileSync(sp, 'utf-8');
    for (const id of ['enrollment', 'marketers', 'billing', 'settlement', 'finance', 'analytics'])
      if (!sc.includes(`id: '${id}'`)) errors.push(`tutorial-scenarios.js: missing scenario '${id}'`);
    for (const exp of ['TUTORIAL_SCENARIOS', 'findScenarioByPhrase', 'audioPath'])
      if (!sc.includes(exp)) errors.push(`tutorial-scenarios.js: missing export '${exp}'`);
  }

  // AppStore has tutorial state
  const asp = path.join(__dirname, '../../src/store/AppStore.jsx');
  if (fs.existsSync(asp)) {
    const ac = fs.readFileSync(asp, 'utf-8');
    for (const s of ['tutorialMode', 'startTutorial', 'endTutorial', 'advanceStep', 'pauseTutorial', 'resumeTutorial'])
      if (!ac.includes(s)) errors.push(`AppStore.jsx: missing '${s}'`);
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const p = await browser.newPage();
    await p.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
    try { const m = p.locator('[data-demo="api-key-modal"], [data-demo="api-key-dismiss"]'); if (await m.first().isVisible({ timeout: 2000 })) { await m.first().click(); await p.waitForTimeout(400); } } catch {}

    // CoachRail NOT visible on load
    if (await p.locator('[data-demo="coach-rail"]').isVisible({ timeout: 1000 }).catch(() => false)) errors.push('CoachRail visible on initial load — should only show in tutorial mode');

    // Scenario panel at ?scenarios=1
    await p.goto('http://localhost:5173?scenarios=1', { waitUntil: 'networkidle' });
    try { const m = p.locator('[data-demo="api-key-modal"], [data-demo="api-key-dismiss"]'); if (await m.first().isVisible({ timeout: 2000 })) { await m.first().click(); await p.waitForTimeout(400); } } catch {}
    if (!await p.locator('[data-demo="scenario-panel"]').isVisible({ timeout: 3000 }).catch(() => false)) errors.push('ScenarioPanel not visible at ?scenarios=1');
    for (const s of ['scenario-btn-aeso-happy', 'scenario-btn-aeso-down', 'scenario-btn-credit-fail', 'scenario-btn-altagas-variance'])
      if (!await p.locator(`[data-demo="${s}"]`).isVisible({ timeout: 1000 }).catch(() => false)) errors.push(`ScenarioPanel button missing: ${s}`);

    // Tutorial trigger via Emberlyn
    await p.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    try { const m = p.locator('[data-demo="api-key-modal"], [data-demo="api-key-dismiss"]'); if (await m.first().isVisible({ timeout: 2000 })) { await m.first().click(); await p.waitForTimeout(400); } } catch {}

    const embBtn = p.locator('button:has-text("Emberlyn"), [data-demo^="btn-emberlyn"]').first();
    if (await embBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await embBtn.click(); await p.waitForTimeout(500);
      const input = p.locator('[data-demo="emberlyn-input"], textarea[placeholder], input[placeholder*="Ask"]').first();
      if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
        await input.fill('walk me through the finance gl scenario');
        await input.press('Enter');
        await p.waitForTimeout(5000);
        if (!await p.locator('[data-demo="coach-rail"]').isVisible({ timeout: 5000 }).catch(() => false)) errors.push('CoachRail did not appear after tutorial trigger phrase');
        else {
          if (!await p.locator('[data-demo="coach-step-list"]').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('coach-step-list missing');
          if (!await p.locator('[data-demo="coach-end-btn"]').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('coach-end-btn missing');
          if (!await p.locator('[data-demo="tutorial-toggle"]').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('tutorial-toggle not in navbar during tutorial mode');
          if (!await p.locator('text=TUTORIAL MODE, text=Tutorial Mode').first().isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Tutorial mode badge missing in navbar');
          await p.locator('[data-demo="coach-end-btn"]').click(); await p.waitForTimeout(500);
          if (await p.locator('[data-demo="coach-rail"]').isVisible({ timeout: 1000 }).catch(() => false)) errors.push('CoachRail still visible after end tutorial');
        }
      } else { errors.push('Emberlyn input not found — cannot test tutorial trigger'); }
    } else { errors.push('Emberlyn button not found — cannot test tutorial trigger'); }

    // useTutorialHighlight — verify gold outline appears on tutorial step target
    // Re-trigger tutorial and check for highlight class
    const embBtn2 = p.locator('button:has-text("Emberlyn"), [data-demo^="btn-emberlyn"]').first();
    if (await embBtn2.isVisible({ timeout: 2000 }).catch(() => false)) {
      await embBtn2.click(); await p.waitForTimeout(300);
      const input2 = p.locator('[data-demo="emberlyn-input"], textarea[placeholder], input[placeholder*="Ask"]').first();
      if (await input2.isVisible({ timeout: 1000 }).catch(() => false)) {
        await input2.fill('finance tutorial'); await input2.press('Enter');
        await p.waitForTimeout(5000);
        const highlighted = await p.evaluate(() => !!document.querySelector('.tutorial-highlight'));
        if (!highlighted) errors.push('useTutorialHighlight: no .tutorial-highlight element found on active step');
      }
    }
  } catch (err) { errors.push(`Playwright: ${err.message}`); } finally { await browser?.close(); }
  return { pass: errors.length === 0, errors };
}
```

---

### `checks/audio-files.mjs`

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SCENARIOS = { enrollment: 6, marketers: 5, billing: 6, settlement: 5, finance: 5, analytics: 4 };

export async function check() {
  const errors = [];
  const warnings = [];
  const audioBase = path.join(__dirname, '../../public/audio');

  if (!fs.existsSync(path.join(__dirname, '../../scripts/generate-audio.mjs')))
    errors.push('generate-audio.mjs not found at scripts/generate-audio.mjs');

  if (!fs.existsSync(audioBase)) {
    errors.push('public/audio/ directory not found — run: npm run gen-audio');
    return { pass: false, errors };
  }

  let found = 0, expected = 0;
  for (const [id, count] of Object.entries(SCENARIOS)) {
    const dir = path.join(audioBase, id);
    if (!fs.existsSync(dir)) { errors.push(`Missing audio dir: public/audio/${id}`); expected += count; continue; }
    for (let i = 1; i <= count; i++) {
      expected++;
      const file = path.join(dir, `${id}-${i}.mp3`);
      if (!fs.existsSync(file)) errors.push(`Missing: public/audio/${id}/${id}-${i}.mp3`);
      else if (fs.statSync(file).size < 1000) errors.push(`Too small (corrupt?): public/audio/${id}/${id}-${i}.mp3`);
      else found++;
    }
  }

  // Check not gitignored
  const gi = path.join(__dirname, '../../.gitignore');
  if (fs.existsSync(gi)) {
    const c = fs.readFileSync(gi, 'utf-8');
    if (c.includes('public/audio') || c.includes('/audio')) errors.push('.gitignore includes public/audio — remove it so audio files are committed for offline demo');
  }

  if (found > 0 && found < expected) warnings.push(`${found}/${expected} audio files present`);
  return { pass: errors.length === 0, errors, warnings };
}
```

---

### `checks/marketers-flows.mjs`

```javascript
import { chromium } from 'playwright';

export async function check() {
  const errors = [];
  let browser, p;
  try {
    browser = await chromium.launch({ headless: true });
    p = await browser.newPage();
    await p.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
    try { const m = p.locator('[data-demo="api-key-modal"], [data-demo="api-key-dismiss"]'); if (await m.first().isVisible({ timeout: 2000 })) { await m.first().click(); await p.waitForTimeout(400); } } catch {}
    await p.locator('[data-demo="nav-marketers"]').click().catch(() => errors.push('Marketers nav missing'));
    await p.waitForTimeout(600);

    // Margin input + auto-calc
    const marginInput = p.locator('[data-demo="marketer-margin-input"]');
    if (!await marginInput.isVisible({ timeout: 3000 }).catch(() => false)) { errors.push('marketer-margin-input missing'); }
    else {
      await marginInput.fill('1.00'); await p.waitForTimeout(300);
      if (!await p.locator('text=5.82').isVisible({ timeout: 1000 }).catch(() => false)) errors.push('Customer rate not recalculating (expected $5.82 = $4.82 + $1.00)');
      await marginInput.fill('0.85');
    }
    if (!await p.locator('[data-demo="btn-save-margin"]').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('btn-save-margin missing');
    else {
      await p.locator('[data-demo="btn-save-margin"]').click(); await p.waitForTimeout(500);
      if (!await p.locator('text=Margin updated').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('"Margin updated" toast not shown');
    }

    // Prudential
    if (!await p.locator('[data-demo="btn-cash-call-reminder"]').isVisible({ timeout: 3000 }).catch(() => false)) errors.push('btn-cash-call-reminder missing');
    if (!await p.locator('text=$420,000').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Prudential required amount $420,000 not found');
    if (!await p.locator('text=$40,000').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Prudential shortfall $40,000 not found');

    // Statement
    if (!await p.locator('[data-demo="btn-generate-statement"]').isVisible({ timeout: 3000 }).catch(() => false)) { errors.push('btn-generate-statement missing'); }
    else {
      await p.locator('[data-demo="btn-generate-statement"]').click(); await p.waitForTimeout(600);
      if (!await p.locator('text=847').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Statement: customer count 847 not shown');
      if (!await p.locator('text=$13,520').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Statement: net to marketer $13,520 not shown');
      if (!await p.locator('[data-demo="btn-post-commissions-to-gl"]').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Statement: Approve & Post to Finance button missing');
    }

    if (!await p.locator('[data-demo="marketer-journal-entries-table"]').isVisible({ timeout: 3000 }).catch(() => false)) errors.push('marketer-journal-entries-table missing');
  } catch (err) { errors.push(`Playwright: ${err.message}`); } finally { await browser?.close(); }
  return { pass: errors.length === 0, errors };
}
```

---

### `checks/analytics-flows.mjs`

```javascript
import { chromium } from 'playwright';

export async function check() {
  const errors = [];
  let browser, p;
  try {
    browser = await chromium.launch({ headless: true });
    p = await browser.newPage();
    await p.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
    try { const m = p.locator('[data-demo="api-key-modal"], [data-demo="api-key-dismiss"]'); if (await m.first().isVisible({ timeout: 2000 })) { await m.first().click(); await p.waitForTimeout(400); } } catch {}
    await p.locator('[data-demo="nav-analytics"]').click().catch(() => errors.push('Analytics nav missing'));
    await p.waitForTimeout(800);

    // Drill-down
    if (!await p.locator('[data-demo="analytics-drill-revenue"]').isVisible({ timeout: 3000 }).catch(() => false)) { errors.push('analytics-drill-revenue missing'); }
    else {
      await p.locator('[data-demo="analytics-drill-revenue"]').click(); await p.waitForTimeout(500);
      if (!await p.locator('[data-demo="analytics-drill-account"]').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('analytics-drill-account not shown after clicking revenue drill');
    }

    // GL export
    if (!await p.locator('[data-demo="btn-analytics-export-gl"]').isVisible({ timeout: 3000 }).catch(() => false)) { errors.push('btn-analytics-export-gl missing'); }
    else {
      await p.locator('[data-demo="btn-analytics-export-gl"]').click(); await p.waitForTimeout(500);
      if (!await p.locator('text=matches GL account 4000').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('GL export toast missing "matches GL account 4000"');
    }

    // Compliance tab
    const complianceTab = p.locator('text=Compliance').first();
    if (!await complianceTab.isVisible({ timeout: 3000 }).catch(() => false)) { errors.push('Compliance tab missing'); }
    else {
      await complianceTab.click(); await p.waitForTimeout(400);
      if (!await p.locator('[data-demo="compliance-report-table"]').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('compliance-report-table missing');
      for (const r of ['AUC', 'AESO', 'PIPEDA']) if (!await p.locator(`text=${r}`).first().isVisible({ timeout: 1000 }).catch(() => false)) errors.push(`Compliance table missing: ${r}`);
      if (!await p.locator('[data-demo="btn-generate-compliance-report"]').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('btn-generate-compliance-report missing');
    }

    // Ad-hoc tab
    const adhocTab = p.locator('text=Ad-Hoc, text=Ad hoc').first();
    if (!await adhocTab.isVisible({ timeout: 3000 }).catch(() => false)) { errors.push('Ad-Hoc tab missing'); }
    else {
      await adhocTab.click(); await p.waitForTimeout(400);
      if (!await p.locator('[data-demo="btn-run-adhoc-report"]').isVisible({ timeout: 2000 }).catch(() => false)) { errors.push('btn-run-adhoc-report missing'); }
      else {
        await p.locator('[data-demo="btn-run-adhoc-report"]').click(); await p.waitForTimeout(500);
        if (!await p.locator('table, [data-demo="adhoc-results"]').first().isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Ad-hoc report: no results table after run');
      }
    }
  } catch (err) { errors.push(`Playwright: ${err.message}`); } finally { await browser?.close(); }
  return { pass: errors.length === 0, errors };
}
```

---

### `checks/admin-security.mjs`

```javascript
import { chromium } from 'playwright';

export async function check() {
  const errors = [];
  let browser, p;
  try {
    browser = await chromium.launch({ headless: true });
    p = await browser.newPage();
    await p.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
    try { const m = p.locator('[data-demo="api-key-modal"], [data-demo="api-key-dismiss"]'); if (await m.first().isVisible({ timeout: 2000 })) { await m.first().click(); await p.waitForTimeout(400); } } catch {}
    await p.locator('[data-demo="nav-admin"]').click().catch(() => errors.push('Admin nav missing: data-demo="nav-admin"'));
    await p.waitForTimeout(600);

    const cards = [
      { demo: 'security-auth-card', texts: ['Azure AD', 'MFA', '100%'] },
      { demo: 'security-rto-rpo-card', texts: ['RTO', 'RPO', '4 hours', '1 hour'] },
      { demo: 'security-compliance-card', texts: ['SOC 2', 'PIPEDA', 'NIST', '72 hours', 'ca-central-1'] },
      { demo: 'security-sla-table', texts: ['P1', 'P2', 'P3', 'P4', '15 min', '4 hours'] },
    ];
    for (const card of cards) {
      if (!await p.locator(`[data-demo="${card.demo}"]`).isVisible({ timeout: 3000 }).catch(() => false)) { errors.push(`${card.demo} missing`); continue; }
      for (const t of card.texts) if (!await p.locator(`text=${t}`).first().isVisible({ timeout: 1000 }).catch(() => false)) errors.push(`${card.demo}: missing "${t}"`);
    }
  } catch (err) { errors.push(`Playwright: ${err.message}`); } finally { await browser?.close(); }
  return { pass: errors.length === 0, errors };
}
```

---

### `checks/watchdog-panel.mjs`

```javascript
import { chromium } from 'playwright';

export async function check() {
  const errors = [];
  let browser, p;
  try {
    browser = await chromium.launch({ headless: true });
    p = await browser.newPage();
    await p.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
    try { const m = p.locator('[data-demo="api-key-modal"], [data-demo="api-key-dismiss"]'); if (await m.first().isVisible({ timeout: 2000 })) { await m.first().click(); await p.waitForTimeout(400); } } catch {}
    await p.locator('[data-demo="nav-admin"]').click().catch(() => errors.push('Admin nav missing'));
    await p.waitForTimeout(600);
    const sht = p.locator('text=System Health, text=Watchdog').first();
    if (await sht.isVisible({ timeout: 2000 }).catch(() => false)) { await sht.click(); await p.waitForTimeout(400); }

    if (!await p.locator('[data-demo="watchdog-feed-health"]').isVisible({ timeout: 3000 }).catch(() => false)) { errors.push('watchdog-feed-health missing'); }
    else { for (const f of ['AESO', 'RBC', 'AltaGas']) if (!await p.locator(`text=${f}`).first().isVisible({ timeout: 1000 }).catch(() => false)) errors.push(`Feed health: "${f}" not shown`); }

    if (!await p.locator('[data-demo="watchdog-job-queue"]').isVisible({ timeout: 3000 }).catch(() => false)) { errors.push('watchdog-job-queue missing'); }
    else { for (const j of ['Billing Batch', 'Settlement', 'GL Posting']) if (!await p.locator(`text=${j}`).first().isVisible({ timeout: 1000 }).catch(() => false)) errors.push(`Job queue: "${j}" not shown`); }

    if (!await p.locator('[data-demo="watchdog-anomaly-feed"]').isVisible({ timeout: 3000 }).catch(() => false)) errors.push('watchdog-anomaly-feed missing');

    // Live poll test — switch to ?scenarios=1 and trigger aeso-down
    await p.goto('http://localhost:5173?scenarios=1', { waitUntil: 'networkidle' });
    try { const m = p.locator('[data-demo="api-key-modal"], [data-demo="api-key-dismiss"]'); if (await m.first().isVisible({ timeout: 2000 })) { await m.first().click(); await p.waitForTimeout(400); } } catch {}
    await p.locator('[data-demo="nav-admin"]').click().catch(() => {});
    await p.waitForTimeout(400);
    if (await sht.isVisible({ timeout: 1000 }).catch(() => false)) { await sht.click(); await p.waitForTimeout(400); }

    const downBtn = p.locator('[data-demo="scenario-btn-aeso-down"]');
    if (await downBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await downBtn.click();
      await p.waitForTimeout(32000); // wait for 30s poll cycle
      if (!await p.locator('text=DOWN').isVisible({ timeout: 3000 }).catch(() => false)) errors.push('Watchdog: AESO status did not update to DOWN after 30s poll');
      await p.locator('[data-demo="scenario-btn-aeso-happy"]').click().catch(() => {});
    } else { errors.push('ScenarioPanel scenario-btn-aeso-down not found — cannot test live polling'); }
  } catch (err) { errors.push(`Playwright: ${err.message}`); } finally { await browser?.close(); }
  return { pass: errors.length === 0, errors };
}
```

---

### `checks/crm-propagation.mjs`

```javascript
import { chromium } from 'playwright';

export async function check() {
  const errors = [];
  let browser, p;
  try {
    browser = await chromium.launch({ headless: true });
    p = await browser.newPage();
    await p.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
    try { const m = p.locator('[data-demo="api-key-modal"], [data-demo="api-key-dismiss"]'); if (await m.first().isVisible({ timeout: 2000 })) { await m.first().click(); await p.waitForTimeout(400); } } catch {}
    await p.locator('[data-demo="nav-customers"]').click().catch(() => errors.push('Customers nav missing'));
    await p.waitForTimeout(600);

    if (!await p.locator('[data-demo="crm-billing-link"]').isVisible({ timeout: 3000 }).catch(() => false)) { errors.push('crm-billing-link missing'); }
    else {
      await p.locator('[data-demo="crm-billing-link"]').first().click(); await p.waitForTimeout(1000);
      if (!await p.locator('[data-demo="crm-propagation-confirmation"], text=CM-2026-0041').first().isVisible({ timeout: 3000 }).catch(() => false)) errors.push('CRM propagation: confirmation block or CM-2026-0041 not shown');
      if (!await p.locator('text=JE-2026-0092').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('CRM propagation: GL entry JE-2026-0092 not shown');
      if (!await p.locator('text=account 1100').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('CRM propagation: AR account 1100 reference missing');
    }

    // Finance AR should show pending/updated state
    await p.locator('[data-demo="nav-finance"]').click().catch(() => {}); await p.waitForTimeout(600);
    await p.locator('text=Accounts Receivable').first().click().catch(() => {}); await p.waitForTimeout(400);
    if (!await p.locator('text=Pending, text=Updated').first().isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Finance AR: no Pending/Updated state after CRM propagation');
  } catch (err) { errors.push(`Playwright: ${err.message}`); } finally { await browser?.close(); }
  return { pass: errors.length === 0, errors };
}
```

---

### `checks/playwright-marketers.mjs`

```javascript
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url'; import { execSync } from 'child_process';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export async function check() {
  const errors = [];
  const sp = path.join(__dirname, '../../scripts/run-marketers.mjs');
  if (!fs.existsSync(sp)) return { pass: false, errors: ['run-marketers.mjs not found'] };
  const c = fs.readFileSync(sp, 'utf-8');
  for (const t of ['btn-save-margin', 'btn-generate-statement', 'btn-post-commissions-to-gl', 'marketer-margin-input', 'btn-cash-call-reminder'])
    if (!c.includes(t)) errors.push(`Missing: ${t}`);
  if (!c.includes('setMockScenario')) errors.push('Missing: setMockScenario');
  try { execSync(`node --check ${sp}`, { stdio: 'pipe', timeout: 5000 }); } catch (e) { errors.push(`Syntax: ${(e.stderr?.toString() || e.message).substring(0, 200)}`); }
  return { pass: errors.length === 0, errors };
}
```

---

### `checks/playwright-settlement.mjs`

```javascript
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url'; import { execSync } from 'child_process';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export async function check() {
  const errors = [];
  const sp = path.join(__dirname, '../../scripts/run-settlement.mjs');
  if (!fs.existsSync(sp)) return { pass: false, errors: ['run-settlement.mjs not found'] };
  const c = fs.readFileSync(sp, 'utf-8');
  if (!c.includes('altagas-variance')) errors.push('Missing: altagas-variance scenario switch');
  if (!c.includes('altagas-clean')) errors.push('Missing: altagas-clean reset');
  if (!c.includes('setMockScenario')) errors.push('Missing: setMockScenario');
  if (!c.includes('btn-send-settlement-to-finance')) errors.push('Missing: btn-send-settlement-to-finance target');
  try { execSync(`node --check ${sp}`, { stdio: 'pipe', timeout: 5000 }); } catch (e) { errors.push(`Syntax: ${(e.stderr?.toString() || e.message).substring(0, 200)}`); }
  return { pass: errors.length === 0, errors };
}
```

---

### `checks/playwright-analytics.mjs`

```javascript
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url'; import { execSync } from 'child_process';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export async function check() {
  const errors = [];
  const sp = path.join(__dirname, '../../scripts/run-analytics.mjs');
  if (!fs.existsSync(sp)) return { pass: false, errors: ['run-analytics.mjs not found'] };
  const c = fs.readFileSync(sp, 'utf-8');
  for (const t of ['analytics-drill-revenue', 'btn-analytics-export-gl', 'btn-run-adhoc-report', 'compliance-report-table'])
    if (!c.includes(t)) errors.push(`Missing: ${t}`);
  try { execSync(`node --check ${sp}`, { stdio: 'pipe', timeout: 5000 }); } catch (e) { errors.push(`Syntax: ${(e.stderr?.toString() || e.message).substring(0, 200)}`); }
  return { pass: errors.length === 0, errors };
}
```

---

### `checks/settlement-categories.mjs`

```javascript
import { chromium } from 'playwright';
export async function check() {
  const errors = [];
  let browser, p;
  try {
    browser = await chromium.launch({ headless: true });
    p = await browser.newPage();
    await p.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
    try { const m = p.locator('[data-demo="api-key-modal"], [data-demo="api-key-dismiss"]'); if (await m.first().isVisible({ timeout: 2000 })) { await m.first().click(); await p.waitForTimeout(400); } } catch {}
    await p.locator('[data-demo="nav-settlement"]').click().catch(() => errors.push('Settlement nav missing'));
    await p.waitForTimeout(600);
    if (!await p.locator('[data-demo="settlement-exception-filter"]').isVisible({ timeout: 3000 }).catch(() => false)) errors.push('settlement-exception-filter missing');
    if (!await p.locator('text=Volume Variance').first().isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Volume Variance badge not visible');
    for (const cat of ['Rate Dispute', 'Missing Data', 'Timing']) if (!await p.locator(`text=${cat}`).first().isVisible({ timeout: 1000 }).catch(() => false)) errors.push(`Filter option missing: ${cat}`);
  } catch (err) { errors.push(`Playwright: ${err.message}`); } finally { await browser?.close(); }
  return { pass: errors.length === 0, errors };
}
```

---

### `checks/enrollment-thin-file.mjs`

```javascript
import { chromium } from 'playwright';
export async function check() {
  const errors = [];
  let browser, p;
  try {
    browser = await chromium.launch({ headless: true });
    p = await browser.newPage();
    await p.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
    try { const m = p.locator('[data-demo="api-key-modal"], [data-demo="api-key-dismiss"]'); if (await m.first().isVisible({ timeout: 2000 })) { await m.first().click(); await p.waitForTimeout(400); } } catch {}
    await p.locator('[data-demo="nav-customers"]').click().catch(() => {}); await p.waitForTimeout(600);
    const sb = p.locator('[data-demo="enrollment-start-btn"]');
    if (await sb.isVisible({ timeout: 2000 }).catch(() => false)) { await sb.click(); await p.waitForTimeout(400); }
    if (!await p.locator('[data-demo="toggle-thin-file"]').isVisible({ timeout: 3000 }).catch(() => false)) errors.push('toggle-thin-file missing');
    else {
      await p.locator('[data-demo="toggle-thin-file"]').click(); await p.waitForTimeout(400);
      const submit = p.locator('[data-demo="enrollment-submit-btn"], button:has-text("Submit"), button:has-text("Run Credit Check")').first();
      if (await submit.isVisible({ timeout: 1000 }).catch(() => false)) { await submit.click(); await p.waitForTimeout(1500); }
      if (!await p.locator('text=CONDITIONAL, text=No File, text=Thin').first().isVisible({ timeout: 3000 }).catch(() => false)) errors.push('Thin file: CONDITIONAL/No File status not shown');
      if (!await p.locator('text=$150').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Thin file: $150 deposit amount not shown');
    }
  } catch (err) { errors.push(`Playwright: ${err.message}`); } finally { await browser?.close(); }
  return { pass: errors.length === 0, errors };
}
```

---

### `checks/watchdog-feed-down.mjs`

```javascript
export async function check() {
  const errors = [];
  const BASE = 'http://localhost:3101';
  try {
    await fetch(`${BASE}/scenario/aeso-down`, { method: 'POST' });
    const d = await (await fetch(`${BASE}/api/mock/aeso/feed-status`)).json();
    if (d.status !== 'DOWN') errors.push(`aeso-down: expected DOWN, got ${d.status}`);
    if (d.connected !== false) errors.push('aeso-down: connected should be false');
    await fetch(`${BASE}/scenario/aeso-happy`, { method: 'POST' });
    const d2 = await (await fetch(`${BASE}/api/mock/aeso/feed-status`)).json();
    if (d2.status !== 'LIVE') errors.push(`After reset: expected LIVE, got ${d2.status}`);
  } catch (e) { errors.push(`Mock server not running or scenario broken: ${e.message}`); }
  return { pass: errors.length === 0, errors };
}
```

---

## File 5: `demo/package.json` — Add Scripts and Dependencies

Add to `scripts`:
```json
"mock": "node mock-server.mjs",
"dev:full": "concurrently \"npm run mock\" \"npm run dev\"",
"validate": "node scripts/validate.mjs",
"validate:t1": "node scripts/validate.mjs --tier T1",
"validate:t2": "node scripts/validate.mjs --tier T2",
"validate:t3": "node scripts/validate.mjs --tier T3",
"validate:all": "node scripts/validate.mjs --all",
"gen-audio": "node scripts/generate-audio.mjs"
```

Add to `devDependencies`:
```json
"express": "^4.18.0",
"cors": "^2.8.5",
"concurrently": "^8.2.0"
```

---

## Critical Rules

- **AppStore = React Context + useReducer. No Zustand. Ever.**
- **Do not touch auto-heal.mjs.**
- **Do not modify LOCKED features.**
- **Both servers must be running during Playwright checks: `npm run dev:full`**
- **New scope mid-session: finish current feature → add to NORTH_STAR.md + registry → build in order.**
- **BLOCKED.md = stop completely. Show contents to user. Wait.**

---

## Build Order

```
VALIDATION SYSTEM FIRST (this file)
  → node scripts/validate.mjs   (all SKIP expected — no app running yet)

T1:
  1. T1-002  mock-server.mjs, integrations.js, vite proxy, ScenarioPanel
  2. T1-001  Finance.jsx full implementation  
  3. T1-003  All 4 integration hooks
  4. T1-004  Billing rebill/reversal/correction
  5. T1-005  Enrollment failed-credit + deposit + activation
  6. T1-006  run-finance.mjs + run-all.mjs + setMockScenario helper
  7. T1-007  run-enrollment.mjs credit-fail extension

T2 (all T1 LOCKED first):
  8.  T2-001  Coach Rail + Tutorial Mode
  9.  T2-002  generate-audio.mjs + npm run gen-audio
  10. T2-003  Marketers flows
  11. T2-004  Analytics flows
  12. T2-005  Admin security cards
  13. T2-006  Watchdog panel
  14. T2-007  CRM propagation
  15. T2-008  run-marketers.mjs extension
  16. T2-009  run-settlement.mjs scenario switching
  17. T2-010  run-analytics.mjs drill-down extension

T3 (all T2 LOCKED first):
  18. T3-001  Settlement exception categorization
  19. T3-002  Enrollment thin file
  20. T3-003  Watchdog feed-down demo moment
```

---

*UTILITYnet Demo · Complete Validation System · FractalShift × Gnar · March 2026*
