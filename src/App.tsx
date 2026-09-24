import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
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
      </Route>
    </Routes>
  );
}

export default App;
