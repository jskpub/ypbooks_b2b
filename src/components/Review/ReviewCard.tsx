import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import type { Review, ReviewVisibility } from '@/data/reviews';
import { isAiGeneratedQuestion } from '@/services/aiApi';

const MAX_RATING = 5;

const VISIBILITY_OPTIONS: { key: ReviewVisibility; label: string }[] = [
  { key: 'private', label: '비공개' },
  { key: 'public-anonymous', label: '익명 공개' },
  { key: 'public-real', label: '실명 공개' },
];

type MenuMode = 'root' | 'visibility' | 'delete';

interface ReviewCardProps {
  review: Review;
  /** 알라딘 ItemLookUp으로 가져온 실제 표지 — 조회 실패/로딩 중엔 review.coverIcon으로 대체한다. */
  coverSrc?: string;
  /** 'public': GNB 서평 피드(REVIEW-01, 좋아요). 'mine': 나의 서평(REVIEW-03, 관리 메뉴). */
  variant?: 'public' | 'mine';
  isLiked?: boolean;
  onToggleLike?: (id: string) => void;
  onChangeVisibility?: (id: string, visibility: ReviewVisibility) => void;
  onDelete?: (id: string) => void;
}

function formatDate(isoDate: string) {
  return isoDate.replaceAll('-', '.');
}

export default function ReviewCard({ review, coverSrc, variant = 'public', isLiked = false, onToggleLike, onChangeVisibility, onDelete }: ReviewCardProps) {
  // 'mine'(나의 서평)은 항상 본인 글이라 실명으로 보여준다 — 자기 자신에게 "익명"으로 마스킹해봤자
  // 헷갈리기만 하고, 공개 범위는 메뉴 옆 라벨로 따로 보여준다. 'public'(다른 사람이 보는 GNB 피드)만
  // 공개 범위에 따라 실제로 이름을 가린다.
  const authorLabel = variant === 'mine' ? review.authorName : review.visibility === 'public-anonymous' ? '익명' : review.authorName;
  const visibilityLabel = VISIBILITY_OPTIONS.find((option) => option.key === review.visibility)?.label;
  const likeCount = review.likeCount + (isLiked ? 1 : 0);
  const detailPath = `/books/${review.isbn13}`;
  const editPath = `/myreview/write/${review.isbn13}`;

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMode, setMenuMode] = useState<MenuMode>('root');
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => {
    setMenuOpen(false);
    setMenuMode('root');
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) closeMenu();
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [menuOpen]);

  return (
    <article className='review-card'>
      {variant === 'mine' && (
        <div className='review-card__topbar' ref={menuRef}>
          <div className='review-card__menu'>
            <div className='review-card__menu-head'>
              <span className='review-card__visibility-label caption'>{visibilityLabel}</span>
              <button
                type='button'
                className='review-card__menu-trigger'
                aria-haspopup='menu'
                aria-expanded={menuOpen}
                aria-label='서평 관리 메뉴'
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <Icon name='dots-three-vertical' />
              </button>
            </div>

            {menuOpen && (
              <div className='review-card__menu-panel' role='menu'>
                {menuMode === 'root' && (
                  <>
                    <button type='button' role='menuitem' className='review-card__menu-item' onClick={() => setMenuMode('visibility')}>
                      공개 범위 설정
                    </button>
                    <Link to={editPath} role='menuitem' className='review-card__menu-item' onClick={closeMenu}>
                      수정하기
                    </Link>
                    <button type='button' role='menuitem' className='review-card__menu-item is-danger' onClick={() => setMenuMode('delete')}>
                      삭제하기
                    </button>
                  </>
                )}

                {menuMode === 'visibility' && (
                  <div className='review-card__menu-visibility' role='radiogroup' aria-label='공개 범위'>
                    {VISIBILITY_OPTIONS.map((option) => (
                      <label key={option.key} className='review-card__menu-radio'>
                        <input
                          type='radio'
                          name={`visibility-${review.id}`}
                          checked={review.visibility === option.key}
                          onChange={() => {
                            onChangeVisibility?.(review.id, option.key);
                            closeMenu();
                          }}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                )}

                {menuMode === 'delete' && (
                  <div className='review-card__menu-confirm'>
                    <p className='caption'>정말 삭제할까요?</p>
                    <div className='review-card__menu-confirm-actions'>
                      <button type='button' className='btn btn--tertiary btn--sm' onClick={closeMenu}>
                        취소
                      </button>
                      <button
                        type='button'
                        className='btn btn--danger btn--sm'
                        onClick={() => {
                          onDelete?.(review.id);
                          closeMenu();
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className='review-card__body'>
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
            <p className='review-card__question caption-strong'>
              Q. {review.aiQuestion}
              {isAiGeneratedQuestion(review.aiQuestion) && (
                <span className='badge badge--general review-card__ai-badge'>
                  <Icon name='sparkle' />
                  AI 생성
                </span>
              )}
            </p>
            <p className='review-card__answer text-body-sm'>{review.detail}</p>
          </div>

          <button
            type='button'
            className={`review-card__like${isLiked ? ' is-active' : ''}`}
            aria-pressed={isLiked}
            aria-label={`좋아요 ${likeCount}`}
            onClick={() => onToggleLike?.(review.id)}
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
      </div>
    </article>
  );
}
