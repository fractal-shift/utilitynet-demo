import { useEffect } from 'react';
import { useAppStore } from '../store/AppStore';

export function useTutorialHighlight() {
  const { state } = useAppStore();
  const { tutorialMode, activeScenario, activeStepIndex } = state;

  useEffect(() => {
    let retryTimer = null;

    const clearHighlights = () => {
      document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
      });
    };

    const applyHighlight = () => {
      clearHighlights();

      if (!tutorialMode || !activeScenario) return true;

      const step = activeScenario.steps[activeStepIndex];
      if (!step?.demoTarget) return true;

      const target = document.querySelector(`[data-demo="${step.demoTarget}"]`);
      if (!target) return false;

      target.classList.add('tutorial-highlight');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return true;
    };

    if (!applyHighlight()) {
      let attempts = 0;
      retryTimer = setInterval(() => {
        attempts += 1;
        if (applyHighlight() || attempts >= 12) {
          clearInterval(retryTimer);
          retryTimer = null;
        }
      }, 250);
    }

    return () => {
      if (retryTimer) clearInterval(retryTimer);
      clearHighlights();
    };
  }, [tutorialMode, activeScenario?.id, activeStepIndex]);
}
