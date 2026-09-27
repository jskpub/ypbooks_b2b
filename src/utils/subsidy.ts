import type { CartItem } from '@/data/cartItems';

/** 개인도서 지원 한도 — CartPage 안내 문구("1권당 최대 10,000원 한도")와 동일. */
export const PERSONAL_SUBSIDY_CAP = 10000;

/**
 * 회사 지원금 계산 — 추천도서는 100%, 개인도서는 50%(최대 10,000원).
 * 그룹당 한 권에만 적용된다(호출하는 쪽에서 상호 배타를 보장).
 */
export function getItemSubsidy(item: CartItem): number {
  if (!item.isSubsidyApplied) return 0;
  const lineTotal = item.sellingPrice * item.qty;
  return item.group === 'recommended' ? lineTotal : Math.min(lineTotal * 0.5, PERSONAL_SUBSIDY_CAP);
}

export function getItemEmployeePayment(item: CartItem): number {
  return item.sellingPrice * item.qty - getItemSubsidy(item);
}
