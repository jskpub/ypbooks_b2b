import { useEffect, useState } from 'react';
import BookCard from '@/components/BookCard';
import { Icon } from '@/components/Icon';
import type { PastRecommendationEntry } from '@/data/pastRecommendations';
import { fetchBookDetail, type AladinItem } from '@/services/aladinApi';

interface PastRecommendationRowProps {
  month: string;
  books: PastRecommendationEntry[];
}

const PAGE_SIZE = 5;

// 표지/제목/저자는 알라딘에서 조회해 채움, 추천대상은 목업 데이터(pastRecommendations.ts) 값 그대로 사용
export default function PastRecommendationRow({ month, books }: PastRecommendationRowProps) {
  const [details, setDetails] = useState<Record<string, AladinItem | null>>({});
  const [page, setPage] = useState(0);

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

  const pageCount = Math.max(1, Math.ceil(books.length / PAGE_SIZE));
  const atStart = page <= 0;
  const atEnd = page >= pageCount - 1;
  const pageBooks = books.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="past-recommendation-row">
      <p className="past-recommendation-row__month text-h4">{month}</p>
      <div className="past-recommendation-row__nav">
        <button
          type="button"
          className="side-button side-button--sm side-button--prev"
          aria-label={`${month} 이전 5권`}
          disabled={atStart}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          <Icon name="caret-right" />
        </button>
        <div className="past-recommendation-row__track">
          {pageBooks.map(({ isbn13, target }) => {
            const book = details[isbn13];
            return <BookCard key={isbn13} variant="past-recomment" isbn13={isbn13} title={book?.title ?? '불러오는 중…'} author={book?.author ?? ''} coverSrc={book?.cover} target={target} />;
          })}
        </div>
        <button
          type="button"
          className="side-button side-button--sm side-button--next"
          aria-label={`${month} 다음 5권`}
          disabled={atEnd}
          onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
        >
          <Icon name="caret-right" />
        </button>
      </div>
    </div>
  );
}
