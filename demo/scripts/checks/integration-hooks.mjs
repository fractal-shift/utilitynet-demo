/**
 * T1-003: Finance Integration Hooks (all 4)
 * Static source inspection: proves the code is there. No Playwright.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  const errors = [];
  const files = {
    billing: path.join(__dirname, '../../src/modules/Billing.jsx'),
    settlement: path.join(__dirname, '../../src/modules/Settlement.jsx'),
    marketers: path.join(__dirname, '../../src/modules/Marketers.jsx'),
    customers: path.join(__dirname, '../../src/modules/Customers.jsx'),
    customer360: path.join(__dirname, '../../src/components/Customer360Modal.jsx'),
  };

  if (!fs.existsSync(files.billing) || !fs.readFileSync(files.billing, 'utf-8').includes('btn-post-billing-to-gl')) {
    errors.push('Hook 1: btn-post-billing-to-gl not found in Billing.jsx');
  }
  if (!fs.existsSync(files.settlement) || !fs.readFileSync(files.settlement, 'utf-8').includes('btn-send-settlement-to-finance')) {
    errors.push('Hook 2: btn-send-settlement-to-finance not found in Settlement.jsx');
  }
  if (!fs.existsSync(files.marketers) || !fs.readFileSync(files.marketers, 'utf-8').includes('btn-post-commissions-to-gl')) {
    errors.push('Hook 3: btn-post-commissions-to-gl not found in Marketers.jsx');
  }

  const customerContent = fs.existsSync(files.customers) ? fs.readFileSync(files.customers, 'utf-8') : '';
  const customer360Content = fs.existsSync(files.customer360) ? fs.readFileSync(files.customer360, 'utf-8') : '';
  const crmContent = customerContent + customer360Content;
  if (!crmContent.includes('crm-propagation-confirmation')) {
    errors.push('Hook 4: crm-propagation-confirmation not found in Customers/Customer360');
  }
  if (!crmContent.includes('crm-billing-link')) {
    errors.push('Hook 4: crm-billing-link not found in Customers/Customer360');
  }

  if (fs.existsSync(files.marketers) && !fs.readFileSync(files.marketers, 'utf-8').includes('marketer-journal-entries-table')) {
    errors.push('marketer-journal-entries-table not found in Marketers.jsx');
  }

  return { pass: errors.length === 0, errors };
}
