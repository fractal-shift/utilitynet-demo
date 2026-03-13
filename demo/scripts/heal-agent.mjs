/**
 * Calls Claude API to analyze a demo failure and suggest code edits.
 * Returns { edits: [{ file, oldString, newString }] }
 */

import { getRelevantFiles } from './resolve-context.mjs';

const API_KEY = process.env.ANTHROPIC_API_KEY || process.env.VITE_CLAUDE_API_KEY;

const SYSTEM_PROMPT = `You are a debugging assistant for a React demo app. A Playwright automation script failed.

Your task: Analyze the error and suggest EXACT code edits to fix the app or test script. Prefer fixing the app (add missing data-demo attributes, fix bugs) over changing the test.

Return ONLY valid JSON in this format:
{"edits":[{"file":"demo/src/components/Sidebar.jsx","oldString":"exact string to find","newString":"replacement"}]}

Rules:
- file: path relative to demo folder (src/components/X.jsx or scripts/X.mjs)
- oldString: must match the file EXACTLY (include enough context for uniqueness)
- newString: the replacement
- Return empty edits [] if you cannot suggest a fix
- Do not include markdown or explanation, only the JSON object`;

async function requestFixes(failure) {
  if (!API_KEY) {
    throw new Error('ANTHROPIC_API_KEY or VITE_CLAUDE_API_KEY required for auto-heal');
  }

  const files = getRelevantFiles(failure);
  const context = files
    .map(({ path, content }) => `--- ${path} ---\n${content}`)
    .join('\n\n');

  const userMessage = `Failure:
- Scenario: ${failure.scenario}
- Step: ${failure.stepLabel}
- Selector: ${failure.selector}
- Error: ${failure.error}

Relevant files:
${context}

Suggest edits to fix this. Return JSON only.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return { edits: [] };
  }
  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return { edits: parsed.edits || [] };
  } catch {
    return { edits: [] };
  }
}

export { requestFixes };
