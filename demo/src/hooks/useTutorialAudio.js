import { useEffect, useRef, useCallback } from 'react';
import { audioPath } from '../data/tutorial-scenarios';
import { useAppStore } from '../store/AppStore';

export function useTutorialAudio() {
  const audioRef = useRef(null);
  const timeoutRef = useRef(null);
  const advanceStepRef = useRef(null);
  const { state, actions } = useAppStore();
  const { tutorialMode, activeScenario, activeStepIndex,
          tutorialPaused, tutorialComplete } = state;
  const { setAudioPlaying, advanceStep } = actions;

  advanceStepRef.current = advanceStep;

  const clearAdvanceTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const scheduleAdvance = useCallback((delayMs) => {
    clearAdvanceTimeout();
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      advanceStepRef.current?.();
    }, delayMs);
  }, [clearAdvanceTimeout]);

  useEffect(() => {
    clearAdvanceTimeout();
    if (!tutorialMode || !activeScenario || tutorialComplete || tutorialPaused) return undefined;

    const step = activeScenario.steps[activeStepIndex];
    if (!step) return undefined;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(audioPath(activeScenario.id, step.id));
    audioRef.current = audio;

    audio.onplay = () => setAudioPlaying(true);
    audio.onpause = () => setAudioPlaying(false);
    audio.onended = () => {
      setAudioPlaying(false);
      scheduleAdvance(1500);
    };
    audio.onerror = () => {
      // Audio missing or blocked — advance after delay so demo doesn't stall
      console.warn('[TutorialAudio] Failed to load:', step.id);
      setAudioPlaying(false);
      scheduleAdvance(4000);
    };

    audio.play().catch(err => {
      console.warn('[TutorialAudio] Autoplay blocked:', err.message);
      setAudioPlaying(false);
      scheduleAdvance(4000);
    });

    return () => {
      clearAdvanceTimeout();
      audio.pause();
    };
  }, [tutorialMode, activeScenario?.id, activeStepIndex, tutorialComplete, tutorialPaused, clearAdvanceTimeout, scheduleAdvance, setAudioPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (tutorialPaused) {
      audioRef.current.pause();
    } else if (tutorialMode && !tutorialComplete) {
      audioRef.current.play().catch(() => {});
    }
  }, [tutorialPaused]);

  const skipStep = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    clearAdvanceTimeout();
    setAudioPlaying(false);
    advanceStep();
  }, [advanceStep, clearAdvanceTimeout, setAudioPlaying]);

  return { skipStep };
}
