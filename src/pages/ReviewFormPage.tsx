import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { CURRENT_USER_NAME } from '@/data/currentUser';
import { getReadingStatusList } from '@/data/readingStatusStore';
import type { ReviewVisibility } from '@/data/reviews';
import { getMyReviewByIsbn, saveReview } from '@/data/reviewStore';
import { fetchAiQuestion, FALLBACK_AI_QUESTION } from '@/services/aiApi';
import { fetchBookDetail, type AladinItem } from '@/services/aladinApi';

const MAX_RATING = 5;
const VISIBILITY_OPTIONS: { key: ReviewVisibility; label: string }[] = [
  { key: 'private', label: '비공개' },
  { key: 'public-anonymous', label: '익명 공개' },
  { key: 'public-real', label: '실명 공개' },
];

// REVIEW-04. 신규 작성/수정을 한 화면에서 처리한다(REVIEW_SPEC.md "화면 분리 원칙").
// 공개범위는 스펙상 별도 모달이지만, 지금 단계에서는 폼 안 라디오로 간단히 둔다.
export default function ReviewFormPage() {
  const { isbn13 = '' } = useParams<{ isbn13: string }>();
  const navigate = useNavigate();

  const existing = getMyReviewByIsbn(isbn13);
  const isEditing = Boolean(existing);
  const statusItem = getReadingStatusList().find((item) => item.isbn13 === isbn13);

  const [book, setBook] = useState<AladinItem | null>(null);
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [oneLiner, setOneLiner] = useState(existing?.oneLiner ?? '');
  const [detail, setDetail] = useState(existing?.detail ?? '');
  const [visibility, setVisibility] = useState<ReviewVisibility>(existing?.visibility ?? 'private');
  const [aiQuestion, setAiQuestion] = useState(existing?.aiQuestion ?? '');
  const [aiLoading, setAiLoading] = useState(!isEditing);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookDetail(isbn13).then(setBook);
  }, [isbn13]);

  useEffect(() => {
    if (isEditing || !book) return;
    let cancelled = false;
    setAiLoading(true);
    fetchAiQuestion({ title: book.title, author: book.author, category: book.categoryName })
      .then((question) => {
        if (!cancelled) setAiQuestion(question);
      })
      .finally(() => {
        if (!cancelled) setAiLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book, isEditing]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (rating === 0 || !detail.trim()) {
      setError('별점과 답변을 입력해주세요.');
      return;
    }
    const now = new Date().toISOString().slice(0, 10);
    saveReview({
      id: existing?.id ?? `review-${isbn13}-${CURRENT_USER_NAME}`,
      isbn13,
      bookTitle: book?.title ?? existing?.bookTitle ?? '',
      bookAuthor: book?.author ?? existing?.bookAuthor ?? '',
      publisher: existing?.publisher ?? '',
      coverIcon: existing?.coverIcon ?? 'books',
      authorName: CURRENT_USER_NAME,
      visibility,
      rating,
      oneLiner: oneLiner.slice(0, 50),
      aiQuestion: aiQuestion || FALLBACK_AI_QUESTION,
      detail,
      createdAt: existing?.createdAt ?? now,
      updatedAt: existing ? now : undefined,
      likeCount: existing?.likeCount ?? 0,
      likedByMe: existing?.likedByMe ?? false,
    });
    navigate('/myreview');
  };

  return (
    <main id='main' className='main'>
      <div className='container review-form'>
        <h1 className='text-h1'>{isEditing ? '서평 수정' : '서평 작성'}</h1>

        <div className='review-form__book'>
          <div className='review-form__cover'>{book?.cover ? <img src={book.cover} alt='' /> : <Icon name='books' />}</div>
          <div>
            <p className='text-h4'>{book?.title ?? '불러오는 중…'}</p>
            <p className='text-body-sm'>{book?.author}</p>
            {statusItem && (
              <p className='caption'>
                구매일 {statusItem.purchasedAt}
                {statusItem.completedAt && ` · 독서완료일 ${statusItem.completedAt}`}
              </p>
            )}
            {isEditing && existing && (
              <p className='caption'>
                등록일 {existing.createdAt}
                {existing.updatedAt && ` · 수정일 ${existing.updatedAt}`}
              </p>
            )}
          </div>
        </div>

        <form className='review-form__form' onSubmit={handleSubmit}>
          <div className='review-form__field'>
            <span className='review-form__label label-base'>별점</span>
            <div className='review-form__stars' role='radiogroup' aria-label='별점'>
              {Array.from({ length: MAX_RATING }, (_, index) => {
                const value = index + 1;
                return (
                  <button
                    key={value}
                    type='button'
                    role='radio'
                    aria-checked={rating === value}
                    aria-label={`${value}점`}
                    className='review-form__star'
                    onClick={() => setRating(value)}
                  >
                    <Icon name='star' className={`icon${value <= rating ? ' is-filled' : ''}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className='review-form__field'>
            <label className='review-form__label label-base' htmlFor='oneLiner'>
              한줄평
            </label>
            <input
              id='oneLiner'
              type='text'
              className='review-form__input'
              maxLength={50}
              value={oneLiner}
              onChange={(event) => setOneLiner(event.target.value)}
              placeholder='이 책을 한 줄로 요약하면?'
            />
          </div>

          <div className='review-form__field'>
            <span className='review-form__label caption-strong'>Q. {aiLoading ? 'AI가 질문을 생성하는 중…' : aiQuestion || FALLBACK_AI_QUESTION}</span>
            <textarea
              className='review-form__textarea'
              rows={5}
              value={detail}
              onChange={(event) => setDetail(event.target.value)}
              placeholder='자유롭게 답변해 주세요.'
            />
          </div>

          <div className='review-form__field'>
            <span className='review-form__label label-base'>공개 범위</span>
            <div className='review-form__visibility' role='radiogroup' aria-label='공개 범위'>
              {VISIBILITY_OPTIONS.map((option) => (
                <label key={option.key} className='review-form__visibility-option'>
                  <input type='radio' name='visibility' checked={visibility === option.key} onChange={() => setVisibility(option.key)} />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          {error && <p className='review-form__error text-body-sm'>{error}</p>}

          <button type='submit' className='btn btn--primary btn--lg'>
            {isEditing ? '수정 완료' : '등록하기'}
          </button>
        </form>
      </div>
    </main>
  );
}
