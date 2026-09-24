import { Icon } from '@/components/Icon';

export default function BrandBar() {
  return (
    <div className='brand-bar'>
      <div className='brand-bar__inner container'>
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
      </div>
    </div>
  );
}
