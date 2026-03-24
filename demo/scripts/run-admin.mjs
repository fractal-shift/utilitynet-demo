#!/usr/bin/env node
/**
 * Demo: Admin — Operations Console + Alden System Architecture
 * Shows integration health, security posture, then Alden answers hard
 * system and migration architecture questions live.
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
  scrollReadAldenResponse,
  createDemoContext,
  closeDemoContextAndSaveVideo,
  writeFailure,
  setDemoRole,
} from './demo-runner.mjs';

export async function runAdmin(page) {
  await step(page, 'Opening UTILITYnet demo...', async () => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  await dismissApiKeyModal(page);
  await setDemoRole(page, 'System Administrator');

  await showScenarioSummary(page, 'Admin — Operations Console & System Architecture', 'We\'ll walk through the Operations Console showing live integration health, then open Alden — the system companion — to answer the hardest architecture and migration questions any evaluator would ask.');

  await step(page, 'Navigating to Admin...', async () => {
    await clickWithCursor(page, 'nav-admin');
    await page.waitForTimeout(800);
  });

  await showStatus(page, 'Admin module — Integrations, Operations Console, Security. Full platform visibility.');

  await step(page, 'Viewing live integration status...', async () => {
    await clickWithCursor(page, 'admin-tab-integrations');
    await page.waitForTimeout(600);
  });

  await showStatus(page, 'AESO, RBC, ATCO, AltaGas — all feeds live. Last sync timestamps showing real-time connectivity. No manual checks. No status emails.');

  await step(page, 'Opening Operations Console...', async () => {
    await clickWithCursor(page, 'admin-tab-ops-console');
    await page.waitForTimeout(800);
  });

  await showStatus(page, 'Feed health: all 4 integration feeds nominal. Job queue: billing batch, settlement reconciliation, GL posting all completed. One alert — AltaGas delayed, auto-retry queued. The platform monitors itself.');

  await step(page, 'Viewing Security posture...', async () => {
    await clickWithCursor(page, 'admin-tab-security');
    await page.waitForTimeout(600);
  });

  await showStatus(page, 'Azure AD SSO enforced. MFA at 100% adoption. PIPEDA compliant — Canadian data residency on AWS ca-central-1. SOC 2 Type II in progress. RTO under 4 hours. This is enterprise-grade from day one.');

  await step(page, 'Opening Alden for migration architecture question...', async () => {
    await clickWithCursor(page, 'alden-toggle');
    await page.waitForTimeout(1000);
  });

  await step(page, 'Asking Alden how Oracle data migration works...', async () => {
    const input = page.locator('[data-demo="alden-input"], input[placeholder="Ask Alden..."]').first();
    await input.fill('How do you actually migrate our Oracle PL/SQL stored procedures and 14 years of billing history without breaking anything?');
    await input.press('Enter');
    await page.waitForTimeout(500);
  });

  await scrollReadAldenResponse(page);

  await showStatus(page, 'Alden explains the migration architecture — extract, rewrite as platform-native rules, parallel run until zero variance. No black boxes. No lift-and-shift. This is how you actually migrate an Oracle system.');

  await step(page, 'Asking Alden the AI architecture question...', async () => {
    const input = page.locator('[data-demo="alden-input"], input[placeholder="Ask Alden..."]').first();
    await input.fill('Is the AI just a chatbot sitting on top of the system, or is it actually embedded in the architecture?');
    await input.press('Enter');
    await page.waitForTimeout(500);
  });

  await scrollReadAldenResponse(page);

  await showStatus(page, 'Alden explains the AI-native architecture — Emberlyn and Thena read from live operational data, not exports or snapshots. That is the difference between a chatbot and a platform built for AI from the ground up.');

  await page.waitForTimeout(2000);
  await showStatus(page, '✦ Admin Complete — Live integration monitoring. Enterprise security posture. And Alden answered your two hardest questions without hesitation. The platform knows its own architecture. That is what AI-native means.');
  await page.waitForTimeout(5000);
  await setDemoRole(page, null);
  await clearStatus(page);
}

async function main() {
  const browser = await chromium.launch(LAUNCH_OPTIONS);
  const { context, page } = await createDemoContext(browser, 'admin');
  try {
    await runAdmin(page);
  } catch (err) {
    console.error('Demo failed:', err.message);
    writeFailure('admin', 0, 'admin', '', err);
    await clearStatus(page);
    process.exit(1);
  } finally {
    await closeDemoContextAndSaveVideo(context, page, 'admin');
    await browser.close();
  }
}

if (process.argv[1]?.endsWith('run-admin.mjs')) {
  main();
}
