# UTILITYnet ERP Demo

Alberta energy retail operations demo — customers, billing, settlement, marketers, analytics, and AI assistants (Emberlyn, Thena).

**Repo:** [github.com/fractal-shift/utilitynet-demo](https://github.com/fractal-shift/utilitynet-demo)

## Quick start

```bash
cd demo
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## API key (optional)

For live AI responses, copy `demo/.env.example` to `demo/.env` and add your `VITE_CLAUDE_API_KEY` from [console.anthropic.com](https://console.anthropic.com/). Cached responses work without it.

For demo auto-heal scripts, use `ANTHROPIC_API_KEY` or `VITE_CLAUDE_API_KEY`.

## Demo automation

Playwright-based automation for live demos. See [demo/scripts/README.md](demo/scripts/README.md) for scenarios, video recording, and auto-heal.

```bash
npm run demo:dashboard      # Operations Dashboard
npm run demo:analytics      # Thena analytics
DEMO_RECORD_VIDEO=1 npm run demo:dashboard   # Record to ~/Downloads/utilitynet-demos/
```

## Tech stack

React 18, Vite 5, Tailwind, Chart.js, Playwright, Claude API
