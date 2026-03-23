import { useState, useRef, useEffect } from 'react';
import { CACHE, getCacheKey } from '../ai/responseCache';
import { streamClaude } from '../ai/claudeClient';
import { EMBERLYN_SYSTEM_PROMPT } from '../ai/prompts';
import { parseCreateBillingBatchIntent } from '../ai/intentActions';
import { CLAUDE_API_KEY } from '../apiKey';
import { useAppStore } from '../store/AppStore';
import { TUTORIAL_SCENARIOS, findScenarioByPhrase } from '../data/tutorial-scenarios';

const SUGGESTIONS = {
  'customer-C10482': [
    "Summarize this customer's recent issues",
    'Draft a response explaining the last invoice',
    'Create a follow-up task and update the case',
  ],
  'customer-C10478': [
    "Summarize this customer's recent issues",
    'Draft a response explaining the last invoice',
    'Create a follow-up task and update the case',
  ],
  'exc-A': ['Explain EXC-0311-A', 'What changed since the last bill?', 'Recommend the next step'],
  'billing-exceptions': [
    'Explain EXC-0311-A',
    'What is the total financial risk of these exceptions?',
    'Recommend the next step',
  ],
  'settlement-exc': [
    'Draft a professional response to AltaGas',
    'What is the root cause of this mismatch?',
    'What should be resolved before closing?',
  ],
  'settlement-AltaGas': [
    'Draft a professional response to AltaGas',
    'What is the root cause of this mismatch?',
    'What should be resolved before closing?',
  ],
  finance: [
    'What is our current AR risk exposure?',
    'Which AP items are blocking month-end close?',
    'Show me journal entries posted from billing this month',
    'Summarize the March reconciliation status',
  ],
  default: [
    "Summarize this customer's recent issues",
    'Draft a response explaining the last invoice',
    'Create a follow-up task and update the case',
  ],
};

function typewriterStream(html, onUpdate, onDone) {
  const words = html.split(/(?<=\s)/);
  let i = 0;
  let current = '';
  const interval = setInterval(() => {
    if (i >= words.length) {
      clearInterval(interval);
      onUpdate(html);
      onDone?.();
      return;
    }
    current += words[i++];
    onUpdate(current);
  }, 18);
}

const getApiKey = () => CLAUDE_API_KEY?.trim() || import.meta.env.VITE_CLAUDE_API_KEY?.trim() || sessionStorage.getItem('claude-api-key');

const TUTORIAL_SYSTEM_PROMPT = EMBERLYN_SYSTEM_PROMPT + `

TUTORIAL DETECTION:
If the user asks to walk through a scenario, tutorial, or feature, respond naturally then end your response with a new line containing ONLY: TUTORIAL_START:[scenario_id]
Valid IDs: enrollment, marketers, billing, settlement, finance, analytics
Pick the closest match. If no match, respond normally without the marker.
Example: user says "walk me through finance" → end with: TUTORIAL_START:finance`;

