/**
 * T3-001: Settlement exception categorization
 * Static check — verifies Settlement.jsx and demoData have required elements.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  const errors = [];
  const settlementPath = path.join(__dirname, '../../src/modules/Settlement.jsx');
  const demoDataPath = path.join(__dirname, '../../src/data/demoData.js');
  if (!fs.existsSync(settlementPath)) return { pass: false, errors: ['Settlement.jsx not found'] };
  const settlementContent = fs.readFileSync(settlementPath, 'utf-8');
  const demoDataContent = fs.existsSync(demoDataPath) ? fs.readFileSync(demoDataPath, 'utf-8') : '';
  if (!settlementContent.includes('settlement-exception-filter')) errors.push('settlement-exception-filter missing');
  if (!settlementContent.includes('Volume Variance') && !demoDataContent.includes('Volume Variance')) errors.push('Volume Variance badge/category not found');
  for (const cat of ['Rate Dispute', 'Missing Data', 'Timing']) {
    if (!settlementContent.includes(cat)) errors.push(`Filter option missing: ${cat}`);
  }
  return { pass: errors.length === 0, errors };
}
