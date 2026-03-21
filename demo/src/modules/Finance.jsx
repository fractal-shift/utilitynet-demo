import { useState } from 'react';

const GL_ACCOUNTS = [
  { account: 'Energy Revenue', glCode: '4000', type: 'Revenue', opening: '$0.00', debits: '—', credits: '$2,340,120', closing: '$2,340,120', status: 'Balanced' },
  { account: 'Marketer Commissions Payable', glCode: '2100', type: 'Liability', opening: '$0.00', debits: '$1,208,400', credits: '—', closing: '$(1,208,400)', status: 'Balanced' },
  { account: 'Accounts Receivable', glCode: '1100', type: 'Asset', opening: '$142,800', debits: '$41,400', credits: '$0.00', closing: '$184,200', status: 'In Review' },
  { account: 'AESO Settlement Payable', glCode: '2200', type: 'Liability', opening: '$0.00', debits: '$6,820,000', credits: '—', closing: '$(6,820,000)', status: 'Balanced' },
  { account: 'Operating Cash — RBC', glCode: '1000', type: 'Asset', opening: '$1,240,000', debits: '$580,000', credits: '$0.00', closing: '$1,820,000', status: 'Balanced' },
  { account: 'Hedge Risk Reserve', glCode: '3100', type: 'Equity', opening: '$420,000', debits: '—', credits: '—', closing: '$420,000', status: 'Active' },
];

const AR_ROWS = [
  { customer: 'Sunrise Industrial Ltd.', invoice: 'INV-2026-0342', amount: '$42,400', days: 28, status: 'Current', action: 'Send Reminder' },
  { customer: 'Parkview Residential', invoice: 'INV-2026-0287', amount: '$1,240', days: 45, status: 'Overdue', action: 'Escalate' },
  { customer: 'Northern Oilsands Corp.', invoice: 'INV-2026-0301', amount: '$98,600', days: 62, status: 'Overdue', action: 'Collections' },
  { customer: 'Lakeview Homes', invoice: 'INV-2026-0311', amount: '$890', days: 18, status: 'Current', action: 'Send Reminder' },
  { customer: 'Peak Energy Partners', invoice: 'INV-2026-0298', amount: '$41,070', days: 71, status: '60+ Days', action: 'Collections' },
];

const AP_ROWS = [
  { payee: 'AltaGas Distribution', description: 'Settlement — February', amount: '$1,120,000', due: 'Mar 15', status: 'Pending Approval', action: 'Approve' },
  { payee: 'Apex Energy Marketer', description: 'Commission — February', amount: '$72,680', due: 'Mar 15', status: 'Pending Approval', action: 'Approve' },
  { payee: 'AESO', description: 'Balancing Pool Levy', amount: '$14,200', due: 'Mar 20', status: 'Scheduled', action: 'View' },
  { payee: 'RBC Bank', description: 'Credit Facility Fee', amount: '$4,200', due: 'Mar 30', status: 'Scheduled', action: 'View' },
];

