import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import RequireAuth from '@/components/RequireAuth';
import CartPage from '@/pages/CartPage';
import HomePage from '@/pages/HomePage';
import IntranetPage from '@/pages/IntranetPage';
import LoginPage from '@/pages/LoginPage';
import PaymentPage from '@/pages/PaymentPage';
import SsoPage from '@/pages/SsoPage';

function App() {
  return (
    <Routes>
      <Route path='/intranet' element={<IntranetPage />} />
      <Route path='/sso' element={<SsoPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/payment' element={<PaymentPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
