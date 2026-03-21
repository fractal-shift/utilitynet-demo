import { chromium } from 'playwright';

export async function check() {
  const errors = [];
  let browser, p;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    // Pre-set sessionStorage so ApiKeyModal does not block (fresh browser has no key)
    await context.addInitScript(() => {
      if (!sessionStorage.getItem('claude-api-key')) {
        sessionStorage.setItem('claude-api-key', 'sk-placeholder-for-validation');
      }
    });
    p = await context.newPage();
    await p.goto('http://localhost:5173?module=marketers', { waitUntil: 'networkidle', timeout: 15000 });
    try {
      const dismissBtn = p.locator('[data-demo="api-key-dismiss"]');
      if (await dismissBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await dismissBtn.click();
        await p.waitForTimeout(400);
      }
    } catch {}

    // Wait for Marketers content to be ready
    const marginInput = p.locator('[data-demo="marketer-margin-input"]');
    await marginInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

    // Margin input + auto-calc
    if (!await marginInput.isVisible({ timeout: 3000 }).catch(() => false)) { errors.push('marketer-margin-input missing'); }
    else {
      await marginInput.fill('1.00'); await p.waitForTimeout(300);
      if (!await p.locator('text=5.82').isVisible({ timeout: 1000 }).catch(() => false)) errors.push('Customer rate not recalculating (expected $5.82 = $4.82 + $1.00)');
      await marginInput.fill('0.85');
    }
    if (!await p.locator('[data-demo="btn-save-margin"]').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('btn-save-margin missing');
    else {
      await p.locator('[data-demo="btn-save-margin"]').click(); await p.waitForTimeout(500);
      if (!await p.locator('text=Margin updated').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('"Margin updated" toast not shown');
    }

    // Prudential
    if (!await p.locator('[data-demo="btn-cash-call-reminder"]').isVisible({ timeout: 3000 }).catch(() => false)) errors.push('btn-cash-call-reminder missing');
    if (!await p.locator('text=$420,000').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Prudential required amount $420,000 not found');
    if (!await p.locator('text=$40,000').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Prudential shortfall $40,000 not found');

    // Statement
    if (!await p.locator('[data-demo="btn-generate-statement"]').isVisible({ timeout: 3000 }).catch(() => false)) { errors.push('btn-generate-statement missing'); }
    else {
      await p.locator('[data-demo="btn-generate-statement"]').click(); await p.waitForTimeout(600);
      if (!await p.locator('text=847').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Statement: customer count 847 not shown');
      if (!await p.locator('text=$13,520').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Statement: net to marketer $13,520 not shown');
      if (!await p.locator('[data-demo="btn-post-commissions-to-gl"]').isVisible({ timeout: 2000 }).catch(() => false)) errors.push('Statement: Approve & Post to Finance button missing');
    }

    if (!await p.locator('[data-demo="marketer-journal-entries-table"]').isVisible({ timeout: 3000 }).catch(() => false)) errors.push('marketer-journal-entries-table missing');
  } catch (err) { errors.push(`Playwright: ${err.message}`); } finally { await browser?.close(); }
  return { pass: errors.length === 0, errors };
}
