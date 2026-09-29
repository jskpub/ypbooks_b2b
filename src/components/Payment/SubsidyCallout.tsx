import { Icon } from '@/components/Icon';

interface SubsidyCalloutProps {
  recommendedUsed: boolean;
  personalUsed: boolean;
  hasRecommendedItems: boolean;
  hasPersonalItems: boolean;
  isMaxBenefitApplied: boolean;
  onApplyMaxBenefit: () => void;
}

const renewalChip = (
  <span className='status-chip status-chip--renewal payment-callout__chip'>
    <Icon name='arrows-clockwise' />
    매월 1일 자동 갱신
  </span>
);

// 원본 파란 유리효과 배너는 "새 색을 더하지 않는다" 원칙에 위배돼 제외, 기존 .alert 컴포넌트(중립 surface + 아이콘 톤 구분)로 대체함
export default function SubsidyCallout({ recommendedUsed, personalUsed, hasRecommendedItems, hasPersonalItems, isMaxBenefitApplied, onApplyMaxBenefit }: SubsidyCalloutProps) {
  // Case 2-A: 결제 대상 상품에 해당하는 유형(추천·개인도서)의 지원금이 모두 소진된 경우
  if (recommendedUsed && personalUsed) {
    return (
      <div className='alert payment-callout'>
        <span className='alert__icon'>
          <Icon name='warning' />
        </span>
        <div className='alert__body'>
          <p className='alert__title'>이번 달 도서 지원금(추천·개인도서)이 모두 소진되었습니다.</p>
          <p className='alert__desc'>전액 직원 부담금으로 결제됩니다.</p>
        </div>
        {renewalChip}
      </div>
    );
  }

  // 한쪽 유형만 소진된 경우 — 2-B(대체상품 없음) / 2-C(대체상품 있음)
  if (recommendedUsed || personalUsed) {
    const usedLabel = recommendedUsed ? '추천도서' : '개인도서';
    const otherLabel = recommendedUsed ? '개인도서' : '추천도서';
    const hasOtherItems = recommendedUsed ? hasPersonalItems : hasRecommendedItems;

    // Case 2-B: 주문서 내에 대체 적용 가능한 다른 유형의 상품이 존재하지 않는 경우
    if (!hasOtherItems) {
      return (
        <div className='alert payment-callout'>
          <span className='alert__icon'>
            <Icon name='warning' />
          </span>
          <div className='alert__body'>
            <p className='alert__title'>이번 달 {usedLabel} 지원금이 모두 소진되었습니다.</p>
            <p className='alert__desc'>전액 본인 부담으로 결제됩니다.</p>
          </div>
          {renewalChip}
        </div>
      );
    }

    // 다른 유형 상품이 있고 이미 최대혜택 적용된 상태면 갱신 안내만, 아니면 Case 2-C(버튼 노출)
    return (
      <div className='alert payment-callout'>
        <span className='alert__icon'>
          <Icon name={isMaxBenefitApplied ? 'check-circle' : 'warning-circle'} />
        </span>
        <div className='alert__body'>
          <p className='alert__title'>이번 달 {usedLabel} 지원금이 모두 소진되었습니다.</p>
          <p className='alert__desc'>{otherLabel} 지원금 적용 가능</p>
        </div>
        {isMaxBenefitApplied ? (
          renewalChip
        ) : (
          <button type='button' className='btn btn--primary btn--sm payment-callout__action' onClick={onApplyMaxBenefit}>
            <Icon name='sparkle' />
            최대혜택 적용하기
          </button>
        )}
      </div>
    );
  }

  if (!hasRecommendedItems && !hasPersonalItems) return null;

  // 둘 다 소진 안 됨 — 최대혜택 적용 완료 상태 또는 미적용 상태(Case 2-D)
  if (isMaxBenefitApplied) {
    return (
      <div className='alert payment-callout'>
        <span className='alert__icon'>
          <Icon name='check-circle' />
        </span>
        <div className='alert__body'>
          <p className='alert__title'>지원 혜택이 가장 큰 도서에 지원금이 자동 적용되었습니다.</p>
        </div>
        <span className='status-chip status-chip--available payment-callout__chip'>
          <Icon name='check-circle' />
          적용 완료
        </span>
      </div>
    );
  }

  return (
    <div className='alert payment-callout'>
      <span className='alert__icon'>
        <Icon name='sparkle' />
      </span>
      <div className='alert__body'>
        <p className='alert__title'>[최대혜택 적용하기]를 눌러 가장 큰 할인 혜택을 확인해 보세요.</p>
      </div>
      <button type='button' className='btn btn--primary btn--sm payment-callout__action' onClick={onApplyMaxBenefit}>
        <Icon name='sparkle' />
        최대혜택 적용하기
      </button>
    </div>
  );
}
