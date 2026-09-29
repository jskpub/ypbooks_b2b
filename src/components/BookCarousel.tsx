import { useState } from 'react';
import BookCard, { type BookCardVariant } from '@/components/BookCard';
import { Icon } from '@/components/Icon';

export interface BookCarouselItem {
  id: string | number;
  isbn13: string;
  title: string;
  author: string;
  coverSrc?: string;
  rank?: number;
  sellingPrice?: number;
  listPrice?: number;
}

interface BookCarouselProps {
  items: BookCarouselItem[];
  variant: BookCardVariant;
  showPrice?: boolean;
  perPage?: number;
}

// SCSS 카드 폭·gap 토큰을 JS로 끌어오는 구조 부재, SCSS 값 변경 시 아래 상수도 함께 수정 필요
const CARD_WIDTH_PX = 240;
const CARD_GAP_PX = 24;

// perPage 기본값 5는 side-button·gap 포함 필요 폭(1428px)이 컨테이너 폭(1240px)을 초과해 카드가 잘림, 4로 설정해 방지
export default function BookCarousel({ items, variant, showPrice = true, perPage = 4 }: BookCarouselProps) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(items.length / perPage));
  const atStart = page <= 0;
  const atEnd = page >= pageCount - 1;
  const pageWidthPx = perPage * CARD_WIDTH_PX + (perPage - 1) * CARD_GAP_PX;

  return (
    <div className='book-carousel'>
      <button type='button' className='side-button side-button--prev' aria-label='이전 도서' disabled={atStart} onClick={() => setPage((p) => Math.max(0, p - 1))}>
        <Icon name='caret-right' />
      </button>
      <div className='book-carousel__viewport' style={{ width: pageWidthPx }}>
        <div className='book-carousel__track' style={{ transform: `translateX(-${page * pageWidthPx}px)` }}>
          {items.map((book) => (
            <BookCard
              key={book.id}
              variant={variant}
              isbn13={book.isbn13}
              title={book.title}
              author={book.author}
              coverSrc={book.coverSrc}
              rank={book.rank}
              sellingPrice={book.sellingPrice}
              listPrice={book.listPrice}
              showPrice={showPrice}
            />
          ))}
        </div>
      </div>
      <button type='button' className='side-button side-button--next' aria-label='다음 도서' disabled={atEnd} onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}>
        <Icon name='caret-right' />
      </button>
    </div>
  );
}
