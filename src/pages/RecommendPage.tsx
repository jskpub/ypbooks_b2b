import { useEffect, useState } from 'react';
import PastRecommendationRow from '@/components/PastRecommendationRow';
import PickedBook from '@/components/PickedBook';
import RecommendThumbCarousel from '@/components/RecommendThumbCarousel';
import { pastRecommendations } from '@/data/pastRecommendations';
import { getReviewStatsByIsbn } from '@/data/reviewStore';
import { fetchRecommendedBooks, type RecommendedAladinItem } from '@/services/aladinApi';

const CURRENT_MONTH_LABEL = `${new Date().getMonth() + 1}월`;

// 더보기(⑮) 스펙: 기본 3개월 노출 → 클릭 시 3개월씩 추가, 더 없으면 버튼 숨김.
const MONTHS_PAGE_SIZE = 3;

// BOOK-01. Figma node 84:50 기준 — 배너 + Picked Book(대표 도서, 썸네일로 전환) + 지난 추천 도서.
export default function RecommendPage() {
  const [books, setBooks] = useState<RecommendedAladinItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visibleMonths, setVisibleMonths] = useState(MONTHS_PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;
    fetchRecommendedBooks()
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
  }, []);

  const selected = books[selectedIndex];
  const stats = selected ? getReviewStatsByIsbn(selected.isbn13) : { average: 0, count: 0 };

  return (
    <main id='main' className='main'>
      <div className='container recommend-page'>
        <section className='recommend-banner'>
          <p className='recommend-banner__eyebrow label-base'>도서비 100% 지원</p>
          <h1 className='recommend-banner__title'>{CURRENT_MONTH_LABEL} 추천도서</h1>
          <p className='recommend-banner__subtext text-body-lg'>영풍문고가 직접 선정하고 추천 이유를 전해드립니다</p>
        </section>

        {status === 'error' && <p className='text-body-sm'>추천도서를 불러오지 못했습니다.</p>}

        {selected && (
          <>
            <PickedBook
              isbn13={selected.isbn13}
              title={selected.title}
              author={selected.author}
              publisher={selected.publisher}
              pubDate={selected.pubDate}
              categoryName={selected.categoryName}
              coverSrc={selected.cover}
              target={selected.target}
              reason={selected.recommendReason}
              ratingAverage={stats.average}
              reviewCount={stats.count}
              badgeLabel={selected.badgeLabel}
              badgeColor={selected.badgeColor}
            />

            <RecommendThumbCarousel
              items={books.map((book) => ({ isbn13: book.isbn13, title: book.title, cover: book.cover }))}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
            />
          </>
        )}

        <section className='past-recommendations'>
          <h2 className='past-recommendations__title text-h2'>지난 추천 도서</h2>
          {pastRecommendations.slice(0, visibleMonths).map((month) => (
            <PastRecommendationRow key={month.month} month={month.month} books={month.books} />
          ))}
          {visibleMonths < pastRecommendations.length && (
            <button type='button' className='past-recommendations__more' onClick={() => setVisibleMonths((v) => v + MONTHS_PAGE_SIZE)}>
              더보기
            </button>
          )}
        </section>
      </div>
    </main>
  );
}
