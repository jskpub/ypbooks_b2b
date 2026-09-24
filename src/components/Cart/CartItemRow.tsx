import { Icon, type IconName } from '@/components/Icon';
import type { CartItem } from '@/data/cartItems';

interface CartItemRowProps {
  item: CartItem;
  /** 이 행이 속한 그룹(추천도서/개인도서)의 배지 — CartGroupSection 헤더와 같은 값을 그대로
   * 받아써서 도서 유형 배지가 이중으로 정의되지 않게 한다. Figma Cart Row(44:3338) 실측:
   * 행마다 포맷(종이책/전자책)이 아니라 도서 유형 배지가 붙어있었다. */
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

  return (
    <tr>
      <td>
        <div className='cart-book'>
          <input type='checkbox' className='cart-book__checkbox checkbox' aria-label={`${item.title} 선택`} checked={item.checked} onChange={() => onToggleChecked(item.id)} />
          {/* Figma Cart Row 실측(44:3302/44:3318/44:3338): 표지는 도서 유형·포맷과 무관하게
              항상 고정된 "books" 아이콘 — item별로 바뀌지 않는다. */}
          <span className='cart-book__cover'>
            <Icon name='books' />
          </span>
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
              <h3 className='cart-book__title text-body-sm'>{item.title}</h3>
              <p className='cart-book__byline caption'>{item.byline}</p>
            </div>
            <div className='cart-book__price caption'>
              <span className='cart-book__discount'>{discountRate}%</span>
              <span className='cart-book__selling'>{formatWon(item.sellingPrice)}</span>
              <span className='cart-book__list'>{formatWon(item.listPrice)}</span>
            </div>
          </div>
        </div>
      </td>
      <td>
        <div className='cart-order-amount'>{formatWon(item.sellingPrice * item.qty)}</div>
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
        <div className='cart-delivery-eta caption'>
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
