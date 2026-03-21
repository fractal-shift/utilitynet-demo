/**
 * Shared helpers for Playwright demo automation.
 * - step(): show status, pause, then run action
 * - showScenarioSummary(): title + description at scenario start
 * - showStatus(): post status to app overlay
 * - clickWithCursor(): uses .first() when multiple match (e.g. btn-approve-ap)
 * - setMockScenario(): POST to mock server localhost:3101/scenario/:name
 * - createDemoContext(): injects API key from apiKey.js so Emberlyn/Thena use real Claude
 */

import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const _dirname = dirname(fileURLToPath(import.meta.url));
import os from 'os';

const _dir = _dirname;

async function getBaseUrl() {
  for (const port of [5173, 5174, 5175]) {
    try {
      const res = await fetch(`http://localhost:${port}`, { signal: AbortSignal.timeout(1000) });
      if (res.ok || res.status < 500) return `http://localhost:${port}`;
    } catch {
      // port not responding, try next
    }
  }
  return 'http://localhost:5173';
}

const BASE_URL = process.env.DEMO_BASE_URL || await getBaseUrl();
const STEP_PAUSE_MS = parseInt(process.env.DEMO_STEP_PAUSE_MS || '5000', 10);
const SUMMARY_PAUSE_MS = parseInt(process.env.DEMO_SUMMARY_PAUSE_MS || '8000', 10);
const CURSOR_MOVE_MS = parseInt(process.env.DEMO_CURSOR_MOVE_MS || '600', 10);
const w = parseInt(process.env.DEMO_VIEWPORT_WIDTH || '1600', 10);
const h = parseInt(process.env.DEMO_VIEWPORT_HEIGHT || '900', 10);
const DEMO_VIEWPORT_WIDTH = Number.isNaN(w) ? 1600 : Math.max(800, w);
const DEMO_VIEWPORT_HEIGHT = Number.isNaN(h) ? 900 : Math.max(600, h);
const DEMO_VIDEO_DIR = process.env.DEMO_VIDEO_DIR || join(os.homedir(), 'Downloads', 'utilitynet-demos');

export { BASE_URL, STEP_PAUSE_MS, SUMMARY_PAUSE_MS };
export const DEMO_VIEWPORT = { width: DEMO_VIEWPORT_WIDTH, height: DEMO_VIEWPORT_HEIGHT };

export async function setDemoViewport(page) {
  await page.setViewportSize(DEMO_VIEWPORT);
}

// Demo injects key from env or from hardcoded apiKey.js
function getDemoApiKey() {
  const fromEnv = process.env.VITE_CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
  if (fromEnv?.trim()) return fromEnv.trim();
  try {
    const apiKeyPath = join(_dirname, '../src/apiKey.js');
    const content = readFileSync(apiKeyPath, 'utf-8');
    const m = content.match(/CLAUDE_API_KEY\s*=\s*['"]([^'"]+)['"]/);
    const k = m?.[1]?.trim();
    return k && !k.includes('REPLACE') ? k : '';
  } catch { return ''; }
}

export async function createDemoContext(browser, scenario = 'demo') {
  const recordVideo = process.env.DEMO_RECORD_VIDEO === '1' ? {
    dir: DEMO_VIDEO_DIR,
    size: DEMO_VIEWPORT,
  } : undefined;

  if (recordVideo) {
    mkdirSync(DEMO_VIDEO_DIR, { recursive: true });
    console.log(`[Demo] Recording video → ${DEMO_VIDEO_DIR}`);
  }

  const context = await browser.newContext({
    viewport: DEMO_VIEWPORT,
    ...(recordVideo && { recordVideo }),
  });
  const page = await context.newPage();

  // Pre-fill API key so Emberlyn/Thena use real Claude
  const demoKey = getDemoApiKey();
  if (demoKey) {
    await page.addInitScript((key) => {
      if (key && typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('claude-api-key', key);
      }
    }, demoKey);
  }

  page.setDefaultTimeout(15000);
  return { context, page };
}

export async function closeDemoContextAndSaveVideo(context, page, scenario) {
  const video = process.env.DEMO_RECORD_VIDEO === '1' ? page.video() : null;
  await context.close();
  if (video) {
    const date = new Date().toISOString().slice(0, 10);
    const dest = join(DEMO_VIDEO_DIR, `utilitynet-demo-${scenario}-${date}.webm`);
    try {
      await video.saveAs(dest);
      console.log(`[Demo] Video saved: ${dest}`);
    } catch (err) {
      console.error(`[Demo] Failed to save video: ${err.message}`);
    }
  }
}

export async function highlightDashboardSection(page, selector, conclusion, durationMs = 4000) {
  await page.evaluate(
    ({ sel, concl, dur }) => {
      window.postMessage({ type: 'demo-highlight', selector: sel, conclusion: concl, durationMs: dur }, '*');
    },
    { sel: selector, concl: conclusion, dur: durationMs }
  );
  await page.waitForTimeout(durationMs);
}

/**
 * Launch options for Playwright.
 * On macOS (darwin), defaults to system Chrome to avoid Chromium install issues.
 * Use DEMO_USE_SYSTEM_CHROME=0 to force Playwright Chromium.
 */
