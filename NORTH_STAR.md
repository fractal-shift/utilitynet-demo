# UTILITYnet Demo — North Star Requirements
**Version:** 1.0  
**Repo:** fractalshift/utilitynet-demo  
**Demo Date:** March 30, 2026 — Live 3-hour session  
**This document is the single source of truth. Cursor builds to this. New scope is added here first, assigned a tier, then built. Nothing is modified mid-build without updating this doc.**

---

## Tier System

| Tier | Meaning | If not complete by March 29 |
|---|---|---|
| **T1 — Demo Critical** | Demo fails without this | Stop everything, fix this first |
| **T2 — Demo Strong** | Significantly weakens demo if missing | Descope gracefully if time is short |
| **T3 — Demo Polish** | Adds depth, evaluators may not notice if absent | Cut without discussion |

Cursor builds T1 to completion and validation before touching T2. T2 before T3. A feature is only "complete" when its validation check passes — not when the code exists.

---

## System Overview

A live, interactive ERP demo platform for UTILITYnet — an Alberta retail energy provider — demonstrating FractalShift's proposed modernization approach. The demo runs locally on the presenter's machine and is driven live in front of evaluators.

**Stack:** React + Vite + Tailwind · Playwright automation · Express mock server · Claude API (Emberlyn + Thena) · ElevenLabs audio (coach rail)  
**Design system:** UTILITYnet Design System v2 — Quicksand/JetBrains Mono, teal/navy/gold palette, CSS custom properties  
**Demo persona:** Sarah — UTILITYnet Operations Manager  

---

## Feature Registry Reference

The feature registry lives at `demo/FEATURE_REGISTRY.json`. Cursor reads this before starting any work session. It writes status updates to this file after each validated feature. Format:

```json
{
  "feature-id": {
    "tier": "T1",
    "status": "PENDING | IN_PROGRESS | VALIDATED | LOCKED",
    "validationScript": "checks/feature-id.mjs",
    "lastValidated": null,
    "lockedAt": null
  }
}
```

**LOCKED features are never modified.** If a new requirement touches a LOCKED feature, Cursor adds a new feature entry alongside it rather than modifying the locked one.

---

## Module Architecture

```
demo/
├── src/
│   ├── modules/
│   │   ├── Dashboard.jsx
│   │   ├── Customers.jsx       ← Enrollment + CRM combined
│   │   ├── Billing.jsx
│   │   ├── Settlement.jsx
│   │   ├── Marketers.jsx
│   │   ├── Analytics.jsx
│   │   ├── Finance.jsx         ← Full build required (T1)
│   │   └── Admin.jsx
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── EmerlynPanel.jsx
│   │   ├── ThenaPanel.jsx
│   │   ├── CoachRail.jsx       ← New (T2)
│   │   ├── ScenarioPanel.jsx   ← New (T1 — mock server control)
│   │   └── TutorialModeToggle.jsx ← New (T2)
│   ├── services/
│   │   └── integrations.js     ← New (T1 — mock API calls)
│   ├── data/
│   │   └── tutorial-scenarios.js ← New (T2)
│   ├── hooks/
│   │   ├── useTutorialAudio.js ← New (T2)
│   │   └── useTutorialHighlight.js ← New (T2)
│   └── store/
│       ├── AppStore.js         ← Extend with tutorialSlice (T2)
│       └── tutorialSlice.js    ← New (T2)
├── mock-server.mjs             ← New (T1)
├── scripts/
│   ├── run-dashboard.mjs       ← Existing
│   ├── run-enrollment.mjs      ← Extend with credit-fail scenario (T1)
│   ├── run-billing.mjs         ← Extend with rebill/reversal (T1)
│   ├── run-settlement.mjs      ← Extend with send-to-finance (T1)
│   ├── run-marketers.mjs       ← Extend with margin/statement (T2)
│   ├── run-analytics.mjs       ← Extend with drill-down (T2)
│   ├── run-finance.mjs         ← New (T1)
│   ├── run-customer-service.mjs ← Extend with propagation (T2)
│   ├── run-all.mjs             ← Update sequence (T1)
│   ├── generate-audio.mjs      ← New (T2)
│   ├── validate.mjs            ← New (T1 — self-healing master runner)
│   └── checks/                 ← New (T1 — one file per feature)
├── public/audio/               ← New (T2 — ElevenLabs generated)
├── FEATURE_REGISTRY.json       ← New (T1 — build by Cursor)
└── BLOCKED.md                  ← Written by Cursor on doom loop
```

