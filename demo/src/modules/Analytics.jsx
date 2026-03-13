import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const marketerRanking = [
  { name: 'NRG Direct', value: 841, pct: 100, error: false },
  { name: 'PrairieEnergy', value: 612, pct: 73, error: false },
  { name: 'AltaGas Retail', value: 482, pct: 57, error: true },
  { name: 'GreenPath', value: 389, pct: 46, error: false },
  { name: 'Calgary Energy', value: 220, pct: 26, error: false },
];

export default function Analytics({ onOpenThena }) {
  const segmentChartRef = useRef(null);
  const chartInstance = useRef(null);

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
    <div className="min-h-[calc(100vh-56px)] px-0 pb-16 pt-1" style={{ background: '#111210', fontFamily: 'Syne, sans-serif', color: '#C8C4BF' }}>
      <div className="mb-7">
        <div className="mb-1.5 flex items-center gap-3">
          <div className="text-[9px] font-medium tracking-[0.14em] uppercase" style={{ color: '#D44028', fontFamily: 'DM Mono, monospace' }}>◈ Fractal Forge · Intelligence Layer</div>
          <div className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[8px] font-medium" style={{ background: 'rgba(212,64,40,0.10)', borderColor: 'rgba(212,64,40,0.28)', color: '#D44028', fontFamily: 'DM Mono, monospace' }}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: '#D44028' }} /> Live · March 2026
          </div>
        </div>
        <h1 className="inline-block font-bold text-[28px]" style={{ color: '#F2F0EC', fontFamily: 'Playfair Display, serif' }}>
          Thena
        </h1>
        <div className="mt-2.5 h-0.5 w-12 rounded-sm" style={{ background: '#D44028' }} />
        <p className="mt-4 text-[10px] font-medium tracking-widest uppercase" style={{ color: 'rgba(200,196,191,0.5)', fontFamily: 'DM Mono, monospace' }}>
          Reporting · Predictive · Prescriptive · UTILITYnet Q1 2026
        </p>
      </div>

      {/* Descriptive */}
      <div className="mb-9">
        <div className="mb-4 flex items-center gap-3">
          <div className="text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: '#D44028', fontFamily: 'DM Mono, monospace' }}>↗ Descriptive Analytics</div>
          <div className="h-px flex-1" style={{ background: 'rgba(242,240,236,0.07)' }} />
          <span className="rounded px-2 py-0.5 text-[8px]" style={{ background: '#1c1d19', color: '#C8C4BF', border: '1px solid rgba(242,240,236,0.13)', fontFamily: 'DM Mono, monospace' }}>What happened</span>
        </div>
        <div className="mb-4 grid grid-cols-4 gap-3">
          <div className="rounded-xl border p-5" style={{ background: 'rgba(212,64,40,0.10)', borderColor: 'rgba(212,64,40,0.28)' }}>
            <div className="mb-2 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: '#C8C4BF', fontFamily: 'DM Mono, monospace' }}>Total Revenue — Q1</div>
            <div className="text-[26px] font-bold tracking-tight" style={{ color: '#F2F0EC', fontFamily: 'Syne, sans-serif' }}>$6.82M</div>
            <div className="mt-1 text-[11px] font-semibold" style={{ color: '#27AE60', fontFamily: 'Syne, sans-serif' }}>↑ 8.1% vs Q4 2025</div>
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
            <button type="button" className="rounded-lg border px-3 py-1.5 text-[11px] font-medium" style={{ background: 'transparent', borderColor: 'rgba(242,240,236,0.13)', color: '#C8C4BF', fontFamily: 'Syne, sans-serif' }}>Schedule Calls</button>
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
            <button type="button" className="rounded-lg border px-3 py-1.5 text-[11px] font-medium" style={{ background: 'transparent', borderColor: 'rgba(242,240,236,0.13)', color: '#C8C4BF', fontFamily: 'Syne, sans-serif' }}>Review Hedge Model</button>
          </div>
        </div>
      </div>
    </div>
  );
}
