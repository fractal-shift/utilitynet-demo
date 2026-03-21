/**
 * T3-002: Enrollment thin file scenario
 * Static check — verifies EnrollmentModal has toggle-thin-file, credit-thin, $150.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  const errors = [];
  const modalPath = path.join(__dirname, '../../src/components/EnrollmentModal.jsx');
  if (!fs.existsSync(modalPath)) return { pass: false, errors: ['EnrollmentModal.jsx not found'] };
  const c = fs.readFileSync(modalPath, 'utf-8');
  if (!c.includes('toggle-thin-file')) errors.push('toggle-thin-file missing');
  if (!c.includes('credit-thin')) errors.push('credit-thin scenario not wired');
  if (!c.includes('CONDITIONAL') && !c.includes('Thin')) errors.push('CONDITIONAL/Thin status not shown');
  if (!c.includes('$150')) errors.push('$150 deposit amount not shown');
  return { pass: errors.length === 0, errors };
}
