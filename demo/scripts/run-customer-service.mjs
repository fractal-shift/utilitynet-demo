#!/usr/bin/env node
/**
 * Demo: Customer Service + Emberlyn
 * Opens MacGregor Industrial Ltd. (C-10478) in Customer 360, opens Emberlyn,
 * asks to summarize issues, drafts email, confirms action.
 * Per 30-min demo script: EXCEPTION status, $8,400 balance, GreenPath.
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
} from './demo-runner.mjs';

export async function runScenario(page) {
  await step(page, 'Opening UTILITYnet demo...', async () => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  await dismissApiKeyModal(page);

  await showScenarioSummary(page, 'Customer Service + Emberlyn', 'A billing complaint came in from MacGregor Industrial Ltd. ($8,400 balance, EXCEPTION). We\'ll use Customer 360 to view the account, then Emberlyn to summarize issues, draft a response, and confirm the follow-up actions.');

  await playNarration(page, 'enrollment', 'enrollment-start-btn');
  await step(page, 'Navigating to Customers...', async () => {
    await clickWithCursor(page, 'nav-customers');
  });

  await playNarration(page, 'enrollment', 'enrollment-customer-form');
  await step(page, 'Opening Customer 360 for MacGregor Industrial Ltd....', async () => {
    await clickWithCursor(page, 'row-C-10478');
  });

  await playNarration(page, 'enrollment', 'enrollment-credit-check');
  await step(page, 'Opening Emberlyn to draft customer email...', async () => {
    await clickWithCursor(page, 'customer360-draft-email');
    await page.waitForTimeout(1000);
  });

  await step(page, "Asking Emberlyn to summarize customer issues...", async () => {
    await page.getByRole('button', { name: "Summarize this customer's recent issues" }).click();
    await scrollReadEmberlynResponse(page);
  });

  await step(page, "Emberlyn is drafting the response...", async () => {
    await page.getByRole('button', { name: 'Draft a response explaining the last invoice' }).click();
    await scrollReadEmberlynResponse(page);
  });

  await playNarration(page, 'enrollment', 'enrollment-approve-btn');
  await step(page, "Confirming Emberlyn's proposed action...", async () => {
    const confirm = page.locator('[data-demo="emberlyn-confirm"]');
    await confirm.waitFor({ state: 'visible', timeout: 5000 });
    await confirm.click();
  });

  await showStatus(page, 'Customer Service flow complete!');
  await page.waitForTimeout(2000);
  await showStatus(page, '✦ Customer Service Complete — Billing dispute received, investigated, drafted response, case updated, credit memo created in Finance. 90 seconds. No hold music. No escalation. No switching systems. Emberlyn handled the investigation — your team handled the relationship.');
  await page.waitForTimeout(5000);
  await clearStatus(page);
}

async function main() {
  const browser = await chromium.launch(LAUNCH_OPTIONS);
  const { context, page } = await createDemoContext(browser, 'customer-service');
  page.setDefaultTimeout(15000);
  try {
    await runScenario(page);
  } catch (err) {
    console.error('Demo failed:', err.message);
    writeFailure('customer-service', 0, 'customer-service', '', err);
    await clearStatus(page);
    process.exit(1);
  } finally {
    await closeDemoContextAndSaveVideo(context, page, 'customer-service');
    await browser.close();
  }
}

if (process.argv[1]?.endsWith('run-customer-service.mjs')) {
  main();
}
