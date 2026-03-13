# UTILITYnet ERP Demo — Cursor Build Instructions
**Source of truth:** `UTILITYnet_ERP_Demo.html` (attached)  
**Design system:** `UTILITYnet_Design_System_v2.md` (attached — USE THIS for all styling)  
**Goal:** Port the single-file HTML demo into a proper React app with live Claude API, response caching, and polished demo flows for 5 key scenarios.  
**Timeline:** Demo is next week. Prioritize working flows over completeness.

---

## Stack

```
Vite + React (no Next.js — no server needed, opens as a local file or static host)
Tailwind CSS (utility classes only — no component libraries)
Claude API (claude-sonnet-4-5 via fetch to api.anthropic.com/v1/messages)
```

No backend. No auth server. No database. Pure frontend — must run with `vite build` → open `dist/index.html`.

---

## Project Structure

```
/src
  /components
    Layout.jsx          # Nav + Sidebar + Main shell
    Sidebar.jsx         # Nav items, section labels, mode detection
    Navbar.jsx          # Top bar, logo, mode toggle, user badge
    EmerlynPanel.jsx    # Emberlyn AI panel (right drawer)
    ThenaPanel.jsx      # Thena AI panel (right drawer, analytics only)
  /modules
    Dashboard.jsx
    Customers.jsx
    Billing.jsx
    Settlement.jsx
    Marketers.jsx
    Analytics.jsx       # ← Priority. Full Thena/FractalShift iron-steel aesthetic
    Finance.jsx
    Admin.jsx
  /flows
    CustomerServiceFlow.jsx    # Demo Flow 1
    BillingExceptionFlow.jsx   # Demo Flow 2
    SettlementFlow.jsx         # Demo Flow 3
    ThenaAnalyticsFlow.jsx     # Demo Flow 4
    ThenaExecutiveFlow.jsx     # Demo Flow 5
  /ai
    claudeClient.js     # fetch wrapper for Claude API
    responseCache.js    # Demo response cache (keyed by scenario+prompt fingerprint)
    prompts.js          # System prompts for Emberlyn and Thena
  /data
    demoData.js         # All mock data (customers, invoices, marketers, etc.)
  /styles
    tokens.css          # CSS custom properties from design system v2 (light + dark)
    globals.css         # Base styles, scrollbar, animations
  App.jsx
  main.jsx
```

---

## Design System — CRITICAL

**Do not invent styles. Use the design system exactly.**

Import tokens from `UTILITYnet_Design_System_v2.md`. Key rules:

- **Fonts:** Quicksand (UI) + JetBrains Mono (data/labels). Import from Google Fonts.
- **Light mode nav:** `#045477` (navy) — this is the strongest brand statement
- **Brand teal:** `#1678A0` (light) / `#1E88B4` (dark) — primary interactive color
- **Brand gold:** `#D4A017` (light) / `#ECB324` (dark) — accents, KPI values in dark mode
- **Gold underline:** 48px × 3px block under all section/page titles — never omit this
- **Analytics module:** Full iron-steel aesthetic — see "Thena/FractalShift Styling" section below

Light/dark toggle: `data-theme` attribute on `<html>`. Persist to `localStorage` key `utilitynet-theme`.

---

## AI Integration

### API Key Handling

Add a small "Enter API Key" modal that shows on first load if no key is stored. Store in `sessionStorage` only (not localStorage — key clears when tab closes).

```jsx
// On app load
const key = sessionStorage.getItem('claude-api-key');
if (!key) showApiKeyModal();
```

Modal: minimal, branded. Single input + "Start Demo" button. That's it.

### Claude Client

```javascript
// src/ai/claudeClient.js
export async function streamClaude({ systemPrompt, messages, onChunk, onDone, apiKey }) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      stream: true,
      system: systemPrompt,
      messages,
    }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(l => l.startsWith('data: '));
    for (const line of lines) {
      try {
        const data = JSON.parse(line.slice(6));
        if (data.type === 'content_block_delta') {
          fullText += data.delta.text;
          onChunk(data.delta.text);
        }
      } catch {}
    }
  }
  onDone(fullText);
}
```

### Response Cache

**This is the key to a smooth demo.** Pre-populate responses for every expected prompt in the 5 flows. On a cache hit, simulate streaming with a fake type-out effect (12ms per char) so it looks live. On a miss, call the real API.

```javascript
// src/ai/responseCache.js

// Key: normalize(prompt) → fingerprint
// Value: full response string

export const CACHE = {
  // Flow 1 — Customer Service
  'summarize customer c-10482 recent issues': `Priya Mehta (C-10482) has had 3 interactions in the past 30 days...`,
  'draft response explaining last invoice c-10482': `Hi Priya, I'm writing regarding your March invoice...`,
  // ... etc for all expected prompts
};

