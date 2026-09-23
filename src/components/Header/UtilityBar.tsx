import { Link } from 'react-router-dom';

export default function UtilityBar() {
  return (
    <div className="utility-bar">
      <div className="utility-bar__inner container">
        <ul className="utility-bar__menu">
          <li>
            <a href="javascript:;" className="utility-bar__link">
              <strong className="utility-bar__name">김민서</strong>님
            </a>
          </li>
          <li>
            <Link to="/cart" className="utility-bar__link">
              장바구니
            </Link>
          </li>
          <li>
            <a href="javascript:;" className="utility-bar__link">
              주문
            </a>
          </li>
          <li>
            <a href="javascript:;" className="utility-bar__link">
              로그아웃
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
