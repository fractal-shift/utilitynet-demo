#!/usr/bin/env node
/**
 * Demo: Complex 15+ step scenario
 * Full operational journey: Dashboard → Billing exception → Customer → Settlement → Analytics.
 * Shows how Emberlyn and Thena support a complete day-in-the-life workflow.
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
  scrollReadThenaResponse,
  createDemoContext,
  closeDemoContextAndSaveVideo,
  writeFailure,
} from './demo-runner.mjs';

export async function runScenario(page) {
  await step(page, 'Opening UTILITYnet demo...', async () => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  await dismissApiKeyModal(page);

  await showScenarioSummary(
    page,
    'Full Operational Journey — 15 Steps',
    'We\'ll follow a complete workflow: start at the Dashboard, review a billing exception with Emberlyn, resolve a customer dispute, reconcile a settlement, and end with Thena analytics. This shows how everything connects in one system.'
  );

  // Step 1: Dashboard
  await step(page, 'Step 1: Viewing Operations Dashboard...', async () => {
    await clickWithCursor(page, 'nav-dashboard');
  });

  await step(page, 'Step 2: Reviewing KPIs and alerts...', async () => {
    await page.waitForTimeout(2000);
  });

  // Step 3: Navigate to Billing
  await step(page, 'Step 3: Navigating to Billing exceptions...', async () => {
    await clickWithCursor(page, 'dashboard-task-billing');
  });

  await step(page, 'Step 4: Opening Emberlyn to explain the exception...', async () => {
    await clickWithCursor(page, 'btn-ask-emberlyn');
    await page.waitForTimeout(1500);
  });

  await step(page, 'Step 5: Asking Emberlyn why this account was flagged...', async () => {
    await page.getByRole('button', { name: 'Explain EXC-0311-A' }).click();
    await scrollReadEmberlynResponse(page);
  });

  await step(page, 'Step 6: Applying recommended fix...', async () => {
    await clickWithCursor(page, 'btn-resolve-EXC-0311-A');
    await page.waitForTimeout(2000);
  });

  // Step 7: Customer Service
  await step(page, 'Step 7: Navigating to Customers...', async () => {
    await clickWithCursor(page, 'nav-customers');
  });

  await step(page, 'Step 8: Opening MacGregor Industrial Ltd. (Customer 360)...', async () => {
    await clickWithCursor(page, 'row-C-10478');
  });

  await step(page, 'Step 9: Opening Emberlyn to draft customer email...', async () => {
    await clickWithCursor(page, 'customer360-draft-email');
    await page.waitForTimeout(2000);
  });

  await step(page, 'Step 10: Asking Emberlyn to summarize customer issues...', async () => {
    await page.getByRole('button', { name: "Summarize this customer's recent issues" }).click();
    await scrollReadEmberlynResponse(page);
  });

  await step(page, 'Step 11: Confirming Emberlyn\'s proposed action...', async () => {
    const confirm = page.locator('[data-demo="emberlyn-confirm"]');
    await confirm.waitFor({ state: 'visible', timeout: 5000 });
    await confirm.click();
  });
  await page.waitForTimeout(2000);

  // Step 12: Settlement
  await step(page, 'Step 12: Navigating to Settlement...', async () => {
    await clickWithCursor(page, 'nav-settlement');
  });

  await step(page, 'Step 13: Opening Emberlyn for AltaGas exception...', async () => {
    await clickWithCursor(page, 'btn-draft-altagas');
    await page.waitForTimeout(2000);
  });

  await step(page, 'Step 14: Asking Emberlyn for root cause...', async () => {
    await page.getByRole('button', { name: 'What is the root cause of this mismatch?' }).click();
    await scrollReadEmberlynResponse(page);
  });

  await step(page, 'Step 15: Accepting UTILITYnet figures...', async () => {
    const confirm = page.locator('[data-demo="emberlyn-confirm"]');
    if (await confirm.isVisible().catch(() => false)) {
      await confirm.click();
    } else {
      await page.click('[data-demo="btn-resolve-altagas"]');
    }
  });
  await page.waitForTimeout(2000);

  // Step 16: Analytics
  await step(page, 'Step 16: Navigating to Analytics (Thena mode)...', async () => {
    await clickWithCursor(page, 'nav-analytics');
    await page.waitForTimeout(2000);
  });

  await step(page, 'Step 17: Opening Thena panel...', async () => {
    await page.click('[data-demo="thena-toggle"]');
    await page.waitForTimeout(1500);
  });

  await step(page, 'Step 18: Asking Thena about Q2 revenue risks...', async () => {
    await page.getByRole('button', { name: 'What are the top revenue risks in Q2?' }).click();
    await scrollReadThenaResponse(page);
  });

  await showStatus(page, 'Complex scenario complete! Full operational journey demonstrated.');
  await clearStatus(page);
}

async function main() {
  const browser = await chromium.launch(LAUNCH_OPTIONS);
  const { context, page } = await createDemoContext(browser, 'complex');
  page.setDefaultTimeout(15000);
  try {
    await runScenario(page);
  } catch (err) {
    console.error('Demo failed:', err.message);
    writeFailure('complex', 0, 'complex', '', err);
    await clearStatus(page);
    process.exit(1);
  } finally {
    await closeDemoContextAndSaveVideo(context, page, 'complex');
    await browser.close();
  }
}

if (process.argv[1]?.endsWith('run-complex.mjs')) {
  main();
}
