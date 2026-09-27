import { Link } from 'react-router-dom';

// 시연용 가상 고객사("한결그룹") 인트라넷 홈. SSO 자동 로그인(AUTH-01)의 앞단으로,
// 메뉴의 "영풍문고 비즈몰" 버튼만 동작하고 나머지 메뉴·목록은 모양만 있다.
// 영풍문고 화면이 아니므로 YP Red를 쓰지 않고 무채색만 쓴다(비즈몰 배지만 예외 — 이동할 곳을 알린다).
const MENU_ITEMS = ['홈', '메일', '전자결재', '일정', '게시판', '인사·근태'];

const NOTICES = [
  { title: '임직원 독서복지 프로그램 오픈 안내', date: '2026.09.25' },
  { title: '4분기 사내 교육 신청 일정', date: '2026.09.22' },
  { title: '추석 연휴 전산 점검 안내', date: '2026.09.18' },
  { title: '2026년 하반기 건강검진 안내', date: '2026.09.10' },
];

const APPROVALS = [
  { title: '9월 법인카드 사용 내역', from: '박지훈' },
  { title: '10월 팀 워크숍 장소 대관', from: '이서연' },
];

export default function IntranetPage() {
  return (
    <div className='intranet'>
      <header className='intranet__topbar'>
        <p className='intranet__brand'>한결그룹 인트라넷</p>
        <p className='intranet__user'>
          <strong>김민서</strong> · 경영지원팀
        </p>
      </header>

      <div className='intranet__body'>
        <nav className='intranet__nav' aria-label='인트라넷 메뉴'>
          <ul className='intranet__menu'>
            {MENU_ITEMS.map((item, index) => (
              <li key={item}>
                <span className={`intranet__menu-item${index === 0 ? ' is-active' : ''}`} aria-current={index === 0 ? 'page' : undefined}>
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <p className='intranet__menu-group'>복리후생</p>
          {/* 비즈몰 Navbar(BrandBar)의 로고 + "비즈몰" 배지를 사이드바 폭에 맞게 줄여서 쓴다. */}
          <Link to='/sso' className='intranet__bizmall'>
            <img className='intranet__bizmall-logo' src='https://cdn.ypbooks.co.kr/image/logo/202512/d4bd4b8c-948f-4703-9cd2-0be0cccadf27.png' alt='영풍문고' />
            <span className='logo__badge'>비즈몰</span>
          </Link>
        </nav>

        <main className='intranet__main'>
          <h1 className='intranet__title'>홈</h1>

          <div className='intranet__grid'>
            <section className='card intranet__card'>
              <h2 className='intranet__card-title'>공지사항</h2>
              <ul className='intranet__list'>
                {NOTICES.map((notice) => (
                  <li key={notice.title} className='intranet__row'>
                    <span>{notice.title}</span>
                    <span className='intranet__meta'>{notice.date}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className='card intranet__card'>
              <h2 className='intranet__card-title'>결재 대기</h2>
              <ul className='intranet__list'>
                {APPROVALS.map((approval) => (
                  <li key={approval.title} className='intranet__row'>
                    <span>{approval.title}</span>
                    <span className='intranet__meta'>{approval.from}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* 로그인 화면 footer와 같은 스타일. 사이드바 아래로는 넘어가지 않도록 본문 영역 안에 둔다. */}
          <footer className='intranet__footer'>
            <span>© 한결그룹 · 임직원 전용 시스템</span>
            <Link to='/login' className='btn btn--tertiary btn--sm'>
              로그인으로 전환
            </Link>
          </footer>
        </main>
      </div>
    </div>
  );
}
