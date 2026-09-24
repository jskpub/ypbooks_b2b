import { Icon, type IconName } from '@/components/Icon';

interface EmptyStateProps {
  /** 그 자리의 대상을 가리키는 아이콘 — 장바구니 shopping-cart-simple, 검색 magnifying-glass, 목록 books */
  icon: IconName;
  title: string;
  description: string;
  /** 없으면 버튼을 그리지 않는다(검색 결과 없음 등 갈 곳이 없는 자리). */
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className='empty-state'>
      <Icon name={icon} />
      <p className='empty-state__title'>{title}</p>
      <p className='empty-state__desc'>{description}</p>
      {actionLabel && (
        <button type='button' className='btn btn--primary btn--lg' onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
