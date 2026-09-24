import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icon';
import type { CartItem } from '@/data/cartItems';
import CartItemRow from './CartItemRow';

interface CartGroupSectionProps {
  bodyId: string;
  badgeClassName: string;
  badgeIcon: IconName;
  badgeLabel: string;
  titleText: string;
  titleNote: ReactNode;
  items: CartItem[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleChecked: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onDeliveryInfoOpen: () => void;
  /** 이번 달 이 그룹(추천도서/개인도서)의 지원금 한도를 이미 다 썼는지. 소진되면 해당 그룹의
   * 도서는 본인 부담으로 결제된다 — YP_PAYMENTS CartPage의 subsidyLedger 이식. */
  isSubsidyExhausted?: boolean;
  exhaustedMessage?: string;
}

export default function CartGroupSection({
  bodyId,
  badgeClassName,
  badgeIcon,
  badgeLabel,
  titleText,
  titleNote,
  items,
  isExpanded,
  onToggleExpand,
  onToggleChecked,
  onQtyChange,
  onRemove,
  onDeliveryInfoOpen,
  isSubsidyExhausted = false,
  exhaustedMessage,
}: CartGroupSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="cart-group">
      <button
        type="button"
        className="cart-group__header cart-group__toggle"
        aria-expanded={isExpanded}
        aria-controls={bodyId}
        onClick={onToggleExpand}
      >
        <span className="cart-group__header-left">
          <span className={`badge ${badgeClassName}`}>
            <Icon name={badgeIcon} />
            {badgeLabel}
          </span>
          <span className="cart-group__title text-body-sm">
            {titleText} <span className="cart-group__title-note caption">{titleNote}</span>
          </span>
        </span>
        <span className="cart-group__header-right">
          {isSubsidyExhausted ? (
            <span className="status-chip status-chip--exhausted">
              <Icon name="x-circle" />
              지원금 한도 소진
            </span>
          ) : (
            <span className="status-chip status-chip--available">
              <Icon name="check-circle" />
              지원금 사용 가능
            </span>
          )}
          <span className="cart-group__chevron cart-group__chevron--down">
            <Icon name="caret-down" />
          </span>
          <span className="cart-group__chevron cart-group__chevron--up">
            <Icon name="caret-up" />
          </span>
        </span>
      </button>

      <div className="cart-group__body" id={bodyId} hidden={!isExpanded}>
        {isSubsidyExhausted && exhaustedMessage && (
          <div className="alert alert--danger cart-group__alert">
            <span className="alert__icon">
              <Icon name="warning" />
            </span>
            <div className="alert__body">
              <p className="alert__desc">{exhaustedMessage}</p>
            </div>
          </div>
        )}
        <table className="cart-table">
          <thead>
            <tr>
              <th className="cart-table__book-col">도서 정보</th>
              <th className="cart-table__qty-col">주문금액 / 수량</th>
              <th className="cart-table__delivery-col">
                배송일정
                <button type="button" className="cart-table__help" aria-label="배송일정 안내 보기" onClick={onDeliveryInfoOpen}>
                  <Icon name="question" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                groupBadgeClassName={badgeClassName}
                groupBadgeIcon={badgeIcon}
                groupBadgeLabel={badgeLabel}
                onToggleChecked={onToggleChecked}
                onQtyChange={onQtyChange}
                onRemove={onRemove}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
