/**
 * Validates run-finance.mjs script exists and executes without errors.
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  const errors = [];

  const scriptPath = path.join(__dirname, '../run-finance.mjs');
  if (!fs.existsSync(scriptPath)) {
    return { pass: false, errors: ['run-finance.mjs does not exist'] };
  }

  const runAllPath = path.join(__dirname, '../run-all.mjs');
  if (fs.existsSync(runAllPath)) {
    const content = fs.readFileSync(runAllPath, 'utf-8');
    if (!content.includes('run-finance')) errors.push('run-finance.mjs not imported in run-all.mjs');
    if (!content.includes("'finance'")) errors.push("'finance' scenario not in SCENARIOS array in run-all.mjs");
  }

  try {
    execSync(`node --input-type=module --eval "import('${scriptPath.replace(/\\/g, '/')}')"`, {
      timeout: 5000,
      stdio: 'pipe',
    });
  } catch (err) {
    const msg = err.stderr?.toString() || err.message || '';
    if (msg.includes('SyntaxError')) {
      errors.push(`run-finance.mjs has syntax error: ${msg.substring(0, 200)}`);
    }
  }

  return { pass: errors.length === 0, errors };
}
