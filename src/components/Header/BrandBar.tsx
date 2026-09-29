import type { Ref } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { useCart } from '@/contexts/CartContext';
import { signOut } from '@/data/auth';

interface BrandBarProps {
  isMenuOpen?: boolean;
  onToggleMenu?: () => void;
  triggerRef?: Ref<HTMLButtonElement>;
}

export default function BrandBar({ isMenuOpen, onToggleMenu, triggerRef }: BrandBarProps = {}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { items, subsidyLedger } = useCart();
  const totalCartCount = items.reduce((sum, item) => sum + item.qty, 0);

  const recRemaining = subsidyLedger.recommendedUsed ? 0 : 1;
  const perRemaining = subsidyLedger.personalUsed ? 0 : 1;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

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

        <Link to='/' className='brand-bar__logo'>
          <img className='brand-bar__logo-img' src='https://cdn.ypbooks.co.kr/image/logo/202512/d4bd4b8c-948f-4703-9cd2-0be0cccadf27.png' alt='영풍문고' />
          <span className='logo__badge'>비즈몰</span>
        </Link>

        <form className='brand-bar__search' role='search' onSubmit={handleSubmit}>
          <label htmlFor='site-search' className='sr-only'>
            도서 검색
          </label>
          <input type='search' id='site-search' name='q' className='brand-bar__search-input' placeholder='도서명, 저자명, ISBN을 입력해주세요.' value={query} onChange={(event) => setQuery(event.target.value)} />
          <button type='submit' className='brand-bar__search-submit'>
            <span className='sr-only'>검색</span>
            <Icon name='magnifying-glass' />
          </button>
        </form>

        <Link to='/subsidy' aria-label='나의 지원금 현황' className='brand-bar__subsidy'>
          <span className='brand-bar__subsidy-icon'>
            <Icon name='wallet' />
          </span>
          <div className='brand-bar__icon-link'>
            <div className='brand-bar__subsidy-text'>
              <p className='brand-bar__subsidy-title'>2026.09 지원 도서 잔여 권수</p>
              <p className='brand-bar__subsidy-lines'>
                추천 도서 {recRemaining}권 · 개인 도서 {perRemaining}권
              </p>
            </div>
          </div>
        </Link>

        <ul className='brand-bar__icons'>
          <li>
            <Link to='/mypage' aria-label='마이페이지'>
              <Icon name='user' />
            </Link>
          </li>
          <li>
            <Link to='/cart' aria-label='장바구니' className='brand-bar__icon-link'>
              <Icon name='shopping-cart-simple' />
              {totalCartCount > 0 && <span className='brand-bar__cart-badge'>{totalCartCount}</span>}
            </Link>
          </li>
          <li>
            <Link to='/orders' aria-label='주문'>
              <Icon name='truck' />
            </Link>
          </li>
          <li>
            <Link to='/login' aria-label='로그아웃' onClick={signOut}>
              <Icon name='sign-out' />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
