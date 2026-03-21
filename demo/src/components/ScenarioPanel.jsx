/**
 * Scenario control panel — visible at ?scenarios=1 or Ctrl+Shift+S
 * Fixed bottom-right overlay. Calls setScenario from integrations.js
 */

import { useState, useEffect, useCallback } from 'react';
import { setScenario, getScenarioStatus } from '../services/integrations';

const SERVICE_SCENARIOS = {
  AESO: ['aeso-happy', 'aeso-down', 'aeso-delayed', 'aeso-variance'],
  RBC: ['rbc-happy', 'rbc-down', 'rbc-exception'],
  Credit: ['credit-pass', 'credit-fail', 'credit-thin', 'credit-slow'],
  AltaGas: ['altagas-clean', 'altagas-variance', 'altagas-missing', 'altagas-down'],
};

export default function ScenarioPanel({ isOpen, onClose }) {
  const [active, setActive] = useState({
    aeso: 'aeso-happy',
    rbc: 'rbc-happy',
    credit: 'credit-pass',
    altagas: 'altagas-clean',
  });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const s = await getScenarioStatus();
      if (s?.active) setActive(s.active);
    } catch {
      // Ignore — server may not be running
    }
  }, []);

  useEffect(() => {
    if (isOpen) refresh();
  }, [isOpen, refresh]);

  const handleSet = async (name) => {
    setLoading(true);
    try {
      await setScenario(name);
      await refresh();
    } catch (e) {
      console.error('Scenario set failed:', e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      data-demo="scenario-panel"
      className="fixed bottom-6 right-6 z-[200] w-80 rounded-xl border-2 p-4 shadow-xl"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--teal)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: 'var(--teal)' }}>
          Scenario Control
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-xs opacity-70 hover:opacity-100"
          style={{ color: 'var(--muted)' }}
        >
          Close
        </button>
      </div>
      <div className="space-y-3">
        {Object.entries(SERVICE_SCENARIOS).map(([service, opts]) => {
          const svcKey = opts[0].split('-')[0];
          const current = active[svcKey] || opts[0];
          return (
            <div key={service}>
              <div className="mb-1 text-[10px] font-medium uppercase" style={{ color: 'var(--muted)' }}>
                {service}
              </div>
              <div className="flex flex-wrap gap-1">
                {opts.map((name) => {
                  const isActive = current === name;
                  return (
                    <button
                      key={name}
                      data-demo={`scenario-btn-${name}`}
                      type="button"
                      disabled={loading}
                      onClick={() => handleSet(name)}
                      className="rounded px-2 py-1 text-[11px] transition"
                      style={{
                        border: `2px solid ${isActive ? 'var(--teal)' : 'var(--border)'}`,
                        background: isActive ? 'rgba(26, 188, 171, 0.15)' : 'transparent',
                        color: isActive ? 'var(--teal)' : 'var(--text)',
                      }}
                    >
                      {name.replace(/-/g, ' ')}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
