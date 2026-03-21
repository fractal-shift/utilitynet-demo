import { useState, useEffect } from 'react';
import { fetchWatchdogFeeds } from '../services/integrations';

export default function Admin() {
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
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="inline-block font-bold text-[22px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>Admin</h1>
        <div className="mt-2 h-0.5 w-12 rounded-sm" style={{ background: 'var(--gold)' }} />
        <p className="mt-3.5 text-[13px] font-medium" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Integrations · Permissions · Audit Log</p>
      </div>
      <div className="mb-4 flex gap-2">
        <button type="button" onClick={() => setTab('integrations')} className={`rounded-lg px-3 py-1.5 text-[12px] font-medium ${tab === 'integrations' ? '' : 'opacity-70'}`} style={{ background: tab === 'integrations' ? 'var(--teal-dim)' : 'var(--s2)', borderColor: tab === 'integrations' ? 'var(--teal)' : 'var(--border)', border: '1px solid', color: 'var(--text)' }}>Integrations</button>
        <button type="button" onClick={() => setTab('system-health')} className={`rounded-lg px-3 py-1.5 text-[12px] font-medium ${tab === 'system-health' ? '' : 'opacity-70'}`} style={{ background: tab === 'system-health' ? 'var(--teal-dim)' : 'var(--s2)', borderColor: tab === 'system-health' ? 'var(--teal)' : 'var(--border)', border: '1px solid', color: 'var(--text)' }}>System Health</button>
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
      {tab === 'system-health' && (
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-4 text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--label-color)', fontFamily: 'var(--font-mono)' }}>Feed Health (updates with ScenarioPanel)</div>
          <div data-demo="watchdog-feed-health" className="flex flex-col gap-2">
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
        </div>
      )}
    </div>
  );
}
