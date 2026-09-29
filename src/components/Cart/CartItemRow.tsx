import type { MouseEvent } from 'react';
import { Icon, type IconName } from '@/components/Icon';
import type { CartItem } from '@/data/cartItems';

interface CartItemRowProps {
  item: CartItem;
  /** CartGroupSection 헤더와 동일 값 재사용, 도서 유형 배지 중복 정의 방지 */
  groupBadgeClassName: string;
  groupBadgeIcon: IconName;
  groupBadgeLabel: string;
  onToggleChecked: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

export default function CartItemRow({ item, groupBadgeClassName, groupBadgeIcon, groupBadgeLabel, onToggleChecked, onQtyChange, onRemove }: CartItemRowProps) {
  const discountRate = Math.round((1 - item.sellingPrice / item.listPrice) * 100);

  // input/button/a 등 자체 동작 요소 클릭 시 행 선택 토글과 충돌 방지 (체크박스 자체 클릭 시 onChange와 중복 토글돼 상쇄되는 현상 포함)
  const handleRowClick = (event: MouseEvent<HTMLTableRowElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('input, button, a')) return;
    onToggleChecked(item.id);
  };

  return (
    <tr onClick={handleRowClick}>
      <td>
        <div className='cart-book'>
          <input type='checkbox' className='cart-book__checkbox checkbox' aria-label={`${item.title} 선택`} checked={item.checked} onChange={() => onToggleChecked(item.id)} />
          <span className='cart-book__cover'>{item.coverSrc ? <img src={item.coverSrc} alt='' /> : <Icon name='books' />}</span>
          <div className='cart-book__info'>
            <div className='cart-book__badges'>
              <span className={`badge ${groupBadgeClassName}`}>
                <Icon name={groupBadgeIcon} />
                {groupBadgeLabel}
              </span>
              <span className={`badge ${item.formatBadgeClassName} cart-book__format`}>
                <Icon name={item.coverIcon} />
                {item.formatLabel}
              </span>
            </div>
            <div className='cart-book__contents'>
              <strong className='cart-book__title'>{item.title}</strong>
              <p className='cart-book__byline'>{item.byline}</p>
            </div>
            <div className='cart-book__price'>
              <span className='cart-book__discount'>{discountRate}%</span>
              <span className='cart-book__selling'>{formatWon(item.sellingPrice)}</span>
              <span className='cart-book__list'>{formatWon(item.listPrice)}</span>
            </div>
          </div>
        </div>
      </td>
      <td>
        <div className='cart-order-amount'>
          <strong>{(item.sellingPrice * item.qty).toLocaleString('ko-KR')}</strong>원
        </div>
        <div className='stepper'>
          <button type='button' className='stepper__btn' aria-label='수량 감소' disabled={item.qty <= 1} onClick={() => onQtyChange(item.id, Math.max(1, item.qty - 1))}>
            <Icon name='minus' />
          </button>
          <input
            type='number'
            min={1}
            step={1}
            className='stepper__value'
            value={item.qty}
            aria-label='수량'
            onChange={(event) => {
              const raw = event.target.value;
              if (raw === '') return;
              const value = Number(raw);
              if (Number.isInteger(value) && value >= 1) onQtyChange(item.id, value);
            }}
            onBlur={(event) => {
              const value = Number(event.target.value);
              if (!Number.isInteger(value) || value < 1) onQtyChange(item.id, 1);
            }}
          />
          <button type='button' className='stepper__btn' aria-label='수량 증가' onClick={() => onQtyChange(item.id, item.qty + 1)}>
            <Icon name='plus' />
          </button>
        </div>
      </td>
      <td className='cart-table__delivery-col'>
        <div className='cart-delivery-eta'>
          <p className='cart-delivery-eta__main'>{item.deliveryMain}</p>
          <p className='cart-delivery-eta__sub'>{item.deliverySub}</p>
        </div>
        <button type='button' className='cart-remove-btn' aria-label='상품 삭제' title='장바구니에서 삭제' onClick={() => onRemove(item.id)}>
          <Icon name='x' />
        </button>
      </td>
    </tr>
  );
}
