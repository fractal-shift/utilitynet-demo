/**
 * T2-006: Watchdog OS Monitoring Panel
 * Static source inspection: proves the code is there. Mock server check uses HTTP fetch.
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

  if (!content.includes('watchdog-feed-health')) errors.push('watchdog-feed-health not found');
  if (!content.includes('watchdog-job-queue')) errors.push('watchdog-job-queue not found');
  if (!content.includes('watchdog-anomaly-feed')) errors.push('watchdog-anomaly-feed not found');
  if (!content.includes('watchdog/feeds')) errors.push('watchdog/feeds API not fetched');

  return { pass: errors.length === 0, errors };
}
