import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import StepIndicator from '@/components/StepIndicator';
import EmptyState from '@/components/EmptyState';
import { useCart } from '@/context/CartContext';

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

// 마이페이지/주문내역 라우트 부재로 "쇼핑 계속하기"만 유지, 클립보드 복사도 적합한 아이콘 부재로 텍스트 버튼 대체
export default function OrderCompletePage() {
  const { lastOrder } = useCart();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = async () => {
    if (!lastOrder) return;
    try {
      await navigator.clipboard.writeText(lastOrder.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 API 미지원/권한 거부 환경 무시, 주문번호는 화면에 이미 표시됨
    }
  };

  if (!lastOrder) {
    return (
      <main id='main' className='main'>
        <div className='container order-complete'>
          <EmptyState icon='shopping-bag' title='주문 내역이 없습니다.' description='아직 완료된 주문이 없어요.' actionLabel='도서 둘러보기' onAction={() => navigate('/')} />
        </div>
      </main>
    );
  }

  return (
    <main id='main' className='main'>
      <div className='container order-complete'>
        <div className='order-complete__step'>
          <StepIndicator currentStep='complete' />
        </div>

        <div className='card order-complete__hero'>
          <span className='order-complete__hero-icon'>
            <Icon name='check-circle' />
          </span>
          <span className='status-chip status-chip--available'>B2B 복합결제 정상 승인 완료</span>
          <h1>주문이 성공적으로 완료되었습니다!</h1>
          <p className='order-complete__hero-desc'>주문하신 상품의 배송 준비가 시작되며, 알림톡으로 배송 정보를 안내해 드립니다.</p>

          <div className='order-complete__id-box'>
            <div className='order-complete__id-row'>
              <span>통합 주문번호</span>
              <span className='order-complete__id-value'>
                <strong>{lastOrder.orderId}</strong>
                <button type='button' className='order-complete__copy-btn' onClick={handleCopyOrderId}>
                  {copied ? '복사됨' : '복사'}
                </button>
              </span>
            </div>
            <div className='order-complete__id-row'>
              <span>주문일시</span>
              <span>{lastOrder.orderDate}</span>
            </div>
          </div>
        </div>

        <div className='card order-complete__settlement'>
          <p className='card__title'>복합결제 정산 내역</p>
          <div className='order-complete__settlement-grid'>
            <div className='order-complete__settlement-box'>
              <span>총 도서 금액</span>
              <strong>{formatWon(lastOrder.totalSellingPrice)}</strong>
            </div>
            <Icon name='minus' className='icon order-complete__settlement-op' />
            <div className='order-complete__settlement-box order-complete__settlement-box--subsidy'>
              <span>회사 지원금</span>
              <strong>{formatWon(lastOrder.totalCompanySubsidy)}</strong>
            </div>
            <Icon name='equals' className='icon order-complete__settlement-op' />
            <div className='order-complete__settlement-box order-complete__settlement-box--final'>
              <span>직원 결제금액</span>
              <strong>{formatWon(lastOrder.finalPaidAmount)}</strong>
            </div>
          </div>
          <div className='order-complete__settlement-rows'>
            <div className='order-complete__id-row'>
              <span>직원 결제수단</span>
              <span>{lastOrder.paymentMethod}</span>
            </div>
            <div className='order-complete__id-row'>
              <span>배송비</span>
              <span>{lastOrder.shippingFee === 0 ? '무료' : formatWon(lastOrder.shippingFee)}</span>
            </div>
          </div>
        </div>

        <div className='card order-complete__items'>
          <p className='card__title'>주문 상품 정보 ({lastOrder.items.length}종)</p>
          <table className='cart-table'>
            <thead>
              <tr>
                <th className='cart-table__book-col'>상품정보</th>
                <th className='cart-table__price-col'>판매가</th>
                <th className='cart-table__num-col'>수량</th>
                <th className='cart-table__subsidy-col'>회사 지원금</th>
                <th className='cart-table__payment-col'>직원 결제액</th>
              </tr>
            </thead>
            <tbody>
              {lastOrder.items.map((item) => (
                <tr key={item.id}>
                  <td className='cart-table__book-col'>
                    <div className='cart-book'>
                      <span className='cart-book__cover'>{item.coverSrc ? <img src={item.coverSrc} alt='' /> : <Icon name='books' />}</span>
                      <div className='cart-book__contents'>
                        <strong className='cart-book__title'>{item.title}</strong>
                        <p className='cart-book__byline'>{item.formatLabel}</p>
                      </div>
                    </div>
                  </td>
                  <td className='cart-table__price-col'>{formatWon(item.sellingPrice * item.qty)}</td>
                  <td className='cart-table__num-col'>{item.qty}</td>
                  <td className='cart-table__subsidy-col'>{item.subsidy > 0 ? `-${formatWon(item.subsidy)}` : '-'}</td>
                  <td className='cart-table__payment-col'>{formatWon(item.employeePayment)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='card order-complete__delivery'>
          <p className='card__title'>배송지 정보</p>
          <div className='order-complete__id-row'>
            <span>수령인</span>
            <span>
              {lastOrder.deliveryAddress.recipient} ({lastOrder.deliveryAddress.phone1})
            </span>
          </div>
          <div className='order-complete__id-row'>
            <span>배송 주소</span>
            <span>
              ({lastOrder.deliveryAddress.postalCode}) {lastOrder.deliveryAddress.roadAddress} {lastOrder.deliveryAddress.detailAddress}
            </span>
          </div>
          <div className='order-complete__id-row'>
            <span>배송 메모</span>
            <span>{lastOrder.deliveryMemo || '부재시 경비실에 맡겨주세요.'}</span>
          </div>
        </div>

        <div className='order-complete__actions'>
          {/* 마이페이지 주문 탭 라우트 부재로 자리만 확보 */}
          <a href='javascript:;' className='btn btn--secondary'>
            <Icon name='receipt' />
            주문/배송내역 조회
          </a>
          <Link to='/' className='btn btn--secondary'>
            <Icon name='shopping-bag' />
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    </main>
  );
}
