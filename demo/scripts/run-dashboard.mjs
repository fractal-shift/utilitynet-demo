#!/usr/bin/env node
/**
 * Demo: Operations Dashboard
 * Walks through KPIs, predictive insights, timeline tasks.
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
  highlightDashboardSection,
  scrollReadEmberlynResponse,
  scrollReadThenaResponse,
  createDemoContext,
  closeDemoContextAndSaveVideo,
  writeFailure,
  playNarration,
  setDemoRole,
} from './demo-runner.mjs';

export async function runScenario(page) {
  await step(page, 'Opening UTILITYnet demo...', async () => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  await dismissApiKeyModal(page);
  await setDemoRole(page, 'Operations Manager');

  await playNarration(page, 'dashboard', 'dashboard-overview');
  await showScenarioSummary(page, 'Operations Dashboard', 'We\'ll walk through the executive dashboard: KPIs, revenue trend, predictive insights, and today\'s tasks. The dashboard gives leadership a single view of operations.');

  await playNarration(page, 'dashboard', 'dashboard-kpis');
  await step(page, 'Viewing Dashboard KPIs...', async () => {
    await clickWithCursor(page, 'nav-dashboard');
    await page.waitForTimeout(1000);
    await highlightDashboardSection(page, '[data-demo="dashboard-kpis"]', 'Revenue $2.34M MTD (+12.4%). Settlement 98.2% reconciled.');
  });

  await playNarration(page, 'dashboard', 'dashboard-revenue-trend');
  await step(page, 'Reviewing revenue trend...', async () => {
    await highlightDashboardSection(page, '[data-demo="dashboard-revenue-chart"]', '12-month trend shows steady growth; March tracking above forecast.');
  });

  await playNarration(page, 'dashboard', 'dashboard-predictive');
  await step(page, 'Reviewing Late Payment risk card...', async () => {
    await highlightDashboardSection(page, '[data-demo="dashboard-late-payment-card"]', '17 accounts at risk, $41,200 exposure. Emberlyn can draft the outreach instantly.');
    await page.waitForTimeout(1000);
  });

  await setDemoRole(page, 'Chief Executive Officer');

  await step(page, 'Opening Emberlyn for business forecast...', async () => {
    await clickWithCursor(page, 'emberlyn-toggle');
    await page.waitForTimeout(800);
  });

  await step(page, 'Asking Emberlyn for 12-month business prediction...', async () => {
    const input = page.locator('[data-demo="emberlyn-input"], textarea[placeholder="Ask Emberlyn..."]').first();
    await input.fill('Based on what you see right now — what do you predict will happen to our business in the next 12 months?');
    await input.press('Enter');
    await page.waitForTimeout(500);
  });

  await scrollReadEmberlynResponse(page);

  await showStatus(page, 'Emberlyn analyzes live operations data and models the next 12 months — growth, risks, and the actions that will matter most. This is what a senior advisor would tell you. In seconds.');

  await step(page, 'Closing Emberlyn...', async () => {
    await clickWithCursor(page, 'emberlyn-close');
    await page.waitForTimeout(500);
  });

  await playNarration(page, 'dashboard', 'dashboard-tasks');
  await step(page, 'Navigating to Billing exceptions from task list...', async () => {
    await clickWithCursor(page, 'nav-dashboard');
    await page.waitForTimeout(500);
    await highlightDashboardSection(page, '[data-demo="dashboard-tasks"]', '3 billing exceptions require review.');
    await clickWithCursor(page, 'dashboard-task-billing');
    await page.waitForTimeout(3000);
  });

  await showStatus(page, 'Dashboard scenario complete!');
  await page.waitForTimeout(2000);
  await showStatus(page, '✦ Operations Dashboard — $2.34M revenue live. 14,291 customers. 52 marketer partners. 17 risks flagged proactively. No report to run. No spreadsheet to refresh. Leadership has the full picture in one view.');
  await page.waitForTimeout(5000);
  await setDemoRole(page, null);
  await clearStatus(page);
}

async function main() {
  const browser = await chromium.launch(LAUNCH_OPTIONS);
  const { context, page } = await createDemoContext(browser, 'dashboard');
  try {
    await runScenario(page);
  } catch (err) {
    console.error('Demo failed:', err.message);
    writeFailure('dashboard', 0, 'dashboard', '', err);
    await clearStatus(page);
    process.exit(1);
  } finally {
    await closeDemoContextAndSaveVideo(context, page, 'dashboard');
    await browser.close();
  }
}

if (process.argv[1]?.endsWith('run-dashboard.mjs')) {
  main();
}
