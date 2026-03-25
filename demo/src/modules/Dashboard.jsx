import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { kpiData, marketerPerf } from '../data/demoData';
import { useAppStore } from '../store/AppStore';

Chart.register(...registerables);

const ACTUAL_DATA = [1.42, 1.31, 1.28, 1.24, 1.19, 1.38, 1.67, 1.94, 2.18, 2.31, 2.28, 2.34];
const CHART_LABELS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr*', 'May*', 'Jun*'];

export default function Dashboard({ onOpenEmberlyn, onNavigate, onExport }) {
  const { state, actions } = useAppStore();
  const { timelineItems, customers } = state;
  const revenueChartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!revenueChartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    const ctx = revenueChartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: CHART_LABELS,
        datasets: [
          {
            label: 'Actual',
            data: [...ACTUAL_DATA, null, null, null],
            borderColor: '#4BAED4',
            backgroundColor: 'rgba(75,174,212,0.12)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            spanGaps: false,
          },
          {
            label: 'Forecast',
            data: [null, null, null, null, null, null, null, null, null, null, null, 2.34, 2.21, 2.08, 2.14],
            borderColor: 'rgba(232,149,42,0.8)',
            borderDash: [6, 3],
            borderWidth: 1.5,
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 3,
            tension: 0.4,
            spanGaps: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { display: false },
          x: {
            border: { display: false },
            grid: { display: false },
            ticks: {
              color: 'rgba(255,255,255,0.35)',
              font: { size: 9 },
            },
          },
        },
      },
    });
    return () => chartInstance.current?.destroy();
  }, []);

  const miniKpis = [
    { label: 'Q2 Forecast', value: '$7.4M', sub: 'Emberlyn forecast ±4%' },
    { label: 'Customers', value: kpiData.dashboard.customers, sub: kpiData.dashboard.customersDelta },
    { label: 'Marketers', value: kpiData.dashboard.marketers, sub: kpiData.dashboard.marketersDelta },
    { label: 'Settlement', value: kpiData.dashboard.settlement, sub: kpiData.dashboard.settlementDelta },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="inline-block font-bold text-[22px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>
            Operations Dashboard
          </h1>
          <div className="mt-2 h-0.5 w-12 rounded-sm" style={{ background: 'var(--gold)' }} />
          <p className="mt-3.5 text-[13px] font-medium" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>
            Wednesday, March 11, 2026 · Q1 Billing Cycle Active
          </p>
        </div>
        <button
          type="button"
          onClick={onExport}
          data-demo="btn-export-dashboard"
          className="rounded-lg border px-4 py-2 text-[13px] font-medium"
          style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}
        >
          ⬇ Export
        </button>
      </div>

      {/* SECTION 1 — Dark KPI header + forecast chart */}
      <div
        className="mb-6 rounded-xl"
        style={{ background: '#0d2235', borderRadius: 12, padding: '20px 24px' }}
        data-demo="dashboard-revenue-chart"
      >
        {/* KPI row */}
        <div className="flex items-start gap-8" data-demo="dashboard-kpis">
          {/* Main revenue KPI */}
          <div className="flex-shrink-0" style={{ minWidth: 180 }}>
            <div
              className="mb-1 tracking-wider uppercase"
              style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}
            >
              Total Revenue — March 2026
            </div>
            <div
              className="font-bold leading-none"
              style={{ fontSize: 32, color: '#ffffff', fontFamily: 'var(--font-ui)' }}
            >
              {kpiData.dashboard.revenue}
            </div>
            <div
              className="mt-1.5"
              style={{ fontSize: 12, color: '#4BAED4', fontFamily: 'var(--font-ui)', fontWeight: 500 }}
            >
              {kpiData.dashboard.revenueDelta}
            </div>
          </div>

          {/* Divider */}
          <div className="self-stretch w-px flex-shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }} />

          {/* 4 mini KPIs */}
          <div className="flex flex-1 gap-6">
            {miniKpis.map((kpi) => (
              <div key={kpi.label} className="flex-1">
                <div
                  className="mb-0.5 tracking-wider uppercase"
                  style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}
                >
                  {kpi.label}
                </div>
                <div
                  className="font-bold"
                  style={{ fontSize: 18, color: '#ffffff', fontFamily: 'var(--font-ui)' }}
                >
                  {kpi.value}
                </div>
                <div
                  style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-ui)' }}
                >
                  {kpi.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart legend */}
        <div className="mt-5 mb-2 flex items-center gap-4" style={{ fontFamily: 'var(--font-ui)' }}>
          <div className="flex items-center gap-1.5">
            <div style={{ width: 20, height: 2, background: '#4BAED4', borderRadius: 1 }} />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div style={{ width: 20, height: 2, background: '#E8952A', borderRadius: 1, borderTop: '2px dashed #E8952A' }} />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>Forecast</span>
          </div>
        </div>

        {/* Revenue chart */}
        <div style={{ height: 100 }}>
          <canvas ref={revenueChartRef} />
        </div>
      </div>

      {/* SECTION 2 — Emberlyn signal feed */}
      <div
        className="mb-6 rounded-xl border"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}
        data-demo="dashboard-system-alerts"
      >
        <div className="px-5 pt-5 pb-3">
          <div className="text-[13px] font-semibold" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>
            ✦ Emberlyn — what needs your attention today
          </div>
        </div>

        {/* Signal row 1 — amber */}
        <div
          className="mx-5 mb-3 flex items-center gap-4 rounded-lg px-4 py-3"
          style={{ background: 'var(--gold-dim)', borderLeft: '2px solid #E8952A' }}
          data-demo="dashboard-late-payment-card"
        >
          <div className="flex-1 min-w-0">
            <div className="mb-0.5" style={{ fontSize: 9, color: '#E8952A', fontFamily: 'var(--font-mono)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ⚡ 14-day payment risk
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>
              17 accounts likely to miss payment — $41,200 exposure
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-ui)', marginTop: 2 }}>
              82% confidence · billing history + 3 data sources
            </div>
          </div>
          <button
            type="button"
            data-demo="dashboard-late-payment-review"
            onClick={() => onOpenEmberlyn?.()}
            style={{ flexShrink: 0, fontSize: 12, color: '#E8952A', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 500, whiteSpace: 'nowrap' }}
          >
            Draft outreach →
          </button>
        </div>

        {/* Signal row 2 — teal */}
        <div
          className="mx-5 mb-3 flex items-center gap-4 rounded-lg px-4 py-3"
          style={{ background: 'var(--teal-dim)', borderLeft: '2px solid var(--teal)' }}
        >
          <div className="flex-1 min-w-0">
            <div className="mb-0.5" style={{ fontSize: 9, color: 'var(--teal)', fontFamily: 'var(--font-mono)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ↑ Growth opportunity
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>
              3 marketers converting leads but below retention benchmark
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-ui)', marginTop: 2 }}>
              GreenPath, Calgary Energy, AltaEnergy · $68K annualized uplift
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenEmberlyn?.()}
            style={{ flexShrink: 0, fontSize: 12, color: 'var(--teal)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 500, whiteSpace: 'nowrap' }}
          >
            Review →
          </button>
        </div>

        {/* Signal row 3 — blue */}
        <div
          className="mx-5 mb-5 flex items-center gap-4 rounded-lg px-4 py-3"
          style={{ background: 'rgba(75,174,212,0.08)', borderLeft: '2px solid #4BAED4' }}
        >
          <div className="flex-1 min-w-0">
            <div className="mb-0.5" style={{ fontSize: 9, color: '#4BAED4', fontFamily: 'var(--font-mono)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ◈ AESO forward signal
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>
              Pool price up 6.2% — unhedged industrial exposure growing
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-ui)', marginTop: 2 }}>
              Recommend: increase hedge coverage 61% → 75% before April billing
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.('analytics')}
            style={{ flexShrink: 0, fontSize: 12, color: '#4BAED4', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 500, whiteSpace: 'nowrap' }}
          >
            See analysis →
          </button>
        </div>
      </div>

      {/* SECTION 3 — Bottom rows (unchanged) */}

      {/* Row 1: System Alerts + Your Tasks Today */}
      <div className="mb-6 grid grid-cols-2 gap-5">
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-3 text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--label-color)', fontFamily: 'var(--font-mono)' }}>System Alerts</div>
          <div className="rounded-lg border p-3 mb-3" style={{ background: 'var(--gold-dim)', borderColor: 'var(--gold-bdr)', color: 'var(--gold)', fontFamily: 'var(--font-ui)' }}>⚠ 3 billing exceptions require manual review — Batch B-2026-0311</div>
          <div className="rounded-lg border p-3 mb-3" style={{ background: 'var(--teal-dim)', borderColor: 'var(--teal-bdr)', color: 'var(--teal)', fontFamily: 'var(--font-ui)' }}>ℹ AESO data feed updated — March settlement inputs received</div>
          <div className="rounded-lg border p-3" style={{ background: 'rgba(39,174,96,0.08)', borderColor: 'rgba(39,174,96,0.25)', color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>✓ February month-end reconciliation complete</div>
        </div>
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }} data-demo="dashboard-tasks">
          <div className="mb-3 text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--label-color)', fontFamily: 'var(--font-mono)' }}>Your Tasks Today</div>
          <div className="flex flex-col gap-0">
            {timelineItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3.5 pb-4 last:pb-0">
                <div
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 text-[11px] mt-0.5"
                  style={{
                    borderColor: item.done ? 'var(--success)' : item.active ? 'var(--teal)' : 'var(--border)',
                    background: item.done ? 'rgba(39,174,96,0.12)' : item.active ? 'var(--teal-dim)' : 'var(--surface)',
                  }}
                >
                  {item.done ? '✓' : item.active ? '!' : ''}
                </div>
                <div className="flex-1 pt-0.5 min-w-0">
                  <div className="text-[13px] font-semibold" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{item.title}</div>
                  <div className="text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>{item.sub}</div>
                  {!item.done && onNavigate && (
                    <button
                      type="button"
                      data-demo={item.title.includes('billing exception') ? 'dashboard-task-billing' : item.title.includes('marketer onboarding') ? 'dashboard-task-marketers' : item.title.includes('settlement report') ? 'dashboard-task-settlement' : undefined}
                      onClick={() => {
                        if (item.title.includes('billing exception')) {
                          onNavigate('billing', { billingTab: 'exceptions' });
                        } else if (item.title.includes('marketer onboarding')) {
                          onNavigate('marketers');
                        } else if (item.title.includes('settlement report')) {
                          onNavigate('settlement');
                        }
                      }}
                      className="mt-1.5 rounded px-2 py-0.5 text-[8px] font-medium"
                      style={{ background: 'var(--teal)', color: '#fff', fontFamily: 'var(--font-mono)' }}
                    >
                      Act
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Recent Enrollments + Top Marketer Performance */}
      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }} data-demo="dashboard-recent-enrollments">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--label-color)', fontFamily: 'var(--font-mono)' }}>Recent Enrollments</div>
            <a href="#customers" className="text-[12px] font-medium" style={{ color: 'var(--teal)', fontFamily: 'var(--font-ui)' }}>View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2" style={{ borderColor: 'var(--teal)', background: 'var(--s2)' }}>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Customer</th>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Type</th>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Status</th>
                  <th className="px-3 py-2.5 text-[8px] font-medium tracking-wider uppercase opacity-65" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {customers.slice(0, 4).map((c) => (
                  <tr key={c.id} className="border-b transition-colors hover:bg-[var(--teal-dim)]" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-3 py-2.5 text-[12px] font-medium" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{c.name}<br /><span className="text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{c.id}</span></td>
                    <td className="px-3 py-2.5"><span className="rounded px-2 py-0.5 text-[8px]" style={{ background: 'var(--s2)', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{c.type}</span></td>
                    <td className="px-3 py-2.5"><span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[8px] font-medium" style={{ background: c.status === 'Active' ? 'rgba(39,174,96,0.1)' : 'var(--gold-dim)', borderColor: c.status === 'Active' ? 'rgba(39,174,96,0.3)' : 'var(--gold-bdr)', color: c.status === 'Active' ? 'var(--success)' : 'var(--gold)', fontFamily: 'var(--font-mono)' }}>{c.status === 'Active' ? 'Enrolled' : c.status}</span></td>
                    <td className="px-3 py-2.5 text-[12px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>{c.since}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--label-color)', fontFamily: 'var(--font-mono)' }}>Top Marketer Performance</div>
          </div>
          <div className="flex flex-col gap-3">
            {marketerPerf.map(([name, rev, pct], i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-28 flex-shrink-0 text-[12px] font-medium" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{name}</span>
                <div className="h-2 flex-1 rounded" style={{ background: 'var(--s2)' }}>
                  <div className="h-full rounded" style={{ width: `${pct}%`, background: 'var(--teal)' }} />
                </div>
                <span className="w-12 text-right text-[11px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-mono)' }}>{rev}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
