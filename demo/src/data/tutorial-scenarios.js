/**
 * Tutorial scenarios — single source of truth for Coach Rail content.
 * Used by CoachRail.jsx, useTutorialAudio.js, useTutorialHighlight.js, generate-audio.mjs
 */

export const TUTORIAL_SCENARIOS = [
  {
    id: 'finance',
    title: 'Finance — General Ledger & Month-End Close',
    module: 'Finance',
    duration: '4 min',
    description: 'Walk through the Finance module: GL codes, legacy lift scan, remediation planning, and month-end cleanup.',
    triggerPhrases: ['finance', 'finance gl scenario', 'general ledger', 'gl codes', 'tutorial'],
    steps: [
      {
        id: 'finance-overview',
        title: 'Finance Overview',
        demoTarget: 'finance-overview',
        narration: 'The Finance module is where the numbers live — general ledger, accounts receivable, accounts payable, and month-end reconciliation all in one place. March 2026: $2.34M revenue month to date, $184K AR outstanding, and $1.82M cash in the RBC operating account.',
      },
      {
        id: 'finance-gl-table',
        title: 'Chart of Accounts',
        demoTarget: 'finance-gl-table',
        narration: 'The General Ledger shows six core accounts — Energy Revenue credited $2.34M, AESO Settlement Payable at $6.82M, AR at $184K. Every transaction posts automatically. A manual journal entry is being posted now — the full audit trail captures who posted it, when, and why.',
      },
      {
        id: 'finance-legacylift-scan',
        title: 'Legacy Lift Scan',
        demoTarget: 'finance-legacylift-scan',
        narration: 'The GL Migration tab shows what the migration tool found in the legacy Oracle system — orphaned codes, misclassified accounts, and codes with no mapping. Three are flagged. The system proposes clean replacements automatically. No consultant, no spreadsheet.',
      },
      {
        id: 'finance-remediation-plan',
        title: 'Remediation Plan',
        demoTarget: 'finance-remediation-plan',
        narration: 'AR aging shows $139K overdue across two accounts. AP has $1.19M queued — marketer commissions and the AltaGas settlement. The first AP item is being approved now. Watch what happens automatically.',
      },
      {
        id: 'finance-confirm-cleanup',
        title: 'Confirm Cleanup',
        demoTarget: 'finance-confirm-cleanup',
        narration: 'Approved. Journal entry JE-2026-0088 created — no manual GL entry, no email to accounting. The audit trail is complete and reconciliation updates in real time. This is what Finance first looks like in a modern energy retailer.',
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
        demoTarget: 'enrollment-start-btn',
        narration: 'The ERP handles the entire customer onboarding journey in one place — from application through activation. Heather Mitchell is being enrolled as a new residential customer. No spreadsheets, no handoffs between sales, credit, and operations.',
      },
      {
        id: 'enrollment-customer-form',
        title: 'Customer Information',
        demoTarget: 'enrollment-customer-form',
        narration: 'Name, contact details, and service address are entered. Every field validates in real time and syncs to the CRM immediately. One master customer record shared across billing, settlement, and finance — no duplicate data entry anywhere.',
      },
      {
        id: 'enrollment-credit-check',
        title: 'Credit Check',
        demoTarget: 'enrollment-credit-check',
        narration: "The credit bureau check runs automatically — no manual lookup. Heather scores 724, low risk. The system approves her immediately and moves to plan selection. The whole check takes under two seconds.",
      },
      {
        id: 'enrollment-plan-select',
        title: 'Plan Selection',
        demoTarget: 'enrollment-plan-select',
        narration: "A variable rate plan is selected — tied to the current AESO pool price plus NRG Direct's margin. Plan options are filtered by credit score and distribution zone automatically. She only sees plans she qualifies for.",
      },
      {
        id: 'enrollment-banking-form',
        title: 'Banking & Payment',
        demoTarget: 'enrollment-banking-form',
        narration: 'Pre-authorized debit details are captured and validated against the RBC feed in real time. The PAD agreement is generated and stored automatically — no follow-up call needed to collect payment details.',
      },
      {
        id: 'enrollment-approve-btn',
        title: 'Approve & Activate',
        demoTarget: 'enrollment-approve-btn',
        narration: 'Enrollment confirmed. The system triggers meter read request, contract execution, and the first bill cycle automatically. NRG Direct receives an instant notification. What used to take three days is done in under two minutes.',
      },
      {
        id: 'enrollment-credit-fail',
        title: 'Credit Fail Path',
        demoTarget: 'toggle-failed-credit',
        narration: 'Now the declined credit path. Same enrollment flow — but this customer scores 492. The system surfaces three options instantly: require a prudential deposit, adjust the risk tier, or decline. No judgment call required. A $250 deposit is applied and enrollment completes.',
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
        narration: 'The March billing run covers 2,847 site-months of metered usage. The AESO usage feed is ingested automatically — Batch B-2026-0311 created, every line item staged for pricing. This used to take a full day of manual imports.',
      },
      {
        id: 'billing-rate-apply',
        title: 'Apply Rates',
        demoTarget: 'billing-rate-apply',
        narration: 'Variable rate applied — AESO pool price $4.82 per gigajoule plus $0.38 distribution. All 2,847 line items priced in seconds. Batch total: $1.84 million. The rate engine pulls directly from the live AESO feed — no manual entry, no pricing errors.',
      },
      {
        id: 'billing-hedge-allocation',
        title: 'Hedge Allocation',
        demoTarget: 'billing-hedge-allocation',
        narration: '$214,000 in hedge costs distributed across 1,203 fixed-price customers. Net margin protected at 8.4%. Hedge exposure allocated automatically based on contract type and volume — a calculation that used to require a separate spreadsheet and two hours of analyst time.',
      },
      {
        id: 'billing-generate-btn',
        title: 'Generate Invoices',
        demoTarget: 'billing-generate-btn',
        narration: "2,847 invoices generated. Journal Entry JE-2026-0089 created automatically — Revenue Account 4000 credited $1.84 million. The GL posts the moment invoices generate. Finance doesn't wait for a report. It's already there.",
      },
      {
        id: 'billing-exception-flag',
        title: 'Exception Handling',
        demoTarget: 'billing-exception-flag',
        narration: 'One exception: SITE-20011 shows a 340% usage spike. Instead of holding the entire batch, the system flags it and routes to Emberlyn. The exception is explained, a recommendation made, and resolved — without leaving the screen.',
      },
      {
        id: 'billing-send-btn',
        title: 'Send to Finance',
        demoTarget: 'billing-send-btn',
        narration: 'Exception resolved. 2,847 clean invoices distributed. The full billing cycle — import, price, allocate, generate, triage, send — completed in under two minutes. In the legacy system this took three days.',
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
        narration: 'The settlement module reconciles distributor invoices against AESO metered data automatically. AltaGas submitted an invoice with a $1,640 variance on SITE-20011. The system is set to the variance scenario — watch how a real dispute gets handled.',
      },
      {
        id: 'settlement-match-table',
        title: 'Reconciliation Match',
        demoTarget: 'settlement-match-table',
        narration: "49 of 52 marketer feeds reconciled automatically. Three exceptions remain — AltaGas Retail flagged with the $1,640 variance. Rather than a week of emails, Emberlyn is opened directly from the exception row.",
      },
      {
        id: 'settlement-emberlyn-insight',
        title: 'Emberlyn Insight',
        demoTarget: 'settlement-emberlyn-insight',
        narration: "Emberlyn has full context — AESO metered data, AltaGas figures, site-level reads, and the variance breakdown. Root cause traced to eight site meter reads not reflected in AltaGas's submission. AESO data confirms the platform's figures.",
      },
      {
        id: 'settlement-marketer-allocation',
        title: 'Marketer Allocation',
        demoTarget: 'settlement-marketer-allocation',
        narration: "Emberlyn drafts the dispute response — formal, factual, referencing specific meter reads and AESO confirmation. The platform's figures are accepted. AltaGas updates from Exception to Resolved. 50 of 52 feeds now reconciled.",
      },
      {
        id: 'settlement-report-btn',
        title: 'Export Report',
        demoTarget: 'settlement-report-btn',
        narration: 'Reconciliation sent to Finance. Journal entry JE-2026-0091 created — Account 2200 AESO Settlement Payable updated. The entire exception workflow — identify, investigate, respond, resolve, post — completed without a single email or spreadsheet.',
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
        narration: 'The Marketer portal gives full visibility into the partner channel. Six active marketers, $2.34M revenue month to date, 284 new enrollments this month. NRG Direct leads at $841K. Every number flows directly from billing and settlement — no manual report.',
      },
      {
        id: 'marketer-customers-tab',
        title: 'Customer Portfolio',
        demoTarget: 'marketer-customers-tab',
        narration: "Each marketer's customer book is live — enrollment counts, revenue contribution, contract status. NRG Direct has 4,821 active customers. This data drives commission calculations automatically. No marketer needs to send a spreadsheet to get paid.",
      },
      {
        id: 'marketer-margin-input',
        title: 'Margin Management',
        demoTarget: 'marketer-margin-input',
        narration: "Apex Energy's margin is being updated from $0.038 to $0.042 per gigajoule. The change applies to all future billing runs immediately. Every margin change is tracked — who changed it, when, and what it was before.",
      },
      {
        id: 'marketer-revenue-report',
        title: 'Revenue Report',
        demoTarget: 'marketer-revenue-report',
        narration: 'Partner revenue: $2.34M month to date, up 11.2%. Commission run JE-2026-0088 ready to post — $1.2 million to Account 2100. Commissions calculated automatically from the billing run. No manual calculation, no disputes.',
      },
      {
        id: 'marketer-plan-create',
        title: 'Create Plan',
        demoTarget: 'marketer-plan-create',
        narration: 'Onboarding a new marketer takes minutes. Territory, margin rate, product access, and prudential limit are set. The portal activates immediately — the new marketer can submit enrollments the same day. No IT ticket required.',
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
        narration: 'The Analytics module gives the operations team a live view of the business — revenue trend, marketer performance, predictive risk flags — all calculated from live billing and settlement data. Conversational data discovery built directly into the platform.',
      },
      {
        id: 'analytics-revenue-panel',
        title: 'Revenue Analysis',
        demoTarget: 'analytics-revenue-panel',
        narration: 'Drilling into March revenue — $2.34M month to date, up 12.4% versus last month. Drill to account level, see the invoice breakdown, export directly to the GL. One click from insight to journal entry.',
      },
      {
        id: 'analytics-marketer-panel',
        title: 'Marketer Performance',
        demoTarget: 'analytics-marketer-panel',
        narration: 'Marketer revenue ranking: NRG Direct $841K, PrairieEnergy $612K, AltaGas Retail $482K. Which partners are growing, which are stalling, where margin is compressed — without pulling a single report.',
      },
      {
        id: 'analytics-thena-panel',
        title: 'Thena AI Reporting',
        demoTarget: 'analytics-thena-panel',
        narration: 'Thena is the prescriptive analytics layer. Asked about Q2 revenue risks, it identifies 17 accounts likely to miss payment in the next 14 days — $41,200 exposure — and builds a 30-day action plan. Then drafts the collections emails. Insight to action in one conversation.',
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
        narration: 'A billing complaint came in from MacGregor Industrial — $8,400 balance flagged as an exception. The service rep navigates to the Customers module. Everything needed is in one place — no switching between systems, no waiting for billing to pull a report.',
      },
      {
        id: 'customer-360-view',
        title: 'Customer 360',
        demoTarget: 'row-C-10478',
        narration: 'Customer 360 for MacGregor Industrial shows the full picture — account history, open invoices, payment behaviour, and active cases. The $8,400 exception is visible immediately with full context. No need to ask anyone for background.',
      },
      {
        id: 'customer-emberlyn-draft',
        title: 'Emberlyn Investigation',
        demoTarget: 'customer360-draft-email',
        narration: "Emberlyn has the customer's full billing history in context. It identifies the root cause — a metering anomaly on SITE-20011 carried forward from the March settlement — and drafts a professional explanation with corrected figures.",
      },
      {
        id: 'customer-confirm-action',
        title: 'Confirm Resolution',
        demoTarget: 'emberlyn-confirm',
        narration: 'Resolution confirmed. Case updated, customer email queued, credit memo created in Finance automatically. Receive, investigate, respond, resolve — handled in under 90 seconds. No escalation, no hold music.',
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
