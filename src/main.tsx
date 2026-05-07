import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { AppRoutes } from './routes';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SupabaseStaticDataProvider } from './lib/SupabaseStaticData';

const root = document.getElementById('root');
if (!root) throw new Error('#root element not found');

window.addEventListener('error', (e) => {
  // eslint-disable-next-line no-console
  console.error('[window.error]', e.message, e.error);
});
window.addEventListener('unhandledrejection', (e) => {
  // eslint-disable-next-line no-console
  console.error('[unhandledrejection]', e.reason);
});

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <SupabaseStaticDataProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SupabaseStaticDataProvider>
    </ErrorBoundary>
  </StrictMode>,
);
