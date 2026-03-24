#!/usr/bin/env node
/**
 * Demo: Settlement Exception + Emberlyn
 * Uses setMockScenario('altagas-variance') before invoice ingest so Emberlyn
 * has real invoice data. Adds btn-send-settlement-to-finance step.
 * Resets to altagas-clean at end.
 *
 * Troubleshooting: run with DEMO_DEBUG=1 for step-by-step diagnostic logs.
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
  setMockScenario,
  createDemoContext,
  closeDemoContextAndSaveVideo,
  writeFailure,
  DEMO_VIEWPORT,
  playNarration,
} from './demo-runner.mjs';

const DEBUG = process.env.DEMO_DEBUG === '1';

async function resetSettlementViewport(page) {
  await page.evaluate(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
  await page.waitForTimeout(250);
}

/** Returns diagnostic snapshot: DOM presence, visibility, viewport, key elements. */
async function diagnose(page, label) {
  const info = await page.evaluate(() => {
    const sel = (q) => document.querySelector(q);
    const all = (q) => document.querySelectorAll(q);
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height) };
    };
    const inViewport = (r) => r && r.top >= -2 && r.left >= -2 && r.right <= window.innerWidth + 2 && r.bottom <= window.innerHeight + 2;

    const check = (selector, name) => {
      const el = sel(selector);
      const r = rect(el);
      return {
        inDom: !!el,
        count: all(selector).length,
        rect: r,
        inViewport: r ? inViewport({ ...r, right: r.left + r.width, bottom: r.top + r.height }) : false,
      };
    };

    const activeNav = Array.from(document.querySelectorAll('[data-demo^="nav-"]')).find((n) => n.getAttribute('data-active') === 'true');
    const main = sel('main');
    const mainH1 = main?.querySelector('h1');
    const activeDemo = activeNav?.getAttribute('data-demo');
    const activeModule = activeDemo?.replace(/^nav-/, '') || null;

    const allDemoEls = Array.from(document.querySelectorAll('[data-demo]')).map((el) => ({
      demo: el.getAttribute('data-demo'),
      tag: el.tagName,
      text: el.textContent?.slice(0, 50),
    }));

    return {
      label: 'page-context',
      viewport: { width: window.innerWidth, height: window.innerHeight },
      url: window.location.href,
      activeModule,
      activeNavDemo: activeDemo,
      mainContent: main?.innerText?.slice(0, 200) || null,
      mainH1: mainH1?.textContent || null,
      rootChildren: document.getElementById('root')?.children?.length ?? 0,
      'emberlyn-close': check('[data-demo="emberlyn-close"]'),
      'emberlyn-toggle': check('[data-demo="emberlyn-toggle"]'),
      'thena-toggle': check('[data-demo="thena-toggle"]'),
      'btn-send-settlement-to-finance': check('[data-demo="btn-send-settlement-to-finance"]'),
      'nav-settlement': check('[data-demo="nav-settlement"]'),
      'btn-draft-altagas': check('[data-demo="btn-draft-altagas"]'),
      bodyScroll: { scrollTop: document.documentElement.scrollTop, scrollLeft: document.documentElement.scrollLeft },
      allDataDemoElements: allDemoEls,
    };
  });
  const out = { step: label, ...info };
  if (DEBUG) console.log('[DIAG]', JSON.stringify(out, null, 2));
  return out;
}

/** Log one-liner summary for quick scanning. */
function logDiag(d, label) {
  if (!DEBUG) return;
  const e = d['emberlyn-close'];
  const s = d['btn-send-settlement-to-finance'];
  console.log(`[DIAG ${label}] viewport=${d.viewport?.width}x${d.viewport?.height} | emberlyn-close: inDom=${e?.inDom} inView=${e?.inViewport} | send-btn: inDom=${s?.inDom} inView=${s?.inViewport}`);
}

function settlementSendButton(page) {
  return page.locator('[data-demo="btn-send-settlement-to-finance"]').or(
    page.getByRole('button', { name: /Send Reconciliation to Finance/i })
  ).or(
    page.locator('main button:has-text("Send")')
  ).first();
}

async function ensureAppShellReady(page) {
  const navSettlement = page.locator('[data-demo="nav-settlement"]');
  if (await navSettlement.isVisible({ timeout: 10000 }).catch(() => false)) return;

  const bootDiag = await page.evaluate(() => ({
    url: window.location.href,
    title: document.title,
    bodyText: document.body?.innerText?.slice(0, 1200) || '',
    bodyHtml: document.body?.innerHTML?.slice(0, 1200) || '',
    rootHtml: document.getElementById('root')?.innerHTML?.slice(0, 1200) || '',
    readyState: document.readyState,
  }));

  throw new Error(`App shell did not load. Boot diagnostics: ${JSON.stringify(bootDiag)}`);
}

