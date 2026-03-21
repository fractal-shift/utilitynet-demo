/**
 * T1-005: Enrollment — Failed Credit + Deposit + Activation Date
 * Static source inspection: proves the code is there. No Playwright.
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

  const requiredDataDemo = [
    'toggle-failed-credit',
    'credit-failed-state',
    'btn-require-deposit',
    'btn-reject-enrollment',
    'btn-manual-override',
    'btn-mark-deposit-received',
    'activation-date-field',
    'activation-date-confirmation',
  ];

  for (const req of requiredDataDemo) {
    if (!content.includes(req)) errors.push(`Missing in EnrollmentModal: ${req}`);
  }

  return { pass: errors.length === 0, errors };
}
