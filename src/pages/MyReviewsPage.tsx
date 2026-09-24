import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '@/components/EmptyState';
import { Icon } from '@/components/Icon';
import type { Review, ReviewVisibility } from '@/data/reviews';
import { getMyReviews, saveReview } from '@/data/reviewStore';
import { fetchBookDetail } from '@/services/aladinApi';

const VISIBILITY_OPTIONS: { key: ReviewVisibility; label: string }[] = [
  { key: 'private', label: '비공개' },
  { key: 'public-anonymous', label: '익명 공개' },
  { key: 'public-real', label: '실명 공개' },
];

// REVIEW-03. 계정 드롭다운(마이페이지) UI가 아직 없어서 /myreview로 직접 진입한다.
export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(() => getMyReviews());
  const [covers, setCovers] = useState<Record<string, string>>({});

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

  const handleVisibilityChange = (review: Review, visibility: ReviewVisibility) => {
    const updated = { ...review, visibility };
    saveReview(updated);
    setReviews((prev) => prev.map((r) => (r.id === review.id ? updated : r)));
  };

  return (
    <main id='main' className='main'>
      <div className='container my-reviews'>
        <h1 className='text-h1'>나의 서평</h1>

        {reviews.length === 0 ? (
          <EmptyState icon='books' title='아직 작성한 서평이 없습니다' description='완독한 책의 서평을 남겨 보세요.' actionLabel='독서현황 보러가기' onAction={() => (window.location.href = '/myreading')} />
        ) : (
          <ul className='my-reviews__list'>
            {reviews.map((review) => (
              <li key={review.id} className='my-reviews__item'>
                <div className='my-reviews__cover'>{covers[review.isbn13] ? <img src={covers[review.isbn13]} alt='' /> : <Icon name='books' />}</div>
                <div className='my-reviews__info'>
                  <p className='text-h4'>{review.bookTitle}</p>
                  <p className='caption'>
                    {review.updatedAt ? `${review.updatedAt} 수정` : `${review.createdAt} 작성`} · 별점 {review.rating}
                  </p>
                  <p className='text-body-sm'>{review.oneLiner}</p>
                </div>
                <div className='my-reviews__actions'>
                  <div className='my-reviews__visibility' role='radiogroup' aria-label='공개 범위'>
                    {VISIBILITY_OPTIONS.map((option) => (
                      <label key={option.key} className='my-reviews__visibility-option'>
                        <input type='radio' name={`visibility-${review.id}`} checked={review.visibility === option.key} onChange={() => handleVisibilityChange(review, option.key)} />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  <Link to={`/myreview/write/${review.isbn13}`} className='btn btn--secondary'>
                    서평 수정
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
