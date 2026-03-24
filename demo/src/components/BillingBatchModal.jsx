import { useState } from 'react';
import { useAppStore } from '../store/AppStore';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function BillingBatchModal({ isOpen, onClose }) {
  const { actions } = useAppStore();
  const [period, setPeriod] = useState({ month: 3, year: 2026 });
  const [type, setType] = useState('Residential + Industrial');

  const handleSubmit = () => {
    const monthStr = String(period.month + 1).padStart(2, '0');
    const dayStr = String(new Date().getDate()).padStart(2, '0');
    const id = `B-${period.year}-${monthStr}${dayStr}`;
    const periodLabel = `${MONTHS[period.month]} ${period.year}`;
    const invoices = Math.floor(2400 + Math.random() * 800);
    const total = `$${(invoices * 647).toLocaleString()}`;
    actions.addBillingBatch({
      id,
      period: periodLabel,
      type,
      invoices,
      total,
      exceptions: 0,
      status: 'In Review',
      runDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-[580px] max-w-[95vw] rounded-xl border p-7 shadow-xl" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }} onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <div className="font-bold text-[18px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>New Billing Batch</div>
          <button type="button" data-demo="billing-batch-close" onClick={onClose} className="text-xl" style={{ color: 'var(--muted)' }}>×</button>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Billing Period</label>
          <div className="flex gap-2">
            <select
              value={period.month}
              onChange={(e) => setPeriod((p) => ({ ...p, month: parseInt(e.target.value, 10) }))}
              data-demo="batch-month"
              className="flex-1 rounded-lg border py-2 px-3 text-[13px]"
              style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }}
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
            <select
              value={period.year}
              onChange={(e) => setPeriod((p) => ({ ...p, year: parseInt(e.target.value, 10) }))}
              className="w-24 rounded-lg border py-2 px-3 text-[13px]"
              style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }}
            >
              {[2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Batch Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border py-2 px-3 text-[13px]"
            style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }}
          >
            <option>Residential + Industrial</option>
            <option>Residential Only</option>
            <option>Industrial Only</option>
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-[13px] font-medium" style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>Cancel</button>
          <button type="button" onClick={handleSubmit} data-demo="batch-create" className="rounded-lg px-4 py-2 text-[13px] font-semibold" style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}>⊕ Create Batch</button>
        </div>
      </div>
    </div>
  );
}