export function getCached(prompt) {
  const key = prompt.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
  // Fuzzy match — check if any cache key is contained in the prompt or vice versa
  for (const [cacheKey, response] of Object.entries(CACHE)) {
    if (key.includes(cacheKey) || cacheKey.includes(key)) return response;
  }
  return null;
}

export async function streamCached(text, onChunk, onDone) {
  for (const char of text) {
    onChunk(char);
    await new Promise(r => setTimeout(r, 12));
  }
  onDone(text);
}
```

### System Prompts

```javascript
// src/ai/prompts.js

export const EMBERLYN_SYSTEM = `You are Emberlyn, the AI operations copilot for UTILITYnet's ERP platform...
[full prompt — see HTML source, EMBERLYN_SYSTEM_PROMPT variable]`;

export const THENA_SYSTEM = `You are Thena, UTILITYnet's analytics and business finance intelligence specialist...
[full prompt — see HTML source, THENA_SYSTEM_PROMPT variable]`;
```

Extract both system prompts verbatim from `UTILITYnet_ERP_Demo.html` — they're defined as `const EMBERLYN_SYSTEM_PROMPT` and `const THENA_SYSTEM_PROMPT` in the `<script>` block.

---

## The 5 Demo Flows — Build These First

These are the only flows that need to be fully polished. Everything else can be stubbed.

---

### Flow 1 — Customer Service + Emberlyn

**Module:** Customers → click any customer row → Customer 360 view opens  
**Entry point:** Customer row click → opens customer detail panel or page  

**Demo sequence:**
1. Open customer **Priya Mehta (C-10482)** — show account summary, billing history, open case
2. Emberlyn panel opens automatically (or user opens it)
3. **Suggested prompt shown:** "Summarize this customer's recent issues"
4. Emberlyn streams response: account summary, 3 recent interactions, open billing complaint
5. **Suggested prompt:** "Draft a response explaining the last invoice"
6. Emberlyn streams a polished customer-facing email draft
7. **Action preview card appears:** "Create follow-up task + update case to In Review"
8. User clicks Confirm → case status updates on screen, task appears in sidebar

**What must visually update:** Case status pill changes, follow-up task counter increments.

---

### Flow 2 — Billing Exception + Emberlyn

**Module:** Billing → Exceptions tab or exceptions queue  
**Entry point:** Click exception row for **Batch B-2026-0311 / Nguyen Family Holdings**

**Demo sequence:**
1. Billing batch dashboard showing exception count badge (3)
2. Click exception → exception detail panel slides in
3. **Suggested prompt:** "Why was this account flagged?"
4. Emberlyn streams: meter read gap explanation, comparison of expected vs actual
5. **Suggested prompt:** "What's the recommended next step?"
6. Emberlyn streams: 3-step resolution path with specific action items
7. **Action preview:** "Escalate to billing analyst + mark for manual review"
8. Confirm → exception status updates to "In Review"

---

### Flow 3 — Settlement Exception + Emberlyn

**Module:** Settlement → Marketer Workbench  
**Entry point:** Click "Resolve" on **AltaGas Retail** exception (pre-built into settlement module)

**Demo sequence:**
1. Settlement workbench showing AltaGas exception — $1,640 variance
2. Exception detail card already visible (UTILITYnet $481,600 vs AltaGas $483,240)
3. **Suggested prompt:** "Summarize the root cause of this exception"
4. Emberlyn streams: 8 unmatched site reads, AESO data confirms UTILITYnet figures
5. **Suggested prompt:** "Draft the reconciliation response to AltaGas"
6. Emberlyn streams a formal, professional dispute letter
7. **Action preview:** "Accept UTILITYnet figures + send response to AltaGas contact"
8. Confirm → exception moves to "Resolved", settlement timeline advances

---

### Flow 4 — Thena: Analytics + Prescriptive Actions

**Module:** Analytics (full iron-steel mode — FractalShift Thena aesthetic)  
**Entry point:** Click Analytics in sidebar → full visual transformation

**Demo sequence:**
1. Analytics module loads in Thena mode (dark iron-steel, FractalShift branding)
2. Descriptive layer visible: KPIs, revenue chart, marketer ranking
3. Scroll to Predictive layer — late payment risk card highlighted (17 accounts, $41,200)
4. Thena panel opens: **Suggested prompt:** "What are the top revenue risks in Q2?"
5. Thena streams: 3 risks ranked by exposure, with confidence levels and data sources
6. **Suggested prompt:** "Build me a 30-day action plan"
7. Thena streams: 4 prioritized actions with estimated impact in CAD
8. Scroll to Prescriptive layer — action cards already showing; Thena response reinforces them

---

### Flow 5 — Thena: Executive Q&A

**Module:** Analytics (same Thena mode)  
**Entry point:** Thena panel open, free-form question

**Demo sequence (pick one live, others in cache):**

Option A: "Which marketers need attention this month?"
→ Thena: GreenPath, AltaEnergy, SolarEdge — strong leads but below-benchmark conversion. Specific numbers. Recommended: enablement call this week.

Option B: "Forecast next month's service call volume"
→ Thena: 22–28 cases (71% confidence). Based on March 28-day trend + AESO schedule. What would push it higher: billing exception backlog.

Option C: "What actions would you recommend to reduce late payments?"
→ Thena: 3-action playbook. Collections outreach (17 accounts, $41,200 recovery). Proactive SMS (cut late rate by est. 40%). Auto-payment incentive (CAD $20 credit). Expected total recovery: ~$32,000 net.

**All three must be cached.**

---

## Module Build Priority

| Priority | Module | Status |
|---|---|---|
| **P0** | Analytics (Thena mode) | Full build — this is the showpiece |
| **P0** | Customers (with Flow 1) | Full build |
| **P0** | Billing (with Flow 2) | Full build |
| **P0** | Settlement (with Flow 3) | Full build |
| **P1** | Dashboard | Already good — port as-is from HTML |
| **P2** | Marketers | Stub — table + performance chart only |
| **P2** | Finance | Stub — KPIs + GL summary only |
| **P3** | Admin | Stub — integrations list only |

---

## Thena/FractalShift Styling for Analytics Module

When user navigates to Analytics:
1. `document.documentElement.setAttribute('data-theme', 'thena')` — add third theme
2. Sidebar transforms to iron-steel palette
3. Main content area uses FractalShift design system

**Thena theme CSS tokens (add alongside light/dark):**

```css
[data-theme="thena"] {
  --bg:      #111210;
  --surface: #161714;
  --s2:      #1c1d19;
  --accent:  #D44028;
  --text:    #C8C4BF;
  --light:   #F2F0EC;
  --border:  rgba(242,240,236,0.07);
  --bormid:  rgba(242,240,236,0.13);
  --muted:   rgba(200,196,191,0.5);
  --nav-bg:  #111210;
  --sidebar-bg: #111210;
  --sidebar-bdr: rgba(242,240,236,0.07);
  --active-nav-bg: rgba(212,64,40,0.10);
  --active-nav-bdr: #D44028;
  --active-nav-color: #F2F0EC;
  --label-color: #D44028;
  --kpi-color: #F2F0EC;
  --gold: #D44028;
  --gold-dim: rgba(212,64,40,0.10);
  --gold-bdr: rgba(212,64,40,0.28);
  --font-ui: 'Syne', sans-serif;
  --font-mono: 'DM Mono', monospace;
}
```

**Thena-only fonts to add to Google Fonts import:**
`Playfair Display:ital,wght@0,700;1,400` + `DM Mono:wght@400;500` + `Syne:wght@400;500;600;700`

**Analytics page title:** Playfair Display 700, 28px, `#F2F0EC`, with 48px × 3px `#D44028` underline block.

