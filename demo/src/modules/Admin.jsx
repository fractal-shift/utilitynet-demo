export default function Admin() {
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
    </div>
  );
}
