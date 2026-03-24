import { useState } from 'react';
import { useAppStore } from '../store/AppStore';

export default function Billing({ onOpenEmberlyn, onOpenBillingBatchModal, onExport, initialTab, showToast }) {
  const { state, actions } = useAppStore();
  const { billingBatches, billingExceptions, finance } = state;
  const [activeTab, setActiveTab] = useState(initialTab ?? 'batches');
  const [postingToGL, setPostingToGL] = useState(false);
  const [correctionApplied, setCorrectionApplied] = useState(false);
  const [reversedInvoices, setReversedInvoices] = useState(new Set());

  const MOCK_INVOICES = [
    { id: 'INV-2026-0342', customer: 'Sunrise Industrial Ltd.', amount: '$42,400', status: 'Dispute Resolved' },
    { id: 'INV-2026-0311', customer: 'Lakeview Homes', amount: '$890', status: 'Paid' },
    { id: 'INV-2026-0298', customer: 'Peak Energy Partners', amount: '$41,070', status: 'Overdue' },
  ];

  const unresolvedCount = billingExceptions.filter((e) => e.status === 'Unresolved').length;
  const currentBatch = billingBatches[0];
  const billingPostedAt = finance?.billingPostedAt;

  const handlePostToGL = () => {
    setPostingToGL(true);
    setTimeout(() => {
      actions.postBillingToGL('Mar 11, 2026');
      actions.addPendingJournalEntry({
        id: 'JE-2026-0089',
        account: '4000 — Energy Revenue',
        description: 'Billing batch posted to General Ledger',
        credit: '$1,841,233',
        status: 'Posted',
        isNew: true,
      });
      showToast?.('✓ Revenue posted to GL — Journal Entry JE-2026-0089 created · Account 4000');
      setPostingToGL(false);
    }, 1500);
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="inline-block font-bold text-[22px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>
            Billing Engine
          </h1>
          <div className="mt-2 h-0.5 w-12 rounded-sm" style={{ background: 'var(--gold)' }} />
          <p className="mt-3.5 text-[13px] font-medium" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>
            Batch runs · Usage import · Invoice management
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onExport} data-demo="btn-export-billing" className="rounded-lg border px-4 py-2 text-[13px] font-medium" style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>⬇ Download Report</button>
          <button type="button" onClick={onOpenBillingBatchModal} data-demo="btn-new-batch" className="rounded-lg px-4 py-2 text-[13px] font-semibold" style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}>⊕ New Billing Batch</button>
        </div>
      </div>

      {unresolvedCount > 0 && currentBatch && (
      <div className="mb-5 rounded-lg border p-4" style={{ background: 'var(--gold-dim)', borderColor: 'var(--gold-bdr)', color: 'var(--gold)', fontFamily: 'var(--font-ui)' }}>
        ⚠ Batch {currentBatch.id} has {unresolvedCount} exception{unresolvedCount !== 1 ? 's' : ''} requiring review before final invoice distribution ·{' '}
        <button type="button" onClick={() => setActiveTab('exceptions')} data-demo="btn-review-now" className="font-semibold underline">Review Now</button>
      </div>
      )}

      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-xl border p-5" style={{ background: 'var(--gold-dim)', borderColor: 'var(--gold-bdr)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Current Batch Total</div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--kpi-color)', fontFamily: 'var(--font-ui)' }}>{currentBatch?.total ?? '$1.84M'}</div>
          <div className="mt-1.5 text-[10px]" style={{ color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>{currentBatch?.invoices ?? 2847} invoices</div>
          <div className="mt-0.5 text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>{currentBatch?.id ?? 'B-2026-0311'}</div>
        </div>
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Exceptions</div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--error)', fontFamily: 'var(--font-ui)' }}>{unresolvedCount}</div>
          <div className="mt-1.5 text-[10px] font-semibold" style={{ color: 'var(--error)', fontFamily: 'var(--font-ui)' }}>↑ 1 from last run</div>
          <div className="mt-0.5 text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>CAD $8,400 at risk</div>
        </div>
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Avg. Invoice Value</div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>$647</div>
          <div className="mt-1.5 text-[10px] font-semibold" style={{ color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>↑ 4.2% MoM</div>
        </div>
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Auto-Payment Rate</div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>74.3%</div>
          <div className="mt-1.5 text-[10px] font-semibold" style={{ color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>↑ 2.1% this period</div>
        </div>
      </div>

      <div className="mb-5 flex gap-0.5 border-b" style={{ borderColor: 'var(--border)' }}>
        {[
          ['batches', 'Billing Batches'],
          ['exceptions', 'Exceptions', { badge: unresolvedCount, badgeColor: 'var(--error)' }],
          ['invoices', 'Invoices'],
          ['rates', 'Rate Configuration'],
        ].map(([id, label, opts]) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            data-demo={id === 'exceptions' ? 'tab-exceptions' : undefined}
            className="flex items-center gap-1 border-b-2 px-4 py-2.5 text-[13px] font-semibold transition-colors"
            style={{
              borderBottomColor: activeTab === id ? 'var(--teal)' : 'transparent',
              color: activeTab === id ? 'var(--teal)' : 'var(--muted)',
              fontFamily: 'var(--font-ui)',
            }}
          >
            {label}
            {opts?.badge && (
              <span className="rounded px-1.5 py-0.5 text-[8px] font-medium" style={{ background: opts.badgeColor, color: '#fff', fontFamily: 'var(--font-mono)' }}>{opts.badge}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'batches' && (
        <div className="overflow-x-auto rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2" style={{ borderColor: 'var(--teal)', background: 'var(--s2)' }}>
                <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Batch ID</th>
                <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Period</th>
                <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Invoices</th>
                <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Exceptions</th>
                <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Status</th>
                <th className="px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {billingBatches.map((batch) => {
                const batchExcCount = batch.id === currentBatch?.id ? unresolvedCount : (batch.exceptions ?? 0);
                return (
                  <tr key={batch.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-3 py-2.5 font-bold text-[11px]" style={{ fontFamily: 'var(--font-mono)' }}>{batch.id}</td>
                    <td className="px-3 py-2.5 text-[12px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{batch.period}</td>
                    <td className="px-3 py-2.5 text-[12px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{batch.invoices}</td>
                    <td className="px-3 py-2.5"><span className="rounded px-2 py-0.5 text-[8px] font-medium" style={{ background: batchExcCount > 0 ? 'var(--error)' : 'var(--s2)', color: batchExcCount > 0 ? '#fff' : 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{batchExcCount || batch.exceptions}</span></td>
                    <td className="px-3 py-2.5"><span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[8px] font-medium" style={{ background: 'var(--gold-dim)', borderColor: 'var(--gold-bdr)', color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>{batch.status}</span></td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-2 items-center">
                      {billingPostedAt ? (
                        <span className="text-[11px]" style={{ color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>✓ Posted to GL — {billingPostedAt}</span>
                      ) : (
                        <button type="button" data-demo="btn-post-billing-to-gl" disabled={postingToGL} onClick={handlePostToGL} className="rounded-lg px-3 py-1.5 text-[12px] font-semibold" style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}>{postingToGL ? 'Posting…' : 'Post Revenue to GL'}</button>
                      )}
                      <button type="button" onClick={() => setActiveTab('exceptions')} className="rounded-lg px-3 py-1.5 text-[12px] font-semibold" style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}>Review</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'exceptions' && (
        <>
          <div className="mb-5 flex items-center gap-3 rounded-xl border p-4" style={{ background: 'rgba(229,62,62,0.04)', borderColor: 'rgba(229,62,62,0.3)' }}>
            <span className="text-2xl">⚠</span>
            <div className="flex-1">
              <div className="font-bold text-sm" style={{ color: 'var(--error)', fontFamily: 'var(--font-ui)' }}>{unresolvedCount} Exception{unresolvedCount !== 1 ? 's' : ''} Blocking Invoice Distribution</div>
              <div className="mt-0.5 text-[12px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Resolve all exceptions before Batch B-2026-0311 can be finalized</div>
            </div>
            <button
              type="button"
              onClick={() => onOpenEmberlyn?.('billing-exceptions')}
              data-demo="btn-ask-emberlyn"
              className="rounded-lg px-4 py-2 text-[13px] font-semibold"
              style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}
            >
              ✦ Ask Emberlyn to Explain
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {billingExceptions.filter((e) => e.status === 'Unresolved').map((exc) => (
              <div
                key={exc.id}
                data-demo={`exc-${exc.id}`}
                className="rounded-xl border p-5"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded px-2 py-0.5 text-[8px] font-medium" style={{ background: 'var(--error)', color: '#fff', fontFamily: 'var(--font-mono)' }}>{exc.id}</span>
                    <span className="rounded px-2 py-0.5 text-[8px]" style={{ background: 'var(--s2)', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{exc.type}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[8px] font-medium" style={{ background: exc.status === 'Resolved' ? 'rgba(39,174,96,0.10)' : 'rgba(229,62,62,0.10)', borderColor: exc.status === 'Resolved' ? 'rgba(39,174,96,0.30)' : 'rgba(229,62,62,0.30)', color: exc.status === 'Resolved' ? 'var(--success)' : 'var(--error)', fontFamily: 'var(--font-mono)' }}>{exc.status}</span>
                </div>
                <div className="mb-1.5 text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Customer: {exc.customer} · {exc.customerId} · {exc.type === 'Meter Data' ? 'Industrial' : 'Residential'}</div>
                <div className="mb-1.5 text-[13px] font-semibold" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{exc.description}</div>
                {exc.impact && (
                  <div className="mb-4 text-[12px]" style={{ color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>Estimated impact: <strong style={{ color: 'var(--error)' }}>CAD {exc.impact}</strong></div>
                )}
                <div className="flex gap-2">
                  <button type="button" onClick={() => actions.resolveBillingException(exc.id)} data-demo={`btn-resolve-${exc.id}`} className="rounded-lg px-3 py-1.5 text-[12px] font-semibold" style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}>✓ Apply Suggested Fix</button>
                  {correctionApplied ? (
                    <span className="rounded-lg px-3 py-1.5 text-[12px] font-semibold" style={{ background: 'rgba(39,174,96,0.15)', color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>✓ Corrected</span>
                  ) : (
                    <button type="button" data-demo="btn-correct-repost" onClick={() => { setCorrectionApplied(true); showToast?.('Correction applied — usage 340% → 82% · Rate recalculated · Posted to GL account 4000'); }} className="rounded-lg px-3 py-1.5 text-[12px] font-semibold" style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}>Correct & Repost</button>
                  )}
                  <button
                    type="button"
                    onClick={() => onOpenEmberlyn?.(exc.id === 'EXC-0311-A' ? 'exc-A' : 'billing-exceptions')}
                    data-demo={`btn-explain-${exc.id}`}
                    className="rounded-lg border px-3 py-1.5 text-[12px] font-medium"
                    style={{ background: 'transparent', borderColor: 'var(--btn-sec-bdr)', color: 'var(--btn-sec-text)', fontFamily: 'var(--font-ui)' }}
                  >
                    ✦ Explain This
                  </button>
                </div>
                {correctionApplied && (
                  <div className="mt-3 rounded-lg px-3 py-2 text-[11px]" style={{ background: 'rgba(39,174,96,0.06)', borderLeft: '3px solid var(--success)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>
                    Usage corrected: <strong style={{ color: 'var(--text)' }}>340% → 82%</strong> · Invoice adjusted: <strong style={{ color: 'var(--text)' }}>$8,400 → $2,100</strong> · Delta: <strong style={{ color: 'var(--success)' }}>-$6,300 posted to GL</strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'invoices' && (
        <div className="overflow-x-auto rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2" style={{ borderColor: 'var(--teal)', background: 'var(--s2)' }}>
                <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase">Customer</th>
                <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase">Invoice #</th>
                <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase">Amount</th>
                <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase">Status</th>
                <th className="px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {MOCK_INVOICES.map((inv) => {
                const isReversed = reversedInvoices.has(inv.id);
                return (
                  <tr key={inv.id} data-invoice-id={inv.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-3 py-2.5 text-[12px]" style={{ color: 'var(--light)' }}>{inv.customer}</td>
                    <td className="px-3 py-2.5 font-mono text-[11px]" style={{ color: 'var(--text)' }}>{inv.id}</td>
                    <td className="px-3 py-2.5 font-mono text-[11px]" style={{ color: 'var(--text)' }}>{inv.amount}</td>
                    <td className="px-3 py-2.5">
                      {isReversed ? (
                        <span className="rounded px-2 py-0.5 text-[8px] font-medium" style={{ background: 'rgba(229,62,62,0.10)', border: '1px solid rgba(229,62,62,0.30)', color: 'var(--error)', fontFamily: 'var(--font-mono)' }}>Reversed</span>
                      ) : (
                        <span className="rounded px-2 py-0.5 text-[8px] font-medium" style={{ background: inv.status === 'Dispute Resolved' ? 'rgba(39,174,96,0.10)' : 'var(--s2)', border: '1px solid', borderColor: inv.status === 'Dispute Resolved' ? 'rgba(39,174,96,0.30)' : 'var(--border)', color: inv.status === 'Dispute Resolved' ? 'var(--success)' : 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{inv.status}</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      {inv.status === 'Dispute Resolved' && <button type="button" data-demo={`btn-rebill-${inv.id}`} onClick={() => showToast?.('Rebill queued — new invoice will generate in next batch run')} className="rounded px-2 py-1 text-[11px] font-semibold mr-1" style={{ background: 'var(--teal)', color: '#fff', fontFamily: 'var(--font-ui)' }}>Rebill</button>}
                      {!isReversed && (
                        <button type="button" data-demo="btn-reverse-invoice" onClick={(e) => { const invoiceId = e.currentTarget.closest('tr')?.getAttribute('data-invoice-id') || 'INV-2026-0342'; setReversedInvoices(s => new Set([...s, invoiceId])); actions.addPendingJournalEntry({ id: 'JE-2026-0090', account: '1100 — Accounts Receivable', description: `Credit memo created for ${invoiceId}`, credit: '$42,400', status: 'Pending Approval', isNew: true }); showToast?.('Credit memo CM-2026-0038 created — $42,400 · Pending Finance approval'); }} className="rounded px-2 py-1 text-[11px]" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>Reverse</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'rates' && (
        <div className="rounded-xl border p-8 text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="text-[13px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Rate configuration coming soon</div>
        </div>
      )}
    </div>
  );
}
