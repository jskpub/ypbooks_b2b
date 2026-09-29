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
  isMaxBenefitApplied?: boolean;
  onApplyMaxBenefit?: () => void;
  agreeTerms: boolean;
  onAgreeTermsChange: (value: boolean) => void;
  onBackToCart: () => void;
}

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

function renderRightSubsidyCallout({
  recommendedUsed = false,
  personalUsed = false,
  hasRecommendedItems = false,
  hasPersonalItems = false,
  isMaxBenefitApplied = false,
  onApplyMaxBenefit,
}: {
  recommendedUsed?: boolean;
  personalUsed?: boolean;
  hasRecommendedItems?: boolean;
  hasPersonalItems?: boolean;
  isMaxBenefitApplied?: boolean;
  onApplyMaxBenefit?: () => void;
}) {
  // Case 2-A: 모두 소진
  if (recommendedUsed && personalUsed) return null;

  // Case 2-B / 2-C: 한쪽 유형만 소진
  if (recommendedUsed || personalUsed) {
    const usedLabel = recommendedUsed ? '추천도서' : '개인도서';
    const otherLabel = recommendedUsed ? '개인도서' : '추천도서';
    const hasOtherItems = recommendedUsed ? hasPersonalItems : hasRecommendedItems;

    // Case 2-B: 대체 적용 가능한 다른 도서 없음
    if (!hasOtherItems) return null;

    // Case 2-C: 소진 + 대체 적용 가능 도서 존재
    return (
      <div className={`cart-summary__subsidy-stack${isMaxBenefitApplied ? ' is-applied' : ''}`}>
        <div className='cart-summary__subsidy-row cart-summary__subsidy-row--exhausted'>
          <Icon name='x-circle' className='cart-summary__subsidy-row-icon' />
          <span className='cart-summary__subsidy-row-text'>{usedLabel} 지원금 이번 달 사용 완료</span>
        </div>

        <div className='cart-summary__subsidy-row cart-summary__subsidy-row--benefit'>
          <Icon name={isMaxBenefitApplied ? 'check-circle' : 'sparkle'} className='cart-summary__subsidy-row-icon' />
          <span className='cart-summary__subsidy-row-text'>
            {isMaxBenefitApplied ? `${otherLabel} 지원금 최대 적용 완료` : `${otherLabel} 지원금 적용 가능`}
          </span>
        </div>

        {!isMaxBenefitApplied && (
          <button type='button' className='btn btn--secondary btn--sm cart-summary__subsidy-btn' onClick={onApplyMaxBenefit}>
            최대혜택 적용하기 <Icon name='caret-right' />
          </button>
        )}
      </div>
    );
  }

  if (!hasRecommendedItems && !hasPersonalItems) return null;

  // Case 2-D: 소진된 지원금 없음 (또는 적용 완료)
  return (
    <div className={`cart-summary__subsidy-stack${isMaxBenefitApplied ? ' is-applied' : ''}`}>
      <div className='cart-summary__subsidy-row cart-summary__subsidy-row--benefit'>
        <Icon name={isMaxBenefitApplied ? 'check-circle' : 'sparkle'} className='cart-summary__subsidy-row-icon' />
        <span className='cart-summary__subsidy-row-text'>
          {isMaxBenefitApplied ? '도서 지원금 최대 적용 완료' : '적용 가능한 도서 지원금이 있습니다'}
        </span>
      </div>

      {!isMaxBenefitApplied && (
        <button type='button' className='btn btn--secondary btn--sm cart-summary__subsidy-btn' onClick={onApplyMaxBenefit}>
          최대혜택 적용하기 <Icon name='caret-right' />
        </button>
      )}
    </div>
  );
}

// CartPage 사이드바의 .cart-summary 스타일 재사용
export default function PaymentSummaryCard({
  totalSellingPrice,
  hasRecommendedItems,
  hasPersonalItems,
  recommendedSubsidy,
  personalSubsidy,
  shippingFee,
  finalPaymentAmount,
  recommendedUsed,
  personalUsed,
  isMaxBenefitApplied,
  onApplyMaxBenefit,
  agreeTerms,
  onAgreeTermsChange,
  onBackToCart,
}: PaymentSummaryCardProps) {
  return (
    <div className='cart-summary'>
      <p className='cart-summary__title'>결제 정보</p>

      {renderRightSubsidyCallout({
        recommendedUsed,
        personalUsed,
        hasRecommendedItems,
        hasPersonalItems,
        isMaxBenefitApplied,
        onApplyMaxBenefit,
      })}

      <div className='cart-summary__rows'>
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
        <span className='cart-summary__total-label'>최종 결제금액</span>
        <span className='cart-summary__total-amount'>
          {finalPaymentAmount.toLocaleString('ko-KR')}
          <span className='cart-summary__total-unit'>원</span>
        </span>
      </div>

      <label className='checkbox payment-summary__agree'>
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
