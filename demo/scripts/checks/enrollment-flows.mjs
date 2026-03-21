/**
 * Validates enrollment failed-credit, deposit, and activation-date flows.
 * Uses static analysis (Playwright may be unavailable).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  const errors = [];
  const enrollPath = path.join(__dirname, '../../src/components/EnrollmentModal.jsx');
  if (!fs.existsSync(enrollPath)) return { pass: false, errors: ['EnrollmentModal.jsx not found'] };

  const content = fs.readFileSync(enrollPath, 'utf-8');

  if (!content.includes('toggle-failed-credit')) errors.push('Failed credit toggle not found');
  if (!content.includes('btn-require-deposit')) errors.push('Require deposit button not found');
  if (!content.includes('btn-mark-deposit-received')) errors.push('Mark deposit received button not found');
  if (!content.includes('activation-date-field')) errors.push('Activation date field not found');

  return { pass: errors.length === 0, errors };
}
