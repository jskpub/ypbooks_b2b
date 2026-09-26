import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';

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
  /** "추천도서" 칩 — 이달의 추천도서 목록 포함 여부(BOOK-03/04 스펙). */
  isRecommended?: boolean;
  /** 있으면 순위 배지 표시(Best 전용). Figma "Book List" Property1=Best. */
  rank?: number;
}

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

// design-system.md에 없던 "Book List" 컴포넌트 — Figma node 90:260(Property 1=Default/Best) 기준으로
// 새로 만들었다. 베스트(BOOK-03)·신상품(BOOK-04) 목록에서 도서 1권을 가로 행으로 보여준다.
// 태그(#태그)는 알라딘이 임의 태그를 제공하지 않아 표시하지 않는다(스펙: 태그 없으면 영역 자체 숨김).
export default function BookListRow({ isbn13, title, author, publisher, pubDate, categoryName, coverSrc, sellingPrice, listPrice, isRecommended, rank }: BookListRowProps) {
  const [qty, setQty] = useState(1);
  const discountRate = Math.round((1 - sellingPrice / listPrice) * 100);
  const categoryPath = categoryName.split('>').slice(1, 3).join(' > ') || categoryName;

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
        <button type="button" className="btn btn--secondary">
          장바구니 담기
        </button>
        <button type="button" className="btn btn--primary">
          바로 구매
        </button>
      </div>
    </div>
  );
}
