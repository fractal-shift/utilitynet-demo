import { useState, useEffect, useRef, useCallback } from 'react';
import { DEMO_SCENARIOS } from '../data/demo-steps';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function DemoPlayer() {
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('dashboard-am');
  const [playing, setPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const cancelRef = useRef(false);

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

    const post = (msg) => window.postMessage(msg, '*');

    switch (step.type) {
      case 'role':
        post({ type: 'demo-role', role: step.role });
        break;

      case 'navigate':
        document.querySelector(`[data-demo="${step.target}"]`)?.click();
        await sleep(1500);
        break;

      case 'click':
        document
          .querySelector(`[data-demo="${step.target}"]`)
          ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await sleep(800);
        break;

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
          durationMs: step.durationMs || 5000,
        });
        await sleep(step.durationMs || 5000);
        break;

      case 'status':
        post({ type: 'demo-status', status: step.text });
        await sleep(5000);
        break;

      case 'wait':
        await sleep(step.ms || 2000);
        break;

      case 'emberlyn-open':
        document
          .querySelector('[data-demo="emberlyn-toggle"]')
          ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await sleep(1200);
        break;

      case 'emberlyn-ask': {
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
        post({ type: 'demo-summary', title: step.title, description: step.text });
        await sleep(8000);
        break;

      default:
        break;
    }

    while (pausedRef.current && !cancelRef.current) {
      await sleep(200);
    }
  }, []);

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
        await executeStep(scenario.steps[i]);
      }

      if (!cancelRef.current) {
        window.postMessage({ type: 'demo-status', status: '' }, '*');
        window.postMessage({ type: 'demo-role', role: null }, '*');
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
    window.postMessage({ type: 'demo-status', status: '' }, '*');
    window.postMessage({ type: 'demo-narration', text: null }, '*');
    window.postMessage({ type: 'demo-role', role: null }, '*');
  };

  const handleNext = () => {
    if (stepIndex < (scenario?.steps?.length ?? 0) - 1)
      setStepIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  if (!visible) return null;

  const totalSteps = scenario?.steps?.length || 0;
  const currentStep = scenario?.steps?.[stepIndex];

  const stepPreview =
    currentStep?.text?.slice(0, 50) ||
    currentStep?.target ||
    currentStep?.role ||
    currentStep?.title ||
    (currentStep?.ms != null ? `${currentStep.ms}ms` : '');

  const stepPreviewTruncated =
    currentStep?.text?.length > 50 ? `${stepPreview}…` : stepPreview;

  return (
    <div
      data-demo="demo-player"
      className="fixed left-4 top-16 z-[500] w-72 rounded-xl border shadow-2xl"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--teal)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b px-3 py-2.5"
        style={{ borderColor: 'var(--border)' }}
      >
        <span
          className="text-[12px] font-bold"
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
      <div className="border-b p-3" style={{ borderColor: 'var(--border)' }}>
        <select
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setStepIndex(0);
          }}
          disabled={playing}
          className="w-full rounded-lg border px-2.5 py-1.5 text-[12px]"
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
        className="flex items-center justify-between border-b px-3 py-2"
        style={{ borderColor: 'var(--border)' }}
      >
        <span
          className="text-[10px]"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
        >
          Step {stepIndex + 1} of {totalSteps}
        </span>
        <span
          className="text-[10px] font-medium"
          style={{
            color: playing
              ? paused
                ? 'var(--warning)'
                : 'var(--teal)'
              : 'var(--muted)',
          }}
        >
          {playing ? (paused ? '⏸ Paused' : '● Playing') : '○ Ready'}
        </span>
      </div>

      {/* Current step preview */}
      {currentStep && (
        <div
          className="border-b px-3 py-2"
          style={{ borderColor: 'var(--border)' }}
        >
          <div
            className="rounded px-2 py-1 text-[10px]"
            style={{
              background: 'var(--s2)',
              color: 'var(--muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {currentStep.type}: {stepPreviewTruncated}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-2 p-3">
        <button
          type="button"
          onClick={handlePrev}
          disabled={playing && !paused}
          className="rounded-lg px-2 py-1.5 text-[12px]"
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
            className="flex-1 rounded-lg py-1.5 text-[12px] font-semibold"
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
            className="flex-1 rounded-lg py-1.5 text-[12px] font-semibold"
            style={{ background: 'var(--teal)', color: '#fff' }}
          >
            {paused ? '▶ Resume' : '▶ Play'}
          </button>
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={playing && !paused}
          className="rounded-lg px-2 py-1.5 text-[12px]"
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
          className="rounded-lg px-2 py-1.5 text-[12px]"
          style={{
            background: 'rgba(229,62,62,0.1)',
            color: 'var(--error)',
            border: '1px solid rgba(229,62,62,0.2)',
          }}
        >
          ⏹
        </button>
      </div>
    </div>
  );
}
