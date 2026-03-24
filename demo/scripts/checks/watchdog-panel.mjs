/**
 * T2-006: Integration Simulator — Ops Console Panel
 * Static source inspection: proves the code is there. Integration simulator check uses HTTP fetch.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  const errors = [];
  const adminPath = path.join(__dirname, '../../src/modules/Admin.jsx');
  if (!fs.existsSync(adminPath)) return { pass: false, errors: ['Admin.jsx not found'] };

  const content = fs.readFileSync(adminPath, 'utf-8');

  if (!content.includes('ops-console-feed-health')) errors.push('ops-console-feed-health not found');
  if (!content.includes('ops-console-job-queue')) errors.push('ops-console-job-queue not found');
  if (!content.includes('ops-console-alerts')) errors.push('ops-console-alerts not found');
  if (!content.includes('fetchIntegrationHealth')) errors.push('fetchIntegrationHealth not imported');

  return { pass: errors.length === 0, errors };
}