export default function EmerlynPanel({ isOpen, onClose, onToggle, context, suggestionContext = 'default', apiKey, onConfirmAction, onExecuteAction, onNavigate }) {
  const effectiveApiKey = apiKey?.trim() || getApiKey();

  const handleNavFromResponse = (text) => {
    const match = text.match(/<nav\s+module="([^"]+)"(?:\s+highlight="([^"]+)")?\/>/);
    if (!match) return text;
    const [fullTag, mod, highlight] = match;
    if (onNavigate) {
      setTimeout(() => {
        onNavigate(mod);
        if (highlight) {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('utilitynet:highlight', { detail: { target: highlight } }));
          }, 400);
        }
      }, 600);
    }
    return text.replace(fullTag, '').trim();
  };
  const { actions } = useAppStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const historyRef = useRef([]);
  const scrollTimerRef = useRef(null);

  const suggestions = SUGGESTIONS[suggestionContext] || SUGGESTIONS.default;

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    setMessages((m) => [...m, { role: 'user', content: msg }]);
    historyRef.current = [...historyRef.current, { role: 'user', content: msg }];
    setLoading(true);

    const lastAssistant = historyRef.current.filter((m) => m.role === 'assistant').pop();
    const ctx = typeof lastAssistant?.content === 'string' ? lastAssistant.content : '';
    const createBatchIntent = parseCreateBillingBatchIntent(msg, ctx);

    if (createBatchIntent && onExecuteAction) {
      const result = onExecuteAction('create_billing_batch', createBatchIntent);
      if (result) {
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            content: `✓ Created billing batch ${result.id} for ${result.period} (${result.invoices} invoices, ${result.total}). Check the Billing Batches tab.`,
            isActionResult: true,
          },
        ]);
        historyRef.current = [...historyRef.current, { role: 'assistant', content: `Created batch ${result.id}` }];
        setLoading(false);
        scrollToBottom();
        return;
      }
    }

    const cacheKey = getCacheKey(msg, suggestionContext);
    const cached = cacheKey && CACHE[cacheKey];

    if (cached) {
      await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));
      if (cached.startsWith('__ACTION_PREVIEW__')) {
        const htmlContent = cached.replace('__ACTION_PREVIEW__', '');
        setMessages((m) => [
          ...m,
          { role: 'assistant', content: htmlContent, isActionPreview: true },
        ]);
        historyRef.current = [...historyRef.current, { role: 'assistant', content: cached.replace('__ACTION_PREVIEW__', '') }];
      } else {
        setMessages((m) => [...m, { role: 'assistant', content: '', streaming: true }]);
        typewriterStream(
          cached,
          (partial) => {
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = { ...next[next.length - 1], content: partial };
              return next;
            });
            scrollToBottom();
          },
          () => {
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = { ...next[next.length - 1], streaming: false };
              return next;
            });
            historyRef.current = [...historyRef.current, { role: 'assistant', content: cached }];
          }
        );
      }
    } else if (effectiveApiKey) {
      try {
        setMessages((m) => [...m, { role: 'assistant', content: '', streaming: true }]);
        let fullText = '';
        await streamClaude({
          systemPrompt: TUTORIAL_SYSTEM_PROMPT,
          messages: historyRef.current.slice(-8),
          apiKey: effectiveApiKey,
          onChunk: (chunk) => {
            fullText += chunk;
            const displayText = fullText.replace(/<nav\s[^>]*\/?>.*$/s, '').trimEnd();
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = { ...next[next.length - 1], content: displayText };
              return next;
            });
            scrollToBottom();
          },
          onDone: (final) => {
            if (final.includes('TUTORIAL_START:')) {
              const scenarioId = final.split('TUTORIAL_START:')[1].trim().split('\n')[0].trim();
              const scenario = TUTORIAL_SCENARIOS.find((s) => s.id === scenarioId);
              if (scenario) {
                actions.startTutorial(scenario);
                setMessages((prev) => prev.slice(0, -1));
                return;
              }
            }
            const cleaned = handleNavFromResponse(final);
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = { ...next[next.length - 1], streaming: false, content: cleaned };
              return next;
            });
            historyRef.current = [...historyRef.current, { role: 'assistant', content: cleaned }];
          },
        });
      } catch (err) {
        const msg = err?.message?.includes('401') ? 'Invalid API key. Check .env or enter key in modal.' : (err?.message || 'Connection issue. Please try again.');
        setMessages((m) => [
          ...m,
          { role: 'assistant', content: msg, error: true },
        ]);
      }
    } else {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: 'No API key. Use cached prompts or add your key.', error: true },
      ]);
    }
    setLoading(false);
    scrollToBottom();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type !== 'demo-scroll-read' || e.data?.panel !== 'emberlyn') return;
      if (scrollTimerRef.current) {
        clearInterval(scrollTimerRef.current);
        scrollTimerRef.current = null;
      }
      const container = document.querySelector('[data-demo="emberlyn-messages"]');
      if (!container) return;
      const assistants = container.querySelectorAll('[data-role="assistant"]');
      const last = assistants[assistants.length - 1];
      if (!last) return;
      last.scrollIntoView({ block: 'start', behavior: 'auto' });
      const startTop = last.offsetTop;
      container.scrollTop = startTop;
      const targetScroll = Math.min(startTop + last.offsetHeight, container.scrollHeight - container.clientHeight);
      if (targetScroll <= startTop) return;
      const step = 70;
      const interval = 400;
      let current = container.scrollTop;
      scrollTimerRef.current = setInterval(() => {
        current = Math.min(current + step, targetScroll);
        container.scrollTop = current;
        if (current >= targetScroll) {
          clearInterval(scrollTimerRef.current);
          scrollTimerRef.current = null;
        }
      }, interval);
    };
    window.addEventListener('message', handler);
    return () => {
      window.removeEventListener('message', handler);
      if (scrollTimerRef.current) {
        clearInterval(scrollTimerRef.current);
        scrollTimerRef.current = null;
      }
    };
  }, []);

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={onToggle}
          data-demo="emberlyn-toggle"
          className="fixed bottom-7 right-6 z-[70] flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-[13px] shadow-lg transition-all hover:brightness-110"
          style={{
            background: 'var(--gold)',
            color: 'var(--btn-primary-text, #fff)',
            fontFamily: 'var(--font-ui)',
          }}
        >
          ✦ Emberlyn
        </button>
      )}

      {isOpen && <div
        className="flex w-[340px] flex-shrink-0 flex-col border-l"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div
          className="flex flex-shrink-0 items-center justify-between border-b px-4 py-3.5"
          style={{
            background: 'var(--gold-dim)',
            borderTop: '3px solid var(--gold)',
            borderBottomColor: 'var(--bormid)',
          }}
        >
          <div>
            <div
              className="mb-0.5 text-[8px] font-medium tracking-[0.12em] uppercase"
              style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}
            >
              Emberlyn
            </div>
            <div
              className="font-semibold text-sm"
              style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}
            >
              Operation Companion
            </div>
          </div>
          <button type="button" data-demo="emberlyn-close" onClick={onClose} className="p-1 text-lg text-[var(--muted)] hover:text-[var(--light)]">
            ×
          </button>
        </div>
        <div
          className="flex-shrink-0 border-b px-3.5 py-2 text-[10px] font-medium"
          style={{ background: 'var(--s2)', borderColor: 'var(--border)', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
        >
          CONTEXT: {context || 'Dashboard · Emberlyn Energy · March 2026'}
        </div>
        <div className="flex-1 overflow-y-auto p-3.5" style={{ display: 'flex', flexDirection: 'column', gap: 10 }} data-demo="emberlyn-messages">
          {messages.map((m, i) => (
            <div
              key={i}
              data-role={m.role}
              className={`animate-fade-up ${m.role === 'user' ? 'self-end' : 'self-start'}`}
            >
              {m.role === 'user' ? (
                <div
                  className="max-w-[90%] rounded-lg px-3 py-2.5 text-[12px] font-medium leading-relaxed"
                  style={{
                    background: 'var(--teal)',
                    color: '#fff',
                    borderRadius: '10px 10px 2px 10px',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  {m.content}
                </div>
              ) : m.isActionPreview ? (
                <ActionPreview content={m.content} onConfirm={() => onConfirmAction?.(suggestionContext)} />
              ) : (
                <div
                  className="max-w-[90%] rounded-lg border px-3 py-2.5 text-[12px] leading-relaxed"
                  style={{
                    background: 'var(--surface)',
                    borderColor: 'var(--border)',
                    borderRadius: '10px 10px 10px 2px',
                    color: m.error ? 'var(--error)' : 'var(--light)',
                    fontFamily: 'var(--font-ui)',
                  }}
                  dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, '<br>') }}
                />
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-1 text-[var(--muted)]">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>●</span>
              <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>●</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div
          className="flex-shrink-0 border-t p-3"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="mb-2 flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => sendMessage(s)}
                disabled={loading}
                data-demo="emberlyn-suggestion"
                className="rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-colors"
                style={{
                  background: 'var(--s2)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                  fontFamily: 'var(--font-ui)',
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask Emberlyn..."
              className="flex-1 rounded-lg border px-3 py-2 text-[12px] outline-none focus:border-[var(--teal-bdr)]"
              style={{
                background: 'var(--input-bg)',
                borderColor: 'var(--border)',
                color: 'var(--light)',
                fontFamily: 'var(--font-ui)',
              }}
            />
            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="rounded-lg px-4 py-2 font-semibold text-[13px] disabled:opacity-50"
              style={{
                background: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)',
                fontFamily: 'var(--font-ui)',
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>}
    </>
  );
}

function ActionPreview({ content, onConfirm }) {
  const [confirmed, setConfirmed] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const handleConfirm = () => {
    onConfirm?.();
    setConfirmed(true);
  };

  if (cancelled) {
    return (
      <div
        className="rounded-lg border px-3 py-2.5 text-[12px] opacity-50"
        style={{ borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)' }}
      >
        Action cancelled.
      </div>
    );
  }
  if (confirmed) {
    return (
      <div
        className="rounded-lg border px-3 py-2.5 text-[12px]"
        style={{ borderColor: 'var(--success)', color: 'var(--success)', fontFamily: 'var(--font-ui)' }}
      >
        ✓ Done — changes applied successfully.
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border p-3"
      style={{
        background: 'var(--gold-dim)',
        borderColor: 'var(--gold-bdr)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      <div
        className="mb-2 text-[8px] font-medium tracking-wider uppercase"
        style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}
      >
        Proposed Action
      </div>
      <div
        className="mb-3 text-[11px] font-medium"
        style={{ color: 'var(--light)' }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleConfirm}
          data-demo="emberlyn-confirm"
          className="rounded-lg px-3 py-1.5 font-semibold text-[12px]"
          style={{
            background: 'var(--btn-primary-bg)',
            color: 'var(--btn-primary-text)',
            fontFamily: 'var(--font-ui)',
          }}
        >
          ✓ Confirm
        </button>
        <button
          type="button"
          onClick={() => setCancelled(true)}
          className="rounded-lg border px-3 py-1.5 font-medium text-[12px]"
          style={{
            background: 'transparent',
            borderColor: 'var(--border)',
            color: 'var(--text)',
            fontFamily: 'var(--font-ui)',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
