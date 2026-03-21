/**
 * Validates run-enrollment.mjs includes credit-fail scenario extension
 * and setMockScenario helper exists in demo-runner.mjs.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  const errors = [];

  const enrollPath = path.join(__dirname, '../run-enrollment.mjs');
  const runnerPath = path.join(__dirname, '../demo-runner.mjs');

  if (!fs.existsSync(enrollPath)) return { pass: false, errors: ['run-enrollment.mjs not found'] };
  if (!fs.existsSync(runnerPath)) return { pass: false, errors: ['demo-runner.mjs not found'] };

  const enrollContent = fs.readFileSync(enrollPath, 'utf-8');
  const runnerContent = fs.readFileSync(runnerPath, 'utf-8');

  if (!enrollContent.includes('credit-fail')) errors.push('run-enrollment.mjs missing credit-fail scenario');
  if (!enrollContent.includes('setMockScenario')) errors.push('run-enrollment.mjs not using setMockScenario helper');
  if (!runnerContent.includes('setMockScenario')) errors.push('demo-runner.mjs missing setMockScenario export');
  if (!runnerContent.includes('localhost:3101')) errors.push('setMockScenario not pointing to localhost:3101');

  return { pass: errors.length === 0, errors };
}
