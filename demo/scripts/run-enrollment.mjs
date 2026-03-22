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
  setMockScenario,
  createDemoContext,
  closeDemoContextAndSaveVideo,
  writeFailure,
  playNarration,
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

    playNarration('enrollment', 'enrollment-start-btn');
    await step(page, 'Opening new enrollment modal...', async () => {
      await clickWithCursor(page, 'btn-new-enrollment');
    });

    playNarration('enrollment', 'enrollment-customer-form');
    await step(page, 'Entering customer details: Heather Mitchell...', async () => {
      await page.fill('[data-demo="enrollment-firstName"]', 'Heather');
      await page.fill('[data-demo="enrollment-lastName"]', 'Mitchell');
    });

    await step(page, 'Continuing to credit check...', async () => {
      await page.click('[data-demo="enrollment-continue-1"]');
    });

    playNarration('enrollment', 'enrollment-credit-check');
    await step(page, 'Running credit check...', async () => {
      await page.click('[data-demo="enrollment-run-credit"]');
      await page.waitForTimeout(2000);
    });

    await step(page, 'Credit approved. Continuing to plan selection...', async () => {
      await page.click('[data-demo="enrollment-continue-2"]');
    });

    playNarration('enrollment', 'enrollment-plan-select');
    await step(page, 'Selecting Variable plan. Continuing to banking...', async () => {
      await page.click('[data-demo="enrollment-continue-3"]');
    });

    playNarration('enrollment', 'enrollment-banking-form');
    await step(page, 'PAD setup complete. Continuing to confirm...', async () => {
      await page.click('[data-demo="enrollment-continue-4"]');
    });

    playNarration('enrollment', 'enrollment-approve-btn');
    await step(page, 'Enrolling customer...', async () => {
      await page.click('[data-demo="enrollment-submit"]');
      await page.waitForTimeout(3000);
    });

    await showStatus(page, 'Enrollment complete!');

    // Second act: credit failure scenario
    await step(page, 'Switching to credit-fail scenario...', async () => {
      await setMockScenario('credit-fail');
      await page.waitForTimeout(500);
    });

    await step(page, 'Opening new enrollment (credit fail path)...', async () => {
      await clickWithCursor(page, 'btn-new-enrollment');
      await page.waitForTimeout(600);
    });

    await step(page, 'Entering customer details...', async () => {
      await page.fill('[data-demo="enrollment-firstName"]', 'Test');
      await page.fill('[data-demo="enrollment-lastName"]', 'FailCredit');
    });

    await step(page, 'Enabling failed credit toggle and continuing...', async () => {
      const toggle = page.locator('[data-demo="toggle-failed-credit"]');
      if (await toggle.isVisible().catch(() => false)) await toggle.click();
      await page.waitForTimeout(400);
      await page.click('[data-demo="enrollment-continue-1"]').catch(() => {});
    });

    await step(page, 'Running credit check (expect declined)...', async () => {
      await page.click('[data-demo="enrollment-run-credit"]').catch(() => {});
      await page.waitForTimeout(2000);
    });

    await step(page, 'Selecting require deposit option...', async () => {
      const depositBtn = page.locator('[data-demo="btn-require-deposit"]');
      if (await depositBtn.isVisible().catch(() => false)) await depositBtn.click();
      await page.waitForTimeout(400);
    });

    await step(page, 'Marking deposit received...', async () => {
      const markBtn = page.locator('[data-demo="btn-mark-deposit-received"]');
      if (await markBtn.isVisible().catch(() => false)) await markBtn.click();
      await page.waitForTimeout(400);
    });

    await step(page, 'Resetting to credit-pass scenario...', async () => {
      await setMockScenario('credit-pass');
    });

    await showStatus(page, 'Enrollment scenario with credit-fail path complete.');
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
