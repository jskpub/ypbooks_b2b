import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';

export type BookCardVariant = 'home_bookcard' | 'home_best' | 'past-recomment';

interface BookCardProps {
  variant: BookCardVariant;
  isbn13: string;
  title: string;
  author: string;
  coverSrc?: string;
  /** home_best 전용, home_bookcard는 순위 배지 없음 (Figma 컴포넌트에 prop 자체 부재) */
  rank?: number;
  /** past-recomment 전용 "추천 대상" 캡션, 도서 제목·작가·추천대상 3개 필드만 표시 */
  target?: string;
  sellingPrice?: number;
  listPrice?: number;
  showPrice?: boolean;
  showRank?: boolean;
}

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

export default function BookCard({
  variant,
  isbn13,
  title,
  author,
  coverSrc,
  rank,
  target,
  sellingPrice,
  listPrice,
  showPrice = true,
  showRank = variant === 'home_best',
}: BookCardProps) {
  const displayRank = variant === 'home_best' && showRank && rank != null;
  const isPastRecomment = variant === 'past-recomment';

  return (
    <Link to={`/books/${isbn13}`} className={`book-card book-card--${variant}`}>
      {isPastRecomment && target && <p className='book-card__target caption'>{target}</p>}
      <div className='book-card__cover'>
        {coverSrc ? <img src={coverSrc} alt='' /> : <Icon name='books' />}
        {displayRank && <span className='book-card__rank'>{rank}</span>}
      </div>
      <div className='book-card__info'>
        <p className='book-card__title text-h4'>{title}</p>
        <p className='book-card__author text-body-sm'>{author}</p>
      </div>
      {!isPastRecomment && showPrice && sellingPrice != null && (
        <div className='book-card__price-row'>
          <span className='book-card__selling price'>{formatWon(sellingPrice)}</span>
          {listPrice != null && <span className='book-card__list text-body-xs'>{formatWon(listPrice)}</span>}
        </div>
      )}
    </Link>
  );
}
