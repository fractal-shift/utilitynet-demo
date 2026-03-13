import { useState, useCallback } from 'react';
import { useAppStore } from '../store/AppStore';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Dashboard from '../modules/Dashboard';
import Customers from '../modules/Customers';
import Billing from '../modules/Billing';
import Settlement from '../modules/Settlement';
import Marketers from '../modules/Marketers';
import Analytics from '../modules/Analytics';
import Finance from '../modules/Finance';
import Admin from '../modules/Admin';
import EmerlynPanel from './EmerlynPanel';
import ThenaPanel from './ThenaPanel';
import EnrollmentModal from './EnrollmentModal';
import BillingBatchModal from './BillingBatchModal';
import Customer360Modal from './Customer360Modal';
import OnboardMarketerModal from './OnboardMarketerModal';
import { exportTableToCsv } from '../utils/exportCsv';
import { executeCreateBillingBatch } from '../ai/intentActions';

const MODULES = {
  dashboard: Dashboard,
  customers: Customers,
  billing: Billing,
  settlement: Settlement,
  marketers: Marketers,
  analytics: Analytics,
  finance: Finance,
  admin: Admin,
};

export default function Layout({ apiKey }) {
  const { state, actions } = useAppStore();
  const [currentModule, setCurrentModule] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('utilitynet-theme') || 'light');
  const [emberlynOpen, setEmberlynOpen] = useState(false);
  const [thenaOpen, setThenaOpen] = useState(false);
  const [emberlynContext, setEmberlynContext] = useState('');
  const [emberlynSuggestionContext, setEmberlynSuggestionContext] = useState('default');
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  const [billingBatchModalOpen, setBillingBatchModalOpen] = useState(false);
  const [customer360Customer, setCustomer360Customer] = useState(null);
  const [onboardMarketerModalOpen, setOnboardMarketerModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  const isThena = currentModule === 'analytics';

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }, []);

  const handleExportDashboard = useCallback(() => {
    exportTableToCsv(
      state.customers.slice(0, 10).map((c) => ({ name: c.name, id: c.id, type: c.type, status: c.status, since: c.since })),
      [{ key: 'name', label: 'Customer' }, { key: 'id', label: 'ID' }, { key: 'type', label: 'Type' }, { key: 'status', label: 'Status' }, { key: 'since', label: 'Since' }],
      'dashboard-recent-enrollments'
    );
  }, [state.customers]);

  const handleExportCustomers = useCallback(() => {
    exportTableToCsv(
      state.customers,
      [{ key: 'name', label: 'Customer' }, { key: 'id', label: 'ID' }, { key: 'email', label: 'Email' }, { key: 'type', label: 'Type' }, { key: 'plan', label: 'Plan' }, { key: 'marketer', label: 'Marketer' }, { key: 'balance', label: 'Balance' }, { key: 'status', label: 'Status' }, { key: 'since', label: 'Since' }],
      'customers'
    );
  }, [state.customers]);

  const handleExportBilling = useCallback(() => {
    exportTableToCsv(
      state.billingBatches,
      [{ key: 'id', label: 'Batch ID' }, { key: 'period', label: 'Period' }, { key: 'invoices', label: 'Invoices' }, { key: 'total', label: 'Total' }, { key: 'status', label: 'Status' }],
      'billing-batches'
    );
  }, [state.billingBatches]);

  const handleExportSettlement = useCallback(() => {
    exportTableToCsv(
      state.settlementData,
      [{ key: 'name', label: 'Marketer' }, { key: 'customers', label: 'Customers' }, { key: 'revenue', label: 'Revenue' }, { key: 'commission', label: 'Commission' }, { key: 'status', label: 'Status' }],
      'settlement'
    );
  }, [state.settlementData]);

  const [billingInitialTab, setBillingInitialTab] = useState(null);

  const handleNavigate = useCallback((mod, options) => {
    setCurrentModule(mod);
    setBillingInitialTab(options?.billingTab ?? null);
    const labels = {
      dashboard: 'Dashboard',
      customers: 'Customers',
      billing: 'Billing Engine',
      settlement: 'Settlement',
      marketers: 'Marketers',
      analytics: 'Analytics',
      finance: 'Finance',
      admin: 'Admin',
    };
    setEmberlynContext(`${labels[mod] || mod} · UTILITYnet ERP · March 2026`);

    if (mod === 'analytics') {
      document.documentElement.setAttribute('data-theme', 'thena');
      setTheme('thena');
      setEmberlynOpen(false);
      setThenaOpen(false);
    } else {
      const saved = localStorage.getItem('utilitynet-theme') || 'light';
      document.documentElement.setAttribute('data-theme', saved);
      setTheme(saved === 'dark' ? 'dark' : 'light');
      setThenaOpen(false);
    }
  }, []);

  const handleExecuteAction = useCallback((action, params) => {
    if (action === 'create_billing_batch') {
      const result = executeCreateBillingBatch(actions, params);
      handleNavigate('billing');
      return result;
    }
    return null;
  }, [actions, handleNavigate]);

  const handleToggleMode = useCallback(() => {
    if (currentModule === 'analytics') return;
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('utilitynet-theme', next);
    setTheme(next);
  }, [theme, currentModule]);

  const ActiveModule = MODULES[currentModule];

  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar onToggleMode={handleToggleMode} theme={theme} />
      <div className="mt-14 flex flex-1 flex-col overflow-hidden">
        <Sidebar
          currentModule={currentModule}
          onNavigate={(mod) => handleNavigate(mod)}
          isThena={isThena}
        />
        <main
          className="flex-1 overflow-y-auto px-7 py-7"
          style={{
            marginLeft: 220,
            marginRight: (emberlynOpen && !isThena) || (thenaOpen && isThena) ? 340 : 0,
            maxWidth: (emberlynOpen && !isThena) || (thenaOpen && isThena)
              ? 'calc(100% - 560px)'
              : 1100,
            background: isThena ? '#111210' : undefined,
          }}
        >
          <ActiveModule
            onOpenEmberlyn={(ctx) => { setEmberlynOpen(true); setEmberlynSuggestionContext(ctx || 'default'); }}
            onOpenThena={(ctx) => { setThenaOpen(true); }}
            emberlynContext={emberlynContext}
            currentModule={currentModule}
            onOpenEnrollmentModal={() => setEnrollmentModalOpen(true)}
            onOpenBillingBatchModal={() => setBillingBatchModalOpen(true)}
            onOpenCustomer360={(c) => setCustomer360Customer(c)}
            onOpenOnboardMarketerModal={() => setOnboardMarketerModalOpen(true)}
            onNavigate={(mod, opts) => handleNavigate(mod, opts)}
            onExport={currentModule === 'dashboard' ? handleExportDashboard : currentModule === 'customers' ? handleExportCustomers : currentModule === 'billing' ? handleExportBilling : currentModule === 'settlement' ? handleExportSettlement : undefined}
            initialTab={currentModule === 'billing' ? billingInitialTab : undefined}
          />
        </main>
        {isThena ? (
          <ThenaPanel
            isOpen={thenaOpen}
            onClose={() => setThenaOpen(false)}
            onToggle={() => setThenaOpen((o) => !o)}
            apiKey={apiKey}
          />
        ) : (
          <EmerlynPanel
            isOpen={emberlynOpen}
            onClose={() => setEmberlynOpen(false)}
            onToggle={() => setEmberlynOpen((o) => !o)}
            context={emberlynContext}
            suggestionContext={emberlynSuggestionContext}
            apiKey={apiKey}
            onConfirmAction={(ctx) => {
              if (ctx?.startsWith('settlement')) actions.resolveSettlement('AltaGas Retail');
              if (ctx === 'customer-C10478') {
                actions.updateCaseStatus('CS-4821', 'In Review');
                showToast('3 actions applied.');
              }
            }}
            onExecuteAction={handleExecuteAction}
          />
        )}
      </div>
      <EnrollmentModal isOpen={enrollmentModalOpen} onClose={() => setEnrollmentModalOpen(false)} />
      <BillingBatchModal isOpen={billingBatchModalOpen} onClose={() => setBillingBatchModalOpen(false)} />
      <Customer360Modal customer={customer360Customer} isOpen={!!customer360Customer} onClose={() => setCustomer360Customer(null)} onOpenEmberlyn={(ctx) => { setEmberlynOpen(true); setEmberlynSuggestionContext(ctx || 'default'); setCustomer360Customer(null); }} />
      <OnboardMarketerModal isOpen={onboardMarketerModalOpen} onClose={() => setOnboardMarketerModalOpen(false)} />
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-[300] -translate-x-1/2 rounded-lg px-4 py-2 text-[13px] font-medium" style={{ background: 'var(--surface)', border: '1px solid var(--gold-bdr)', color: 'var(--gold)', fontFamily: 'var(--font-ui)', boxShadow: 'var(--card-shadow)' }}>
          {toast}
        </div>
      )}
      <footer className="flex-shrink-0 border-t px-6 py-3 text-center" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="text-[9px] font-medium tracking-wider uppercase opacity-60" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          FRACTALSHIFT × GNAR · V2.1.0 · POWERED BY EMBERLYN AI
        </div>
      </footer>
    </div>
  );
}
