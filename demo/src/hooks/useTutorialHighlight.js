import { useEffect } from 'react';
import { useAppStore } from '../store/AppStore';

export function useTutorialHighlight() {
  const { state } = useAppStore();
  const { tutorialMode, activeScenario, activeStepIndex } = state;

  useEffect(() => {
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });

    if (!tutorialMode || !activeScenario) return;

    const step = activeScenario.steps[activeStepIndex];
    if (!step?.demoTarget) return;

    const target = document.querySelector(`[data-demo="${step.demoTarget}"]`);
    if (target) {
      target.classList.add('tutorial-highlight');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [tutorialMode, activeScenario?.id, activeStepIndex]);
}
