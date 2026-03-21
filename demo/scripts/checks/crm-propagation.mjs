/**
 * T2-007: CRM Change Propagation to Billing + Finance
 * Static source inspection: proves the code is there. No Playwright.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  const errors = [];
  const customer360Path = path.join(__dirname, '../../src/components/Customer360Modal.jsx');
  const customersPath = path.join(__dirname, '../../src/modules/Customers.jsx');

  const customer360Content = fs.existsSync(customer360Path) ? fs.readFileSync(customer360Path, 'utf-8') : '';
  const customersContent = fs.existsSync(customersPath) ? fs.readFileSync(customersPath, 'utf-8') : '';
  const content = customer360Content + customersContent;

  if (!content.includes('crm-propagation-confirmation')) {
    errors.push('crm-propagation-confirmation not found');
  }
  if (!content.includes('crm-billing-link')) {
    errors.push('crm-billing-link not found');
  }

  return { pass: errors.length === 0, errors };
}
