import { useEffect, useRef, useCallback } from 'react';
import { audioPath } from '../data/tutorial-scenarios';
import { useAppStore } from '../store/AppStore';

export function useTutorialAudio() {
  const audioRef = useRef(null);
  const { state, actions } = useAppStore();
  const { tutorialMode, activeScenario, activeStepIndex,
          tutorialPaused, tutorialComplete } = state;
  const { setAudioPlaying, advanceStep } = actions;

  useEffect(() => {
    if (!tutorialMode || !activeScenario || tutorialComplete || tutorialPaused) return;

    const step = activeScenario.steps[activeStepIndex];
    if (!step) return;

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
      setTimeout(() => advanceStep(), 1500);
    };
    audio.onerror = () => {
      // Audio missing or blocked — advance after delay so demo doesn't stall
      console.warn('[TutorialAudio] Failed to load:', step.id);
      setAudioPlaying(false);
      setTimeout(() => advanceStep(), 4000);
    };

    audio.play().catch(err => {
      console.warn('[TutorialAudio] Autoplay blocked:', err.message);
    });

    return () => { audio.pause(); };
  }, [tutorialMode, activeScenario?.id, activeStepIndex, tutorialComplete]);

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
    setAudioPlaying(false);
    advanceStep();
  }, [advanceStep, setAudioPlaying]);

  return { skipStep };
}
