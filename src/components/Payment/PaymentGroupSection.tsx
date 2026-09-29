import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import type { CartItem } from '@/data/cartItems';
import PaymentItemRow from './PaymentItemRow';

interface PaymentGroupSectionProps {
  bodyId: string;
  badgeClassName: string;
  badgeIcon: 'star' | 'books';
  badgeLabel: string;
  titleText: string;
  titleNote: ReactNode;
  subsidyBtnClassName: string;
  items: CartItem[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  isSubsidyExhausted: boolean;
  exhaustedMessage?: string;
  onApplySubsidy: (id: string) => void;
  onRemoveSubsidy: (id: string) => void;
  onExclude: (item: CartItem) => void;
}

export default function PaymentGroupSection({
  bodyId,
  badgeClassName,
  badgeIcon,
  badgeLabel,
  titleText,
  titleNote,
  subsidyBtnClassName,
  items,
  isExpanded,
  onToggleExpand,
  isSubsidyExhausted,
  onApplySubsidy,
  onRemoveSubsidy,
  onExclude,
}: PaymentGroupSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className='cart-group'>
      <button type='button' className='cart-group__header cart-group__toggle' aria-expanded={isExpanded} aria-controls={bodyId} onClick={onToggleExpand}>
        <span className='cart-group__header-left'>
          <span className={`badge ${badgeClassName}`}>
            <Icon name={badgeIcon} />
            {badgeLabel}
          </span>
          <span className='cart-group__title'>
            {titleText} <span className='cart-group__title-note'>{titleNote}</span>
          </span>
        </span>
        <span className='cart-group__header-right'>
          <span className='cart-group__chevron cart-group__chevron--down'>
            <Icon name='caret-down' />
          </span>
          <span className='cart-group__chevron cart-group__chevron--up'>
            <Icon name='caret-up' />
          </span>
        </span>
      </button>

      <div className='cart-group__body' id={bodyId} hidden={!isExpanded}>
        <table className='cart-table'>
          <thead>
            <tr>
              <th className='cart-table__book-col'>상품정보</th>
              <th className='cart-table__price-col'>판매가</th>
              <th className='cart-table__num-col'>수량</th>
              <th className='cart-table__subsidy-col'>회사 지원금</th>
              <th className='cart-table__payment-col'>직원 결제액</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <PaymentItemRow
                key={item.id}
                item={item}
                groupBadgeClassName={badgeClassName}
                groupBadgeIcon={badgeIcon}
                groupBadgeLabel={badgeLabel}
                subsidyBtnClassName={subsidyBtnClassName}
                isSubsidyExhausted={isSubsidyExhausted}
                onApplySubsidy={onApplySubsidy}
                onRemoveSubsidy={onRemoveSubsidy}
                onExclude={onExclude}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
