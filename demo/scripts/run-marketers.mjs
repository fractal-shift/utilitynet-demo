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
  scrollReadEmberlynResponse,
  scrollReadThenaResponse,
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

  await showScenarioSummary(page, 'Marketers — Margin, Statements & Commissions', 'We\'ll set marketer margin, generate a monthly statement, post commissions to GL, then onboard a new partner. Uses setMockScenario for scenario control.');

  await step(page, 'Setting mock scenario for marketers flow...', async () => {
    await setMockScenario('credit-pass');
    await page.waitForTimeout(500);
  });

  playNarration('marketers', 'marketer-dashboard');
  await step(page, 'Navigating to Marketers...', async () => {
    await clickWithCursor(page, 'nav-marketers');
  });

  playNarration('marketers', 'marketer-customers-tab');
  await step(page, 'Reviewing marketer customer book...', async () => {
    await page.evaluate(() => {
      const table = document.querySelector('[data-demo="marketer-journal-entries-table"]');
      if (table) table.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await page.waitForTimeout(800);
  });

  await showStatus(page, 'Marketer directory loaded — 6 active partners · NRG Direct leads at $841K revenue MTD · 284 new enrollments this month.');

  playNarration('marketers', 'marketer-margin-input');
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

  playNarration('marketers', 'marketer-revenue-report');
  await step(page, 'Reviewing partner revenue report...', async () => {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(800);
  });

  await showStatus(page, 'Partner revenue MTD: $2.34M — ↑ 11.2% MoM. Commission run JE-2026-0088 · Account 2100 · $1,208,400 ready to post.');

  await step(page, 'Posting commissions to GL...', async () => {
    await clickWithCursor(page, 'btn-post-commissions-to-gl');
    await page.waitForTimeout(2000);
  });

  await step(page, 'Opening Emberlyn for marketer performance ideas...', async () => {
    await clickWithCursor(page, 'emberlyn-toggle');
    await page.waitForTimeout(800);
  });

  await step(page, 'Asking Emberlyn for ideas to help marketers perform better...', async () => {
    const input = page.locator('[data-demo="emberlyn-input"], textarea[placeholder="Ask Emberlyn..."]').first();
    await input.fill('What are some innovative ideas to help our underperforming marketers improve their conversion rates and grow their customer base?');
    await input.press('Enter');
    await page.waitForTimeout(500);
  });

  await scrollReadEmberlynResponse(page);

  await showStatus(page, 'Emberlyn generates targeted strategies for each underperforming partner — specific to their customer mix, territory, and rate structure. AI-powered partner management.');

  await step(page, 'Closing Emberlyn, asking Thena for revenue forecast...', async () => {
    await clickWithCursor(page, 'emberlyn-close');
    await page.waitForTimeout(400);
    await clickWithCursor(page, 'nav-analytics');
    await page.waitForTimeout(800);
    await clickWithCursor(page, 'thena-toggle');
    await page.waitForTimeout(800);
  });

  await step(page, 'Asking Thena for Q2 marketer revenue forecast...', async () => {
    const input = page.locator('input[placeholder="Ask Thena..."]').first();
    await input.fill('Forecast Q2 marketer revenue — which partners will grow and which are at risk of churning their customer base?');
    await input.press('Enter');
    await page.waitForTimeout(500);
  });

  await scrollReadThenaResponse(page);

  await showStatus(page, 'Thena forecasts Q2 marketer performance with confidence intervals. Proactive partner management — before the quarter ends, not after.');

  await step(page, 'Returning to Marketers...', async () => {
    await clickWithCursor(page, 'nav-marketers');
    await page.waitForTimeout(600);
  });

  playNarration('marketers', 'marketer-plan-create');
  await step(page, 'Opening Onboard Marketer modal...', async () => {
    await clickWithCursor(page, 'btn-onboard-marketer');
    await page.waitForTimeout(2000);
  });

  await step(page, 'Entering marketer details: SolarEdge Energy...', async () => {
    await page.fill('[data-demo="marketer-name"]', 'SolarEdge Energy');
    await page.waitForTimeout(1500);
  });

  await step(page, 'Submitting onboarding...', async () => {
    await clickWithCursor(page, 'btn-save-margin');
    await page.waitForTimeout(3000);
  });

  await showStatus(page, 'Marketer flow complete — margin, statement, commissions, onboarded!');
  await page.waitForTimeout(2000);
  await showStatus(page, '✦ Marketers Complete — 52 partner channels managed. Margins configured. Commissions calculated and posted automatically. Cash calls tracked. Monthly statements generated. NRG Direct at $841K — every dollar accounted for without a single email to Finance.');
  await page.waitForTimeout(5000);
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
