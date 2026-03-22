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
        narration: 'This is the Finance module overview. UTILITYnet centralizes General Ledger, AR, AP, and reconciliation in one place. No more spreadsheets or email chains for month-end close — everything feeds from billing, settlement, and marketer statements automatically.',
      },
      {
        id: 'finance-gl-table',
        title: 'Chart of Accounts',
        demoTarget: 'finance-gl-table',
        narration: 'The chart of accounts shows all GL codes in one unified view. Energy Revenue, Marketer Commissions Payable, and AESO Settlement all post automatically from the billing and settlement engines. UTILITYnet eliminates manual journal entry errors and ensures audit trails for every transaction.',
      },
      {
        id: 'finance-legacylift-scan',
        title: 'Legacy Lift Scan',
        demoTarget: 'finance-legacylift-scan',
        narration: 'The Legacy Lift Scan identifies mappings from your old systems to the new GL structure. FractalShift migrates historical data and flags any ambiguous codes for your review. This is how we ensure continuity from day one without losing audit history.',
      },
      {
        id: 'finance-remediation-plan',
        title: 'Remediation Plan',
        demoTarget: 'finance-remediation-plan',
        narration: 'Any variances or cleanup items appear in the remediation plan. You can assign owners, set due dates, and track resolution. UTILITYnet keeps month-end close on track by surfacing blockers early instead of discovering them at cutoff.',
      },
      {
        id: 'finance-confirm-cleanup',
        title: 'Confirm Cleanup',
        demoTarget: 'finance-confirm-cleanup',
        narration: 'Once remediation is complete, confirm the cleanup and close the period. The system locks prior periods and generates compliance-ready reports. UTILITYnet delivers a single source of truth for finance, ready for auditors and regulators.',
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
        narration: 'Click here to start a new customer enrollment. UTILITYnet consolidates the entire onboarding flow — from initial application through activation — in one place. No more handoffs between sales, credit, and operations.',
      },
      {
        id: 'enrollment-customer-form',
        title: 'Customer Information',
        demoTarget: 'enrollment-customer-form',
        narration: 'Capture customer details, contact info, and site address. All fields validate in real time and sync to the CRM. UTILITYnet maintains a single customer record used across billing, settlement, and finance — no duplicate data entry.',
      },
      {
        id: 'enrollment-credit-check',
        title: 'Credit Check',
        demoTarget: 'enrollment-credit-check',
        narration: 'The credit check runs automatically via integration with the credit bureau. If the customer fails, you can offer a deposit option or adjust the risk tier. UTILITYnet gives you visibility into credit decisions before activation so you can set the right terms.',
      },
      {
        id: 'enrollment-banking-form',
        title: 'Banking & Payment',
        demoTarget: 'enrollment-banking-form',
        narration: 'Collect bank account details for pre-authorized payment. The system validates account format and stores encrypted tokens. UTILITYnet supports both residential and commercial onboarding with configurable payment options.',
      },
      {
        id: 'enrollment-plan-select',
        title: 'Plan Selection',
        demoTarget: 'enrollment-plan-select',
        narration: 'Select the energy plan, rate structure, and contract term. Plan options pull from your active rate cards and marketer portfolios. UTILITYnet ensures the customer sees only plans they qualify for based on credit and location.',
      },
      {
        id: 'enrollment-approve-btn',
        title: 'Approve & Activate',
        demoTarget: 'enrollment-approve-btn',
        narration: 'Approve the enrollment to schedule activation. The system triggers meter read requests, contract execution, and first bill cycle. UTILITYnet automates the handoff to billing so the customer gets their first invoice on the correct cycle.',
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
        narration: 'Import consumption data from your meter data provider or distributor. UTILITYnet validates volumes, flags anomalies, and queues accounts for billing. This is the starting point for every bill cycle — accurate consumption drives accurate revenue.',
      },
      {
        id: 'billing-rate-apply',
        title: 'Apply Rates',
        demoTarget: 'billing-rate-apply',
        narration: 'Rates apply automatically based on each customer’s plan and contract. Fixed, variable, and demand components calculate in one pass. UTILITYnet supports complex rate structures while keeping the logic auditable and easy to change.',
      },
      {
        id: 'billing-hedge-allocation',
        title: 'Hedge Allocation',
        demoTarget: 'billing-hedge-allocation',
        narration: 'Hedge positions allocate to customer consumption to lock in margins. The system tracks open positions and ensures coverage. UTILITYnet gives you real-time visibility into hedge vs. spot exposure so you can manage risk proactively.',
      },
      {
        id: 'billing-generate-btn',
        title: 'Generate Invoices',
        demoTarget: 'billing-generate-btn',
        narration: 'Generate invoices for the batch. The engine applies all rate logic, tax rules, and adjustments. UTILITYnet produces bill-ready output for print, email, or EDI — and posts to AR automatically when you send.',
      },
      {
        id: 'billing-exception-flag',
        title: 'Exception Handling',
        demoTarget: 'billing-exception-flag',
        narration: 'Any account that fails validation appears in the exception queue. Review missing data, zero consumption, or rate errors before sending. UTILITYnet prevents bad bills from reaching customers and ensures only clean invoices post to Finance.',
      },
      {
        id: 'billing-send-btn',
        title: 'Send to Finance',
        demoTarget: 'billing-send-btn',
        narration: 'When the batch is clean, send to Finance. Invoices post to AR, revenue recognizes to the GL, and statements flow to marketer partners. UTILITYnet closes the loop from consumption to cash so you have a single source of truth.',
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
        narration: 'Import settlement data from your distributor — typically AltaGas, ATCO, or other LDC partners. UTILITYnet normalizes formats and validates totals before matching. This is the source of truth for what actually flowed through the pipes.',
      },
      {
        id: 'settlement-match-table',
        title: 'Reconciliation Match',
        demoTarget: 'settlement-match-table',
        narration: 'The match table compares distributor data to your billing records. Matched rows reconcile automatically; variances highlight for review. UTILITYnet reduces settlement disputes by surfacing discrepancies early, before they hit month-end.',
      },
      {
        id: 'settlement-emberlyn-insight',
        title: 'Emberlyn Insight',
        demoTarget: 'settlement-emberlyn-insight',
        narration: 'Emberlyn analyzes unmatched items and suggests likely causes — meter read timing, site ID mismatches, or data gaps. Ask questions in plain language and get answers in seconds. UTILITYnet puts AI-assisted reconciliation at your fingertips without leaving the workflow.',
      },
      {
        id: 'settlement-marketer-allocation',
        title: 'Marketer Allocation',
        demoTarget: 'settlement-marketer-allocation',
        narration: 'Settled volumes allocate to marketer partners based on customer assignments. Each marketer sees their share of capacity, distribution charges, and AESO costs. UTILITYnet automates the cascade from distributor bill to marketer statement so everyone gets accurate numbers.',
      },
      {
        id: 'settlement-report-btn',
        title: 'Export Report',
        demoTarget: 'settlement-report-btn',
        narration: 'Export the settlement report for finance, auditors, or marketer partners. Reports include full audit trails and tie back to GL accounts. UTILITYnet ensures settlement closes cleanly and feeds Finance with one click.',
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
        narration: 'This is the Marketer partner portal. Each marketer sees their portfolio — customers, margin, prudential, and revenue — in one place. UTILITYnet gives partners self-service access so they can manage their business without calling UTILITYnet ops.',
      },
      {
        id: 'marketer-plan-create',
        title: 'Create Plan',
        demoTarget: 'marketer-plan-create',
        narration: 'Marketers create and manage energy plans here. Set rate structure, term, eligibility, and distribution. UTILITYnet validates plans against your rules and publishes them to enrollment automatically. Partners launch new products faster without IT involvement.',
      },
      {
        id: 'marketer-margin-input',
        title: 'Margin Management',
        demoTarget: 'marketer-margin-input',
        narration: 'Adjust marketer margin to set the customer rate. Base rate plus margin equals customer price. UTILITYnet recalculates and distributes rate cards to affected customers. When margins change, everyone sees the update — no stale rate sheets.',
      },
      {
        id: 'marketer-customers-tab',
        title: 'Customer Portfolio',
        demoTarget: 'marketer-customers-tab',
        narration: 'View the marketer’s customer list — consumption, revenue, churn risk. UTILITYnet gives partners the data they need to retain customers and grow. Portfolios sync from billing and settlement so the numbers are always current.',
      },
      {
        id: 'marketer-revenue-report',
        title: 'Revenue Report',
        demoTarget: 'marketer-revenue-report',
        narration: 'Revenue reports show what the marketer earned — commissions, net settlements, prudential activity. UTILITYnet generates monthly statements and posts to Finance via Hook 3. Partners get transparent, auditable numbers without manual reconciliation.',
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
        narration: 'This is the Birdseye analytics dashboard. UTILITYnet surfaces KPIs from across the platform — revenue, settlement, marketer performance, compliance. Executives get a single pane of glass without digging through spreadsheets or multiple systems.',
      },
      {
        id: 'analytics-revenue-panel',
        title: 'Revenue Analysis',
        demoTarget: 'analytics-revenue-panel',
        narration: 'Drill into revenue by product, marketer, region, or time period. Click any bar to see contributing accounts and invoices. UTILITYnet connects high-level numbers to transaction-level detail so you can answer “why” questions in seconds.',
      },
      {
        id: 'analytics-marketer-panel',
        title: 'Marketer Performance',
        demoTarget: 'analytics-marketer-panel',
        narration: 'Compare marketer performance — margin, customer count, churn, revenue growth. UTILITYnet helps you identify top partners and support those who need it. The same data flows to partner statements so everyone aligns on the numbers.',
      },
      {
        id: 'analytics-thena-panel',
        title: 'Thena AI Reporting',
        demoTarget: 'analytics-thena-panel',
        narration: 'Thena is your AI reporting assistant. Ask questions in plain language — “What drove the revenue drop in March?” — and get charts and tables back. UTILITYnet combines Birdseye data with natural language so analysts and executives get answers fast.',
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
