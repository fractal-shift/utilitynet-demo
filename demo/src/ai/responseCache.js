// Pre-written polished responses for demo flows
// Cache key = normalized phrase fingerprint
// Flow 1: Sarah Mitchell (C-10482) and MacGregor Industrial Ltd. (C-10478) per 30-min demo script

export const CACHE = {
  // ── FLOW 1: Customer Service + Emberlyn (Sarah Mitchell C-10482) ─────────────────

  'summarize customer issues': `<strong>Sarah Mitchell — Account Summary (C-10482)</strong><br><br>Three interactions in the past 30 days require attention:<br><br>• <strong>Open case CS-8824</strong> — Billing dispute filed Mar 8, unresolved. Customer called twice about the Feb invoice discrepancy.<br>• <strong>Outstanding balance $124</strong> — Feb 2026 invoice overdue 31 days. Last payment Jan 28. Payment history has been reliable for 26 of 27 prior months.<br>• <strong>Variable plan exposure</strong> — On variable rate during AESO price volatility; customer requested fixed-rate options.<br><br>Root cause: the Feb invoice discrepancy likely triggered the dispute. Resolving the balance and clarifying the rate would close CS-8824.<br><br>Shall I draft a response explaining the last invoice?`,

  // ── FLOW 1: Customer Service + Emberlyn (MacGregor Industrial Ltd. C-10478) ──────

  'summarize macgregor recent issues': `MacGregor Industrial Ltd. has had <strong>2 billing complaints</strong> in 90 days. The current dispute (Case #4821) relates to their February invoice — <strong>$8,400</strong> vs their expected $6,200 based on prior months. The variance traces to a hedge allocation adjustment applied February 14 that wasn't reflected in their rate notification. This is the root cause. GreenPath (their marketer) has not yet been looped in.<br><br>Shall I draft a response to the customer?`,

  'draft macgregor response': `__ACTION_PREVIEW__
  <div class="action-preview-label">📧 Proposed Email — MacGregor Industrial Ltd.</div>
  <div style="font:500 12px var(--font-ui);color:var(--light);margin-bottom:8px"><strong>To:</strong> admin@macgregorhold.ca &nbsp;|&nbsp; <strong>Subject:</strong> Update on Your February 2026 Invoice — Account C-10478</div>
  <div style="font:400 12px var(--font-ui);color:var(--text);line-height:1.7">Dear MacGregor Industrial Ltd., thank you for reaching out regarding your February invoice. After reviewing your account, we identified a hedge allocation adjustment applied on February 14 that affected your billing rate. We're issuing a revised statement and will apply a <strong>$320 credit</strong> to your March invoice as a goodwill adjustment. GreenPath will be in touch within 24 hours to confirm.<br><br>UTILITYnet Customer Operations</div>
  <div style="margin-top:12px;font:500 10px var(--font-mono);letter-spacing:0.08em;text-transform:uppercase;color:var(--gold)">Actions: Update case status → In Review · Notify GreenPath marketer contact · Apply $320 credit to March invoice</div>`,

  'draft customer email': `__ACTION_PREVIEW__
  <div class="action-preview-label">📧 Proposed Email — Sarah Mitchell</div>
  <div style="font:500 12px var(--font-ui);color:var(--light);margin-bottom:8px"><strong>To:</strong> sarah.m@email.ca &nbsp;|&nbsp; <strong>Subject:</strong> Update on Your February 2026 Invoice — Account C-10482</div>
  <div style="font:400 12px var(--font-ui);color:var(--text);line-height:1.7">Dear Sarah,<br><br>I'm writing regarding your February 2026 invoice, which shows a balance of $124. The discrepancy you reported is related to a rate adjustment during the AESO volatility period in late January. We've applied a credit of $38.40 to your account (rate mismatch correction).<br><br>Your updated balance is <strong>$85.60</strong>. Payment is due by March 31. We've also attached a fixed-rate offer — switching would lock your rate for 6 months at no cost.<br><br>We apologize for the confusion and will follow up if you have any questions.<br><br>UTILITYnet Customer Operations</div>
  <div style="margin-top:12px;font:500 10px var(--font-mono);letter-spacing:0.08em;text-transform:uppercase;color:var(--gold)">Also: Update Case CS-8824 → In Review + create follow-up task due Mar 14</div>`,

  'create follow-up task': `__ACTION_PREVIEW__
  <div class="action-preview-label">⚙ Actions to Apply</div>
  <div style="display:flex;flex-direction:column;gap:8px;font:500 12px var(--font-ui);color:var(--light)">
    <div style="display:flex;align-items:center;gap:8px"><span style="color:var(--success)">✓</span> Case CS-8824 status → <strong>In Review</strong></div>
    <div style="display:flex;align-items:center;gap:8px"><span style="color:var(--success)">✓</span> Follow-up task created — "Confirm payment received + close CS-8824" due <strong>Mar 14</strong></div>
    <div style="display:flex;align-items:center;gap:8px"><span style="color:var(--success)">✓</span> Internal note added: "Email sent to customer Mar 11"</div>
  </div>`,

  // ── FLOW 2: Billing Exception + Emberlyn ─────────────────────────

  'explain billing exception': `<strong>EXC-0311-A — Root Cause Analysis</strong><br><br>This is a missing AESO meter read for MacGregor Industrial Ltd. (C-10478), covering <strong>March 1–8, 2026</strong>.<br><br><strong>What happened:</strong> AESO's automated data submission excluded 6 industrial sites at 8820 Industrial Pkwy. The gap appears linked to a firmware update on their smart meter array deployed Feb 28 — the same pattern affects 2 other Edmonton industrial accounts this cycle.<br><br><strong>Financial impact:</strong> Estimated <strong>$4,200</strong> based on prior-period average (Dec–Feb avg: 44,400 kWh/month at current AESO pricing).<br><br><strong>Resolution options:</strong><br>1. Apply prior-period average — fastest, requires customer acknowledgement<br>2. Request manual read from ATCO — 3–5 business days<br>3. Partial invoice for available data, true-up next cycle<br><br>I recommend option 1. Shall I prepare the calculation and draft the customer notification?`,

  'what changed since last bill': `<strong>Feb vs. March Billing Comparison — C-10478</strong><br><br>• <strong>Feb (INV-2026-14780):</strong> 41,800 kWh · $3,940 · Paid on time<br>• <strong>Mar (EXC-0311-A):</strong> 0 kWh read · Invoice blocked<br><br>The only change is the AESO meter read gap. No rate changes, no plan modifications, no contract amendments since November 2023. This is entirely a data feed issue — not a customer behaviour change.<br><br>Payment history context: this account has paid on time for <strong>26 of 27 months</strong>. The Feb overdue balance is almost certainly a downstream effect of the meter dispute, not a credit risk.`,

  'recommend next step exception': `__ACTION_PREVIEW__
  <div class="action-preview-label">⚙ Recommended Resolution — EXC-0311-A</div>
  <div style="display:flex;flex-direction:column;gap:8px;font:500 12px var(--font-ui);color:var(--light)">
    <div style="display:flex;align-items:center;gap:8px"><span style="color:var(--teal)">→</span> Escalate to billing analyst + mark for manual review</div>
    <div style="display:flex;align-items:center;gap:8px"><span style="color:var(--teal)">→</span> Apply prior-period average: <strong>44,400 kWh → $4,180 invoice</strong></div>
    <div style="display:flex;align-items:center;gap:8px"><span style="color:var(--teal)">→</span> Mark EXC-0311-A as <strong>In Review</strong></div>
  </div>`,

  // ── FLOW 3: Settlement + Emberlyn ────────────────────────────────

  'draft response altagas': `__ACTION_PREVIEW__
  <div class="action-preview-label">📧 Proposed Response — AltaGas Retail</div>
  <div style="font:500 12px var(--font-ui);color:var(--light);margin-bottom:8px"><strong>To:</strong> settlements@altagasretail.ca &nbsp;|&nbsp; <strong>Re:</strong> INV-2026-0312 Variance Resolution</div>
  <div style="font:400 12px var(--font-ui);color:var(--text);line-height:1.7">Dear AltaGas Settlements Team,<br><br>Following our review of the variance on INV-2026-0312, we are writing to formally present UTILITYnet's position.<br><br>Our calculation of <strong>$481,600.00</strong> is derived from AESO-certified settlement data received March 5, 2026, covering 2,408 confirmed customer accounts. Your submission of $483,240.00 reflects an overcount of approximately 1,640 kWh, which we believe is attributable to a data refresh timing issue on your end affecting 8 site records.<br><br>Per section 4.2 of our MSA, AESO data is authoritative in settlement disputes. We are attaching the relevant AESO extract for your review.<br><br>If we do not receive an updated submission by <strong>March 15</strong>, we will issue your commission statement at the UTILITYnet-calculated figure.<br><br>UTILITYnet Settlement Operations</div>`,

  'root cause settlement': `<strong>AltaGas Retail — Settlement Mismatch Root Cause</strong><br><br>The <strong>$1,640.00 variance</strong> on INV-2026-0312 is caused by 8 site meter reads not included in AltaGas's submission.<br><br>AESO settlement data (received Mar 5) confirms <strong>2,408 customers and 481,600 kWh</strong> total consumption. AltaGas submitted 483,240 kWh — an overcount mapped at blended average rate.<br><br><strong>Supporting evidence:</strong> AESO data is authoritative under the AUC settlement framework. Our calculation aligns precisely with AESO. AltaGas's variance likely reflects a manual override or data refresh timing issue on their end — this is a known pattern with 3 other Alberta retailers this quarter.<br><br><strong>Status:</strong> AltaGas notified Mar 8. No response received as of Mar 11. If unresolved by Mar 15, commission statement will issue at UTILITYnet's figure per MSA clause 4.2.<br><br>Shall I draft the formal dispute response?`,

  'what to resolve before closing': `Before closing the March 2026 settlement cycle, <strong>3 items need resolution:</strong><br><br>1. <strong>AltaGas Retail (INV-2026-0312)</strong> — $1,640 variance. Formal response required. Target: Mar 13.<br>2. <strong>Calgary Energy</strong> — Commission reconciliation pending their updated submission. Target: Mar 14.<br>3. <strong>SolarEdge minor exception</strong> — $180 rounding discrepancy. Auto-eligible for resolution under the $500 threshold rule. Can close immediately.<br><br>Once these three close, commission statements issue to all 52 marketers. <strong>Final settlement target: March 20.</strong> Currently tracking 2 days ahead of last cycle — strong position.`,

  // ── FLOW 4: Thena Analytics Prescriptive ─────────────────────────

  'top revenue risks q2': `<strong>Q2 2026 Revenue Risk Assessment</strong><br><br><strong>1. Late Payment Exposure — $41,200 (High · 82% confidence)</strong><br>17 accounts show payment delay indicators based on billing complaint frequency, variable plan exposure, and AESO price volatility. Proactive outreach in the next 7 days historically recovers 60–70% of at-risk balance without escalation.<br><br><strong>2. Churn Risk — $84,000 LTV at risk (Medium · 79% confidence)</strong><br>42 accounts match the churn pattern: 3+ billing complaints plus variable plan mismatch. Most have been on variable plans since AESO prices spiked in Q4 2025. A targeted fixed-rate offer at $0 switch cost would retain an estimated 28–35 of these accounts.<br><br><strong>3. Marketer Underperformance — $68,000 revenue gap (Medium)</strong><br>GreenPath, AltaEnergy, and SolarEdge combined have 40% above-average lead quality but 28% below-average conversion. Coaching gap, not a lead problem. One structured enablement session typically closes this within 6 weeks.<br><br><strong>Priority order:</strong> Collections outreach first (fastest cash). Marketer enablement in parallel. Retention campaign in week 3.`,

  'which accounts prioritize': `<strong>Late Payment Priority — Top 10 of 17 Accounts</strong><br><br>Ranked by composite risk score (balance × payment history × AESO exposure):<br><br>1. <strong>MacGregor Industrial Ltd.</strong> (C-10478) — $8,400 outstanding · 31 days overdue · High AESO exposure<br>2. <strong>Lakeside Industrial Ltd.</strong> (C-10481) — $14,200 pending · New account risk flag<br>3. <strong>Moreau, Jean-Pierre</strong> (C-10391) — $124 NSF flagged · Recurring late payment pattern<br>4. <strong>Wilson, Barbara</strong> (C-10470) — $124 balance dispute · Rate mismatch unresolved<br>5. <strong>Pemberton Resources Corp</strong> (C-10468) — $2,800 net overdue · Q1 deterioration<br>...<br><br>Accounts 1–5 represent <strong>87% of total exposure</strong> ($26,100 of $41,200). I recommend starting outreach there. Shall I draft the collections email for the top 5?`,

  '30 day action plan': `<strong>UTILITYnet — 30-Day Prescriptive Action Plan</strong><br><em>Projected combined impact: CAD $182,500</em><br><br><strong>Week 1 (Mar 11–17) — Collections</strong><br>Target 17 at-risk accounts with proactive outreach. Expected recovery: $24,700–$30,500 (60–74% of $41,200 exposure).<br><br><strong>Week 2 (Mar 18–24) — Marketer Enablement</strong><br>Schedule GreenPath, AltaEnergy, SolarEdge enablement sessions. Focus: conversion script and fixed-rate offer positioning. Expected uplift: $68,000 annualized if conversion normalizes to benchmark.<br><br><strong>Week 3 (Mar 25–31) — Retention Campaign</strong><br>Launch fixed-rate offer to 42 churn-risk accounts. $0 switch cost, 6-month rate lock. Expected retained LTV: $56,000–$84,000.<br><br><strong>Week 4 (Apr 1–7) — Hedge Review</strong><br>Increase industrial hedge coverage from 61% → 75% before April billing. AESO forward pricing +6.2% — unhedged exposure grows weekly. Expected risk reduction: ~$28,000 April billing variance.<br><br>Confidence: 76% overall. Want me to generate the Week 1 outreach email?`,

  'reduce late payments': `<strong>Prescriptive Recommendations — Late Payment Risk</strong><br><br><strong>Immediate (this week):</strong><br>• Send proactive outreach to 17 at-risk accounts. Emberlyn can draft personalized emails segmented by risk tier. Expected to prevent $24,700–$30,500 in collections escalation.<br>• Flag the top 5 accounts for personal phone follow-up — these represent 87% of exposure.<br><br><strong>Structural (this month):</strong><br>• Auto-enroll variable-plan customers with 2+ late payments in a payment plan offer — reduces NSF risk by approximately 40% based on historical data.<br>• Add payment reminder automation at 7-day and 3-day pre-due triggers. Currently only 30-day notices go out.<br><br><strong>Platform lever:</strong><br>The $41,200 risk exposure correlates 91% with variable plan accounts during AESO price volatility periods. Long-term fix is a more aggressive fixed-rate conversion offer during high-volatility months.<br><br>Start with the outreach — it's this week's lever.`,

  'draft collections email': `__ACTION_PREVIEW__
  <div class="action-preview-label">📧 Collections Email — Top 5 Accounts</div>
  <div style="font:500 12px var(--font-ui);color:var(--light);margin-bottom:8px"><strong>To:</strong> MacGregor Industrial Ltd., Lakeside Industrial Ltd., Moreau Jean-Pierre, Wilson Barbara, Pemberton Resources Corp &nbsp;|&nbsp; <strong>Subject:</strong> Outstanding Balance — Action Required</div>
  <div style="font:400 12px var(--font-ui);color:var(--text);line-height:1.7">Dear Valued Customer,<br><br>We're writing regarding your outstanding balance on your UTILITYnet account. Your payment is past due and we'd like to work with you to resolve this before escalation.<br><br><strong>Next steps:</strong> Please contact us within 7 days to arrange payment or discuss a payment plan. We offer flexible options for accounts in good standing. If we don't hear from you, your account may be referred to collections per our terms of service.<br><br>UTILITYnet Billing Operations</div>
  <div style="margin-top:12px;font:500 10px var(--font-mono);letter-spacing:0.08em;text-transform:uppercase;color:var(--gold)">Actions: Send to 5 accounts · Flag for follow-up if no response by Mar 18</div>`,

  // ── FLOW 5: Thena Executive Q&A ──────────────────────────────────

  'forecast april revenue': `<strong>April 2026 Revenue Forecast</strong><br><br><strong>Base case: $2.21M–$2.47M</strong> (confidence: 76%)<br><br><strong>Growth drivers:</strong><br>• +310–380 net new enrollments expected. Current pipeline conversion rate 68% (30-day rolling). Residential leads up 12% from March.<br>• AESO forward pricing +6.2% avg benefits revenue on industrial accounts — net effect positive ~$80K.<br><br><strong>Headwinds:</strong><br>• 42 churn-risk accounts could reduce revenue $28,000–$42,000 if no retention action taken.<br>• Collections risk ($41,200) shifts timing of cash recognition.<br><br><strong>Upside scenario ($2.58M):</strong> Collections outreach succeeds at 74%+ recovery + marketer conversion improves to benchmark.<br><br><strong>Downside scenario ($1.94M):</strong> Churn materializes + AESO pricing spike triggers industrial disputes.<br><br>March MTD is $2.34M with 20 days completed — strong base. April looks solid if collections and retention actions launch this week.`,

  'marketers below target': `<strong>Marketer Performance Alert — 3 Below Benchmark</strong><br><br><table style="font:500 11px var(--font-ui);width:100%;border-collapse:collapse"><thead><tr style="border-bottom:1px solid rgba(242,240,236,0.13)"><th style="text-align:left;padding:4px 8px;opacity:0.6">Marketer</th><th style="text-align:right;padding:4px 8px;opacity:0.6">Conv. Rate</th><th style="text-align:right;padding:4px 8px;opacity:0.6">Benchmark</th><th style="text-align:right;padding:4px 8px;opacity:0.6">Gap/mo</th></tr></thead><tbody><tr style="border-bottom:1px solid rgba(242,240,236,0.07)"><td style="padding:6px 8px">GreenPath</td><td style="text-align:right;padding:6px 8px;color:#E74C3C">31%</td><td style="text-align:right;padding:6px 8px;opacity:0.6">52%</td><td style="text-align:right;padding:6px 8px;color:#E74C3C">−$28,400</td></tr><tr style="border-bottom:1px solid rgba(242,240,236,0.07)"><td style="padding:6px 8px">AltaEnergy</td><td style="text-align:right;padding:6px 8px;color:#E74C3C">34%</td><td style="text-align:right;padding:6px 8px;opacity:0.6">52%</td><td style="text-align:right;padding:6px 8px;color:#E74C3C">−$22,100</td></tr><tr><td style="padding:6px 8px">SolarEdge</td><td style="text-align:right;padding:6px 8px;color:#D4A017">38%</td><td style="text-align:right;padding:6px 8px;opacity:0.6">52%</td><td style="text-align:right;padding:6px 8px;color:#D4A017">−$17,500</td></tr></tbody></table><br><strong>Combined revenue gap: ~$68,000/month</strong> if brought to benchmark conversion.<br><br>Key finding: all three have <strong>above-average lead quality</strong> (7.7–8.2/10). This is a conversion problem, not a lead problem — it's fixable through coaching, not recruitment.<br><br>Pattern: top performers NRG Direct and PrairieEnergy lead with fixed-rate offers and switch after first objection. Recommend a structured sales script update + one enablement call within 2 weeks. GreenPath first — largest absolute gap.`,

  'which marketers need attention': `GreenPath, AltaEnergy, and SolarEdge need attention this month. All three show strong leads but below-benchmark conversion (~$68K/month combined gap).<br><br>• <strong>GreenPath</strong> — 31% conversion vs 52% benchmark (−$28,400/mo). Largest absolute gap.<br>• <strong>AltaEnergy</strong> — 34% conversion (−$22,100/mo).<br>• <strong>SolarEdge</strong> — 38% conversion (−$17,500/mo).<br><br>Key finding: above-average lead quality (7.7–8.2/10). This is a conversion problem, not a lead problem. Recommended: enablement call this week with structured sales script and fixed-rate offer positioning.`,

  'forecast service call volume': `22–28 cases (71% confidence) for next month.<br><br>Based on March 28-day trend + AESO schedule. What would push it higher: billing exception backlog.`,

  'top drivers billing exceptions': `<strong>Billing Exception Root Cause Analysis — March 2026</strong><br><br>This month's 3 exceptions share a common upstream cause: <strong>AESO meter data gaps</strong> affecting Edmonton industrial accounts post-firmware update (Feb 28 deployment).<br><br>• <strong>EXC-0311-A (MacGregor, $4,200):</strong> 8-day meter gap, firmware-related<br>• <strong>EXC-0311-B (Wilson, $38.40):</strong> Rate table mismatch — variable rate cache not refreshed<br>• <strong>EXC-0311-C (Moreau, $124):</strong> NSF payment return — unrelated to AESO<br><br>Historical context: billing accuracy is 99.9% (2,847 invoices, 3 exceptions). The AESO firmware issue is an anomaly — expect it to clear next cycle once ATCO confirms patch deployment.<br><br>Structural recommendation: add a pre-batch validation rule that flags any account with zero kWh reads vs. prior period for manual review before invoice generation. This would have caught EXC-0311-A automatically.`,

  // ── FLOW: Finance — AP / Month-End Close ─────────────────────────

  'ap items blocking month end': `<strong>AP Items Blocking Month-End Close — March 2026</strong><br><br><strong>1 remaining blocker:</strong><br>• <strong>AltaGas Settlement Payable</strong> — $6.82M · Awaiting final settlement reconciliation (target Mar 15). Once AltaGas variance is resolved, JE-2026-0091 will post and March close can complete.<br><br>Marketer commissions (JE-2026-0088) were approved earlier — that blocker is cleared. The AP queue shows $1.19M approved and posted. Only the AltaGas settlement item is holding month-end.<br><br>Recommendation: prioritize the AltaGas reconciliation response this week. Settlement team has the formal draft ready — once AltaGas confirms, the journal entry posts automatically and Finance can close March.`,
};

