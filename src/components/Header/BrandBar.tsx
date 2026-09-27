import type { Ref } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';

interface BrandBarProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  triggerRef: Ref<HTMLButtonElement>;
}

// 예전엔 이 햄버거+아이콘 목록이 별도 컴포넌트(header-sticky)에만 있었다 — 이제 헤더가
// 하나로 합쳐지면서 여기 같이 두고, 평소엔 .is-scrolled가 아닐 때 opacity+visibility로
// 숨겨둔다(SCSS). 항상 DOM에 있어야 fade in/out 트랜지션이 걸린다.
export default function BrandBar({ isMenuOpen, onToggleMenu, triggerRef }: BrandBarProps) {
  return (
    <div className='brand-bar'>
      <div className='brand-bar__inner container'>
        <button type='button' ref={triggerRef} className='brand-bar__hamburger category-menu-trigger' aria-haspopup='true' aria-expanded={isMenuOpen} aria-controls='category-menu' onClick={onToggleMenu}>
          <span className='sr-only'>전체 카테고리 열기</span>
          <span className='brand-bar__hamburger-icon brand-bar__hamburger-icon--menu'>
            <Icon name='list' />
          </span>
          <span className='brand-bar__hamburger-icon brand-bar__hamburger-icon--close'>
            <Icon name='x' />
          </span>
        </button>

        <a href='javascript:;' className='brand-bar__logo'>
          <img className='brand-bar__logo-img' src='https://cdn.ypbooks.co.kr/image/logo/202512/d4bd4b8c-948f-4703-9cd2-0be0cccadf27.png' alt='영풍문고' />
          <span className='logo__badge'>비즈몰</span>
        </a>

        <form className='brand-bar__search' role='search' action='/search'>
          <label htmlFor='site-search' className='sr-only'>
            도서 검색
          </label>
          <input type='search' id='site-search' name='q' className='brand-bar__search-input' placeholder='도서명, 저자명, 카드번호를 검색해 보세요' />
          <button type='submit' className='brand-bar__search-submit'>
            <span className='sr-only'>검색</span>
            <Icon name='magnifying-glass' />
          </button>
        </form>

        <div className='brand-bar__subsidy'>
          <span className='brand-bar__subsidy-icon'>
            <Icon name='wallet' />
          </span>
          <div className='brand-bar__subsidy-text'>
            <p className='brand-bar__subsidy-title'>2026.09 지원금 현황</p>
            <p className='brand-bar__subsidy-lines'>추천 도서 1권 · 개인 도서 1권</p>
          </div>
        </div>

        <ul className='brand-bar__icons'>
          <li>
            <a href='javascript:;' aria-label='마이페이지'>
              <Icon name='user' />
            </a>
          </li>
          <li>
            <Link to='/cart' aria-label='장바구니'>
              <Icon name='shopping-cart-simple' />
            </Link>
          </li>
          <li>
            <a href='javascript:;' aria-label='주문'>
              <Icon name='truck' />
            </a>
          </li>
          <li>
            <a href='javascript:;' aria-label='로그아웃'>
              <Icon name='sign-out' />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
