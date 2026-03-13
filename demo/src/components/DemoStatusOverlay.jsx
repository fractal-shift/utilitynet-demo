import { useState, useEffect, useRef } from 'react';

function HighlightOverlay({ selector, conclusion }) {
  const [rect, setRect] = useState(null);

  useEffect(() => {
    const update = () => {
      const el = document.querySelector(selector);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      } else {
        setRect(null);
      }
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    const id = setInterval(update, 100);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
      clearInterval(id);
    };
  }, [selector]);

  if (!rect) return null;

  return (
    <div className="pointer-events-none fixed z-[85]" style={{ inset: 0 }}>
      <div
        className="absolute rounded-lg transition-all duration-200"
        style={{
          top: rect.top - 4,
          left: rect.left - 4,
          width: rect.width + 8,
          height: rect.height + 8,
          border: '2px solid var(--gold-bdr, rgba(212, 160, 23, 0.8))',
          boxShadow: '0 0 0 4px rgba(212, 160, 23, 0.2)',
        }}
      />
      {conclusion && (
        <div
          className="absolute left-1/2 -translate-x-1/2 mt-2 rounded-lg px-4 py-2 shadow-lg max-w-md"
          style={{
            top: rect.top + rect.height + 8,
            background: 'rgba(255, 255, 255, 0.98)',
            border: '1px solid var(--gold-bdr, rgba(212, 160, 23, 0.5))',
            color: '#1A2B3C',
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
          }}
        >
          <span className="text-[10px] font-medium tracking-wider uppercase opacity-70" style={{ color: 'var(--gold)' }}>Conclusion</span>
          <p className="mt-1">{conclusion}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Displays status text, scenario summary, visible demo cursor, and highlight overlay during Playwright automation.
 * Listens for postMessage:
 * - demo-status: { status: string }
 * - demo-summary: { title: string, description: string }
 * - demo-cursor: { x: number, y: number, action: 'move' | 'click' }
 * - demo-highlight: { selector: string, conclusion?: string, durationMs?: number }
 * - demo-highlight-clear
 */
export default function DemoStatusOverlay() {
  const [status, setStatus] = useState('');
  const [summary, setSummary] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [highlight, setHighlight] = useState(null);
  const cursorRef = useRef(null);
  const highlightTimeoutRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      const d = e.data;
      if (!d?.type) return;
      if (d.type === 'demo-status') {
        setStatus(typeof d.status === 'string' ? d.status : '');
        if (d.status) setSummary(null);
        setHighlight(null);
      } else if (d.type === 'demo-summary') {
        setSummary({ title: d.title || '', description: d.description || '' });
        setStatus('');
      } else if (d.type === 'demo-cursor') {
        setCursor({ x: d.x ?? 0, y: d.y ?? 0, action: d.action || 'move' });
      } else if (d.type === 'demo-cursor-clear') {
        setCursor(null);
      } else if (d.type === 'demo-highlight') {
        setHighlight({ selector: d.selector || '', conclusion: d.conclusion || '', durationMs: d.durationMs ?? 4000 });
      } else if (d.type === 'demo-highlight-clear') {
        setHighlight(null);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  useEffect(() => {
    if (!highlight) return;
    if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    highlightTimeoutRef.current = setTimeout(() => setHighlight(null), highlight.durationMs);
    return () => {
      if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    };
  }, [highlight]);

  useEffect(() => {
    if (!cursor) return;
    const el = cursorRef.current;
    if (!el) return;
    el.style.left = `${cursor.x}px`;
    el.style.top = `${cursor.y}px`;
    if (cursor.action === 'click') {
      el.classList.add('demo-cursor-click');
      const t = setTimeout(() => el.classList.remove('demo-cursor-click'), 150);
      return () => clearTimeout(t);
    }
  }, [cursor]);

  return (
    <>
      {summary && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40"
          style={{ pointerEvents: 'none' }}
        >
          <div
            className="mx-6 max-w-[560px] rounded-xl border-2 px-8 py-6 shadow-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.98)',
              borderColor: 'var(--gold-bdr, rgba(212, 160, 23, 0.5))',
            }}
          >
            <div className="mb-2 text-[10px] font-medium tracking-widest uppercase opacity-70" style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>
              Scenario
            </div>
            <h2 className="mb-4 text-xl font-bold" style={{ color: '#1A2B3C', fontFamily: 'var(--font-ui)' }}>
              {summary.title}
            </h2>
            <p className="text-[14px] leading-relaxed" style={{ color: '#4A5568', fontFamily: 'var(--font-ui)' }}>
              {summary.description}
            </p>
          </div>
        </div>
      )}
      {status && !summary && (
        <div
          className="fixed bottom-24 left-1/2 z-[100] -translate-x-1/2 rounded-lg px-6 py-3 shadow-lg"
          style={{
            background: 'rgba(255, 255, 255, 0.98)',
            border: '1px solid var(--gold-bdr, rgba(212, 160, 23, 0.4))',
            color: '#1A2B3C',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            fontWeight: 500,
            maxWidth: '90vw',
            textAlign: 'center',
          }}
        >
          {status}
        </div>
      )}
      {cursor && (
        <div
          ref={cursorRef}
          className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out"
          style={{
            width: 24,
            height: 24,
            left: cursor.x,
            top: cursor.y,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="drop-shadow-lg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
            <path d="M5 3l14 9-6 2-4 6-4-17z" fill="#fff" stroke="#D4A017" strokeWidth="1.5" />
          </svg>
        </div>
      )}
      {highlight && <HighlightOverlay selector={highlight.selector} conclusion={highlight.conclusion} />}
    </>
  );
}
