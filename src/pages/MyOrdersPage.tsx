import { Link } from 'react-router-dom';
import { getSessionUser } from '@/data/auth';

export default function MyOrdersPage() {
  const user = getSessionUser();

  return (
    <main id='main' className='main my-page-layout'>
      <div className='container my-page-layout__inner'>
        
        {/* LNB (사이드바) */}
        <aside className='my-page-sidebar'>
          <div className='my-page-sidebar__user'>
            <p className='text-h3'>{user?.name ?? '홍길동'} 님</p>
            <p className='caption'>(주)한글과컴퓨터</p>
          </div>
          
          <nav className='my-page-nav'>
            <div className='my-page-nav__group'>
              <h4 className='my-page-nav__title'>쇼핑 & 주문 관리</h4>
              <ul>
                <li><Link to="/mypage">마이페이지 홈</Link></li>
                <li className='is-active'><Link to="/orders">주문 / 배송 조회</Link></li>
              </ul>
            </div>
            <div className='my-page-nav__group'>
              <h4 className='my-page-nav__title'>복지 혜택</h4>
              <ul>
                <li><Link to="/subsidy">나의 지원금 현황</Link></li>
              </ul>
            </div>
            <div className='my-page-nav__group'>
              <h4 className='my-page-nav__title'>독서 서재</h4>
              <ul>
                <li><Link to="/myreading">나의 독서현황</Link></li>
                <li><Link to="/myreview">나의 서평</Link></li>
                <li><Link to="/mystats">독서 통계</Link></li>
              </ul>
            </div>
            <div className='my-page-nav__group'>
              <h4 className='my-page-nav__title'>계정 & 설정</h4>
              <ul>
                <li><Link to="/profile">회원 정보 조회</Link></li>
              </ul>
            </div>
          </nav>
        </aside>

        <div className='my-page-content'>
          <div className='my-page-content__header'>
            <h1 className='text-h1'>주문 / 배송 조회 (Order & Delivery History)</h1>
            <div className='my-page-content__actions'>
              <Link to='/cart' className='btn btn--secondary btn--sm'>장바구니 (2)</Link>
              <Link to='/' className='btn btn--primary btn--sm'>도서 둘러보기</Link>
            </div>
          </div>

          <div className='my-orders'>
            
            {/* 조회 기간 / 필터 (card) */}
            <div className='card filter-card'>
              <div className='filter-row'>
                <span className='filter-label'>조회 기간</span>
                <div className='filter-options'>
                  <button className='filter-btn is-active'>1개월</button>
                  <button className='filter-btn'>3개월</button>
                  <button className='filter-btn'>6개월</button>
                  <button className='filter-btn'>2026년 전체</button>
                </div>
                <button className='btn btn--secondary filter-submit'>필터 적용</button>
              </div>
              <div className='filter-row'>
                <span className='filter-label'>주문 구분</span>
                <select className='select-box'>
                  <option>도서 구분 전체 (추천/개인)</option>
                </select>
                
                <span className='filter-label'>배송 상태</span>
                <select className='select-box'>
                  <option>전체 상태</option>
                </select>
              </div>
            </div>

            <div className='my-orders__list-header'>
              <h3 className='text-h3'>도서 주문 목록 (총 2건)</h3>
            </div>

            {/* 도서 주문 목록 */}
            <div className='order-list'>
              {/* Order Card 1 */}
              <div className='order-card'>
                <div className='order-card__header'>
                  <span className='order-card__title'><strong>2026.09.12</strong> | 주문번호: ORD-20260912-0081</span>
                  <Link to='#' className='order-card__link'>[주문상세 보기 &gt;]</Link>
                </div>
                <div className='order-card__body'>
                  <div className='order-card__book'>
                    <div className='book-thumb'>표지</div>
                    <div className='book-info'>
                      <div className='book-info__title'>
                        <span className='badge badge--general'>개인도서</span>
                        <strong>트렌드 코리아 2027</strong>
                      </div>
                      <span className='caption'>| 종이도서 (1권)</span>
                      <div className='book-info__meta caption'>
                        <span>저자: 김난도, 전미영 외</span>
                        <span>출판사: 미래의창</span>
                        <span>정가: 19,000원</span>
                      </div>
                    </div>
                  </div>
                  <div className='order-card__payment'>
                    <span className='text-blue'>회사지원: -9,500원 (50%)</span>
                    <strong className='text-red'>본인결제: 9,500원</strong>
                    <span className='caption'>(신용카드 결제)</span>
                  </div>
                  <div className='order-card__status'>
                    <strong className='text-green'>배송완료</strong>
                    <span className='caption'>CJ대한통운</span>
                    <span className='caption'>682-1920-3341</span>
                  </div>
                  <div className='order-card__actions'>
                    <button className='btn btn--primary btn--sm'>배송조회</button>
                    <button className='btn btn--secondary btn--sm'>주문상세</button>
                  </div>
                </div>
              </div>

              {/* Order Card 2 */}
              <div className='order-card'>
                <div className='order-card__header'>
                  <span className='order-card__title'><strong>2026.08.05</strong> | 주문번호: ORD-20260805-0019</span>
                  <Link to='#' className='order-card__link'>[주문상세 보기 &gt;]</Link>
                </div>
                <div className='order-card__body'>
                  <div className='order-card__book'>
                    <div className='book-thumb'>표지</div>
                    <div className='book-info'>
                      <div className='book-info__title'>
                        <span className='badge badge--recommend'>추천도서</span>
                        <strong>AI 에이전트 혁명</strong>
                      </div>
                      <span className='caption'>| 종이도서 (1권)</span>
                      <div className='book-info__meta caption'>
                        <span>선정: 영풍문고 큐레이션</span>
                        <span>분야: 경제경영</span>
                        <span>정가: 22,000원</span>
                      </div>
                    </div>
                  </div>
                  <div className='order-card__payment'>
                    <span className='text-blue'>회사지원: -22,000원 (100%)</span>
                    <strong>본인결제: 0원 (전액지원)</strong>
                    <span className='caption'>(회사 잔액지원)</span>
                  </div>
                  <div className='order-card__status'>
                    <strong className='text-green'>배송완료</strong>
                    <span className='caption'>한진택배</span>
                    <span className='caption'>418-9012-7718</span>
                  </div>
                  <div className='order-card__actions'>
                    <button className='btn btn--primary btn--sm'>배송조회</button>
                    <button className='btn btn--secondary btn--sm'>주문상세</button>
                  </div>
                </div>
              </div>
            </div>

            {/* 도서 배송 및 취소/환불 정책 안내 */}
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
