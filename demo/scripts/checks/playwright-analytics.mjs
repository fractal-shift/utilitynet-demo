/**
 * T2-010: Playwright run-analytics — drill-down extension
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  const errors = [];
  const sp = path.join(__dirname, '../../scripts/run-analytics.mjs');
  if (!fs.existsSync(sp)) return { pass: false, errors: ['run-analytics.mjs not found'] };
  const c = fs.readFileSync(sp, 'utf-8');
  for (const t of ['analytics-drill-revenue', 'btn-analytics-export-gl', 'btn-run-adhoc-report', 'compliance-report-table'])
    if (!c.includes(t)) errors.push(`Missing: ${t}`);
  try {
    execSync(`node --check ${sp}`, { stdio: 'pipe', timeout: 5000 });
  } catch (e) {
    errors.push(`Syntax: ${(e.stderr?.toString() || e.message).substring(0, 200)}`);
  }
  return { pass: errors.length === 0, errors };
}
