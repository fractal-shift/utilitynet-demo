# Demo Automation Scripts

Playwright-based automation for the UTILITYnet ERP demo. Each script drives the browser through a scenario, displays a summary at start, status text during steps, a visible demo cursor for clicks, and pauses 5+ seconds between steps for audience digestion.

## Prerequisites

1. **Dev server running**: `npm run dev` (in another terminal)
2. **Playwright browsers**: On macOS, demos use system Chrome by default. On other platforms, run `npx playwright install` once. Set `DEMO_USE_SYSTEM_CHROME=0` to force Playwright Chromium.

## Run a scenario

```bash
npm run demo:dashboard         # Operations Dashboard walkthrough
npm run demo:enrollment        # New customer enrollment (Heather Mitchell)
npm run demo:customer-service  # MacGregor Industrial Ltd. + Emberlyn
npm run demo:billing           # Billing exception + Emberlyn
npm run demo:settlement        # AltaGas settlement + Emberlyn
npm run demo:marketers         # Onboard new marketer
npm run demo:analytics         # Thena analytics
npm run demo:complex           # 18-step full operational journey
npm run demo:all               # All scenarios in sequence
```

## Auto-heal (fix on failure)

When a scenario fails, auto-heal asks Claude to suggest fixes and re-runs until success:

```bash
ANTHROPIC_API_KEY=sk-... npm run demo:heal:enrollment
# or
VITE_CLAUDE_API_KEY=sk-... npm run demo:heal:enrollment
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `DEMO_BASE_URL` | App URL (default: http://localhost:5173) |
| `DEMO_STEP_PAUSE_MS` | Pause between steps in ms (default: 5000) |
| `DEMO_SUMMARY_PAUSE_MS` | Pause for scenario summary at start (default: 8000) |
| `DEMO_CURSOR_MOVE_MS` | Delay before click after cursor moves (default: 600) |
| `DEMO_SLOW_MO` | Playwright slowMo for visible mouse (default: 400) |
| `DEMO_USE_SYSTEM_CHROME` | On macOS, default is system Chrome. Set to `1` for other platforms, or `0` to force Playwright Chromium |
| `DEMO_VIEWPORT_WIDTH` | Browser viewport width in px (default: 1600) |
| `DEMO_VIEWPORT_HEIGHT` | Browser viewport height in px (default: 900) |
| `DEMO_RECORD_VIDEO` | Set to `1` to record each scenario (required for video output) |
| `DEMO_VIDEO_DIR` | Directory for recorded videos (default: `~/Downloads/utilitynet-demos`). Videos are named `utilitynet-demo-{scenario}-{date}.webm`. |
| `DEMO_MAX_ITERATIONS` | Max auto-heal iterations (default: 5) |
| `DEMO_HEAL_DRY_RUN` | Set to `1` to log suggested edits without applying |
