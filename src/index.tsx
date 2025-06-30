
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <DataProvider>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </DataProvider>
    </ThemeProvider>
  </React.StrictMode>
);

serviceWorkerRegistration.register({
  onUpdate: registration => {
    const waitingServiceWorker = registration.waiting;
    if (waitingServiceWorker) {
      // We use a simple confirm dialog here. A custom toast is also a good option.
      const userConfirmation = window.confirm("A new version is available. Reload to update?");
      if (userConfirmation) {
        // Post a message to the waiting service worker to activate it.
        waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
        // After the new worker is activated, reload the page.
        waitingServiceWorker.addEventListener('statechange', event => {
          const target = event.target as ServiceWorker;
          if (target.state === 'activated') {
            window.location.reload();
          }
        });
      }
    }
  },
});