async function ensureSettlementReady(page) {
  await resetSettlementViewport(page);
  const sendBtn = settlementSendButton(page);

  if (await sendBtn.isVisible({ timeout: 2500 }).catch(() => false)) return sendBtn;

  const dInitial = await diagnose(page, 'ensure-settlement-ready-initial');
  logDiag(dInitial, 'ensure-settlement-ready-initial');

  const closeBtn = page.locator('[data-demo="emberlyn-close"]');
  if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await clickWithCursor(page, 'emberlyn-close');
    await page.waitForTimeout(500);
    await resetSettlementViewport(page);
    if (await sendBtn.isVisible({ timeout: 2500 }).catch(() => false)) return sendBtn;
  }

  await page.reload({ waitUntil: 'networkidle' });
  await dismissApiKeyModal(page);
  await clickWithCursor(page, 'nav-settlement');
  await page.waitForTimeout(800);
  await resetSettlementViewport(page);
  await sendBtn.waitFor({ state: 'visible', timeout: 5000 });
  return sendBtn;
}

export async function runScenario(page) {
  // Layout needs ~1660px (sidebar + main + Emberlyn panel). Default 1600 clips
  // the panel's right edge, putting the close button off-screen so Playwright can't click it.
  await page.setViewportSize({ width: 1800, height: DEMO_VIEWPORT.height });

  await step(page, 'Opening UTILITYnet demo...', async () => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await ensureAppShellReady(page);
  });

  await dismissApiKeyModal(page);

  await showScenarioSummary(page, 'Settlement Reconciliation + Emberlyn', 'AltaGas submitted an invoice that doesn\'t match UTILITYnet\'s calculations ($1,640 variance). We\'ll set altagas-variance scenario before ingest, ask Emberlyn for root cause, draft the response, accept UTILITYnet figures, send to Finance, then reset to altagas-clean.');

  playNarration('settlement', 'settlement-import-btn');
  await step(page, 'Setting mock scenario altagas-variance before invoice ingest...', async () => {
    await setMockScenario('altagas-variance');
    await page.waitForTimeout(500);
  });

  playNarration('settlement', 'settlement-match-table');
  await step(page, 'Navigating to Settlement...', async () => {
    await clickWithCursor(page, 'nav-settlement');
  });

  await step(page, 'Opening Emberlyn for AltaGas exception...', async () => {
    await clickWithCursor(page, 'btn-draft-altagas');
    await page.waitForTimeout(1000);
  });

  playNarration('settlement', 'settlement-emberlyn-insight');
  await step(page, "Asking Emberlyn for root cause analysis...", async () => {
    await page.getByRole('button', { name: 'What is the root cause of this mismatch?' }).click();
    await scrollReadEmberlynResponse(page);
  });

  await step(page, "Emberlyn is drafting the dispute response...", async () => {
    await page.getByRole('button', { name: 'Draft a professional response to AltaGas' }).click();
    await scrollReadEmberlynResponse(page);
  });

  playNarration('settlement', 'settlement-marketer-allocation');
  await step(page, "Accepting UTILITYnet figures...", async () => {
    const confirm = page.locator('[data-demo="emberlyn-confirm"]');
    if (await confirm.isVisible().catch(() => false)) {
      await confirm.click();
    } else {
      await page.locator('[data-demo="btn-resolve-altagas"]').click();
    }
    await page.waitForTimeout(1000);
    await resetSettlementViewport(page);
    const dAccept = await diagnose(page, 'immediately-after-accept');
    if (DEBUG) console.log('[DIAG] Immediately after Accept:', JSON.stringify({ activeModule: dAccept.activeModule, mainH1: dAccept.mainH1, sendBtnInDom: dAccept['btn-send-settlement-to-finance']?.inDom, emberlynCloseInDom: dAccept['emberlyn-close']?.inDom }, null, 2));
  });

  await step(page, 'Closing Emberlyn panel...', async () => {
    const dBefore = await diagnose(page, 'before-close');
    logDiag(dBefore, 'before-close');

    const closeBtn = page.locator('[data-demo="emberlyn-close"]');
    const closeVisible = await closeBtn.isVisible({ timeout: 2000 }).catch(() => false);
    if (DEBUG) console.log('[DIAG] emberlyn-close isVisible(Playwright)=', closeVisible);
    if (closeVisible) {
      await clickWithCursor(page, 'emberlyn-close');
      await page.waitForTimeout(500);
      const dAfter = await diagnose(page, 'after-close-click');
      logDiag(dAfter, 'after-close-click');
    } else if (DEBUG) {
      console.log('[DIAG] emberlyn-close NOT visible, skipping click');
    }
    await page.waitForTimeout(800);
    await resetSettlementViewport(page);
  });

  const dAfterClose = await diagnose(page, 'after-close-step');
  logDiag(dAfterClose, 'after-close-step');
  if (DEBUG) console.log('[DIAG] Full snapshot after close step:', JSON.stringify(dAfterClose, null, 2));

  await step(page, 'Preparing Settlement to send to Finance...', async () => {
    const dBeforeWait = await diagnose(page, 'before-wait-send-btn');
    logDiag(dBeforeWait, 'before-wait-send-btn');
    if (DEBUG) console.log('[DIAG] About to ensure settlement is ready. Current state:', JSON.stringify(dBeforeWait, null, 2));
    await ensureSettlementReady(page);
  });

  playNarration('settlement', 'settlement-report-btn');
  await step(page, 'Sending settlement to Finance...', async () => {
    await page.waitForTimeout(800);
    const sendBtn = await ensureSettlementReady(page);
    await sendBtn.click();
    await page.waitForTimeout(2000);
  });

  await step(page, 'Resetting scenario to altagas-clean...', async () => {
    await setMockScenario('altagas-clean');
    await page.waitForTimeout(500);
  });

  await showStatus(page, 'Settlement exception resolved and sent to Finance!');
  await page.waitForTimeout(2000);
  await showStatus(page, '✦ Settlement Complete — 52 marketer feeds reconciled. AltaGas $1,640 variance identified, traced to site level, dispute drafted, resolved. Journal entry posted to Finance automatically. No email chain. No spreadsheet. One workflow.');
  await page.waitForTimeout(5000);
  await clearStatus(page);
}