const useSystemChrome =
  process.env.DEMO_USE_SYSTEM_CHROME === '1' ||
  (process.platform === 'darwin' && process.env.DEMO_USE_SYSTEM_CHROME !== '0');

export const LAUNCH_OPTIONS = {
  headless: false,
  slowMo: parseInt(process.env.DEMO_SLOW_MO || '400', 10),
  ...(useSystemChrome && { channel: 'chrome' }),
};

/**
 * Show scenario summary at start — title + description, longer pause for digestion.
 * @param {import('playwright').Page} page
 * @param {string} title - Scenario name (e.g. "New Customer Enrollment")
 * @param {string} description - What will happen (e.g. "We'll enroll Heather Mitchell...")
 */
export async function showScenarioSummary(page, title, description) {
  await page.evaluate(
    ({ t, d }) => {
      window.postMessage({ type: 'demo-summary', title: t, description: d }, '*');
    },
    { t: title, d: description }
  );
  await page.waitForTimeout(SUMMARY_PAUSE_MS);
}

/**
 * Show status in app overlay, pause for human to read, then run action.
 * @param {import('playwright').Page} page
 * @param {string} status - Text to display (e.g. "Navigating to Customers...")
 * @param {() => Promise<void>} [fn] - Optional action to run after pause
 */
export async function step(page, status, fn) {
  console.log(`  → ${status}`);
  await page.evaluate(
    (s) => {
      window.postMessage({ type: 'demo-status', status: s }, '*');
    },
    status
  );
  await page.waitForTimeout(STEP_PAUSE_MS);
  if (fn) await fn();
}

/**
 * Show status without running an action (e.g. before a multi-step sequence).
 */
export async function showStatus(page, status) {
  console.log(`  → ${status}`);
  await page.evaluate(
    (s) => {
      window.postMessage({ type: 'demo-status', status: s }, '*');
    },
    status
  );
  await page.waitForTimeout(STEP_PAUSE_MS);
}

/**
 * Move visible demo cursor to element, then click. Uses injected cursor overlay.
 * @param {import('playwright').Page} page
 * @param {string} selector - data-demo value (e.g. "nav-customers") or full selector
 */
export async function clickWithCursor(page, selector) {
  const loc = selector.startsWith('[') || selector.includes('=') ? page.locator(selector) : page.locator(`[data-demo="${selector}"]`);
  const locator = loc.first();
  try {
    await locator.evaluate((el) => el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' }));
    await page.waitForTimeout(300);
  } catch {
    // Element may not be in DOM yet; proceed with click
  }
  const box = await locator.boundingBox();
  if (box) {
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.evaluate(
      ({ x, y }) => {
        window.postMessage({ type: 'demo-cursor', x, y, action: 'move' }, '*');
      },
      { x, y }
    );
    await page.waitForTimeout(CURSOR_MOVE_MS);
    await page.evaluate(
      ({ x, y }) => {
        window.postMessage({ type: 'demo-cursor', x, y, action: 'click' }, '*');
      },
      { x, y }
    );
    await page.waitForTimeout(200);
  }
  await locator.click();
}

/**
 * Clear the status overlay and demo cursor.
 */
export async function clearStatus(page) {
  await page.evaluate(() => {
    window.postMessage({ type: 'demo-status', status: '' }, '*');
    window.postMessage({ type: 'demo-cursor-clear' }, '*');
  });
}

/**
 * Write failure for auto-heal. Call from catch block.
 */
export function writeFailure(scenario, stepIndex, stepLabel, selector, error) {
  try {
    writeFileSync(
      join(_dir, '.last-failure.json'),
      JSON.stringify({ scenario, stepIndex, stepLabel, selector, error: error?.message || String(error) }, null, 2)
    );
  } catch {
    // ignore
  }
}

/**
 * Wait for Emberlyn response to finish, then trigger human-like scroll read animation.
 * @param {import('playwright').Page} page
 */
export async function scrollReadEmberlynResponse(page) {
  await page.waitForSelector('[data-demo="emberlyn-suggestion"]:not([disabled])', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(500);
  await page.evaluate(() => window.postMessage({ type: 'demo-scroll-read', panel: 'emberlyn' }, '*'));
  await page.waitForTimeout(8000);
}

/**
 * Wait for Thena response to finish, then trigger human-like scroll read animation.
 * @param {import('playwright').Page} page
 */
export async function scrollReadThenaResponse(page) {
  await page.waitForSelector('[data-demo="thena-suggestion"]:not([disabled])', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(500);
  await page.evaluate(() => window.postMessage({ type: 'demo-scroll-read', panel: 'thena' }, '*'));
  await page.waitForTimeout(8000);
}

/**
 * Set mock server scenario via HTTP. Used by enrollment credit-fail flow.
 * @param {string} name - Scenario name (e.g. 'credit-fail', 'credit-pass')
 */
export async function setMockScenario(name) {
  const res = await fetch(`http://localhost:3101/scenario/${name}`, { method: 'POST' });
  return res.json();
}

/**
 * Dismiss API key modal if present (click Skip to use cached only).
 */
export async function dismissApiKeyModal(page) {
  const skip = page.locator('[data-demo="api-key-dismiss"]');
  if (await skip.isVisible().catch(() => false)) {
    await skip.click();
    await page.waitForTimeout(500);
  }
}
