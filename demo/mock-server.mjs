/**
 * UTILITYnet Demo — Mock Integration Server
 * Port 3101. Scenario-controlled responses for AESO, RBC, Credit, AltaGas.
 */

import express from 'express';
import cors from 'cors';

const PORT = 3101;
const app = express();
app.use(cors());
app.use(express.json());

// Scenario state: aeso, rbc, credit, altagas
const scenarios = {
  aeso: 'aeso-happy',
  rbc: 'rbc-happy',
  credit: 'credit-pass',
  altagas: 'altagas-clean',
};

// Scenario name → service mapping
const serviceForScenario = (name) => {
  if (name.startsWith('aeso-')) return 'aeso';
  if (name.startsWith('rbc-')) return 'rbc';
  if (name.startsWith('credit-')) return 'credit';
  if (name.startsWith('altagas-')) return 'altagas';
  return null;
};

// POST /scenario/:name — switch scenario
app.post('/scenario/:name', (req, res) => {
  const name = req.params.name;
  const svc = serviceForScenario(name);
  if (svc) {
    scenarios[svc] = name;
  }
  res.json({ ok: true, active: { ...scenarios } });
});

// POST /scenario/reset/all
app.post('/scenario/reset/all', (req, res) => {
  scenarios.aeso = 'aeso-happy';
  scenarios.rbc = 'rbc-happy';
  scenarios.credit = 'credit-pass';
  scenarios.altagas = 'altagas-clean';
  res.json({ ok: true, active: { ...scenarios } });
});

// GET /scenario/status
app.get('/scenario/status', (req, res) => {
  res.json({ active: { ...scenarios }, ok: true });
});

// GET /health
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Base usage records (aeso-happy default)
const baseUsage = [
  { siteId: 'SITE-10042', usageGj: 1240, period: '2026-03' },
  { siteId: 'SITE-10087', usageGj: 892, period: '2026-03' },
  { siteId: 'SITE-20011', usageGj: 4920, period: '2026-03' },
  { siteId: 'SITE-10103', usageGj: 2100, period: '2026-03' },
  { siteId: 'SITE-20028', usageGj: 3150, period: '2026-03' },
];

// GET /api/mock/aeso/usage
app.get('/api/mock/aeso/usage', (req, res) => {
  if (scenarios.aeso === 'aeso-down') {
    return res.status(503).json({ error: 'AESO feed unavailable' });
  }
  let records = [...baseUsage];
  if (scenarios.aeso === 'aeso-variance') {
    records = records.map((r) =>
      r.siteId === 'SITE-20011'
        ? { ...r, usageGj: 9840, flags: ['USAGE_SPIKE'] }
        : r
    );
  }
  res.json({ records });
});

// GET /api/mock/aeso/price
app.get('/api/mock/aeso/price', (req, res) => {
  if (scenarios.aeso === 'aeso-down') {
    return res.status(503).json({ error: 'AESO feed unavailable' });
  }
  const poolPrice = scenarios.aeso === 'aeso-variance' ? 7.21 : 4.82;
  const hedgeAllocation = 0.34;
  res.json({ poolPrice, hedgeAllocation });
});

// GET /api/mock/aeso/feed-status
app.get('/api/mock/aeso/feed-status', (req, res) => {
  const connected = scenarios.aeso !== 'aeso-down';
  res.json({
    connected,
    status: connected ? 'OK' : 'DOWN',
    latencyMs: connected ? 42 : null,
    lastSync: connected ? new Date().toISOString() : null,
    hasAlert: scenarios.aeso === 'aeso-variance' || scenarios.aeso === 'aeso-down',
  });
});

// GET /api/mock/rbc/balance
app.get('/api/mock/rbc/balance', (req, res) => {
  if (scenarios.rbc === 'rbc-down') {
    return res.status(503).json({ error: 'RBC service unavailable' });
  }
  let statementBalance = 1820000;
  const flags = [];
  if (scenarios.rbc === 'rbc-exception') {
    statementBalance = 1760000;
    flags.push('BALANCE_MISMATCH');
  }
  res.json({ statementBalance, flags });
});

// GET /api/mock/rbc/transactions
app.get('/api/mock/rbc/transactions', (req, res) => {
  if (scenarios.rbc === 'rbc-down') {
    return res.status(503).json({ error: 'RBC service unavailable' });
  }
  const txns = [
    { id: 'TXN-001', amount: 50000, description: 'Deposit', glAccount: '1000', date: '2026-03-10' },
    { id: 'TXN-002', amount: -12000, description: 'AltaGas', glAccount: '2200', date: '2026-03-09' },
    { id: 'TXN-003', amount: 42000, description: 'AR Receipt', glAccount: '1100', date: '2026-03-08' },
    { id: 'TXN-004', amount: -8500, description: 'AP Payment', glAccount: '2100', date: '2026-03-07' },
    { id: 'TXN-005', amount: 31000, description: 'Deposit', glAccount: '1000', date: '2026-03-06' },
  ];
  if (scenarios.rbc === 'rbc-exception') {
    txns.push({ id: 'TXN-UNMATCHED', amount: 60000, description: 'Unmatched Credit', glAccount: null, date: '2026-03-05', flags: ['UNMATCHED'] });
  }
  res.json({ transactions: txns });
});