---

## T1 Features — Demo Critical

---

### T1-001: Finance Module (Full React Implementation)

**File:** `demo/src/modules/Finance.jsx`  
**Current state:** KPI cards + "Phase 2" placeholder  
**Validation:** `checks/finance-module.mjs`

#### Requirements

**Page header:**
- Title: `Finance` · Subtitle: `General Ledger · Accounts Receivable · Accounts Payable · Reconciliation`
- Right controls: `Month-End: March 2026 ▾` (static) + `✦ Emberlyn Assist` (opens Emberlyn with finance context)

**Alert row (top of page):**
- Green: `✓ February 2026 month-end reconciliation complete — all 14 GL accounts balanced · Completed March 5`
- Blue: `ℹ March 2026 month-end target: March 31 · Current status: On track`

**KPI grid (4 cards):**

| Label | Value | Delta | Sub | Style |
|---|---|---|---|---|
| Revenue — MTD | $2.34M | ↑ 12.4% MoM | March 2026 | gold/featured |
| AR Outstanding | $184,200 | 42 accounts | 0–90 day aging | warning color on value |
| AP Due This Month | $1.21M | Marketer commissions | Due Mar 15 | standard |
| Cash Position | $1.82M | RBC Operating Account | As of Mar 11 | success color on value |

**Tabs:** `General Ledger` | `Accounts Receivable` | `Accounts Payable` | `Reconciliation` — default: GL

**GL Tab — Chart of accounts table:**  
`data-demo="finance-gl-table"` on table element

| Account | GL Code | Type | Opening | Debits | Credits | Closing | Status |
|---|---|---|---|---|---|---|---|
| Energy Revenue | 4000 | Revenue | $0.00 | — | $2,340,120 | $2,340,120 | Balanced |
| Marketer Commissions Payable | 2100 | Liability | $0.00 | $1,208,400 | — | $(1,208,400) | Balanced |
| Accounts Receivable | 1100 | Asset | $142,800 | $41,400 | $0.00 | $184,200 | In Review |
| AESO Settlement Payable | 2200 | Liability | $0.00 | $6,820,000 | — | $(6,820,000) | Balanced |
| Operating Cash — RBC | 1000 | Asset | $1,240,000 | $580,000 | $0.00 | $1,820,000 | Balanced |
| Hedge Risk Reserve | 3100 | Equity | $420,000 | — | — | $420,000 | Active |

Action row above table: `[Export GL]` `[Post Journal Entry]` `[View Audit Log]` — ghost buttons, each fires toast  
`data-demo="btn-post-journal"`, `data-demo="btn-export-gl"`, `data-demo="btn-audit-log"`

**AR Tab:**  
`data-demo="finance-ar-table"`

| Customer | Invoice # | Amount | Days | Status | Action |
|---|---|---|---|---|---|
| Sunrise Industrial Ltd. | INV-2026-0342 | $42,400 | 28 | Current | Send Reminder |
| Parkview Residential | INV-2026-0287 | $1,240 | 45 | Overdue | Escalate |
| Northern Oilsands Corp. | INV-2026-0301 | $98,600 | 62 | Overdue | Collections |
| Lakeview Homes | INV-2026-0311 | $890 | 18 | Current | Send Reminder |
| Peak Energy Partners | INV-2026-0298 | $41,070 | 71 | 60+ Days | Collections |

**AP Tab:**  
`data-demo="finance-ap-table"`

