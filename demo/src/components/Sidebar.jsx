const NavIcon = ({ children, className = '' }) => (
  <span className={`inline-flex h-[18px] w-[18px] flex-shrink-0 opacity-70 ${className}`} style={{ flexShrink: 0 }}>
    {children}
  </span>
);

const SECTIONS = [
  {
    label: 'Operations',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="6" height="6" rx="1.5"/><rect x="10" y="2" width="6" height="6" rx="1.5"/><rect x="2" y="10" width="6" height="6" rx="1.5"/><rect x="10" y="10" width="6" height="6" rx="1.5"/></svg> },
      { id: 'customers', label: 'Customers', icon: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="6" r="3"/><path d="M3 15c0-3.3 2.7-6 6-6s6 2.7 6 6"/></svg> },
      { id: 'billing', label: 'Billing', badge: 3, icon: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="14" height="11" rx="1.5"/><path d="M6 8h6M6 11h4"/></svg> },
      { id: 'settlement', label: 'Settlement', icon: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 9l3 3 5-5"/><circle cx="9" cy="9" r="7"/></svg> },
      { id: 'marketers', label: 'Marketers', icon: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="9" width="4" height="6" rx="1"/><rect x="7" y="5" width="4" height="10" rx="1"/><rect x="11" y="2" width="4" height="13" rx="1"/></svg> },
    ],
  },
  {
    label: 'Finance',
    items: [
      { id: 'finance', label: 'Finance', icon: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="9" r="7"/><path d="M9 6v6M7 8h3.5a1.5 1.5 0 010 3H7"/></svg> },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { id: 'analytics', label: 'Analytics', icon: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 14l4-5 3 3 3-4 2 2"/><circle cx="3" cy="14" r="1" fill="currentColor" stroke="none"/></svg> },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'admin', label: 'Admin', icon: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="9" r="2.5"/><path d="M9 2v1.5M9 14.5V16M2 9h1.5M14.5 9H16M4 4l1.1 1.1M12.9 12.9L14 14M4 14l1.1-1.1M12.9 5.1L14 4"/></svg> },
    ],
  },
];

export default function Sidebar({ currentModule, onNavigate, isThena }) {
  return (
    <aside
      className="fixed top-14 left-0 z-50 flex w-[220px] flex-col overflow-y-auto border-r"
      style={{
        background: 'var(--sidebar-bg)',
        borderColor: 'var(--sidebar-bdr)',
        bottom: 0,
      }}
    >
      <div className="flex flex-col py-4">
        {SECTIONS.map((section) => (
          <div key={section.label} className="sidebar-section">
            <div
              className="px-4 pb-1.5 pt-4 first:pt-2 text-[8px] font-medium tracking-[0.12em] uppercase"
              style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
            >
              {section.label}
            </div>
            {section.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                data-demo={`nav-${item.id}`}
                data-active={currentModule === item.id}
                className="nav-item group flex w-full items-center gap-2.5 border-l-2 px-4 py-2.5 text-left text-[13px] font-medium transition-all duration-150 cursor-pointer"
                style={{
                  borderLeftColor: currentModule === item.id ? 'var(--active-nav-bdr)' : 'transparent',
                  background: currentModule === item.id ? 'var(--active-nav-bg)' : 'transparent',
                  color: currentModule === item.id ? 'var(--active-nav-color)' : 'var(--text)',
                  fontWeight: currentModule === item.id ? 600 : 500,
                  fontFamily: isThena ? 'Syne, sans-serif' : 'var(--font-ui)',
                }}
              >
                <NavIcon className={currentModule === item.id ? '!opacity-100' : ''}>
                  {item.icon}
                </NavIcon>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[9px] font-medium"
                    style={{ background: 'var(--error)', color: '#fff', fontFamily: 'var(--font-mono)' }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-auto border-t px-4 py-4" style={{ borderColor: 'var(--border)' }}>
        <div
          className="text-[9px] font-medium tracking-wider uppercase opacity-60"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
        >
          Emberlyn ERP · v2.1.0
        </div>
        <div
          className="mt-1 text-[9px] font-medium tracking-wider uppercase opacity-40"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
        >
          Powered by Emberlyn AI
        </div>
      </div>
    </aside>
  );
}
