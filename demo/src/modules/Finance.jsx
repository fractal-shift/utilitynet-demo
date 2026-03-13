export default function Finance() {
  const kpis = [
    { label: 'Cash Position', value: '$1.82M', delta: 'RBC', sub: 'Operating' },
    { label: 'AR Outstanding', value: '$184,200', delta: '↓ 4.2%', sub: 'Aging < 30d' },
    { label: 'AP Due', value: '$1.21M', delta: 'Mar 15', sub: 'Commissions' },
    { label: 'Hedge Reserve', value: '$420K', delta: '61% coverage', sub: 'Industrial' },
  ];
  return (
    <div>
      <div className="mb-6">
        <h1 className="inline-block font-bold text-[22px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>Finance</h1>
        <div className="mt-2 h-0.5 w-12 rounded-sm" style={{ background: 'var(--gold)' }} />
        <p className="mt-3.5 text-[13px] font-medium" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>GL · AR · AP · Reconciliation</p>
      </div>
      <div className="mb-6 grid grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border p-5" style={{ background: k.label === 'Cash Position' ? 'var(--gold-dim)' : 'var(--surface)', borderColor: k.label === 'Cash Position' ? 'var(--gold-bdr)' : 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
            <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{k.label}</div>
            <div className="text-2xl font-bold tracking-tight" style={{ color: k.label === 'Cash Position' ? 'var(--kpi-color)' : 'var(--light)', fontFamily: 'var(--font-ui)' }}>{k.value}</div>
            <div className="mt-1.5 text-[10px]" style={{ color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>{k.delta}</div>
            <div className="mt-0.5 text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border p-8 text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="text-[14px] font-semibold" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>Full finance module available in Phase 2</div>
        <div className="mt-2 text-[12px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>GL, AR, AP, and reconciliation workflows</div>
      </div>
    </div>
  );
}
