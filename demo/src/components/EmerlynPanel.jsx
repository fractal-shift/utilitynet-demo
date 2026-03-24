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

const NAV_TAG_REGEX = /<nav\b[^>]*\/>/i;
const STREAMING_NAV_REGEX = /<nav\b[\s\S]*$/i;

function parseNavInstruction(text) {
  const tag = text.match(NAV_TAG_REGEX)?.[0];
  if (!tag) return null;
  const moduleMatch = tag.match(/\bmodule="([^"]+)"/i);
  if (!moduleMatch) return null;
  const highlightMatch = tag.match(/\bhighlight="([^"]+)"/i);
  return {
    tag,
    module: moduleMatch[1],
    highlight: highlightMatch?.[1] || null,
  };
}

function stripStreamingNavText(text) {
  return text.replace(STREAMING_NAV_REGEX, '').trimEnd();
}

function stripCompleteNavTag(text) {
  const navInstruction = parseNavInstruction(text);
  if (!navInstruction) return text;
  const cleaned = text.replace(navInstruction.tag, '').trim();
  return cleaned || 'Let me take you there.';
}

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

const getApiKey = () => CLAUDE_API_KEY?.trim() || import.meta.env.VITE_CLAUDE_API_KEY?.trim();

const TUTORIAL_SYSTEM_PROMPT = EMBERLYN_SYSTEM_PROMPT + `

TUTORIAL DETECTION:
If the user asks to walk through a scenario, tutorial, or feature, respond naturally then end your response with a new line containing ONLY: TUTORIAL_START:[scenario_id]
Valid IDs: enrollment, marketers, billing, settlement, finance, analytics
Pick the closest match. If no match, respond normally without the marker.
Example: user says "walk me through finance" → end with: TUTORIAL_START:finance`;

