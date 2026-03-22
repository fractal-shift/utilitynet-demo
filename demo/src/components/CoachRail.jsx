import { useAppStore } from '../store/AppStore';
import { useTutorialAudio } from '../hooks/useTutorialAudio';
import { useTutorialHighlight } from '../hooks/useTutorialHighlight';

export default function CoachRail() {
  const { state, actions } = useAppStore();
  const {
    tutorialMode, activeScenario, activeStepIndex,
    tutorialPaused, tutorialComplete, audioPlaying,
  } = state;
  const {
    pauseTutorial, resumeTutorial, endTutorial,
  } = actions;

  const { skipStep } = useTutorialAudio();
  useTutorialHighlight();

  if (!tutorialMode || !activeScenario) return null;

  const currentStep = activeScenario.steps[activeStepIndex];
  const progressPercent = tutorialComplete
    ? 100
    : Math.round((activeStepIndex / activeScenario.steps.length) * 100);

  return (
    <div
      data-demo="coach-rail"
      className="flex w-[300px] flex-shrink-0 flex-col border-l"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* Header */}
      <div
        className="border-b px-4 py-3"
        style={{ background: 'var(--gold-dim)', borderColor: 'var(--gold-bdr)', borderTop: '2px solid var(--gold)' }}
      >
        <div
          className="mb-1 text-[8px] font-medium tracking-[0.12em] uppercase"
          style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}
        >
          Emberlyn Coach
        </div>
        <div className="flex items-center justify-between">
          <div
            className="text-[13px] font-bold"
            style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}
          >
            {activeScenario.title}
          </div>
          {audioPlaying && !tutorialPaused && (
            <div className="flex items-center gap-0.5" aria-label="Audio playing">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 rounded-sm"
                  style={{
                    background: 'var(--gold)',
                    height: `${8 + (i % 3) * 4}px`,
                    animation: `coachWave 0.8s ease-in-out ${i * 0.1}s infinite`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
        <div
          className="mt-1 inline-block rounded px-2 py-0.5 text-[7.5px] font-medium uppercase tracking-wider"
          style={{ background: 'var(--teal-dim)', border: '1px solid var(--teal-bdr)', color: 'var(--teal)', fontFamily: 'var(--font-mono)' }}
        >
          {activeScenario.module}
        </div>
      </div>

      {/* Step list */}
      <div
        data-demo="coach-step-list"
        className="border-b px-3 py-3"
        style={{ borderColor: 'var(--border)' }}
      >
        {activeScenario.steps.map((step, index) => {
          const isDone = tutorialComplete || index < activeStepIndex;
          const isActive = !tutorialComplete && index === activeStepIndex;
          return (
            <div
              key={step.id}
              data-demo={`coach-step-${index}`}
              className="mb-1 flex items-center gap-2 rounded-md px-2 py-1.5"
              style={{
                background: isActive ? 'var(--teal-dim)' : 'transparent',
                border: isActive ? '1px solid var(--teal-bdr)' : '1px solid transparent',
                opacity: !isActive && !isDone ? 0.4 : isDone ? 0.55 : 1,
              }}
            >
              <div
                className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[8px] font-bold"
                style={{
                  background: isDone ? 'var(--success)' : isActive ? 'var(--teal)' : 'var(--s2)',
                  color: isDone || isActive ? '#fff' : 'var(--muted)',
                }}
              >
                {isDone ? '✓' : index + 1}
              </div>
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? 'var(--teal)' : 'var(--text)', fontFamily: 'var(--font-ui)' }}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current step narration */}
      {currentStep && !tutorialComplete && (
        <div
          data-demo="coach-narration"
          className="mx-3 my-3 rounded-lg border p-3"
          style={{ background: 'var(--gold-dim)', borderColor: 'var(--gold-bdr)' }}
        >
          <div
            className="mb-1 text-[7.5px] uppercase tracking-wider"
            style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
          >
            {tutorialPaused ? `Paused · Step ${activeStepIndex + 1}` : `Step ${activeStepIndex + 1} of ${activeScenario.steps.length}`}
          </div>
          <div
            className="mb-1 text-[11px] font-bold"
            style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}
          >
            {currentStep.title}
          </div>
          <div
            className="text-[10px] italic leading-relaxed"
            style={{ color: 'var(--text)', fontFamily: 'var(--font-ui)' }}
          >
            {currentStep.narration.substring(0, 120)}...
          </div>
        </div>
      )}

      {tutorialComplete && (
        <div className="mx-3 my-3 rounded-lg border p-4 text-center"
          style={{ background: 'rgba(39,174,96,0.08)', borderColor: 'rgba(39,174,96,0.25)' }}>
          <div className="text-xl" style={{ color: 'var(--success)' }}>✓</div>
          <div className="mt-1 text-[12px] font-bold" style={{ color: 'var(--light)' }}>
            Scenario Complete
          </div>
          <div className="mt-0.5 text-[10px]" style={{ color: 'var(--muted)' }}>
            {activeScenario.title} walkthrough finished.
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="mt-auto">
        <div className="mx-3 mb-1 h-0.5 overflow-hidden rounded-sm" style={{ background: 'var(--s2)' }}>
          <div
            className="h-full rounded-sm transition-all duration-500"
            style={{ width: `${progressPercent}%`, background: 'var(--teal)' }}
          />
        </div>
        <div className="flex justify-between px-3 pb-2 text-[7.5px]"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          <span>{tutorialComplete ? 'Complete' : `Step ${activeStepIndex + 1} of ${activeScenario.steps.length}`}</span>
          <span>{activeScenario.duration}</span>
        </div>

        {/* Controls */}
        <div className="flex gap-1.5 border-t px-3 py-2.5" style={{ borderColor: 'var(--border)' }}>
          {!tutorialComplete && (
            <>
              <button
                type="button"
                data-demo="coach-pause-btn"
                onClick={tutorialPaused ? resumeTutorial : pauseTutorial}
                className="rounded-md border px-3 py-1.5 text-[10px] font-semibold"
                style={{ background: 'transparent', borderColor: 'var(--bormid)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}
              >
                {tutorialPaused ? '▶ Resume' : '⏸ Pause'}
              </button>
              <button
                type="button"
                data-demo="coach-skip-btn"
                onClick={skipStep}
                className="rounded-md border px-3 py-1.5 text-[10px] font-semibold"
                style={{ background: 'transparent', borderColor: 'var(--bormid)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}
              >
                Skip →
              </button>
            </>
          )}
          <button
            type="button"
            data-demo="coach-end-btn"
            onClick={endTutorial}
            className="ml-auto rounded-md px-3 py-1.5 text-[10px] font-semibold"
            style={{ background: 'var(--teal)', color: '#fff', fontFamily: 'var(--font-ui)' }}
          >
            {tutorialComplete ? 'Back to Live' : 'End Tutorial'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes coachWave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1.3); }
        }
      `}</style>
    </div>
  );
}
