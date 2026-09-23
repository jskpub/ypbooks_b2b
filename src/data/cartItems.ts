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
  listPrice: number;
  sellingPrice: number;
  qty: number;
  checked: boolean;
  deliveryMain: string;
  deliverySub: string;
}

export const initialCartItems: CartItem[] = [
  {
    id: 'unpleasant-convenience-store',
    group: 'recommended',
    title: '불편한 편의점',
    byline: '김호연 · 나무옆의자',
    formatLabel: '종이책',
    formatBadgeClassName: 'badge--general',
    coverIcon: 'book-open',
    listPrice: 15000,
    sellingPrice: 13500,
    qty: 1,
    checked: true,
    deliveryMain: '내일 출고 가능',
    deliverySub: '9/16(수) 배송예정',
  },
  {
    id: 'atomic-habits',
    group: 'personal',
    title: '아토믹 해빗',
    byline: '제임스 클리어 · 비즈니스북스',
    formatLabel: '전자책',
    formatBadgeClassName: 'badge--delivery',
    coverIcon: 'device-mobile',
    listPrice: 17800,
    sellingPrice: 16020,
    qty: 1,
    checked: true,
    deliveryMain: '결제 즉시 열람',
    deliverySub: '전자책 서재 등록',
  },
  {
    id: 'vegetarian',
    group: 'personal',
    title: '채식주의자',
    byline: '한강 · 창비',
    formatLabel: '종이책',
    formatBadgeClassName: 'badge--general',
    coverIcon: 'book-open',
    listPrice: 14000,
    sellingPrice: 12600,
    qty: 2,
    checked: true,
    deliveryMain: '내일 출고 가능',
    deliverySub: '9/16(수) 배송예정',
  },
];
