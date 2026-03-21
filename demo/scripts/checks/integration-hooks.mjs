/**
 * Validates all 4 finance integration hooks exist.
 * Tries Playwright; falls back to static analysis if browser unavailable.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.VITE_DEV_URL || 'http://localhost:5173';

async function checkWithPlaywright() {
  const { chromium } = await import('playwright');
  const errors = [];
  let browser;

  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 10000 });

    const dismissModal = async () => {
      const modal = page.locator('[data-demo="api-key-modal"], [data-demo="api-key-dismiss"]');
      if (await modal.first().isVisible().catch(() => false)) {
        await modal.first().click().catch(() => {});
        await page.waitForTimeout(500);
      }
    };
    await dismissModal();

    await page.click('[data-demo="nav-billing"]').catch(() => errors.push('Billing nav not found'));
    await page.waitForTimeout(600);
    const billingHook = page.locator('[data-demo="btn-post-billing-to-gl"]');
    if (!(await billingHook.isVisible().catch(() => false))) {
      errors.push('Hook 1 missing: data-demo="btn-post-billing-to-gl" not found in Billing module');
    } else {
      await billingHook.click();
      await page.waitForTimeout(1800);
      const toast = await page.locator('text="JE-2026-0089"').isVisible().catch(() => false);
      if (!toast) errors.push('Hook 1: JE-2026-0089 not shown in toast after click');
    }

    await page.click('[data-demo="nav-settlement"]').catch(() => errors.push('Settlement nav not found'));
    await page.waitForTimeout(600);
    const settlementHook = page.locator('[data-demo="btn-send-settlement-to-finance"]');
    if (!(await settlementHook.isVisible().catch(() => false))) {
      errors.push('Hook 2 missing: data-demo="btn-send-settlement-to-finance" not found');
    }

    await page.click('[data-demo="nav-marketers"]').catch(() => errors.push('Marketers nav not found'));
    await page.waitForTimeout(600);
    const marketerHook = page.locator('[data-demo="btn-post-commissions-to-gl"]');
    if (!(await marketerHook.isVisible().catch(() => false))) {
      errors.push('Hook 3 missing: data-demo="btn-post-commissions-to-gl" not found');
    }

    await page.click('[data-demo="nav-customers"]').catch(() => errors.push('Customers nav not found'));
    await page.waitForTimeout(600);
    const firstRow = page.locator('[data-demo^="row-"]').first();
    if (await firstRow.isVisible().catch(() => false)) {
      await firstRow.click();
      await page.waitForTimeout(600);
      const billingTab = page.locator('text="billing"').first();
      if (await billingTab.isVisible().catch(() => false)) {
        await billingTab.click();
        await page.waitForTimeout(400);
      }
    }
    const crmLink = page.locator('[data-demo="crm-billing-link"]');
    if (!(await crmLink.isVisible().catch(() => false))) {
      errors.push('Hook 4 missing: data-demo="crm-billing-link" not found in Customers module');
    }

    return { pass: errors.length === 0, errors };
  } finally {
    await browser?.close();
  }
}

function checkWithStatic() {
  const errors = [];
  const files = {
    billing: path.join(__dirname, '../../src/modules/Billing.jsx'),
    settlement: path.join(__dirname, '../../src/modules/Settlement.jsx'),
    marketers: path.join(__dirname, '../../src/modules/Marketers.jsx'),
    customer360: path.join(__dirname, '../../src/components/Customer360Modal.jsx'),
  };

  if (!fs.existsSync(files.billing) || !fs.readFileSync(files.billing, 'utf-8').includes('btn-post-billing-to-gl')) {
    errors.push('Hook 1: btn-post-billing-to-gl not found in Billing.jsx');
  }
  if (!fs.existsSync(files.settlement) || !fs.readFileSync(files.settlement, 'utf-8').includes('btn-send-settlement-to-finance')) {
    errors.push('Hook 2: btn-send-settlement-to-finance not found in Settlement.jsx');
  }
  if (!fs.existsSync(files.marketers) || !fs.readFileSync(files.marketers, 'utf-8').includes('btn-post-commissions-to-gl')) {
    errors.push('Hook 3: btn-post-commissions-to-gl not found in Marketers.jsx');
  }
  if (!fs.existsSync(files.customer360) || !fs.readFileSync(files.customer360, 'utf-8').includes('crm-billing-link')) {
    errors.push('Hook 4: crm-billing-link not found in Customer360Modal.jsx');
  }

  return { pass: errors.length === 0, errors, warnings: ['Used static analysis fallback'] };
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
