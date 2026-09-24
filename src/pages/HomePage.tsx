import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BookCarousel from '@/components/BookCarousel';
import { fetchBestsellerBooks, fetchNewArrivalBooks, fetchRecommendedBooks, type AladinItem } from '@/services/aladinApi';

// 알라딘 리스트 API 하나를 홈 위젯 하나에 연결하는 작은 훅. 로딩/에러 상태만 최소로 다룬다.
function useAladinBooks(fetcher: () => Promise<AladinItem[]>) {
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
  }, []);

  return { books, status };
}

export default function HomePage() {
  const recommended = useAladinBooks(() => fetchRecommendedBooks());
  const bestseller = useAladinBooks(() => fetchBestsellerBooks(8));
  const newArrival = useAladinBooks(() => fetchNewArrivalBooks(8));

  return (
    <main id='main' className='main'>
      <div className='container home'>
        <section className='home-hero'>
          <p className='home-hero__eyebrow label-base'>임직원 독서 복지 프로그램</p>
          <h1 className='home-hero__headline'>읽고 싶은 책, 회사가 함께 삽니다</h1>
          <p className='home-hero__subtext text-body-lg'>추천도서는 회사가 전액 지원하고, 직접 고른 개인도서는 50%를 지원합니다.</p>
          <Link to='/recommend' className='home-hero__cta btn btn--primary btn--lg'>
            도서 둘러보기
          </Link>
        </section>

        <section className='home-section'>
          <div className='home-section__head'>
            <h2 className='home-section__title text-h2'>이달의 추천도서</h2>
            <Link className='home-section__more' to='/recommend'>
              더보기 &gt;
            </Link>
          </div>
          {recommended.status === 'error' && <p className='text-body-sm'>추천도서를 불러오지 못했습니다.</p>}
          <BookCarousel
            variant='home_bookcard'
            showPrice={false}
            items={recommended.books.map((book) => ({ id: book.itemId, isbn13: book.isbn13, title: book.title, author: book.author, coverSrc: book.cover }))}
          />
        </section>

        <section className='home-section'>
          <div className='home-section__head'>
            <h2 className='home-section__title text-h2'>주간 베스트셀러</h2>
            <Link className='home-section__more' to='/bestseller'>
              더보기 &gt;
            </Link>
          </div>
          {bestseller.status === 'error' && <p className='text-body-sm'>베스트셀러를 불러오지 못했습니다.</p>}
          <BookCarousel
            variant='home_best'
            items={bestseller.books.map((book, index) => ({
              id: book.itemId,
              isbn13: book.isbn13,
              title: book.title,
              author: book.author,
              coverSrc: book.cover,
              rank: index + 1,
              sellingPrice: book.priceSales,
              listPrice: book.priceStandard,
            }))}
          />
        </section>

        <section className='home-section'>
          <div className='home-section__head'>
            <h2 className='home-section__title text-h2'>신간 도서</h2>
            <Link className='home-section__more' to='/new'>
              더보기 &gt;
            </Link>
          </div>
          {newArrival.status === 'error' && <p className='text-body-sm'>신간 도서를 불러오지 못했습니다.</p>}
          <BookCarousel
            variant='home_bookcard'
            items={newArrival.books.map((book) => ({
              id: book.itemId,
              isbn13: book.isbn13,
              title: book.title,
              author: book.author,
              coverSrc: book.cover,
              sellingPrice: book.priceSales,
              listPrice: book.priceStandard,
            }))}
          />
        </section>
      </div>
    </main>
  );
}
