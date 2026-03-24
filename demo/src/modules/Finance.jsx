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

const GL_ISSUES = [
  {
    id: 'GLI-001',
    code: 'MISC-EXP',
    label: 'Miscellaneous Expense',
    category: 'Misclassified',
    severity: 'High',
    entries: 12,
    lastActivity: 'Jan 2024',
    balance: '$0.00',
    impact: 'Prevents misstatement in Operating Expense reporting',
    owner: 'Finance Ops',
    recommendation: 'Merge',
    recommendedTarget: '5200 — Operating Expense',
    reasoning: 'Code predates cost-centre structure. All 12 entries map cleanly to Operating Expense with no ambiguity. Safe to merge immediately.',
    transactions: [
      { date: 'Jan 14 2024', amount: '$1,240', description: 'Office supplies — Q4 variance' },
      { date: 'Nov 3 2023', amount: '$880', description: 'Unclassified vendor payment' },
      { date: 'Sep 12 2023', amount: '$2,100', description: 'Miscellaneous operating cost' },
    ],
  },
  {
    id: 'GLI-002',
    code: 'AESO-ADJ',
    label: 'AESO Adjustment',
    category: 'Duplicate',
    severity: 'High',
    entries: 4,
    lastActivity: 'Mar 2025',
    balance: '$1,640.00',
    impact: 'Prevents duplicate settlement posting against Account 2200',
    owner: 'Settlement Team',
    recommendation: 'Merge',
    recommendedTarget: '2200 — AESO Settlement Payable',
    reasoning: 'Duplicate of Account 2200 created during 2023 system migration. Balance of $1,640 matches active AltaGas variance — resolve settlement exception first, then merge.',
    transactions: [
      { date: 'Mar 5 2025', amount: '$1,640', description: 'AltaGas INV-2026-0312 variance' },
      { date: 'Dec 1 2024', amount: '$420', description: 'AESO pool price adjustment' },
      { date: 'Aug 14 2024', amount: '$890', description: 'Settlement correction entry' },
    ],
  },
  {
    id: 'GLI-003',
    code: 'LEG-AP-01',
    label: 'Legacy AP Codes',
    category: 'Orphaned',
    severity: 'Medium',
    entries: 7,
    lastActivity: 'Aug 2022',
    balance: '$0.00',
    impact: 'Eliminates dormant code from AP close workflow',
    owner: 'Finance Ops',
    recommendation: 'Retire',
    recommendedTarget: null,
    reasoning: 'No transactions since August 2022. No active vendor mappings. Zero balance, no dependencies detected. Safe to archive immediately.',
    transactions: [
      { date: 'Aug 22 2022', amount: '$340', description: 'Final legacy vendor payment' },
      { date: 'Jun 3 2022', amount: '$1,200', description: 'AP transition entry' },
      { date: 'Jan 11 2022', amount: '$780', description: 'Legacy system closing entry' },
    ],
  },
  {
    id: 'GLI-004',
    code: 'HEDGE-OLD',
    label: 'Hedge Allocation — Legacy',
    category: 'Inactive with Balance',
    severity: 'Critical',
    entries: 3,
    lastActivity: 'Dec 2023',
    balance: '$42,000.00',
    impact: 'Avoids misstatement risk on hedge reserve balances — Controller sign-off required',
    owner: 'Controller',
    recommendation: 'Investigate',
    recommendedTarget: null,
    reasoning: 'Marked inactive but carries $42,000 balance from Q4 2023 hedge positions. Cannot retire or merge until balance is reclassified or written off. Requires Controller approval and journal entry to resolve.',
    transactions: [
      { date: 'Dec 31 2023', amount: '$42,000', description: 'Q4 hedge position — year-end close' },
      { date: 'Nov 15 2023', amount: '$18,400', description: 'Hedge allocation — industrial book' },
      { date: 'Sep 2 2023', amount: '$23,600', description: 'Hedge contract settlement' },
    ],
  },
];

const GL_GOVERNANCE_RULES = [
  { rule: 'New code creation requires Finance Manager approval', status: 'Enforced' },
  { rule: 'Cost centre justification required at creation', status: 'Enforced' },
  { rule: 'Sunset date mandatory for all project codes', status: 'Enforced' },
];

