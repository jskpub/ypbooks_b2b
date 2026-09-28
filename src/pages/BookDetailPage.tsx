import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmptyState from '@/components/EmptyState';
import { Icon } from '@/components/Icon';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { recommendedBookList, isCurrentlyRecommended } from '@/data/recommendedBookList';
import { reviews } from '@/data/reviews';
import { fetchBookDetail, type AladinItem } from '@/services/aladinApi';

const FREE_SHIPPING_THRESHOLD = 10000; // CartPage.tsx와 동일 배송 정책

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

// 도서 상세(BOOK-05). design-system.md에 전용 화면 패턴 문서가 없어서 Book Card의 가격 표기 규칙과
// Book List 패턴의 우측 액션(Stepper + 담기(Secondary) + 바로구매(Primary))을 그대로 가져와 구성했다.
export default function BookDetailPage() {
  const { isbn13 = '' } = useParams<{ isbn13: string }>();
  const [book, setBook] = useState<AladinItem | null>(null);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setBook(null);
    fetchBookDetail(isbn13)
      .then((item) => {
        if (!cancelled) {
          setBook(item);
          setStatus(item ? 'done' : 'error');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [isbn13]);

  if (status === 'error' || (status === 'done' && !book)) {
    return (
      <main id='main' className='main'>
        <div className='container book-detail'>
          <EmptyState icon='books' title='도서 정보를 찾을 수 없습니다' description='주소를 다시 확인해 주세요.' />
        </div>
      </main>
    );
  }

  if (status === 'loading' || !book) {
    return (
      <main id='main' className='main'>
        <div className='container book-detail'>
          <p className='text-body-sm'>불러오는 중…</p>
        </div>
      </main>
    );
  }

  const discountRate = Math.round((1 - book.priceSales / book.priceStandard) * 100);
  // 알라딘 categoryName은 "국내도서>자기계발>성공>성공학"처럼 전체 경로로 온다. 브레드크럼이 전체 경로를
  // 보여주므로 제목 위 카테고리 한 줄은 따로 두지 않는다(중복).
  const categoryPath = (book.categoryName ?? '')
    .split('>')
    .map((part) => part.trim())
    .filter(Boolean);
  const isRecommended = isCurrentlyRecommended(isbn13);
  const isFreeShipping = book.priceSales >= FREE_SHIPPING_THRESHOLD;
  const bookReviews = reviews.filter((review) => review.isbn13 === isbn13);
  const averageRating = bookReviews.length > 0 ? Math.round((bookReviews.reduce((sum, review) => sum + review.rating, 0) / bookReviews.length) * 10) / 10 : 0;
  const recommendEntry = recommendedBookList.find((entry) => entry.isbn13 === isbn13);
  const packing = book.subInfo?.packing;
  const specRows: { label: string; value: string }[] = [
    { label: 'ISBN', value: book.isbn13 },
    ...(book.subInfo?.itemPage !== undefined ? [{ label: '쪽수', value: `${book.subInfo.itemPage}쪽` }] : []),
    ...(packing?.sizeWidth !== undefined && packing.sizeHeight !== undefined ? [{ label: '크기', value: `${packing.sizeWidth} x ${packing.sizeHeight}mm` }] : []),
    ...(packing?.styleDesc ? [{ label: '제품구성', value: packing.styleDesc }] : []),
    { label: '정가', value: formatWon(book.priceStandard) },
    { label: '판매가', value: formatWon(book.priceSales) },
  ];
  const description = book.description?.trim() ?? '';

  const handleAddToCart = () => {
    addToCart({ isbn13, title: book.title, byline: `${book.author} · ${book.publisher}`, listPrice: book.priceStandard, sellingPrice: book.priceSales, qty, coverSrc: book.cover });
    showToast('장바구니에 담았습니다');
  };

  const handleBuyNow = () => {
    addToCart({ isbn13, title: book.title, byline: `${book.author} · ${book.publisher}`, listPrice: book.priceStandard, sellingPrice: book.priceSales, qty, coverSrc: book.cover });
    navigate('/payment');
  };

  return (
    <main id='main' className='main'>
      <div className='container book-detail'>
        <div className='book-detail__breadcrumb'>
          <nav aria-label='현재 위치'>
            <ol className='book-detail__breadcrumb-list text-body-sm'>
              {categoryPath.map((part, index) => (
                <li key={`${part}-${index}`} className='book-detail__breadcrumb-item'>
                  {part}
                </li>
              ))}
              <li className='book-detail__breadcrumb-item book-detail__breadcrumb-item--current' aria-current='page'>
                {book.title}
              </li>
            </ol>
          </nav>
          {isRecommended && (
            <button type='button' className='book-detail__breadcrumb-link text-body-sm' onClick={() => navigate('/recommend')}>
              추천 도서 목록으로
              <Icon name='caret-right' />
            </button>
          )}
        </div>

        <div className='book-detail__main'>
          <div className='book-detail__cover'>{book.cover ? <img src={book.cover} alt='' /> : <Icon name='books' />}</div>
          <div className='book-detail__info'>
            {(isRecommended || isFreeShipping) && (
              <div className='book-detail__badges'>
                {isRecommended && (
                  <span className='badge badge--recommended'>
                    <Icon name='star' />
                    추천도서
                  </span>
                )}
                {isFreeShipping && (
                  <span className='badge badge--delivery'>
                    <Icon name='truck' />
                    무료배송
                  </span>
                )}
              </div>
            )}
            <h1 className='book-detail__title'>{book.title}</h1>
            <p className='book-detail__author text-body'>{`${book.author} · ${book.publisher}`}</p>
            {book.pubDate && <p className='book-detail__pubdate text-body-sm'>출판일 {book.pubDate}</p>}
            {bookReviews.length > 0 ? (
              <button type='button' className='book-detail__rating book-detail__rating--link text-body-sm' onClick={() => navigate('/review')}>
                <Icon name='star' />
                {`평점 ${averageRating.toFixed(1)} · 서평 ${bookReviews.length}개`}
              </button>
            ) : (
              <p className='book-detail__rating text-body-sm'>아직 서평이 없어요</p>
            )}

            <div className='book-detail__price-row'>
              {discountRate > 0 && <span className='book-detail__discount'>{discountRate}%</span>}
              <span className='book-detail__selling price-lg'>{formatWon(book.priceSales)}</span>
              <span className='book-detail__list text-body-xs'>{formatWon(book.priceStandard)}</span>
            </div>

            <div className='book-detail__order-box'>
              <div className='book-detail__order-top'>
                <div className='stepper'>
                  <button type='button' className='stepper__btn' aria-label='수량 감소' disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))}>
                    <Icon name='minus' />
                  </button>
                  <input
                    type='number'
                    min={1}
                    step={1}
                    className='stepper__value'
                    value={qty}
                    aria-label='수량'
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
                  <button type='button' className='stepper__btn' aria-label='수량 증가' onClick={() => setQty((q) => q + 1)}>
                    <Icon name='plus' />
                  </button>
                </div>
                <div className='book-detail__total-price'>
                  {formatWon(book.priceSales * qty)}
                </div>
              </div>
              <div className='book-detail__actions'>
                <button type='button' className='btn btn--secondary btn--lg' onClick={handleAddToCart}>
                  장바구니 담기
                </button>
                <button type='button' className='btn btn--primary btn--lg' onClick={handleBuyNow}>
                  바로 구매
                </button>
              </div>
            </div>
          </div>
        </div>

        {recommendEntry && (
          <section className='book-detail__section' aria-labelledby='book-detail-reason'>
            <h2 id='book-detail-reason' className='book-detail__section-title'>
              추천 이유
            </h2>
            <p className='book-detail__reason text-body'>{recommendEntry.recommendReason}</p>
          </section>
        )}

        <section className='book-detail__section' aria-labelledby='book-detail-spec'>
          <h2 id='book-detail-spec' className='book-detail__section-title'>
            상품 정보
          </h2>
          <dl className='book-detail__spec-table'>
            {specRows.map((row) => (
              <div key={row.label} className='book-detail__spec-row'>
                <dt className='book-detail__spec-th text-body-sm'>{row.label}</dt>
                <dd className='book-detail__spec-td text-body-sm'>{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {description && (
          <section className='book-detail__section' aria-labelledby='book-detail-description'>
            <h2 id='book-detail-description' className='book-detail__section-title'>
              책 소개
            </h2>
            <p className='book-detail__description text-body'>{description}</p>
          </section>
        )}
      </div>
    </main>
  );
}
