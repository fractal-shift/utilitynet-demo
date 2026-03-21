/**
 * UTILITYnet Demo — Integration Service Layer
 * All fetch calls to mock APIs go through this module.
 * Base URL uses relative /api/mock when served by Vite (proxied to 3101).
 */

const BASE = '/api/mock';

async function fetchJson(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

// Scenario control — from browser (Vite proxies /scenario to 3101)
export async function setScenario(name) {
  const res = await fetch(`/scenario/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`Scenario set failed: ${res.status}`);
  return res.json();
}

export async function setScenarioDirect(name) {
  const res = await fetch(`http://localhost:3101/scenario/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`Scenario set failed: ${res.status}`);
  return res.json();
}

export async function resetAllScenarios() {
  const res = await fetch(`http://localhost:3101/scenario/reset/all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`Reset failed: ${res.status}`);
  return res.json();
}

export async function getScenarioStatus() {
  const res = await fetch('/scenario/status');
  if (!res.ok) throw new Error(`Status failed: ${res.status}`);
  return res.json();
}

export async function fetchAesoUsage() {
  return fetchJson('/api/mock/aeso/usage');
}

export async function fetchAesoPrice() {
  return fetchJson('/api/mock/aeso/price');
}

export async function fetchRbcBalance() {
  return fetchJson('/api/mock/rbc/balance');
}

export async function fetchRbcTransactions() {
  return fetchJson('/api/mock/rbc/transactions');
}

export async function postRbcPayment(payeeId, amount, description) {
  return fetchJson('/api/mock/rbc/payment', {
    method: 'POST',
    body: JSON.stringify({ payeeId, amount, description }),
  });
}

export async function postCreditCheck(applicant) {
  return fetchJson('/api/mock/credit/check', {
    method: 'POST',
    body: JSON.stringify(applicant),
  });
}

export async function fetchAltaGasInvoice() {
  return fetchJson('/api/mock/altagas/invoice');
}

export async function postAltaGasDispute(data) {
  return fetchJson('/api/mock/altagas/dispute', {
    method: 'POST',
    body: JSON.stringify(data || {}),
  });
}

export async function fetchWatchdogFeeds() {
  return fetchJson('/api/mock/watchdog/feeds');
}
