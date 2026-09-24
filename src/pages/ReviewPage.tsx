import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '@/components/EmptyState';
import ReviewCard from '@/components/Review/ReviewCard';
import { getAllReviews } from '@/data/reviewStore';
import { fetchBookDetail } from '@/services/aladinApi';

type SortKey = 'latest' | 'likes';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'latest', label: '최신순' },
  { key: 'likes', label: '좋아요순' },
];

export default function ReviewPage() {
  // 컴포넌트 바깥(모듈 최상단)에서 한 번만 읽으면 서평 작성 후 뒤로 돌아왔을 때도 그대로 캐시된
  // 값을 보여준다 — 마운트마다(= 이 화면에 올 때마다) 다시 읽어야 방금 쓴 서평이 반영된다.
  const publicReviews = useMemo(() => getAllReviews().filter((review) => review.visibility !== 'private'), []);
  const [sortKey, setSortKey] = useState<SortKey>('latest');
  const [likedIds, setLikedIds] = useState(() => new Set(publicReviews.filter((review) => review.likedByMe).map((review) => review.id)));
  // isbn13 -> 알라딘 표지 URL. 조회 전/실패 시엔 undefined로 두고 ReviewCard가 coverIcon으로 대체한다.
  const [covers, setCovers] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    const isbnList = [...new Set(publicReviews.map((review) => review.isbn13))];
    Promise.all(
      isbnList.map(async (isbn13) => {
        try {
          const item = await fetchBookDetail(isbn13);
          return [isbn13, item?.cover] as const;
        } catch {
          return [isbn13, undefined] as const;
        }
      }),
    ).then((entries) => {
      if (cancelled) return;
      const next: Record<string, string> = {};
      for (const [isbn13, cover] of entries) {
        if (cover) next[isbn13] = cover;
      }
      setCovers(next);
    });
    return () => {
      cancelled = true;
    };
  }, [publicReviews]);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sortedReviews = useMemo(
    () => [...publicReviews].sort((a, b) => (sortKey === 'likes' ? b.likeCount - a.likeCount : b.createdAt.localeCompare(a.createdAt))),
    [sortKey],
  );

  return (
    <main id='main' className='main'>
      <div className='container review-feed'>
        <div className='review-feed__head'>
          <h1>서평</h1>
          <Link to='/myreading' className='btn btn--secondary'>
            마이페이지에서 내 서평 쓰기
          </Link>
        </div>

        <div className='review-feed__controls'>
          <div className='review-sort' role='group' aria-label='정렬'>
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.key}
                type='button'
                className={`review-sort__option${sortKey === option.key ? ' is-active' : ''}`}
                aria-pressed={sortKey === option.key}
                onClick={() => setSortKey(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {sortedReviews.length > 0 ? (
          <ul className='review-feed__list'>
            {sortedReviews.map((review) => (
              <li key={review.id}>
                <ReviewCard review={review} coverSrc={covers[review.isbn13]} isLiked={likedIds.has(review.id)} onToggleLike={toggleLike} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon='books' title='아직 공개된 서평이 없습니다' description='완독한 책의 서평을 공개하면 이곳에 모입니다.' />
        )}
      </div>
    </main>
  );
}
