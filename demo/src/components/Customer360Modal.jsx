import { useState } from 'react';
import { useAppStore } from '../store/AppStore';

export default function Customer360Modal({ customer, isOpen, onClose, onOpenEmberlyn, showToast }) {
  const { state, actions } = useAppStore();
  const [activeTab, setActiveTab] = useState('overview');
  const liveCustomer = customer ? state.customers.find((item) => item.id === customer.id) || customer : null;
  const appliedCredit = liveCustomer ? state.finance?.customerCredits?.[liveCustomer.id] : null;
  const propagationShown = Boolean(appliedCredit);

  const handleApplyCredit = () => {
    if (!liveCustomer || appliedCredit) return;
    actions.applyCustomerCredit?.({
      customerId: liveCustomer.id,
      customerName: liveCustomer.name,
      invoice: 'INV-2026-14801',
      originalAmount: 8400,
      creditAmount: 6300,
      adjustedAmount: 2100,
      adjustedBalance: '$2,100.00',
      status: 'Credit Applied',
      previousStatus: 'Exception',
      creditMemoId: 'CM-2026-0041',
      source: 'Customer 360',
      syncedAccount: '1100 — Accounts Receivable',
      recentArActivity: {
        customerId: liveCustomer.id,
        customerName: liveCustomer.name,
        message: 'Credit memo CM-2026-0041 synced from Customer 360',
      },
    });
    showToast?.('Credit applied — MacGregor AR reduced by $6,300 and synced to Finance');
  };

  const MOCK_BILLING = [
  { invoice: 'INV-2026-14801', period: 'Feb 2026', usage: '44,200 kWh', amount: '$8,400', status: 'Overdue' },
  { invoice: 'INV-2026-14780', period: 'Jan 2026', usage: '41,800 kWh', amount: '$3,940', status: 'Paid' },
  { invoice: 'INV-2025-14612', period: 'Dec 2025', usage: '51,200 kWh', amount: '$4,820', status: 'Paid' },
  ];

  const cases = (liveCustomer ? state.cases.filter((c) => c.customerId === liveCustomer.id) : []) || [];

  if (!isOpen || !liveCustomer) return null;

  const hasException = liveCustomer.status === 'Exception';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="max-h-[90vh] w-[700px] max-w-[95vw] overflow-y-auto rounded-xl border p-7 shadow-xl" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }} onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="font-bold text-[18px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>Customer 360 — {liveCustomer.name}</div>
            <div className="mt-1 text-[10px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{liveCustomer.id} · {liveCustomer.type} · Active since {liveCustomer.since}</div>
          </div>
          <button type="button" data-demo="customer360-close" onClick={onClose} className="text-xl" style={{ color: 'var(--muted)' }}>×</button>
        </div>

        <div className="mb-5 flex gap-0.5 border-b" style={{ borderColor: 'var(--border)' }}>
          {['overview', 'billing', 'cases'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="border-b-2 px-4 py-2.5 text-[13px] font-semibold capitalize"
              style={{
                borderBottomColor: activeTab === tab ? 'var(--teal)' : 'transparent',
                color: activeTab === tab ? 'var(--teal)' : 'var(--muted)',
                fontFamily: 'var(--font-ui)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="mb-6 grid grid-cols-2 gap-6">
              <div>
                <div className="mb-2 text-[10px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Contact Info</div>
                <div className="space-y-2 text-[13px]" style={{ fontFamily: 'var(--font-ui)' }}>
                  <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Email</span><span className="font-mono text-[11px]" style={{ color: 'var(--light)' }}>{liveCustomer.email}</span></div>
                  <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Phone</span><span style={{ color: 'var(--light)' }}>780-555-0241</span></div>
                  <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Address</span><span style={{ color: 'var(--light)' }}>8820 Industrial Pkwy, Edmonton</span></div>
                  <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Marketer</span><span style={{ color: 'var(--light)' }}>{liveCustomer.marketer}</span></div>
                </div>
              </div>
              <div>
                <div className="mb-2 text-[10px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Account Status</div>
                <div className="space-y-2 text-[13px]" style={{ fontFamily: 'var(--font-ui)' }}>
                  <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Plan</span><span style={{ color: 'var(--light)' }}>{liveCustomer.plan} Rate</span></div>
                  <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Outstanding</span><span style={{ color: liveCustomer.balance !== '$0.00' ? 'var(--error)' : 'var(--success)' }}>{liveCustomer.balance}</span></div>
                  <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Status</span><span style={{ color: 'var(--light)' }}>{liveCustomer.status}</span></div>
                  <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Last Payment</span><span style={{ color: 'var(--light)' }}>Jan 28, 2026</span></div>
                </div>
              </div>
            </div>
            {hasException && (
              <div className="mb-4 rounded-lg border p-4" style={{ background: 'rgba(229,62,62,0.08)', borderColor: 'rgba(229,62,62,0.25)', color: 'var(--error)', fontFamily: 'var(--font-ui)' }}>
                ⚠ BILLING EXCEPTION — Missing meter read March 1-8. Invoice blocked. Estimated: $4,200 at risk.{' '}
                {onOpenEmberlyn && (
                  <button type="button" onClick={() => onOpenEmberlyn('customer-' + liveCustomer.id)} className="ml-2 rounded px-2 py-1 text-[12px] font-semibold" style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}>✦ Emberlyn Assist</button>
                )}
                <button
                  type="button"
                  data-demo="crm-billing-link"
                  disabled={propagationShown}
                  onClick={handleApplyCredit}
                  className="ml-2 rounded px-2 py-1 text-[12px] font-semibold"
                  style={{
                    background: propagationShown ? 'rgba(39,174,96,0.15)' : 'var(--btn-primary-bg)',
                    color: propagationShown ? 'var(--success)' : 'var(--btn-primary-text)',
                  }}
                >
                  {propagationShown ? '✓ Credit Applied' : 'Apply Credit'}
                </button>
              </div>
            )}
            {propagationShown && (
              <div data-demo="crm-propagation-confirmation" className="mb-4 rounded-lg border-l-4 p-4" style={{ background: 'rgba(39,174,96,0.08)', borderLeftColor: 'var(--success)' }}>
                <div className="font-semibold" style={{ color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>✓ Credit applied and synced</div>
                <div className="mt-2 text-[13px]" style={{ color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>
                  Billing: Credit memo {appliedCredit.creditMemoId} created (${appliedCredit.creditAmount.toLocaleString()}.00)<br />
                  Finance: AR updated automatically — account 1100 reduced by ${appliedCredit.creditAmount.toLocaleString()}.00<br />
                  Remaining balance: ${appliedCredit.adjustedAmount.toLocaleString()}.00 outstanding
                </div>
              </div>
            )}
            <div className="flex gap-2">
              {onOpenEmberlyn && (
                <button type="button" onClick={() => onOpenEmberlyn('customer-' + liveCustomer.id.replace(/-/g, ''))} data-demo="customer360-draft-email" className="rounded-lg px-4 py-2 text-[13px] font-semibold" style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}>✦ Draft Customer Email</button>
              )}
              <button type="button" onClick={() => showToast?.('Call logged — activity recorded on MacGregor account')} className="rounded-lg border px-4 py-2 text-[13px] font-medium" style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>📞 Log Call</button>
              <button type="button" onClick={() => showToast?.('Case created — assigned to Customer Service queue')} className="rounded-lg border px-4 py-2 text-[13px] font-medium" style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>⊕ Create Case</button>
              <button type="button" onClick={() => showToast?.('Contract CAL-2026-0478 — Variable Rate · Active since Nov 2023')} className="rounded-lg border px-4 py-2 text-[13px] font-medium" style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>📋 View Contract</button>
            </div>
          </>
        )}

        {activeTab === 'billing' && (
          <>
          {propagationShown && (
            <div data-demo="crm-propagation-confirmation" className="mb-4 rounded-lg border-l-4 p-4" style={{ background: 'rgba(39,174,96,0.08)', borderLeftColor: 'var(--success)' }}>
              <div className="font-semibold" style={{ color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>✓ Credit applied and synced</div>
              <div className="mt-2 text-[13px]" style={{ color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>
                Billing: Credit memo {appliedCredit.creditMemoId} created (${appliedCredit.creditAmount.toLocaleString()}.00)<br />
                Finance: AR updated automatically — account 1100 reduced by ${appliedCredit.creditAmount.toLocaleString()}.00<br />
                Remaining balance: ${appliedCredit.adjustedAmount.toLocaleString()}.00 outstanding
              </div>
            </div>
          )}
          <div className="mb-3">
            <button
              type="button"
              onClick={handleApplyCredit}
              disabled={propagationShown}
              className="rounded-lg px-4 py-2 text-[13px] font-semibold"
              style={{
                background: propagationShown ? 'rgba(39,174,96,0.15)' : 'var(--btn-primary-bg)',
                color: propagationShown ? 'var(--success)' : 'var(--btn-primary-text)',
                fontFamily: 'var(--font-ui)',
              }}
            >
              {propagationShown ? '✓ Credit Applied' : 'Apply Credit'}
            </button>
          </div>
          <div className="overflow-x-auto rounded-xl border" style={{ background: 'var(--s2)', borderColor: 'var(--border)' }}>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2" style={{ borderColor: 'var(--teal)', background: 'var(--s2)' }}>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Invoice</th>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Period</th>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Usage</th>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Amount</th>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_BILLING.map((row) => (
                  <tr key={row.invoice} className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-3 py-2.5 font-mono text-[11px]" style={{ color: 'var(--light)' }}>{row.invoice}</td>
                    <td className="px-3 py-2.5 text-[12px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{row.period}</td>
                    <td className="px-3 py-2.5 font-mono text-[11px]" style={{ color: 'var(--light)' }}>{row.usage}</td>
                    <td className="px-3 py-2.5 font-mono text-[11px]" style={{ color: row.status === 'Overdue' ? 'var(--error)' : 'var(--light)' }}>{row.amount}</td>
                    <td className="px-3 py-2.5">
                      <span className="rounded px-2 py-0.5 text-[8px] font-medium" style={{ background: row.status === 'Paid' ? 'rgba(39,174,96,0.10)' : 'rgba(229,62,62,0.10)', border: '1px solid', borderColor: row.status === 'Paid' ? 'rgba(39,174,96,0.30)' : 'rgba(229,62,62,0.30)', color: row.status === 'Paid' ? 'var(--success)' : 'var(--error)', fontFamily: 'var(--font-mono)' }}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}

        {activeTab === 'cases' && (
          <div className="overflow-x-auto rounded-xl border" style={{ background: 'var(--s2)', borderColor: 'var(--border)' }}>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2" style={{ borderColor: 'var(--teal)', background: 'var(--s2)' }}>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Case ID</th>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Type</th>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Created</th>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {(cases.length ? cases : [{ id: '—', type: 'No open cases', created: '—', status: '—' }]).map((row) => (
                  <tr key={row.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-3 py-2.5 font-mono text-[11px]" style={{ color: 'var(--light)' }}>{row.id}</td>
                    <td className="px-3 py-2.5 text-[12px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{row.type}</td>
                    <td className="px-3 py-2.5 text-[12px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>{row.created}</td>
                    <td className="px-3 py-2.5">
                      <span className="rounded px-2 py-0.5 text-[8px] font-medium" style={{ background: row.status === 'Resolved' ? 'rgba(39,174,96,0.10)' : row.status === 'In Review' ? 'rgba(212,160,23,0.10)' : 'rgba(229,62,62,0.10)', border: '1px solid', borderColor: row.status === 'Resolved' ? 'rgba(39,174,96,0.30)' : row.status === 'In Review' ? 'rgba(212,160,23,0.30)' : 'rgba(229,62,62,0.30)', color: row.status === 'Resolved' ? 'var(--success)' : row.status === 'In Review' ? 'var(--gold)' : 'var(--error)', fontFamily: 'var(--font-mono)' }}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
