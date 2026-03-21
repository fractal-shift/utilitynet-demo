/**
 * T1-001: Finance Module — Full React Implementation
 * Static source inspection: proves the code is there. No Playwright.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  const errors = [];
  const financePath = path.join(__dirname, '../../src/modules/Finance.jsx');
  if (!fs.existsSync(financePath)) {
    return { pass: false, errors: ['Finance.jsx not found'] };
  }
  const content = fs.readFileSync(financePath, 'utf-8');

  const requiredDataDemo = [
    'data-demo="finance-gl-table"',
    'data-demo="finance-ar-table"',
    'data-demo="finance-ap-table"',
    'data-demo="btn-post-journal"',
    'data-demo="btn-export-gl"',
    'data-demo="btn-audit-log"',
    'data-demo="btn-approve-ap"',
    'data-demo="btn-emberlyn-finance"',
    'data-demo="finance-bank-recon"',
    'data-demo="finance-month-end-checklist"',
  ];

  const requiredLogic = [
    'finance-tab-gl',
    '$2.34M',
    '$184,200',
    '$1.21M',
    '$1.82M',
    'Energy Revenue',
    'Accounts Receivable',
    'Operating Cash — RBC',
    'balanced — no variance',
  ];

  for (const req of requiredDataDemo) {
    if (!content.includes(req)) errors.push(`Missing in Finance.jsx: ${req}`);
  }
  for (const req of requiredLogic) {
    if (!content.includes(req)) errors.push(`Missing in Finance.jsx: ${req}`);
  }

  return { pass: errors.length === 0, errors };
}
