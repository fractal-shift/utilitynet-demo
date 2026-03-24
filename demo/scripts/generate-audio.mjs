import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TUTORIAL_SCENARIOS } from '../src/data/tutorial-scenarios.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_BASE = path.join(__dirname, '../public/audio');

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) continue;

    const key = line.slice(0, eqIndex).trim();
    if (!key || process.env[key] !== undefined) continue;

    let value = line.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

loadEnvFile(path.join(__dirname, '../.env'));

const API_KEY = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || process.env.VITE_ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';

if (!API_KEY) {
  console.error('ELEVENLABS_API_KEY or VITE_ELEVENLABS_API_KEY not set in .env');
  process.exit(1);
}

const args = process.argv.slice(2);
const scenarioFilter = args.includes('--scenario')
  ? args[args.indexOf('--scenario') + 1] : null;
const forceRegen = args.includes('--force');

async function generateAudio(text, outputPath) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.8 },
      }),
    }
  );
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs error: ${response.status} — ${err}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
  return buffer.length;
}

async function run() {
  const scenarios = scenarioFilter
    ? TUTORIAL_SCENARIOS.filter(s => s.id === scenarioFilter)
    : TUTORIAL_SCENARIOS;

  console.log(`\n🎙  Generating audio for: ${scenarios.map(s => s.id).join(', ')}\n`);
  let generated = 0, skipped = 0, errors = 0;

  for (const scenario of scenarios) {
    const dir = path.join(OUTPUT_BASE, scenario.id);
    fs.mkdirSync(dir, { recursive: true });

    for (const step of scenario.steps) {
      const outputPath = path.join(dir, `${step.id}.mp3`);
      if (!forceRegen && fs.existsSync(outputPath)) {
        console.log(`  ⏭  skip  ${step.id}`);
        skipped++;
        continue;
      }
      try {
        process.stdout.write(`  🔊  gen   ${step.id} ... `);
        const bytes = await generateAudio(step.narration, outputPath);
        console.log(`${(bytes / 1024).toFixed(0)}KB`);
        generated++;
        await new Promise(r => setTimeout(r, 600));
      } catch (err) {
        console.log(`FAILED`);
        console.error(`     ${err.message}`);
        errors++;
      }
    }
  }

  console.log(`\n✅ Done: ${generated} generated, ${skipped} skipped, ${errors} errors\n`);
  if (errors > 0) process.exit(1);
}

run();