export default function Finance({ onOpenEmberlyn, showToast }) {
  const [activeTab, setActiveTab] = useState('gl');
  const [apStatus, setApStatus] = useState(
    AP_ROWS.reduce((acc, r, i) => ({ ...acc, [i]: r.status }), {})
  );
  const [selectedIssues, setSelectedIssues] = useState(new Set());
  const [expandedIssue, setExpandedIssue] = useState(null);
  const [executionStatus, setExecutionStatus] = useState(
    GL_ISSUES.reduce((acc, r) => ({ ...acc, [r.id]: 'Pending' }), {})
  );
  const [severityFilter, setSeverityFilter] = useState(null);
  const [journalModalOpen, setJournalModalOpen] = useState(false);
  const [journalPosted, setJournalPosted] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [arStatus, setArStatus] = useState({});
  const [glExportDone, setGlExportDone] = useState(false);

  const healthScore = (() => {
    let score = 58;
    GL_ISSUES.forEach((issue) => {
      const status = executionStatus[issue.id];
      if (status !== 'Applied') return;
      if (issue.recommendation === 'Investigate') {
        score += issue.severity === 'Critical' ? 6 : issue.severity === 'High' ? 4 : 2;
      } else {
        score += issue.severity === 'Critical' ? 12 : issue.severity === 'High' ? 8 : 4;
      }
    });
    return Math.min(score, 100);
  })();

  const fireToast = (msg) => {
    if (typeof showToast === 'function') showToast(msg);
  };

  const tabs = [
    { id: 'gl', label: 'General Ledger' },
    { id: 'ar', label: 'Accounts Receivable' },
    { id: 'ap', label: 'Accounts Payable' },
    { id: 'recon', label: 'Reconciliation' },
    { id: 'gl-remediation', label: 'GL Remediation' },
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
            data-demo={t.id === 'gl' ? 'finance-tab-gl' : t.id === 'ar' ? 'finance-tab-ar' : t.id === 'ap' ? 'finance-tab-ap' : t.id === 'recon' ? 'finance-tab-recon' : 'finance-tab-gl-remediation'}
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
              disabled={glExportDone}
              onClick={() => { setGlExportDone(true); fireToast('GL export complete — 284 transactions · 6 accounts · March 2026.csv'); }}
              className="rounded border px-3 py-1.5 text-[12px] font-medium opacity-80 hover:opacity-100"
              style={{ borderColor: glExportDone ? 'var(--success)' : 'var(--border)', color: glExportDone ? 'var(--success)' : 'var(--text)', fontFamily: 'var(--font-ui)' }}
            >
              {glExportDone ? '✓ Exported' : 'Export GL'}
            </button>
            <button
              type="button"
              data-demo="btn-post-journal"
              onClick={() => setJournalModalOpen(true)}
              className="rounded border px-3 py-1.5 text-[12px] font-medium opacity-80 hover:opacity-100"
              style={{ borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}
            >
              Post Journal Entry
            </button>
            <button
              type="button"
              data-demo="btn-audit-log"
              onClick={() => setAuditModalOpen(true)}
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
        <div>
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
                  <td className="px-4 py-3">
                    {arStatus[i] === 'Escalated' ? (
                      <span className="rounded px-2 py-0.5 text-[11px] font-medium" style={{ background: 'rgba(229,62,62,0.12)', color: 'var(--error)', fontFamily: 'var(--font-ui)' }}>Escalated</span>
                    ) : arStatus[i] === 'Reminded' ? (
                      <span className="rounded px-2 py-0.5 text-[11px] font-medium" style={{ background: 'rgba(39,174,96,0.12)', color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>Reminder Sent</span>
                    ) : (
                      <button
                        type="button"
                        data-demo={i === 2 ? 'btn-send-reminder-ar' : undefined}
                        onClick={() => {
                          setArStatus(s => ({ ...s, [i]: r.action === 'Collections' || r.action === 'Escalate' ? 'Escalated' : 'Reminded' }));
                          fireToast(r.action === 'Collections' || r.action === 'Escalate'
                            ? `${r.customer} escalated to collections — AR aging updated`
                            : `Reminder sent to ${r.customer} — ${r.invoice}`
                          );
                        }}
                        className="rounded px-2 py-1 text-[11px] font-medium"
                        style={{ background: r.action === 'Collections' ? 'rgba(229,62,62,0.12)' : 'var(--s2)', color: r.action === 'Collections' ? 'var(--error)' : 'var(--text)', border: '1px solid var(--border)', fontFamily: 'var(--font-ui)' }}
                      >
                        {r.action}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          <div className="mt-3 rounded-lg px-3 py-2 text-[11px]" style={{ background: 'rgba(22,120,160,0.06)', borderLeft: '3px solid var(--teal)', color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>
            AR balance updates automatically when payments are received — Account 1100 reconciles against RBC banking feed daily. Collections escalations are logged to the audit trail.
          </div>
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

      {activeTab === 'gl-remediation' && (() => {
        const appliedCount = Object.values(executionStatus).filter((s) => s === 'Applied').length;
        const countBySeverity = (sev) => GL_ISSUES.filter((i) => i.severity === sev).length;
        const filterChips = [
          { id: null, label: 'All' },
          { id: 'Critical', label: `🔴 Critical: ${countBySeverity('Critical')}` },
          { id: 'High', label: `🟠 High: ${countBySeverity('High')}` },
          { id: 'Medium', label: `🟡 Medium: ${countBySeverity('Medium')}` },
          { id: 'Applied', label: `✓ Applied: ${appliedCount}` },
        ];
        const visibleIssues = GL_ISSUES.filter((issue) => {
          if (!severityFilter) return true;
          if (severityFilter === 'Applied') return executionStatus[issue.id] === 'Applied';
          return issue.severity === severityFilter;
        });
        const selectedInvestigateCount = GL_ISSUES.filter(
          (i) => selectedIssues.has(i.id) && i.recommendation === 'Investigate'
        ).length;
        const healthColor =
          healthScore >= 85
            ? 'var(--success)'
            : healthScore >= 70
            ? 'var(--teal)'
            : 'var(--warning)';
        const healthBg =
          healthScore >= 85
            ? 'rgba(39,174,96,0.12)'
            : healthScore >= 70
            ? 'rgba(26,188,171,0.12)'
            : 'rgba(243,156,18,0.12)';

        const getCategoryStyle = (cat) => {
          if (cat === 'Orphaned') return { background: 'rgba(255,255,255,0.06)', color: 'var(--muted)' };
          if (cat === 'Duplicate') return { background: 'rgba(243,156,18,0.12)', color: 'var(--warning)' };
          if (cat === 'Misclassified') return { background: 'rgba(59,130,246,0.12)', color: '#3B82F6' };
          if (cat === 'Inactive with Balance') return { background: 'rgba(231,76,60,0.12)', color: 'var(--error)' };
          return {};
        };
        const getSeverityStyle = (sev) => {
          if (sev === 'Critical') return { background: 'rgba(231,76,60,0.12)', color: 'var(--error)' };
          if (sev === 'High') return { background: 'rgba(243,156,18,0.12)', color: 'var(--warning)' };
          if (sev === 'Medium') return { background: 'rgba(212,175,55,0.12)', color: '#D4AF37' };
          return {};
        };

        const applyIssue = (id) => {
          const issue = GL_ISSUES.find((i) => i.id === id);
          setExecutionStatus((s) => ({ ...s, [id]: 'Applied' }));
          setExpandedIssue(null);
          const label = issue.recommendation === 'Investigate' ? 'contained' : issue.recommendation.toLowerCase() + 'd';
          fireToast(`Recommendation applied — ${issue.code} marked as ${label}`);
        };
        const deferIssue = (id) => {
          setExecutionStatus((s) => ({ ...s, [id]: 'Deferred' }));
          setExpandedIssue(null);
        };
        const applyBulk = () => {
          const ids = Array.from(selectedIssues);
          setExecutionStatus((s) => {
            const next = { ...s };
            ids.forEach((id) => { next[id] = 'Applied'; });
            return next;
          });
          setSelectedIssues(new Set());
          const allApplied = GL_ISSUES.every((i) => ids.includes(i.id) || executionStatus[i.id] === 'Applied');
          if (allApplied || ids.length + appliedCount >= GL_ISSUES.length) {
            fireToast(`${ids.length} remediation actions applied · Chart health updated · Target health achieved — 90%`);
          } else {
            fireToast(`${ids.length} remediation actions applied · Chart health updated`);
          }
        };
        const deferBulk = () => {
          const ids = Array.from(selectedIssues);
          setExecutionStatus((s) => {
            const next = { ...s };
            ids.forEach((id) => { next[id] = 'Deferred'; });
            return next;
          });
          setSelectedIssues(new Set());
        };
        const toggleSelect = (id) => {
          setSelectedIssues((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
          });
        };

        const expandedIssueData = GL_ISSUES.find((i) => i.id === expandedIssue);

        return (
          <div className="space-y-4" style={{ fontFamily: 'var(--font-ui)' }}>
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[14px] font-semibold" style={{ color: 'var(--light)' }}>GL Remediation Scan</span>
                <span className="ml-3 text-[12px]" style={{ color: 'var(--muted)' }}>Last run: March 11, 2026</span>
              </div>
              <div
                data-demo="finance-gl-health-score"
                className="rounded-md px-3 py-1.5 text-[13px] font-semibold"
                style={{ background: healthBg, color: healthColor }}
              >
                Chart Health: {healthScore}%
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fireToast('Scan complete — 4 issues detected · Last run updated')}
                  className="rounded border px-3 py-1.5 text-[12px] font-medium opacity-80 hover:opacity-100"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  Run New Scan
                </button>
                <button
                  type="button"
                  onClick={() => fireToast('Report export queued')}
                  className="rounded border px-3 py-1.5 text-[12px] font-medium opacity-80 hover:opacity-100"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  Export Report
                </button>
              </div>
            </div>

            {/* Category summary chips */}
            <div className="flex flex-wrap gap-2">
              {filterChips.map((chip) => (
                <button
                  key={String(chip.id)}
                  type="button"
                  onClick={() => setSeverityFilter(chip.id)}
                  className="rounded-full border px-3 py-1 text-[12px] font-medium transition"
                  style={{
                    borderColor: severityFilter === chip.id ? 'var(--teal)' : 'var(--border)',
                    color: severityFilter === chip.id ? 'var(--teal)' : 'var(--muted)',
                    background: severityFilter === chip.id ? 'rgba(26,188,171,0.08)' : 'transparent',
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Issues table */}
            <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
              <table data-demo="finance-gl-issues-table" className="w-full text-left text-[13px]">
                <thead>
                  <tr style={{ background: 'var(--s2)', color: 'var(--muted)' }}>
                    <th className="px-3 py-2.5 font-medium w-8"></th>
                    <th className="px-3 py-2.5 font-medium">Code</th>
                    <th className="px-3 py-2.5 font-medium">Label</th>
                    <th className="px-3 py-2.5 font-medium">Category</th>
                    <th className="px-3 py-2.5 font-medium">Severity</th>
                    <th className="px-3 py-2.5 font-medium">Entries</th>
                    <th className="px-3 py-2.5 font-medium">Balance</th>
                    <th className="px-3 py-2.5 font-medium">Recommendation</th>
                    <th className="px-3 py-2.5 font-medium">Owner</th>
                    <th className="px-3 py-2.5 font-medium">Status</th>
                    <th className="px-3 py-2.5 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleIssues.map((issue) => {
                    const status = executionStatus[issue.id];
                    const isExpanded = expandedIssue === issue.id;
                    return (
                      <tr
                        key={issue.id}
                        className="border-t cursor-pointer transition-colors hover:bg-white/[0.02]"
                        style={{
                          borderColor: 'var(--border)',
                          borderLeft: isExpanded ? '2px solid var(--teal)' : '2px solid transparent',
                        }}
                        onClick={() => setExpandedIssue(isExpanded ? null : issue.id)}
                      >
                        <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedIssues.has(issue.id)}
                            onChange={() => toggleSelect(issue.id)}
                            className="cursor-pointer"
                          />
                        </td>
                        <td className="px-3 py-2.5 font-mono text-[12px]" style={{ color: 'var(--teal)' }}>{issue.code}</td>
                        <td className="px-3 py-2.5" style={{ color: 'var(--light)' }}>{issue.label}</td>
                        <td className="px-3 py-2.5">
                          <span className="rounded px-2 py-0.5 text-[11px] font-medium" style={getCategoryStyle(issue.category)}>
                            {issue.category}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="rounded px-2 py-0.5 text-[11px] font-medium" style={getSeverityStyle(issue.severity)}>
                            {issue.severity}
                          </span>
                        </td>
                        <td className="px-3 py-2.5" style={{ color: 'var(--text)' }}>{issue.entries}</td>
                        <td className="px-3 py-2.5" style={{ color: issue.balance !== '$0.00' ? 'var(--warning)' : 'var(--muted)' }}>{issue.balance}</td>
                        <td className="px-3 py-2.5" style={{ color: 'var(--text)' }}>{issue.recommendation}</td>
                        <td className="px-3 py-2.5" style={{ color: 'var(--muted)' }}>{issue.owner}</td>
                        <td className="px-3 py-2.5">
                          {status === 'Applied' && <span style={{ color: 'var(--success)' }}>Applied</span>}
                          {status === 'Deferred' && <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Deferred</span>}
                          {status === 'Pending' && <span style={{ color: 'var(--muted)' }}>Pending</span>}
                        </td>
                        <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                          {status === 'Applied' ? (
                            <span className="text-[12px]" style={{ color: 'var(--success)' }}>✓ Applied</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setExpandedIssue(isExpanded ? null : issue.id)}
                              className="rounded border px-2 py-0.5 text-[12px] font-medium opacity-80 hover:opacity-100"
                              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                            >
                              Review →
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bulk action bar */}
            {selectedIssues.size > 0 && (
              <div
                data-demo="finance-gl-bulk-actions"
                className="rounded-lg border px-4 py-3"
                style={{ borderColor: 'var(--teal)', background: 'rgba(26,188,171,0.06)' }}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[13px]" style={{ color: 'var(--text)' }}>
                    {selectedIssues.size} item{selectedIssues.size !== 1 ? 's' : ''} selected
                  </span>
                  <button
                    type="button"
                    onClick={applyBulk}
                    className="rounded-lg px-3 py-1.5 text-[12px] font-medium"
                    style={{ background: 'var(--teal)', color: '#fff' }}
                  >
                    Apply All Recommended Actions
                  </button>
                  <button
                    type="button"
                    onClick={deferBulk}
                    className="rounded border px-3 py-1.5 text-[12px] font-medium opacity-80 hover:opacity-100"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  >
                    Defer Selected
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedIssues(new Set())}
                    className="text-[12px] font-medium opacity-70 hover:opacity-100"
                    style={{ color: 'var(--muted)' }}
                  >
                    Clear Selection
                  </button>
                </div>
                {selectedInvestigateCount > 0 && (
                  <p className="mt-2 text-[12px]" style={{ color: 'var(--warning)' }}>
                    Note: {selectedInvestigateCount} item{selectedInvestigateCount !== 1 ? 's' : ''} flagged for investigation will be marked as contained — financial review still required.
                  </p>
                )}
              </div>
            )}

            {/* Detail panel */}
            {expandedIssueData && (
              <div
                data-demo="finance-gl-detail-panel"
                className="rounded-xl border"
                style={{ borderColor: 'var(--border)', background: 'var(--surface)', borderTop: '2px solid var(--teal)' }}
              >
                <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-[14px] font-semibold" style={{ color: 'var(--teal)' }}>{expandedIssueData.code}</span>
                    <span className="text-[14px] font-semibold" style={{ color: 'var(--light)' }}>{expandedIssueData.label}</span>
                    <span className="rounded px-2 py-0.5 text-[11px] font-medium" style={getCategoryStyle(expandedIssueData.category)}>{expandedIssueData.category}</span>
                    <span className="rounded px-2 py-0.5 text-[11px] font-medium" style={getSeverityStyle(expandedIssueData.severity)}>{expandedIssueData.severity}</span>
                  </div>
                  <button
                    type="button"
                    aria-label="close"
                    onClick={() => setExpandedIssue(null)}
                    className="text-[18px] leading-none opacity-50 hover:opacity-100"
                    style={{ color: 'var(--muted)' }}
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-2">
                  {/* Left: Emberlyn Recommendation */}
                  <div>
                    <div className="mb-3 text-[11px] font-medium tracking-wider uppercase font-mono" style={{ color: 'var(--gold)' }}>
                      Emberlyn Recommendation
                    </div>
                    <div className="text-[16px] font-semibold" style={{ color: 'var(--light)' }}>
                      {expandedIssueData.recommendation === 'Investigate' ? 'Investigate' : expandedIssueData.recommendation}
                    </div>
                    {expandedIssueData.recommendedTarget && (
                      <div className="mt-1 text-[13px]" style={{ color: 'var(--teal)' }}>
                        → {expandedIssueData.recommendedTarget}
                      </div>
                    )}
                    <p className="mt-2 text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {expandedIssueData.reasoning}
                    </p>
                    <p className="mt-3 text-[12px] italic" style={{ color: 'var(--muted)' }}>
                      🛡 {expandedIssueData.impact}
                    </p>
                    <p className="mt-2 text-[12px]" style={{ color: 'var(--muted)' }}>
                      Owner: {expandedIssueData.owner}
                    </p>
                  </div>
                  {/* Right: Recent Transactions */}
                  <div>
                    <div className="mb-3 text-[11px] font-medium tracking-wider uppercase font-mono" style={{ color: 'var(--gold)' }}>
                      Recent Transactions
                    </div>
                    <div className="space-y-3">
                      {expandedIssueData.transactions.map((tx, i) => (
                        <div key={i} className="flex items-start gap-3 text-[13px]">
                          <span className="font-mono text-[12px] shrink-0 pt-0.5" style={{ color: 'var(--muted)' }}>{tx.date}</span>
                          <span className="font-semibold shrink-0" style={{ color: 'var(--light)' }}>{tx.amount}</span>
                          <span style={{ color: 'var(--text)' }}>{tx.description}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                      <span className="text-[13px]" style={{ color: 'var(--muted)' }}>Current Balance: </span>
                      <span
                        className="text-[13px] font-semibold"
                        style={{ color: expandedIssueData.balance !== '$0.00' ? 'var(--error)' : 'var(--muted)' }}
                      >
                        {expandedIssueData.balance}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Decision buttons */}
                <div className="flex gap-3 border-t px-5 py-4" style={{ borderColor: 'var(--border)' }}>
                  <button
                    type="button"
                    onClick={() => applyIssue(expandedIssueData.id)}
                    className="rounded-lg px-4 py-2 text-[13px] font-medium transition"
                    style={{ background: 'var(--teal)', color: '#fff' }}
                  >
                    {expandedIssueData.recommendation === 'Investigate' ? 'Mark as Contained' : 'Apply Recommendation'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deferIssue(expandedIssueData.id)}
                    className="rounded border px-4 py-2 text-[13px] font-medium opacity-80 hover:opacity-100"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  >
                    Defer
                  </button>
                </div>
              </div>
            )}

            {/* Governance panel */}
            <div
              data-demo="finance-gl-governance"
              className="rounded-xl border p-5"
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
            >
              <div className="mb-1 text-[14px] font-semibold" style={{ color: 'var(--light)' }}>Code Creation Governance</div>
              <div className="mb-4 text-[12px]" style={{ color: 'var(--success)' }}>Active — enforced since March 11, 2026</div>
              <div className="space-y-2">
                {GL_GOVERNANCE_RULES.map((gr, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[13px]" style={{ color: 'var(--text)' }}>
                      🔒 {gr.rule}
                    </span>
                    <span
                      className="ml-4 shrink-0 rounded px-2 py-0.5 text-[11px] font-medium"
                      style={{ background: 'rgba(39,174,96,0.12)', color: 'var(--success)' }}
                    >
                      {gr.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

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

      {journalModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-[480px] rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[14px] font-semibold" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>Post Journal Entry</div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>JE-2026-0092 · Auto-generated</div>
              </div>
              <button type="button" onClick={() => setJournalModalOpen(false)} style={{ color: 'var(--muted)' }} className="text-[18px]">×</button>
            </div>
            <div className="mb-4 space-y-2 text-[13px]" style={{ fontFamily: 'var(--font-ui)' }}>
              <div className="flex justify-between py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>
                <span style={{ color: 'var(--muted)' }}>Date</span>
                <span style={{ color: 'var(--text)' }}>March 11, 2026</span>
              </div>
              <div className="flex justify-between py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>
                <span style={{ color: 'var(--muted)' }}>Description</span>
                <span style={{ color: 'var(--text)' }}>Manual adjustment — hedge reserve reclassification</span>
              </div>
            </div>
            <table className="w-full text-[12px] mb-4" style={{ fontFamily: 'var(--font-ui)' }}>
              <thead>
                <tr style={{ color: 'var(--muted)' }}>
                  <th className="text-left pb-2">Account</th>
                  <th className="text-right pb-2">Debit</th>
                  <th className="text-right pb-2">Credit</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ color: 'var(--text)' }}>
                  <td className="py-1.5">3100 — Hedge Risk Reserve</td>
                  <td className="text-right">$42,000</td>
                  <td className="text-right">—</td>
                </tr>
                <tr style={{ color: 'var(--text)' }}>
                  <td className="py-1.5">5200 — Operating Expense</td>
                  <td className="text-right">—</td>
                  <td className="text-right">$42,000</td>
                </tr>
                <tr className="border-t" style={{ borderColor: 'var(--border)', color: 'var(--success)', fontWeight: 600 }}>
                  <td className="pt-2">Total</td>
                  <td className="text-right pt-2">$42,000</td>
                  <td className="text-right pt-2">$42,000</td>
                </tr>
              </tbody>
            </table>
            <div className="mb-4 rounded-lg px-3 py-2 text-[11px]" style={{ background: 'rgba(39,174,96,0.08)', color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>
              ✓ Entry balanced · Audit trail will record: Sarah M. · March 11, 2026 · Session #8821
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                data-demo="btn-confirm-journal"
                onClick={() => {
                  setJournalPosted(true);
                  setJournalModalOpen(false);
                  fireToast('Journal Entry JE-2026-0092 posted — audit trail recorded');
                }}
                className="rounded-lg px-4 py-2 text-[13px] font-semibold"
                style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}
              >
                Post Entry
              </button>
              <button type="button" onClick={() => setJournalModalOpen(false)} className="rounded-lg border px-4 py-2 text-[13px]" style={{ borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {auditModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-[520px] rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[14px] font-semibold" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>Audit Log — Finance Module</div>
              <button type="button" onClick={() => setAuditModalOpen(false)} style={{ color: 'var(--muted)' }} className="text-[18px]">×</button>
            </div>
            <div data-demo="audit-log-entries" className="space-y-3">
              {[
                ...(journalPosted ? [{ action: 'Journal Entry Posted', detail: 'JE-2026-0092 · Hedge reserve reclassification · $42,000', user: 'Sarah M.', time: 'Just now', color: 'var(--success)' }] : []),
                { action: 'AP Payment Approved', detail: 'AltaGas Distribution · $1,120,000 · JE-2026-0091 created', user: 'Sarah M.', time: 'Mar 11, 09:14', color: 'var(--teal)' },
                { action: 'GL Export', detail: 'Full chart of accounts exported · 6 accounts · 284 transactions', user: 'Chris T.', time: 'Mar 11, 08:55', color: 'var(--muted)' },
                { action: 'AP Payment Approved', detail: 'Apex Energy Marketer · $72,680 · JE-2026-0088 created', user: 'Sarah M.', time: 'Mar 11, 08:30', color: 'var(--teal)' },
                { action: 'Month-End Checklist Updated', detail: 'Bank reconciliation marked complete', user: 'Chris T.', time: 'Mar 10, 17:22', color: 'var(--muted)' },
              ].map((entry, i) => (
                <div key={i} className="flex gap-3 rounded-lg border p-3" style={{ background: 'var(--s2)', borderColor: 'var(--border)' }}>
                  <div className="mt-0.5 h-2 w-2 rounded-full flex-shrink-0" style={{ background: entry.color, marginTop: 6 }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-semibold" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{entry.action}</span>
                      <span className="text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{entry.time}</span>
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>{entry.detail}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Posted by {entry.user}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
