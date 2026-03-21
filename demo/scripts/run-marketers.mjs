#!/usr/bin/env node
/**
 * Demo: Marketers — Margin, statements, commissions, onboard partner
 * Uses setMockScenario for scenario control. Margin setting, statement generation,
 * btn-post-commissions-to-gl, then onboard marketer.
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
} from './demo-runner.mjs';

export async function runScenario(page) {
  await step(page, 'Opening UTILITYnet demo...', async () => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  await dismissApiKeyModal(page);

  await showScenarioSummary(page, 'Marketers — Margin, Statements & Commissions', 'We\'ll set marketer margin, generate a monthly statement, post commissions to GL, then onboard a new partner. Uses setMockScenario for scenario control.');

  await step(page, 'Setting mock scenario for marketers flow...', async () => {
    await setMockScenario('credit-pass');
    await page.waitForTimeout(500);
  });

  await step(page, 'Navigating to Marketers...', async () => {
    await clickWithCursor(page, 'nav-marketers');
  });

  await step(page, 'Updating marketer margin...', async () => {
    const marginInput = page.locator('[data-demo="marketer-margin-input"]');
    await marginInput.fill('0.92');
    await page.waitForTimeout(800);
  });

  await step(page, 'Saving margin...', async () => {
    await clickWithCursor(page, 'btn-save-margin');
    await page.waitForTimeout(1500);
  });

  await step(page, 'Generating monthly statement...', async () => {
    await clickWithCursor(page, 'btn-generate-statement');
    await page.waitForTimeout(1500);
    const approve = page.locator('button:has-text("Approve & Post to Finance")');
    if (await approve.isVisible().catch(() => false)) {
      await approve.click();
      await page.waitForTimeout(1500);
    }
  });

  await step(page, 'Sending cash call reminder (optional)...', async () => {
    const btn = page.locator('[data-demo="btn-cash-call-reminder"]');
    if (await btn.isVisible().catch(() => false)) {
      await btn.click();
      await page.waitForTimeout(500);
    }
  });

  await step(page, 'Posting commissions to GL...', async () => {
    await clickWithCursor(page, 'btn-post-commissions-to-gl');
    await page.waitForTimeout(2000);
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

  await showStatus(page, 'Marketer flow complete — margin, statement, commissions, onboarded!');
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
