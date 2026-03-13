#!/usr/bin/env node
/**
 * Auto-heal: run demo scenario, on failure ask Claude for fixes, apply, re-run.
 * Usage: node auto-heal.mjs [scenario]
 * Scenarios: enrollment | customer-service | billing | settlement | analytics | all
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { requestFixes } from './heal-agent.mjs';
import { applyEdit } from './apply-edits.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCRIPTS_DIR = __dirname;
const FAILURE_FILE = join(SCRIPTS_DIR, '.last-failure.json');
const MAX_ITERATIONS = parseInt(process.env.DEMO_MAX_ITERATIONS || '5', 10);
const DRY_RUN = process.env.DEMO_HEAL_DRY_RUN === '1';

const SCENARIO_SCRIPT = {
  dashboard: 'run-dashboard.mjs',
  enrollment: 'run-enrollment.mjs',
  'customer-service': 'run-customer-service.mjs',
  billing: 'run-billing.mjs',
  settlement: 'run-settlement.mjs',
  marketers: 'run-marketers.mjs',
  analytics: 'run-analytics.mjs',
  complex: 'run-complex.mjs',
};

function runScenario(scenario) {
  return new Promise((resolve, reject) => {
    const script = SCENARIO_SCRIPT[scenario] || scenario;
    const scriptPath = script.endsWith('.mjs') ? script : SCENARIO_SCRIPT[script] || `${script}.mjs`;
    const child = spawn('node', [join(SCRIPTS_DIR, scriptPath)], {
      stdio: 'pipe',
      env: { ...process.env },
    });

    let stderr = '';
    child.stderr.on('data', (d) => { stderr += d.toString(); });
    child.stdout.on('data', (d) => { process.stdout.write(d); });

    child.on('close', (code) => {
      if (code === 0) resolve({ success: true });
      else {
        const failure = existsSync(FAILURE_FILE)
          ? JSON.parse(readFileSync(FAILURE_FILE, 'utf8'))
          : { scenario, stepLabel: 'unknown', selector: '', error: stderr || `Exit ${code}` };
        resolve({ success: false, failure });
      }
    });
    child.on('error', reject);
  });
}

async function main() {
  const scenario = process.argv[2] || 'enrollment';
  if (scenario === 'all') {
    for (const s of Object.keys(SCENARIO_SCRIPT)) {
      await mainWithScenario(s);
    }
    return;
  }
  await mainWithScenario(scenario);
}

async function mainWithScenario(scenario) {
  if (!SCENARIO_SCRIPT[scenario]) {
    console.error(`Unknown scenario: ${scenario}. Use: enrollment, customer-service, billing, settlement, analytics, all`);
    process.exit(1);
  }

  console.log(`[auto-heal] Scenario: ${scenario}, max iterations: ${MAX_ITERATIONS}`);

  for (let i = 1; i <= MAX_ITERATIONS; i++) {
    console.log(`[auto-heal] Iteration ${i}: Running...`);
    const result = await runScenario(scenario);

    if (result.success) {
      console.log(`[auto-heal] Iteration ${i}: SUCCESS`);
      console.log(`[auto-heal] Demo passed after ${i} iteration(s).`);
      return;
    }

    const { failure } = result;
    console.log(`[auto-heal] Iteration ${i}: FAILED at step - ${failure.stepLabel}`);
    console.log(`[auto-heal] Error: ${failure.error}`);

    if (i === MAX_ITERATIONS) {
      console.log(`[auto-heal] Max iterations reached. Exiting.`);
      process.exit(1);
    }

    console.log(`[auto-heal] Requesting fixes from Claude...`);
    let edits;
    try {
      const resp = await requestFixes(failure);
      edits = resp.edits || [];
    } catch (err) {
      console.error(`[auto-heal] Claude request failed:`, err.message);
      process.exit(1);
    }

    if (edits.length === 0) {
      console.log(`[auto-heal] No edits suggested. Exiting.`);
      process.exit(1);
    }

    console.log(`[auto-heal] Applying ${edits.length} edit(s)...`);
    if (DRY_RUN) {
      edits.forEach((e, i) => console.log(`  ${i + 1}. ${e.file}: "${e.oldString?.slice(0, 50)}..." -> "${e.newString?.slice(0, 50)}..."`));
      continue;
    }

    for (const e of edits) {
      const ok = applyEdit(e.file, e.oldString, e.newString);
      if (ok) console.log(`  Applied: ${e.file}`);
      else console.warn(`  Skipped: ${e.file}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