| Payee | Description | Amount | Due Date | Status | Action |
|---|---|---|---|---|---|
| AltaGas Distribution | Settlement — February | $1,120,000 | Mar 15 | Pending Approval | Approve |
| Apex Energy Marketer | Commission — February | $72,680 | Mar 15 | Pending Approval | Approve |
| AESO | Balancing Pool Levy | $14,200 | Mar 20 | Scheduled | View |
| RBC Bank | Credit Facility Fee | $4,200 | Mar 30 | Scheduled | View |

Approve button behavior: row status → `Approved`, toast: `Payment approved — journal entry created`  
`data-demo="btn-approve-ap"` on each Approve button

**Reconciliation Tab:**  
Two-column layout.

Left card `data-demo="finance-bank-recon"`:
- RBC Statement Balance: $1,820,000
- Outstanding Deposits: +$42,400
- Outstanding Cheques: -$8,200
- **Adjusted Bank Balance: $1,854,200**
- **GL Cash Balance: $1,854,200**
- Green alert: `✓ Bank reconciliation balanced — no variance`

Right card `data-demo="finance-month-end-checklist"` — timeline:
- ✓ Revenue recognition complete — $2.34M recognized
- ✓ Bank reconciliation done — RBC operating account balanced
- ⚠ AP approvals pending — $72,680 in commissions awaiting approval
- ○ AESO settlement final — Target: March 20 · 3 exceptions pending
- ○ Financial statements to CFO — Target: March 31

**Emberlyn context injection when finance module is active:**
```
Current module: Finance
Open AP approvals: 2 items totalling $1,192,680
AR overdue (60+ days): $139,670 across 2 accounts
Month-end status: On track — 2 of 5 checklist items complete
Bank reconciliation: Balanced as of March 10
```

Emberlyn suggested prompts for finance context:
- `What is our current AR risk exposure?`
- `Which AP items are blocking month-end close?`
- `Show me journal entries posted from billing this month`
- `Summarize the March reconciliation status`

---

### T1-002: Mock Integration Server

**File:** `demo/mock-server.mjs`  
**Validation:** `checks/mock-server.mjs`

Single Express server on port `3101`. All integrations are route namespaces. A global scenario state switches response variants. Vite proxies `/api/mock/*` to `localhost:3101`.

**Services and route namespaces:**
- `/api/mock/aeso/*` — AESO energy feed
- `/api/mock/rbc/*` — RBC bank
- `/api/mock/credit/*` — Credit bureau
- `/api/mock/altagas/*` — AltaGas distributor
- `/api/mock/watchdog/feeds` — Aggregated feed status

**Scenario control:**
- `POST /scenario/:name` — switch a service scenario
- `POST /scenario/reset/all` — reset all to defaults
- `GET /scenario/status` — read current state
- `GET /health` — server health check

**Scenarios per service:**

| Service | Scenarios |
|---|---|
| AESO | `aeso-happy`, `aeso-down`, `aeso-delayed`, `aeso-variance` |
| RBC | `rbc-happy`, `rbc-down`, `rbc-exception` |
| Credit | `credit-pass`, `credit-fail`, `credit-thin`, `credit-slow` |
| AltaGas | `altagas-clean`, `altagas-variance`, `altagas-missing`, `altagas-down` |

Default active scenarios: `aeso-happy`, `rbc-happy`, `credit-pass`, `altagas-clean`

**Key route behaviors:**

`GET /api/mock/aeso/usage` — returns 5 metering records (SITE-10042, SITE-10087, SITE-20011, SITE-10103, SITE-20028). On `aeso-variance`: SITE-20011 usage doubles to 9,840 GJ with `USAGE_SPIKE` flag. On `aeso-down`: 503.

`GET /api/mock/aeso/price` — returns `{ poolPrice: 4.82, hedgeAllocation: 0.34 }`. On `aeso-variance`: price spikes to 7.21.

`GET /api/mock/rbc/balance` — returns `{ statementBalance: 1820000 }`. On `rbc-exception`: available balance drops $60K with `BALANCE_MISMATCH` flag.

