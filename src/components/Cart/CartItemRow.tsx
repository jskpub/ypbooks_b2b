import { Icon } from '@/components/Icon';
import type { CartItem } from '@/data/cartItems';

interface CartItemRowProps {
  item: CartItem;
  onToggleChecked: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

export default function CartItemRow({ item, onToggleChecked, onQtyChange, onRemove }: CartItemRowProps) {
  const discountRate = Math.round((1 - item.sellingPrice / item.listPrice) * 100);

  return (
    <tr>
      <td>
        <div className="cart-book">
          <input
            type="checkbox"
            className="cart-book__checkbox checkbox"
            aria-label={`${item.title} 선택`}
            checked={item.checked}
            onChange={() => onToggleChecked(item.id)}
          />
          <span className="cart-book__cover">
            <Icon name={item.coverIcon} />
          </span>
          <div className="cart-book__info">
            <span className={`badge ${item.formatBadgeClassName} cart-book__format`}>
              <Icon name={item.coverIcon} />
              {item.formatLabel}
            </span>
            <div>
              <h3 className="cart-book__title text-body-sm">{item.title}</h3>
              <p className="cart-book__byline caption">{item.byline}</p>
            </div>
            <div className="cart-book__price caption">
              <span className="cart-book__discount">{discountRate}%</span>
              <span className="cart-book__selling">{formatWon(item.sellingPrice)}</span>
              <span className="cart-book__list">{formatWon(item.listPrice)}</span>
            </div>
          </div>
        </div>
      </td>
      <td>
        <div className="cart-order-amount">{formatWon(item.sellingPrice * item.qty)}</div>
        <div className="stepper">
          <button
            type="button"
            className="stepper__btn"
            aria-label="수량 감소"
            disabled={item.qty <= 1}
            onClick={() => onQtyChange(item.id, Math.max(1, item.qty - 1))}
          >
            <Icon name="minus" />
          </button>
          <input type="text" className="stepper__value" value={item.qty} readOnly aria-label="수량" />
          <button type="button" className="stepper__btn" aria-label="수량 증가" onClick={() => onQtyChange(item.id, item.qty + 1)}>
            <Icon name="plus" />
          </button>
        </div>
      </td>
      <td className="cart-table__delivery-col">
        <div className="cart-delivery-eta caption">
          <p className="cart-delivery-eta__main">{item.deliveryMain}</p>
          <p className="cart-delivery-eta__sub">{item.deliverySub}</p>
        </div>
        <button
          type="button"
          className="cart-remove-btn"
          aria-label="상품 삭제"
          title="장바구니에서 삭제"
          onClick={() => onRemove(item.id)}
        >
          <Icon name="x" />
        </button>
      </td>
    </tr>
  );
}
