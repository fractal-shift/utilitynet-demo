#!/usr/bin/env node
/**
 * Demo: New Customer Enrollment
 * Navigates to Customers, opens enrollment modal, fills form (Heather Mitchell),
 * runs credit check, selects plan, completes PAD, enrolls.
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

    await showScenarioSummary(page, 'New Customer Enrollment', 'We\'ll enroll Heather Mitchell as a new residential customer: enter details, run credit check, select a Variable plan, and complete PAD setup. The partner marketer (NRG Direct) is notified automatically.');

    await step(page, 'Navigating to Customers...', async () => {
      await clickWithCursor(page, 'nav-customers');
    });

    await step(page, 'Opening new enrollment modal...', async () => {
      await clickWithCursor(page, 'btn-new-enrollment');
    });

    await step(page, 'Entering customer details: Heather Mitchell...', async () => {
      await page.fill('[data-demo="enrollment-firstName"]', 'Heather');
      await page.fill('[data-demo="enrollment-lastName"]', 'Mitchell');
    });

    await step(page, 'Continuing to credit check...', async () => {
      await page.click('[data-demo="enrollment-continue-1"]');
    });

    await step(page, 'Running credit check...', async () => {
      await page.click('[data-demo="enrollment-run-credit"]');
      await page.waitForTimeout(2000);
    });

    await step(page, 'Credit approved. Continuing to plan selection...', async () => {
      await page.click('[data-demo="enrollment-continue-2"]');
    });

    await step(page, 'Selecting Variable plan. Continuing to banking...', async () => {
      await page.click('[data-demo="enrollment-continue-3"]');
    });

    await step(page, 'PAD setup complete. Continuing to confirm...', async () => {
      await page.click('[data-demo="enrollment-continue-4"]');
    });

    await step(page, 'Enrolling customer...', async () => {
      await page.click('[data-demo="enrollment-submit"]');
      await page.waitForTimeout(3000);
    });

    await showStatus(page, 'Enrollment complete!');
    await clearStatus(page);
}

async function main() {
  const browser = await chromium.launch(LAUNCH_OPTIONS);
  const { context, page } = await createDemoContext(browser, 'enrollment');
  page.setDefaultTimeout(10000);
  try {
    await runScenario(page);
  } catch (err) {
    console.error('Demo failed:', err.message);
    writeFailure('enrollment', 0, 'enrollment', '', err);
    await clearStatus(page);
    process.exit(1);
  } finally {
    await closeDemoContextAndSaveVideo(context, page, 'enrollment');
    await browser.close();
  }
}

if (process.argv[1]?.endsWith('run-enrollment.mjs')) {
  main();
}
