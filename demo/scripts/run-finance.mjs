#!/usr/bin/env node
/**
 * Demo: Finance Module — GL, AR, AP, Month-End Close
 * Walks through Finance tabs, approve flow, reconciliation, Emberlyn.
 */

import { chromium } from 'playwright';
import {
  BASE_URL,
  LAUNCH_OPTIONS,
  step,
  showStatus,
  showScenarioSummary,
  clearStatus,
  dismissApiKeyModal,
  clickWithCursor,
  scrollReadEmberlynResponse,
  createDemoContext,
  closeDemoContextAndSaveVideo,
  writeFailure,
  playNarration,
} from './demo-runner.mjs';

export async function runFinance(page) {
  await step(page, 'Opening UTILITYnet demo...', async () => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  await dismissApiKeyModal(page);

  await showScenarioSummary(page, 'Finance Module — GL, AR, AP, Month-End Close', 'We\'ll walk through the chart of accounts, AR aging, AP approvals, and bank reconciliation. Finance leads because UTILITYnet\'s stated priority is Finance first.');

  playNarration('finance', 'finance-overview');
  await step(page, 'Navigating to Finance...', async () => {
    await clickWithCursor(page, 'nav-finance');
    await page.waitForTimeout(800);
  });

  await showStatus(page, 'Cash position $1.82M. AR at $184K. Two AP items pending approval blocking month-end.');

  playNarration('finance', 'finance-gl-table');
  await step(page, 'Viewing General Ledger tab...', async () => {
    await clickWithCursor(page, 'finance-tab-gl');
    await page.waitForTimeout(400);
  });

  await showStatus(page, 'Chart of accounts — 6 GL accounts. Energy Revenue $2.34M. AESO Settlement Payable $6.82M.');

  await step(page, 'Clicking Post Journal Entry...', async () => {
    await clickWithCursor(page, 'btn-post-journal');
    await page.waitForTimeout(600);
  });

  await showStatus(page, 'Journal entry created. Full audit trail captured automatically.');

  await step(page, 'Viewing Accounts Receivable tab...', async () => {
    await clickWithCursor(page, 'finance-tab-ar');
    await page.waitForTimeout(400);
  });

  await showStatus(page, 'AR aging — $139K overdue across 2 accounts. Collections queue active.');

  await step(page, 'Viewing Accounts Payable tab...', async () => {
    await clickWithCursor(page, 'finance-tab-ap');
    await page.waitForTimeout(400);
  });

  await showStatus(page, 'AP queue — $1.19M awaiting approval. Marketer commissions and AltaGas settlement.');

  await step(page, 'Clicking Approve on first AP item...', async () => {
    await clickWithCursor(page, 'btn-approve-ap');
    await page.waitForTimeout(600);
  });

  await showStatus(page, 'Payment approved. Journal entry JE-2026-0088 created automatically. No manual GL entry.');

  await step(page, 'Viewing Reconciliation tab...', async () => {
    await clickWithCursor(page, 'finance-tab-recon');
    await page.waitForTimeout(400);
  });

  await showStatus(page, 'Bank reconciliation: RBC $1.82M matches GL $1.82M. Zero variance. February close confirmed.');

  playNarration('finance', 'finance-legacylift-scan');
  await step(page, 'Viewing LegacyLift migration scan...', async () => {
    await clickWithCursor(page, 'finance-tab-legacylift');
    await page.waitForTimeout(600);
  });

  await showStatus(page, 'Legacy scan complete — 3 GL codes flagged for remapping. 284 Revenue entries auto-mapped to account 4000.');

  playNarration('finance', 'finance-remediation-plan');
  await step(page, 'Reviewing remediation plan...', async () => {
    await page.evaluate(() => {
      const el = document.querySelector('[data-demo="finance-remediation-plan"]');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await page.waitForTimeout(800);
  });

  await showStatus(page, '3 remediation items assigned. REM-001 in progress (Sarah M.) — due Mar 15. Period close on track.');

  playNarration('finance', 'finance-confirm-cleanup');
  await step(page, 'Confirming cleanup and locking February period...', async () => {
    await page.evaluate(() => {
      const btn = document.querySelector('[data-demo="btn-confirm-cleanup"]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(600);
  });

  await showStatus(page, 'February 2026 period locked. 3 remediations applied. Audit-ready reports generated.');

  await step(page, 'Opening Emberlyn Assist...', async () => {
    await clickWithCursor(page, 'btn-emberlyn-finance');
    await page.waitForTimeout(800);
  });

  await step(page, 'Clicking suggested prompt: Which AP items are blocking month-end close?', async () => {
    await page.locator('text="Which AP items are blocking month-end close?"').first().click();
    await page.waitForTimeout(500);
  });

  await scrollReadEmberlynResponse(page);

  await showStatus(page, 'Emberlyn identifies the one remaining blocker in seconds. No spreadsheet, no email to accounting.');

  await clearStatus(page);
}

async function main() {
  const browser = await chromium.launch(LAUNCH_OPTIONS);
  const { context, page } = await createDemoContext(browser, 'finance');
  try {
    await runFinance(page);
  } catch (err) {
    console.error('Demo failed:', err.message);
    writeFailure('finance', 0, 'finance', '', err);
    await clearStatus(page);
    process.exit(1);
  } finally {
    await closeDemoContextAndSaveVideo(context, page, 'finance');
    await browser.close();
  }
}

if (process.argv[1]?.endsWith('run-finance.mjs')) {
  main();
}