export default function Finance({ onOpenEmberlyn, showToast }) {
  const [activeTab, setActiveTab] = useState('gl');
  const [apStatus, setApStatus] = useState(
    AP_ROWS.reduce((acc, r, i) => ({ ...acc, [i]: r.status }), {})
  );

  const fireToast = (msg) => {
    if (typeof showToast === 'function') showToast(msg);
  };

  const tabs = [
    { id: 'gl', label: 'General Ledger' },
    { id: 'ar', label: 'Accounts Receivable' },
    { id: 'ap', label: 'Accounts Payable' },
    { id: 'recon', label: 'Reconciliation' },
  ];

  const handleApproveAp = (idx) => {
    setApStatus((s) => ({ ...s, [idx]: 'Approved' }));
    fireToast('Payment approved — journal entry created');
  };

  const handleGhostClick = (msg) => {
    fireToast(msg || 'Action completed');
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="inline-block font-bold text-[22px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>
            Finance
          </h1>
          <div className="mt-2 h-0.5 w-12 rounded-sm" style={{ background: 'var(--gold)' }} />
          <p className="mt-3.5 text-[13px] font-medium" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>
            General Ledger · Accounts Receivable · Accounts Payable · Reconciliation
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded border px-3 py-1.5 text-[12px] font-medium" style={{ borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>
            Month-End: March 2026 ▾
          </span>
          <button
            type="button"
            data-demo="btn-emberlyn-finance"
            onClick={() => onOpenEmberlyn('finance')}
            className="rounded-lg px-4 py-2 text-[13px] font-medium transition"
            style={{ background: 'var(--teal)', color: '#fff', fontFamily: 'var(--font-ui)' }}
          >
            ✦ Emberlyn Assist
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-2">
        <div className="rounded-lg border-l-4 px-4 py-2" style={{ borderLeftColor: 'var(--success)', background: 'rgba(39, 174, 96, 0.08)', fontFamily: 'var(--font-ui)' }}>
          <span className="text-[13px] font-medium" style={{ color: 'var(--success)' }}>✓</span>{' '}
          <span className="text-[13px]" style={{ color: 'var(--text)' }}>
            February 2026 month-end reconciliation complete — all 14 GL accounts balanced
          </span>
          <span className="ml-1 text-[12px]" style={{ color: 'var(--muted)' }}>· Completed March 5</span>
        </div>
        <div className="rounded-lg border-l-4 px-4 py-2" style={{ borderLeftColor: 'var(--info)', background: 'rgba(22, 120, 160, 0.08)', fontFamily: 'var(--font-ui)' }}>
          <span className="text-[13px] font-medium" style={{ color: 'var(--info)' }}>ℹ</span>{' '}
          <span className="text-[13px]" style={{ color: 'var(--text)' }}>
            March 2026 month-end target: March 31 · Current status: On track
          </span>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border p-5" style={{ background: 'var(--gold-dim)', borderColor: 'var(--gold-bdr)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Revenue — MTD</div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--gold)', fontFamily: 'var(--font-ui)' }}>$2.34M</div>
          <div className="mt-1.5 text-[10px]" style={{ color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>↑ 12.4% MoM</div>
          <div className="mt-0.5 text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>March 2026</div>
        </div>
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>AR Outstanding</div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--warning)', fontFamily: 'var(--font-ui)' }}>$184,200</div>
          <div className="mt-1.5 text-[10px]" style={{ color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>42 accounts</div>
          <div className="mt-0.5 text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>0–90 day aging</div>
        </div>
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>AP Due This Month</div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>$1.21M</div>
          <div className="mt-1.5 text-[10px]" style={{ color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>Marketer commissions</div>
          <div className="mt-0.5 text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Due Mar 15</div>
        </div>
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Cash Position</div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>$1.82M</div>
          <div className="mt-1.5 text-[10px]" style={{ color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>RBC Operating Account</div>
          <div className="mt-0.5 text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>As of Mar 11</div>
        </div>
      </div>

      <div className="mb-4 flex gap-1 border-b" style={{ borderColor: 'var(--border)' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            data-demo={t.id === 'gl' ? 'finance-tab-gl' : t.id === 'ar' ? 'finance-tab-ar' : t.id === 'ap' ? 'finance-tab-ap' : 'finance-tab-recon'}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className="border-b-2 px-4 py-2.5 text-[13px] font-medium transition"
            style={{
              borderBottomColor: activeTab === t.id ? 'var(--teal)' : 'transparent',
              color: activeTab === t.id ? 'var(--teal)' : 'var(--muted)',
              fontFamily: 'var(--font-ui)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'gl' && (
        <div>
          <div className="mb-3 flex gap-2">
            <button
              type="button"
              data-demo="btn-export-gl"
              onClick={() => handleGhostClick('GL export queued')}
              className="rounded border px-3 py-1.5 text-[12px] font-medium opacity-80 hover:opacity-100"
              style={{ borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}
            >
              Export GL
            </button>
            <button
              type="button"
              data-demo="btn-post-journal"
              onClick={() => handleGhostClick('Journal entry created')}
              className="rounded border px-3 py-1.5 text-[12px] font-medium opacity-80 hover:opacity-100"
              style={{ borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}
            >
              Post Journal Entry
            </button>
            <button
              type="button"
              data-demo="btn-audit-log"
              onClick={() => handleGhostClick('Audit log opened')}
              className="rounded border px-3 py-1.5 text-[12px] font-medium opacity-80 hover:opacity-100"
              style={{ borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}
            >
              View Audit Log
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <table data-demo="finance-gl-table" className="w-full text-left text-[13px]" style={{ fontFamily: 'var(--font-ui)' }}>
              <thead>
                <tr style={{ background: 'var(--s2)', color: 'var(--muted)' }}>
                  <th className="px-4 py-2.5 font-medium">Account</th>
                  <th className="px-4 py-2.5 font-medium">GL Code</th>
                  <th className="px-4 py-2.5 font-medium">Type</th>
                  <th className="px-4 py-2.5 font-medium">Opening</th>
                  <th className="px-4 py-2.5 font-medium">Debits</th>
                  <th className="px-4 py-2.5 font-medium">Credits</th>
                  <th className="px-4 py-2.5 font-medium">Closing</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {GL_ACCOUNTS.map((r, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-2.5" style={{ color: 'var(--light)' }}>{r.account}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--text)' }}>{r.glCode}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--text)' }}>{r.type}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--text)' }}>{r.opening}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--text)' }}>{r.debits}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--text)' }}>{r.credits}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--text)' }}>{r.closing}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--text)' }}>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'ar' && (
        <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <table data-demo="finance-ar-table" className="w-full text-left text-[13px]" style={{ fontFamily: 'var(--font-ui)' }}>
            <thead>
              <tr style={{ background: 'var(--s2)', color: 'var(--muted)' }}>
                <th className="px-4 py-2.5 font-medium">Customer</th>
                <th className="px-4 py-2.5 font-medium">Invoice #</th>
                <th className="px-4 py-2.5 font-medium">Amount</th>
                <th className="px-4 py-2.5 font-medium">Days</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {AR_ROWS.map((r, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-2.5" style={{ color: 'var(--light)' }}>{r.customer}</td>
                  <td className="px-4 py-2.5" style={{ color: 'var(--text)' }}>{r.invoice}</td>
                  <td className="px-4 py-2.5" style={{ color: 'var(--text)' }}>{r.amount}</td>
                  <td className="px-4 py-2.5" style={{ color: 'var(--text)' }}>{r.days}</td>
                  <td className="px-4 py-2.5" style={{ color: 'var(--text)' }}>{r.status}</td>
                  <td className="px-4 py-2.5">
                    <button type="button" className="text-[12px] font-medium" style={{ color: 'var(--teal)' }}>{r.action}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'ap' && (
        <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <table data-demo="finance-ap-table" className="w-full text-left text-[13px]" style={{ fontFamily: 'var(--font-ui)' }}>
            <thead>
              <tr style={{ background: 'var(--s2)', color: 'var(--muted)' }}>
                <th className="px-4 py-2.5 font-medium">Payee</th>
                <th className="px-4 py-2.5 font-medium">Description</th>
                <th className="px-4 py-2.5 font-medium">Amount</th>
                <th className="px-4 py-2.5 font-medium">Due Date</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {AP_ROWS.map((r, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-2.5" style={{ color: 'var(--light)' }}>{r.payee}</td>
                  <td className="px-4 py-2.5" style={{ color: 'var(--text)' }}>{r.description}</td>
                  <td className="px-4 py-2.5" style={{ color: 'var(--text)' }}>{r.amount}</td>
                  <td className="px-4 py-2.5" style={{ color: 'var(--text)' }}>{r.due}</td>
                  <td className="px-4 py-2.5" style={{ color: 'var(--text)' }}>{apStatus[i] || r.status}</td>
                  <td className="px-4 py-2.5">
                    {r.action === 'Approve' && apStatus[i] !== 'Approved' ? (
                      <button
                        type="button"
                        data-demo="btn-approve-ap"
                        onClick={() => handleApproveAp(i)}
                        className="text-[12px] font-medium"
                        style={{ color: 'var(--teal)' }}
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="text-[12px]" style={{ color: apStatus[i] === 'Approved' ? 'var(--success)' : 'var(--muted)' }}>
                        {apStatus[i] === 'Approved' ? 'Approved' : r.action}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'recon' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div data-demo="finance-bank-recon" className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', fontFamily: 'var(--font-ui)' }}>
            <h3 className="mb-4 text-[14px] font-semibold" style={{ color: 'var(--light)' }}>Bank Reconciliation</h3>
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>RBC Statement Balance</span><span style={{ color: 'var(--text)' }}>$1,820,000</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Outstanding Deposits</span><span style={{ color: 'var(--success)' }}>+$42,400</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Outstanding Cheques</span><span style={{ color: 'var(--error)' }}>-$8,200</span></div>
              <div className="mt-3 flex justify-between border-t pt-2" style={{ borderColor: 'var(--border)' }}>
                <span className="font-semibold" style={{ color: 'var(--light)' }}>Adjusted Bank Balance</span>
                <span className="font-semibold" style={{ color: 'var(--text)' }}>$1,854,200</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold" style={{ color: 'var(--light)' }}>GL Cash Balance</span>
                <span className="font-semibold" style={{ color: 'var(--text)' }}>$1,854,200</span>
              </div>
            </div>
            <div className="mt-4 rounded border-l-4 px-3 py-2" style={{ borderLeftColor: 'var(--success)', background: 'rgba(39, 174, 96, 0.08)' }}>
              <span className="text-[13px] font-medium" style={{ color: 'var(--success)' }}>✓</span>{' '}
              <span className="text-[13px]" style={{ color: 'var(--text)' }}>Bank reconciliation balanced — no variance</span>
            </div>
          </div>
          <div data-demo="finance-month-end-checklist" className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', fontFamily: 'var(--font-ui)' }}>
            <h3 className="mb-4 text-[14px] font-semibold" style={{ color: 'var(--light)' }}>Month-End Checklist</h3>
            <div className="space-y-3 text-[13px]">
              <div><span className="text-[14px]" style={{ color: 'var(--success)' }}>✓</span> Revenue recognition complete — $2.34M recognized</div>
              <div><span className="text-[14px]" style={{ color: 'var(--success)' }}>✓</span> Bank reconciliation done — RBC operating account balanced</div>
              <div><span className="text-[14px]" style={{ color: 'var(--warning)' }}>⚠</span> AP approvals pending — $72,680 in commissions awaiting approval</div>
              <div><span className="text-[14px]" style={{ color: 'var(--muted)' }}>○</span> AESO settlement final — Target: March 20 · 3 exceptions pending</div>
              <div><span className="text-[14px]" style={{ color: 'var(--muted)' }}>○</span> Financial statements to CFO — Target: March 31</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
