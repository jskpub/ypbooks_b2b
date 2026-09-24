import { Icon, type IconName } from '@/components/Icon';

interface EmptyStateProps {
  /** 그 자리의 대상을 가리키는 아이콘 — 장바구니 shopping-cart-simple, 검색 magnifying-glass, 목록 books */
  icon: IconName;
  /** 상황을 사실로 적는다. "장바구니가 비어 있습니다" */
  title: string;
  /** 다음 행동을 알린다. "마음에 드는 도서를 담아 보세요." 사과하거나 감정을 넣지 않는다. */
  description: string;
  /** 없으면 버튼을 그리지 않는다(검색 결과 없음 등 갈 곳이 없는 자리). */
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <Icon name={icon} className="icon empty-state__icon" />
      <p className="empty-state__title">{title}</p>
      <p className="empty-state__desc">{description}</p>
      {actionLabel && (
        <button type="button" className="btn btn--primary btn--lg" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
