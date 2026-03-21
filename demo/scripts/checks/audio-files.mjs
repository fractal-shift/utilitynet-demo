/**
 * T2-002: ElevenLabs Audio Generation Script
 * Static source inspection: proves the script and audio output structure exist.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  const errors = [];

  const scriptPath = path.join(__dirname, '../generate-audio.mjs');
  if (!fs.existsSync(scriptPath)) errors.push('generate-audio.mjs not found');

  const scenariosPath = path.join(__dirname, '../../src/data/tutorial-scenarios.js');
  if (!fs.existsSync(scenariosPath)) errors.push('tutorial-scenarios.js not found (required by generate-audio)');

  if (fs.existsSync(scriptPath)) {
    const content = fs.readFileSync(scriptPath, 'utf-8');
    if (!content.includes('ElevenLabs') && !content.includes('elevenlabs')) errors.push('generate-audio.mjs not wired to ElevenLabs');
    if (!content.includes('tutorial-scenarios')) errors.push('generate-audio.mjs not reading tutorial-scenarios');
  }

  const audioDir = path.join(__dirname, '../../public/audio');
  if (!fs.existsSync(audioDir)) errors.push('public/audio directory not found');

  return { pass: errors.length === 0, errors };
}
