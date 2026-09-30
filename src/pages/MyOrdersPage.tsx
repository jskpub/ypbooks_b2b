import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getSessionUser } from '@/data/auth';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

export default function MyOrdersPage() {
  const user = getSessionUser();
  const { orderHistory } = useCart();
  const { showToast } = useToast();
  const handleOrderDetailClick = () => showToast('준비중입니다');

  const [period, setPeriod] = useState('1m');
  const [group, setGroup] = useState('all');
  const [status, setStatus] = useState('all');

  const now = new Date();

  // orderDate가 '2026. 09. 12. 오후 3:45:00' 같은 문자열 형태라 정규식으로 날짜 부분만 추출해 변환
  const parseDate = (dateStr: string) => {
    const match = dateStr.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\./);
    if (match) {
      return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    }
    return new Date();
  };

  const filteredOrders = orderHistory
    .map((order) => {
      // 아이템 단위로 필터링해 일치하는 아이템이 있는 주문만 노출
      const filteredItems = order.items.filter((item) => {
        const matchGroup = group === 'all' || item.group === group;
        // 배송 상태 값 하드코딩, item.status 미연동
        const itemStatus = 'ready';
        const matchStatus = status === 'all' || status === itemStatus;
        return matchGroup && matchStatus;
      });
      return { ...order, items: filteredItems };
    })
    .filter((order) => {
      if (order.items.length === 0) return false;

      const orderDate = parseDate(order.orderDate);
      if (period === '1m') {
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        if (orderDate < oneMonthAgo) return false;
      } else if (period === '3m') {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        if (orderDate < threeMonthsAgo) return false;
      } else if (period === '6m') {
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        if (orderDate < sixMonthsAgo) return false;
      }
      return true;
    });

  return (
    <main id='main' className='main my-page-layout'>
      <div className='container my-page-layout__inner'>
        <aside className='my-page-sidebar'>
          <div className='my-page-sidebar__user'>
            <p className='text-h3'>{user?.name ?? '김민서'} 님</p>
            <p className='caption'>한결그룹</p>
          </div>

          <nav className='my-page-nav'>
            <div className='my-page-nav__group'>
              <h4 className='my-page-nav__title'>쇼핑 & 주문 관리</h4>
              <ul>
                <li>
                  <Link to='/mypage'>마이페이지 홈</Link>
                </li>
                <li className='is-active'>
                  <Link to='/orders'>주문 / 배송 조회</Link>
                </li>
              </ul>
            </div>
            <div className='my-page-nav__group'>
              <h4 className='my-page-nav__title'>복지 혜택</h4>
              <ul>
                <li>
                  <Link to='/subsidy'>나의 지원금 현황</Link>
                </li>
              </ul>
            </div>
            <div className='my-page-nav__group'>
              <h4 className='my-page-nav__title'>독서 서재</h4>
              <ul>
                <li>
                  <Link to='/myreading'>나의 독서현황</Link>
                </li>
                <li>
                  <Link to='/myreview'>나의 서평</Link>
                </li>
                <li>
                  <Link to='/mystats'>독서 통계</Link>
                </li>
              </ul>
            </div>
            <div className='my-page-nav__group'>
              <h4 className='my-page-nav__title'>계정 & 설정</h4>
              <ul>
                <li>
                  <Link to='/profile'>회원 정보 조회</Link>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        <div className='my-page-content'>
          <div className='my-page-content__header'>
            <h1 className='text-h1'>주문 / 배송 조회</h1>
          </div>

          <div className='my-orders'>
            <div className='card filter-card'>
              <div className='filter-row'>
                <span className='filter-label'>조회 기간</span>
                <div className='filter-options'>
                  <button className={`filter-btn ${period === '1m' ? 'is-active' : ''}`} onClick={() => setPeriod('1m')}>
                    1개월
                  </button>
                  <button className={`filter-btn ${period === '3m' ? 'is-active' : ''}`} onClick={() => setPeriod('3m')}>
                    3개월
                  </button>
                  <button className={`filter-btn ${period === '6m' ? 'is-active' : ''}`} onClick={() => setPeriod('6m')}>
                    6개월
                  </button>
                  <button className={`filter-btn ${period === 'all' ? 'is-active' : ''}`} onClick={() => setPeriod('all')}>
                    2026년 전체
                  </button>
                </div>
                <button className='btn btn--secondary filter-submit'>필터 적용</button>
              </div>
              <div className='filter-row'>
                <span className='filter-label'>주문 구분</span>
                <select className='select-box' value={group} onChange={(e) => setGroup(e.target.value)}>
                  <option value='all'>도서 구분 전체 (추천/개인)</option>
                  <option value='recommended'>추천도서</option>
                  <option value='personal'>개인도서</option>
                </select>

                <span className='filter-label'>배송 상태</span>
                <select className='select-box' value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value='all'>전체 상태</option>
                  <option value='ready'>배송준비중</option>
                  <option value='shipping'>배송중</option>
                  <option value='done'>배송완료</option>
                </select>
              </div>
            </div>

            <div className='my-orders__list-header'>
              <h3 className='text-h3'>도서 주문 목록 (총 {filteredOrders.length}건)</h3>
            </div>

            <div className='order-list'>
              {filteredOrders.length === 0 ? (
                <div className='text-center' style={{ padding: '2rem' }}>
                  조건에 맞는 주문 내역이 없습니다.
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div className='order-card' key={order.orderId}>
                    <div className='order-card__header'>
                      <span className='order-card__title'>
                        <strong>{order.orderDate.split(' ')[0]}</strong> | 주문번호: {order.orderId}
                      </span>
                      <a href='javascript:;' className='order-card__link' onClick={handleOrderDetailClick}>
                        [주문상세 보기 &gt;]
                      </a>
                    </div>
                    <div className='order-card__body'>
                      <div className='order-card__items' style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                        {order.items.map((book) => (
                          <div key={book.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                            <div className='order-card__book'>
                              {book.coverSrc ? <img src={book.coverSrc} alt={book.title} className='book-thumb' style={{ width: 64, height: 92, objectFit: 'cover' }} /> : <div className='book-thumb'>표지</div>}
                              <div className='book-info'>
                                <div className='book-info__title'>
                                  <span className={`badge ${book.group === 'recommended' ? 'badge--recommend' : 'badge--general'}`}>{book.group === 'recommended' ? '추천도서' : '개인도서'}</span>
                                  <strong>{book.title}</strong>
                                </div>
                                <span className='caption'>
                                  | {book.formatLabel} ({book.qty}권)
                                </span>
                                <div className='book-info__meta caption'>
                                  <span>정가: {book.sellingPrice.toLocaleString()}원</span>
                                </div>
                              </div>
                            </div>
                            <div className='order-card__payment' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                              <span className='text-blue'>회사지원: -{book.subsidy.toLocaleString()}원</span>
                              <strong className='text-red'>본인결제: {book.employeePayment.toLocaleString()}원</strong>
                            </div>
                            <div className='order-card__status' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <strong className='text-green'>결제완료</strong>
                              <span className='caption'>배송준비중</span>
                            </div>
                            <div className='order-card__actions' style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'center' }}>
                              <button className='btn btn--primary btn--sm' disabled>
                                배송조회
                              </button>
                              <button type='button' className='btn btn--secondary btn--sm' onClick={handleOrderDetailClick}>
                                주문상세
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className='policy-notice'>
              <h4 className='text-h4'>도서 배송 및 취소/환불 정책 안내</h4>
              <ul className='policy-notice__list caption'>
                <li>배송 안내: 주문 완료 후 익일 출고를 원칙으로 하며, 발송 시작 시 등록된 연락처로 알림톡(송장번호)이 자동 발송됩니다.</li>
                <li>주문 취소 가능 시점: 주문 상태가 [결제완료] 상태일 때만 [주문상세] 페이지에서 즉시 주문 취소가 가능하며, [배송준비중] 단계 이후에는 취소가 불가합니다.</li>
                <li>지원금 및 한도 복원: 주문 취소 완료 시 회사 지원금은 즉시 환수되며, 사용 처리되었던 해당 월의 도서 지원금 1권 한도는 실시간으로 자동 복원됩니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
