import { Icon } from '@/components/Icon';

interface PaymentSummaryCardProps {
  totalSellingPrice: number;
  hasRecommendedItems: boolean;
  hasPersonalItems: boolean;
  recommendedSubsidy: number;
  personalSubsidy: number;
  shippingFee: number;
  finalPaymentAmount: number;
  recommendedUsed?: boolean;
  personalUsed?: boolean;
  agreeTerms: boolean;
  onAgreeTermsChange: (value: boolean) => void;
  onBackToCart: () => void;
}

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

// design-system.md "Payment Sidebar" 패턴(상품금액 → 지원금 차감 줄 → 구분선 → 최종 결제 금액 →
// 전체 폭 결제 버튼) 그대로. CartPage 사이드바의 .cart-summary를 그대로 재사용한다.
export default function PaymentSummaryCard({ totalSellingPrice, hasRecommendedItems, hasPersonalItems, recommendedSubsidy, personalSubsidy, shippingFee, finalPaymentAmount, agreeTerms, onAgreeTermsChange, onBackToCart }: PaymentSummaryCardProps) {
  return (
    <div className='cart-summary'>
      <p className='cart-summary__title text-body-base'>결제 정보</p>
      <div className='cart-summary__rows text-body-sm'>
        <div className='cart-summary__row'>
          <span>상품금액</span>
          <span>{formatWon(totalSellingPrice)}</span>
        </div>
        {hasRecommendedItems && (
          <div className='cart-summary__row cart-summary__row--discount'>
            <span>추천도서 지원금</span>
            <span>{recommendedSubsidy > 0 ? `- ${formatWon(recommendedSubsidy)}` : '0원'}</span>
          </div>
        )}
        {hasPersonalItems && (
          <div className='cart-summary__row cart-summary__row--discount'>
            <span>개인도서 지원금</span>
            <span>{personalSubsidy > 0 ? `- ${formatWon(personalSubsidy)}` : '0원'}</span>
          </div>
        )}
        <div className='cart-summary__row'>
          <span>배송비</span>
          <span>{shippingFee === 0 ? '무료 (1만원 이상)' : formatWon(shippingFee)}</span>
        </div>
      </div>

      <div className='cart-summary__total'>
        <span className='cart-summary__total-label text-body-sm'>최종 결제금액</span>
        <span className='cart-summary__total-amount'>
          {finalPaymentAmount.toLocaleString('ko-KR')}
          <span className='cart-summary__total-unit'>원</span>
        </span>
      </div>

      <label className='checkbox payment-summary__agree caption'>
        <input type='checkbox' checked={agreeTerms} onChange={(event) => onAgreeTermsChange(event.target.checked)} />
        <span>
          주문 내용을 확인하였으며, <br />
          <strong>개인정보 수집 및 제3자 제공 등</strong>에 동의합니다.
        </span>
      </label>

      <button type='submit' className='btn btn--primary btn--lg'>
        <Icon name='wallet' />
        {finalPaymentAmount.toLocaleString('ko-KR')}원 결제하기
      </button>

      <button type='button' className='btn btn--secondary payment__back-link' onClick={onBackToCart}>
        <Icon name='caret-right' className='icon payment__back-icon' />
        장바구니로 돌아가기
      </button>
    </div>
  );
}
