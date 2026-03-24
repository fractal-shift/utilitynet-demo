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
          border: '3px solid rgba(22,120,160,0.95)',
          background: 'rgba(22,120,160,0.08)',
          boxShadow: '0 0 0 4px rgba(22,120,160,0.18)',
          animation: 'demo-highlight-pulse 1.2s ease-out infinite',
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
 * Displays status text, scenario summary, visible demo cursor, highlight overlay,
 * and narration text overlay during Playwright automation.
 * Listens for postMessage:
 * - demo-status: { status: string }
 * - demo-summary: { title: string, description: string }
 * - demo-cursor: { x: number, y: number, action: 'move' | 'click' }
 * - demo-highlight: { selector: string, conclusion?: string, durationMs?: number }
 * - demo-highlight-clear
 * - demo-narration: { text: string | null }
 */
export default function DemoStatusOverlay() {
  const [status, setStatus] = useState('');
  const [summary, setSummary] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [highlight, setHighlight] = useState(null);
  const [narration, setNarration] = useState(null);
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
      } else if (d.type === 'demo-narration') {
        setNarration(d.text || null);
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
      <style>{`
        @keyframes demo-highlight-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(22,120,160,0.45), 0 0 0 8px rgba(22,120,160,0.18);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(22,120,160,0.12), 0 0 0 18px rgba(22,120,160,0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(22,120,160,0), 0 0 0 8px rgba(22,120,160,0);
          }
        }

        @keyframes demo-cursor-click-pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            filter: brightness(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.4);
            filter: brightness(1.9);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            filter: brightness(1);
          }
        }

        .demo-cursor-click {
          animation: demo-cursor-click-pulse 180ms ease-out;
        }
      `}</style>
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
            width: 28,
            height: 28,
            left: cursor.x,
            top: cursor.y,
            borderRadius: '9999px',
            border: '3px solid rgba(255,255,255,0.95)',
            background: 'rgba(22,120,160,0.4)',
            boxShadow: '0 0 0 2px rgba(22,120,160,0.5), 0 4px 12px rgba(0,0,0,0.4)',
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.85), rgba(255,255,255,0) 45%)' }}
          />
        </div>
      )}
      {highlight && <HighlightOverlay selector={highlight.selector} conclusion={highlight.conclusion} />}
      {narration && (
        <div
          className="fixed bottom-6 left-1/2 z-[400] w-[720px] max-w-[90vw] -translate-x-1/2 rounded-xl px-6 py-4"
          style={{
            background: 'rgba(4,84,119,0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
            fontFamily: 'var(--font-ui)',
          }}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-[16px]">🎙</div>
            <p className="text-[13px] leading-relaxed font-medium" style={{ color: '#ffffff' }}>{narration}</p>
          </div>
        </div>
      )}
    </>
  );
}
