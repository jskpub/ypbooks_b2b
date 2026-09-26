import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import BestsellerPage from '@/pages/BestsellerPage';
import BookDetailPage from '@/pages/BookDetailPage';
import CartPage from '@/pages/CartPage';
import HomePage from '@/pages/HomePage';
import MyReadingStatusPage from '@/pages/MyReadingStatusPage';
import MyReviewsPage from '@/pages/MyReviewsPage';
import NewArrivalPage from '@/pages/NewArrivalPage';
import PaymentPage from '@/pages/PaymentPage';
import RecommendPage from '@/pages/RecommendPage';
import ReviewFormPage from '@/pages/ReviewFormPage';
import ReviewPage from '@/pages/ReviewPage';
import SearchPage from '@/pages/SearchPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/payment' element={<PaymentPage />} />
        <Route path='/review' element={<ReviewPage />} />

        {/* BOOK-01/03/04 — Figma 84:50/84:648/84:1015 기준 전용 화면 (Picked Book / Book List) */}
        <Route path='/recommend' element={<RecommendPage />} />
        <Route path='/bestseller' element={<BestsellerPage />} />
        <Route path='/new' element={<NewArrivalPage />} />

        {/* BOOK-05 — 도서 상세 */}
        <Route path='/books/:isbn13' element={<BookDetailPage />} />

        {/* REVIEW-02/03/04 — 계정 드롭다운(마이페이지) UI는 아직 없어서 라우트만 먼저 연다.
            REVIEW_SPEC.md "진입 경로 결정 (2026-09-25)" 절 참고. */}
        <Route path='/myreading' element={<MyReadingStatusPage />} />
        <Route path='/myreview' element={<MyReviewsPage />} />
        <Route path='/myreview/write/:isbn13' element={<ReviewFormPage />} />
      </Route>
    </Routes>
  );
}

export default App;
