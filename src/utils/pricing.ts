/** CartPage 안내 문구("10,000원 이상 결제 시 기본 배송비 무료")와 동일한 기준. */
export const FREE_SHIPPING_THRESHOLD = 10000;
export const SHIPPING_FEE = 2500;

export function getShippingFee(totalSelling: number): number {
  return totalSelling === 0 || totalSelling >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}
