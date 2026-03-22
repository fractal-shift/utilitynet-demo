#!/usr/bin/env node
/**
 * Demo: Settlement Exception + Emberlyn
 * Uses setMockScenario('altagas-variance') before invoice ingest so Emberlyn
 * has real invoice data. Adds btn-send-settlement-to-finance step.
 * Resets to altagas-clean at end.
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
  setMockScenario,
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

  await showScenarioSummary(page, 'Settlement Reconciliation + Emberlyn', 'AltaGas submitted an invoice that doesn\'t match UTILITYnet\'s calculations ($1,640 variance). We\'ll set altagas-variance scenario before ingest, ask Emberlyn for root cause, draft the response, accept UTILITYnet figures, send to Finance, then reset to altagas-clean.');

  await step(page, 'Setting mock scenario altagas-variance before invoice ingest...', async () => {
    await setMockScenario('altagas-variance');
    await page.waitForTimeout(500);
  });

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
      await page.locator('[data-demo="btn-resolve-altagas"]').click();
    }
    await page.waitForTimeout(1000);
  });

  await step(page, 'Closing Emberlyn panel...', async () => {
    await page.waitForSelector('[data-demo="emberlyn-close"]', 
      { timeout: 3000 }).catch(() => {});
    const closed = await page.evaluate(() => {
      const btn = document.querySelector('[data-demo="emberlyn-close"]');
      if (btn) { btn.click(); return true; }
      return false;
    });
    console.log('Emberlyn close clicked:', closed);
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
  });

  await step(page, 'Re-navigating to Settlement...', async () => {
    await page.evaluate(() => {
      const nav = document.querySelector('[data-demo="nav-settlement"]');
      if (nav) nav.click();
    });
    await page.waitForTimeout(1000);
    // Verify settlement loaded
    const loaded = await page.evaluate(() => 
      !!document.querySelector('[data-demo="btn-send-settlement-to-finance"]')
    );
    if (!loaded) throw new Error('Settlement module did not load after nav click');
  });

  await step(page, 'Sending settlement to Finance...', async () => {
    await page.waitForTimeout(800);
    const clicked = await page.evaluate(() => {
      const btn = document.querySelector(
        '[data-demo="btn-send-settlement-to-finance"]'
      );
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    if (!clicked) {
      throw new Error('btn-send-settlement-to-finance not found in DOM');
    }
    await page.waitForTimeout(2000);
  });

  await step(page, 'Resetting scenario to altagas-clean...', async () => {
    await setMockScenario('altagas-clean');
    await page.waitForTimeout(500);
  });

  await showStatus(page, 'Settlement exception resolved and sent to Finance!');
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
