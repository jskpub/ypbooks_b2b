import { useEffect, useState } from 'react';
import BookCard, { type BookCardVariant } from '@/components/BookCard';
import EmptyState from '@/components/EmptyState';
import type { AladinItem } from '@/services/aladinApi';

interface BookListPageProps {
  title: string;
  fetcher: () => Promise<AladinItem[]>;
  variant: BookCardVariant;
  showPrice?: boolean;
  showRank?: boolean;
}

// 추천도서(BOOK-01)/베스트(BOOK-03)/신상품(BOOK-04) 목록 — design-system.md Book Card가
// "홈, 추천도서 선택" 두 컨텍스트를 함께 명시하고 있어 홈과 같은 카드 그리드로 구현한다.
export default function BookListPage({ title, fetcher, variant, showPrice = true, showRank = false }: BookListPageProps) {
  const [books, setBooks] = useState<AladinItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    fetcher()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher]);

  return (
    <main id='main' className='main'>
      <div className='container book-list-page'>
        <h1 className='book-list-page__title text-h1'>{title}</h1>

        {status === 'error' && <p className='text-body-sm'>목록을 불러오지 못했습니다.</p>}

        {status === 'done' && books.length === 0 ? (
          <EmptyState icon='books' title='표시할 도서가 없습니다' description='잠시 후 다시 시도해 주세요.' />
        ) : (
          <div className='book-list-page__grid'>
            {books.map((book, index) => (
              <BookCard
                key={book.itemId}
                variant={variant}
                isbn13={book.isbn13}
                title={book.title}
                author={book.author}
                coverSrc={book.cover}
                rank={showRank ? index + 1 : undefined}
                sellingPrice={book.priceSales}
                listPrice={book.priceStandard}
                showPrice={showPrice}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
