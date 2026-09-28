import { Link } from 'react-router-dom';
import { getSessionUser } from '@/data/auth';

export default function MyPageHome() {
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
                <li className='is-active'><Link to="/mypage">마이페이지 홈</Link></li>
                <li><Link to="/orders">주문 / 배송 조회</Link></li>
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

        {/* 메인 콘텐츠 영역 */}
        <div className='my-page-content'>
          <div className='my-page-content__header'>
            <h1 className='text-h1'>마이페이지 (My Page)</h1>
            <div className='my-page-content__actions'>
              <Link to='/cart' className='btn btn--secondary btn--sm'>장바구니 (2)</Link>
              <Link to='/' className='btn btn--primary btn--sm'>도서 둘러보기</Link>
            </div>
          </div>

          <div className='my-page-dashboard'>
            
            <div className='dashboard-row dashboard-row--2col'>
              {/* 회원 기본 정보 */}
              <div className='card dashboard-card'>
                <h3 className='text-h3 dashboard-card__title'>회원 기본 정보</h3>
                <table className='info-table'>
                  <tbody>
                    <tr>
                      <th>소속 기업</th>
                      <td>(주)한글과컴퓨터</td>
                    </tr>
                    <tr>
                      <th>사번 / 이름</th>
                      <td>{user?.employeeId ?? '20240108'} / {user?.name ?? '홍길동'}</td>
                    </tr>
                    <tr>
                      <th>소속 부서</th>
                      <td>플랫폼 개발팀</td>
                    </tr>
                    <tr>
                      <th>인증 상태</th>
                      <td>재직 중 (SSO 연동)</td>
                    </tr>
                  </tbody>
                </table>
                <p className='caption dashboard-card__note'>* 사원 정보는 인사(HR) 시스템 자동 연계 항목입니다.</p>
              </div>

              {/* 당월 지원금 현황 */}
              <div className='card dashboard-card'>
                <div className='dashboard-card__header'>
                  <h3 className='text-h3'>당월 지원금 현황 (2026년 9월)</h3>
                  <span className='caption'>매월 1일 갱신</span>
                </div>
                
                <div className='subsidy-grid'>
                  <div className='subsidy-box'>
                    <div className='subsidy-box__badge'>사용 가능</div>
                    <p className='label-lg'>이달의 추천도서</p>
                    <ul className='subsidy-box__list'>
                      <li>지원율: 회사 100% 지원</li>
                      <li>한도: 월 1권 (잔여 1권)</li>
                      <li className='caption'>* 종이책 전용 / 본인부담 0원</li>
                    </ul>
                  </div>
                  
                  <div className='subsidy-box'>
                    <div className='subsidy-box__badge is-disabled'>한도 소진</div>
                    <p className='label-lg'>개인 자유도서</p>
                    <ul className='subsidy-box__list'>
                      <li>지원율: 50% (최대 1만원)</li>
                      <li>한도: 월 1권 (잔여 0권 - 소진)</li>
                      <li className='caption'>* 종이책/전자책 가능</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 나의 독서 활동 요약 */}
            <div className='card dashboard-card'>
              <h3 className='text-h3 dashboard-card__title'>나의 독서 활동 요약 (My Library)</h3>
              <div className='library-stats'>
                <div className='library-stats__item'>
                  <span className='caption'>누적 지원 구매</span>
                  <strong className='text-h2'>8권</strong>
                </div>
                <div className='library-stats__item'>
                  <span className='caption'>현재 읽는 중</span>
                  <strong className='text-h2'>1권</strong>
                </div>
                <div className='library-stats__item'>
                  <span className='caption'>완독 도서</span>
                  <strong className='text-h2'>7권</strong>
                </div>
              </div>
            </div>

            {/* 최근 도서 주문 / 배송 내역 */}
            <div className='card dashboard-card'>
              <div className='dashboard-card__header'>
                <h3 className='text-h3'>최근 도서 주문 / 배송 내역</h3>
                <Link to="#" className="btn btn--secondary btn--sm">전체 주문내역 보기 &gt;</Link>
              </div>
              
              <table className='order-table'>
                <thead>
                  <tr>
                    <th>주문일자 / 번호</th>
                    <th>도서 주문 정보</th>
                    <th>정산 내역(지원금/본인)</th>
                    <th>배송 상태</th>
                    <th>관리 / 액션</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='order-table__date'>
                      <strong>2026.09.12</strong>
                      <span className='caption'>ORD-20260912-0081</span>
                    </td>
                    <td className='order-table__info'>
                      <div className='book-thumb'>표지</div>
                      <div className='book-details'>
                        <div className='book-details__title'>
                          <span className='badge badge--general'>개인도서</span>
                          <strong>트렌드 코리아 2027 (1권)</strong>
                        </div>
                        <span className='caption'>정가 19,000원 | 종이도서</span>
                      </div>
                    </td>
                    <td className='order-table__price'>
                      <span>회사지원: -9,500원</span>
                      <strong>본인부담: 9,500원</strong>
                      <span className='caption'>(신용카드 복합결제)</span>
                    </td>
                    <td className='order-table__status'>
                      <strong className='status-success'>배송완료</strong>
                      <span className='caption'>CJ대한통운</span>
                    </td>
                    <td className='order-table__actions'>
                      <button className='btn btn--secondary btn--sm'>배송조회</button>
                      <button className='btn btn--secondary btn--sm'>주문상세</button>
                    </td>
                  </tr>
                  <tr>
                    <td className='order-table__date'>
                      <strong>2026.08.05</strong>
                      <span className='caption'>ORD-20260805-0019</span>
                    </td>
                    <td className='order-table__info'>
                      <div className='book-thumb'>표지</div>
                      <div className='book-details'>
                        <div className='book-details__title'>
                          <span className='badge badge--recommend'>추천도서</span>
                          <strong>AI 에이전트 혁명 (1권)</strong>
                        </div>
                        <span className='caption'>정가 22,000원 | 종이도서</span>
                      </div>
                    </td>
                    <td className='order-table__price'>
                      <span>회사지원: -22,000원</span>
                      <strong>본인부담: 0원</strong>
                      <span className='caption'>(전액 회사지원)</span>
                    </td>
                    <td className='order-table__status'>
                      <strong className='status-success'>배송완료</strong>
                    </td>
                    <td className='order-table__actions'>
                      <button className='btn btn--secondary btn--sm'>배송조회</button>
                      <button className='btn btn--secondary btn--sm'>주문상세</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
