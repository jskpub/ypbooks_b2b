import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';

export type BookCardVariant = 'home_bookcard' | 'home_best';

interface BookCardProps {
  variant: BookCardVariant;
  isbn13: string;
  title: string;
  author: string;
  coverSrc?: string;
  /** home_best 전용 — home_bookcard는 순위 배지 자체가 없다(Figma 컴포넌트에 prop 없음). */
  rank?: number;
  sellingPrice?: number;
  listPrice?: number;
  showPrice?: boolean;
  showRank?: boolean;
}

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

// 스토리보드 인터랙션 명세: "카드 클릭 시 도서 상세(BOOK-05)로 이동" — 카드 전체를 링크로 감싼다.
export default function BookCard({
  variant,
  isbn13,
  title,
  author,
  coverSrc,
  rank,
  sellingPrice,
  listPrice,
  showPrice = true,
  showRank = variant === 'home_best',
}: BookCardProps) {
  const displayRank = variant === 'home_best' && showRank && rank != null;

  return (
    <Link to={`/books/${isbn13}`} className={`book-card book-card--${variant}`}>
      <div className='book-card__cover'>
        {coverSrc ? <img src={coverSrc} alt='' /> : <Icon name='books' />}
        {displayRank && <span className='book-card__rank'>{rank}</span>}
      </div>
      <div className='book-card__info'>
        <p className='book-card__title text-h4'>{title}</p>
        <p className='book-card__author text-body-sm'>{author}</p>
      </div>
      {showPrice && sellingPrice != null && (
        <div className='book-card__price-row'>
          <span className='book-card__selling price'>{formatWon(sellingPrice)}</span>
          {listPrice != null && <span className='book-card__list text-body-xs'>{formatWon(listPrice)}</span>}
        </div>
      )}
    </Link>
  );
}
