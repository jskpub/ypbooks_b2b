import { useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import StepIndicator from '@/components/StepIndicator';
import EmptyState from '@/components/EmptyState';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/Toast';
import type { CartGroup, CartItem } from '@/data/cartItems';
import { getItemSubsidy } from '@/utils/subsidy';
import { getShippingFee } from '@/utils/pricing';
import PaymentGroupSection from '@/components/Payment/PaymentGroupSection';
import SubsidyCallout from '@/components/Payment/SubsidyCallout';
import AddressSection from '@/components/Payment/AddressSection';
import PaymentMethodSection, { PAYMENT_METHOD_LABELS } from '@/components/Payment/PaymentMethodSection';
import OrdererInfoCard from '@/components/Payment/OrdererInfoCard';
import PaymentSummaryCard from '@/components/Payment/PaymentSummaryCard';
import SubsidyConfirmModal from '@/components/Payment/SubsidyConfirmModal';
import PaymentProcessingModal from '@/components/Payment/PaymentProcessingModal';
import AddressModal from '@/components/AddressModal';

const SUBSIDY_TYPES: CartGroup[] = ['recommended', 'personal'];
const DELIVERY_MEMO_DEFAULT = '부재시 경비실에 맡겨주세요.';

// YP_PAYMENTS PaymentPage(E:\YP_PAYMENTS\src\pages\PaymentPage.tsx) 이식. 원본은 전역 ShopContext로
// cart/subsidyLedger/selectedAddress를 관리하는데, 이 프로젝트도 CartContext를 새로 만들어 같은
// 방식으로 옮겼다 — 장바구니에서 체크한 상품이 이 페이지에 그대로 이어진다. 지원금 적용/해제,
// 그룹당 1권 상호배타, 최대혜택 배너, 결제 확인 팝업 등 핵심 로직은 원본과 동일하게 동작한다.
export default function PaymentPage() {
  const navigate = useNavigate();
  const { toastMessage, showToast } = useToast();
  const { items, subsidyLedger, applySubsidy, removeSubsidy, toggleChecked, placeOrder, selectedAddress, openAddressList, openAddressForm } = useCart();
  const selectedItems = items.filter((item) => item.checked);
  const recommendedItems = selectedItems.filter((item) => item.group === 'recommended');
  const personalItems = selectedItems.filter((item) => item.group === 'personal');

  const [expanded, setExpanded] = useState({ recommended: true, personal: true, address: true, paymentMethod: true, b2b: true, delivery: false });
  const toggleExpanded = (key: keyof typeof expanded) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const [selectedMethod, setSelectedMethod] = useState('quick_bank');
  const [deliveryMemo, setDeliveryMemo] = useState(DELIVERY_MEMO_DEFAULT);
  const [isCustomMemo, setIsCustomMemo] = useState(false);
  const [customMemoText, setCustomMemoText] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [ordererPhonePrefix, setOrdererPhonePrefix] = useState('010');
  const [ordererPhoneMid, setOrdererPhoneMid] = useState('1234');
  const [ordererPhoneEnd, setOrdererPhoneEnd] = useState('5678');
  const [ordererEmail, setOrdererEmail] = useState('junkyo.jung@ypbooks.co.kr');

  const [showSubsidyConfirm, setShowSubsidyConfirm] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const isTypeExhausted = (type: CartGroup) => (type === 'recommended' ? subsidyLedger.recommendedUsed : subsidyLedger.personalUsed);
  const itemsOfType = (type: CartGroup) => selectedItems.filter((item) => item.group === type);

  // 결제 페이지 진입 시 지원 대상인데 미적용인 유형이 있으면, 유형별로 지원 혜택이 가장 큰
  // 도서에 자동으로 지원금을 적용한다(직원 입장에서 가장 이득이 되는 기본 선택) — 1회만 실행.
  const applyBestSubsidyFor = (type: CartGroup) => {
    const candidates = itemsOfType(type);
    if (candidates.length === 0) return;
    const best = candidates.reduce((a, b) => (b.sellingPrice * b.qty > a.sellingPrice * a.qty ? b : a));
    applySubsidy(best.id);
  };

  const hasAutoAppliedRef = useRef(false);
  useLayoutEffect(() => {
    if (hasAutoAppliedRef.current) return;
    hasAutoAppliedRef.current = true;
    SUBSIDY_TYPES.forEach((type) => {
      if (isTypeExhausted(type)) return;
      const candidates = itemsOfType(type);
      if (candidates.length === 0) return;
      if (candidates.some((item) => item.isSubsidyApplied)) return;
      applyBestSubsidyFor(type);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const relevantSubsidyTypes = SUBSIDY_TYPES.filter((type) => itemsOfType(type).length > 0 && !isTypeExhausted(type));
  const isMaxBenefitAppliedForType = (type: CartGroup) => {
    const candidates = itemsOfType(type);
    const applied = candidates.find((item) => item.isSubsidyApplied);
    if (!applied) return false;
    const maxLineTotal = Math.max(...candidates.map((item) => item.sellingPrice * item.qty));
    return applied.sellingPrice * applied.qty === maxLineTotal;
  };
  const isMaxBenefitApplied = relevantSubsidyTypes.length > 0 && relevantSubsidyTypes.every(isMaxBenefitAppliedForType);

  const handleApplyMaxBenefit = () => {
    relevantSubsidyTypes.forEach((type) => {
      if (isMaxBenefitAppliedForType(type)) return;
      applyBestSubsidyFor(type);
    });
  };

  // 지원금이 적용 중이던 상품을 [✕]로 이번 결제에서 제외하면, 남은 같은 그룹 도서 중
  // 할인액이 가장 큰 도서로 지원금을 자동 승계한다(원본 handleExcludeItem 이식).
  const handleExclude = (item: CartItem) => {
    const wasApplied = item.isSubsidyApplied;
    toggleChecked(item.id);
    if (!wasApplied) return;
    const remaining = itemsOfType(item.group).filter((candidate) => candidate.id !== item.id);
    if (remaining.length === 0) return;
    const best = remaining.reduce((a, b) => (b.sellingPrice * b.qty > a.sellingPrice * a.qty ? b : a));
    applySubsidy(best.id);
  };

  const totalSellingPrice = selectedItems.reduce((sum, item) => sum + item.sellingPrice * item.qty, 0);
  const recommendedSubsidy = recommendedItems.reduce((sum, item) => sum + getItemSubsidy(item), 0);
  const personalSubsidy = personalItems.reduce((sum, item) => sum + getItemSubsidy(item), 0);
  const shippingFee = getShippingFee(totalSellingPrice);
  const finalPaymentAmount = totalSellingPrice - recommendedSubsidy - personalSubsidy + shippingFee;

  const startPaymentProcessing = () => {
    setIsPaymentProcessing(true);
    setTimeout(() => {
      setIsPaymentProcessing(false);
      placeOrder(PAYMENT_METHOD_LABELS[selectedMethod] ?? selectedMethod, isCustomMemo ? customMemoText : deliveryMemo);
      navigate('/payment/complete');
    }, 1200);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!agreeTerms) {
      showToast('주문 내용 확인 및 약관에 동의해 주세요.');
      return;
    }
    if (selectedItems.length === 0) return;
    if (relevantSubsidyTypes.length > 0 && !isMaxBenefitApplied) {
      setShowSubsidyConfirm(true);
      return;
    }
    startPaymentProcessing();
  };

  return (
    <main id='main' className='main'>
      <div className='container payment'>
        <div className='payment__head'>
          <h1>결제하기</h1>
          <StepIndicator currentStep='payment' />
        </div>

        {selectedItems.length === 0 ? (
          <EmptyState icon='shopping-cart-simple' title='선택된 주문 상품이 없습니다.' description='주문서에서 제외된 도서는 장바구니에 보존되어 있습니다.' actionLabel='장바구니로 이동' onAction={() => navigate('/cart')} />
        ) : (
          <form onSubmit={handleSubmit} className='layout-with-sidebar payment__layout'>
            <div className='layout-with-sidebar__main payment__main'>
              <SubsidyCallout recommendedUsed={subsidyLedger.recommendedUsed} personalUsed={subsidyLedger.personalUsed} hasRecommendedItems={recommendedItems.length > 0} hasPersonalItems={personalItems.length > 0} isMaxBenefitApplied={isMaxBenefitApplied} onApplyMaxBenefit={handleApplyMaxBenefit} />

              <p className='payment__hint caption'>※ [지원금 적용하기] 버튼을 클릭하면 해당 도서에 지원금이 적용됩니다.</p>

              <PaymentGroupSection
                bodyId='payment-group-recommended-body'
                badgeClassName='badge--recommended'
                badgeIcon='star'
                badgeLabel='추천도서'
                titleText='회사 100% 지원'
                titleNote={
                  <>
                    *직원 부담금 <strong>0원</strong> (월 1권 한도)
                  </>
                }
                subsidyBtnClassName=''
                items={recommendedItems}
                isExpanded={expanded.recommended}
                onToggleExpand={() => toggleExpanded('recommended')}
                isSubsidyExhausted={subsidyLedger.recommendedUsed}
                exhaustedMessage='추천도서의 지원 한도가 소진되어, 추천 도서는 본인 부담으로 결제됩니다.'
                onApplySubsidy={applySubsidy}
                onRemoveSubsidy={removeSubsidy}
                onExclude={handleExclude}
              />

              <PaymentGroupSection
                bodyId='payment-group-personal-body'
                badgeClassName='badge--general'
                badgeIcon='books'
                badgeLabel='개인도서'
                titleText='도서 금액의 50% 지원'
                titleNote={
                  <>
                    *1권 당 최대 <strong>10,000원</strong> 한도 지원 (월 1권 한도)
                  </>
                }
                subsidyBtnClassName='subsidy-btn--personal'
                items={personalItems}
                isExpanded={expanded.personal}
                onToggleExpand={() => toggleExpanded('personal')}
                isSubsidyExhausted={subsidyLedger.personalUsed}
                exhaustedMessage='개인도서의 지원 한도가 소진되어, 개인 도서는 본인 부담으로 결제됩니다.'
                onApplySubsidy={applySubsidy}
                onRemoveSubsidy={removeSubsidy}
                onExclude={handleExclude}
              />

              <AddressSection
                isExpanded={expanded.address}
                onToggleExpand={() => toggleExpanded('address')}
                address={selectedAddress}
                onOpenAddressList={openAddressList}
                onOpenNewAddressForm={() => openAddressForm()}
                onOpenEditAddressForm={() => openAddressForm(selectedAddress.id)}
                deliveryMemo={deliveryMemo}
                isCustomMemo={isCustomMemo}
                customMemoText={customMemoText}
                onSelectPreset={(memo) => {
                  setIsCustomMemo(false);
                  setDeliveryMemo(memo);
                }}
                onSelectCustom={() => setIsCustomMemo(true)}
                onCustomMemoTextChange={setCustomMemoText}
              />

              <PaymentMethodSection isExpanded={expanded.paymentMethod} onToggleExpand={() => toggleExpanded('paymentMethod')} selectedMethod={selectedMethod} onSelectMethod={setSelectedMethod} />

              <div className='payment__info-group'>
                <div className='cart-group'>
                  <button type='button' className='cart-group__header cart-group__toggle' aria-expanded={expanded.b2b} aria-controls='payment-info-b2b' onClick={() => toggleExpanded('b2b')}>
                    <span className='cart-group__title text-body-sm'>B2B 복합결제 및 주문 안내사항</span>
                    <span className='cart-group__header-right'>
                      <span className='cart-group__chevron cart-group__chevron--down'>
                        <Icon name='caret-down' />
                      </span>
                      <span className='cart-group__chevron cart-group__chevron--up'>
                        <Icon name='caret-up' />
                      </span>
                    </span>
                  </button>
                  <div className='cart-group__body' id='payment-info-b2b' hidden={!expanded.b2b}>
                    <ul className='payment__info-list caption'>
                      <li>
                        <strong>추천도서</strong>: 100% 회사 지원 (월 1권 한도, 종이도서만 지원)
                      </li>
                      <li>
                        <strong>개인도서</strong>: 50% 회사 지원 (최대 10,000원 한도, 종이도서 또는 전자도서)
                      </li>
                      <li>구매 한도 및 갱신: 지원 한도는 매월 1일 리셋되며 당월 미사용분은 다음 달로 이월되지 않습니다.</li>
                      <li>복합결제 및 주문 관리: 회사 지원금이 차감된 후, 남은 직원 부담금만 선택한 결제수단으로 결제되며 하나의 주문번호로 통합 관리됩니다.</li>
                    </ul>
                  </div>
                </div>

                <div className='cart-group'>
                  <button type='button' className='cart-group__header cart-group__toggle' aria-expanded={expanded.delivery} aria-controls='payment-info-delivery' onClick={() => toggleExpanded('delivery')}>
                    <span className='cart-group__title text-body-sm'>일반배송상품(택배수령) 안내사항</span>
                    <span className='cart-group__header-right'>
                      <span className='cart-group__chevron cart-group__chevron--down'>
                        <Icon name='caret-down' />
                      </span>
                      <span className='cart-group__chevron cart-group__chevron--up'>
                        <Icon name='caret-up' />
                      </span>
                    </span>
                  </button>
                  <div className='cart-group__body' id='payment-info-delivery' hidden={!expanded.delivery}>
                    <ul className='payment__info-list caption'>
                      <li>재고 여부에 따라 품절/지연될 수 있으며, 이 경우 별도로 안내드립니다.</li>
                      <li>당일배송은 서울 및 수도권 인근지역에서 12:00까지 주문 시 가능합니다.</li>
                      <li>배송지가 동일하더라도 여러 건으로 진행된 주문은 각각 배송료가 부과됩니다.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className='layout-with-sidebar__sidebar'>
              <OrdererInfoCard phonePrefix={ordererPhonePrefix} phoneMid={ordererPhoneMid} phoneEnd={ordererPhoneEnd} email={ordererEmail} onPhonePrefixChange={setOrdererPhonePrefix} onPhoneMidChange={setOrdererPhoneMid} onPhoneEndChange={setOrdererPhoneEnd} onEmailChange={setOrdererEmail} />

              <PaymentSummaryCard
                totalSellingPrice={totalSellingPrice}
                hasRecommendedItems={recommendedItems.length > 0}
                hasPersonalItems={personalItems.length > 0}
                recommendedSubsidy={recommendedSubsidy}
                personalSubsidy={personalSubsidy}
                shippingFee={shippingFee}
                finalPaymentAmount={finalPaymentAmount}
                recommendedUsed={subsidyLedger.recommendedUsed}
                personalUsed={subsidyLedger.personalUsed}
                agreeTerms={agreeTerms}
                onAgreeTermsChange={setAgreeTerms}
                onBackToCart={() => navigate('/cart')}
              />
            </div>
          </form>
        )}
      </div>

      <SubsidyConfirmModal
        isOpen={showSubsidyConfirm}
        onClose={() => setShowSubsidyConfirm(false)}
        onProceedWithoutSubsidy={() => {
          setShowSubsidyConfirm(false);
          startPaymentProcessing();
        }}
        onApplyMaxBenefit={() => {
          handleApplyMaxBenefit();
          setShowSubsidyConfirm(false);
        }}
      />
      <PaymentProcessingModal isOpen={isPaymentProcessing} />
      <AddressModal />
      <Toast message={toastMessage} />
    </main>
  );
}