export function getCacheKey(text, context = '') {
  const t = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const isMacGregor = context && context.replace(/-/g, '').includes('C10478');
  const patterns = [
    ...(isMacGregor ? [
      ['summarize macgregor recent issues', ['summarize', 'recent issue', 'account summary', 'what happened', 'history', 'this customer']],
      ['draft macgregor response', ['draft', 'email', 'response', 'customer', 'write', 'explaining', 'last invoice']],
    ] : []),
    ['summarize customer issues', ['summarize', 'recent issue', 'account summary', 'what happened', 'history', 'this customer']],
    ['draft response altagas', ['altagas']],
    ['draft customer email', ['draft', 'email', 'response', 'customer', 'write', 'explaining', 'last invoice']],
    ['create follow-up task', ['follow-up', 'followup', 'create task', 'update case', 'apply']],
    ['explain billing exception', ['explain', 'exc-0311', 'exc 0311', 'why exception', 'why flagged', 'root cause exception', 'what caused']],
    ['ap items blocking month end', ['ap item', 'blocking', 'month-end', 'month end close', 'blocking month']],
    ['what changed since last bill', ['what changed', 'changed since', 'vs last', 'previous bill', 'comparison']],
    ['recommend next step exception', ['next step', 'recommend', 'how to resolve', 'resolution']],
    ['root cause settlement', ['root cause', 'mismatch', 'why variance', 'what caused settlement', 'settlement cause']],
    ['what to resolve before closing', ['before closing', 'what needs', 'resolve before', 'checklist']],
    ['top revenue risks q2', ['revenue risk', 'top risk', 'q2 risk', 'biggest risk', 'business risk']],
    ['which accounts prioritize', ['which account', 'prioritize', 'who are the 17', 'priority list']],
    ['30 day action plan', ['30 day', 'action plan', 'what to do', '30-day']],
    ['reduce late payments', ['reduce late', 'late payment', 'collections', 'payment risk', 'at-risk account']],
    ['draft collections email', ['draft', 'collections email', 'top 5', 'top five', 'outreach email', 'collections outreach']],
    ['forecast april revenue', ['forecast', 'april', 'revenue forecast', 'next month revenue']],
    ['marketers below target', ['below target', 'underperform', 'marketer performance', 'trending below']],
    ['which marketers need attention', ['which marketer', 'marketers need attention', 'attention this month']],
    ['forecast service call volume', ['service call', 'call volume', 'forecast']],
    ['top drivers billing exceptions', ['top driver', 'billing exception driver', 'exception cause', 'why exception this month']],
  ];
  for (const [key, triggers] of patterns) {
    if (triggers.some((trigger) => t.includes(trigger))) return key;
  }
  return null;
}

export async function streamCached(text, onChunk, onDone) {
  for (const char of text) {
    onChunk(char);
    await new Promise((r) => setTimeout(r, 12));
  }
  onDone(text);
}
