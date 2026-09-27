import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import CartPage from '@/pages/CartPage';
import HomePage from '@/pages/HomePage';
import PaymentPage from '@/pages/PaymentPage';
import OrderCompletePage from '@/pages/OrderCompletePage';
import SubsidyCalloutPreviewPage from '@/pages_temp/SubsidyCalloutPreviewPage';
import { CartProvider } from '@/context/CartContext';

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/payment' element={<PaymentPage />} />
          <Route path='/payment/complete' element={<OrderCompletePage />} />
          {/* 검수용 임시 라우트 — 확인 끝나면 이 줄과 SubsidyCalloutPreviewPage import를 지워도 된다. */}
          <Route path='/preview/subsidy-callout' element={<SubsidyCalloutPreviewPage />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;