`GET /api/mock/rbc/transactions` — 5 transaction records with GL account matches. On `rbc-exception`: adds unmatched $60K credit.

`POST /api/mock/rbc/payment` — accepts `{ payeeId, amount, description }`, returns confirmation number.

`POST /api/mock/credit/check` — accepts applicant object. Returns: `pass` (score 724, no deposit), `fail` (score 492, $250 deposit, options array), `thin` (no file, $150 deposit), `slow` (3.8s delay then pass).

`GET /api/mock/altagas/invoice` — on `altagas-variance`: SITE-20011 shows 5,160 GJ vs UTILITYnet's 4,820 GJ → $1,640 variance. On `altagas-missing`: SITE-20028 absent from submission.

`POST /api/mock/altagas/dispute` — returns dispute confirmation ID.

All four services expose `GET /feed-status` returning `{ connected, status, latencyMs, lastSync }` with appropriate variant behavior.

`GET /api/mock/watchdog/feeds` — aggregates all four feed statuses in one call, returns `{ feeds[], alertCount }`.

**Vite proxy** (`vite.config.js`): `/api/mock` → `http://localhost:3101`

**Integration service layer** (`demo/src/services/integrations.js`): All fetch calls in one file. Modules import from here, never call fetch directly.

**Scenario control panel** (`ScenarioPanel.jsx`): Fixed bottom-right overlay. Visible only at `?scenarios=1` or `Ctrl+Shift+S`. Four service sections with scenario toggle buttons. Active scenario highlighted (teal border). Calls `setScenario()` from integrations.js. `data-demo="scenario-panel"`, `data-demo="scenario-btn-[name]"` on each button.

**npm scripts:**
```json
"mock": "node mock-server.mjs",
"dev:full": "concurrently \"npm run mock\" \"npm run dev\""
```

---

### T1-003: Finance Integration Hooks (All 4)

**Validation:** `checks/integration-hooks.mjs`

Four cross-module actions that post journal entries to Finance GL. Each fires a loading state (1.5s), an AppStore update, and a toast referencing the GL account.

**Hook 1 — Billing → Finance**  
Location: `Billing.jsx` — after batch completes  
Button: `[Post Revenue to GL]` `data-demo="btn-post-billing-to-gl"`  
Journal entry: `{ id: 'JE-2026-0089', source: 'Billing Batch #BB-2026-031', amount: 2340120, account: '4000 — Energy Revenue' }`  
Toast: `✓ Revenue posted to GL — Journal Entry JE-2026-0089 created · Account 4000`  
Button disables to: `✓ Posted to GL — Mar 11, 2026`

**Hook 2 — Settlement → Finance**  
Location: `Settlement.jsx` — after reconciliation completes  
Button: `[Send Reconciliation to Finance]` `data-demo="btn-send-settlement-to-finance"`  
Journal entry: `{ id: 'JE-2026-0091', source: 'AESO Settlement — March 2026', amount: 6820000, account: '2200 — AESO Settlement Payable' }`  
Toast: `✓ Settlement reconciliation sent to Finance — Journal Entry JE-2026-0091 · Account 2200`

**Hook 3 — Marketers → Finance**  
Location: `Marketers.jsx` — commission approval  
Button: `[Approve & Post Commissions]` `data-demo="btn-post-commissions-to-gl"`  
Journal entry: `{ id: 'JE-2026-0088', source: 'Marketer Commissions — February 2026', amount: 1208400, account: '2100 — Marketer Commissions Payable' }`  
Toast: `✓ Commission run approved — Journal Entry JE-2026-0088 · Account 2100 · $1,208,400`

Also add Journal Entries sub-section to Marketers showing last 2 posted entries. `data-demo="marketer-journal-entries-table"`

**Hook 4 — CRM → Billing + Finance**  
Location: `Customers.jsx` — after credit/billing adjustment applied  
Not a button — fires automatically after existing "Apply Credit" / "Resolve Case" action  
Shows inline propagation confirmation block:
```
✓ Adjustment propagated
Billing: Credit memo CM-2026-0041 created ($85.00)
Finance: AR updated — account 1100 reduced by $85.00
GL entry: JE-2026-0092 pending approval
```
`data-demo="crm-propagation-confirmation"`  
AppStore: adds to `state.finance.pendingJournalEntries`

