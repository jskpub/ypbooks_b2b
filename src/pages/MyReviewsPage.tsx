import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import EmptyState from '@/components/EmptyState';
import ReviewCard from '@/components/Review/ReviewCard';
import type { Review, ReviewVisibility } from '@/data/reviews';
import { deleteReview, getMyReviews, saveReview } from '@/data/reviewStore';
import { fetchBookDetail } from '@/services/aladinApi';

// REVIEW-03. 계정 드롭다운(마이페이지) UI가 아직 없어서 /myreview로 직접 진입한다.
// REVIEW-01(서평 피드)과 같은 ReviewCard를 재사용하되, 좋아요 대신 관리 메뉴(공개범위 설정/
// 수정하기/삭제하기)를 노출하는 'mine' variant로 렌더링한다.
export default function MyReviewsPage() {
  const location = useLocation();
  const [reviews, setReviews] = useState<Review[]>(() => getMyReviews());
  const [covers, setCovers] = useState<Record<string, string>>({});
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      reviews.map(async (review) => {
        try {
          const item = await fetchBookDetail(review.isbn13);
          return [review.isbn13, item?.cover] as const;
        } catch {
          return [review.isbn13, undefined] as const;
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
  }, [reviews]);

  // 서평엔 개별 상세 페이지가 없어서, /myreading의 "서평 보기"는 #review-{id} 해시로 이 목록에
  // 진입시킨다 — 여기서 그 해시를 보고 해당 카드로 스크롤하고 잠깐 강조 표시한다.
  useEffect(() => {
    // 리뷰 id에 한글이 섞여 있으면 주소창엔 퍼센트 인코딩(%EA%B7%B8...)된 채로 남는데,
    // DOM의 id 속성은 원문 그대로라 디코딩하지 않으면 getElementById가 못 찾는다.
    const hash = decodeURIComponent(location.hash.replace('#', ''));
    if (!hash.startsWith('review-')) return;
    const el = document.getElementById(hash);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const id = hash.slice('review-'.length);
    setHighlightedId(id);
    const timer = setTimeout(() => setHighlightedId(null), 1600);
    return () => clearTimeout(timer);
  }, [location.hash]);

  const handleChangeVisibility = (id: string, visibility: ReviewVisibility) => {
    setReviews((prev) =>
      prev.map((review) => {
        if (review.id !== id) return review;
        const updated = { ...review, visibility };
        saveReview(updated);
        return updated;
      }),
    );
  };

  const handleDelete = (id: string) => {
    deleteReview(id);
    setReviews((prev) => prev.filter((review) => review.id !== id));
  };

  return (
    <main id='main' className='main'>
      <div className='container my-reviews'>
        <h1 className='text-h1'>나의 서평</h1>

        {reviews.length === 0 ? (
          <EmptyState
            icon='books'
            title='아직 작성한 서평이 없습니다'
            description='완독한 책의 서평을 남겨 보세요.'
            actionLabel='독서현황 보러가기'
            onAction={() => (window.location.href = '/myreading')}
          />
        ) : (
          <ul className='review-feed__list'>
            {reviews.map((review) => (
              <li key={review.id} id={`review-${review.id}`} className={highlightedId === review.id ? 'is-highlighted' : undefined}>
                <ReviewCard
                  review={review}
                  coverSrc={covers[review.isbn13]}
                  variant='mine'
                  onChangeVisibility={handleChangeVisibility}
                  onDelete={handleDelete}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
