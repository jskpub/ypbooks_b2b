import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import EmptyState from '@/components/EmptyState';
import ReviewCard from '@/components/Review/ReviewCard';
import type { Review, ReviewVisibility } from '@/data/reviews';
import { deleteReview, getMyReviews, saveReview } from '@/data/reviewStore';
import { fetchBookDetail } from '@/services/aladinApi';
import { getSessionUser } from '@/data/auth';

// 계정 드롭다운(마이페이지) UI 부재로 /myreview 직접 진입
// 서평 피드와 같은 ReviewCard 재사용, 좋아요 대신 관리 메뉴(공개범위/수정/삭제) 노출하는 'mine' variant 사용
export default function MyReviewsPage() {
  const user = getSessionUser();
  const location = useLocation();
  const [reviews, setReviews] = useState<Review[]>(() => getMyReviews());
  const [covers, setCovers] = useState<Record<string, string>>({});
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState(() => new Set(reviews.filter((review) => review.likedByMe).map((review) => review.id)));

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

  // /myreading "서평 보기"는 #review-{id} 해시로 진입, 해당 카드로 스크롤 후 잠깐 강조 표시
  useEffect(() => {
    // 리뷰 id에 한글 포함 시 주소창엔 퍼센트 인코딩된 채로 남지만 DOM id는 원문이라 디코딩 없이는 getElementById 실패
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
    <main id='main' className='main my-page-layout'>
      <div className='container my-page-layout__inner'>
        <aside className='my-page-sidebar'>
          <div className='my-page-sidebar__user'>
            <p className='text-h3'>{user?.name ?? '김민서'} 님</p>
            <p className='caption'>한결그룹</p>
          </div>
          
          <nav className='my-page-nav'>
            <div className='my-page-nav__group'>
              <h4 className='my-page-nav__title'>쇼핑 & 주문 관리</h4>
              <ul>
                <li><Link to="/mypage">마이페이지 홈</Link></li>
                <li><Link to="/orders">주문 / 배송 조회</Link></li>
              </ul>
            </div>
            <div className='my-page-nav__group'>
              <h4 className='my-page-nav__title'>복지 혜택</h4>
              <ul>
                <li><Link to="/subsidy">나의 지원금 현황</Link></li>
              </ul>
            </div>
            <div className='my-page-nav__group'>
              <h4 className='my-page-nav__title'>독서 서재</h4>
              <ul>
                <li><Link to="/myreading">나의 독서현황</Link></li>
                <li className='is-active'><Link to="/myreview">나의 서평</Link></li>
                <li><Link to="/mystats">독서 통계</Link></li>
              </ul>
            </div>
            <div className='my-page-nav__group'>
              <h4 className='my-page-nav__title'>계정 & 설정</h4>
              <ul>
                <li><Link to="/profile">회원 정보 조회</Link></li>
              </ul>
            </div>
          </nav>
        </aside>

        <div className='my-page-content'>
          <div className='my-page-content__header'>
            <h1 className='text-h1'>나의 서평</h1>
          </div>

          <div className='my-reviews'>

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
                  isLiked={likedIds.has(review.id)}
                  onToggleLike={toggleLike}
                  onChangeVisibility={handleChangeVisibility}
                  onDelete={handleDelete}
                />
              </li>
            ))}
          </ul>
        )}
          </div>
        </div>
      </div>
    </main>
  );
}
