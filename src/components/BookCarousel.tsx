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

// _book-card.scss의 카드 폭(240px)·$space-6(24px) 간격과 맞춰서 페이지당 이동 거리를 px로 계산한다.
// 토큰을 SCSS에서만 관리하고 JS로 끌어오는 구조가 없어서 여기 값이 바뀌면 같이 바꿔야 한다.
const CARD_WIDTH_PX = 240;
const CARD_GAP_PX = 24;

// design-system.md "side-button" 패턴 — 가로 스크롤 도서 목록 양옆의 50×50 원형 버튼으로
// perPage(기본 4)개씩 페이지 단위로 넘긴다. 첫 페이지에선 이전, 마지막 페이지에선 다음을 Disabled.
// 기본값 5는 side-button(50px)×2 + gap(16px)×2를 더하면 1428px가 필요해 컨테이너 폭(1240px)을
// 넘어서서 5번째 카드가 잘렸다 — 4로 낮춰 필요한 폭(1164px)이 컨테이너 안에 들어오게 한다.
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
