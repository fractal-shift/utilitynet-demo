#!/usr/bin/env node
/**
 * Demo: Settlement Exception + Emberlyn
 * Navigates to Settlement, opens Emberlyn for AltaGas,
 * asks root cause, drafts response, confirms resolution.
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

  await showScenarioSummary(page, 'Settlement Reconciliation + Emberlyn', 'AltaGas submitted an invoice that doesn\'t match UTILITYnet\'s calculations ($1,640 variance). We\'ll ask Emberlyn for the root cause, draft the formal response, and accept UTILITYnet figures. No more 3-day email back-and-forth.');

  await step(page, 'Navigating to Settlement...', async () => {
    await clickWithCursor(page, 'nav-settlement');
  });

  await step(page, 'Opening Emberlyn for AltaGas exception...', async () => {
    await clickWithCursor(page, 'btn-draft-altagas');
    await page.waitForTimeout(1000);
  });

  await step(page, "Asking Emberlyn for root cause analysis...", async () => {
    await page.getByRole('button', { name: 'What is the root cause of this mismatch?' }).click();
    await scrollReadEmberlynResponse(page);
  });

  await step(page, "Emberlyn is drafting the dispute response...", async () => {
    await page.getByRole('button', { name: 'Draft a professional response to AltaGas' }).click();
    await scrollReadEmberlynResponse(page);
  });

  await step(page, "Accepting UTILITYnet figures...", async () => {
    const confirm = page.locator('[data-demo="emberlyn-confirm"]');
    if (await confirm.isVisible().catch(() => false)) {
      await confirm.click();
    } else {
      await page.click('[data-demo="btn-resolve-altagas"]');
    }
  });

  await showStatus(page, 'Settlement exception resolved!');
  await clearStatus(page);
}

async function main() {
  const browser = await chromium.launch(LAUNCH_OPTIONS);
  const { context, page } = await createDemoContext(browser, 'settlement');
  page.setDefaultTimeout(15000);
  try {
    await runScenario(page);
  } catch (err) {
    console.error('Demo failed:', err.message);
    writeFailure('settlement', 0, 'settlement', '', err);
    await clearStatus(page);
    process.exit(1);
  } finally {
    await closeDemoContextAndSaveVideo(context, page, 'settlement');
    await browser.close();
  }
}

if (process.argv[1]?.endsWith('run-settlement.mjs')) {
  main();
}