**Section labels in analytics:** DM Mono, 9px, uppercase, 0.12em tracking, `#D44028`.

**Restore theme on navigate away from Analytics:** revert to user's saved light/dark preference.

---

## Stubbing Non-Priority Modules

Modules that aren't part of a demo flow get a functional stub:

```jsx
// Stub pattern
export function Finance() {
  return (
    <div className="module-page">
      <PageHeader title="Finance" subtitle="GL · AR · AP · Reconciliation" />
      <KpiGrid items={financeKpis} />
      <ComingSoonCard message="Full finance module available in Phase 2" />
    </div>
  );
}
```

The stub must:
- Show the correct page title with gold underline
- Show 4 KPI cards with real demo numbers
- Not crash or throw errors
- Have Emberlyn panel attached and functional

---

## Demo Data

Extract all mock data from `UTILITYnet_ERP_Demo.html` into `src/data/demoData.js`. Key datasets:

```javascript
export const customers = [...];          // 8 customers with full profiles
export const billingExceptions = [...];  // 3 exceptions
export const marketers = [...];          // 6 marketers with performance data
export const settlementData = [...];     // Settlement workbench rows
export const kpiData = { ... };          // All KPI values
export const timelineItems = [...];      // Settlement timeline
```

All data is already in the HTML — just extract and export it.

