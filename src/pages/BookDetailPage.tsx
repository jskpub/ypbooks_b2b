import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EmptyState from '@/components/EmptyState';
import { Icon } from '@/components/Icon';
import { fetchBookDetail, type AladinItem } from '@/services/aladinApi';

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
  const category = book.categoryName?.split('>').pop()?.trim();

  return (
    <main id='main' className='main'>
      <div className='container book-detail'>
        <div className='book-detail__cover'>{book.cover ? <img src={book.cover} alt='' /> : <Icon name='books' />}</div>
        <div className='book-detail__info'>
          {category && <p className='book-detail__category caption'>{category}</p>}
          <h1 className='book-detail__title'>{book.title}</h1>
          <p className='book-detail__author text-body'>{book.author}</p>

          <div className='book-detail__price-row'>
            {discountRate > 0 && <span className='book-detail__discount'>{discountRate}%</span>}
            <span className='book-detail__selling price-lg'>{formatWon(book.priceSales)}</span>
            <span className='book-detail__list text-body-xs'>{formatWon(book.priceStandard)}</span>
          </div>

          <div className='book-detail__actions'>
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
            <button type='button' className='btn btn--secondary btn--lg'>
              장바구니 담기
            </button>
            <button type='button' className='btn btn--primary btn--lg'>
              바로 구매
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
