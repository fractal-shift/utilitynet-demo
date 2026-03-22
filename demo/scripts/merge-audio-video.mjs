#!/usr/bin/env node
/**
 * merge-audio-video.mjs
 *
 * Merges narration MP3s from public/audio/[scenario]/ into the most recent
 * Playwright .webm recording matching the scenario name.
 *
 * Usage:
 *   node scripts/merge-audio-video.mjs <scenario>
 *   node scripts/merge-audio-video.mjs enrollment
 *
 * Output:
 *   ~/Downloads/utilitynet-demos/[scenario]-with-audio.mp4
 */

import { execSync, spawnSync } from 'child_process';
import {
  existsSync,
  readdirSync,
  mkdirSync,
  writeFileSync,
  unlinkSync,
  statSync,
  rmdirSync,
} from 'fs';
import { join, resolve } from 'path';
import { homedir } from 'os';
import { TUTORIAL_SCENARIOS } from '../src/data/tutorial-scenarios.js';

// ─── ffmpeg check ────────────────────────────────────────────────────────────

const ffmpegCheck = spawnSync('which', ['ffmpeg'], { encoding: 'utf8' });
if (ffmpegCheck.status !== 0) {
  console.error('Install ffmpeg: brew install ffmpeg');
  process.exit(1);
}

// ─── Args ────────────────────────────────────────────────────────────────────

const scenarioId = process.argv[2];
if (!scenarioId) {
  console.error('Usage: node scripts/merge-audio-video.mjs <scenario>');
  console.error('Available:', TUTORIAL_SCENARIOS.map((s) => s.id).join(', '));
  process.exit(1);
}

const scenario = TUTORIAL_SCENARIOS.find((s) => s.id === scenarioId);
if (!scenario) {
  console.error(`Unknown scenario: "${scenarioId}"`);
  console.error('Available:', TUTORIAL_SCENARIOS.map((s) => s.id).join(', '));
  process.exit(1);
}

console.log(`Scenario: ${scenario.title}`);

// ─── Find most recent matching .webm ─────────────────────────────────────────

const downloadsDir = join(homedir(), 'Downloads', 'utilitynet-demos');

if (!existsSync(downloadsDir)) {
  console.error(`Directory not found: ${downloadsDir}`);
  console.error('Run a Playwright demo with DEMO_RECORD_VIDEO=1 first.');
  process.exit(1);
}

const webmFiles = readdirSync(downloadsDir)
  .filter((f) => f.endsWith('.webm') && f.toLowerCase().includes(scenarioId.toLowerCase()))
  .map((f) => ({ name: f, mtime: statSync(join(downloadsDir, f)).mtime }))
  .sort((a, b) => b.mtime - a.mtime);

if (webmFiles.length === 0) {
  console.error(`No .webm files found in ${downloadsDir} matching "${scenarioId}"`);
  console.error('Run: npm run demo:record or DEMO_RECORD_VIDEO=1 npm run demo:' + scenarioId);
  process.exit(1);
}

const webmPath = join(downloadsDir, webmFiles[0].name);
console.log(`Video:    ${webmFiles[0].name} (${webmFiles.length} match(es) found, using newest)`);

// ─── Collect MP3s in step order ───────────────────────────────────────────────

const scriptDir = new URL('.', import.meta.url).pathname;
const audioDir = resolve(scriptDir, '../public/audio', scenarioId);

if (!existsSync(audioDir)) {
  console.error(`Audio directory not found: ${audioDir}`);
  console.error(`Run: npm run gen-audio`);
  process.exit(1);
}

const mp3Paths = [];
const missing = [];

for (const step of scenario.steps) {
  const mp3Path = join(audioDir, `${step.id}.mp3`);
  if (existsSync(mp3Path)) {
    mp3Paths.push(mp3Path);
  } else {
    missing.push(step.id);
  }
}

if (missing.length > 0) {
  console.warn(`Warning: ${missing.length} audio file(s) missing:`);
  missing.forEach((id) => console.warn(`  ${id}.mp3`));
}

if (mp3Paths.length === 0) {
  console.error('No MP3 files found. Run: npm run gen-audio');
  process.exit(1);
}

console.log(`Audio:    ${mp3Paths.length}/${scenario.steps.length} steps`);
mp3Paths.forEach((p) => console.log(`  ${p.split('/').pop()}`));

// ─── Build in a temp dir ─────────────────────────────────────────────────────

const tmpDir = join(downloadsDir, '.tmp-merge');
mkdirSync(tmpDir, { recursive: true });

const concatListPath = join(tmpDir, 'concat-list.txt');
const mergedAudioPath = join(tmpDir, 'merged-audio.aac');
const outputPath = join(downloadsDir, `${scenarioId}-with-audio.mp4`);

writeFileSync(concatListPath, mp3Paths.map((p) => `file '${p}'`).join('\n'));

try {
  // Step 1 — concatenate all MP3s into a single AAC track
  console.log('\nStep 1/2  Concatenating narration audio…');
  execSync(
    `ffmpeg -y -f concat -safe 0 -i "${concatListPath}" -c:a aac -b:a 192k "${mergedAudioPath}"`,
    { stdio: 'inherit' }
  );

  // Step 2 — transcode WebM video to H.264 and mux with the AAC audio
  // VP8/VP9 (WebM) cannot be stream-copied into MP4; libx264 ensures
  // broad compatibility for Twelve Labs upload.
  console.log('\nStep 2/2  Merging video and audio…');
  execSync(
    `ffmpeg -y -i "${webmPath}" -i "${mergedAudioPath}" ` +
      `-c:v libx264 -crf 18 -preset fast ` +
      `-c:a copy ` +
      `-map 0:v:0 -map 1:a:0 ` +
      `-shortest ` +
      `"${outputPath}"`,
    { stdio: 'inherit' }
  );

  console.log(`\nDone.`);
  console.log(`Output: ${outputPath}`);
} finally {
  // Clean up temp files regardless of success/failure
  for (const f of [concatListPath, mergedAudioPath]) {
    try { unlinkSync(f); } catch { /* ignore */ }
  }
  try { rmdirSync(tmpDir); } catch { /* ignore if not empty */ }
}