---

### T1-004: Billing — Rebill / Reversal / Correction

**File:** `demo/src/modules/Billing.jsx`  
**Validation:** `checks/billing-workflows.mjs`

Seed data must include one invoice row with status `Dispute Resolved`: `Sunrise Industrial Ltd. · INV-2026-0342 · $42,400`

**Rebill:** `[Rebill]` button on `Dispute Resolved` rows. `data-demo="btn-rebill-[invoiceId]"`. 3-step inline flow: confirm scope → processing spinner (1.5s) → new invoice number `INV-2026-0342-R1` + action row `[Post to Finance] [Send to Customer] [Close]`.

**Reversal:** `[Reverse]` in overflow menu on any invoice. `data-demo="btn-reverse-invoice"`. Confirmation modal warning Finance approval required. On confirm: status → `Reversed`, creates credit memo, toast: `Reversal CM-2026-0038 created — pending Finance approval`, adds to `state.finance.pendingJournalEntries`.

**Correction:** `[Correct & Repost]` on exceptions queue rows. `data-demo="btn-correct-repost"`. Inline edit panel with `Corrected Usage (GJ)`, `Corrected Rate ($/GJ)`, `Reason for Correction`. On apply: shows before/after comparison, auto-fires Post to GL (Hook 1).

---

### T1-005: Enrollment — Failed Credit + Deposit + Activation Date

**File:** `demo/src/modules/Customers.jsx` or `EnrollmentModal`  
**Validation:** `checks/enrollment-flows.mjs`

**Failed credit path:**  
Toggle: `[Simulate Failed Credit Check]` `data-demo="toggle-failed-credit"` — calls `setScenario('credit-fail')` from integrations.js  
On submit: credit step shows `⚠ Credit Check Failed — Score: 492 (Minimum: 550)`  
Decision panel: `Option A: Require Deposit — $250` / `Option B: Reject Application` / `Option C: Manual Override`  
`data-demo="credit-failed-state"`, `data-demo="btn-require-deposit"`, `data-demo="btn-reject-enrollment"`, `data-demo="btn-manual-override"`

**Deposit handling:**  
Deposit amount field (pre-fill $250), payment method selector (static)  
`[Mark Deposit Received]` `data-demo="btn-mark-deposit-received"`  
Toast: `Deposit of $250.00 received — prudential hold applied`  
AppStore: `customer.depositStatus = 'Held'`, `customer.depositAmount = 250`

**Activation date:**  
`Service Start Date` field defaulting to first of next month  
Display: `Activation scheduled: April 1, 2026`  
Sub-line: `Activation will trigger: meter read request · contract execution · first bill cycle start`  
`data-demo="activation-date-field"`, `data-demo="activation-date-confirmation"`

---

### T1-006: Playwright `run-finance.mjs`

**File:** `demo/scripts/run-finance.mjs`  
**Validation:** `checks/playwright-finance.mjs`

Script flow (20 steps):
1. Navigate to app, dismiss API key modal
2. Show scenario summary: `Finance Module — GL, AR, AP, Month-End Close`
3. Navigate to Finance (`nav-finance`)
4. showStatus: `Cash position $1.82M. AR at $184K. Two AP items pending approval blocking month-end.`
5. Click GL tab (`finance-tab-gl`)
6. showStatus: `Chart of accounts — 6 GL accounts. Energy Revenue $2.34M. AESO Settlement Payable $6.82M.`
7. Click `[Post Journal Entry]` ghost button
8. showStatus: `Journal entry created. Full audit trail captured automatically.`
9. Click AR tab (`finance-tab-ar`)
10. showStatus: `AR aging — $139K overdue across 2 accounts. Collections queue active.`
11. Click AP tab (`finance-tab-ap`)
12. showStatus: `AP queue — $1.19M awaiting approval. Marketer commissions and AltaGas settlement.`
13. Click first Approve button (`btn-approve-ap`)
14. showStatus: `Payment approved. Journal entry JE-2026-0088 created automatically. No manual GL entry.`
15. Click Reconciliation tab (`finance-tab-recon`)
16. showStatus: `Bank reconciliation: RBC $1.82M matches GL $1.82M. Zero variance. February close confirmed.`
17. Open Emberlyn (`btn-emberlyn-finance` or Emberlyn Assist)
18. Click suggested prompt: `Which AP items are blocking month-end close?`
19. scrollReadEmberlynResponse
20. showStatus: `Emberlyn identifies the one remaining blocker in seconds. No spreadsheet, no email to accounting.`

