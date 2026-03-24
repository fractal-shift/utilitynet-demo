/**
 * Tutorial scenarios — single source of truth for Coach Rail content.
 * Used by CoachRail.jsx, useTutorialAudio.js, useTutorialHighlight.js, generate-audio.mjs
 */

export const TUTORIAL_SCENARIOS = [
  {
    id: 'dashboard',
    title: 'Operations Dashboard',
    module: 'Dashboard',
    duration: '2 min',
    description: 'Executive overview of operations',
    triggerPhrases: ['dashboard', 'overview', 'kpi', 'executive'],
    steps: [
      {
        id: 'dashboard-overview',
        title: 'Dashboard Overview',
        demoTarget: 'nav-dashboard',
        narration:
          "Sarah opens her dashboard before her first meeting. She didn't run a report — Emberlyn analyzed overnight activity and surfaced what matters. Everything she needs to start her day is already here.",
      },
      {
        id: 'dashboard-kpis',
        title: 'KPI Cards',
        demoTarget: 'kpi-revenue',
        narration:
          "Revenue tracking above forecast. Settlement at 98.2%. She glances at the four numbers and moves on — there's no story here that needs her attention right now.",
      },
      {
        id: 'dashboard-revenue-trend',
        title: 'Revenue Trend',
        demoTarget: 'chart-revenue-trend',
        narration:
          "The trend line tells the 12-month story at a glance. March is the peak. Sarah doesn't need a chart meeting to understand this — it's right in front of her.",
      },
      {
        id: 'dashboard-predictive',
        title: 'Predictive Insights',
        demoTarget: 'predictive-insights',
        narration:
          "Emberlyn flagged two things overnight: a late payment cluster building in the residential segment and three marketers showing below-benchmark conversion. She didn't ask for this. The platform built it for her while she slept.",
      },
      {
        id: 'dashboard-tasks',
        title: 'Billing Exceptions',
        demoTarget: 'nav-billing',
        narration:
          "Sarah sees the billing exception on her task list — Emberlyn put it there. She clicks it. She's in Billing reviewing the exception before her coffee is cold.",
      },
    ],
  },
  {
    id: 'finance',
    title: 'Finance — GL, AR, AP & GL Remediation',
    module: 'Finance',
    duration: '4 min',
    description: 'Walk through the Finance module: chart of accounts, AP approval, GL Remediation diagnostic with interactive issue resolution and governance layer.',
    triggerPhrases: ['finance', 'finance gl scenario', 'general ledger', 'gl codes', 'tutorial'],
    steps: [
      {
        id: 'finance-overview',
        title: 'Finance Overview',
        demoTarget: 'finance-overview',
        narration: "It's month-end. Sarah opens Finance. Two AP items are blocking close — she knew this before she sat down. Emberlyn flagged it overnight.",
      },
      {
        id: 'finance-gl-table',
        title: 'Chart of Accounts',
        demoTarget: 'finance-gl-table',
        narration: "The General Ledger is live. Every transaction posts automatically. Sarah posts a manual journal entry for the hedge reclassification — the audit trail captures who posted it, when, and from where. No black boxes.",
      },
      {
        id: 'finance-ap-approve',
        title: 'AP Approval',
        demoTarget: 'finance-ap-table',
        narration: "Sarah approves the AltaGas settlement. Watch what happens: journal entry created automatically, GL updates in real time. No email to accounting. No manual entry. The approval is the work.",
      },
      {
        id: 'finance-gl-remediation',
        title: 'GL Remediation Scan',
        demoTarget: 'finance-tab-gl-remediation',
        narration: "GL Remediation surfaces what's been hiding in the Oracle system for years. Chart health at 58%. Four issues — one critical. Sarah can see the debt, understand it, and fix it. For the first time.",
      },
      {
        id: 'finance-gl-detail',
        title: 'Issue Detail & AI Recommendation',
        demoTarget: 'finance-gl-issues-table',
        narration: "She opens the critical issue — HEDGE-OLD. $42,000 balance, misclassified since 2019. The platform has already diagnosed it, explained the resolution, and is waiting for her sign-off. Not guessing. Knowing.",
      },
      {
        id: 'finance-gl-bulk',
        title: 'Bulk Remediation',
        demoTarget: 'finance-gl-bulk-actions',
        narration: "Three clean issues selected. Sarah applies the recommended actions in bulk — merge, retire, reclassify. Chart health updates immediately. HEDGE-OLD stays flagged — it needs a journal entry first. No false progress.",
      },
      {
        id: 'finance-gl-governance',
        title: 'Governance Layer',
        demoTarget: 'finance-gl-governance',
        narration: "The governance panel prevents regression. New GL codes require approval. Justification is mandatory. This is what stops the debt from coming back.",
      },
    ],
  },
  {
    id: 'enrollment',
    title: 'Enrollment — New Customer Onboarding',
    module: 'Customers',
    duration: '5 min',
    description: 'End-to-end enrollment flow: customer form, credit check, banking, plan selection, and approval.',
    triggerPhrases: ['enrollment', 'new customer', 'onboarding'],
    steps: [
      {
        id: 'enrollment-start-btn',
        title: 'Start Enrollment',
        demoTarget: 'btn-new-enrollment',
        narration: "A call just came in. Heather Mitchell, referred by NRG Direct, wants to sign up. Sarah opens enrollment. Heather is still on the line.",
      },
      {
        id: 'enrollment-customer-form',
        title: 'Customer Information',
        demoTarget: 'enrollment-firstName',
        narration: "Name, address, service start. One master record — shared instantly across billing, settlement, and finance. She doesn't enter this twice.",
      },
      {
        id: 'enrollment-credit-check',
        title: 'Credit Check',
        demoTarget: 'enrollment-run-credit',
        narration: "Credit check runs automatically. 724 score, low risk, approved in under two seconds. Sarah didn't touch a thing.",
      },
      {
        id: 'enrollment-plan-select',
        title: 'Plan Selection',
        demoTarget: 'enrollment-continue-2',
        narration: "Plan options filtered automatically by credit score and distribution zone. Heather only sees what she qualifies for. Sarah selects the variable rate plan.",
      },
      {
        id: 'enrollment-banking-form',
        title: 'Banking & Payment',
        demoTarget: 'enrollment-continue-3',
        narration: "Pre-authorized debit captured and validated against the RBC feed in real time. PAD agreement generated automatically. No follow-up call needed.",
      },
      {
        id: 'enrollment-approve-btn',
        title: 'Approve & Activate',
        demoTarget: 'enrollment-submit',
        narration: "Enrollment confirmed. Meter read scheduled, contract executed, NRG Direct notified — all automatic. Heather is a customer. That took under two minutes.",
      },
      {
        id: 'enrollment-credit-fail',
        title: 'Credit Fail Path',
        demoTarget: 'toggle-failed-credit',
        narration: "Next customer. Credit score 492 — declined. Sarah doesn't need to know the policy. The platform surfaces three options under Alberta regulations. She picks deposit. Customer activates with a hold on file.",
      },
    ],
  },
  {
    id: 'billing',
    title: 'Billing — Rate Application & Invoice Generation',
    module: 'Billing',
    duration: '5 min',
    description: 'Import consumption, apply rates, allocate hedges, generate invoices, and handle exceptions.',
    triggerPhrases: ['billing', 'billing engine', 'billing scenario'],
    steps: [
      {
        id: 'billing-import-btn',
        title: 'Import Consumption',
        demoTarget: 'billing-import-btn',
        narration: "Billing run time. Sarah launches Batch B-2026-0311 — 2,847 site-months of metered usage. The AESO feed ingests automatically. What used to take a full day of manual imports is already done.",
      },
      {
        id: 'billing-rate-apply',
        title: 'Apply Rates',
        demoTarget: 'billing-rate-apply',
        narration: "Variable rate applied across all 2,847 line items. Batch total: $1.84 million. The rate engine pulls from the live AESO feed — no manual entry, no pricing errors.",
      },
      {
        id: 'billing-hedge-allocation',
        title: 'Hedge Allocation',
        demoTarget: 'billing-hedge-allocation',
        narration: "$214,000 in hedge costs distributed across fixed-price customers. Net margin protected at 8.4%. A calculation that used to take two hours and a separate spreadsheet — done automatically.",
      },
      {
        id: 'billing-generate-btn',
        title: 'Generate Invoices',
        demoTarget: 'billing-generate-btn',
        narration: "2,847 invoices generated. Journal entry created automatically — Revenue Account 4000 credited $1.84 million. Finance already has it. Sarah didn't send them anything.",
      },
      {
        id: 'billing-exception-flag',
        title: 'Exception Handling',
        demoTarget: 'billing-exception-flag',
        narration: "One exception: MacGregor Industrial, 340% usage spike. The batch doesn't hold. The exception is flagged, routed to Emberlyn, diagnosed, and resolved — without leaving the screen.",
      },
      {
        id: 'billing-send-btn',
        title: 'Send to Finance',
        demoTarget: 'billing-send-btn',
        narration: "Exception resolved. 2,847 clean invoices shipped. The entire billing cycle — import, price, allocate, generate, triage, send — done in under two minutes. The legacy system took three days.",
      },
    ],
  },
  {
    id: 'settlement',
    title: 'Settlement — Reconciliation & Distributor Match',
    module: 'Settlement',
    duration: '4 min',
    description: 'Import distributor data, match to internal records, apply Emberlyn insights, and allocate to marketer partners.',
    triggerPhrases: ['settlement', 'reconciliation', 'distributor'],
    steps: [
      {
        id: 'settlement-import-btn',
        title: 'Import Distributor Data',
        demoTarget: 'settlement-import-btn',
        narration: "End of month. 52 marketer feeds to reconcile. Sarah runs the reconciliation — the platform matches AESO metered data against every distributor invoice automatically.",
      },
      {
        id: 'settlement-match-table',
        title: 'Reconciliation Match',
        demoTarget: 'settlement-match-table',
        narration: "49 of 52 feeds match perfectly. Three exceptions. AltaGas Retail is flagged — $1,640 variance on SITE-20011. Sarah opens it directly from the exception row.",
      },
      {
        id: 'settlement-emberlyn-insight',
        title: 'Emberlyn Insight',
        demoTarget: 'settlement-emberlyn-insight',
        narration: "Emberlyn already has the full picture — AESO data, AltaGas figures, site-level reads. Root cause traced to eight meter reads not reflected in AltaGas's submission. The platform's figures are confirmed.",
      },
      {
        id: 'settlement-marketer-allocation',
        title: 'Marketer Allocation',
        demoTarget: 'settlement-marketer-allocation',
        narration: "Emberlyn drafts the dispute response — formal, factual, cite-specific. Sarah reviews it and sends. AltaGas updates to Resolved. No email chain. No week of back-and-forth.",
      },
      {
        id: 'settlement-report-btn',
        title: 'Export Report',
        demoTarget: 'settlement-report-btn',
        narration: "Reconciliation posted to Finance. Journal entry created automatically. The entire exception — identify, investigate, respond, resolve, post — handled without a spreadsheet.",
      },
    ],
  },
  {
    id: 'marketers',
    title: 'Marketers — Partner Portal & Margin Management',
    module: 'Marketers',
    duration: '4 min',
    description: 'Dashboard, plan creation, margin settings, customer view, and revenue reporting.',
    triggerPhrases: ['marketer', 'partner portal', 'energy marketer'],
    steps: [
      {
        id: 'marketer-dashboard',
        title: 'Marketer Dashboard',
        demoTarget: 'marketer-dashboard',
        narration: "Sarah checks her marketer channel after lunch. Six active partners. NRG Direct leading at $841,000. She can see who's growing, who's stalling, and where margin is compressed — without pulling a report.",
      },
      {
        id: 'marketer-customers-tab',
        title: 'Customer Portfolio',
        demoTarget: 'marketer-customers-tab',
        narration: "Each marketer's customer book is live. NRG Direct: 4,821 active customers. Commission calculations run automatically from this data. No marketer sends a spreadsheet to get paid.",
      },
      {
        id: 'marketer-margin-input',
        title: 'Margin Management',
        demoTarget: 'marketer-margin-input',
        narration: "Apex Energy's margin needs updating. Sarah changes it. The new rate applies to all future billing runs immediately. Every change is tracked — who, when, what it was before.",
      },
      {
        id: 'marketer-revenue-report',
        title: 'Revenue Report',
        demoTarget: 'marketer-revenue-report',
        narration: "Sarah asks Emberlyn which marketers need attention. She gets specific, actionable recommendations — not a report to interpret. Then she asks Thena to forecast Q2 channel performance. She has the answer before the quarterly review starts.",
      },
      {
        id: 'marketer-plan-create',
        title: 'Create Plan',
        demoTarget: 'marketer-plan-create',
        narration: "New marketer onboarding. Territory, margin, product access, prudential limit — set in minutes. They can submit enrollments the same day. No IT ticket. No waiting.",
      },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics — Birdseye, Revenue & Reporting',
    module: 'Analytics',
    duration: '3 min',
    description: 'Overview dashboard, revenue drill-down, marketer analysis, and Thena AI reporting.',
    triggerPhrases: ['analytics', 'birdseye', 'thena', 'reporting'],
    steps: [
      {
        id: 'analytics-overview',
        title: 'Analytics Overview',
        demoTarget: 'analytics-overview',
        narration: "Board prep. The CFO wants answers Sarah doesn't have time to pull manually. She opens Analytics. Revenue trend, marketer performance, predictive risk — all live from billing and settlement data.",
      },
      {
        id: 'analytics-revenue-panel',
        title: 'Revenue Analysis',
        demoTarget: 'analytics-revenue-panel',
        narration: "She drills into March revenue — $6.82 million Q1, by segment, by marketer, to invoice level. One click from insight to GL export. No analyst needed.",
      },
      {
        id: 'analytics-marketer-panel',
        title: 'Marketer Performance',
        demoTarget: 'analytics-marketer-panel',
        narration: "Marketer ranking by revenue contribution. She can see which channels are growing and which are compressing margin — without asking anyone for a report.",
      },
      {
        id: 'analytics-thena-panel',
        title: 'Thena AI Reporting',
        demoTarget: 'analytics-thena-panel',
        narration: "Sarah asks Thena a hard question. The answer a senior analyst would take three days to produce comes back in ten seconds. She has what she needs for tomorrow's board meeting.",
      },
    ],
  },
  {
    id: 'customer-service',
    title: 'Customer Service — Complaint Resolution',
    module: 'Customers',
    duration: '3 min',
    description: 'Handle a billing complaint: Customer 360, Emberlyn AI investigation, and resolution.',
    triggerPhrases: ['customer service', 'complaint', 'customer support', 'macgregor'],
    steps: [
      {
        id: 'customer-navigate',
        title: 'Navigate to Customers',
        demoTarget: 'nav-customers',
        narration: "A customer called in about a billing dispute. Before Sarah picks up, she opens the customer record. She already knows the account history, open invoices, payment behaviour, and the marketer who enrolled them.",
      },
      {
        id: 'customer-360-view',
        title: 'Customer 360',
        demoTarget: 'row-C-10478',
        narration: "The Customer 360 view shows everything. The $8,400 exception is visible with full context — no need to ask billing for background. She has more information than the customer expects her to have.",
      },
      {
        id: 'customer-emberlyn-draft',
        title: 'Emberlyn Investigation',
        demoTarget: 'customer360-draft-email',
        narration: "Emberlyn identifies the root cause — a metering anomaly on SITE-20011 — and drafts the response. Sarah reviews it. It's accurate. She sends it.",
      },
      {
        id: 'customer-confirm-action',
        title: 'Confirm Resolution',
        demoTarget: 'emberlyn-confirm',
        narration: "Case resolved. Credit memo created in Finance automatically. Receive, investigate, respond, resolve — done in under 90 seconds. The customer didn't wait on hold.",
      },
    ],
  },
];

/**
 * Finds a tutorial scenario by matching user input against trigger phrases.
 * @param {string} input - User input (e.g. from Emberlyn chat)
 * @returns {object|undefined} - Matching scenario object or undefined
 */
export function findScenarioByPhrase(input) {
  if (!input || typeof input !== 'string') return undefined;
  const normalized = input.toLowerCase().trim();
  return TUTORIAL_SCENARIOS.find((scenario) =>
    scenario.triggerPhrases.some((phrase) => normalized.includes(phrase.toLowerCase()))
  );
}

/**
 * Returns the audio file path for a given scenario and step.
 * @param {string} scenarioId - Scenario id (e.g. 'finance', 'enrollment')
 * @param {string} stepId - Step id (e.g. 'finance-gl-table', 'enrollment-start-btn')
 * @returns {string} - Path like /audio/finance/finance-gl-table.mp3
 */
export function audioPath(scenarioId, stepId) {
  return `/audio/${scenarioId}/${stepId}.mp3`;
}
