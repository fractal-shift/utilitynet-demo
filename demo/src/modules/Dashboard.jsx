import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { kpiData, marketerPerf } from '../data/demoData';
import { useAppStore } from '../store/AppStore';

Chart.register(...registerables);

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
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        datasets: [{
          label: 'Revenue',
          data: [1.62, 1.71, 1.68, 1.82, 1.89, 1.94, 2.01, 2.08, 2.12, 2.18, 2.21, 2.34],
          borderColor: '#1678A0',
          backgroundColor: 'rgba(22, 120, 160, 0.1)',
          fill: true,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: false, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } },
        },
      },
    });
    return () => chartInstance.current?.destroy();
  }, []);

  return (
    <div>
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
        <button type="button" onClick={onExport} data-demo="btn-export-dashboard" className="rounded-lg border px-4 py-2 text-[13px] font-medium" style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>⬇ Export</button>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-4" data-demo="dashboard-kpis">
        <div
          className="rounded-xl border p-5"
          style={{
            background: 'var(--gold-dim)',
            borderColor: 'var(--gold-bdr)',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Total Revenue — MTD</div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--kpi-color)', fontFamily: 'var(--font-ui)' }}>{kpiData.dashboard.revenue}</div>
          <div className="mt-1.5 text-[10px] font-semibold" style={{ color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>{kpiData.dashboard.revenueDelta}</div>
          <div className="mt-0.5 text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>CAD · March 2026</div>
        </div>
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Active Customers</div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{kpiData.dashboard.customers}</div>
          <div className="mt-1.5 text-[10px] font-semibold" style={{ color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>{kpiData.dashboard.customersDelta}</div>
        </div>
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Active Marketers</div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{kpiData.dashboard.marketers}</div>
          <div className="mt-1.5 text-[10px] font-semibold" style={{ color: 'var(--gold)', fontFamily: 'var(--font-ui)' }}>{kpiData.dashboard.marketersDelta}</div>
        </div>
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="mb-1.5 text-[8px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Settlement Status</div>
          <div className="text-xl font-bold" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{kpiData.dashboard.settlement}</div>
          <div className="mt-1.5 text-[10px] font-semibold" style={{ color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>{kpiData.dashboard.settlementDelta}</div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-5">
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }} data-demo="dashboard-revenue-chart">
          <div className="mb-3 text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--label-color)', fontFamily: 'var(--font-mono)' }}>Revenue Trend — Last 12 Months</div>
          <div className="h-[180px]">
            <canvas ref={revenueChartRef} />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--label-color)', fontFamily: 'var(--font-mono)' }}>✦ Predictive Insights</div>
          <div className="rounded-xl border p-4" style={{ background: 'var(--gold-dim)', borderColor: 'var(--gold-bdr)' }} data-demo="dashboard-late-payment-card">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[8px] font-medium tracking-wider uppercase" style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>⚠ Predictive · Late Payment</span>
              <button type="button" data-demo="dashboard-late-payment-review" onClick={() => onNavigate?.('analytics')} className="cursor-pointer rounded px-2 py-0.5 text-[8px] font-medium" style={{ background: 'var(--gold)', color: '#fff', fontFamily: 'var(--font-mono)', border: 'none' }}>Review</button>
            </div>
            <div className="text-[13px] font-semibold" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>17 accounts likely to miss payment in the next 14 days — projected exposure $41,200</div>
            <div className="mt-1.5 text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Confidence 82% · Based on billing history + 3 data sources</div>
          </div>
          <div className="rounded-xl border p-4" style={{ background: 'var(--teal-dim)', borderColor: 'var(--teal-bdr)' }}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[8px] font-medium tracking-wider uppercase" style={{ color: 'var(--teal)', fontFamily: 'var(--font-mono)' }}>↑ Prescriptive · Growth</span>
              <span className="cursor-pointer rounded px-2 py-0.5 text-[8px] font-medium" style={{ background: 'var(--teal)', color: '#fff', fontFamily: 'var(--font-mono)' }} onClick={() => onOpenEmberlyn?.()}>Act</span>
            </div>
            <div className="text-[13px] font-semibold" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>3 partner marketers show below-benchmark conversion but above-average lead quality</div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-5">
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

      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }} data-demo="dashboard-system-alerts">
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
    </div>
  );
}
