import { useState, useCallback, useEffect } from 'react';
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
import AldenPanel from './AldenPanel';
import CoachRail from './CoachRail';
import EnrollmentModal from './EnrollmentModal';
import BillingBatchModal from './BillingBatchModal';
import Customer360Modal from './Customer360Modal';
import OnboardMarketerModal from './OnboardMarketerModal';
import ScenarioPanel from './ScenarioPanel';
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

const MODULE_IDS = Object.keys(MODULES);

export default function Layout({ apiKey }) {
  const { state, actions } = useAppStore();
  const [currentModule, setCurrentModule] = useState(() => {
    if (typeof window === 'undefined') return 'dashboard';
    const m = new URLSearchParams(window.location.search).get('module');
    return m && MODULE_IDS.includes(m) ? m : 'dashboard';
  });

  useEffect(() => {
    const handler = (e) => {
      const target = e.detail?.target;
      if (!target) return;
      const el = document.querySelector(`[data-demo="${target}"]`);
      if (!el) return;
      el.classList.add('emberlyn-highlight');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => el.classList.remove('emberlyn-highlight'), 4000);
    };
    window.addEventListener('utilitynet:highlight', handler);
    return () => window.removeEventListener('utilitynet:highlight', handler);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        setScenarioPanelOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);
  useEffect(() => {
    if (!state.tutorialMode || !state.activeScenario) return;
    const moduleMap = {
      Dashboard: 'dashboard',
      Customers: 'customers',
      Billing: 'billing',
      Settlement: 'settlement',
      Marketers: 'marketers',
      Analytics: 'analytics',
      Finance: 'finance',
      Admin: 'admin',
    };
    const mod = moduleMap[state.activeScenario.module];
    if (mod) handleNavigate(mod);
    if (state.activeScenario.id === 'enrollment') {
      setTimeout(() => setEnrollmentModalOpen(true), 400);
    }
  }, [state.tutorialMode, state.activeScenario?.id]);

  const [theme, setTheme] = useState(() => localStorage.getItem('utilitynet-theme') || 'light');
  const [emberlynOpen, setEmberlynOpen] = useState(false);
  const [thenaOpen, setThenaOpen] = useState(false);
  const [aldenOpen, setAldenOpen] = useState(false);
  const [emberlynContext, setEmberlynContext] = useState('');
  const [emberlynSuggestionContext, setEmberlynSuggestionContext] = useState('default');
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  const [billingBatchModalOpen, setBillingBatchModalOpen] = useState(false);
  const [customer360Customer, setCustomer360Customer] = useState(null);
  const [onboardMarketerModalOpen, setOnboardMarketerModalOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [scenarioPanelOpen, setScenarioPanelOpen] = useState(() =>
    typeof window !== 'undefined' && /[?&]scenarios=1/.test(window.location.search)
  );

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
    const UTILITYNET_ANCHOR = `CLIENT: UTILITYnet — Alberta retail energy provider replacing Oracle PL/SQL and Sage 50. Primary pain: GL code proliferation and financial system technical debt. Finance modernization is their first priority. 14,291 customers, 52 marketer partners. March 2026.`;

    const moduleCtx = {
      dashboard: `Current module: Dashboard\nKPIs live: Revenue MTD $2.34M, 14,291 active customers, 52 marketers, settlement 98.2% reconciled\nAlerts: 3 billing exceptions, 1 settlement exception (AltaGas $1,640), 17 late payment risks`,
      customers: `Current module: Customers\n14,291 active accounts. Enrollment queue: 6 applications, 2 awaiting credit review. Open service cases: 23.`,
      billing: `Current module: Billing Engine\nActive batch: B-2026-0311 (March 2026), 2,847 invoices, $1.84M total, 3 exceptions flagged\nExceptions: EXC-0311-A missing meter read $4,200 · EXC-0311-B rate mismatch $38.40 · EXC-0311-C NSF $124`,
      settlement: `Current module: Settlement\n52 marketers. 49 reconciled. 3 exceptions: AltaGas Retail $1,640 variance (INV-2026-0312), Calgary Energy in review.`,
      marketers: `Current module: Marketers\nTop: NRG Direct $841K (4,821 customers), PrairieEnergy $612K, AltaGas $482K (exception active)\nCommission run JE-2026-0088 ready to post — $1.2M to Account 2100`,
      finance: `Current module: Finance\nGL: Energy Revenue $2.34M credited, AESO Settlement Payable $6.82M, AR $184K\nAP approvals: 2 items totalling $1,192,680 pending\nAR overdue (60+ days): $139,670 across 2 accounts\nMonth-end: On track — 2 of 5 checklist items complete\nBank reconciliation: Balanced as of March 10\nGL Remediation: 3 orphaned GL codes flagged from Oracle migration`,
      analytics: `Current module: Analytics\nRevenue trend: March 2026 peak at $2.34M. Churn risk: 42 accounts, $84K LTV at risk. Late payment: 17 accounts, $41,200, 82% confidence.`,
      admin: `Current module: Admin\nSystem health nominal. Last deployment: March 11. All integrations active.`,
    };

    const ctx = moduleCtx[mod] || `Current module: ${labels[mod] || mod}`;
    setEmberlynContext(`${UTILITYNET_ANCHOR}\n\n${ctx}`);

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
      <Navbar onToggleMode={handleToggleMode} theme={theme} onToggleAlden={() => setAldenOpen((o) => !o)} />
      {state.tutorialMode && (
        <span
          data-demo="tutorial-toggle"
          className="fixed top-3 left-1/2 z-[101] -translate-x-1/2 rounded border px-2 py-0.5 text-[8px] font-medium uppercase tracking-wider"
          style={{ color: 'var(--gold)', borderColor: 'rgba(236,179,36,0.4)',
                   animation: 'pulse 2s ease-in-out infinite', fontFamily: 'var(--font-mono)' }}
        >
          Tutorial Mode
        </span>
      )}
      <div className="mt-14 flex flex-1 overflow-hidden">
        <Sidebar
          currentModule={currentModule}
          onNavigate={(mod) => handleNavigate(mod)}
          isThena={isThena}
        />
        <main
          className="flex-1 overflow-y-auto px-7 py-7"
          style={{
            marginLeft: 220,
            maxWidth: 1100,
            background: isThena ? '#111210' : undefined,
          }}
        >
          <ActiveModule
            onOpenEmberlyn={(ctx) => { setEmberlynOpen(true); setEmberlynSuggestionContext(ctx || 'default'); }}
            onOpenThena={(ctx) => { setThenaOpen(true); }}
            onOpenAlden={() => setAldenOpen(true)}
            emberlynContext={emberlynContext}
            currentModule={currentModule}
            onOpenEnrollmentModal={() => setEnrollmentModalOpen(true)}
            onOpenBillingBatchModal={() => setBillingBatchModalOpen(true)}
            onOpenCustomer360={(c) => setCustomer360Customer(c)}
            onOpenOnboardMarketerModal={() => setOnboardMarketerModalOpen(true)}
            onNavigate={(mod, opts) => handleNavigate(mod, opts)}
            onExport={currentModule === 'dashboard' ? handleExportDashboard : currentModule === 'customers' ? handleExportCustomers : currentModule === 'billing' ? handleExportBilling : currentModule === 'settlement' ? handleExportSettlement : undefined}
            initialTab={currentModule === 'billing' ? billingInitialTab : undefined}
            showToast={showToast}
          />
        </main>
        {isThena ? (
          <ThenaPanel
            isOpen={thenaOpen}
            onClose={() => setThenaOpen(false)}
            onToggle={() => setThenaOpen((o) => !o)}
            apiKey={apiKey}
          />
        ) : state.tutorialMode ? (
          <CoachRail />
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
            onNavigate={(mod) => handleNavigate(mod)}
          />
        )}
      </div>
      <AldenPanel
        isOpen={aldenOpen}
        onClose={() => setAldenOpen(false)}
        onToggle={() => setAldenOpen((o) => !o)}
        apiKey={apiKey}
      />
      <EnrollmentModal isOpen={enrollmentModalOpen} onClose={() => setEnrollmentModalOpen(false)} showToast={showToast} />
      <BillingBatchModal isOpen={billingBatchModalOpen} onClose={() => setBillingBatchModalOpen(false)} />
      <Customer360Modal customer={customer360Customer} isOpen={!!customer360Customer} onClose={() => setCustomer360Customer(null)} onOpenEmberlyn={(ctx) => { setEmberlynOpen(true); setEmberlynSuggestionContext(ctx || 'default'); setCustomer360Customer(null); }} showToast={showToast} />
      <OnboardMarketerModal isOpen={onboardMarketerModalOpen} onClose={() => setOnboardMarketerModalOpen(false)} />
      <ScenarioPanel isOpen={scenarioPanelOpen} onClose={() => setScenarioPanelOpen(false)} />
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-[300] -translate-x-1/2 rounded-lg px-4 py-2 text-[13px] font-medium" style={{ background: 'var(--surface)', border: '1px solid var(--gold-bdr)', color: 'var(--gold)', fontFamily: 'var(--font-ui)', boxShadow: 'var(--card-shadow)' }}>
          {toast}
        </div>
      )}
      <footer className="flex-shrink-0 border-t px-6 py-3 text-center" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="text-[9px] font-medium tracking-wider uppercase opacity-60" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          EMBERLYN ENERGY · POWERED BY FRACTALSHIFT
        </div>
      </footer>
    </div>
  );
}
