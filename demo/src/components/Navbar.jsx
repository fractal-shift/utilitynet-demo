export default function Navbar({ onToggleMode, theme }) {
  const isDark = theme === 'dark' || theme === 'thena';

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] flex h-14 flex-shrink-0 items-center gap-4 px-6"
      style={{
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center gap-2">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="flex-shrink-0">
          <path d="M11 2L19 6.5V15.5L11 20L3 15.5V6.5L11 2Z" fill="currentColor" opacity="0.3" />
          <path d="M11 2L19 6.5V15.5L11 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M11 2L3 6.5V15.5L11 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="11" cy="11" r="2.5" fill="var(--gold)" />
        </svg>
        <span className="font-bold text-lg tracking-tight" style={{ color: '#fff', fontFamily: 'var(--font-ui)' }}>
          Emberlyn <span style={{ color: 'var(--gold)' }}>Energy</span>
        </span>
      </div>
      <div className="flex-1" />
      <div
        className="flex items-center gap-1.5 rounded-full border px-2.5 py-1"
        style={{
          background: 'rgba(255,255,255,0.08)',
          borderColor: 'rgba(255,255,255,0.2)',
          fontFamily: 'var(--font-ui)',
        }}
      >
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
          <path
            d="M5 0C5 0 8 4 8 7.5C8 9.4 6.7 11 5 11C3.3 11 2 9.4 2 7.5C2 4 5 0 5 0Z"
            fill="white"
            opacity="0.95"
          />
          <path
            d="M5 5C5 5 6.5 7 6.5 8.5C6.5 9.3 5.8 10 5 10C4.2 10 3.5 9.3 3.5 8.5C3.5 7 5 5 5 5Z"
            fill="white"
            opacity="0.4"
          />
        </svg>
        <span
          className="text-[10px] font-semibold tracking-wide"
          style={{ color: 'rgba(255,255,255,0.9)' }}
        >
          Utilitynet
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" className="relative p-1.5 rounded-lg transition-colors hover:bg-white/10" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'rgba(255,255,255,0.8)' }}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full" style={{ background: 'var(--gold)', border: '2px solid var(--nav-bg)' }} />
        </button>
        <button
          type="button"
          onClick={onToggleMode}
          aria-label="Toggle theme"
          className="relative flex h-9 w-16 items-center rounded-full transition-colors"
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <span
            className="absolute flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 ease-out"
            style={{
              left: isDark ? 4 : 32,
              background: isDark ? 'rgba(255,255,255,0.2)' : 'var(--gold)',
              color: '#fff',
            }}
          >
            {isDark ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </span>
        </button>
        <span className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-ui)' }}>Sarah M.</span>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-[11px] tracking-wide"
          style={{
            background: 'var(--teal)',
            color: '#fff',
            fontFamily: 'var(--font-ui)',
          }}
        >
          SM
        </div>
      </div>
    </nav>
  );
}
