# UTILITYnet ERP Demo

Alberta energy retail operations demo — customers, billing, settlement, marketers, analytics, and AI assistants (Emberlyn, Thena).

**Project status:** See [PROJECT_STATUS.md](PROJECT_STATUS.md) for Claude/AI visibility — what's implemented, stub checks, known issues.

**Repo:** [github.com/fractal-shift/utilitynet-demo](https://github.com/fractal-shift/utilitynet-demo)

## Quick start

```bash
cd demo
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## API key (required for real Emberlyn/Thena)

Edit `demo/src/apiKey.js` and replace `REPLACE_WITH_YOUR_KEY` with your Claude API key from [console.anthropic.com](https://console.anthropic.com/). The key is used everywhere — app and demo scripts. To avoid accidentally committing your key: `git update-index --skip-worktree demo/src/apiKey.js`

## Demo automation

Playwright-based automation for live demos. See [demo/scripts/README.md](demo/scripts/README.md) for scenarios, video recording, and auto-heal.

```bash
npm run demo:dashboard      # Operations Dashboard
npm run demo:analytics      # Thena analytics
DEMO_RECORD_VIDEO=1 npm run demo:dashboard   # Record to ~/Downloads/utilitynet-demos/
```

## Tech stack

React 18, Vite 5, Tailwind, Chart.js, Playwright, Claude API
