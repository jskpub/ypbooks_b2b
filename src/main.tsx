import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '@/contexts/ToastContext';
import './scss/ypbooks_b2b.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ToastProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
