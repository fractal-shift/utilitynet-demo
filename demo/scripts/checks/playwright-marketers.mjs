/**
 * T2-008: Playwright run-marketers — margin + statement extension
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  const errors = [];
  const sp = path.join(__dirname, '../../scripts/run-marketers.mjs');
  if (!fs.existsSync(sp)) return { pass: false, errors: ['run-marketers.mjs not found'] };
  const c = fs.readFileSync(sp, 'utf-8');
  for (const t of ['btn-save-margin', 'btn-generate-statement', 'btn-post-commissions-to-gl', 'marketer-margin-input', 'btn-cash-call-reminder'])
    if (!c.includes(t)) errors.push(`Missing: ${t}`);
  if (!c.includes('setMockScenario')) errors.push('Missing: setMockScenario');
  try {
    execSync(`node --check ${sp}`, { stdio: 'pipe', timeout: 5000 });
  } catch (e) {
    errors.push(`Syntax: ${(e.stderr?.toString() || e.message).substring(0, 200)}`);
  }
  return { pass: errors.length === 0, errors };
}
