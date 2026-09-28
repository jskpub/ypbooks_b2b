import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSessionUser } from '@/data/auth';
import { useCart } from '@/context/CartContext';

export default function MySubsidyPage() {
  const user = getSessionUser();
  const { orderHistory, subsidyLedger } = useCart();
  const navigate = useNavigate();

  const [period, setPeriod] = useState('all');
  const [group, setGroup] = useState('all');

  const now = new Date();

  const parseDate = (dateStr: string) => {
    const match = dateStr.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\./);
    if (match) {
      return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    }
    return new Date();
  };
  
  // 주문 내역 중 지원금이 적용된 항목들만 추출
  const subsidyItems = orderHistory.flatMap(order => 
    order.items
      .filter(item => item.subsidy > 0)
      .map(item => ({ ...item, orderId: order.orderId, orderDate: order.orderDate }))
  ).filter(item => {
    if (group !== 'all' && item.group !== group) return false;
    
    const orderDate = parseDate(item.orderDate);
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
        
        {/* LNB (사이드바) */}
        <aside className='my-page-sidebar'>
          <div className='my-page-sidebar__user'>
            <p className='text-h3'>{user?.name ?? '김민서'} 님</p>
            <p className='caption'>한결그룹</p>
          </div>
          
          <nav className='my-page-nav'>
            <div className='my-page-nav__group'>
              <h4 className='my-page-nav__title'>쇼핑 & 주문 관리</h4>
              <ul>
                <li><Link to="/mypage">마이페이지 홈</Link></li>
                <li><Link to="/orders">주문 / 배송 조회</Link></li>
              </ul>
            </div>
            <div className='my-page-nav__group'>
              <h4 className='my-page-nav__title'>복지 혜택</h4>
              <ul>
                <li className='is-active'><Link to="/subsidy">나의 지원금 현황</Link></li>
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
            <h1 className='text-h1'>나의 지원금 현황 (Subsidy Ledger)</h1>
          </div>

          <div className='my-subsidy'>
            
            {/* 당월 지원 혜택 잔여 한도 */}
            <div className='card subsidy-summary-card'>
              <div className='subsidy-summary-card__header'>
                <h3 className='text-h3'>당월 지원 혜택 잔여 한도 (2026년 9월 기준)</h3>
                <span className='caption'>매월 1일 00시 자동 갱신</span>
              </div>
              
              <div className='subsidy-summary-grid'>
                {/* 추천도서 지원금 */}
                <div className='subsidy-rule-box'>
                  <div className='subsidy-rule-box__header'>
                    {subsidyLedger.recommendedUsed ? (
                      <span className='badge badge--disabled'>한도 소진</span>
                    ) : (
                      <span className='badge badge--available'>사용 가능</span>
                    )}
                    <strong className={subsidyLedger.recommendedUsed ? 'text-red' : 'text-blue'}>월 1권 전액 지원</strong>
                  </div>
                  <h4 className='text-h3'>이달의 추천도서 지원금</h4>
                  <ul className='subsidy-rule-box__list'>
                    <li>지원 정책: 도서 정가 100% 회사 지원 (직원부담 0원)</li>
                    <li>대상 도서: 종이도서 한정 (영풍/기업 선정 10종)</li>
                    <li>당월 잔여: <strong className={subsidyLedger.recommendedUsed ? 'text-red' : 'text-blue'}>{subsidyLedger.recommendedUsed ? '0권 사용 가능' : '1권 사용 가능'}</strong></li>
                  </ul>
                  <button className='btn btn--primary subsidy-rule-box__btn' onClick={() => navigate('/recommend')}>추천도서 바로가기 &gt;</button>
                </div>
                
                {/* 개인 자유도서 지원금 */}
                <div className='subsidy-rule-box'>
                  <div className='subsidy-rule-box__header'>
                    {subsidyLedger.personalUsed ? (
                      <span className='badge badge--disabled'>한도 소진</span>
                    ) : (
                      <span className='badge badge--available'>사용 가능</span>
                    )}
                    <strong className={subsidyLedger.personalUsed ? 'text-red' : 'text-blue'}>월 1권 (최대 1만원)</strong>
                  </div>
                  <h4 className='text-h3'>개인 자유도서 지원금</h4>
                  <ul className='subsidy-rule-box__list'>
                    <li>지원 정책: 도서가의 50% 지원 (최대 10,000원 한도)</li>
                    <li>대상 도서: 종이도서 / 전자도서(eBook) 선택 가능</li>
                    <li>당월 잔여: <strong className={subsidyLedger.personalUsed ? 'text-red' : 'text-blue'}>{subsidyLedger.personalUsed ? '0권 사용 가능' : '1권 사용 가능'}</strong></li>
                  </ul>
                  <button className={subsidyLedger.personalUsed ? 'btn btn--disabled subsidy-rule-box__btn' : 'btn btn--primary subsidy-rule-box__btn'} disabled={subsidyLedger.personalUsed} onClick={() => navigate('/')}>{subsidyLedger.personalUsed ? '당월 한도 소진 (다음달 갱신)' : '개인도서 둘러보기 &gt;'}</button>
                </div>
              </div>
            </div>

            {/* 지원금 사용 및 변경 내역 */}
            <div className='card subsidy-ledger-card'>
              <div className='subsidy-ledger-card__header'>
                <h3 className='text-h3'>지원금 사용 및 변경 내역 (원장)</h3>
              </div>
              
              <div className='subsidy-ledger-filter'>
                <div className='filter-group'>
                  <span className='filter-label'>조회 기간:</span>
                  <select className='select-box' value={period} onChange={(e) => setPeriod(e.target.value)}>
                    <option value="all">2026년 전체</option>
                    <option value="1m">최근 1개월</option>
                    <option value="3m">최근 3개월</option>
                    <option value="6m">최근 6개월</option>
                  </select>
                  <span className='filter-label'>구분:</span>
                  <select className='select-box' value={group} onChange={(e) => setGroup(e.target.value)}>
                    <option value="all">전체 (추천/개인)</option>
                    <option value="recommended">추천도서</option>
                    <option value="personal">개인도서</option>
                  </select>
                </div>
                <div className='filter-result'>
                  <span className='caption'>총 {subsidyItems.length}건의 내역이 조회되었습니다.</span>
                </div>
              </div>

              <table className='ledger-table'>
                <thead>
                  <tr>
                    <th>일자</th>
                    <th>구분</th>
                    <th>도서명 / 주문번호</th>
                    <th>도서 정가</th>
                    <th>회사 지원금(차감)</th>
                    <th>상태 / 변동 내용</th>
                  </tr>
                </thead>
                <tbody>
                  {subsidyItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center" style={{padding: '2rem'}}>지원금 사용 내역이 없습니다.</td>
                    </tr>
                  ) : (
                    subsidyItems.map((item, idx) => (
                      <tr key={`${item.orderId}-${item.id}-${idx}`}>
                        <td className='text-center'>{item.orderDate.split(' ')[0]}</td>
                        <td className='text-center'><strong>{item.group === 'recommended' ? '추천도서' : '개인도서'}</strong></td>
                        <td className='text-left'>
                          <strong>{item.title}</strong>
                          <span className='caption block'>{item.orderId}</span>
                        </td>
                        <td className='text-right'>{item.sellingPrice.toLocaleString()}원</td>
                        <td className='text-right'>
                          <strong className='text-blue'>-{item.subsidy.toLocaleString()}원 ({item.group === 'recommended' ? '100%' : '50%'})</strong>
                        </td>
                        <td className='text-center'>
                          <strong className='text-green'>지원 적용 완료</strong>
                          <span className='caption block'>(당월 한도 1권 차감)</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 도서 복지 지원금 이용 및 운영 정책 안내 */}
            <div className='policy-notice'>
              <h4 className='text-h4'>도서 복지 지원금 이용 및 운영 정책 안내</h4>
              <ul className='policy-notice__list caption'>
                <li>지원금 갱신 주기: 도서 지원금은 매월 1일 00:00에 자동 갱신되며, 미사용 지원금은 익월로 이월되지 않고 소멸합니다.</li>
                <li>중복 적용 방지: 동일 주문 건에 동일 유형의 지원금 중복 적용은 불가하며, 결제 단계에서 최대 혜택 도서에 자동 적용됩니다.</li>
                <li>취소 및 환불 정책: 지원금을 적용하여 구매한 주문을 취소할 경우, 회사 지원금은 즉시 환수 처리되며 해당 월의 지원금 사용 한도는 실시간으로 자동 복원됩니다.</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
