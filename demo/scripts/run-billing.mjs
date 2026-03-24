#!/usr/bin/env node
/**
 * Demo: Full Billing Run — AESO Import → Rate Apply → Hedge → Generate → Exceptions → Send
 * Walks through the complete March 2026 billing cycle end-to-end.
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
  setDemoRole,
} from './demo-runner.mjs';

export async function runScenario(page) {
  await step(page, 'Opening UTILITYnet demo...', async () => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  await dismissApiKeyModal(page);
  await setDemoRole(page, 'Billing Manager');

  await showScenarioSummary(page, 'Full Billing Run — March 2026', 'We\'ll walk through the complete billing cycle: import AESO usage data, apply variable energy rates, allocate hedge costs, generate 2,847 invoices, triage a usage-spike exception with Emberlyn, and distribute clean invoices — all in under two minutes.');

  await step(page, 'Navigating to Billing...', async () => {
    await clickWithCursor(page, 'nav-billing');
    await page.waitForTimeout(600);
  });

  await playNarration(page, 'billing', 'billing-import-btn');
  await step(page, 'Importing AESO usage data — opening new batch...', async () => {
    await clickWithCursor(page, 'btn-new-batch');
    await page.waitForTimeout(600);
  });

  await step(page, 'Creating billing batch for March 2026...', async () => {
    await page.evaluate(() => {
      const btn = document.querySelector('[data-demo="batch-create"]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(1000);
  });

  await showStatus(page, 'AESO pool price feed ingested — 2,847 site-months of metered usage loaded. Batch B-2026-0311 created.');

  await playNarration(page, 'billing', 'billing-rate-apply');
  await step(page, 'Applying variable energy rate — AESO pool price $4.82/GJ...', async () => {
    await page.evaluate(() => {
      const table = document.querySelector('table');
      if (table) table.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await page.waitForTimeout(800);
  });

  await showStatus(page, 'Variable rate applied: AESO pool $4.82/GJ + $0.38/GJ distribution. 2,847 line items priced. Batch total: $1.84M.');

  await playNarration(page, 'billing', 'billing-hedge-allocation');
  await step(page, 'Allocating hedge costs across eligible customers...', async () => {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(800);
  });

  await showStatus(page, 'Hedge allocation complete — $214K distributed across 1,203 fixed-price customers. Net margin protected at 8.4%.');

  await playNarration(page, 'billing', 'billing-generate-btn');
  await step(page, 'Generating invoices — posting revenue to GL...', async () => {
    await page.evaluate(() => {
      const btn = document.querySelector('[data-demo="btn-post-billing-to-gl"]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(2000);
  });

  await showStatus(page, '2,847 invoices generated. Journal Entry JE-2026-0089 created — Revenue Account 4000 credited $1.84M.');

  await playNarration(page, 'billing', 'billing-exception-flag');
  await step(page, 'Exception detected — usage spike on SITE-20011...', async () => {
    await clickWithCursor(page, 'tab-exceptions');
    await page.waitForTimeout(600);
  });

  await showStatus(page, '3 exceptions blocking distribution. EXC-0311-A: Sunrise Industrial — 340% usage spike. CAD $8,400 at risk.');

  await step(page, 'Asking Emberlyn to explain exception EXC-0311-A...', async () => {
    await page.click('[data-demo="btn-ask-emberlyn"]');
    await page.waitForTimeout(1000);
  });

  await step(page, 'Asking Emberlyn why this account was flagged...', async () => {
    await page.getByRole('button', { name: 'Explain EXC-0311-A' }).click();
    await scrollReadEmberlynResponse(page);
  });

  await step(page, 'Asking Emberlyn to recommend next step...', async () => {
    await page.getByRole('button', { name: 'Recommend the next step' }).click();
    await scrollReadEmberlynResponse(page);
  });

  await step(page, "Applying Emberlyn's suggested fix...", async () => {
    const confirm = page.locator('[data-demo="emberlyn-confirm"]');
    if (await confirm.isVisible().catch(() => false)) {
      await confirm.click();
    } else {
      await page.click('[data-demo="btn-resolve-EXC-0311-A"]');
    }
    await page.waitForTimeout(800);
  });

  await playNarration(page, 'billing', 'billing-send-btn');
  await step(page, 'Sending clean invoices to customers...', async () => {
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const invoicesTab = tabs.find((b) => b.textContent?.trim() === 'Invoices');
      if (invoicesTab) invoicesTab.click();
    });
    await page.waitForTimeout(800);
  });

  await showStatus(page, 'Batch B-2026-0311 complete — 2,847 invoices distributed. All exceptions resolved. Revenue posted to GL.');
  await page.waitForTimeout(2000);
  await showStatus(page, '✦ Billing Complete — 2,847 invoices. $1.84M revenue. 3 exceptions caught and resolved without holding the batch. Hedge costs allocated. GL posted automatically. What used to take 3 days took 4 minutes.');
  await page.waitForTimeout(5000);
  await setDemoRole(page, null);
  await clearStatus(page);
}

async function main() {
  const browser = await chromium.launch(LAUNCH_OPTIONS);
  const { context, page } = await createDemoContext(browser, 'billing');
  page.setDefaultTimeout(15000);
  try {
    await runScenario(page);
  } catch (err) {
    console.error('Demo failed:', err.message);
    writeFailure('billing', 0, 'billing', '', err);
    await clearStatus(page);
    process.exit(1);
  } finally {
    await closeDemoContextAndSaveVideo(context, page, 'billing');
    await browser.close();
  }
}

if (process.argv[1]?.endsWith('run-billing.mjs')) {
  main();
}
