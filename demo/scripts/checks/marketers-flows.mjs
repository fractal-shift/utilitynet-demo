/**
 * T2-003: Marketers — Margin Setting, Prudential/Cash Call, Statements
 * Static source inspection: proves the code is there. No Playwright.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  const errors = [];
  const marketersPath = path.join(__dirname, '../../src/modules/Marketers.jsx');
  if (!fs.existsSync(marketersPath)) return { pass: false, errors: ['Marketers.jsx not found'] };

  const content = fs.readFileSync(marketersPath, 'utf-8');

  const requiredDataDemo = [
    'btn-save-margin',
    'btn-cash-call-reminder',
    'btn-generate-statement',
    'marketer-journal-entries-table',
  ];

  for (const req of requiredDataDemo) {
    if (!content.includes(req)) errors.push(`Missing in Marketers.jsx: ${req}`);
  }

  return { pass: errors.length === 0, errors };
}
