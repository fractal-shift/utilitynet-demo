#!/usr/bin/env node
/**
 * Demo: Finance Module — GL, AR, AP, Reconciliation, GL Remediation
 * Walks through Finance tabs with full GL Remediation interactive flow.
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

  await showScenarioSummary(page, 'Finance Module — GL, AR, AP, GL Remediation', 'Finance leads because UTILITYnet\'s primary pain is GL technical debt from Oracle. We walk the full module, then demonstrate the GL Remediation diagnostic — the feature that proves we understand their problem.');

  await playNarration(page, 'finance', 'finance-overview');
  await step(page, 'Navigating to Finance...', async () => {
    await clickWithCursor(page, 'nav-finance');
    await page.waitForTimeout(800);
  });

  await showStatus(page, 'Cash position $1.82M. AR at $184K. Two AP items pending approval blocking month-end.');

  await playNarration(page, 'finance', 'finance-gl-table');
  await step(page, 'Viewing General Ledger tab...', async () => {
    await clickWithCursor(page, 'finance-tab-gl');
    await page.waitForTimeout(400);
  });

  await showStatus(page, 'Chart of accounts — 6 GL accounts. Energy Revenue $2.34M. AESO Settlement Payable $6.82M. Every transaction posts automatically.');

  await step(page, 'Clicking Post Journal Entry...', async () => {
    await clickWithCursor(page, 'btn-post-journal');
    await page.waitForTimeout(1500);
    await clickWithCursor(page, 'btn-confirm-journal');
    await page.waitForTimeout(1000);
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

  await step(page, 'Approving first AP item...', async () => {
    await clickWithCursor(page, 'btn-approve-ap');
    await page.waitForTimeout(800);
  });

  await showStatus(page, 'Payment approved. Journal entry JE-2026-0088 created automatically. No manual GL entry.');

  await step(page, 'Viewing Reconciliation tab...', async () => {
    await clickWithCursor(page, 'finance-tab-recon');
    await page.waitForTimeout(400);
  });

  await showStatus(page, 'Bank reconciliation: RBC $1.82M matches GL $1.82M. Zero variance. February close confirmed.');

  await step(page, 'Opening GL Remediation tab...', async () => {
    await clickWithCursor(page, 'finance-tab-gl-remediation');
    await page.waitForTimeout(1000);
  });
  await playNarration(page, 'finance', 'finance-gl-remediation');

  await showStatus(page, 'Chart health at 58%. Four issues flagged — 1 critical, 2 high, 1 medium. This is the Oracle technical debt made visible.');

  await step(page, 'Clicking critical issue — HEDGE-OLD...', async () => {
    await page.evaluate(() => {
      const rows = document.querySelectorAll('[data-demo="finance-gl-issues-table"] tbody tr');
      for (const row of rows) {
        if (row.textContent.includes('HEDGE-OLD')) {
          row.click();
          break;
        }
      }
    });
    await page.waitForTimeout(600);
  });

  await showStatus(page, 'Detail panel open. AI has already classified the issue, explained the reasoning, and proposed the next action. $42K balance — Controller sign-off required before retirement.');

  await step(page, 'Closing detail panel, selecting remaining 3 issues...', async () => {
    await page.evaluate(() => {
      const closeBtn = document.querySelector('[data-demo="finance-gl-detail-panel"] button[aria-label="close"], [data-demo="finance-gl-detail-panel"] .close-btn');
      if (closeBtn) closeBtn.click();
    });
    await page.waitForTimeout(400);
    await page.evaluate(() => {
      const checkboxes = document.querySelectorAll('[data-demo="finance-gl-issues-table"] input[type="checkbox"]');
      checkboxes.forEach((cb, i) => {
        const row = cb.closest('tr');
        if (row && !row.textContent.includes('HEDGE-OLD')) cb.click();
      });
    });
    await page.waitForTimeout(400);
  });

  await showStatus(page, '3 issues selected. Bulk apply will merge and retire the clean cases.');

  await step(page, 'Applying bulk recommended actions...', async () => {
    await clickWithCursor(page, 'finance-gl-bulk-actions');
    await page.evaluate(() => {
      const btns = document.querySelectorAll('[data-demo="finance-gl-bulk-actions"] button');
      for (const btn of btns) {
        if (btn.textContent.includes('Apply All')) { btn.click(); break; }
      }
    });
    await page.waitForTimeout(800);
  });

  await showStatus(page, 'Three remediations applied. Chart health updated. HEDGE-OLD remains flagged for Controller review — the $42K balance requires a journal entry before it can be retired.');

  await step(page, 'Opening Emberlyn...', async () => {
    await clickWithCursor(page, 'emberlyn-toggle');
    await page.waitForTimeout(800);
  });

  await step(page, 'Asking Emberlyn about the remaining GL issue...', async () => {
    const input = page.locator('[data-demo="emberlyn-input"], textarea[placeholder="Ask Emberlyn..."]').first();
    await input.fill('The HEDGE-OLD balance is still open — what do we need to do to close it?');
    await input.press('Enter');
    await page.waitForTimeout(500);
  });

  await scrollReadEmberlynResponse(page);

  await showStatus(page, 'Emberlyn identifies the journal entry needed, drafts the approach, offers to generate it. Finance close is unblocked.');
  await page.waitForTimeout(2000);
  await showStatus(page, '✦ Finance Complete — GL remediation reduced technical debt from 42% to 10%. AP approved. AR aging monitored. Month-end on track. Every transaction traced, every entry audited. This is Finance the way it should work.');
  await page.waitForTimeout(5000);
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
