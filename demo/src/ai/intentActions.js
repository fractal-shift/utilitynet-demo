/**
 * Parse user message for "create billing batch" intent.
 * Returns { period: { month, year }, type } or null if no intent.
 */
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

export function parseCreateBillingBatchIntent(message, conversationContext = '') {
  const lower = (message || '').toLowerCase().trim();
  const ctx = (conversationContext || '').toLowerCase();
  const combined = `${lower} ${ctx}`;

  const hasMonth = /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/.test(lower);
  const hasCreateIntent =
    (hasMonth && /\b(default|auto|create|add|batch|yes|ok|sure|please)\b/.test(lower))
    || (/\b(create|add|make|new)\b.*\b(billing\s*batch|batch)\b|\b(billing\s*batch|batch)\b.*\b(create|add|make|new)\b/.test(combined) && hasMonth);

  if (!hasCreateIntent) return null;

  let month = 3; // April = index 3
  let year = 2026;

  const monthMatch = lower.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/);
  if (monthMatch) {
    const idx = MONTHS.indexOf(monthMatch[1]);
    if (idx >= 0) month = idx;
  }

  const yearMatch = lower.match(/\b(20\d{2})\b/);
  if (yearMatch) year = parseInt(yearMatch[1], 10);

  const type = /industrial\s*only|residential\s*only/i.test(lower)
    ? (/industrial\s*only/i.test(lower) ? 'Industrial Only' : 'Residential Only')
    : 'Residential + Industrial';

  return { period: { month, year }, type };
}

/**
 * Execute create_billing_batch action. Used by Layout when Emberlyn detects intent.
 */
export function executeCreateBillingBatch(actions, params) {
  const { period = { month: 3, year: 2026 }, type = 'Residential + Industrial' } = params || {};
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthStr = String(period.month + 1).padStart(2, '0');
  const dayStr = String(new Date().getDate()).padStart(2, '0');
  const id = `B-${period.year}-${monthStr}${dayStr}`;
  const periodLabel = `${MONTHS[period.month]} ${period.year}`;
  const invoices = Math.floor(2400 + Math.random() * 800);
  const total = `$${(invoices * 647).toLocaleString()}`;
  actions.addBillingBatch({
    id,
    period: periodLabel,
    type,
    invoices,
    total,
    exceptions: 0,
    status: 'In Review',
    runDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  });
  return { id, period: periodLabel, invoices, total };
}