Add `['finance', runFinance]` to SCENARIOS array in `run-all.mjs` — position: after `'dashboard'`, before `'enrollment'`. Finance leads because UTILITYnet's stated priority is Finance first.

---

### T1-007: Playwright `run-enrollment.mjs` — Extend with Credit Failure Scenario

**Validation:** `checks/playwright-enrollment.mjs`

After existing happy-path enrollment flow, add second act:
- Call `setMockScenario('credit-fail')` (uses HTTP to mock server)
- Trigger `toggle-failed-credit`
- Walk through declined state → deposit option → mark received → activation date
- Reset with `setMockScenario('credit-pass')`

Add `setMockScenario` helper to `demo-runner.mjs`:
```javascript
export async function setMockScenario(name) {
  const res = await fetch(`http://localhost:3101/scenario/${name}`, { method: 'POST' });
  return res.json();
}
```

---

## T2 Features — Demo Strong

---

### T2-001: Coach Rail + Tutorial Mode

**Files:** `CoachRail.jsx`, `CoachRail.css`, `tutorialSlice.js`, `useTutorialAudio.js`, `useTutorialHighlight.js`, `TutorialModeToggle.jsx`, `tutorial-scenarios.js`  
**Validation:** `checks/coach-rail.mjs`

**Architecture:**
- Emberlyn detects tutorial intent via keyword + `TUTORIAL_START:[scenario_id]` marker
- AppStore `tutorialMode` flag triggers: CoachRail panel replaces Emberlyn panel, 3D card flip on main content
- Pre-generated ElevenLabs audio plays per step with graceful fallback (step advances automatically after 4s if audio fails)
- Step highlighting via `useTutorialHighlight` targeting `data-demo` attributes

**Scenarios (6 total):** `enrollment`, `marketers`, `billing`, `settlement`, `finance`, `analytics`  
Scenario data lives in `tutorial-scenarios.js` — narration strings, step targets, trigger phrases.

**Audio fallback policy (live demo resilience):**  
If audio fails to load OR autoplay is blocked: log warning, do NOT show error to user, advance step after 4s delay. Coach Rail UI must be fully functional without audio. Narration text is always visible in the CoachRail panel as backup for the presenter.

**Trigger phrases → scenario mapping:**  
`tutorial` / `finance gl scenario` / `general ledger` → `finance`  
`enrollment` / `new customer` / `onboarding` → `enrollment`  
`billing engine` / `billing scenario` → `billing`  
`settlement` / `reconciliation` → `settlement`  
`marketer` / `partner portal` → `marketers`  
`analytics` / `birdseye` / `thena` → `analytics`

**CoachRail UI elements:**
- Header: scenario title + module badge + audio waveform animation (animated bars, gold, only when playing)
- Step list: numbered/checked progress, active step highlighted teal
- Narration card: current step title + first 120 chars of narration
- Progress bar (teal fill)
- Controls: `[⏸ Pause]` / `[▶ Resume]` · `[Skip →]` · `[End Tutorial]`
- Complete state: checkmark card + `[Back to Live]`

**Nav bar additions when tutorial active:**
- `TUTORIAL MODE` badge (gold, pulsing)
- Toggle button: `Live View ↔ Tutorial` — flips main content

**Flip animation:** 3D card flip (rotateY 180deg, 0.5s cubic-bezier). Both faces render live app content. Pausing tutorial = flip to live view. Resuming = flip back.

**Step highlighting:** gold outline pulse (`outline: 2px solid var(--gold)`) on `data-demo` target element. Smooth scroll to element. Alternates gold/teal via keyframe.

---

### T2-002: ElevenLabs Audio Generation Script

**File:** `demo/scripts/generate-audio.mjs`  
**Validation:** `checks/audio-files.mjs`

Reads narration strings from `tutorial-scenarios.js`, calls ElevenLabs API (voice: Rachel, `21m00Tcm4TlvDq8ikWAM`, model: `eleven_turbo_v2`), writes to `demo/public/audio/[scenario-id]/[step-id].mp3`.

**Flags:** `--scenario [id]` (single scenario), `--force` (regen all)  
**Rate limiting:** 600ms delay between requests  
**Incremental:** skips files that already exist unless `--force`  
**Environment:** `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`  
**npm script:** `"gen-audio": "node scripts/generate-audio.mjs"`

All generated audio files are committed to repo (`demo/public/audio/`) so demo works fully offline on demo day.

---

### T2-003: Marketers — Margin Setting, Prudential/Cash Call, Statements

**File:** `demo/src/modules/Marketers.jsx`  
**Validation:** `checks/marketers-flows.mjs`

**Margin management card:**
- Base Rate (read-only): $4.82/GJ
- Marketer Margin (editable): $0.85/GJ → Customer Rate auto-calculates: $5.67/GJ
- `[Save Margin]` `data-demo="btn-save-margin"` → toast: `Margin updated — effective April 1, 2026 · Rate card distributed to 847 customers`

**Prudential / cash call card:**
- AltaGas: Required $420K · Held $380K · Shortfall $40K ⚠ · Cash Call Issued Mar 8 · Due Mar 22
- `[Send Cash Call Reminder]` `data-demo="btn-cash-call-reminder"`

**Monthly statement generation:**
`[Generate Monthly Statement]` `data-demo="btn-generate-statement"` → 2-step: summary preview (847 customers, $13,520 net to marketer) → `[Approve & Post to Finance]` → fires Hook 3

Journal entries sub-section `data-demo="marketer-journal-entries-table"` showing last 2 posted entries.

---

### T2-004: Analytics — Drill-Down, GL Reconcile, Compliance, Ad-Hoc

**File:** `demo/src/modules/Analytics.jsx`  
**Validation:** `checks/analytics-flows.mjs`

**Drill-down:** Click chart bar → inline detail panel with top 5 contributing accounts → click account row → invoice list. `data-demo="analytics-drill-revenue"`, `data-demo="analytics-drill-account"`

**GL reconcile export:** `[Export to GL]` `data-demo="btn-analytics-export-gl"` → toast: `GL reconciliation export — Revenue $2,340,120 matches GL account 4000 · No variance`

**Compliance tab:** Static regulatory report table (AUC, AESO, PIPEDA, AUC pending). `[Generate Report]` on pending row. `data-demo="compliance-report-table"`, `data-demo="btn-generate-compliance-report"`

**Ad-hoc tab:** Query builder UI. Report On dropdown · Date Range · Group By · `[Run Report]`. 2 canned results (Billing, Marketers). `data-demo="btn-run-adhoc-report"`

---

### T2-005: Admin Security Controls Display

**File:** `demo/src/modules/Admin.jsx`  
**Validation:** `checks/admin-security.mjs`

Four cards:

**Authentication:** SSO: Azure AD · Connected · All users enforced. MFA: Required · 100% adoption. `data-demo="security-auth-card"`

**Business Continuity:** Backup every 6 hours · Last verified Mar 11 · RTO < 4 hours · RPO < 1 hour · Restore test Feb 2026 passed (3h 12m). `data-demo="security-rto-rpo-card"`

**Compliance:** SOC 2 Type II in progress (Q3 2026) · NIST CSF aligned · PIPEDA compliant (AWS ca-central-1) · Breach reporting ≤72 hours to OPC · IR tabletop Jan 2026. `data-demo="security-compliance-card"`

**SLA Tiers table:** P1 15min/4hr · P2 1hr/8hr · P3 4hr/2bd · P4 1bd/5bd. `data-demo="security-sla-table"`

---

### T2-006: Watchdog OS Monitoring Panel

**File:** `demo/src/modules/Admin.jsx` — System Health tab  
**Validation:** `checks/watchdog-panel.mjs`

Reads live data from `GET /api/mock/watchdog/feeds` (mock server). Updates every 30s.

**Feed health grid:** 4 rows showing AESO, RBC, Credit Bureau, AltaGas with status, latency, last sync. Status reflects active mock scenario. `data-demo="watchdog-feed-health"`

**Job queue table:** 4 jobs (Billing Batch, Settlement Recon, GL Posting, AR Aging). Static except AR Aging shows `⏳ Running`. `data-demo="watchdog-job-queue"`

**Anomaly feed:** 4 recent alerts as time-stamped list. Top entry reflects active mock scenario state. `data-demo="watchdog-anomaly-feed"`

Pulsing indicator dot on System Health nav entry if any feed has `hasAlert: true`.

---

### T2-007: CRM Change Propagation to Billing + Finance

**File:** `demo/src/modules/Customers.jsx`  
**Validation:** `checks/crm-propagation.mjs`

After existing `[Apply Credit]` / `[Resolve Case]` action fires, show inline propagation confirmation block (see T1-003, Hook 4). Emberlyn context-aware: suggested prompt `Show me what changed in Finance from this adjustment`. `data-demo="crm-billing-link"` on billing-related actions.

---

## T3 Features — Demo Polish

---

### T3-001: Settlement Exception Categorization

Exception rows get category badges: `Volume Variance` / `Rate Dispute` / `Missing Data` / `Timing`  
Filter bar above exceptions table. AltaGas exception = `Volume Variance · $1,640 delta`.  
`data-demo="settlement-exception-filter"`

---

### T3-002: Enrollment — Thin File Scenario

`[Simulate Thin File]` toggle → `setScenario('credit-thin')` → `CONDITIONAL` status → $150 deposit option.

---

### T3-003: Extended run-settlement.mjs with Scenario Switching

Uses `setMockScenario('altagas-variance')` before settlement ingest so Emberlyn's root cause analysis has real invoice data behind it. Resets at end.

---

### T3-004: Watchdog Feed-Down Demo Moment

In Watchdog panel: demo presenter switches AESO to `aeso-down` via ScenarioPanel → feed health card goes red → anomaly feed updates → Watchdog alert fires. Restore with `aeso-happy`. Pure presenter moment — no Playwright script needed.

---

## Data Consistency Requirements

These values must be consistent across ALL modules. Any component that displays these numbers uses them exactly.

| Data Point | Canonical Value |
|---|---|
| Current period | March 2026 |
| MTD Revenue | $2,340,120 |
| Customer count | 1,247 |
| AR Outstanding | $184,200 |
| AP Due | $1,208,400 (marketer commissions) |
| Cash Position | $1,820,000 (RBC) |
| AESO Settlement Payable | $6,820,000 |
| Hedge Reserve | $420,000 |
| Top marketer | Apex Energy — 847 customers |
| AltaGas dispute variance | $1,640 |
| AESO pool price | $4.82/GJ |
| Hedge allocation | $0.34/GJ |
| SITE-20011 usage (UTILITYnet) | 4,820 GJ |
| SITE-20011 usage (AltaGas claim) | 5,160 GJ |

---

## Design System Tokens (Non-negotiable)

```css
--font-ui: 'Quicksand', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
--teal: #1ABCAB;
--gold: #ECB324;
--navy: #0F2040;
--success: #27AE60;
--warning: #F39C12;
--error: #E74C3C;
```

Dark mode default. Light mode toggle available. `data-theme` attribute on root.

---

*UTILITYnet North Star Requirements · FractalShift × Gnar · v1.0 · March 2026*
