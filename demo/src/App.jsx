import { useState } from 'react';
import { AppStoreProvider } from './store/AppStore';
import Layout from './components/Layout';
import ApiKeyModal from './components/ApiKeyModal';
import DemoStatusOverlay from './components/DemoStatusOverlay';

const envApiKey = import.meta.env.VITE_CLAUDE_API_KEY?.trim();

function App() {
  const [apiKey, setApiKey] = useState(() => envApiKey || sessionStorage.getItem('claude-api-key'));
  const [showApiKeyModal, setShowApiKeyModal] = useState(!apiKey);

  const handleApiKeySubmit = (key) => {
    sessionStorage.setItem('claude-api-key', key);
    setApiKey(key);
    setShowApiKeyModal(false);
  };

  return (
    <AppStoreProvider>
      <Layout apiKey={apiKey || envApiKey} />
      {showApiKeyModal && (
        <ApiKeyModal onSubmit={handleApiKeySubmit} onSkip={() => setShowApiKeyModal(false)} />
      )}
      <DemoStatusOverlay />
    </AppStoreProvider>
  );
}

export default App;
