/**
 * Validates Finance module renders correctly and all interactive elements exist.
 * Uses Playwright headless when available; falls back to static analysis if browser fails to launch.
 * Prerequisite for Playwright: app must be running on localhost:5173.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function checkWithPlaywright() {
  const { chromium } = await import('playwright');
  const errors = [];
  let browser;

  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 10000 });

    const modal = page.locator('[data-demo="api-key-modal"], [data-demo="api-key-dismiss"]');
    if (await modal.first().isVisible().catch(() => false)) {
      await modal.first().click().catch(() => {});
      await page.waitForTimeout(500);
    }

    await page.click('[data-demo="nav-finance"]').catch(() => errors.push('Finance nav item not found'));
    await page.waitForTimeout(800);

    const kpiValues = ['$2.34M', '$184,200', '$1.21M', '$1.82M'];
    for (const val of kpiValues) {
      const exists = await page.locator(`text="${val}"`).isVisible().catch(() => false);
      if (!exists) errors.push(`KPI value not found: ${val}`);
    }

    for (const tab of ['General Ledger', 'Accounts Receivable', 'Accounts Payable', 'Reconciliation']) {
      const exists = await page.locator(`text="${tab}"`).first().isVisible().catch(() => false);
      if (!exists) errors.push(`Finance tab not found: ${tab}`);
    }

    const glTable = page.locator('[data-demo="finance-gl-table"]');
    if (!(await glTable.isVisible().catch(() => false))) errors.push('GL table not found');

    for (const account of ['Energy Revenue', 'Accounts Receivable', 'Operating Cash — RBC']) {
      const exists = await page.locator(`text="${account}"`).isVisible().catch(() => false);
      if (!exists) errors.push(`GL account not found: ${account}`);
    }

    for (const btn of ['btn-post-journal', 'btn-export-gl', 'btn-audit-log']) {
      const exists = await page.locator(`[data-demo="${btn}"]`).isVisible().catch(() => false);
      if (!exists) errors.push(`Button not found: data-demo="${btn}"`);
    }

    await page.locator('text="Accounts Receivable"').first().click().catch(() => {});
    await page.waitForTimeout(400);
    const arTable = page.locator('[data-demo="finance-ar-table"]');
    if (!(await arTable.isVisible().catch(() => false))) errors.push('AR table not found');

    await page.locator('text="Accounts Payable"').first().click().catch(() => {});
    await page.waitForTimeout(400);
    const apTable = page.locator('[data-demo="finance-ap-table"]');
    if (!(await apTable.isVisible().catch(() => false))) errors.push('AP table not found');
    const approveBtn = page.locator('[data-demo="btn-approve-ap"]').first();
    if (!(await approveBtn.isVisible().catch(() => false))) errors.push('Approve AP button not found');

    if (errors.length === 0) {
      await approveBtn.click();
      await page.waitForTimeout(600);
      const approved = await page.locator('text="Approved"').isVisible().catch(() => false);
      if (!approved) errors.push('AP approve action did not update row status to Approved');
    }

    await page.locator('text="Reconciliation"').first().click().catch(() => {});
    await page.waitForTimeout(400);
    const bankRecon = page.locator('[data-demo="finance-bank-recon"]');
    if (!(await bankRecon.isVisible().catch(() => false))) errors.push('Bank reconciliation card not found');
    const checklist = page.locator('[data-demo="finance-month-end-checklist"]');
    if (!(await checklist.isVisible().catch(() => false))) errors.push('Month-end checklist not found');

    const balanced = await page.locator('text="balanced — no variance"').isVisible().catch(() => false);
    if (!balanced) errors.push('Bank reconciliation balance confirmation text not found');

    return { pass: errors.length === 0, errors };
  } finally {
    await browser?.close();
  }
}

function checkWithStatic() {
  const errors = [];
  const financePath = path.join(__dirname, '../../src/modules/Finance.jsx');
  if (!fs.existsSync(financePath)) {
    return { pass: false, errors: ['Finance.jsx not found'] };
  }
  const content = fs.readFileSync(financePath, 'utf-8');

  const required = [
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

  for (const req of required) {
    if (!content.includes(req)) errors.push(`Missing in Finance.jsx: ${req}`);
  }

  return { pass: errors.length === 0, errors, warnings: ['Used static analysis fallback (Playwright unavailable)'] };
}

export async function check() {
  try {
    return await checkWithPlaywright();
  } catch (err) {
    const msg = err.message || '';
    if (msg.includes('Executable doesn\'t exist') || msg.includes('spawn') || msg.includes('browserType.launch')) {
      return checkWithStatic();
    }
    return { pass: false, errors: [`Playwright error: ${msg}`] };
  }
}
