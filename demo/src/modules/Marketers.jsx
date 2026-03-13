import { useAppStore } from '../store/AppStore';

export default function Marketers({ onOpenEmberlyn, onOpenOnboardMarketerModal }) {
  const { state } = useAppStore();
  const { marketers } = state;
  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="inline-block font-bold text-[22px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>Energy Marketers</h1>
          <div className="mt-2 h-0.5 w-12 rounded-sm" style={{ background: 'var(--gold)' }} />
          <p className="mt-3.5 text-[13px] font-medium" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Partner directory · Margin management · Performance</p>
        </div>
        <button type="button" onClick={onOpenOnboardMarketerModal ?? (() => onOpenEmberlyn?.())} data-demo="btn-onboard-marketer" className="rounded-lg px-4 py-2 text-[13px] font-semibold" style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}>+ Onboard Marketer</button>
      </div>
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-xl border p-5" style={{ background: 'var(--gold-dim)', borderColor: 'var(--gold-bdr)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Total Partner Revenue — MTD</div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--kpi-color)', fontFamily: 'var(--font-ui)' }}>$2.34M</div>
          <div className="mt-1.5 text-[10px] font-semibold" style={{ color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>↑ 11.2% MoM</div>
        </div>
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Top Marketer</div>
          <div className="text-base font-bold" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>NRG Direct</div>
          <div className="mt-1.5 text-[10px]" style={{ color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>$841K revenue</div>
        </div>
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>New Enrollments MTD</div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>284</div>
          <div className="mt-1.5 text-[10px] font-semibold" style={{ color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>↑ 8.4% vs last month</div>
        </div>
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Onboarding Pipeline</div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>4</div>
          <div className="mt-1.5 text-[10px] font-semibold" style={{ color: 'var(--gold)', fontFamily: 'var(--font-ui)' }}>2 pending approval</div>
        </div>
      </div>
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
        <div className="border-b p-5" style={{ borderColor: 'var(--border)' }}>
          <div className="text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--label-color)', fontFamily: 'var(--font-mono)' }}>Marketer Directory</div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2" style={{ borderColor: 'var(--teal)', background: 'var(--s2)' }}>
              <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Marketer</th>
              <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Customers</th>
              <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Revenue MTD</th>
              <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {marketers.map((m) => (
              <tr key={m.id} className="border-b transition-colors hover:bg-[var(--teal-dim)]" style={{ borderColor: 'var(--border)' }}>
                <td className="px-3 py-2.5">
                  <div className="font-medium text-[12px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{m.name}</div>
                  <div className="text-[10px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{m.id}</div>
                </td>
                <td className="px-3 py-2.5 text-[11px]" style={{ fontFamily: 'var(--font-mono)' }}>{m.customers}</td>
                <td className="px-3 py-2.5 text-[11px]" style={{ fontFamily: 'var(--font-mono)', color: m.status === 'Exception' ? 'var(--error)' : 'var(--success)' }}>{m.revenue}</td>
                <td className="px-3 py-2.5">
                  <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[8px] font-medium" style={{ background: m.status === 'Active' ? 'var(--teal-dim)' : m.status === 'Exception' ? 'rgba(229,62,62,0.10)' : 'var(--gold-dim)', borderColor: m.status === 'Active' ? 'var(--teal-bdr)' : m.status === 'Exception' ? 'rgba(229,62,62,0.30)' : 'var(--gold-bdr)', color: m.status === 'Active' ? 'var(--teal)' : m.status === 'Exception' ? 'var(--error)' : 'var(--gold)', fontFamily: 'var(--font-mono)' }}>{m.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
