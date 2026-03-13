import { useAppStore } from '../store/AppStore';

export default function Settlement({ onOpenEmberlyn, onExport }) {
  const { state, actions } = useAppStore();
  const { settlementData } = state;
  const altaGas = settlementData.find((s) => s.name === 'AltaGas Retail');
  const altaGasResolved = altaGas?.status === 'Reconciled';

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="inline-block font-bold text-[22px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>
            Settlement
          </h1>
          <div className="mt-2 h-0.5 w-12 rounded-sm" style={{ background: 'var(--gold)' }} />
          <p className="mt-3.5 text-[13px] font-medium" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>
            Marketer reconciliation · Distributor invoices · AESO settlement
          </p>
        </div>
        <button type="button" onClick={onExport} className="rounded-lg border px-4 py-2 text-[13px] font-medium" style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>⬇ Export</button>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-xl border p-5" style={{ background: 'var(--gold-dim)', borderColor: 'var(--gold-bdr)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Q1 Settlement Value</div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--kpi-color)', fontFamily: 'var(--font-ui)' }}>$6.82M</div>
          <div className="mt-1.5 text-[10px] font-semibold" style={{ color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>↑ 8.1% vs Q4</div>
        </div>
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Reconciled</div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>49/52</div>
          <div className="mt-1.5 text-[10px] font-semibold" style={{ color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>94.2% complete</div>
        </div>
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Exceptions</div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--error)', fontFamily: 'var(--font-ui)' }}>3</div>
          <div className="mt-1.5 text-[10px] font-semibold" style={{ color: 'var(--error)', fontFamily: 'var(--font-ui)' }}>↑ 1 from last cycle</div>
        </div>
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Days to Close</div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>4</div>
          <div className="mt-1.5 text-[10px] font-semibold" style={{ color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>↓ 2 days improved</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="overflow-x-auto rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="border-b p-5" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
              <div className="text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--label-color)', fontFamily: 'var(--font-mono)' }}>Marketer Settlement Workbench</div>
              <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[8px] font-medium" style={{ background: 'var(--gold-dim)', borderColor: 'var(--gold-bdr)', color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>March 2026 Cycle</span>
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2" style={{ borderColor: 'var(--teal)', background: 'var(--s2)' }}>
                <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Marketer</th>
                <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Customers</th>
                <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Revenue</th>
                <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Status</th>
                <th className="px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {settlementData.map((row) => (
                <tr key={row.name} className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-3 py-2.5 font-medium text-[12px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{row.name}</td>
                  <td className="px-3 py-2.5 text-[11px]" style={{ fontFamily: 'var(--font-mono)' }}>{row.customers}</td>
                  <td className="px-3 py-2.5 text-[11px]" style={{ fontFamily: 'var(--font-mono)', color: row.status === 'Exception' ? 'var(--error)' : 'var(--success)' }}>{row.revenue}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[8px] font-medium"
                      style={{
                        background: row.status === 'Reconciled' ? 'rgba(39,174,96,0.10)' : row.status === 'Exception' ? 'rgba(229,62,62,0.10)' : 'var(--gold-dim)',
                        borderColor: row.status === 'Reconciled' ? 'rgba(39,174,96,0.30)' : row.status === 'Exception' ? 'rgba(229,62,62,0.30)' : 'var(--gold-bdr)',
                        color: row.status === 'Reconciled' ? 'var(--success)' : row.status === 'Exception' ? 'var(--error)' : 'var(--gold)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {row.status === 'Exception' && altaGasResolved ? 'Resolved' : row.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    {row.status === 'Exception' && row.name === 'AltaGas Retail' && (
                      <button
                        type="button"
                        onClick={() => { onOpenEmberlyn?.('settlement-exc'); }}
                        data-demo="btn-resolve-altagas-row"
                        className="rounded-lg px-3 py-1.5 text-[12px] font-semibold"
                        style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}
                      >
                        Resolve
                      </button>
                    )}
                    {row.status === 'Reconciled' && <button className="rounded-lg border px-3 py-1.5 text-[12px] font-medium" style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>View</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4">
          <div
            className="rounded-xl border p-5"
            style={{
              background: altaGasResolved ? 'rgba(39,174,96,0.08)' : 'var(--teal-dim)',
              borderColor: altaGasResolved ? 'rgba(39,174,96,0.25)' : 'var(--teal-bdr)',
            }}
          >
            {altaGasResolved ? (
              <>
                <div className="mb-2 text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>Exception Resolved — AltaGas Retail</div>
                <div className="mb-2 text-sm font-bold" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>Settlement accepted at UTILITYnet figures: $481,600.00</div>
                <div className="mb-4 text-[12px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Commission statement queued for March 15 disbursement. Variance documentation filed.</div>
                <button type="button" className="rounded-lg border px-3 py-1.5 text-[12px] font-medium" style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>⬇ Download Final Statement</button>
              </>
            ) : (
              <>
                <div className="mb-2 text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--label-color)', fontFamily: 'var(--font-mono)' }}>Active Exception — AltaGas Retail</div>
                <div className="mb-3 text-sm font-bold" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>Invoice mismatch: AltaGas INV-2026-0312</div>
                <div className="mb-3 grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>UTILITYNET CALCULATION</div>
                    <div className="text-base font-bold" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>${altaGas?.utilitynetCalc?.toLocaleString()}.00</div>
                  </div>
                  <div>
                    <div className="text-[10px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>ALTAGAS SUBMITTED</div>
                    <div className="text-base font-bold" style={{ color: 'var(--error)', fontFamily: 'var(--font-ui)' }}>${altaGas?.altagasSubmitted?.toLocaleString()}.00</div>
                  </div>
                </div>
                <div className="mb-2 text-[13px] font-semibold" style={{ color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>Variance: <strong style={{ color: 'var(--error)' }}>${altaGas?.variance?.toLocaleString()}.00</strong></div>
                <div className="mb-4 text-[12px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Root cause: 8 site meter reads not reflected in AltaGas submission. AESO data confirms UTILITYnet figures.</div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => actions.resolveSettlement('AltaGas Retail')}
                    data-demo="btn-resolve-altagas"
                    className="rounded-lg px-3 py-1.5 text-[12px] font-semibold"
                    style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}
                  >
                    ✓ Accept Our Figures
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenEmberlyn?.('settlement-exc')}
                    data-demo="btn-draft-altagas"
                    className="rounded-lg border px-3 py-1.5 text-[12px] font-medium"
                    style={{ background: 'transparent', borderColor: 'var(--btn-sec-bdr)', color: 'var(--btn-sec-text)', fontFamily: 'var(--font-ui)' }}
                  >
                    ✦ Draft Response
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
            <div className="mb-3 text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--label-color)', fontFamily: 'var(--font-mono)' }}>Settlement Timeline — March 2026</div>
            {[
              { title: 'AESO settlement data received', sub: 'Mar 5 · All 52 marketer feeds ingested', done: true },
              { title: 'Automated reconciliation run', sub: 'Mar 7 · 49/52 reconciled automatically', done: true },
              { title: 'Manual exception resolution', sub: 'In progress · AltaGas, Calgary Energy, + 1', active: true },
              { title: 'Commission statements issued', sub: 'Target: Mar 15', pending: true },
              { title: 'Final settlement closed', sub: 'Target: Mar 20', pending: true },
            ].map((item, i) => (
              <div key={i} className="flex gap-3.5 pb-4 last:pb-0">
                <div
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 text-[11px]"
                  style={{
                    borderColor: item.done ? 'var(--success)' : item.active ? 'var(--teal)' : 'var(--border)',
                    background: item.done ? 'rgba(39,174,96,0.12)' : item.active ? 'var(--teal-dim)' : 'var(--surface)',
                  }}
                >
                  {item.done ? '✓' : item.active ? '!' : ''}
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="text-[13px] font-semibold" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{item.title}</div>
                  <div className="text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
