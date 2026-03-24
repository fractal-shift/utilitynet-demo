#!/usr/bin/env node
/**
 * Demo: Thena Analytics — drill-down, GL export, compliance, ad-hoc
 * Navigates to Analytics, clicks analytics-drill-revenue, btn-analytics-export-gl,
 * compliance tab, btn-run-adhoc-report, then Thena flow.
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
  playNarration,
  setDemoRole,
} from './demo-runner.mjs';

export async function runScenario(page) {
  await step(page, 'Opening UTILITYnet demo...', async () => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  await dismissApiKeyModal(page);
  await setDemoRole(page, 'Chief Executive Officer');

  await showScenarioSummary(page, 'Analytics + Thena: Prescriptive Intelligence', 'The ops lead opens Analytics. We\'ll drill into revenue, export to GL, check compliance tab, run ad-hoc report, then ask Thena about Q2 risks and build a 30-day action plan.');

  await playNarration(page, 'analytics', 'analytics-overview');
  await step(page, 'Navigating to Analytics (Thena mode)...', async () => {
    await clickWithCursor(page, 'nav-analytics');
    await page.waitForTimeout(1000);
  });

  await playNarration(page, 'analytics', 'analytics-revenue-panel');
  await step(page, 'Drilling into revenue...', async () => {
    await clickWithCursor(page, 'analytics-drill-revenue');
    await page.waitForTimeout(1500);
  });

  await step(page, 'Exporting to GL...', async () => {
    await clickWithCursor(page, 'btn-analytics-export-gl');
    await page.waitForTimeout(1500);
  });

  await playNarration(page, 'analytics', 'analytics-marketer-panel');
  await step(page, 'Reviewing marketer revenue performance...', async () => {
    await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('div')).find(
        (el) => el.textContent.trim() === 'Marketer Revenue Ranking'
      );
      if (heading) heading.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await page.waitForTimeout(1200);
  });

  await step(page, 'Opening Compliance tab...', async () => {
    const complianceTab = page.locator('button:has-text("Compliance")');
    if (await complianceTab.isVisible().catch(() => false)) {
      await complianceTab.click();
      await page.waitForTimeout(1000);
    }
    const table = page.locator('[data-demo="compliance-report-table"]');
    if (await table.isVisible().catch(() => false)) {
      const genBtn = page.locator('[data-demo="btn-generate-compliance-report"]');
      if (await genBtn.isVisible().catch(() => false)) {
        await genBtn.click();
        await page.waitForTimeout(500);
      }
    }
  });

  await step(page, 'Running ad-hoc report...', async () => {
    await page.getByText('Ad-hoc').click();
    await page.waitForTimeout(500);
    await clickWithCursor(page, 'btn-run-adhoc-report');
    await page.waitForTimeout(1500);
  });

  await playNarration(page, 'analytics', 'analytics-thena-panel');
  await step(page, 'Opening Thena panel...', async () => {
    const thenaToggle = page.locator('[data-demo="thena-toggle"]');
    if (await thenaToggle.isVisible().catch(() => false)) {
      await thenaToggle.click();
    } else {
      const fullPlan = page.locator('button:has-text("Full 30-Day Plan")');
      if (await fullPlan.isVisible().catch(() => false)) await fullPlan.click();
    }
    await page.waitForTimeout(1000);
  });

  await step(page, 'Asking Thena about Q2 revenue risks...', async () => {
    const btn = page.getByRole('button', { name: 'What are the top revenue risks in Q2?' });
    if (await btn.isVisible().catch(() => false)) {
      await btn.click();
      await scrollReadThenaResponse(page);
    }
  });

  await step(page, 'Thena is building the 30-day action plan...', async () => {
    const btn = page.getByRole('button', { name: 'Build me a 30-day action plan' });
    if (await btn.isVisible().catch(() => false)) {
      await btn.click();
      await scrollReadThenaResponse(page);
    }
  });

  await step(page, 'Drafting collections email for top 5 accounts...', async () => {
    const btn = page.getByRole('button', { name: 'Draft the collections email for the top 5 accounts' });
    if (await btn.isVisible().catch(() => false)) {
      await btn.click();
      await scrollReadThenaResponse(page);
    }
  });

  await step(page, 'Confirming Thena action...', async () => {
    const confirm = page.locator('[data-demo="thena-confirm"]');
    if (await confirm.isVisible().catch(() => false)) {
      await confirm.click();
    }
  });

  await showStatus(page, 'Analytics flow complete — drill, GL export, compliance, ad-hoc, Thena!');
  await page.waitForTimeout(2000);
  await showStatus(page, '✦ Analytics Complete — Revenue drill-down to invoice level. Churn risk modeled. Late payment exposure quantified. Compliance reports generated. Ad-hoc queries answered in seconds. Thena turns your data into decisions — no analyst required.');
  await page.waitForTimeout(5000);
  await setDemoRole(page, null);
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