async function main() {
  const browser = await chromium.launch(LAUNCH_OPTIONS);
  const { context, page } = await createDemoContext(browser, 'settlement');
  page.setDefaultTimeout(15000);
  try {
    await runScenario(page);
  } catch (err) {
    console.error('Demo failed:', err.message);
    try {
      const d = await page.evaluate(() => {
        const sel = (q) => document.querySelector(q);
        const all = (q) => document.querySelectorAll(q);
        const rect = (el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height) };
        };
        const activeNav = Array.from(document.querySelectorAll('[data-demo^="nav-"]')).find((n) => n.getAttribute('data-active') === 'true');
        const activeDemo = activeNav?.getAttribute('data-demo');
        const main = sel('main');
        const allDemoEls = Array.from(document.querySelectorAll('[data-demo]')).map((el) => ({
          demo: el.getAttribute('data-demo'),
          tag: el.tagName,
          text: el.textContent?.slice(0, 50),
        }));
        return {
          viewport: { width: window.innerWidth, height: window.innerHeight },
          activeModule: activeDemo?.replace(/^nav-/, '') || null,
          mainH1: main?.querySelector('h1')?.textContent || null,
          allDataDemoElements: allDemoEls,
          'emberlyn-close': { inDom: !!sel('[data-demo="emberlyn-close"]'), count: all('[data-demo="emberlyn-close"]').length, rect: rect(sel('[data-demo="emberlyn-close"]')) },
          'btn-send-settlement-to-finance': { inDom: !!sel('[data-demo="btn-send-settlement-to-finance"]'), count: all('[data-demo="btn-send-settlement-to-finance"]').length, rect: rect(sel('[data-demo="btn-send-settlement-to-finance"]')) },
          'nav-settlement': { inDom: !!sel('[data-demo="nav-settlement"]'), count: all('[data-demo="nav-settlement"]').length },
        };
      });
      console.error('[FAILURE DIAG] Page state at failure:', JSON.stringify(d, null, 2));
    } catch (e) {
      console.error('[FAILURE DIAG] Could not capture state:', e.message);
    }
    writeFailure('settlement', 0, 'settlement', '', err);
    await clearStatus(page);
    process.exit(1);
  } finally {
    await closeDemoContextAndSaveVideo(context, page, 'settlement');
    await browser.close();
  }
}

if (process.argv[1]?.endsWith('run-settlement.mjs')) {
  main();
}
