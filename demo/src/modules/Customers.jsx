import { useState } from 'react';
import { useAppStore } from '../store/AppStore';

function StatusPill({ status }) {
  const map = {
    Active: { bg: 'var(--teal-dim)', border: 'var(--teal-bdr)', color: 'var(--teal)' },
    Pending: { bg: 'var(--gold-dim)', border: 'var(--gold-bdr)', color: 'var(--gold)' },
    Exception: { bg: 'rgba(229,62,62,0.10)', border: 'rgba(229,62,62,0.30)', color: 'var(--error)' },
    Enrolled: { bg: 'rgba(39,174,96,0.10)', border: 'rgba(39,174,96,0.30)', color: 'var(--success)' },
  };
  const s = map[status] || map.Active;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[8px] font-medium"
      style={{ background: s.bg, borderColor: s.border, color: s.color, fontFamily: 'var(--font-mono)' }}
    >
      <span className="h-1 w-1 rounded-full" style={{ background: 'currentColor' }} />
      {status}
    </span>
  );
}

export default function Customers({ onOpenEmberlyn, onOpenEnrollmentModal, onOpenCustomer360, onExport }) {
  const { state } = useAppStore();
  const { customers } = state;
  const [activeTab, setActiveTab] = useState('list');
  const [crmPropagationShown, setCrmPropagationShown] = useState(false);

  const handleRowClick = (c) => {
    if (onOpenCustomer360) {
      onOpenCustomer360(c);
    } else if (c.id === 'C-10482') {
      onOpenEmberlyn?.('customer-C10482');
    } else {
      onOpenEmberlyn?.();
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="inline-block font-bold text-[22px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>
            Customers
          </h1>
          <div className="mt-2 h-0.5 w-12 rounded-sm" style={{ background: 'var(--gold)' }} />
          <p className="mt-3.5 text-[13px] font-medium" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>
            Enrollment · CRM · 360° Account View
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onExport} data-demo="btn-export-customers" className="rounded-lg border px-4 py-2 text-[13px] font-medium" style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>⬇ Export</button>
          <button type="button" onClick={onOpenEnrollmentModal} data-demo="btn-new-enrollment" className="rounded-lg px-4 py-2 text-[13px] font-semibold" style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}>+ New Enrollment</button>
        </div>
      </div>

      <div className="mb-5 flex gap-0.5 border-b" style={{ borderColor: 'var(--border)' }}>
        {['All Customers', 'Enrollment Queue', 'Service Cases'].map((t, i) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTab(['list', 'enrollment', 'service'][i])}
            className="border-b-2 px-4 py-2.5 text-[13px] font-semibold transition-colors"
            style={{
              borderBottomColor: activeTab === ['list', 'enrollment', 'service'][i] ? 'var(--teal)' : 'transparent',
              color: activeTab === ['list', 'enrollment', 'service'][i] ? 'var(--teal)' : 'var(--muted)',
              fontFamily: 'var(--font-ui)',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'list' && (
        <>
          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--muted)' }}>🔍</span>
              <input
                type="text"
                placeholder="Search customers, ID, address…"
                className="w-full rounded-lg border py-2 pl-9 pr-4 text-[13px] outline-none focus:border-[var(--teal-bdr)]"
                style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }}
              />
            </div>
            <select className="w-40 rounded-lg border py-2 px-3 text-[13px]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>
              <option>All Types</option>
              <option>Residential</option>
              <option>Industrial</option>
            </select>
          </div>

          <div className="overflow-x-auto rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2" style={{ borderColor: 'var(--teal)', background: 'var(--s2)' }}>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Customer</th>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>ID</th>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Type</th>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Plan</th>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Marketer</th>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Balance</th>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Status</th>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Since</th>
                  <th className="px-3 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr
                    key={c.id}
                    data-demo={`row-${c.id}`}
                    onClick={() => handleRowClick(c)}
                    className="cursor-pointer border-b transition-colors hover:bg-[var(--teal-dim)]"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="px-3 py-2.5">
                      <div className="font-medium text-[12px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{c.name}</div>
                      <div className="text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{c.email}</div>
                    </td>
                    <td className="px-3 py-2.5 text-[11px]" style={{ fontFamily: 'var(--font-mono)' }}>{c.id}</td>
                    <td className="px-3 py-2.5">
                      <span className="rounded px-2 py-0.5 text-[8px]" style={{ background: c.type === 'Industrial' ? 'var(--teal)' : 'var(--s2)', color: c.type === 'Industrial' ? '#fff' : 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{c.type}</span>
                    </td>
                    <td className="px-3 py-2.5 text-[12px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{c.plan}</td>
                    <td className="px-3 py-2.5 text-[12px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{c.marketer}</td>
                    <td className="px-3 py-2.5 text-[11px]" style={{ fontFamily: 'var(--font-mono)', color: c.balance === '$0.00' ? 'var(--success)' : 'var(--error)' }}>{c.balance}</td>
                    <td className="px-3 py-2.5"><StatusPill status={c.status} /></td>
                    <td className="px-3 py-2.5 text-[12px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>{c.since}</td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[12px]" style={{ background: 'var(--s2)', border: '1px solid var(--border)', color: 'var(--text)' }}>›</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </>
      )}

      {activeTab === 'enrollment' && (
        <div className="rounded-xl border p-8 text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="text-[13px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Tab content coming soon</div>
        </div>
      )}

      {activeTab === 'service' && (
        <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="mb-4 text-[13px] font-medium" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Service Cases — adjust and resolve</div>
          <button
            type="button"
            data-demo="crm-billing-link"
            onClick={() => setCrmPropagationShown(true)}
            className="rounded-lg px-4 py-2 text-[13px] font-semibold"
            style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}
          >
            Apply Credit
          </button>
          {crmPropagationShown && (
            <div
              data-demo="crm-propagation-confirmation"
              className="mt-3 rounded-lg border p-3"
              style={{ background: 'var(--teal-dim)', borderColor: 'var(--teal-bdr)' }}
            >
              <div style={{ color: 'var(--teal)', fontWeight: 600, fontSize: 12 }}>
                ✓ Adjustment propagated
              </div>
              <div style={{ color: 'var(--text)', fontSize: 11, marginTop: 4 }}>
                Billing: Credit memo CM-2026-0041 created ($85.00)
              </div>
              <div style={{ color: 'var(--text)', fontSize: 11 }}>
                Finance: AR updated — account 1100 reduced by $85.00
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 11 }}>
                GL entry: JE-2026-0092 pending approval
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
