export async function streamClaude({ systemPrompt, messages, onChunk, onDone, apiKey }) {
  const key = apiKey?.trim();
  if (!key) throw new Error('No API key provided. Add VITE_CLAUDE_API_KEY to .env or enter in modal.');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      stream: true,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 401) {
      throw new Error('Invalid API key (401). Check VITE_CLAUDE_API_KEY in .env or re-enter in modal.');
    }
    throw new Error(errText || `HTTP ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));
    for (const line of lines) {
      try {
        const data = JSON.parse(line.slice(6));
        if (data.type === 'content_block_delta' && data.delta?.text) {
          fullText += data.delta.text;
          onChunk(data.delta.text);
        }
      } catch {
        // ignore parse errors
      }
    }
  }
  onDone(fullText);
}