export default function EmerlynPanel({ isOpen, onClose, onToggle, context, suggestionContext = 'default', apiKey, onConfirmAction, onExecuteAction, onNavigate }) {
  const effectiveApiKey = apiKey?.trim() || getApiKey();

  const { actions } = useAppStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [panelWidth, setPanelWidth] = useState(380);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const historyRef = useRef([]);
  const scrollTimerRef = useRef(null);
  const navFiredRef = useRef(false);
  const isNearBottomRef = useRef(true);
  const dragStateRef = useRef({ active: false, startX: 0, startWidth: 380 });
  const textareaRef = useRef(null);

  const fireNavInstruction = (navInstruction) => {
    if (!navInstruction || navFiredRef.current) return false;
    navFiredRef.current = true;
    if (onNavigate) {
      setTimeout(() => {
        onNavigate(navInstruction.module);
        if (navInstruction.highlight) {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('utilitynet:highlight', { detail: { target: navInstruction.highlight } }));
          }, 400);
        }
      }, 600);
    }
    return true;
  };

  const handleNavFromResponse = (text) => {
    const navInstruction = parseNavInstruction(text);
    fireNavInstruction(navInstruction);
    const cleaned = stripCompleteNavTag(text);
    return cleaned || 'Let me take you there.';
  };

  const suggestions = SUGGESTIONS[suggestionContext] || SUGGESTIONS.default;
  const isStreaming = messages.some((m) => m.streaming);

  const handleContainerScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 100;
  };

  const scrollToBottom = () => {
    if (!isNearBottomRef.current) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const forceScrollToBottom = () => {
    isNearBottomRef.current = true;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const autoResizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = 20;
    const maxHeight = lineHeight * 3 + 16;
    el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px';
  };

  const handleMouseDown = (e) => {
    dragStateRef.current = { active: true, startX: e.clientX, startWidth: panelWidth };
    e.preventDefault();

    const onMove = (ev) => {
      if (!dragStateRef.current.active) return;
      const delta = dragStateRef.current.startX - ev.clientX;
      const newWidth = Math.min(580, Math.max(380, dragStateRef.current.startWidth + delta));
      setPanelWidth(newWidth);
    };

    const onUp = () => {
      dragStateRef.current.active = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    navFiredRef.current = false;
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setMessages((m) => [...m, { role: 'user', content: msg }]);
    historyRef.current = [...historyRef.current, { role: 'user', content: msg }];
    setLoading(true);
    forceScrollToBottom();

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
        forceScrollToBottom();
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
            const displayText = stripStreamingNavText(fullText);
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = { ...next[next.length - 1], content: displayText };
              return next;
            });
            fireNavInstruction(parseNavInstruction(fullText));
            scrollToBottom();
          },
          onDone: (final) => {
            const rawFinal = fullText || final;
            if (rawFinal.includes('TUTORIAL_START:')) {
              const scenarioId = rawFinal.split('TUTORIAL_START:')[1].trim().split('\n')[0].trim();
              const scenario = TUTORIAL_SCENARIOS.find((s) => s.id === scenarioId);
              if (scenario) {
                actions.startTutorial(scenario);
                setMessages((prev) => prev.slice(0, -1));
                return;
              }
            }
            const cleaned = handleNavFromResponse(rawFinal);
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = { ...next[next.length - 1], streaming: false, content: cleaned };
              return next;
            });
            historyRef.current = [...historyRef.current, { role: 'assistant', content: cleaned }];
          },
        });
      } catch (err) {
        const errMsg = err?.message?.includes('401') ? 'Invalid API key. Check VITE_CLAUDE_API_KEY in your .env file.' : (err?.message || 'Connection issue. Please try again.');
        setMessages((m) => [
          ...m,
          { role: 'assistant', content: errMsg, error: true },
        ]);
      }
    } else {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: 'AI features require a configured API key. Set VITE_CLAUDE_API_KEY in your .env file to enable live responses.', error: true },
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

      {isOpen && (
        <div
          data-demo="emberlyn-panel"
          style={{
            position: 'fixed',
            top: 56,
            right: 0,
            bottom: 0,
            width: panelWidth,
            zIndex: 65,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--surface)',
            borderLeft: '2px solid rgba(22, 120, 160, 0.4)',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
            fontFamily: 'var(--font-ui)',
          }}
        >
          {/* Resize drag handle */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 8,
              cursor: 'col-resize',
              zIndex: 2,
              background: 'rgba(22, 120, 160, 0.06)',
            }}
          />

          {/* Zone 1: Header */}
          <div
            style={{
              height: 52,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px 0 18px',
              borderTop: '2px solid var(--teal)',
              borderBottom: '1px solid var(--border)',
              background: 'var(--s2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 600,
                    fontSize: 13,
                    color: 'var(--light)',
                    letterSpacing: '0.01em',
                  }}
                >
                  Emberlyn
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 11,
                    color: 'var(--muted)',
                    lineHeight: 1.2,
                  }}
                >
                  Your Operations Companion
                </span>
              </div>
              <span
                className={isStreaming ? 'emberlyn-dot emberlyn-dot--streaming' : 'emberlyn-dot'}
              />
            </div>
            <button
              type="button"
              data-demo="emberlyn-close"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--muted)',
                fontSize: 18,
                lineHeight: 1,
                padding: '4px 6px',
                borderRadius: 4,
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--light)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
            >
              ×
            </button>
          </div>

          {/* Zone 2: Conversation */}
          <div
            ref={messagesContainerRef}
            onScroll={handleContainerScroll}
            data-demo="emberlyn-messages"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '14px 14px 8px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  opacity: 0.45,
                  userSelect: 'none',
                  paddingBottom: 32,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 700,
                    fontSize: 18,
                    color: 'var(--teal)',
                    letterSpacing: '0.02em',
                  }}
                >
                  Emberlyn
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 12,
                    color: 'var(--muted)',
                    textAlign: 'center',
                    maxWidth: 220,
                    lineHeight: 1.5,
                  }}
                >
                  Ask me anything about your operations
                </span>
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  data-role={m.role}
                  className="animate-fade-up"
                  style={{
                    display: 'flex',
                    justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  {m.role === 'user' ? (
                    <div
                      style={{
                        maxWidth: '88%',
                        background: 'var(--teal)',
                        color: '#fff',
                        borderRadius: '10px 10px 2px 10px',
                        padding: '8px 12px',
                        fontSize: 12,
                        fontWeight: 500,
                        lineHeight: 1.55,
                        fontFamily: 'var(--font-ui)',
                        wordBreak: 'break-word',
                      }}
                    >
                      {m.content}
                    </div>
                  ) : m.isActionPreview ? (
                    <ActionPreview content={m.content} onConfirm={() => onConfirmAction?.(suggestionContext)} />
                  ) : (
                    <div
                      style={{
                        maxWidth: '92%',
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        borderRadius: '10px 10px 10px 2px',
                        padding: '8px 12px',
                        fontSize: 12,
                        lineHeight: 1.6,
                        color: m.error ? 'var(--error)' : 'var(--light)',
                        fontFamily: 'var(--font-ui)',
                        wordBreak: 'break-word',
                      }}
                    >
                      <span dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, '<br>') }} />
                      {m.streaming && <span className="streaming-cursor" />}
                    </div>
                  )}
                </div>
              ))
            )}
            {loading && !isStreaming && (
              <div style={{ display: 'flex', gap: 4, paddingLeft: 4 }}>
                <span style={{ color: 'var(--muted)', animation: 'pulse 1.2s ease-in-out infinite' }}>●</span>
                <span style={{ color: 'var(--muted)', animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '0.2s' }}>●</span>
                <span style={{ color: 'var(--muted)', animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '0.4s' }}>●</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Zone 3: Input area */}
          <div
            style={{
              flexShrink: 0,
              borderTop: '1px solid var(--border)',
              background: 'var(--surface)',
              padding: '10px 12px 12px 12px',
            }}
          >
            {/* Suggestion chips */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                marginBottom: 8,
              }}
            >
              {suggestions.slice(0, 3).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => sendMessage(s)}
                  disabled={loading}
                  data-demo="emberlyn-suggestion"
                  style={{
                    background: 'var(--s2)',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    padding: '5px 10px',
                    fontSize: 11,
                    fontWeight: 500,
                    color: 'var(--text)',
                    fontFamily: 'var(--font-ui)',
                    cursor: loading ? 'default' : 'pointer',
                    opacity: loading ? 0.5 : 1,
                    transition: 'background 0.15s, border-color 0.15s',
                    lineHeight: 1.4,
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.borderColor = 'rgba(22, 120, 160, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input row */}
            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'flex-end',
              }}
            >
              <textarea
                ref={textareaRef}
                data-demo="emberlyn-input"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  autoResizeTextarea();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask Emberlyn..."
                rows={1}
                style={{
                  flex: 1,
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: 12,
                  color: 'var(--light)',
                  fontFamily: 'var(--font-ui)',
                  resize: 'none',
                  outline: 'none',
                  lineHeight: '20px',
                  minHeight: 36,
                  maxHeight: 76,
                  overflowY: 'auto',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--teal-bdr, var(--teal))')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                style={{
                  flexShrink: 0,
                  background: input.trim() ? 'var(--teal)' : 'var(--s2)',
                  color: input.trim() ? '#fff' : 'var(--muted)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: 'var(--font-ui)',
                  cursor: loading || !input.trim() ? 'default' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  transition: 'background 0.2s, color 0.2s',
                  height: 36,
                  alignSelf: 'flex-end',
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
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
        style={{
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '8px 12px',
          fontSize: 12,
          opacity: 0.5,
          color: 'var(--text)',
          fontFamily: 'var(--font-ui)',
        }}
      >
        Action cancelled.
      </div>
    );
  }
  if (confirmed) {
    return (
      <div
        style={{
          border: '1px solid var(--success)',
          borderRadius: 10,
          padding: '8px 12px',
          fontSize: 12,
          color: 'var(--success)',
          fontFamily: 'var(--font-ui)',
        }}
      >
        ✓ Done — changes applied successfully.
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'var(--gold-dim)',
        border: '1px solid var(--gold-bdr)',
        borderRadius: 10,
        padding: 12,
        fontFamily: 'var(--font-ui)',
        maxWidth: '92%',
      }}
    >
      <div
        style={{
          fontSize: 8,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          fontFamily: 'var(--font-mono)',
          marginBottom: 8,
        }}
      >
        Proposed Action
      </div>
      <div
        style={{ fontSize: 11, fontWeight: 500, color: 'var(--light)', marginBottom: 12 }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={handleConfirm}
          data-demo="emberlyn-confirm"
          style={{
            background: 'var(--btn-primary-bg)',
            color: 'var(--btn-primary-text)',
            border: 'none',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 600,
            fontFamily: 'var(--font-ui)',
            cursor: 'pointer',
          }}
        >
          ✓ Confirm
        </button>
        <button
          type="button"
          onClick={() => setCancelled(true)}
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--text)',
            fontFamily: 'var(--font-ui)',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
