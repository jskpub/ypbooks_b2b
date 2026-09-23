import type { Ref } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';

interface HeaderStickyProps {
  isSticky: boolean;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  triggerRef: Ref<HTMLButtonElement>;
}

export default function HeaderSticky({ isSticky, isMenuOpen, onToggleMenu, triggerRef }: HeaderStickyProps) {
  return (
    <div className={`header-sticky${isSticky ? ' is-visible' : ''}`} id="header-sticky">
      <div className="header-sticky__inner container">
        <div className="header-sticky__box">
          <button
            type="button"
            ref={triggerRef}
            className="header-sticky__hamburger category-menu-trigger"
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
            aria-controls="category-menu"
            onClick={onToggleMenu}
          >
            <span className="sr-only">전체 카테고리 열기</span>
            <span className="header-sticky__hamburger-icon header-sticky__hamburger-icon--menu">
              <Icon name="list" />
            </span>
            <span className="header-sticky__hamburger-icon header-sticky__hamburger-icon--close">
              <Icon name="x" />
            </span>
          </button>
          <a href="javascript:;" className="brand-bar__logo">
            <img
              className="brand-bar__logo-img"
              src="https://cdn.ypbooks.co.kr/image/logo/202512/d4bd4b8c-948f-4703-9cd2-0be0cccadf27.png"
              alt="영풍문고"
            />
            <span className="footer__badge">비즈몰</span>
          </a>
        </div>
        <form className="header-sticky__search" role="search" action="/search">
          <label htmlFor="header-sticky-search" className="sr-only">
            도서 검색
          </label>
          <input
            type="search"
            id="header-sticky-search"
            name="q"
            className="header-sticky__search-input"
            placeholder="도서명, 저자명, 카드번호를 검색해 보세요"
          />
          <button type="submit" className="header-sticky__search-submit">
            <span className="sr-only">검색</span>
            <Icon name="magnifying-glass" />
          </button>
        </form>
        <ul className="header-sticky__icons">
          <li>
            <a href="javascript:;" aria-label="마이페이지">
              <Icon name="user" />
            </a>
          </li>
          <li>
            <Link to="/cart" aria-label="장바구니">
              <Icon name="shopping-cart-simple" />
            </Link>
          </li>
          <li>
            <a href="javascript:;" aria-label="주문">
              <Icon name="truck" />
            </a>
          </li>
          <li>
            <a href="javascript:;" aria-label="로그아웃">
              <Icon name="sign-out" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
