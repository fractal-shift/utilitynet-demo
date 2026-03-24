import { useState, useEffect } from 'react';
import { fetchWatchdogFeeds } from '../services/integrations';

export default function Admin({ onOpenAlden }) {
  const [tab, setTab] = useState('integrations');
  const [watchdogFeeds, setWatchdogFeeds] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const data = await fetchWatchdogFeeds();
        if (!cancelled && data?.feeds) setWatchdogFeeds(data.feeds);
      } catch {
        if (!cancelled) setWatchdogFeeds([]);
      }
    };
    poll();
    const id = setInterval(poll, 10000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const integrations = [
    { name: 'AESO Settlement Feed', status: 'Active', lastSync: 'Mar 11, 6:00 AM' },
    { name: 'RBC Banking API', status: 'Active', lastSync: 'Mar 11, 5:45 AM' },
    { name: 'ATCO Meter Data', status: 'Active', lastSync: 'Mar 10, 11:59 PM' },
    { name: 'AltaGas Settlement API', status: 'Active', lastSync: 'Mar 11, 6:15 AM' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="inline-block font-bold text-[22px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>Admin</h1>
        <div className="mt-2 h-0.5 w-12 rounded-sm" style={{ background: 'var(--gold)' }} />
        <p className="mt-3.5 text-[13px] font-medium" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Integrations · Permissions · Audit Log</p>
      </div>
      <div className="mb-4 flex gap-2">
        <button type="button" data-demo="admin-tab-integrations" onClick={() => setTab('integrations')} className={`rounded-lg px-3 py-1.5 text-[12px] font-medium ${tab === 'integrations' ? '' : 'opacity-70'}`} style={{ background: tab === 'integrations' ? 'var(--teal-dim)' : 'var(--s2)', borderColor: tab === 'integrations' ? 'var(--teal)' : 'var(--border)', border: '1px solid', color: 'var(--text)' }}>Integrations</button>
        <button type="button" data-demo="admin-tab-ops-console" onClick={() => setTab('ops-console')} className={`rounded-lg px-3 py-1.5 text-[12px] font-medium ${tab === 'ops-console' ? '' : 'opacity-70'}`} style={{ background: tab === 'ops-console' ? 'var(--teal-dim)' : 'var(--s2)', borderColor: tab === 'ops-console' ? 'var(--teal)' : 'var(--border)', border: '1px solid', color: 'var(--text)' }}>Operations Console</button>
        <button type="button" data-demo="admin-tab-security" onClick={() => setTab('security')} className={`rounded-lg px-3 py-1.5 text-[12px] font-medium ${tab === 'security' ? '' : 'opacity-70'}`} style={{ background: tab === 'security' ? 'var(--teal-dim)' : 'var(--s2)', borderColor: tab === 'security' ? 'var(--teal)' : 'var(--border)', border: '1px solid', color: 'var(--text)' }}>Security</button>
      </div>
      {tab === 'integrations' && (
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-4 text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--label-color)', fontFamily: 'var(--font-mono)' }}>Integrations</div>
          <div className="flex flex-col gap-2">
            {integrations.map((i) => (
              <div key={i.name} className="flex items-center justify-between rounded-lg border p-3" style={{ background: 'var(--s2)', borderColor: 'var(--border)' }}>
                <span className="text-[13px] font-medium" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{i.name}</span>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[8px] font-medium" style={{ background: 'rgba(39,174,96,0.10)', borderColor: 'rgba(39,174,96,0.30)', color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>Active</span>
                  <span className="text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{i.lastSync}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === 'ops-console' && (
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-4 text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--label-color)', fontFamily: 'var(--font-mono)' }}>Feed Health</div>
          <div data-demo="ops-console-feed-health" className="flex flex-col gap-2">
            {watchdogFeeds.length > 0 ? watchdogFeeds.map((f) => (
              <div key={f.name} className="flex items-center justify-between rounded-lg border p-3" style={{ background: f.status === 'DOWN' ? 'rgba(229,62,62,0.08)' : 'var(--s2)', borderColor: f.status === 'DOWN' ? 'rgba(229,62,62,0.3)' : 'var(--border)' }}>
                <span className="text-[13px] font-medium" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{f.name}</span>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[8px] font-medium" style={{ background: f.status === 'DOWN' ? 'rgba(229,62,62,0.15)' : 'rgba(39,174,96,0.10)', borderColor: f.status === 'DOWN' ? 'rgba(229,62,62,0.30)' : 'rgba(39,174,96,0.30)', color: f.status === 'DOWN' ? 'var(--error)' : 'var(--success)', fontFamily: 'var(--font-mono)' }}>{f.status === 'DOWN' ? 'DOWN' : (f.status || 'OK')}</span>
                  <span className="text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{f.lastSync ? new Date(f.lastSync).toLocaleString() : '—'}</span>
                </div>
              </div>
            )) : (
              <div className="text-[12px]" style={{ color: 'var(--muted)' }}>Loading feeds… (mock server required)</div>
            )}
          </div>

          <div data-demo="ops-console-job-queue" className="mt-5">
            <div className="mb-3 text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--label-color)', fontFamily: 'var(--font-mono)' }}>Job Queue</div>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Job', 'Last Run', 'Status', 'Duration'].map((h) => (
                    <th key={h} className="pb-2 text-left text-[9px] font-medium tracking-[0.08em] uppercase" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { job: 'Billing Batch Processor', lastRun: 'Mar 11 · 00:01', status: '✓ Completed', duration: '4m 12s', running: false },
                  { job: 'Settlement Reconciliation', lastRun: 'Mar 11 · 06:00', status: '✓ Completed', duration: '7m 44s', running: false },
                  { job: 'GL Posting — Nightly', lastRun: 'Mar 11 · 02:00', status: '✓ Completed', duration: '1m 03s', running: false },
                  { job: 'AR Aging Refresh', lastRun: 'Mar 11 · 08:00', status: '⏳ Running', duration: '—', running: true },
                ].map((row) => (
                  <tr key={row.job}>
                    <td className="py-2.5 pr-4 text-[12px] font-medium" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)', borderBottom: '1px solid var(--border)' }}>{row.job}</td>
                    <td className="py-2.5 pr-4 text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', borderBottom: '1px solid var(--border)' }}>{row.lastRun}</td>
                    <td className="py-2.5 pr-4 text-[11px]" style={{ color: row.running ? 'var(--teal)' : 'var(--success)', fontFamily: 'var(--font-mono)', borderBottom: '1px solid var(--border)' }}>{row.status}</td>
                    <td className="py-2.5 text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', borderBottom: '1px solid var(--border)' }}>{row.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div data-demo="ops-console-alerts" className="mt-5">
            <div className="mb-3 text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--label-color)', fontFamily: 'var(--font-mono)' }}>Recent Alerts</div>
            <div className="flex flex-col gap-2">
              {[
                { icon: '🟡', text: 'Mar 11, 09:14 — AltaGas feed delayed · Auto-retry in 47 min' },
                { icon: '✅', text: 'Mar 11, 08:02 — Billing batch completed · 4,821 invoices · 3 exceptions' },
                { icon: '✅', text: 'Mar 10, 23:58 — Nightly GL posting completed · All accounts balanced' },
                { icon: 'ℹ', text: 'Mar 10, 18:30 — Unusual login · Admin account · Resolved' },
              ].map((entry, idx) => (
                <div key={idx} className="flex items-start gap-2.5 rounded-lg border p-3" style={{ background: 'var(--s2)', borderColor: 'var(--border)' }}>
                  <span className="mt-0.5 text-[13px] leading-none">{entry.icon}</span>
                  <span className="text-[12px]" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{entry.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {tab === 'security' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div data-demo="security-auth-card" className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
              <div className="mb-4 text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--label-color)', fontFamily: 'var(--font-mono)' }}>Authentication &amp; Access</div>
              <div className="flex flex-col gap-3">
                <div className="rounded-lg border p-3" style={{ background: 'var(--s2)', borderColor: 'var(--border)' }}>
                  <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>SSO Provider</div>
                  <div className="text-[12px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>Azure AD · Connected · All users enforced</div>
                </div>
                <div className="rounded-lg border p-3" style={{ background: 'var(--s2)', borderColor: 'var(--border)' }}>
                  <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>MFA</div>
                  <div className="text-[12px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>Required · TOTP + SMS backup · 100% adoption</div>
                </div>
                <div className="rounded-lg border p-3" style={{ background: 'var(--s2)', borderColor: 'var(--border)' }}>
                  <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Last Access Review</div>
                  <div className="text-[12px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>March 1, 2026 · 0 anomalies detected</div>
                </div>
              </div>
            </div>

            <div data-demo="security-rto-rpo-card" className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
              <div className="mb-4 text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--label-color)', fontFamily: 'var(--font-mono)' }}>Business Continuity</div>
              <div className="flex flex-col gap-3">
                <div className="rounded-lg border p-3" style={{ background: 'var(--s2)', borderColor: 'var(--border)' }}>
                  <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Backup Schedule</div>
                  <div className="text-[12px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>Automated · Every 6 hours</div>
                </div>
                <div className="rounded-lg border p-3" style={{ background: 'var(--s2)', borderColor: 'var(--border)' }}>
                  <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Last Backup</div>
                  <div className="text-[12px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>March 11, 2026 · 02:00 MST · ✓ Verified</div>
                </div>
                <div className="rounded-lg border p-3" style={{ background: 'var(--s2)', borderColor: 'var(--border)' }}>
                  <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>RTO / RPO</div>
                  <div className="text-[12px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>RTO: &lt; 4 hours · RPO: &lt; 1 hour</div>
                </div>
                <div className="rounded-lg border p-3" style={{ background: 'var(--s2)', borderColor: 'var(--border)' }}>
                  <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Restore Test</div>
                  <div className="text-[12px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>February 2026 · ✓ Passed (3h 12m)</div>
                </div>
              </div>
            </div>
          </div>

          <div data-demo="security-compliance-card" className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
            <div className="mb-4 text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--label-color)', fontFamily: 'var(--font-mono)' }}>Compliance &amp; Certifications</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-3" style={{ background: 'var(--s2)', borderColor: 'var(--border)' }}>
                <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>SOC 2 Type II</div>
                <div className="text-[12px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>In Progress · Expected Q3 2026</div>
              </div>
              <div className="rounded-lg border p-3" style={{ background: 'var(--s2)', borderColor: 'var(--border)' }}>
                <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>NIST CSF</div>
                <div className="text-[12px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>Aligned · Self-assessed · Last review Feb 2026</div>
              </div>
              <div className="rounded-lg border p-3" style={{ background: 'var(--s2)', borderColor: 'var(--border)' }}>
                <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>PIPEDA</div>
                <div className="text-[12px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>Compliant · Data residency: Canada (AWS ca-central-1)</div>
              </div>
              <div className="rounded-lg border p-3" style={{ background: 'var(--s2)', borderColor: 'var(--border)' }}>
                <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Breach Reporting</div>
                <div className="text-[12px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>≤72 hours to OPC per PIPEDA</div>
              </div>
            </div>
          </div>

          <div data-demo="security-sla-table" className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
            <div className="mb-4 text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--label-color)', fontFamily: 'var(--font-mono)' }}>SLA Tiers</div>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Priority', 'Description', 'Response', 'Resolution'].map((h) => (
                    <th key={h} className="pb-2 text-left text-[9px] font-medium tracking-[0.08em] uppercase" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { priority: 'P1 — Critical', desc: 'System down, data loss risk', response: '15 min', resolution: '4 hours' },
                  { priority: 'P2 — High', desc: 'Core module impaired', response: '1 hour', resolution: '8 hours' },
                  { priority: 'P3 — Medium', desc: 'Feature degraded', response: '4 hours', resolution: '2 business days' },
                  { priority: 'P4 — Low', desc: 'Enhancement / question', response: '1 business day', resolution: '5 business days' },
                ].map((row) => (
                  <tr key={row.priority}>
                    <td className="py-2.5 pr-4 text-[12px] font-medium" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)', borderBottom: '1px solid var(--border)' }}>{row.priority}</td>
                    <td className="py-2.5 pr-4 text-[12px]" style={{ color: 'var(--text)', fontFamily: 'var(--font-ui)', borderBottom: '1px solid var(--border)' }}>{row.desc}</td>
                    <td className="py-2.5 pr-4 text-[11px]" style={{ color: 'var(--teal)', fontFamily: 'var(--font-mono)', borderBottom: '1px solid var(--border)' }}>{row.response}</td>
                    <td className="py-2.5 text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', borderBottom: '1px solid var(--border)' }}>{row.resolution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
