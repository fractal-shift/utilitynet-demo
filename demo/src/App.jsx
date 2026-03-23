import { AppStoreProvider } from './store/AppStore';
import Layout from './components/Layout';
import DemoStatusOverlay from './components/DemoStatusOverlay';
import { CLAUDE_API_KEY } from './apiKey';

const envApiKey = CLAUDE_API_KEY?.trim() || import.meta.env.VITE_CLAUDE_API_KEY?.trim();

function App() {
  return (
    <AppStoreProvider>
      <Layout apiKey={envApiKey} />
      <DemoStatusOverlay />
    </AppStoreProvider>
  );
}

export default App;