// POST /api/mock/rbc/payment
app.post('/api/mock/rbc/payment', (req, res) => {
  const { payeeId, amount, description } = req.body || {};
  res.json({ confirmationNumber: `PAY-${Date.now()}`, payeeId, amount, description });
});

// GET /api/mock/rbc/feed-status
app.get('/api/mock/rbc/feed-status', (req, res) => {
  const connected = scenarios.rbc !== 'rbc-down';
  res.json({
    connected,
    status: connected ? 'OK' : 'DOWN',
    latencyMs: connected ? 28 : null,
    lastSync: connected ? new Date().toISOString() : null,
    hasAlert: scenarios.rbc === 'rbc-exception' || scenarios.rbc === 'rbc-down',
  });
});

// POST /api/mock/credit/check
app.post('/api/mock/credit/check', async (req, res) => {
  if (scenarios.credit === 'credit-slow') {
    await new Promise((r) => setTimeout(r, 3800));
  }
  if (scenarios.credit === 'credit-fail') {
    return res.json({
      status: 'DECLINED',
      score: 492,
      depositRequired: 250,
      options: ['Require Deposit', 'Reject Application', 'Manual Override'],
    });
  }
  if (scenarios.credit === 'credit-thin') {
    return res.json({
      status: 'CONDITIONAL',
      score: null,
      depositRequired: 150,
      message: 'Thin file — no credit history',
    });
  }
  res.json({
    status: 'PASS',
    score: 724,
    depositRequired: 0,
  });
});

// Credit feed-status (credit bureau doesn't have a typical "feed" — stub)
app.get('/api/mock/credit/feed-status', (req, res) => {
  res.json({
    connected: true,
    status: 'OK',
    latencyMs: 85,
    lastSync: new Date().toISOString(),
    hasAlert: scenarios.credit === 'credit-fail',
  });
});

// GET /api/mock/altagas/invoice
app.get('/api/mock/altagas/invoice', (req, res) => {
  if (scenarios.altagas === 'altagas-down') {
    return res.status(503).json({ error: 'AltaGas service unavailable' });
  }
  let lineItems = [
    { siteId: 'SITE-10042', usageGj: 1240, rate: 4.82, amount: 5976.8 },
    { siteId: 'SITE-10087', usageGj: 892, rate: 4.82, amount: 4299.44 },
    { siteId: 'SITE-20011', usageGj: 4920, rate: 4.82, amount: 23714.4 },
    { siteId: 'SITE-10103', usageGj: 2100, rate: 4.82, amount: 10122 },
    { siteId: 'SITE-20028', usageGj: 3150, rate: 4.82, amount: 15183 },
  ];
  if (scenarios.altagas === 'altagas-variance') {
    lineItems = lineItems.map((l) =>
      l.siteId === 'SITE-20011'
        ? { ...l, usageGj: 5160, amount: 24871.2, variance: 1640, varianceReason: 'Volume discrepancy' }
        : l
    );
  }
  if (scenarios.altagas === 'altagas-missing') {
    lineItems = lineItems.filter((l) => l.siteId !== 'SITE-20028');
  }
  res.json({ lineItems });
});

// POST /api/mock/altagas/dispute
app.post('/api/mock/altagas/dispute', (req, res) => {
  res.json({ disputeId: `DISPUTE-${Date.now()}`, status: 'Submitted' });
});

// GET /api/mock/altagas/feed-status
app.get('/api/mock/altagas/feed-status', (req, res) => {
  const connected = scenarios.altagas !== 'altagas-down';
  res.json({
    connected,
    status: connected ? 'OK' : 'DOWN',
    latencyMs: connected ? 120 : null,
    lastSync: connected ? new Date().toISOString() : null,
    hasAlert: scenarios.altagas === 'altagas-variance' || scenarios.altagas === 'altagas-missing' || scenarios.altagas === 'altagas-down',
  });
});

// GET /api/mock/watchdog/feeds — aggregated
app.get('/api/mock/watchdog/feeds', async (req, res) => {
  const feeds = [];
  for (const [name, path] of [
    ['AESO', '/api/mock/aeso/feed-status'],
    ['RBC', '/api/mock/rbc/feed-status'],
    ['Credit Bureau', '/api/mock/credit/feed-status'],
    ['AltaGas', '/api/mock/altagas/feed-status'],
  ]) {
    try {
      const r = await fetch(`http://localhost:${PORT}${path}`);
      const d = await r.json();
      feeds.push({ name, ...d });
    } catch {
      feeds.push({ name, connected: false, status: 'ERROR', hasAlert: true });
    }
  }
  const alertCount = feeds.filter((f) => f.hasAlert).length;
  res.json({ feeds, alertCount });
});

app.listen(PORT, () => {
  console.log(`[mock-server] listening on http://localhost:${PORT}`);
});
