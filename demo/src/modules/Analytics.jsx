import { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const marketerRanking = [
  { name: 'NRG Direct', value: 841, pct: 100, error: false },
  { name: 'PrairieEnergy', value: 612, pct: 73, error: false },
  { name: 'AltaGas Retail', value: 482, pct: 57, error: true },
  { name: 'GreenPath', value: 389, pct: 46, error: false },
  { name: 'Calgary Energy', value: 220, pct: 26, error: false },
];

export default function Analytics({ onOpenThena, showToast }) {
  const segmentChartRef = useRef(null);
  const chartInstance = useRef(null);
  const [tab, setTab] = useState('overview');
  const [drillOpen, setDrillOpen] = useState(false);
  const [drillAccount, setDrillAccount] = useState(null);
  const [exportDone, setExportDone] = useState(false);
  const [reportStatuses, setReportStatuses] = useState({});
  const [adhocResults, setAdhocResults] = useState(false);

  const drillAccounts = [
    { name: 'NRG Direct', value: 841 },
    { name: 'PrairieEnergy', value: 612 },
    { name: 'AltaGas Retail', value: 482 },
    { name: 'GreenPath', value: 389 },
    { name: 'Calgary Energy', value: 220 },
  ];

  useEffect(() => {
    if (!segmentChartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    const ctx = segmentChartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Residential', 'Industrial'],
        datasets: [{
          data: [1.48, 0.86],
          backgroundColor: ['#D44028', 'rgba(212,64,40,0.5)'],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
      },
    });
    return () => chartInstance.current?.destroy();
  }, []);

  return (
    <div data-demo="analytics-thena-panel" className="min-h-[calc(100vh-56px)] px-0 pb-16 pt-1" style={{ background: '#111210', fontFamily: 'Syne, sans-serif', color: '#C8C4BF' }}>
      <div className="mb-7">
        <div className="mb-1.5 flex items-center gap-3">
          <div className="text-[9px] font-medium tracking-[0.14em] uppercase" style={{ color: '#D44028', fontFamily: 'DM Mono, monospace' }}>◈ Emberlyn Energy · Intelligence Layer</div>
          <div className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[8px] font-medium" style={{ background: 'rgba(212,64,40,0.10)', borderColor: 'rgba(212,64,40,0.28)', color: '#D44028', fontFamily: 'DM Mono, monospace' }}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: '#D44028' }} /> Live · March 2026
          </div>
        </div>
        <h1 className="inline-block font-bold text-[28px]" style={{ color: '#F2F0EC', fontFamily: 'Playfair Display, serif' }}>
          Thena
        </h1>
        <div className="mt-2.5 h-0.5 w-12 rounded-sm" style={{ background: '#D44028' }} />
        <p className="mt-4 text-[10px] font-medium tracking-widest uppercase" style={{ color: 'rgba(200,196,191,0.5)', fontFamily: 'DM Mono, monospace' }}>
          Reporting · Predictive · Prescriptive · Q1 2026
        </p>
        <div className="mt-4 flex gap-2">
          <button type="button" data-demo="btn-analytics-export-gl" disabled={exportDone} onClick={() => { setExportDone(true); showToast?.('GL reconciliation complete — Revenue $2,340,120 matches GL account 4000 · Zero variance · Export ready'); }} className="rounded-lg px-4 py-2 text-[12px] font-semibold" style={{ background: exportDone ? 'rgba(39,174,96,0.2)' : '#D44028', color: exportDone ? '#27AE60' : '#fff' }}>{exportDone ? '✓ Reconciled' : 'Export to GL'}</button>
          <button type="button" data-demo="analytics-tab-overview" onClick={() => setTab('overview')} className={`rounded-lg px-3 py-1.5 text-[11px] ${tab === 'overview' ? 'border-2' : ''}`} style={{ borderColor: tab === 'overview' ? '#D44028' : 'rgba(242,240,236,0.13)', background: tab === 'overview' ? 'rgba(212,64,40,0.15)' : 'transparent', color: '#C8C4BF' }}>Overview</button>
          <button type="button" data-demo="analytics-tab-compliance" onClick={() => setTab('compliance')} className={`rounded-lg px-3 py-1.5 text-[11px] ${tab === 'compliance' ? 'border-2' : ''}`} style={{ borderColor: tab === 'compliance' ? '#D44028' : 'rgba(242,240,236,0.13)', background: tab === 'compliance' ? 'rgba(212,64,40,0.15)' : 'transparent', color: '#C8C4BF' }}>Compliance</button>
          <button type="button" data-demo="analytics-tab-adhoc" onClick={() => setTab('adhoc')} className={`rounded-lg px-3 py-1.5 text-[11px] ${tab === 'adhoc' ? 'border-2' : ''}`} style={{ borderColor: tab === 'adhoc' ? '#D44028' : 'rgba(242,240,236,0.13)', background: tab === 'adhoc' ? 'rgba(212,64,40,0.15)' : 'transparent', color: '#C8C4BF' }}>Ad-hoc</button>
        </div>
      </div>

      {tab === 'overview' && (<>
      {/* Descriptive */}
      <div className="mb-9">
        <div className="mb-4 flex items-center gap-3">
          <div className="text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: '#D44028', fontFamily: 'DM Mono, monospace' }}>↗ Descriptive Analytics</div>
          <div className="h-px flex-1" style={{ background: 'rgba(242,240,236,0.07)' }} />
          <span className="rounded px-2 py-0.5 text-[8px]" style={{ background: '#1c1d19', color: '#C8C4BF', border: '1px solid rgba(242,240,236,0.13)', fontFamily: 'DM Mono, monospace' }}>What happened</span>
        </div>
        <div className="mb-4 grid grid-cols-4 gap-3">
          <div data-demo="analytics-drill-revenue" role="button" tabIndex={0} onClick={() => { setDrillOpen((o) => !o); setDrillAccount(null); }} onKeyDown={(e) => e.key === 'Enter' && setDrillOpen((o) => !o)} className="rounded-xl border p-5 cursor-pointer hover:opacity-90 transition" style={{ background: 'rgba(212,64,40,0.10)', borderColor: 'rgba(212,64,40,0.28)' }}>
            <div className="mb-2 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: '#C8C4BF', fontFamily: 'DM Mono, monospace' }}>Total Revenue — Q1</div>
            <div className="text-[26px] font-bold tracking-tight" style={{ color: '#F2F0EC', fontFamily: 'Syne, sans-serif' }}>$6.82M</div>
            <div className="mt-1 text-[11px] font-semibold" style={{ color: '#27AE60', fontFamily: 'Syne, sans-serif' }}>↑ 8.1% vs Q4 2025</div>
            {drillOpen && (
              <div className="mt-3 pt-3 border-t space-y-1" style={{ borderColor: 'rgba(212,64,40,0.2)' }}>
                <div className="text-[10px] mb-2 uppercase opacity-70" style={{ color: '#C8C4BF', fontFamily: 'DM Mono, monospace' }}>Top 5 contributing accounts</div>
                {drillAccounts.map((a) => {
                  const invoiceData = {
                    'NRG Direct': [
                      { num: 'INV-2026-0124', date: 'Mar 8', amount: '$42,100', status: 'Paid' },
                      { num: 'INV-2026-0118', date: 'Mar 1', amount: '$38,200', status: 'Paid' },
                      { num: 'INV-2026-0109', date: 'Feb 22', amount: '$29,400', status: 'Paid' },
                    ],
                    'PrairieEnergy': [
                      { num: 'INV-2026-0131', date: 'Mar 9', amount: '$31,400', status: 'Paid' },
                      { num: 'INV-2026-0122', date: 'Mar 2', amount: '$28,800', status: 'Paid' },
                      { num: 'INV-2026-0114', date: 'Feb 24', amount: '$22,100', status: 'Overdue' },
                    ],
                    'AltaGas Retail': [
                      { num: 'INV-2026-0138', date: 'Mar 10', amount: '$24,200', status: 'Disputed' },
                      { num: 'INV-2026-0129', date: 'Mar 3', amount: '$21,600', status: 'Paid' },
                      { num: 'INV-2026-0120', date: 'Feb 25', amount: '$18,900', status: 'Paid' },
                    ],
                    'GreenPath': [
                      { num: 'INV-2026-0141', date: 'Mar 10', amount: '$19,800', status: 'Paid' },
                      { num: 'INV-2026-0133', date: 'Mar 4', amount: '$17,200', status: 'Paid' },
                      { num: 'INV-2026-0125', date: 'Feb 26', amount: '$14,600', status: 'Paid' },
                    ],
                    'Calgary Energy': [
                      { num: 'INV-2026-0144', date: 'Mar 11', amount: '$11,400', status: 'Paid' },
                      { num: 'INV-2026-0136', date: 'Mar 5', amount: '$9,800', status: 'Paid' },
                      { num: 'INV-2026-0128', date: 'Feb 27', amount: '$8,200', status: 'Paid' },
                    ],
                  };
                  const isSelected = drillAccount === a.name;
                  return (
                    <div key={a.name}>
                      <button
                        type="button"
                        data-demo="analytics-drill-account"
                        onClick={(e) => { e.stopPropagation(); setDrillAccount(isSelected ? null : a.name); }}
                        className="cursor-pointer hover:opacity-80 py-1.5 px-2 rounded text-[11px] w-full text-left border-none"
                        style={{ color: '#C8C4BF', background: isSelected ? 'rgba(212,64,40,0.15)' : 'transparent', fontFamily: 'inherit' }}
                      >
                        {a.name} — ${a.value}K
                      </button>
                      {isSelected && (
                        <div data-demo="analytics-drill-invoice-list" className="mx-2 mb-1 mt-1 rounded border overflow-hidden" style={{ borderColor: 'rgba(212,64,40,0.2)', background: 'rgba(212,64,40,0.06)' }}>
                          <div className="px-2 pt-2 pb-1 text-[9px] uppercase opacity-70" style={{ color: '#C8C4BF', fontFamily: 'DM Mono, monospace' }}>Recent invoices</div>
                          {(invoiceData[a.name] || []).map((inv) => (
                            <div key={inv.num} className="flex items-center justify-between px-2 py-1.5 border-t" style={{ borderColor: 'rgba(212,64,40,0.15)' }}>
                              <span className="text-[10px]" style={{ color: '#C8C4BF', fontFamily: 'DM Mono, monospace' }}>{inv.num}</span>
                              <span className="text-[10px]" style={{ color: 'rgba(200,196,191,0.6)', fontFamily: 'DM Mono, monospace' }}>{inv.date}</span>
                              <span className="text-[10px] font-medium" style={{ color: '#F2F0EC', fontFamily: 'DM Mono, monospace' }}>{inv.amount}</span>
                              <span className="text-[9px] font-medium" style={{ color: inv.status === 'Paid' ? '#27AE60' : inv.status === 'Disputed' ? '#F39C12' : '#E74C3C', fontFamily: 'DM Mono, monospace' }}>{inv.status}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="rounded-xl border p-5" style={{ background: '#161714', borderColor: 'rgba(242,240,236,0.07)' }}>
            <div className="mb-2 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: '#C8C4BF', fontFamily: 'DM Mono, monospace' }}>Net New Customers</div>
            <div className="text-[26px] font-bold tracking-tight" style={{ color: '#F2F0EC', fontFamily: 'Syne, sans-serif' }}>+842</div>
            <div className="mt-1 text-[11px] font-semibold" style={{ color: '#27AE60', fontFamily: 'Syne, sans-serif' }}>↑ 6.3% this quarter</div>
          </div>
          <div className="rounded-xl border p-5" style={{ background: '#161714', borderColor: 'rgba(242,240,236,0.07)' }}>
            <div className="mb-2 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: '#C8C4BF', fontFamily: 'DM Mono, monospace' }}>Billing Accuracy</div>
            <div className="text-[26px] font-bold tracking-tight" style={{ color: '#F2F0EC', fontFamily: 'Syne, sans-serif' }}>99.9%</div>
            <div className="mt-1 text-[11px] font-semibold" style={{ color: '#27AE60', fontFamily: 'Syne, sans-serif' }}>↑ 0.2% improved</div>
          </div>
          <div className="rounded-xl border p-5" style={{ background: '#161714', borderColor: 'rgba(242,240,236,0.07)' }}>
            <div className="mb-2 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: '#C8C4BF', fontFamily: 'DM Mono, monospace' }}>Churn Rate</div>
            <div className="text-[26px] font-bold tracking-tight" style={{ color: '#F2F0EC', fontFamily: 'Syne, sans-serif' }}>1.4%</div>
            <div className="mt-1 text-[11px] font-semibold" style={{ color: '#27AE60', fontFamily: 'Syne, sans-serif' }}>↓ 0.3% improved</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border p-5" style={{ background: '#161714', borderColor: 'rgba(242,240,236,0.07)' }}>
            <div className="mb-3 text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: '#D44028', fontFamily: 'DM Mono, monospace' }}>Revenue by Segment — Q1 2026</div>
            <div className="h-[180px]">
              <canvas ref={segmentChartRef} />
            </div>
          </div>
          <div className="rounded-xl border p-5" style={{ background: '#161714', borderColor: 'rgba(242,240,236,0.07)' }}>
            <div className="mb-3 text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: '#D44028', fontFamily: 'DM Mono, monospace' }}>Marketer Revenue Ranking</div>
            <div className="flex flex-col gap-3">
              {marketerRanking.map((r) => (
                <div key={r.name} className="flex items-center gap-2">
                  <span className="w-32 flex-shrink-0 text-[12px] font-medium" style={{ color: r.error ? '#E74C3C' : '#F2F0EC', fontFamily: 'Syne, sans-serif' }}>{r.name}{r.error && ' ⚠'}</span>
                  <div className="h-1 flex-1 rounded" style={{ background: '#1c1d19' }}>
                    <div className="h-full rounded" style={{ width: `${r.pct}%`, background: r.error ? '#E74C3C' : '#D44028' }} />
                  </div>
                  <span className="w-11 text-right text-[11px]" style={{ color: r.error ? '#E74C3C' : '#C8C4BF', fontFamily: 'DM Mono, monospace' }}>${r.value}K</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Predictive */}
      <div className="mb-9">
        <div className="mb-4 flex items-center gap-3">
          <div className="text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: '#D44028', fontFamily: 'DM Mono, monospace' }}>◉ Predictive Analytics</div>
          <div className="h-px flex-1" style={{ background: 'rgba(242,240,236,0.07)' }} />
          <span className="rounded px-2 py-0.5 text-[8px]" style={{ background: '#1c1d19', color: '#C8C4BF', border: '1px solid rgba(242,240,236,0.13)', fontFamily: 'DM Mono, monospace' }}>What's likely next</span>
        </div>
        <div className="mb-4 rounded-lg border p-3" style={{ background: 'rgba(212,64,40,0.06)', borderColor: 'rgba(212,64,40,0.15)' }}>
          <span className="mr-2 text-[13px]" style={{ color: '#D44028' }}>◉</span>
          <span className="text-[11px] font-medium" style={{ color: '#C8C4BF', fontFamily: 'Syne, sans-serif' }}>Models trained on 24 months of operational data · Confidence intervals shown · Updated daily 6:00 AM MST</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border p-4" style={{ background: 'rgba(212,64,40,0.10)', borderColor: 'rgba(212,64,40,0.28)' }}>
            <div className="mb-2 text-[8px] font-medium tracking-wider uppercase" style={{ color: '#D44028', fontFamily: 'DM Mono, monospace' }}>Late Payment Risk</div>
            <div className="mb-2 text-[15px] italic leading-snug" style={{ color: '#F2F0EC', fontFamily: 'Playfair Display, serif' }}>17 accounts likely to miss payment in next 14 days</div>
            <div className="mb-2 text-[11px]" style={{ color: '#C8C4BF', fontFamily: 'Syne, sans-serif' }}>Projected exposure: $41,200 CAD</div>
            <div className="mb-1 flex justify-between text-[8px]">
              <span style={{ color: 'rgba(200,196,191,0.5)', fontFamily: 'DM Mono, monospace' }}>Confidence</span>
              <span className="font-bold" style={{ color: '#D44028', fontFamily: 'Syne, sans-serif' }}>82%</span>
            </div>
            <div className="h-1 rounded" style={{ background: '#1c1d19' }}><div className="h-full w-[82%] rounded" style={{ background: '#D44028' }} /></div>
          </div>
          <div className="rounded-xl border p-4" style={{ background: 'rgba(212,64,40,0.10)', borderColor: 'rgba(212,64,40,0.28)' }}>
            <div className="mb-2 text-[8px] font-medium tracking-wider uppercase" style={{ color: '#D44028', fontFamily: 'DM Mono, monospace' }}>Customer Growth Forecast</div>
            <div className="mb-2 text-[15px] italic leading-snug" style={{ color: '#F2F0EC', fontFamily: 'Playfair Display, serif' }}>+310–380 new enrollments projected in April</div>
            <div className="mb-2 text-[11px]" style={{ color: '#C8C4BF', fontFamily: 'Syne, sans-serif' }}>Current pipeline + seasonal trend</div>
            <div className="mb-1 flex justify-between text-[8px]">
              <span style={{ color: 'rgba(200,196,191,0.5)', fontFamily: 'DM Mono, monospace' }}>Confidence</span>
              <span className="font-bold" style={{ color: '#D44028', fontFamily: 'Syne, sans-serif' }}>76%</span>
            </div>
            <div className="h-1 rounded" style={{ background: '#1c1d19' }}><div className="h-full w-[76%] rounded" style={{ background: '#D44028' }} /></div>
          </div>
          <div className="rounded-xl border p-4" style={{ background: 'rgba(212,64,40,0.10)', borderColor: 'rgba(212,64,40,0.28)' }}>
            <div className="mb-2 text-[8px] font-medium tracking-wider uppercase" style={{ color: '#D44028', fontFamily: 'DM Mono, monospace' }}>Churn Risk Signal</div>
            <div className="mb-2 text-[15px] italic leading-snug" style={{ color: '#F2F0EC', fontFamily: 'Playfair Display, serif' }}>42 customers flagged as high churn risk for Q2</div>
            <div className="mb-2 text-[11px]" style={{ color: '#C8C4BF', fontFamily: 'Syne, sans-serif' }}>3+ billing complaints + plan mismatch pattern</div>
            <div className="mb-1 flex justify-between text-[8px]">
              <span style={{ color: 'rgba(200,196,191,0.5)', fontFamily: 'DM Mono, monospace' }}>Confidence</span>
              <span className="font-bold" style={{ color: '#D44028', fontFamily: 'Syne, sans-serif' }}>79%</span>
            </div>
            <div className="h-1 rounded" style={{ background: '#1c1d19' }}><div className="h-full w-[79%] rounded" style={{ background: '#D44028' }} /></div>
          </div>
        </div>
      </div>

      {/* Prescriptive */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: '#D44028', fontFamily: 'DM Mono, monospace' }}>⚡ Prescriptive Actions</div>
          <div className="h-px flex-1" style={{ background: 'rgba(242,240,236,0.07)' }} />
          <span className="rounded px-2 py-0.5 text-[8px]" style={{ background: '#1c1d19', color: '#C8C4BF', border: '1px solid rgba(242,240,236,0.13)', fontFamily: 'DM Mono, monospace' }}>What to do about it</span>
        </div>
        <div className="mb-4 flex items-center justify-between rounded-lg border p-4" style={{ background: 'rgba(212,64,40,0.06)', borderColor: 'rgba(212,64,40,0.15)' }}>
          <div>
            <div className="text-[12px] font-bold" style={{ color: '#F2F0EC', fontFamily: 'Syne, sans-serif' }}>4 actions identified for March 2026</div>
            <div className="text-[11px]" style={{ color: '#C8C4BF', fontFamily: 'Syne, sans-serif' }}>Estimated combined impact if actioned: <strong style={{ color: '#F2F0EC' }}>CAD $182,500</strong></div>
          </div>
          <button
            type="button"
            onClick={() => onOpenThena?.()}
            className="rounded-lg px-3 py-1.5 text-[12px] font-semibold"
            style={{ background: '#D44028', color: '#fff', fontFamily: 'Syne, sans-serif' }}
          >
            ◈ Full 30-Day Plan
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border p-4" style={{ background: 'rgba(212,64,40,0.10)', borderColor: 'rgba(212,64,40,0.28)' }}>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded px-2 py-0.5 text-[8px] font-medium" style={{ background: '#D44028', color: '#fff', fontFamily: 'DM Mono, monospace' }}>Collections</span>
              <span className="text-[9px]" style={{ color: 'rgba(200,196,191,0.5)', fontFamily: 'DM Mono, monospace' }}>~$30,500 at risk</span>
            </div>
            <div className="mb-2 text-[14px] font-bold leading-snug" style={{ color: '#F2F0EC', fontFamily: 'Playfair Display, serif' }}>Outreach to 17 at-risk accounts before March 25</div>
            <div className="mb-3 text-[11px] leading-relaxed" style={{ color: '#C8C4BF', fontFamily: 'Syne, sans-serif' }}>Proactive contact recovers 74% of at-risk payments.</div>
            <button type="button" onClick={() => onOpenThena?.()} className="rounded-lg px-3 py-1.5 text-[11px] font-semibold" style={{ background: '#D44028', color: '#fff', fontFamily: 'Syne, sans-serif' }}>◈ Create Campaign</button>
          </div>
          <div className="rounded-xl border p-4" style={{ background: '#1c1d19', borderColor: 'rgba(242,240,236,0.13)' }}>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded px-2 py-0.5 text-[8px] font-medium" style={{ background: '#D44028', color: '#fff', fontFamily: 'DM Mono, monospace' }}>Marketer Enablement</span>
              <span className="text-[9px]" style={{ color: 'rgba(200,196,191,0.5)', fontFamily: 'DM Mono, monospace' }}>~$68,000 upside</span>
            </div>
            <div className="mb-2 text-[14px] font-bold leading-snug" style={{ color: '#F2F0EC', fontFamily: 'Playfair Display, serif' }}>Enablement calls for 3 marketers with above-average leads</div>
            <div className="mb-3 text-[11px] leading-relaxed" style={{ color: '#C8C4BF', fontFamily: 'Syne, sans-serif' }}>GreenPath, AltaEnergy, SolarEdge. Rate positioning coaching.</div>
            <button type="button" onClick={() => showToast?.('Enablement calls scheduled — GreenPath, AltaEnergy, SolarEdge · Week of Mar 31')} className="rounded-lg border px-3 py-1.5 text-[11px] font-medium" style={{ background: 'transparent', borderColor: 'rgba(242,240,236,0.13)', color: '#C8C4BF', fontFamily: 'Syne, sans-serif' }}>Schedule Calls</button>
          </div>
          <div className="rounded-xl border p-4" style={{ background: '#1c1d19', borderColor: 'rgba(242,240,236,0.13)' }}>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded px-2 py-0.5 text-[8px]" style={{ background: '#1c1d19', color: '#C8C4BF', border: '1px solid rgba(242,240,236,0.13)', fontFamily: 'DM Mono, monospace' }}>Retention</span>
              <span className="text-[9px]" style={{ color: 'rgba(200,196,191,0.5)', fontFamily: 'DM Mono, monospace' }}>$84K LTV at stake</span>
            </div>
            <div className="mb-2 text-[14px] font-bold leading-snug" style={{ color: '#F2F0EC', fontFamily: 'Playfair Display, serif' }}>Plan review for 42 churn-risk customers before Q2</div>
            <button type="button" onClick={() => onOpenThena?.()} className="rounded-lg px-3 py-1.5 text-[11px] font-semibold" style={{ background: '#D44028', color: '#fff', fontFamily: 'Syne, sans-serif' }}>◈ Build List</button>
          </div>
          <div className="rounded-xl border p-4" style={{ background: '#1c1d19', borderColor: 'rgba(242,240,236,0.13)' }}>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded px-2 py-0.5 text-[8px]" style={{ background: '#1c1d19', color: '#C8C4BF', border: '1px solid rgba(242,240,236,0.13)', fontFamily: 'DM Mono, monospace' }}>Hedge Strategy</span>
            </div>
            <div className="mb-2 text-[14px] font-bold leading-snug" style={{ color: '#F2F0EC', fontFamily: 'Playfair Display, serif' }}>Increase industrial hedge coverage before April billing</div>
            <div className="mb-3 text-[11px] leading-relaxed" style={{ color: '#C8C4BF', fontFamily: 'Syne, sans-serif' }}>AESO forward pricing +6.2%. Coverage at 61% — increase to 75%.</div>
            <button type="button" onClick={() => showToast?.('Hedge model opened — current coverage 61% · Target 75% · AESO forward +6.2%')} className="rounded-lg border px-3 py-1.5 text-[11px] font-medium" style={{ background: 'transparent', borderColor: 'rgba(242,240,236,0.13)', color: '#C8C4BF', fontFamily: 'Syne, sans-serif' }}>Review Hedge Model</button>
          </div>
        </div>
      </div>
      </>)}

      {/* Compliance tab */}
      {tab === 'compliance' && (
        <div className="mb-9">
          <div className="mb-4 text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: '#D44028', fontFamily: 'DM Mono, monospace' }}>Compliance Reports</div>
          <div data-demo="compliance-report-table" className="rounded-xl border overflow-hidden" style={{ background: '#161714', borderColor: 'rgba(242,240,236,0.07)' }}>
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr style={{ background: 'rgba(212,64,40,0.1)' }}>
                  <th className="px-4 py-2 font-medium" style={{ color: '#C8C4BF' }}>Report</th>
                  <th className="px-4 py-2 font-medium" style={{ color: '#C8C4BF' }}>Status</th>
                  <th className="px-4 py-2 font-medium" style={{ color: '#C8C4BF' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'AUC', status: 'Complete', date: 'Mar 10' },
                  { name: 'AESO', status: 'Complete', date: 'Mar 9' },
                  { name: 'PIPEDA', status: 'Complete', date: 'Mar 8' },
                  { name: 'AUC Pending', status: 'Pending', date: '—' },
                ].map((r) => {
                  const isGenerated = reportStatuses[r.name] === 'Generated';
                  return (
                    <tr key={r.name} className="border-t" style={{ borderColor: 'rgba(242,240,236,0.07)' }}>
                      <td className="px-4 py-2" style={{ color: '#F2F0EC' }}>{r.name}</td>
                      <td className="px-4 py-2" style={{ color: isGenerated ? '#27AE60' : r.status === 'Complete' ? '#27AE60' : '#F39C12' }}>
                        {isGenerated ? 'Generated' : r.status}
                      </td>
                      <td className="px-4 py-2">
                        {r.status === 'Pending' && !isGenerated && (
                          <button type="button" data-demo="btn-generate-compliance-report" onClick={() => setReportStatuses(s => ({ ...s, [r.name]: 'Generated' }))} className="rounded px-2 py-1 text-[11px] font-medium" style={{ background: '#D44028', color: '#fff' }}>Generate Report</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ad-hoc tab */}
      {tab === 'adhoc' && (
        <div className="mb-9">
          <div className="mb-4 text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: '#D44028', fontFamily: 'DM Mono, monospace' }}>Ad-hoc Report Builder</div>
          <div className="rounded-xl border p-5" style={{ background: '#161714', borderColor: 'rgba(242,240,236,0.07)' }}>
            <div className="flex flex-wrap gap-4 items-end mb-4">
              <div>
                <label className="block text-[10px] mb-1" style={{ color: '#C8C4BF' }}>Report On</label>
                <select className="rounded px-3 py-2 text-[12px] bg-[#1c1d19] border" style={{ borderColor: 'rgba(242,240,236,0.13)', color: '#C8C4BF' }}>
                  <option>Billing</option>
                  <option>Marketers</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] mb-1" style={{ color: '#C8C4BF' }}>Date Range</label>
                <input type="text" defaultValue="Mar 1–31, 2026" className="rounded px-3 py-2 text-[12px] bg-[#1c1d19] border w-36" style={{ borderColor: 'rgba(242,240,236,0.13)', color: '#C8C4BF' }} />
              </div>
              <div>
                <label className="block text-[10px] mb-1" style={{ color: '#C8C4BF' }}>Group By</label>
                <select className="rounded px-3 py-2 text-[12px] bg-[#1c1d19] border" style={{ borderColor: 'rgba(242,240,236,0.13)', color: '#C8C4BF' }}>
                  <option>Marketer</option>
                  <option>Customer</option>
                </select>
              </div>
              <button type="button" data-demo="btn-run-adhoc-report" onClick={() => setAdhocResults(true)} className="rounded-lg px-4 py-2 text-[12px] font-semibold" style={{ background: '#D44028', color: '#fff' }}>Run Report</button>
            </div>
            {adhocResults && (
              <div className="mt-4 rounded-xl border overflow-hidden" style={{ background: '#161714', borderColor: 'rgba(242,240,236,0.07)' }}>
                <div className="px-4 py-2.5 text-[9px] font-medium tracking-wider uppercase" style={{ color: '#D44028', fontFamily: 'DM Mono, monospace' }}>Results — 847 rows · March 2026</div>
                <table className="w-full text-left text-[12px]">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(242,240,236,0.07)', color: 'rgba(200,196,191,0.6)', fontFamily: 'DM Mono, monospace' }}>
                      <th className="px-4 py-2">Marketer</th>
                      <th className="px-4 py-2">Customers</th>
                      <th className="px-4 py-2">Revenue MTD</th>
                      <th className="px-4 py-2">Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'NRG Direct', customers: 284, revenue: '$841,200', variance: '+12.4%' },
                      { name: 'PrairieEnergy', customers: 201, revenue: '$612,400', variance: '+4.1%' },
                      { name: 'AltaGas Retail', customers: 156, revenue: '$482,000', variance: '-8.3%' },
                      { name: 'GreenPath', customers: 124, revenue: '$389,100', variance: '+2.2%' },
                      { name: 'Calgary Energy', customers: 82, revenue: '$220,400', variance: '-14.1%' },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(242,240,236,0.05)', color: '#F2F0EC', fontFamily: 'var(--font-ui)' }}>
                        <td className="px-4 py-2.5">{row.name}</td>
                        <td className="px-4 py-2.5" style={{ fontFamily: 'DM Mono, monospace' }}>{row.customers}</td>
                        <td className="px-4 py-2.5" style={{ fontFamily: 'DM Mono, monospace' }}>{row.revenue}</td>
                        <td className="px-4 py-2.5" style={{ color: row.variance.startsWith('-') ? '#E53E3E' : '#27AE60', fontFamily: 'DM Mono, monospace' }}>{row.variance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-2 text-[10px]" style={{ color: 'rgba(200,196,191,0.5)', fontFamily: 'DM Mono, monospace' }}>847 rows · filtered to top 5 by revenue · export available</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
