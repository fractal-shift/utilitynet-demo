import { useState, useEffect, useRef, useCallback } from 'react';
import { DEMO_SCENARIOS } from '../data/demo-steps';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function DemoPlayer() {
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('finance');
  const [playing, setPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [log, setLog] = useState([]);
  const pausedRef = useRef(false);
  const cancelRef = useRef(false);
  const stepIndexRef = useRef(0);
  const post = useCallback((msg) => window.postMessage(msg, '*'), []);

  const animateCursorTo = useCallback(
    async (el) => {
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;
      const startX = window.__demoCursorX ?? window.innerWidth / 2;
      const startY = window.__demoCursorY ?? window.innerHeight / 2;
      const steps = 12;

      for (let i = 1; i <= steps; i += 1) {
        if (cancelRef.current) return;
        const x = startX + (targetX - startX) * (i / steps);
        const y = startY + (targetY - startY) * (i / steps);
        post({ type: 'demo-cursor', x, y, action: 'move' });
        window.__demoCursorX = x;
        window.__demoCursorY = y;
        await sleep(18);
      }

      post({ type: 'demo-cursor', x: targetX, y: targetY, action: 'click' });
      window.__demoCursorX = targetX;
      window.__demoCursorY = targetY;
      await sleep(150);
    },
    [post]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === '1') setVisible(true);
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setVisible((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const scenario = DEMO_SCENARIOS.find((s) => s.id === selectedId);

  const executeStep = useCallback(async (step) => {
    if (cancelRef.current) return;

    switch (step.type) {
      case 'role':
        post({ type: 'demo-role', role: step.role });
        break;

      case 'navigate': {
        const navLabel = step.label || step.target.replace('nav-', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        post({ type: 'demo-narration', text: `Sarah navigates to ${navLabel}` });
        await sleep(800);
        const el = document.querySelector(`[data-demo="${step.target}"]`);
        await animateCursorTo(el);
        el?.click();
        await sleep(1500);
        post({ type: 'demo-narration', text: null });
        break;
      }

      case 'click': {
        if (step.label) {
          post({ type: 'demo-narration', text: step.label });
          await sleep(600);
        }
        const el = document.querySelector(`[data-demo="${step.target}"]`);
        await animateCursorTo(el);
        el?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await sleep(800);
        if (step.label) post({ type: 'demo-narration', text: null });
        break;
      }

      case 'narration': {
        post({ type: 'demo-narration', text: step.text });
        const words = step.text.split(' ').length;
        const ms = Math.max(4000, Math.round((words / 100) * 60 * 1000));
        await sleep(ms);
        post({ type: 'demo-narration', text: null });
        break;
      }

      case 'highlight':
        post({
          type: 'demo-highlight',
          selector: step.selector,
          conclusion: step.conclusion,
          durationMs: step.durationMs,
        });
        if (step.conclusion) {
          post({ type: 'demo-narration', text: step.conclusion });
          await sleep(step.durationMs || 5000);
          post({ type: 'demo-narration', text: null });
        } else {
          await sleep(step.durationMs || 3000);
        }
        post({ type: 'demo-highlight-clear' });
        break;

      case 'status':
        post({ type: 'demo-narration', text: step.text });
        await sleep(5000);
        post({ type: 'demo-narration', text: null });
        break;

      case 'wait':
        post({ type: 'demo-narration', text: null });
        await sleep(step.ms || 2000);
        break;

      case 'emberlyn-open':
        post({ type: 'demo-narration', text: 'Sarah opens Emberlyn — our operational AI companion, embedded directly in the platform. No switching tabs. No separate tool.' });
        await sleep(1000);
        {
          const el = document.querySelector('[data-demo="emberlyn-toggle"]');
          await animateCursorTo(el);
          el?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
        await sleep(1200);
        post({ type: 'demo-narration', text: null });
        break;

      case 'emberlyn-ask': {
        post({ type: 'demo-narration', text: `Sarah asks: "${step.text}"` });
        await sleep(1500);
        post({ type: 'demo-narration', text: null });
        const input = document.querySelector('[data-demo="emberlyn-input"]');
        if (input) {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            'value'
          ).set;
          nativeInputValueSetter.call(input, step.text);
          input.dispatchEvent(new Event('input', { bubbles: true }));
          await sleep(300);
          input.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
          );
        }
        await sleep(step.waitMs || 8000);
        break;
      }

      case 'summary':
        post({ type: 'demo-narration', text: `✦ ${step.title} — ${step.text}` });
        await sleep(8000);
        post({ type: 'demo-narration', text: null });
        break;

      case 'thena-open':
        post({ type: 'demo-narration', text: 'Sarah opens Thena — our analytics AI partner, with direct access to 24 months of billing and settlement data.' });
        await sleep(1000);
        {
          const el = document.querySelector('[data-demo="thena-toggle"]');
          await animateCursorTo(el);
          el?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
        await sleep(1200);
        post({ type: 'demo-narration', text: null });
        break;

      case 'alden-open':
        post({ type: 'demo-narration', text: 'Sarah opens Alden — our AI system partner, built to answer the hardest architecture and migration questions.' });
        await sleep(1000);
        {
          const el = document.querySelector('[data-demo="alden-toggle"]');
          await animateCursorTo(el);
          el?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
        await sleep(1200);
        post({ type: 'demo-narration', text: null });
        break;

      case 'thena-ask': {
        post({ type: 'demo-narration', text: `Sarah asks Thena: "${step.text}"` });
        await sleep(1500);
        post({ type: 'demo-narration', text: null });
        const thenaInput = document.querySelector('[data-demo="thena-input"], input[placeholder="Ask Thena..."]');
        if (thenaInput) {
          thenaInput.focus();
          const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          nativeSetter.call(thenaInput, step.text);
          thenaInput.dispatchEvent(new Event('input', { bubbles: true }));
          await sleep(300);
          thenaInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        }
        await sleep(step.waitMs || 9000);
        break;
      }

      case 'alden-ask': {
        post({ type: 'demo-narration', text: `Sarah asks Alden: "${step.text}"` });
        await sleep(1500);
        post({ type: 'demo-narration', text: null });
        const aldenInput = document.querySelector('[data-demo="alden-input"], input[placeholder="Ask Alden..."]');
        if (aldenInput) {
          const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          nativeSetter.call(aldenInput, step.text);
          aldenInput.dispatchEvent(new Event('input', { bubbles: true }));
          await sleep(300);
          aldenInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        }
        await sleep(step.waitMs || 9000);
        break;
      }

      case 'scroll': {
        const el = document.querySelector(step.selector || `[data-demo="${step.target}"]`);
        if (el) {
          await animateCursorTo(el);
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        await sleep(step.ms || 1200);
        break;
      }

      case 'fill': {
        const el = document.querySelector(`[data-demo="${step.target}"]`);
        if (el) {
          el.focus();
          const tag = el.tagName.toLowerCase();
          const proto = tag === 'textarea' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
          const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value').set;
          nativeSetter.call(el, step.value);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
        await sleep(300);
        break;
      }

      default:
        break;
    }

    while (pausedRef.current && !cancelRef.current) {
      await sleep(200);
    }
  }, [animateCursorTo, post]);

  const runFrom = useCallback(
    async (startIndex) => {
      if (!scenario) return;
      cancelRef.current = false;
      setPlaying(true);
      setPaused(false);
      pausedRef.current = false;

      for (let i = startIndex; i < scenario.steps.length; i++) {
        if (cancelRef.current) break;
        setStepIndex(i);
        stepIndexRef.current = i;
        setLog(prev => [...prev.slice(-8), `→ ${scenario.steps[i].type}${scenario.steps[i].target ? ': ' + scenario.steps[i].target : scenario.steps[i].text ? ': ' + scenario.steps[i].text.slice(0, 30) + '...' : ''}`]);
        await executeStep(scenario.steps[i]);
      }

      if (!cancelRef.current) {
        window.postMessage({ type: 'demo-status', status: '' }, '*');
        window.postMessage({ type: 'demo-role', role: null }, '*');
        window.postMessage({ type: 'demo-cursor-clear' }, '*');
        window.postMessage({ type: 'demo-highlight-clear' }, '*');
        window.__demoCursorX = null;
        window.__demoCursorY = null;
      }
      setPlaying(false);
      setStepIndex(0);
    },
    [scenario, executeStep]
  );

  const handlePlay = () => {
    if (paused) {
      setPaused(false);
      pausedRef.current = false;
    } else {
      runFrom(stepIndex);
    }
  };

  const handlePause = () => {
    setPaused(true);
    pausedRef.current = true;
  };

  const handleStop = () => {
    cancelRef.current = true;
    pausedRef.current = false;
    setPaused(false);
    setPlaying(false);
    setStepIndex(0);
    stepIndexRef.current = 0;
    setLog([]);
    window.postMessage({ type: 'demo-status', status: '' }, '*');
    window.postMessage({ type: 'demo-narration', text: null }, '*');
    window.postMessage({ type: 'demo-role', role: null }, '*');
    window.postMessage({ type: 'demo-cursor-clear' }, '*');
    window.postMessage({ type: 'demo-highlight-clear' }, '*');
    window.__demoCursorX = null;
    window.__demoCursorY = null;
  };

  const handleNext = async () => {
    const next = Math.min(stepIndex + 1, (scenario?.steps?.length ?? 1) - 1);
    setStepIndex(next);
    stepIndexRef.current = next;
    if (playing) {
      cancelRef.current = true;
      await sleep(100);
      cancelRef.current = false;
      runFrom(next);
    }
  };

  const handlePrev = async () => {
    const prev = Math.max(stepIndex - 1, 0);
    setStepIndex(prev);
    stepIndexRef.current = prev;
    if (playing) {
      cancelRef.current = true;
      await sleep(100);
      cancelRef.current = false;
      runFrom(prev);
    }
  };

  if (!visible) {
    return (
      <button
        type="button"
        onClick={() => setVisible(true)}
        className="fixed left-0 bottom-0 z-[500] px-2 py-3 text-[11px] font-bold shadow-lg"
        style={{ background: 'var(--teal)', color: '#fff', fontFamily: 'var(--font-ui)', writingMode: 'vertical-rl', letterSpacing: '0.05em', borderTopRightRadius: 6 }}
        title="Open Demo Player (Ctrl+Shift+D)"
      >
        ▶ DEMO
      </button>
    );
  }

  const totalSteps = scenario?.steps?.length || 0;

  return (
    <div
      data-demo="demo-player"
      className="fixed left-0 bottom-0 z-[500] w-[220px] rounded-tr-xl shadow-2xl"
      style={{
        background: 'var(--surface)',
        borderRight: '1px solid var(--teal)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b px-2 py-2"
        style={{ borderColor: 'var(--border)' }}
      >
        <span
          className="text-[11px] font-bold"
          style={{ color: 'var(--teal)' }}
        >
          ▶ Demo Player
        </span>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="text-[16px] leading-none"
          style={{ color: 'var(--muted)' }}
        >
          ×
        </button>
      </div>

      {/* Scenario selector */}
      <div className="border-b p-2" style={{ borderColor: 'var(--border)' }}>
        <select
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setStepIndex(0);
          }}
          disabled={playing}
          className="w-full rounded-lg border px-2 py-1 text-[10px]"
          style={{
            background: 'var(--s2)',
            borderColor: 'var(--border)',
            color: 'var(--text)',
            fontFamily: 'var(--font-ui)',
          }}
        >
          {DEMO_SCENARIOS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label} · {s.role}
            </option>
          ))}
        </select>
      </div>

      {/* Step counter */}
      <div
        className="flex items-center justify-between border-b px-2 py-2"
        style={{ borderColor: 'var(--border)' }}
      >
        <span
          className="text-[9px]"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
        >
          Step {stepIndex + 1} of {totalSteps}
        </span>
        <span
          className="text-[9px] font-medium"
          style={{
            color: playing
              ? paused
                ? 'var(--warning)'
                : 'var(--teal)'
              : 'var(--muted)',
          }}
        >
          {playing ? (paused ? '⏸ Paused' : '▶ Running') : '○ Ready'}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 p-2">
        <button
          type="button"
          onClick={handlePrev}
          className="rounded-lg px-1.5 py-1 text-[11px]"
          style={{
            background: 'var(--s2)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
          }}
        >
          ⏮
        </button>

        {playing && !paused ? (
          <button
            type="button"
            onClick={handlePause}
            className="flex-1 rounded-lg py-1 text-[11px] font-semibold"
            style={{
              background: 'rgba(212,160,23,0.15)',
              color: 'var(--gold)',
              border: '1px solid rgba(212,160,23,0.3)',
            }}
          >
            ⏸ Pause
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePlay}
            className="flex-1 rounded-lg py-1 text-[11px] font-semibold"
            style={{ background: 'var(--teal)', color: '#fff' }}
          >
            {paused ? '▶ Resume' : '▶ Play'}
          </button>
        )}

        <button
          type="button"
          onClick={handleNext}
          className="rounded-lg px-1.5 py-1 text-[11px]"
          style={{
            background: 'var(--s2)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
          }}
        >
          ⏭
        </button>

        <button
          type="button"
          onClick={handleStop}
          className="rounded-lg px-1.5 py-1 text-[11px]"
          style={{
            background: 'rgba(229,62,62,0.1)',
            color: 'var(--error)',
            border: '1px solid rgba(229,62,62,0.2)',
          }}
        >
          ⏹
        </button>
      </div>

      {log.length > 0 && (
        <div className="mx-2 mb-2 rounded-lg p-2 text-[9px] max-h-24 overflow-y-auto" style={{ background: 'var(--s2)', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
          {log.map((line, i) => (
            <div key={i} style={{ color: i === log.length - 1 ? 'var(--teal)' : 'var(--muted)' }}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}
