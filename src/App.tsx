import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import BookDetailPage from '@/pages/BookDetailPage';
import BookListPage from '@/pages/BookListPage';
import CartPage from '@/pages/CartPage';
import HomePage from '@/pages/HomePage';
import MyReadingStatusPage from '@/pages/MyReadingStatusPage';
import MyReviewsPage from '@/pages/MyReviewsPage';
import PaymentPage from '@/pages/PaymentPage';
import ReviewFormPage from '@/pages/ReviewFormPage';
import ReviewPage from '@/pages/ReviewPage';
import SearchPage from '@/pages/SearchPage';
import { fetchBestsellerBooks, fetchNewArrivalBooks, fetchRecommendedBooks } from '@/services/aladinApi';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/payment' element={<PaymentPage />} />
        <Route path='/review' element={<ReviewPage />} />

        {/* BOOK-01/03/04 — 목록 3종. design-system.md Book Card("홈, 추천도서 선택")를 그대로 재사용한다. */}
        <Route path='/recommend' element={<BookListPage title='추천 도서' fetcher={fetchRecommendedBooks} variant='home_bookcard' showPrice={false} />} />
        <Route path='/bestseller' element={<BookListPage title='베스트' fetcher={() => fetchBestsellerBooks(20)} variant='home_best' showRank />} />
        <Route path='/new' element={<BookListPage title='신상품' fetcher={() => fetchNewArrivalBooks(20)} variant='home_bookcard' />} />

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
