import { useState } from 'react';

export default function ApiKeyModal({ onSubmit, onSkip }) {
  const [key, setKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (key.trim()) {
      onSubmit(key.trim());
    }
  };

  return (
    <div
      data-demo="api-key-modal"
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(10, 22, 40, 0.6)' }}
    >
      <div
        className="w-full max-w-md rounded-xl p-8 shadow-xl"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        <h2
          className="mb-2 font-bold text-xl"
          style={{ color: 'var(--light)', fontFamily: 'var(--font-ui)' }}
        >
          Enter API Key
        </h2>
        <p
          className="mb-6 text-sm"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}
        >
          Your Claude API key is stored in this session only and clears when you close the tab.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            data-demo="api-key-input"
            placeholder="sk-ant-..."
            className="mb-4 w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--teal-bdr)]"
            style={{
              background: 'var(--input-bg)',
              borderColor: 'var(--border)',
              color: 'var(--light)',
              fontFamily: 'var(--font-ui)',
            }}
            autoFocus
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!key.trim()}
              className="rounded-lg px-5 py-2.5 font-semibold text-sm transition-all disabled:opacity-50"
              style={{
                background: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)',
                fontFamily: 'var(--font-ui)',
              }}
            >
              Start Demo
            </button>
            <button
              type="button"
              onClick={onSkip}
              data-demo="api-key-dismiss"
              className="rounded-lg border px-5 py-2.5 font-medium text-sm"
              style={{
                background: 'transparent',
                borderColor: 'var(--border)',
                color: 'var(--text)',
                fontFamily: 'var(--font-ui)',
              }}
            >
              Use Cached Only
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
