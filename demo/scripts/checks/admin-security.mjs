/**
 * T2-005: Admin Security Controls Display
 * Static source inspection: proves the code is there. No Playwright.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  const errors = [];
  const adminPath = path.join(__dirname, '../../src/modules/Admin.jsx');
  if (!fs.existsSync(adminPath)) return { pass: false, errors: ['Admin.jsx not found'] };

  const content = fs.readFileSync(adminPath, 'utf-8');

  const requiredDataDemo = [
    'security-auth-card',
    'security-rto-rpo-card',
    'security-compliance-card',
    'security-sla-table',
  ];

  for (const req of requiredDataDemo) {
    if (!content.includes(req)) errors.push(`Missing in Admin.jsx: ${req}`);
  }

  return { pass: errors.length === 0, errors };
}
