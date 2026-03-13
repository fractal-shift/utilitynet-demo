#!/usr/bin/env node
/**
 * Demo: Thena Analytics
 * Navigates to Analytics (Thena mode), opens Thena panel,
 * asks about Q2 revenue risks, builds 30-day action plan.
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

  await showScenarioSummary(page, 'Analytics + Thena: Prescriptive Intelligence', 'The ops lead opens Analytics to understand Q2. Thena doesn\'t just report what happened — it tells you what to do. We\'ll ask about top revenue risks and build a 30-day action plan with specific CAD amounts.');

  await step(page, 'Navigating to Analytics (Thena mode)...', async () => {
    await clickWithCursor(page, 'nav-analytics');
    await page.waitForTimeout(1000);
  });

  await step(page, 'Opening Thena panel...', async () => {
    await clickWithCursor(page, 'thena-toggle');
    await page.waitForTimeout(1000);
  });

  await step(page, 'Asking Thena about Q2 revenue risks...', async () => {
    await page.getByRole('button', { name: 'What are the top revenue risks in Q2?' }).click();
    await scrollReadThenaResponse(page);
  });

  await step(page, 'Thena is building the 30-day action plan...', async () => {
    await page.getByRole('button', { name: 'Build me a 30-day action plan' }).click();
    await scrollReadThenaResponse(page);
  });

  await step(page, 'Drafting collections email for top 5 accounts...', async () => {
    await page.getByRole('button', { name: 'Draft the collections email for the top 5 accounts' }).click();
    await scrollReadThenaResponse(page);
  });

  await step(page, 'Confirming Thena action...', async () => {
    const confirm = page.locator('[data-demo="thena-confirm"]');
    if (await confirm.isVisible().catch(() => false)) {
      await confirm.click();
    }
  });

  await showStatus(page, 'Thena analytics flow complete!');
  await clearStatus(page);
}

async function main() {
  const browser = await chromium.launch(LAUNCH_OPTIONS);
  const { context, page } = await createDemoContext(browser, 'analytics');
  page.setDefaultTimeout(15000);
  try {
    await runScenario(page);
  } catch (err) {
    console.error('Demo failed:', err.message);
    writeFailure('analytics', 0, 'analytics', '', err);
    await clearStatus(page);
    process.exit(1);
  } finally {
    await closeDemoContextAndSaveVideo(context, page, 'analytics');
    await browser.close();
  }
}

if (process.argv[1]?.endsWith('run-analytics.mjs')) {
  main();
}
