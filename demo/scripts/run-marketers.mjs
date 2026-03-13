#!/usr/bin/env node
/**
 * Demo: Marketers — Onboard new partner
 * Navigates to Marketers, opens onboarding modal, adds a new marketer.
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

  await showScenarioSummary(page, 'Onboard Marketer', 'We\'ll add a new partner marketer to the directory. This flow shows how quickly new partners can be onboarded without leaving the platform.');

  await step(page, 'Navigating to Marketers...', async () => {
    await clickWithCursor(page, 'nav-marketers');
  });

  await step(page, 'Opening Onboard Marketer modal...', async () => {
    await clickWithCursor(page, 'btn-onboard-marketer');
    await page.waitForTimeout(2000);
  });

  await step(page, 'Entering marketer details: SolarEdge Energy...', async () => {
    await page.fill('[data-demo="marketer-name"]', 'SolarEdge Energy');
    await page.waitForTimeout(1500);
  });

  await step(page, 'Submitting onboarding...', async () => {
    await clickWithCursor(page, 'marketer-submit');
    await page.waitForTimeout(3000);
  });

  await showStatus(page, 'Marketer onboarded successfully!');
  await clearStatus(page);
}

async function main() {
  const browser = await chromium.launch(LAUNCH_OPTIONS);
  const { context, page } = await createDemoContext(browser, 'marketers');
  page.setDefaultTimeout(15000);
  try {
    await runScenario(page);
  } catch (err) {
    console.error('Demo failed:', err.message);
    writeFailure('marketers', 0, 'marketers', '', err);
    await clearStatus(page);
    process.exit(1);
  } finally {
    await closeDemoContextAndSaveVideo(context, page, 'marketers');
    await browser.close();
  }
}

if (process.argv[1]?.endsWith('run-marketers.mjs')) {
  main();
}
