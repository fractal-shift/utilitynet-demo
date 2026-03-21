/**
 * T3-003: Watchdog feed-down demo
 * Validates mock server: aeso-down sets feed status to DOWN, aeso-happy resets.
 * Mock returns 'OK' when connected (or 'LIVE' in some configs).
 */
export async function check() {
  const errors = [];
  const BASE = 'http://localhost:3101';
  try {
    await fetch(`${BASE}/scenario/aeso-down`, { method: 'POST' });
    const d = await (await fetch(`${BASE}/api/mock/aeso/feed-status`)).json();
    if (d.status !== 'DOWN') errors.push(`aeso-down: expected DOWN, got ${d.status}`);
    if (d.connected !== false) errors.push('aeso-down: connected should be false');
    await fetch(`${BASE}/scenario/aeso-happy`, { method: 'POST' });
    const d2 = await (await fetch(`${BASE}/api/mock/aeso/feed-status`)).json();
    if (d2.status !== 'LIVE' && d2.status !== 'OK') errors.push(`After reset: expected LIVE or OK, got ${d2.status}`);
  } catch (e) {
    errors.push(`Mock server not running or scenario broken: ${e.message}`);
  }
  return { pass: errors.length === 0, errors };
}
