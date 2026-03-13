/**
 * Applies code edits (oldString -> newString) to files.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEMO_ROOT = join(__dirname, '..');

function resolvePath(filePath) {
  const normalized = filePath.replace(/^demo\//, '');
  return join(DEMO_ROOT, normalized);
}

function isPathAllowed(fullPath) {
  const normalized = join(fullPath);
  return normalized.startsWith(join(DEMO_ROOT, 'src')) || normalized.startsWith(join(DEMO_ROOT, 'scripts'));
}

/**
 * Apply a single edit. Returns true if applied, false if oldString not found.
 */
export function applyEdit(filePath, oldString, newString) {
  const fullPath = resolvePath(filePath);
  if (!isPathAllowed(fullPath)) {
    console.warn(`[apply-edits] Rejected edit outside allowed paths: ${filePath}`);
    return false;
  }
  let content;
  try {
    content = readFileSync(fullPath, 'utf8');
  } catch (err) {
    console.warn(`[apply-edits] Could not read ${fullPath}:`, err.message);
    return false;
  }
  if (!content.includes(oldString)) {
    console.warn(`[apply-edits] oldString not found in ${fullPath}`);
    return false;
  }
  const newContent = content.replace(oldString, newString);
  writeFileSync(fullPath, newContent);
  return true;
}
