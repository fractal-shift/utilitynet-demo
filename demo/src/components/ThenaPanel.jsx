import { useState, useRef, useEffect } from 'react';
import { CACHE, getCacheKey } from '../ai/responseCache';
import { streamClaude } from '../ai/claudeClient';
import { THENA_SYSTEM_PROMPT } from '../ai/prompts';
import { CLAUDE_API_KEY } from '../apiKey';

const SUGGESTION_SETS = {
  analytics: [
    'What are the top revenue risks in Q2?',
    'Build me a 30-day action plan',
    'Draft the collections email for the top 5 accounts',
    'Which marketers are trending below target?',
    'Forecast April revenue',
  ],
  prescriptive: [
    'Build me a 30-day action plan',
    'What actions reduce late payments?',
    'Which 17 accounts should we prioritize?',
  ],
  'collections-outreach': [
    'Which 17 accounts should we prioritize?',
    'What is the expected recovery rate?',
    'Draft outreach for at-risk accounts',
  ],
  retention: [
    'Which 42 accounts are highest priority?',
    'What offer prevents churn best?',
    'Estimate LTV impact of fixed-rate conversion',
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

export default function ThenaPanel({ isOpen, onClose, onToggle, apiKey }) {
  const effectiveApiKey = apiKey?.trim() || getApiKey();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestionContext, setSuggestionContext] = useState('analytics');
  const messagesEndRef = useRef(null);
  const historyRef = useRef([]);
  const scrollTimerRef = useRef(null);

  const suggestions = SUGGESTION_SETS[suggestionContext] || SUGGESTION_SETS.analytics;

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    setMessages((m) => [...m, { role: 'user', content: msg }]);
    historyRef.current = [...historyRef.current, { role: 'user', content: msg }];
    setLoading(true);

    const cacheKey = getCacheKey(msg);
    const cached = cacheKey && CACHE[cacheKey];

    if (cached) {
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
      if (cached.startsWith('__ACTION_PREVIEW__')) {
        const htmlContent = cached.replace('__ACTION_PREVIEW__', '');
        setMessages((m) => [
          ...m,
          { role: 'assistant', content: htmlContent, isActionPreview: true },
        ]);
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
          systemPrompt: THENA_SYSTEM_PROMPT,
          messages: historyRef.current.slice(-8),
          apiKey: effectiveApiKey,
          onChunk: (chunk) => {
            fullText += chunk;
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = { ...next[next.length - 1], content: fullText };
              return next;
            });
            scrollToBottom();
          },
          onDone: (final) => {
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = { ...next[next.length - 1], streaming: false };
              return next;
            });
            historyRef.current = [...historyRef.current, { role: 'assistant', content: final }];
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
      if (e.data?.type !== 'demo-scroll-read' || e.data?.panel !== 'thena') return;
      if (scrollTimerRef.current) {
        clearInterval(scrollTimerRef.current);
        scrollTimerRef.current = null;
      }
      const container = document.querySelector('[data-demo="thena-messages"]');
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
          data-demo="thena-toggle"
          className="fixed bottom-7 right-6 z-[70] flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-[13px] shadow-lg transition-all"
          style={{
            background: 'var(--teal)',
            color: '#fff',
            fontFamily: 'var(--font-ui)',
          }}
        >
          ◈ Thena
        </button>
      )}

      <div
        className="fixed top-14 right-0 bottom-0 z-[60] flex w-[340px] flex-col border-l transition-transform duration-300 ease-out"
        style={{
          background: '#161714',
          borderColor: 'rgba(212,64,40,0.28)',
          borderLeftWidth: 1,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div
          className="flex flex-shrink-0 items-center justify-between border-b px-4 py-3.5"
          style={{
            background: '#1c1d19',
            borderTop: '3px solid #D44028',
            borderBottomColor: 'rgba(242,240,236,0.07)',
          }}
        >
          <div>
            <div
              className="mb-0.5 text-[8px] font-medium tracking-[0.12em] uppercase"
              style={{ color: '#D44028', fontFamily: 'DM Mono, monospace' }}
            >
              THENA
            </div>
            <div
              className="font-semibold text-sm"
              style={{ color: '#F2F0EC', fontFamily: 'Syne, sans-serif' }}
            >
              Analytics Intelligence
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-lg text-[#C8C4BF] hover:text-[#F2F0EC]">
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3.5" style={{ display: 'flex', flexDirection: 'column', gap: 10, background: '#161714' }} data-demo="thena-messages">
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
                    background: '#D44028',
                    color: '#fff',
                    borderRadius: '10px 10px 2px 10px',
                    fontFamily: 'Syne, sans-serif',
                  }}
                >
                  {m.content}
                </div>
              ) : m.isActionPreview ? (
                <ActionPreview content={m.content} />
              ) : (
                <div
                  className="max-w-[90%] rounded-lg border px-3 py-2.5 text-[12px] leading-relaxed"
                  style={{
                    background: '#1c1d19',
                    borderColor: 'rgba(242,240,236,0.13)',
                    borderRadius: '10px 10px 10px 2px',
                    color: m.error ? '#E74C3C' : '#F2F0EC',
                    fontFamily: 'Syne, sans-serif',
                  }}
                  dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, '<br>') }}
                />
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-1 text-[#C8C4BF]">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>●</span>
              <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>●</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div
          className="flex-shrink-0 border-t p-3"
          style={{ background: '#161714', borderColor: 'rgba(242,240,236,0.07)' }}
        >
          <div className="mb-2 text-[8px] font-medium tracking-wider uppercase"
            style={{ color: 'rgba(200,196,191,0.5)', fontFamily: 'DM Mono, monospace' }}
          >
            Suggested Analysis
          </div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => sendMessage(s)}
                disabled={loading}
                data-demo="thena-suggestion"
                className="rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-colors"
                style={{
                  background: '#1c1d19',
                  borderColor: 'rgba(242,240,236,0.13)',
                  color: '#C8C4BF',
                  fontFamily: 'Syne, sans-serif',
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
              placeholder="Ask Thena..."
              className="flex-1 rounded-lg border px-3 py-2 text-[12px] outline-none focus:border-[rgba(212,64,40,0.30)]"
              style={{
                background: '#111210',
                borderColor: 'rgba(212,64,40,0.30)',
                color: '#F2F0EC',
                fontFamily: 'Syne, sans-serif',
              }}
            />
            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="rounded-lg px-4 py-2 font-semibold text-[13px] disabled:opacity-50"
              style={{
                background: '#D44028',
                color: '#fff',
                fontFamily: 'Syne, sans-serif',
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function ActionPreview({ content }) {
  const [confirmed, setConfirmed] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  if (cancelled) {
    return (
      <div
        className="rounded-lg border px-3 py-2.5 text-[12px] opacity-50"
        style={{ borderColor: 'rgba(242,240,236,0.13)', color: '#C8C4BF', fontFamily: 'Syne, sans-serif' }}
      >
        Action cancelled.
      </div>
    );
  }
  if (confirmed) {
    return (
      <div
        className="rounded-lg border px-3 py-2.5 text-[12px]"
        style={{ borderColor: '#27AE60', color: '#27AE60', fontFamily: 'Syne, sans-serif' }}
      >
        ✓ Done — changes applied successfully.
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border p-3"
      style={{
        background: 'rgba(212,64,40,0.10)',
        borderColor: 'rgba(212,64,40,0.28)',
        fontFamily: 'Syne, sans-serif',
      }}
    >
      <div
        className="mb-2 text-[8px] font-medium tracking-wider uppercase"
        style={{ color: '#D44028', fontFamily: 'DM Mono, monospace' }}
      >
        Proposed Action
      </div>
      <div
        className="mb-3 text-[11px] font-medium"
        style={{ color: '#F2F0EC' }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div className="flex gap-2">
<button
        type="button"
        onClick={() => setConfirmed(true)}
        data-demo="thena-confirm"
        className="rounded-lg px-3 py-1.5 font-semibold text-[12px]"
        style={{
          background: '#D44028',
          color: '#fff',
          fontFamily: 'Syne, sans-serif',
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
            borderColor: 'rgba(242,240,236,0.13)',
            color: '#C8C4BF',
            fontFamily: 'Syne, sans-serif',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
