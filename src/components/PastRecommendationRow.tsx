import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import type { PastRecommendationEntry } from '@/data/pastRecommendations';
import { fetchBookDetail, type AladinItem } from '@/services/aladinApi';

interface PastRecommendationRowProps {
  month: string;
  books: PastRecommendationEntry[];
}

// BOOK-01 "지난 추천 도서" — 월별로 과거 추천작을 작은 카드 행으로 보여준다. 목업 이력
// (src/data/pastRecommendations.ts)의 ISBN마다 알라딘에서 표지/제목/저자를 조회해 채운다.
export default function PastRecommendationRow({ month, books }: PastRecommendationRowProps) {
  const [details, setDetails] = useState<Record<string, AladinItem | null>>({});

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      books.map(async ({ isbn13 }) => {
        try {
          return [isbn13, await fetchBookDetail(isbn13)] as const;
        } catch {
          return [isbn13, null] as const;
        }
      }),
    ).then((entries) => {
      if (!cancelled) setDetails(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, [books]);

  return (
    <div className="past-recommendation-row">
      <p className="past-recommendation-row__month text-h4">{month}</p>
      <div className="past-recommendation-row__track">
        {books.map(({ isbn13, target }) => {
          const book = details[isbn13];
          return (
            <Link key={isbn13} to={`/books/${isbn13}`} className="past-card">
              <span className="past-card__cover">{book?.cover ? <img src={book.cover} alt="" /> : <Icon name="books" />}</span>
              <span className="past-card__target caption">{target}</span>
              <span className="past-card__title text-body-xs">{book?.title ?? '불러오는 중…'}</span>
              <span className="past-card__author caption">{book?.author}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
