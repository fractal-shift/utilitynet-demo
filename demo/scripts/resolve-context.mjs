/**
 * Resolves which source files are relevant for a given failure.
 * Used by heal-agent to send minimal context to Claude.
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEMO_SRC = join(__dirname, '..', 'src');

const SELECTOR_TO_FILES = {
  'nav-': ['Sidebar.jsx'],
  'btn-new-enrollment': ['Customers.jsx'],
  'row-': ['Customers.jsx'],
  'enrollment-': ['EnrollmentModal.jsx'],
  'batch-': ['BillingBatchModal.jsx', 'Billing.jsx'],
  'tab-exceptions': ['Billing.jsx'],
  'exc-': ['Billing.jsx'],
  'btn-resolve-': ['Billing.jsx'],
  'btn-ask-emberlyn': ['Billing.jsx'],
  'btn-resolve-altagas': ['Settlement.jsx'],
  'btn-draft-altagas': ['Settlement.jsx'],
  'customer360-': ['Customer360Modal.jsx', 'Customers.jsx'],
  'emberlyn-': ['EmerlynPanel.jsx', 'Layout.jsx'],
  'thena-': ['ThenaPanel.jsx', 'Layout.jsx'],
  'api-key-': ['ApiKeyModal.jsx', 'App.jsx'],
};

function getRelevantFiles(failure) {
  const selector = failure.selector || '';
  const files = new Set(['Layout.jsx']);

  for (const [prefix, list] of Object.entries(SELECTOR_TO_FILES)) {
    if (selector.includes(prefix)) {
      list.forEach((f) => files.add(f));
    }
  }

  const MODULE_FILES = ['Customers.jsx', 'Billing.jsx', 'Settlement.jsx', 'Analytics.jsx', 'Dashboard.jsx', 'Marketers.jsx', 'Finance.jsx', 'Admin.jsx'];
  const result = [];
  for (const f of files) {
    const inModules = MODULE_FILES.includes(f);
    const path = inModules ? join(DEMO_SRC, 'modules', f) : join(DEMO_SRC, 'components', f);
    try {
      const content = readFileSync(path, 'utf8');
      result.push({ path, content });
    } catch {
      const altPath = inModules ? join(DEMO_SRC, 'components', f) : join(DEMO_SRC, 'modules', f);
      try {
        const content = readFileSync(altPath, 'utf8');
        result.push({ path: altPath, content });
      } catch {
        // Skip
      }
    }
  }
  return result;
}

export { getRelevantFiles };
