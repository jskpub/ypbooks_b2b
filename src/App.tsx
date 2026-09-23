import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import CartPage from '@/pages/CartPage';
import HomePage from '@/pages/HomePage';
import LayoutPreviewPage from '@/pages/LayoutPreviewPage';
import PaymentPage from '@/pages/PaymentPage';
import StyleGuideComponentsPage from '@/pages_temp/StyleGuideComponentsPage';
import StyleGuideFoundationsPage from '@/pages_temp/StyleGuideFoundationsPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/payment' element={<PaymentPage />} />
        <Route path='/layout-preview' element={<LayoutPreviewPage />} />
        <Route path='/style-guide/components' element={<StyleGuideComponentsPage />} />
        <Route path='/style-guide/foundations' element={<StyleGuideFoundationsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
