import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { AppRoutes } from './routes';
import { ErrorBoundary } from './components/ErrorBoundary';

const root = document.getElementById('root');
if (!root) throw new Error('#root element not found');

// Surface any uncaught errors in the console so a runtime crash on tab nav is
// visible immediately instead of silently blanking the screen.
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
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
