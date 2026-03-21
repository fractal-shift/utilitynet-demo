# UTILITYnet Demo — Project Status (Claude Visibility)

**Last updated:** March 2025

This doc helps AI (Claude) understand the current state so it can fix issues.

---

## Quick Facts

- **Stack:** React 18, Vite 5, Tailwind, Chart.js, Playwright, Claude API (Anthropic)
- **Entry:** `demo/` folder. Run `npm run dev:full` (app + mock server) then `npm run demo:all` (Playwright)
- **API key:** `demo/src/apiKey.js` — hardcoded, gitignored. Fresh clone: `cp src/apiKey.example.js src/apiKey.js` then add key. `predev` auto-copies if missing.

---

## Feature Registry (FEATURE_REGISTRY.json)

All 20 features are **LOCKED**. Validation skips LOCKED features, so `node scripts/validate.mjs` always passes.

| Tier | Count | Notes |
|------|-------|------|
| T1 | 7 | finance, mock, hooks, billing, enrollment, run-finance, run-enrollment |
| T2 | 10 | coach rail, audio, marketers, analytics, admin, watchdog, CRM + 3 Playwright extensions |
| T3 | 3 | settlement categories, enrollment thin file, watchdog feed-down |

---

## Validation Checks — Real vs Stub

**Real checks (actually validate something):**
- `finance-module.mjs` — Playwright or static fallback
- `playwright-finance.mjs`, `playwright-enrollment.mjs` — script source checks
- `playwright-marketers.mjs`, `playwright-settlement.mjs`, `playwright-analytics.mjs` — script source checks
- `settlement-categories.mjs` — static (no browser, Playwright was flaky)
- `enrollment-thin-file.mjs` — static
- `watchdog-feed-down.mjs` — mock server API (needs mock running)

**STUB checks (always `return { pass: true }`):**
- `marketers-flows.mjs` (T2-003)
- `analytics-flows.mjs` (T2-004)
- `admin-security.mjs` (T2-005)
- `watchdog-panel.mjs` (T2-006)
- `crm-propagation.mjs` (T2-007)

These stubs mean T2-003 through T2-007 are LOCKED without real validation. UI may be partial or missing.

---

## Known Issues / Tech Debt

1. **apiKey.js gitignored** — App imports `from './apiKey'`. On fresh clone the file doesn't exist. Fix: `predev` copies from `apiKey.example.js`. User must edit `apiKey.js` with real key.

2. **Playwright headless unreliable** — Some checks (settlement-categories, etc.) were switched to static file checks because `chromium.launch({ headless: true })` failed (Chrome/Chromium path issues, sandbox).

3. **demo:all not fully exercised** — Full E2E run (8 scenarios) takes 15–20 min. Has been backgrounded/interrupted. Unknown if all scenarios complete.

4. **btn-approve-ap strict mode** — Finance has 2 elements with `data-demo="btn-approve-ap"`. Fixed by `clickWithCursor` using `.first()`.

5. **Mock server required** — `npm run dev:full` runs both Vite and mock (port 3101). ScenarioPanel, Watchdog, enrollment credit flows depend on it.

---

## Key Paths

```
demo/
├── FEATURE_REGISTRY.json   # All features LOCKED
├── mock-server.mjs        # Port 3101, /scenario/:name, /api/mock/*
├── src/
│   ├── apiKey.js          # GITIGNORED — user's key
│   ├── apiKey.example.js  # Template for fresh clone
│   ├── App.jsx            # Imports CLAUDE_API_KEY from apiKey
│   └── components/
│       ├── EmerlynPanel.jsx   # Emberlyn AI (Claude)
│       └── ThenaPanel.jsx     # Thena analytics (Claude)
├── scripts/
│   ├── validate.mjs       # Runs checks from registry
│   ├── heal.mjs           # validate + LOCK on pass
│   ├── demo-runner.mjs    # clickWithCursor, setMockScenario, injects API key
│   ├── run-*.mjs          # Individual Playwright scenarios
│   ├── run-all.mjs        # Runs all 8 scenarios
│   └── checks/            # One .mjs per feature
└── NORTH_STAR.md          # Canonical spec
```

---

## How to Unfuck

1. **Replace stub checks** — Implement real validation for marketers-flows, analytics-flows, watchdog-panel, admin-security, crm-propagation.
2. **Run demo:all to completion** — Verify all 8 scenarios pass. Fix any failures.
3. **Fix Playwright headless** — If possible, restore browser-based checks for T3-001 (settlement-categories). Or document that static checks are intentional.
4. **apiKey resilience** — Consider env var fallback so demo works without editing files.
