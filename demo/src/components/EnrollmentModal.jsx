import { useState } from 'react';
import { useAppStore } from '../store/AppStore';
import { setScenario } from '../services/integrations';

const MARKETERS = ['NRG Direct', 'PrairieEnergy', 'GreenPath', 'AltaEnergy', 'Calgary Energy'];

export default function EnrollmentModal({ isOpen, onClose, showToast }) {
  const { actions } = useAppStore();
  const [step, setStep] = useState(1);
  const [creditRunning, setCreditRunning] = useState(false);
  const [creditDone, setCreditDone] = useState(false);
  const [creditFailed, setCreditFailed] = useState(false);
  const [simulateFail, setSimulateFail] = useState(false);
  const [depositOptionSelected, setDepositOptionSelected] = useState(false);
  const [depositReceived, setDepositReceived] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    type: 'Residential',
    address: '',
    marketer: 'NRG Direct',
    startDate: '2026-04-01',
    plan: 'Variable',
    planRate: '$0.0854/kWh',
    padAuthorized: true,
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleClose = () => {
    setStep(1);
    setCreditRunning(false);
    setCreditDone(false);
    setSuccess(false);
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      type: 'Residential',
      address: '',
      marketer: 'NRG Direct',
      startDate: '2026-04-01',
      plan: 'Variable',
      planRate: '$0.0854/kWh',
      padAuthorized: true,
    });
    onClose();
  };

  const runCreditCheck = async () => {
    if (simulateFail) await setScenario('credit-fail').catch(() => {});
    setCreditRunning(true);
    setTimeout(() => {
      setCreditRunning(false);
      setCreditDone(true);
      setCreditFailed(simulateFail);
    }, simulateFail ? 2000 : 1800);
  };

  const handleToggleFail = () => {
    setSimulateFail((s) => !s);
    setCreditDone(false);
    setCreditFailed(false);
  };

  const handleSubmit = () => {
    const id = actions.nextCustomerId();
    const name = `${form.lastName}, ${form.firstName}`.replace(/^, /, '') || 'New Customer';
    actions.addCustomer({
      id,
      name,
      email: form.email || 'noreply@example.ca',
      type: form.type,
      plan: form.plan,
      marketer: form.marketer,
      balance: '$0.00',
      status: 'Active',
      since: form.startDate ? new Date(form.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Apr 2026',
      hasCase: false,
    });
    setSuccess(true);
    setTimeout(handleClose, 2500);
  };

  if (!isOpen) return null;

  const fullName = `${form.firstName} ${form.lastName}`.trim() || 'New Customer';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="max-h-[90vh] w-[580px] max-w-[95vw] overflow-y-auto rounded-xl border p-7 shadow-xl" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }} onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <div className="font-bold text-[18px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>New Customer Enrollment</div>
          <button type="button" onClick={handleClose} className="text-xl" style={{ color: 'var(--muted)' }}>×</button>
        </div>

        <div className="mb-5 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 text-[11px] font-medium"
                style={{
                  borderColor: step >= s ? 'var(--teal)' : 'var(--border)',
                  background: step > s ? 'var(--teal-dim)' : 'var(--surface)',
                  color: step >= s ? 'var(--teal)' : 'var(--muted)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {step > s ? '✓' : s}
              </div>
              {s < 5 && <div className="mx-0.5 h-0.5 w-4" style={{ background: 'var(--border)' }} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <>
            <div className="mb-4 text-[10px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Customer Information</div>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>First Name</label>
                <input value={form.firstName} onChange={(e) => update('firstName', e.target.value)} data-demo="enrollment-firstName" placeholder="e.g. Sarah" className="w-full rounded-lg border py-2 px-3 text-[13px]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }} />
              </div>
              <div>
                <label className="mb-1 block text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Last Name</label>
                <input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} data-demo="enrollment-lastName" placeholder="e.g. Johnson" className="w-full rounded-lg border py-2 px-3 text-[13px]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }} />
              </div>
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Email</label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="sarah.johnson@email.ca" className="w-full rounded-lg border py-2 px-3 text-[13px]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }} />
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Phone</label>
                <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="403-555-0100" className="w-full rounded-lg border py-2 px-3 text-[13px]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }} />
              </div>
              <div>
                <label className="mb-1 block text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Customer Type</label>
                <select value={form.type} onChange={(e) => update('type', e.target.value)} className="w-full rounded-lg border py-2 px-3 text-[13px]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>
                  <option>Residential</option>
                  <option>Industrial</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Service Address</label>
              <input value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="1234 Energy Ave, Calgary, AB" className="w-full rounded-lg border py-2 px-3 text-[13px]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }} />
            </div>
            <div className="mb-4 flex items-center gap-2">
              <label className="text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Simulate Failed Credit Check</label>
              <button type="button" data-demo="toggle-failed-credit" onClick={handleToggleFail} className={`rounded px-2 py-1 text-[11px] font-medium ${simulateFail ? 'opacity-100' : 'opacity-60'}`} style={{ background: simulateFail ? 'var(--error)' : 'var(--s2)', color: simulateFail ? '#fff' : 'var(--text)', fontFamily: 'var(--font-ui)', border: simulateFail ? 'none' : '1px solid var(--border)' }}>{simulateFail ? 'ON' : 'OFF'}</button>
            </div>
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Assigned Marketer</label>
                <select value={form.marketer} onChange={(e) => update('marketer', e.target.value)} className="w-full rounded-lg border py-2 px-3 text-[13px]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>
                  {MARKETERS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Service Start Date</label>
                <input type="date" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} data-demo="activation-date-field" className="w-full rounded-lg border py-2 px-3 text-[13px]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }} />
                <div data-demo="activation-date-confirmation" className="mt-1 text-[10px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Activation scheduled: {form.startDate ? new Date(form.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'April 1, 2026'}. Activation will trigger: meter read request · contract execution · first bill cycle start.</div>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button type="button" onClick={handleClose} className="rounded-lg border px-4 py-2 text-[13px] font-medium" style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>Cancel</button>
              <button type="button" onClick={() => setStep(2)} data-demo="enrollment-continue-1" className="rounded-lg px-4 py-2 text-[13px] font-semibold" style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}>Continue → Credit Check</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-4 text-[10px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Credit Verification</div>
            {creditFailed ? (
              <div data-demo="credit-failed-state" className="mb-6 rounded-lg border p-4" style={{ background: 'rgba(229,62,62,0.08)', borderColor: 'rgba(229,62,62,0.3)' }}>
                <div className="font-semibold mb-2" style={{ color: 'var(--error)', fontFamily: 'var(--font-ui)' }}>⚠ Credit Check Failed — Score: 492 (Minimum: 550)</div>
                <div className="text-[12px] mb-4" style={{ color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>Select an option:</div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" data-demo="btn-require-deposit" onClick={() => setDepositOptionSelected(true)} className="rounded-lg px-3 py-1.5 text-[12px] font-semibold" style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}>Option A: Require Deposit — $250</button>
                  <button type="button" data-demo="btn-reject-enrollment" onClick={() => { setCreditFailed(false); setCreditDone(false); setStep(1); setScenario('credit-pass').catch(() => {}); }} className="rounded-lg border px-3 py-1.5 text-[12px] font-medium" style={{ borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>Option B: Reject Application</button>
                  <button type="button" data-demo="btn-manual-override" onClick={() => { setCreditFailed(false); setCreditDone(true); setScenario('credit-pass').catch(() => {}); }} className="rounded-lg border px-3 py-1.5 text-[12px] font-medium" style={{ borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>Option C: Manual Override</button>
                </div>
                {depositOptionSelected && !depositReceived && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-[11px] mb-2" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Deposit amount: $250 · Payment method: Prudential hold</div>
                    <button type="button" data-demo="btn-mark-deposit-received" onClick={() => { setDepositReceived(true); showToast?.('Deposit of $250.00 received — prudential hold applied'); }} className="rounded-lg px-3 py-1.5 text-[12px] font-semibold" style={{ background: 'var(--success)', color: '#fff', fontFamily: 'var(--font-ui)' }}>Mark Deposit Received</button>
                  </div>
                )}
              </div>
            ) : !creditDone ? (
              <div className="mb-6 flex items-center gap-4 rounded-xl border p-4" style={{ background: 'var(--teal-dim)', borderColor: 'var(--teal-bdr)' }}>
                <span className="text-2xl">{creditRunning ? '⏳' : '✓'}</span>
                <div>
                  <div className="text-[13px] font-semibold" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>{creditRunning ? 'Running credit check…' : 'Ready to run'}</div>
                  <div className="text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>{creditRunning ? 'Connecting to Equifax bureau · Please wait' : 'Click the button to simulate credit check'}</div>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="mb-4 grid grid-cols-3 gap-3">
                  <div className="rounded-lg border p-3" style={{ background: 'var(--s2)', borderColor: 'var(--border)' }}>
                    <div className="text-[10px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Credit Score</div>
                    <div className="text-xl font-bold" style={{ color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>742</div>
                  </div>
                  <div className="rounded-lg border p-3" style={{ background: 'var(--s2)', borderColor: 'var(--border)' }}>
                    <div className="text-[10px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Risk Band</div>
                    <div className="text-base font-bold" style={{ color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>Low</div>
                  </div>
                  <div className="rounded-lg border p-3" style={{ background: 'var(--s2)', borderColor: 'var(--border)' }}>
                    <div className="text-[10px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Decision</div>
                    <div className="text-base font-bold" style={{ color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>Approved</div>
                  </div>
                </div>
                <div className="rounded-lg border p-3" style={{ background: 'rgba(39,174,96,0.08)', borderColor: 'rgba(39,174,96,0.25)', color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>✓ Credit check passed — customer approved for standard enrollment without deposit</div>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <button type="button" onClick={() => setStep(1)} className="rounded-lg border px-4 py-2 text-[13px] font-medium" style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>← Back</button>
              {(creditDone && !creditFailed) || (creditFailed && depositReceived) ? (
                <button type="button" onClick={() => setStep(3)} data-demo="enrollment-continue-2" className="rounded-lg px-4 py-2 text-[13px] font-semibold" style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}>Continue → Plan Selection</button>
              ) : (
                <button type="button" onClick={runCreditCheck} disabled={creditRunning} data-demo="enrollment-run-credit" className="rounded-lg px-4 py-2 text-[13px] font-semibold" style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}>{creditRunning ? 'Running…' : 'Run Credit Check'}</button>
              )}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="mb-4 text-[10px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Energy Plan Selection</div>
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div
                role="button"
                tabIndex={0}
                onClick={() => { update('plan', 'Variable'); update('planRate', '$0.0854/kWh'); }}
                onKeyDown={(e) => e.key === 'Enter' && (update('plan', 'Variable'), update('planRate', '$0.0854/kWh'))}
                className="cursor-pointer rounded-xl border p-4 transition-colors"
                style={{ background: form.plan === 'Variable' ? 'var(--teal-dim)' : 'var(--surface)', borderColor: form.plan === 'Variable' ? 'var(--teal-bdr)' : 'var(--border)' }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-bold text-[15px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>Variable Rate</span>
                  <span className="h-5 w-5 rounded-full border-2" style={{ borderColor: form.plan === 'Variable' ? 'var(--teal)' : 'var(--border)' }} />
                </div>
                <div className="font-mono text-lg font-bold" style={{ color: 'var(--teal)' }}>$0.0854/kWh</div>
                <div className="mt-1 text-[10px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Current March rate · Adjusts monthly with AESO</div>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => { update('plan', 'Fixed'); update('planRate', '$0.0922/kWh'); }}
                onKeyDown={(e) => e.key === 'Enter' && (update('plan', 'Fixed'), update('planRate', '$0.0922/kWh'))}
                className="cursor-pointer rounded-xl border p-4 transition-colors"
                style={{ background: form.plan === 'Fixed' ? 'var(--teal-dim)' : 'var(--surface)', borderColor: form.plan === 'Fixed' ? 'var(--teal-bdr)' : 'var(--border)' }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-bold text-[15px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>Fixed Rate</span>
                  <span className="h-5 w-5 rounded-full border-2" style={{ borderColor: form.plan === 'Fixed' ? 'var(--teal)' : 'var(--border)' }} />
                </div>
                <div className="font-mono text-lg font-bold" style={{ color: 'var(--teal)' }}>$0.0922/kWh</div>
                <div className="mt-1 text-[10px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Locked 12 months · Rate certainty guaranteed</div>
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <button type="button" onClick={() => setStep(2)} className="rounded-lg border px-4 py-2 text-[13px] font-medium" style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>← Back</button>
              <button type="button" onClick={() => setStep(4)} data-demo="enrollment-continue-3" className="rounded-lg px-4 py-2 text-[13px] font-semibold" style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}>Continue → Banking Info</button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="mb-4 text-[10px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Pre-Authorized Debit (PAD) Setup</div>
            <div className="mb-4 rounded-lg border p-3" style={{ background: 'var(--teal-dim)', borderColor: 'var(--teal-bdr)', color: 'var(--teal)', fontFamily: 'var(--font-ui)' }}>ℹ Pre-authorized debit enables automatic monthly billing. Customer must sign PAD agreement.</div>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Bank Name</label>
                <select className="w-full rounded-lg border py-2 px-3 text-[13px]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>
                  <option>RBC Royal Bank</option>
                  <option>TD Canada Trust</option>
                  <option>Scotiabank</option>
                  <option>BMO</option>
                  <option>CIBC</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Account Type</label>
                <select className="w-full rounded-lg border py-2 px-3 text-[13px]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>
                  <option>Chequing</option>
                  <option>Savings</option>
                </select>
              </div>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Transit Number</label>
                <input placeholder="12345" maxLength={5} className="w-full rounded-lg border py-2 px-3 text-[13px]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }} />
              </div>
              <div>
                <label className="mb-1 block text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Institution Number</label>
                <input placeholder="003" maxLength={3} className="w-full rounded-lg border py-2 px-3 text-[13px]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }} />
              </div>
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>Account Number</label>
              <input placeholder="1234567" maxLength={12} className="w-full rounded-lg border py-2 px-3 text-[13px]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--light)', fontFamily: 'var(--font-ui)' }} />
            </div>
            <div className="mb-6 flex items-center gap-2">
              <input type="checkbox" id="pad" checked={form.padAuthorized} onChange={(e) => update('padAuthorized', e.target.checked)} className="rounded" />
              <label htmlFor="pad" className="text-[13px] font-medium cursor-pointer" style={{ color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>I authorize UTILITYnet to debit my account monthly as per the PAD agreement terms</label>
            </div>
            <div className="flex justify-between gap-4">
              <button type="button" onClick={() => setStep(3)} className="rounded-lg border px-4 py-2 text-[13px] font-medium" style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>← Back</button>
              <button type="button" onClick={() => setStep(5)} data-demo="enrollment-continue-4" className="rounded-lg px-4 py-2 text-[13px] font-semibold" style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}>Continue → Confirm</button>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <div className="mb-4 text-[10px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Enrollment Confirmation</div>
            {success ? (
              <div className="rounded-lg border p-4" style={{ background: 'rgba(39,174,96,0.08)', borderColor: 'rgba(39,174,96,0.25)', color: 'var(--success)', fontFamily: 'var(--font-ui)' }}>✓ Enrollment complete! Customer added to list. Service begins {form.startDate ? new Date(form.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'April 1, 2026'}.</div>
            ) : (
              <>
                <div className="mb-6 rounded-xl border p-5" style={{ background: 'var(--gold-dim)', borderColor: 'var(--gold-bdr)' }}>
                  <div className="mb-3 font-bold text-[15px]" style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}>Review & Confirm</div>
                  <div className="space-y-2 text-[13px]" style={{ fontFamily: 'var(--font-ui)' }}>
                    <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Customer</span><span style={{ color: 'var(--light)' }}>{fullName}</span></div>
                    <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Service Address</span><span style={{ color: 'var(--light)' }}>{form.address || '1234 Energy Ave, Calgary'}</span></div>
                    <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Plan</span><span style={{ color: 'var(--light)' }}>{form.plan} · {form.planRate}</span></div>
                    <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Marketer</span><span style={{ color: 'var(--light)' }}>{form.marketer}</span></div>
                    <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Service Start</span><span style={{ color: 'var(--light)' }}>{form.startDate ? new Date(form.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'April 1, 2026'}</span></div>
                    <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>PAD Setup</span><span style={{ color: 'var(--success)' }}>✓ Authorized</span></div>
                    <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Credit Status</span><span style={{ color: 'var(--success)' }}>✓ Approved (Score: 742)</span></div>
                  </div>
                </div>
                <div className="flex justify-between gap-4">
                  <button type="button" onClick={() => setStep(4)} className="rounded-lg border px-4 py-2 text-[13px] font-medium" style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>← Back</button>
                  <button type="button" onClick={handleSubmit} data-demo="enrollment-submit" className="rounded-lg px-4 py-2 text-[13px] font-semibold" style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontFamily: 'var(--font-ui)' }}>✓ Enroll Customer</button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
