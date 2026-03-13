#!/usr/bin/env node
/**
 * Runs all demo scenarios in sequence using a single browser session.
 */

import { chromium } from 'playwright';
import { LAUNCH_OPTIONS, clearStatus, createDemoContext, closeDemoContextAndSaveVideo } from './demo-runner.mjs';
import { runScenario as runDashboard } from './run-dashboard.mjs';
import { runScenario as runEnrollment } from './run-enrollment.mjs';
import { runScenario as runCustomerService } from './run-customer-service.mjs';
import { runScenario as runBilling } from './run-billing.mjs';
import { runScenario as runSettlement } from './run-settlement.mjs';
import { runScenario as runMarketers } from './run-marketers.mjs';
import { runScenario as runAnalytics } from './run-analytics.mjs';

const SCENARIOS = [
  ['dashboard', runDashboard],
  ['enrollment', runEnrollment],
  ['customer-service', runCustomerService],
  ['billing', runBilling],
  ['settlement', runSettlement],
  ['marketers', runMarketers],
  ['analytics', runAnalytics],
];

async function run() {
  const browser = await chromium.launch(LAUNCH_OPTIONS);

  try {
    for (const [label, runScenario] of SCENARIOS) {
      console.log(`\n--- Running ${label} ---\n`);
      const { context, page } = await createDemoContext(browser, label);
      page.setDefaultTimeout(15000);
      try {
        await runScenario(page);
      } catch (err) {
        await clearStatus(page);
        throw err;
      } finally {
        await closeDemoContextAndSaveVideo(context, page, label);
      }
    }
    console.log('\n--- All demos complete ---\n');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
