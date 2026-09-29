// BrandBar와 동일 로고 사용, 비즈몰 배지로 일반몰과 구분되는 B2B 채널 표시
export default function AuthLogo() {
  return (
    <div className='auth-logo'>
      <img className='auth-logo__img' src='https://cdn.ypbooks.co.kr/image/logo/202512/d4bd4b8c-948f-4703-9cd2-0be0cccadf27.png' alt='영풍문고' />
      <span className='logo__badge'>비즈몰</span>
    </div>
  );
}
