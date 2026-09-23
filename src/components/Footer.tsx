export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__row footer__row--top">
          <div className="footer__brand">
            <a href="javascript:;" className="footer__logo">
              <img
                className="footer__logo-img"
                src="https://cdn.ypbooks.co.kr/image/logo/202512/d4bd4b8c-948f-4703-9cd2-0be0cccadf27.png"
                alt="영풍문고"
                width={96}
                height={40}
              />
            </a>
            <span className="footer__badge">비즈몰</span>
          </div>
          <ul className="footer__nav">
            <li>
              <a href="javascript:;" className="footer__nav-link">
                회사소개
              </a>
            </li>
            <li>
              <a href="javascript:;" className="footer__nav-link">
                이용약관
              </a>
            </li>
            <li>
              <a href="javascript:;" className="footer__nav-link footer__nav-link--strong">
                개인정보처리방침
              </a>
            </li>
            <li>
              <a href="javascript:;" className="footer__nav-link">
                B2B 법인 제휴 문의
              </a>
            </li>
            <li>
              <a href="javascript:;" className="footer__nav-link">
                고객센터 1544-9020
              </a>
            </li>
          </ul>
        </div>
        <div className="footer__row footer__row--bottom">
          <div className="footer__info">
            <p>(주)영풍문고 B2B 법인사업본부 | 서울특별시 종로구 청계천로 41 영풍빌딩 | 사업자등록번호: 101-81-37597</p>
            <p className="footer__disclaimer">본 화면은 기업 독서 프로그램 기획용 프로토타입으로, 실제 서비스와 다를 수 있습니다.</p>
          </div>
          <p className="footer__copyright">&copy; YOUNGPOONG BOOKSTORE CO., LTD. BIZ MALL.</p>
        </div>
      </div>
    </footer>
  );
}
