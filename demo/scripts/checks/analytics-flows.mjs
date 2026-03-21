/**
 * T2-004: Analytics flows — Drill-down, GL export, Compliance, Ad-hoc
 * Real Playwright check. Validates:
 *   - analytics-drill-revenue, analytics-drill-account, analytics-drill-invoice-list
 *   - btn-analytics-export-gl (toast)
 *   - Compliance tab: compliance-report-table, btn-generate-compliance-report
 *   - Ad-hoc tab: btn-run-adhoc-report
 */
import { chromium } from 'playwright';

const BASE_URL = process.env.VITE_DEV_URL || 'http://localhost:5173';

export async function check() {
  const errors = [];
  let browser, p;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await context.addInitScript(() => {
      if (!sessionStorage.getItem('claude-api-key')) {
        sessionStorage.setItem('claude-api-key', 'sk-placeholder-for-validation');
      }
    });
    p = await context.newPage();
    await p.goto(`${BASE_URL}?module=analytics`, { waitUntil: 'networkidle', timeout: 15000 });

    try {
      const dismissBtn = p.locator('[data-demo="api-key-dismiss"]');
      if (await dismissBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await dismissBtn.click();
        await p.waitForTimeout(400);
      }
    } catch {}

    // Wait for Analytics content
    const drillRevenue = p.locator('[data-demo="analytics-drill-revenue"]');
    await drillRevenue.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

    if (!await drillRevenue.isVisible({ timeout: 3000 }).catch(() => false)) {
      errors.push('analytics-drill-revenue missing');
    } else {
      await drillRevenue.click();
      const drillAccount = p.locator('[data-demo="analytics-drill-account"]').first();
      await drillAccount.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
      if (!await drillAccount.isVisible({ timeout: 1000 }).catch(() => false)) {
        errors.push('analytics-drill-account (drill panel) not visible after click');
      } else {
        await drillAccount.click();
        const invoiceList = p.locator('[data-demo="analytics-drill-invoice-list"]');
        await invoiceList.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
        if (!await invoiceList.isVisible({ timeout: 1000 }).catch(() => false)) {
          errors.push('analytics-drill-invoice-list not visible after account click');
        }
      }
    }

    // Export to GL
    const exportBtn = p.locator('[data-demo="btn-analytics-export-gl"]');
    if (!await exportBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      errors.push('btn-analytics-export-gl missing');
    } else {
      await exportBtn.click();
      await p.locator('text=GL reconciliation export').waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
      if (!await p.locator('text=GL reconciliation export').isVisible({ timeout: 1000 }).catch(() => false)) {
        errors.push('Export to GL toast not shown');
      }
    }

    // Compliance tab
    await p.locator('button:has-text("Compliance")').click();
    await p.locator('[data-demo="compliance-report-table"]').waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    if (!await p.locator('[data-demo="compliance-report-table"]').isVisible({ timeout: 2000 }).catch(() => false)) {
      errors.push('compliance-report-table missing');
    }
    const generateReportBtn = p.locator('[data-demo="btn-generate-compliance-report"]');
    if (!await generateReportBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      errors.push('btn-generate-compliance-report missing');
    } else {
      await generateReportBtn.click();
      await p.locator('text=Compliance report generated').waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
      if (!await p.locator('text=Compliance report generated').isVisible({ timeout: 1000 }).catch(() => false)) {
        errors.push('Compliance Generate Report toast not shown');
      }
    }

    // Ad-hoc tab
    await p.locator('button:has-text("Ad-hoc")').click();
    const runAdhocBtn = p.locator('[data-demo="btn-run-adhoc-report"]');
    await runAdhocBtn.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    if (!await runAdhocBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      errors.push('btn-run-adhoc-report missing');
    } else {
      await runAdhocBtn.click();
      await p.locator('text=Report generated').waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
      if (!await p.locator('text=Report generated').isVisible({ timeout: 1000 }).catch(() => false)) {
        errors.push('Ad-hoc Run Report toast not shown');
      }
    }
  } catch (err) {
    errors.push(`Playwright: ${err.message}`);
  } finally {
    await browser?.close();
  }
  return { pass: errors.length === 0, errors };
}
