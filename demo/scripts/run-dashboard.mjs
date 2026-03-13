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

  await showScenarioSummary(page, 'Operations Dashboard', 'We\'ll walk through the executive dashboard: KPIs, revenue trend, predictive insights, and today\'s tasks. The dashboard gives leadership a single view of operations.');

  await step(page, 'Viewing Dashboard KPIs...', async () => {
    await clickWithCursor(page, 'nav-dashboard');
    await page.waitForTimeout(1000);
    await highlightDashboardSection(page, '[data-demo="dashboard-kpis"]', 'Revenue $2.34M MTD (+12.4%). Settlement 98.2% reconciled.');
  });

  await step(page, 'Reviewing revenue trend...', async () => {
    await highlightDashboardSection(page, '[data-demo="dashboard-revenue-chart"]', '12-month trend shows steady growth; March tracking above forecast.');
  });

  await step(page, 'Clicking Late Payment risk card to review...', async () => {
    await highlightDashboardSection(page, '[data-demo="dashboard-late-payment-card"]', '17 accounts at risk, $41,200 exposure.');
    await clickWithCursor(page, 'dashboard-late-payment-review');
    await page.waitForTimeout(2000);
  });

  await step(page, 'Navigating to Billing exceptions from task list...', async () => {
    await clickWithCursor(page, 'nav-dashboard');
    await page.waitForTimeout(500);
    await highlightDashboardSection(page, '[data-demo="dashboard-tasks"]', '3 billing exceptions require review.');
    await clickWithCursor(page, 'dashboard-task-billing');
    await page.waitForTimeout(3000);
  });

  await showStatus(page, 'Dashboard scenario complete!');
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
