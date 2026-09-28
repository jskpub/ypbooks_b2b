import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSessionUser } from '@/data/auth';
import { AladinItem, fetchBestsellerBooks } from '@/services/aladinApi';

export default function MySubsidyPage() {
  const user = getSessionUser();
  const [orders, setOrders] = useState<AladinItem[]>([]);

  useEffect(() => {
    fetchBestsellerBooks(2).then(setOrders);
  }, []);

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
                    <span className='badge badge--available'>사용 가능</span>
                    <strong className='text-blue'>월 1권 전액 지원</strong>
                  </div>
                  <h4 className='text-h3'>이달의 추천도서 지원금</h4>
                  <ul className='subsidy-rule-box__list'>
                    <li>지원 정책: 도서 정가 100% 회사 지원 (직원부담 0원)</li>
                    <li>대상 도서: 종이도서 한정 (영풍/기업 선정 10종)</li>
                    <li>당월 잔여: <strong className='text-blue'>1권 사용 가능</strong></li>
                  </ul>
                  <button className='btn btn--primary subsidy-rule-box__btn'>추천도서 바로가기 &gt;</button>
                </div>
                
                {/* 개인 자유도서 지원금 */}
                <div className='subsidy-rule-box'>
                  <div className='subsidy-rule-box__header'>
                    <span className='badge badge--disabled'>한도 소진</span>
                    <strong className='text-red'>월 1권 (최대 1만원)</strong>
                  </div>
                  <h4 className='text-h3'>개인 자유도서 지원금</h4>
                  <ul className='subsidy-rule-box__list'>
                    <li>지원 정책: 도서가의 50% 지원 (최대 10,000원 한도)</li>
                    <li>대상 도서: 종이도서 / 전자도서(eBook) 선택 가능</li>
                    <li>당월 잔여: <strong className='text-red'>0권 (9/12 사용 완료)</strong></li>
                  </ul>
                  <button className='btn btn--disabled subsidy-rule-box__btn' disabled>당월 한도 소진 (10/1 갱신)</button>
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
                  <select className='select-box'>
                    <option>2026년 전체</option>
                  </select>
                  <span className='filter-label'>구분:</span>
                  <select className='select-box'>
                    <option>전체 (추천/개인)</option>
                  </select>
                </div>
                <div className='filter-result'>
                  <span className='caption'>총 3건의 내역이 조회되었습니다.</span>
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
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center" style={{padding: '2rem'}}>로딩중...</td>
                    </tr>
                  ) : (
                    orders.map((book, idx) => (
                      <tr key={book.itemId}>
                        <td className='text-center'>2026.09.12</td>
                        <td className='text-center'><strong>{idx === 0 ? '개인도서' : '추천도서'}</strong></td>
                        <td className='text-left'>
                          <strong>{book.title}</strong>
                          <span className='caption block'>ORD-20260912-008{idx + 1}</span>
                        </td>
                        <td className='text-right'>{book.priceStandard.toLocaleString()}원</td>
                        <td className='text-right'>
                          <strong className='text-blue'>-{Math.floor(book.priceStandard / (idx === 0 ? 2 : 1)).toLocaleString()}원 ({idx === 0 ? '50%' : '100%'})</strong>
                        </td>
                        <td className='text-center'>
                          <strong className='text-green'>지원 적용 완료</strong>
                          <span className='caption block'>(당월 한도 1권 차감)</span>
                        </td>
                      </tr>
                    ))
                  )}
                  {/* 취소된 건도 하나 하드코딩해서 형태를 보여줌 */}
                  <tr>
                    <td className='text-center'>2026.07.18</td>
                    <td className='text-center'><strong>개인도서</strong></td>
                    <td className='text-left'>
                      <strong>초생산성 (주문취소 환수)</strong>
                      <span className='caption block'>ORD-20260718-0004</span>
                    </td>
                    <td className='text-right'>18,000원</td>
                    <td className='text-right'>
                      <strong className='text-red'>+9,000원 (환수)</strong>
                    </td>
                    <td className='text-center'>
                      <strong className='text-red'>한도 원복 완료</strong>
                      <span className='caption block'>(주문취소에 따른 복원)</span>
                    </td>
                  </tr>
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
