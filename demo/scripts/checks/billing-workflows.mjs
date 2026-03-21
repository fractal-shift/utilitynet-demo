/**
 * Validates rebill, reversal, and correction workflows exist in Billing module.
 * Uses static analysis (Playwright may be unavailable).
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

  if (!content.includes('btn-rebill-')) errors.push('Rebill button not found');
  if (!content.includes('btn-reverse-invoice')) errors.push('Reverse invoice button not found');
  if (!content.includes('btn-correct-repost')) errors.push('Correct & Repost button not found');
  if (!content.includes('Dispute Resolved')) errors.push('Dispute Resolved row not seeded');

  return { pass: errors.length === 0, errors };
}
