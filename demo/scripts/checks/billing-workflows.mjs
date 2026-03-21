/**
 * T1-004: Billing — Rebill / Reversal / Correction
 * Static source inspection: proves the code is there. No Playwright.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  const errors = [];
  const billingPath = path.join(__dirname, '../../src/modules/Billing.jsx');
  if (!fs.existsSync(billingPath)) return { pass: false, errors: ['Billing.jsx not found'] };

  const content = fs.readFileSync(billingPath, 'utf-8');

  if (!content.includes('btn-rebill-')) errors.push('Rebill button (data-demo="btn-rebill-[invoiceId]") not found');
  if (!content.includes('btn-reverse-invoice')) errors.push('Reverse invoice button not found');
  if (!content.includes('btn-correct-repost')) errors.push('Correct & Repost button not found');
  if (!content.includes('Dispute Resolved')) errors.push('Dispute Resolved row not seeded');

  return { pass: errors.length === 0, errors };
}
