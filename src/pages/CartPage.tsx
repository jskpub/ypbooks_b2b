import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { StepIndicator } from '@/components/StepIndicator';
import CartGroupSection from '@/components/Cart/CartGroupSection';
import DeliveryInfoModal from '@/components/Cart/DeliveryInfoModal';
import { initialCartItems, type CartGroup } from '@/data/cartItems';

const FREE_SHIPPING_THRESHOLD = 10000;
const SHIPPING_FEE = 2500;

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

// YP_PAYMENTS CartPage(E:\YP_PAYMENTS\src\pages\CartPage.tsx) 이식.
// 원본은 전역 ShopContext(useShop)로 cart/subsidyLedger/selectedAddress를 관리하지만,
// 이 프로젝트엔 그런 전역 상태가 없어서 전부 이 페이지의 로컬 state로 옮겼다 — 동작(상태 전이,
// 계산 로직)은 동일하게 유지하고 주소 선택 모달처럼 이 프로젝트에 아직 없는 기능은 자리만
// 잡아두고 연결하지 않았다(아래 주석 참고).
export default function CartPage() {
  const [items, setItems] = useState(initialCartItems);
  const [expandedGroups, setExpandedGroups] = useState<Record<CartGroup, boolean>>({
    recommended: true,
    personal: true,
  });
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

  // 이번 달 그룹별 지원금 한도 소진 여부 — 원본의 subsidyLedger.recommendedUsed/personalUsed에 대응.
  // 실제 지원금 사용량을 계산하는 백엔드/전역 상태가 아직 없어서 기본값 false(소진 안 됨)로 시작한다.
  const [recommendedSubsidyExhausted] = useState(false);
  const [personalSubsidyExhausted] = useState(false);

  const toggleChecked = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const toggleAllChecked = (checked: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, checked })));
  };

  const changeQty = (id: string, qty: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const removeSelected = () => {
    setItems((prev) => prev.filter((item) => !item.checked));
  };

  const toggleGroupExpanded = (group: CartGroup) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const recommendedItems = useMemo(() => items.filter((item) => item.group === 'recommended'), [items]);
  const personalItems = useMemo(() => items.filter((item) => item.group === 'personal'), [items]);

  const { totalList, totalSelling, selectedCount } = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        if (!item.checked) return acc;
        acc.totalList += item.listPrice * item.qty;
        acc.totalSelling += item.sellingPrice * item.qty;
        acc.selectedCount += 1;
        return acc;
      },
      { totalList: 0, totalSelling: 0, selectedCount: 0 },
    );
  }, [items]);

  const discount = totalList - totalSelling;
  const shippingFee = totalSelling === 0 || totalSelling >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const finalTotal = totalSelling + shippingFee;
  const shippingProgress = Math.min(100, (totalSelling / FREE_SHIPPING_THRESHOLD) * 100);
  const shippingShortfall = FREE_SHIPPING_THRESHOLD - totalSelling;

  const isEmpty = items.length === 0;
  const isAllSelected = items.length > 0 && selectedCount === items.length;

  return (
    <main id='main' className='main'>
      <div className='container cart'>
        <div className='cart__head'>
          <div>
            <h1>장바구니</h1>
            <p className='cart__head-desc text-body-sm'>선택하신 도서 목록과 수량을 확인해 주세요.</p>
            <p className='cart__head-note text-body-sm'>※ 회사 지원금은 다음 단계인 결제 페이지에서 적용할 수 있습니다.</p>
          </div>
          <StepIndicator currentStep='cart' />
        </div>

        <div className='layout-with-sidebar cart__layout'>
          <div className='layout-with-sidebar__main cart__main'>
            <div className='shipping-card'>
              <div className='shipping-card__left'>
                <span className='shipping-card__icon'>
                  <Icon name='truck' />
                </span>
                <div>
                  <p className='shipping-card__message text-body-sm'>
                    {shippingShortfall > 0 ? (
                      <>
                        <span className='shipping-card__amount'>{formatWon(shippingShortfall)}</span> 더 담으면 <strong>무료배송!</strong>
                      </>
                    ) : (
                      '무료배송 달성!'
                    )}
                  </p>
                  <p className='shipping-card__sub caption'>10,000원 이상 결제 시 기본 배송비 무료 (미만 시 2,500원)</p>
                </div>
              </div>
              <div className='shipping-card__right'>
                <div className='progress shipping-card__track'>
                  <div className='progress__track'>
                    <div className='progress__fill' style={{ width: `${shippingProgress}%` }} />
                  </div>
                </div>
                {/* 원본은 추천도서 목록 페이지('recommended')로 이동 — 이 프로젝트엔 아직 그 라우트가 없어 자리만 잡아둠 */}
                <a href='javascript:;' className='btn btn--secondary btn--sm'>
                  상품 더 담기
                </a>
              </div>
            </div>

            {!isEmpty && (
              <div className='cart-controls'>
                <div className='cart-controls__left'>
                  <label className='checkbox'>
                    <input type='checkbox' aria-label='전체 상품 선택' checked={isAllSelected} onChange={(event) => toggleAllChecked(event.target.checked)} />
                    전체 선택 (<span>{selectedCount}</span>/<span>{items.length}</span>)
                  </label>
                  <span className='cart-controls__divider' aria-hidden='true'>
                    |
                  </span>
                  <button type='button' className='cart-controls__remove text-body-sm' onClick={removeSelected}>
                    선택 상품 삭제
                  </button>
                </div>
                <p className='cart-controls__note caption'>서울/수도권 인근 월~토 12시까지 주문 시 당일배송</p>
              </div>
            )}

            {isEmpty && (
              <div className='cart-empty'>
                <Icon name='shopping-bag' />
                <p className='text-h4'>장바구니에 담긴 상품이 없습니다.</p>
                <a href='javascript:;' className='btn btn--primary'>
                  추천도서 둘러보기
                </a>
              </div>
            )}

            <CartGroupSection
              bodyId='cart-group-recommended-body'
              badgeClassName='badge--recommended'
              badgeIcon='star'
              badgeLabel='추천도서'
              titleText='회사 100% 지원'
              titleNote={
                <>
                  *직원 부담금 <strong>0원</strong> (월 1권 한도)
                </>
              }
              items={recommendedItems}
              isExpanded={expandedGroups.recommended}
              onToggleExpand={() => toggleGroupExpanded('recommended')}
              onToggleChecked={toggleChecked}
              onQtyChange={changeQty}
              onRemove={removeItem}
              onDeliveryInfoOpen={() => setIsDeliveryModalOpen(true)}
              isSubsidyExhausted={recommendedSubsidyExhausted}
              exhaustedMessage='추천도서의 지원 한도가 소진되어, 추천 도서는 본인 부담으로 결제됩니다.'
            />

            <CartGroupSection
              bodyId='cart-group-personal-body'
              badgeClassName='badge--general'
              badgeIcon='books'
              badgeLabel='개인도서'
              titleText='도서 금액의 50% 지원'
              titleNote={
                <>
                  *1권 당 최대 <strong>10,000원</strong> 한도 지원 (월 1권 한도)
                </>
              }
              items={personalItems}
              isExpanded={expandedGroups.personal}
              onToggleExpand={() => toggleGroupExpanded('personal')}
              onToggleChecked={toggleChecked}
              onQtyChange={changeQty}
              onRemove={removeItem}
              onDeliveryInfoOpen={() => setIsDeliveryModalOpen(true)}
              isSubsidyExhausted={personalSubsidyExhausted}
              exhaustedMessage='개인도서의 지원 한도가 소진되어, 개인 도서는 본인 부담으로 결제됩니다.'
            />

            <div className='cart-actions'>
              <button type='button' className='btn btn--secondary btn--sm' onClick={removeSelected}>
                선택 삭제
              </button>
              <Link to='/' className='btn btn--secondary btn--sm'>
                <Icon name='shopping-bag' />
                쇼핑 계속하기
              </Link>
            </div>
          </div>

          <div className='layout-with-sidebar__sidebar'>
            {/* 원본은 클릭 시 배송지 선택 모달(setIsAddressModalOpen)을 여는데, 이 프로젝트엔 아직
                그 모달 컴포넌트가 없어서 우선 정적으로만 둔다. */}
            <div className='cart-address'>
              <div className='cart-address__head'>
                <span className='cart-address__title text-body-sm'>배송지</span>
              </div>
              <div className='cart-address__select caption'>
                <span className='text-truncate'>서울특별시 종로구 청계천로 41...</span>
                <Icon name='caret-down' />
              </div>
              <ul className='cart-address__notes caption'>
                <li>• 내일 출고 가능</li>
                <li>• 상품별 배송 예상일이 다른 경우, 가장 늦은 상품에 맞춰 함께 배송됩니다.</li>
              </ul>
            </div>

            <div className='cart-summary'>
              <p className='cart-summary__title text-body-base'>주문 합계</p>
              <div className='cart-summary__rows text-body-sm'>
                <div className='cart-summary__row'>
                  <span>총 도서 정가</span>
                  <span>{formatWon(totalList)}</span>
                </div>
                <div className='cart-summary__row cart-summary__row--discount'>
                  <span>도서 기본 할인</span>
                  <span>- {formatWon(discount)}</span>
                </div>
                <div className='cart-summary__row'>
                  <span>도서 실판매가 합계</span>
                  <span>{formatWon(totalSelling)}</span>
                </div>
                <div className='cart-summary__row'>
                  <span>배송비</span>
                  <span>{shippingFee === 0 ? '무료 (1만원 이상)' : formatWon(shippingFee)}</span>
                </div>
              </div>
              <div className='cart-summary__total'>
                <span className='cart-summary__total-label text-body-sm'>
                  결제 예정 금액
                  <span className='cart-summary__total-note caption'>(지원금 미반영)</span>
                </span>
                <span className='text-h2'>
                  <span className='cart-summary__total-amount'>{finalTotal.toLocaleString('ko-KR')}</span>원
                </span>
              </div>
              <Link to='/payment' className='btn btn--primary btn--lg'>
                주문하기 <Icon name='caret-right' />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <DeliveryInfoModal isOpen={isDeliveryModalOpen} onClose={() => setIsDeliveryModalOpen(false)} />
    </main>
  );
}
