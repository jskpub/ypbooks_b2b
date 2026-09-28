import { Link } from 'react-router-dom';
import { getSessionUser } from '@/data/auth';

export default function MyProfilePage() {
  const user = getSessionUser();

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
                <li className='is-active'><Link to="/profile">회원 정보 조회</Link></li>
              </ul>
            </div>
          </nav>
        </aside>

        <div className='my-page-content'>
          <div className='my-page-content__header'>
            <h1 className='text-h1'>회원 정보 조회</h1>
          </div>

          <div className='my-profile'>
            
            {/* 임직원 소속 및 인사 연동 정보 */}
            <div className='card profile-card'>
              <div className='profile-card__header'>
                <h3 className='text-h3'>임직원 소속 및 인사 연동 정보</h3>
                <span className='caption text-red'>* 수정 불가 (사내 HR 시스템 동기화 전용)</span>
              </div>
              
              <table className='profile-table'>
                <tbody>
                  <tr>
                    <th>소속 기업명</th>
                    <td>한결그룹</td>
                  </tr>
                  <tr>
                    <th>사번 (Employee ID)</th>
                    <td>26020045</td>
                  </tr>
                  <tr>
                    <th>성명 / 직급</th>
                    <td>김민서 (대리)</td>
                  </tr>
                  <tr>
                    <th>소속 부서</th>
                    <td>사업본부 &gt; 경영지원팀</td>
                  </tr>
                  <tr>
                    <th>재직 상태</th>
                    <td>재직 중 (독서복지 지원 대상)</td>
                  </tr>
                  <tr>
                    <th>로그인 인증 방식</th>
                    <td>기업 SSO 인트라넷 무인가 자동 인증 (Keycloak IAM)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 복합결제 알림 수신 정보 */}
            <div className='card profile-card'>
              <div className='profile-card__header'>
                <h3 className='text-h3'>복합결제 알림 수신 정보</h3>
                <span className='caption text-gray'>* 알림톡 / 주문 이메일 발송용</span>
              </div>
              
              <table className='profile-table'>
                <tbody>
                  <tr>
                    <th>사내 이메일 주소</th>
                    <td>minseo.kim@hangyeol.com</td>
                  </tr>
                  <tr>
                    <th>휴대폰 번호</th>
                    <td>010-1234-5678</td>
                  </tr>
                </tbody>
              </table>
              <div className='profile-card__note'>
                <span className='caption'>* 주문 건별 실제 도서 배송 주소 및 수령인 정보는 주문서 작성 단계 또는 [배송지 관리] 메뉴에서 설정합니다.</span>
              </div>
            </div>

            {/* 회원 정보 수정 불가 정책 안내 */}
            <div className='policy-notice'>
              <h4 className='text-h4'>회원 정보 수정 불가 정책 안내</h4>
              <ul className='policy-notice__list caption'>
                <li>단방향 동기화 정책: 본 독서복지 플랫폼은 사내 인사 시스템(HR)의 재직/부서 데이터를 기반으로 자동 운영되므로, 임직원이 플랫폼 내에서 사번, 성명, 부서, 이메일 등의 정보를 직접 수정하거나 탈퇴할 수 없습니다.</li>
                <li>정보 정정 절차: 부서 이동, 직급 승진, 개명 등 개인정보의 변경이 필요한 경우, 사내 인사팀(HR)의 인사 정보가 먼저 업데이트되면 플랫폼에 익일 자동 반영됩니다.</li>
                <li>퇴직 시 처리: 인사 시스템상 퇴직 처리 시 본 플랫폼 접근 권한이 자동으로 소멸되며 잔여 지원금 한도는 자동 환수 처리됩니다.</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
