import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

interface PickedBookProps {
  isbn13: string;
  title: string;
  author: string;
  publisher: string;
  pubDate: string;
  categoryName: string;
  coverSrc?: string;
  target: string;
  reason: string;
  ratingAverage: number;
  reviewCount: number;
  sellingPrice: number;
  listPrice: number;
  /** design-system.md Bookmark — 큐레이션 목록 외 B2B 관리자가 직접 추가한 도서에만 존재(예: "CEO 추천"). */
  badgeLabel?: string;
  badgeColor?: 'gray' | 'orange' | 'green' | 'teal' | 'blue' | 'purple' | 'pink';
}

// design-system.md "Picked Book" 패턴(홈 추천 영역/추천도서 목록 상단) — BOOK-01의 대표 도서
// 영역(Figma feat-wrap)을 그대로 구현한다. Display 크기를 쓰는 유일한 패턴.
export default function PickedBook({ isbn13, title, author, publisher, pubDate, categoryName, coverSrc, target, reason, ratingAverage, reviewCount, sellingPrice, listPrice, badgeLabel, badgeColor }: PickedBookProps) {
  const category = categoryName.split('>').slice(1, 3).join(' > ') || categoryName;
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart({ isbn13, title, byline: `${author} · ${publisher}`, listPrice, sellingPrice, qty: 1 });
    showToast('장바구니에 담았습니다');
  };

  const handleBuyNow = () => {
    addToCart({ isbn13, title, byline: `${author} · ${publisher}`, listPrice, sellingPrice, qty: 1 });
    navigate('/payment');
  };

  return (
    <>
      <p className="picked-book__target-label">{target}</p>
      <div className="picked-book">
        <Link to={`/books/${isbn13}`} className="picked-book__cover">
          {badgeLabel && <span className={`bookmark-chip bookmark-chip--${badgeColor ?? 'gray'}`}>{badgeLabel}</span>}
          {coverSrc ? <img src={coverSrc} alt="" /> : <Icon name="books" />}
        </Link>

        <div className="picked-book__info">
          <Link to={`/books/${isbn13}`} className="picked-book__title text-display-lg">
            {title}
          </Link>
          <p className="picked-book__byline text-body">
            {author} · {publisher}
          </p>
          <p className="picked-book__meta caption-lg">
            {pubDate} · {category}
          </p>

          <div className="picked-book__stats caption-lg">
            <span>
              {reviewCount > 0 ? (
                <>
                  평점 {ratingAverage.toFixed(1)} · 서평 {reviewCount}개
                </>
              ) : (
                '아직 서평이 없어요'
              )}
            </span>
            <span>아직 구매 데이터가 모이지 않았어요</span>
          </div>

          <p className="picked-book__reason text-body">{reason}</p>

          <div className="picked-book__actions">
            <button type="button" className="btn btn--secondary btn--lg" onClick={handleAddToCart}>
              장바구니 담기
            </button>
            <button type="button" className="btn btn--primary btn--lg" onClick={handleBuyNow}>
              바로 구매
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
