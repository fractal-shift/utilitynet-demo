#!/usr/bin/env node
/**
 * Demo: Billing Exception + Emberlyn
 * Navigates to Billing, Exceptions tab, opens Emberlyn,
 * asks why flagged, recommends next step, confirms.
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
} from './demo-runner.mjs';

export async function runScenario(page) {
  await step(page, 'Opening UTILITYnet demo...', async () => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  await dismissApiKeyModal(page);

  await showScenarioSummary(page, 'Billing Exception Handling', 'Batch B-2026-0311 has 3 exceptions. We\'ll open the Exceptions tab, ask Emberlyn why an account was flagged, get the recommended next step, and apply the fix. What used to take half a day is now 90 seconds.');

  await step(page, 'Navigating to Billing...', async () => {
    await clickWithCursor(page, 'nav-billing');
  });

  await step(page, 'Opening Exceptions tab...', async () => {
    await clickWithCursor(page, 'tab-exceptions');
  });

  await step(page, 'Asking Emberlyn to explain the exception...', async () => {
    await page.click('[data-demo="btn-ask-emberlyn"]');
    await page.waitForTimeout(1000);
  });

  await step(page, "Asking Emberlyn why this account was flagged...", async () => {
    await page.getByRole('button', { name: 'Explain EXC-0311-A' }).click();
    await scrollReadEmberlynResponse(page);
  });

  await step(page, "Asking Emberlyn to recommend next step...", async () => {
    await page.getByRole('button', { name: 'Recommend the next step' }).click();
    await scrollReadEmberlynResponse(page);
  });

  await step(page, "Confirming Emberlyn's resolution...", async () => {
    const confirm = page.locator('[data-demo="emberlyn-confirm"]');
    if (await confirm.isVisible().catch(() => false)) {
      await confirm.click();
    } else {
      await page.click('[data-demo="btn-resolve-EXC-0311-A"]');
    }
  });

  await showStatus(page, 'Billing exception resolved!');
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
