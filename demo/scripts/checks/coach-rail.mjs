/**
 * T2-001: Coach Rail + Tutorial Mode
 * Static source inspection: proves the code is there. No Playwright.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  const errors = [];
  const root = path.join(__dirname, '../../src');

  const coachRailPath = path.join(root, 'components/CoachRail.jsx');
  if (!fs.existsSync(coachRailPath)) errors.push('CoachRail.jsx not found');

  const tutorialSlicePath = path.join(root, 'store/tutorialSlice.js');
  if (!fs.existsSync(tutorialSlicePath)) errors.push('tutorialSlice.js not found');

  const useTutorialAudioPath = path.join(root, 'hooks/useTutorialAudio.js');
  if (!fs.existsSync(useTutorialAudioPath)) errors.push('useTutorialAudio.js not found');

  const useTutorialHighlightPath = path.join(root, 'hooks/useTutorialHighlight.js');
  if (!fs.existsSync(useTutorialHighlightPath)) errors.push('useTutorialHighlight.js not found');

  const tutorialTogglePath = path.join(root, 'components/TutorialModeToggle.jsx');
  if (!fs.existsSync(tutorialTogglePath)) errors.push('TutorialModeToggle.jsx not found');

  const scenariosPath = path.join(root, 'data/tutorial-scenarios.js');
  if (!fs.existsSync(scenariosPath)) errors.push('tutorial-scenarios.js not found');

  if (fs.existsSync(coachRailPath)) {
    const content = fs.readFileSync(coachRailPath, 'utf-8');
    if (!content.includes('tutorialMode')) errors.push('CoachRail not wired to tutorialMode');
  }

  return { pass: errors.length === 0, errors };
}
