import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import type { Review } from '@/data/reviews';

const MAX_RATING = 5;

interface ReviewCardProps {
  review: Review;
  /** 알라딘 ItemLookUp으로 가져온 실제 표지 — 조회 실패/로딩 중엔 review.coverIcon으로 대체한다. */
  coverSrc?: string;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
}

function formatDate(isoDate: string) {
  return isoDate.replaceAll('-', '.');
}

export default function ReviewCard({ review, coverSrc, isLiked, onToggleLike }: ReviewCardProps) {
  const authorLabel = review.visibility === 'public-anonymous' ? '익명' : review.authorName;
  const likeCount = review.likeCount + (isLiked ? 1 : 0);
  const detailPath = `/books/${review.isbn13}`;

  return (
    <article className='review-card'>
      <div className='review-card__main'>
        <p className='review-card__writer label-lg'>{authorLabel}</p>

        <div>
          <div className='review-card__title-row'>
            <Link to={detailPath} className='review-card__title text-h4'>
              {review.bookTitle}
            </Link>
            <span className='review-card__rating' role='img' aria-label={`별점 ${review.rating}점 (5점 만점)`}>
              {Array.from({ length: MAX_RATING }, (_, index) => (
                <Icon key={index} name='star' className={`icon review-card__star${index < review.rating ? ' is-filled' : ''}`} />
              ))}
            </span>
          </div>
          <p className='review-card__byline caption'>
            {review.bookAuthor} · {review.publisher}
          </p>
        </div>

        <p className='review-card__one-liner text-body-lg'>{review.oneLiner}</p>

        <div className='review-card__detail'>
          <p className='review-card__question caption-strong'>Q. {review.aiQuestion}</p>
          <p className='review-card__answer text-body-sm'>{review.detail}</p>
        </div>

        <button
          type='button'
          className={`review-card__like${isLiked ? ' is-active' : ''}`}
          aria-pressed={isLiked}
          aria-label={`좋아요 ${likeCount}`}
          onClick={() => onToggleLike(review.id)}
        >
          <Icon name='heart' />
          <span aria-hidden='true'>{likeCount}</span>
        </button>
      </div>

      <div className='review-card__aside'>
        <p className='review-card__date caption'>{review.updatedAt ? `${formatDate(review.updatedAt)} (수정)` : formatDate(review.createdAt)}</p>
        {/* 표지는 제목과 같은 곳으로 가므로 탭 순서에서 뺀다. */}
        <Link to={detailPath} className='review-card__cover' tabIndex={-1} aria-hidden='true'>
          {coverSrc ? <img src={coverSrc} alt='' /> : <Icon name={review.coverIcon} />}
        </Link>
      </div>
    </article>
  );
}