---

## Component Patterns to Carry Over

These patterns are established in the HTML and must be preserved:

**PageHeader:**
```jsx
<div className="page-header">
  <h1 className="page-title">{title}</h1>  {/* has ::after gold underline */}
  <p className="page-subtitle">{subtitle}</p>
</div>
```

**StatusPill:**
```jsx
<span className={`pill pill-${status}`}>
  <span className="pill-dot"></span>
  {label}
</span>
// status values: success | pending | error | warning | info
```

**SectionLabel:**
```jsx
<div className="section-label">{label}</div>
// JetBrains Mono, uppercase, teal color, 0.12em tracking
```

**KpiCard:**
```jsx
<div className={`kpi-card ${featured ? 'featured' : ''}`}>
  <div className="kpi-label">{label}</div>
  <div className="kpi-value">{value}</div>
  <div className={`kpi-delta ${negative ? 'neg' : ''}`}>{delta}</div>
  <div className="kpi-sub">{sub}</div>
</div>
```

**ActionPreview (Emberlyn confirm flow):**
```jsx
<div className="action-preview">
  <div className="action-preview-label">Proposed Action</div>
  <div>{description}</div>
  <div className="action-btns">
    <button onClick={onConfirm} className="btn btn-primary btn-sm">✓ Confirm</button>
    <button onClick={onCancel} className="btn btn-ghost btn-sm">Cancel</button>
  </div>
</div>
```

---

## Emberlyn Panel Behavior

Emberlyn is present on all modules except Analytics (which gets Thena instead).

**Critical rule (carry over from HTML):** Emberlyn NEVER silently applies changes.
Flow: interpret → show action preview card → user confirms → apply.

Panel states:
- `closed` — floating "✦ Emberlyn" button visible at bottom-right
- `open` — 340px right panel, main content shifts left

Context label updates on navigate: `CONTEXT: {ModuleName} · UTILITYnet ERP · March 2026`

Suggestion chips: pre-populated per module and per flow context. See HTML source for full sets.

---

## Thena Panel Behavior

Only shows on Analytics module. Replaces Emberlyn visually and functionally.

Thena header: gold top border (`#D44028`), dark surface, "THENA" mono label + "Analytics Intelligence" title.

User bubble: teal (`var(--teal)`) on UTILITYnet modules, accent red (`#D44028`) in Thena mode.

Suggestion sets (from HTML, `openThena()` function):
```javascript
const suggestionSets = {
  'analytics': ['What are the top revenue risks in Q2?', 'Which marketers need attention most?', 'Forecast April revenue and growth'],
  'collections-outreach': ['Draft the outreach message for at-risk accounts', 'Which 17 accounts should we prioritize?', '...'],
  'retention': ['Which 42 accounts are highest priority?', 'What is the best offer to prevent churn?', '...'],
};
```

---

## Things NOT to Change

- All demo data values (revenue, KPIs, customer names, marketer names) — these are calibrated
- The narrative of each flow — the sequence matters for the demo story
- The FractalShift/Gnar branding in the footer: `FRACTALSHIFT × GNAR · V2.1.0 · POWERED BY EMBERLYN AI`
- The "ALBERTA ENERGY RETAIL" badge in the nav
- The gold 48px underline on section titles — this is brand DNA

---

## What to Do First

1. Scaffold Vite + React project
2. Port `tokens.css` from design system — get light/dark/thena themes working
3. Port `Layout.jsx` — nav + sidebar + main shell working with navigate
4. Port `Dashboard.jsx` — verify all styles look right before touching anything else
5. Build `EmerlynPanel.jsx` with real streaming (cache + API fallback)
6. Build `ThenaPanel.jsx` same pattern
7. Port `Analytics.jsx` with full Thena mode transformation
8. Build Flow 1 (Customer Service) — first end-to-end demo flow
9. Build Flow 2 (Billing Exception)
10. Build Flow 3 (Settlement)
11. Build Flow 4 + 5 (Thena flows — both live in Analytics)
12. Stub remaining modules (Marketers, Finance, Admin)
13. API key modal
14. `vite build` → verify `dist/index.html` opens offline

---

## Files Attached

- `UTILITYnet_ERP_Demo.html` — full working demo, source of truth for all content and interactions
- `UTILITYnet_Design_System_v2.md` — complete design system, CSS tokens, component specs

When in doubt about a style decision, refer to the design system. When in doubt about content or interaction, refer to the HTML.
