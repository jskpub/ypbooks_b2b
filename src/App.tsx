import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import CartPage from '@/pages/CartPage';
import HomePage from '@/pages/HomePage';
import PaymentPage from '@/pages/PaymentPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/payment' element={<PaymentPage />} />
      </Route>
    </Routes>
  );
}

export default App;
