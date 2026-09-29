import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

interface BookListRowProps {
  isbn13: string;
  title: string;
  author: string;
  publisher: string;
  pubDate: string;
  categoryName: string;
  coverSrc?: string;
  sellingPrice: number;
  listPrice: number;
  /** "추천도서" 칩, 이달의 추천도서 목록 포함 여부 */
  isRecommended?: boolean;
  /** 있으면 순위 배지 표시 (Best 전용) */
  rank?: number;
}

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

// 알라딘 API가 태그를 제공하지 않아 태그 영역 자체를 표시하지 않음
export default function BookListRow({ isbn13, title, author, publisher, pubDate, categoryName, coverSrc, sellingPrice, listPrice, isRecommended, rank }: BookListRowProps) {
  const [qty, setQty] = useState(1);
  const discountRate = Math.round((1 - sellingPrice / listPrice) * 100);
  const categoryPath = categoryName.split('>').slice(1, 3).join(' > ') || categoryName;
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart({ isbn13, title, byline: `${author} · ${publisher}`, listPrice, sellingPrice, qty, coverSrc });
    showToast('장바구니에 담았습니다');
  };

  const handleBuyNow = () => {
    addToCart({ isbn13, title, byline: `${author} · ${publisher}`, listPrice, sellingPrice, qty, coverSrc });
    navigate('/payment');
  };

  return (
    <div className="book-list-row">
      <Link to={`/books/${isbn13}`} className="book-list-row__cover">
        {coverSrc ? <img src={coverSrc} alt="" /> : <Icon name="books" />}
        {rank != null && <span className="book-list-row__rank">{rank}</span>}
      </Link>

      <div className="book-list-row__info">
        {isRecommended && (
          <div className="book-list-row__chips">
            <span className="badge badge--recommended">
              <Icon name="star" />
              추천도서
            </span>
          </div>
        )}
        <p className="book-list-row__category caption">{categoryPath}</p>
        <Link to={`/books/${isbn13}`} className="book-list-row__title text-h4">
          {title}
        </Link>
        <p className="book-list-row__meta text-body-xs">
          {author} · {publisher} · {pubDate}
        </p>
        <div className="book-list-row__price-row">
          {discountRate > 0 && <span className="book-list-row__discount">{discountRate}%</span>}
          <span className="book-list-row__selling price-sm">{formatWon(sellingPrice)}</span>
          <span className="book-list-row__list text-body-xs">{formatWon(listPrice)}</span>
        </div>
      </div>

      <div className="book-list-row__actions">
        <div className="stepper stepper--sm">
          <button type="button" className="stepper__btn" aria-label="수량 감소" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))}>
            <Icon name="minus" />
          </button>
          <input
            type="number"
            min={1}
            step={1}
            className="stepper__value"
            value={qty}
            aria-label="수량"
            onChange={(event) => {
              const raw = event.target.value;
              if (raw === '') return;
              const value = Number(raw);
              if (Number.isInteger(value) && value >= 1) setQty(value);
            }}
            onBlur={(event) => {
              const value = Number(event.target.value);
              if (!Number.isInteger(value) || value < 1) setQty(1);
            }}
          />
          <button type="button" className="stepper__btn" aria-label="수량 증가" onClick={() => setQty((q) => q + 1)}>
            <Icon name="plus" />
          </button>
        </div>
        <button type="button" className="btn btn--secondary" onClick={handleAddToCart}>
          장바구니 담기
        </button>
        <button type="button" className="btn btn--primary" onClick={handleBuyNow}>
          바로 구매
        </button>
      </div>
    </div>
  );
}
