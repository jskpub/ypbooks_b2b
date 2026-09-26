import { useEffect, useMemo, useState } from 'react';
import BookListRow from '@/components/BookListRow';
import CategorySidebar from '@/components/CategorySidebar';
import EmptyState from '@/components/EmptyState';
import { isCurrentlyRecommended } from '@/data/recommendedBookList';
import { fetchNewArrivalBooks, fetchNewSpecialBooks, type AladinItem } from '@/services/aladinApi';

type Tab = 'special' | 'all';
type SortKey = 'salesPoint' | 'pubDate' | 'priceAsc';

const TABS: { key: Tab; label: string }[] = [
  { key: 'special', label: '화제의 신간' },
  { key: 'all', label: '새로 나온 도서' },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'salesPoint', label: '판매량순' },
  { key: 'pubDate', label: '출간일순' },
  { key: 'priceAsc', label: '낮은가격순' },
];

// BOOK-04. Figma node 84:1015 기준 — 카테고리 사이드바 + 화제의 신간/새로 나온 도서 탭 + 정렬 + Book List 행.
// 정렬은 알라딘 ItemList에 Sort 파라미터가 없어서 클라이언트에서 직접 정렬한다.
export default function NewArrivalPage() {
  const [tab, setTab] = useState<Tab>('all');
  const [sortKey, setSortKey] = useState<SortKey>('salesPoint');
  const [books, setBooks] = useState<AladinItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    const fetcher = tab === 'special' ? fetchNewSpecialBooks : fetchNewArrivalBooks;
    fetcher(20)
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
  }, [tab]);

  const sortedBooks = useMemo(() => {
    const copy = [...books];
    if (sortKey === 'salesPoint') return copy.sort((a, b) => b.salesPoint - a.salesPoint);
    if (sortKey === 'pubDate') return copy.sort((a, b) => b.pubDate.localeCompare(a.pubDate));
    return copy.sort((a, b) => a.priceSales - b.priceSales);
  }, [books, sortKey]);

  return (
    <main id='main' className='main'>
      <div className='container catalog-page'>
        <CategorySidebar />

        <div className='catalog-page__main'>
          <h1 className='catalog-page__title text-h1'>신상품</h1>

          <div className='catalog-page__tabs' role='tablist'>
            {TABS.map((t) => (
              <button key={t.key} type='button' role='tab' aria-selected={tab === t.key} className={`tab-item${tab === t.key ? ' is-active' : ''}`} onClick={() => setTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>

          <div className='catalog-page__sort' role='group' aria-label='정렬'>
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.key}
                type='button'
                className={`catalog-page__sort-option${sortKey === option.key ? ' is-active' : ''}`}
                aria-pressed={sortKey === option.key}
                onClick={() => setSortKey(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>

          {status === 'error' && <p className='text-body-sm'>목록을 불러오지 못했습니다.</p>}

          {status === 'done' && sortedBooks.length === 0 ? (
            <EmptyState icon='books' title='표시할 도서가 없습니다' description='잠시 후 다시 시도해 주세요.' />
          ) : (
            <div className='catalog-page__list'>
              {sortedBooks.map((book) => (
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
