import { useEffect, useState } from 'react';
import BookListRow from '@/components/BookListRow';
import CategorySidebar from '@/components/CategorySidebar';
import EmptyState from '@/components/EmptyState';
import { isCurrentlyRecommended } from '@/data/recommendedBookList';
import { fetchBestsellerBooks, type AladinItem } from '@/services/aladinApi';

type Period = 'week' | 'month';

// BOOK-03. Figma node 84:648 기준 — 카테고리 사이드바 + 주간/월간 탭 + Book List 행.
// 알라딘 Bestseller는 원래 "주간" 단위 리스트라 월간 전용 데이터가 따로 없다 — 월간 탭도
// 같은 호출을 재사용한다(정확한 월간 집계는 알라딘 API로는 불가능).
export default function BestsellerPage() {
  const [period, setPeriod] = useState<Period>('week');
  const [books, setBooks] = useState<AladinItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    fetchBestsellerBooks(20)
      .then((items) => {
        if (!cancelled) {
          setBooks(items);
          setStatus('done');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [period]);

  return (
    <main id='main' className='main'>
      <div className='container catalog-page'>
        <CategorySidebar />

        <div className='catalog-page__main'>
          <h1 className='catalog-page__title text-h1'>베스트</h1>

          <div className='catalog-page__tabs' role='tablist'>
            <button type='button' role='tab' aria-selected={period === 'week'} className={`tab-item${period === 'week' ? ' is-active' : ''}`} onClick={() => setPeriod('week')}>
              주간
            </button>
            <button type='button' role='tab' aria-selected={period === 'month'} className={`tab-item${period === 'month' ? ' is-active' : ''}`} onClick={() => setPeriod('month')}>
              월간
            </button>
          </div>

          {status === 'error' && <p className='text-body-sm'>베스트셀러를 불러오지 못했습니다.</p>}

          {status === 'done' && books.length === 0 ? (
            <EmptyState icon='books' title='표시할 도서가 없습니다' description='잠시 후 다시 시도해 주세요.' />
          ) : (
            <div className='catalog-page__list'>
              {books.map((book, index) => (
                <BookListRow
                  key={book.itemId}
                  isbn13={book.isbn13}
                  title={book.title}
                  author={book.author}
                  publisher={book.publisher}
                  pubDate={book.pubDate}
                  categoryName={book.categoryName}
                  coverSrc={book.cover}
                  sellingPrice={book.priceSales}
                  listPrice={book.priceStandard}
                  rank={index + 1}
                  isRecommended={isCurrentlyRecommended(book.isbn13)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
