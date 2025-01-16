import { StrictMode, useEffect, useState, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { checkWorkerConnection } from './lib/services/cloudflareService';
import { initializeFirebase } from './lib/firebase';
import { Loader2 } from 'lucide-react';

// Create root once
const root = createRoot(document.getElementById('root')!);

function Root() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // First check worker connection
        const workerConnected = await checkWorkerConnection();
        if (!workerConnected) {
          throw new Error('Could not connect to Cloudflare worker. Please check:\n1. Your worker URL is correct\n2. Your API key is valid\n3. The worker is deployed and running');
        }

        // Then initialize Firebase
        await initializeFirebase();
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize application';
        console.error('Application initialization error:', errorMessage);
        setError(errorMessage);
        setLoading(false);
      }
    };

    init().catch((err) => {
      console.error('Failed to initialize application:', err);
      setError('Failed to initialize application');
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return <App />;
}

root.render(
  <StrictMode>
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <Root />
    </Suspense>
  </StrictMode>
);
