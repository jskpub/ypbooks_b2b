import type { IconName } from '@/components/Icon';

export type CartGroup = 'recommended' | 'personal';

export interface CartItem {
  id: string;
  group: CartGroup;
  title: string;
  byline: string;
  formatLabel: string;
  formatBadgeClassName: string;
  coverIcon: IconName;
  coverSrc?: string;
  listPrice: number;
  sellingPrice: number;
  qty: number;
  checked: boolean;
  deliveryMain: string;
  deliverySub: string;
  /** 회사 지원금 적용 여부 — 결제 페이지에서 그룹(추천도서/개인도서)당 하나만 켤 수 있다. */
  isSubsidyApplied?: boolean;
}
