/**
 * Validates that the integration simulator is running and all routes respond correctly.
 * Prerequisite: node integration-simulator.mjs must be running on port 3101.
 */
export async function check() {
  const errors = [];
  const BASE = 'http://localhost:3101';

  // Health check
  try {
    const res = await fetch(`${BASE}/health`);
    if (!res.ok) errors.push(`Health endpoint returned ${res.status}`);
    const data = await res.json();
    if (!data.ok) errors.push('Health response missing ok: true');
  } catch {
    errors.push('Mock server not reachable at localhost:3101 — is it running?');
    return { pass: false, errors };
  }

  // Scenario control
  try {
    const res = await fetch(`${BASE}/scenario/status`);
    const data = await res.json();
    if (!data.active) errors.push('Scenario status missing active object');
  } catch (e) {
    errors.push(`Scenario status failed: ${e.message}`);
  }

  // AESO routes
  for (const p of ['/api/mock/aeso/usage', '/api/mock/aeso/price', '/api/mock/aeso/feed-status']) {
    try {
      const res = await fetch(`${BASE}${p}`);
      if (!res.ok) errors.push(`AESO ${p} returned ${res.status}`);
    } catch (e) {
      errors.push(`AESO ${p} failed: ${e.message}`);
    }
  }

  // RBC routes
  for (const p of ['/api/mock/rbc/balance', '/api/mock/rbc/transactions', '/api/mock/rbc/feed-status']) {
    try {
      const res = await fetch(`${BASE}${p}`);
      if (!res.ok) errors.push(`RBC ${p} returned ${res.status}`);
    } catch (e) {
      errors.push(`RBC ${p} failed: ${e.message}`);
    }
  }

  // Credit check POST
  try {
    const res = await fetch(`${BASE}/api/mock/credit/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicantName: 'Test User', postalCode: 'T5A 0A1' }),
    });
    if (!res.ok) errors.push(`Credit check POST returned ${res.status}`);
    const data = await res.json();
    if (!data.status) errors.push('Credit check missing status field');
    if (!data.score && data.status !== 'CONDITIONAL') errors.push('Credit check missing score');
  } catch (e) {
    errors.push(`Credit check POST failed: ${e.message}`);
  }

  // AltaGas invoice
  try {
    const res = await fetch(`${BASE}/api/mock/altagas/invoice`);
    if (!res.ok) errors.push(`AltaGas invoice returned ${res.status}`);
    const data = await res.json();
    if (!data.lineItems) errors.push('AltaGas invoice missing lineItems');
  } catch (e) {
    errors.push(`AltaGas invoice failed: ${e.message}`);
  }

  // Scenario switching — test credit-fail then reset
  try {
    await fetch(`${BASE}/scenario/credit-fail`, { method: 'POST' });
    const res = await fetch(`${BASE}/api/mock/credit/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicantName: 'Test User' }),
    });
    const data = await res.json();
    if (data.status !== 'DECLINED') errors.push(`credit-fail scenario: expected DECLINED, got ${data.status}`);
    await fetch(`${BASE}/scenario/credit-pass`, { method: 'POST' });
  } catch (e) {
    errors.push(`Scenario switching test failed: ${e.message}`);
  }

  // Aggregated integration feed health
  try {
    const res = await fetch(`${BASE}/api/mock/integrations/feeds`);
    const data = await res.json();
    if (!Array.isArray(data.feeds)) errors.push('Integration feeds response missing feeds array');
    if (data.feeds.length !== 4) errors.push(`Expected 4 feeds, got ${data.feeds.length}`);
  } catch (e) {
    errors.push(`Integration feeds failed: ${e.message}`);
  }

  return { pass: errors.length === 0, errors };
}
