/**
 * T2-009: Playwright run-settlement — scenario switching extension
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

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
  try {
    execSync(`node --check ${sp}`, { stdio: 'pipe', timeout: 5000 });
  } catch (e) {
    errors.push(`Syntax: ${(e.stderr?.toString() || e.message).substring(0, 200)}`);
  }
  return { pass: errors.length === 0, errors };
}
