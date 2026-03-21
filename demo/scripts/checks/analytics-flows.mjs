/**
 * T2-004: Analytics — Drill-down, GL Reconcile, Compliance, Ad-Hoc
 * Static source inspection: proves the code is there. No Playwright.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  const errors = [];
  const analyticsPath = path.join(__dirname, '../../src/modules/Analytics.jsx');
  if (!fs.existsSync(analyticsPath)) return { pass: false, errors: ['Analytics.jsx not found'] };

  const content = fs.readFileSync(analyticsPath, 'utf-8');

  const requiredDataDemo = [
    'analytics-drill-revenue',
    'analytics-drill-account',
    'btn-analytics-export-gl',
    'compliance-report-table',
    'btn-generate-compliance-report',
    'btn-run-adhoc-report',
  ];

  for (const req of requiredDataDemo) {
    if (!content.includes(req)) errors.push(`Missing in Analytics.jsx: ${req}`);
  }

  return { pass: errors.length === 0, errors };
}
