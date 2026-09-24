import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookCard from '@/components/BookCard';
import { searchBooks, type AladinItem } from '@/services/aladinApi';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [books, setBooks] = useState<AladinItem[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  useEffect(() => {
    if (!query) {
      setBooks([]);
      setStatus('idle');
      return;
    }
    let cancelled = false;
    setStatus('loading');
    searchBooks(query)
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
  }, [query]);

  return (
    <main id='main' className='main'>
      <div className='container home'>
        <section className='home-section'>
          <div className='home-section__head'>
            <h2 className='home-section__title text-h2'>{query ? `'${query}' 검색 결과` : '개인도서 검색'}</h2>
          </div>
          {status === 'idle' && <p className='text-body-sm'>상단 검색창에 도서명, 저자명을 입력해 보세요.</p>}
          {status === 'loading' && <p className='text-body-sm'>검색 중...</p>}
          {status === 'error' && <p className='text-body-sm'>검색에 실패했습니다. 잠시 후 다시 시도해 주세요.</p>}
          {status === 'done' && books.length === 0 && <p className='text-body-sm'>검색 결과가 없습니다.</p>}
          <div className='home-section__row'>
            {books.map((book) => (
              <BookCard
                key={book.itemId}
                variant='home_bookcard'
                isbn13={book.isbn13}
                title={book.title}
                author={book.author}
                coverSrc={book.cover}
                sellingPrice={book.priceSales}
                listPrice={book.priceStandard}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
