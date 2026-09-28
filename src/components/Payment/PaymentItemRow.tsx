import { Icon } from '@/components/Icon';
import type { CartItem } from '@/data/cartItems';
import { getItemEmployeePayment, getItemSubsidy } from '@/utils/subsidy';

interface PaymentItemRowProps {
  item: CartItem;
  groupBadgeClassName: string;
  groupBadgeIcon: 'star' | 'books';
  groupBadgeLabel: string;
  subsidyBtnClassName: string;
  isSubsidyExhausted: boolean;
  onApplySubsidy: (id: string) => void;
  onRemoveSubsidy: (id: string) => void;
  onExclude: (item: CartItem) => void;
}

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

export default function PaymentItemRow({ item, groupBadgeClassName, groupBadgeIcon, groupBadgeLabel, subsidyBtnClassName, isSubsidyExhausted, onApplySubsidy, onRemoveSubsidy, onExclude }: PaymentItemRowProps) {
  const discountRate = Math.round((1 - item.sellingPrice / item.listPrice) * 100);
  const subsidy = getItemSubsidy(item);
  const employeePayment = getItemEmployeePayment(item);

  return (
    <tr>
      <td className='cart-table__book-col'>
        <div className='cart-book'>
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
          </div>
        </div>
      </td>
      <td className='cart-table__price-col'>
        <span className='payment-table__discount'>{discountRate}%</span> <span className='payment-table__price'>{formatWon(item.sellingPrice * item.qty)}</span>
      </td>
      <td className='cart-table__num-col'>{item.qty}</td>
      <td className='cart-table__subsidy-col'>
        <div className='payment-table__subsidy-cell'>
          {isSubsidyExhausted ? (
            <span className={`subsidy-btn ${subsidyBtnClassName} is-exhausted`}>지원금 적용불가</span>
          ) : item.isSubsidyApplied ? (
            <div className='payment-table__subsidy-applied'>
              <span className='payment-table__subsidy-amount'>-{formatWon(subsidy)}</span>
              <button type='button' className={`subsidy-btn ${subsidyBtnClassName} is-applied`} onClick={() => onRemoveSubsidy(item.id)}>
                <Icon name='check' />
                지원금 적용됨
              </button>
            </div>
          ) : (
            <button type='button' className={`subsidy-btn ${subsidyBtnClassName}`} onClick={() => onApplySubsidy(item.id)}>
              지원금 적용하기
            </button>
          )}
        </div>
      </td>
      <td className='cart-table__payment-col'>
        <span className='payment-table__employee-payment'>{formatWon(employeePayment)}</span>
        <button type='button' className='cart-remove-btn' onClick={() => onExclude(item)} title='이번 결제에서 제외 (장바구니에는 보존)' aria-label='상품 제외'>
          <Icon name='x' />
        </button>
      </td>
    </tr>
  );
}
