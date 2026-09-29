import { useState, type ReactNode } from 'react';
import SubsidyCallout from '@/components/Payment/SubsidyCallout';

// 실제 SubsidyCallout 컴포넌트를 props 조합만 바꿔 렌더링, 마크업 수기 복제 시 실제 컴포넌트와 어긋날 위험 방지
// 라우트 미연결 pages_temp 관례, 검수 종료 후 삭제 가능

interface CaseDemoProps {
  code: string;
  title: string;
  children: (props: { isMaxBenefitApplied: boolean; onApplyMaxBenefit: () => void }) => ReactNode;
}

function CaseDemo({ code, title, children }: CaseDemoProps) {
  const [isMaxBenefitApplied, setIsMaxBenefitApplied] = useState(false);
  return (
    <article className='card card--sm'>
      <p className='card__title'>
        {code} — {title}
      </p>
      {children({ isMaxBenefitApplied, onApplyMaxBenefit: () => setIsMaxBenefitApplied(true) })}
    </article>
  );
}

export default function SubsidyCalloutPreviewPage() {
  return (
    <main id='main' className='main'>
      <div className='container style-guide'>
        <div>
          <h1>SubsidyCallout 상태 미리보기</h1>
          <p className='text-body-sm'>결제하기_예외상태케이스.pdf(PAY-01-2)의 Case 2-A~2-D를 실제 SubsidyCallout 컴포넌트로 렌더링합니다. [최대혜택 적용하기] 버튼은 실제로 눌러서 전환을 확인할 수 있습니다.</p>
        </div>

        <CaseDemo code='Case 2-A' title="지원금 상태 배너 — 모두 소진">
          {() => <SubsidyCallout recommendedUsed personalUsed hasRecommendedItems hasPersonalItems isMaxBenefitApplied={false} onApplyMaxBenefit={() => {}} />}
        </CaseDemo>

        <CaseDemo code='Case 2-B' title='지원금 상태 배너 — 일부 소진 · 대체상품 없음 (추천도서 소진)'>
          {() => <SubsidyCallout recommendedUsed personalUsed={false} hasRecommendedItems hasPersonalItems={false} isMaxBenefitApplied={false} onApplyMaxBenefit={() => {}} />}
        </CaseDemo>

        <CaseDemo code='Case 2-B' title='지원금 상태 배너 — 일부 소진 · 대체상품 없음 (개인도서 소진)'>
          {() => <SubsidyCallout recommendedUsed={false} personalUsed hasRecommendedItems={false} hasPersonalItems isMaxBenefitApplied={false} onApplyMaxBenefit={() => {}} />}
        </CaseDemo>

        <CaseDemo code='Case 2-C' title='지원금 상태 배너 — 일부 소진 · 미적용 (추천도서 소진, 개인도서 적용 가능)'>
          {({ isMaxBenefitApplied, onApplyMaxBenefit }) => <SubsidyCallout recommendedUsed personalUsed={false} hasRecommendedItems hasPersonalItems isMaxBenefitApplied={isMaxBenefitApplied} onApplyMaxBenefit={onApplyMaxBenefit} />}
        </CaseDemo>

        <CaseDemo code='Case 2-C' title='지원금 상태 배너 — 일부 소진 · 미적용 (개인도서 소진, 추천도서 적용 가능)'>
          {({ isMaxBenefitApplied, onApplyMaxBenefit }) => <SubsidyCallout recommendedUsed={false} personalUsed hasRecommendedItems hasPersonalItems isMaxBenefitApplied={isMaxBenefitApplied} onApplyMaxBenefit={onApplyMaxBenefit} />}
        </CaseDemo>

        <CaseDemo code='Case 2-D' title='지원금 상태 배너 — 최대혜택 미적용'>
          {({ isMaxBenefitApplied, onApplyMaxBenefit }) => <SubsidyCallout recommendedUsed={false} personalUsed={false} hasRecommendedItems hasPersonalItems isMaxBenefitApplied={isMaxBenefitApplied} onApplyMaxBenefit={onApplyMaxBenefit} />}
        </CaseDemo>

        <CaseDemo code='(참고)' title='최대혜택 적용 완료 — 소진 없이 정상 적용된 상태(예외 케이스 아님, 비교용)'>
          {() => <SubsidyCallout recommendedUsed={false} personalUsed={false} hasRecommendedItems hasPersonalItems isMaxBenefitApplied onApplyMaxBenefit={() => {}} />}
        </CaseDemo>
      </div>
    </main>
  );
}
