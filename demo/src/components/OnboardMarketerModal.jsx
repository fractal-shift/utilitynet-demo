import { useState } from 'react';
import { useAppStore } from '../store/AppStore';

export default function OnboardMarketerModal({ isOpen, onClose }) {
  const { actions } = useAppStore();
  const [name, setName] = useState('');
  const [customers, setCustomers] = useState(500);
  const [revenue, setRevenue] = useState('$100,000');
  const [margin, setMargin] = useState('5.0%');

  const handleSubmit = () => {
    const id = actions.nextMarketerId();
    actions.addMarketer({
      id,
      name: name || 'New Marketer',
      customers,
      revenue: revenue || '$100,000',
      margin: margin || '5.0%',
      status: 'Active',
    });
    setName('');
    setCustomers(500);
    setRevenue('$100,000');
    setMargin('5.0%');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setCustomers(500);
    setRevenue('$100,000');
    setMargin('5.0%');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="w-[580px] max-w-[95vw] rounded-xl border p-7 shadow-xl" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }} onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <div className="font-bold text-[18px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>Onboard Marketer</div>
          <button type="button" onClick={handleClose} className="text-xl" style={{ color: 'var(--muted)' }}>×</button>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Marketer Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-demo="marketer-name"
            placeholder="e.g. Energy Partners Inc."
            className="w-full rounded-lg border py-2 px-3 text-[13px]"
            style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }}
          />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Customers (initial)</label>
            <input
              type="number"
              value={customers}
              onChange={(e) => setCustomers(parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-lg border py-2 px-3 text-[13px]"
              style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }}
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Revenue MTD</label>
            <input
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              placeholder="$100,000"
              className="w-full rounded-lg border py-2 px-3 text-[13px]"
              style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Margin</label>
          <select
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
            className="w-full rounded-lg border py-2 px-3 text-[13px]"
            style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }}
          >
            <option>4.5%</option>
            <option>5.0%</option>
            <option>5.5%</option>
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={handleClose} className="rounded-lg border px-4 py-2 text-[13px] font-medium" style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>Cancel</button>
          <button type="button" onClick={handleSubmit} data-demo="marketer-submit" className="rounded-lg px-4 py-2 text-[13px] font-semibold" style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}>+ Onboard Marketer</button>
        </div>
      </div>
    </div>
  );
}
