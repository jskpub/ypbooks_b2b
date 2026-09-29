import { useRef, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthLogo from '@/components/AuthLogo';
import { Icon } from '@/components/Icon';
import Spinner from '@/components/Spinner';
import { DEMO_ACCOUNT, getSessionUser, signInWithEmployeeId } from '@/data/auth';
import ypLogo from '@/assets/images/yp_logo.png';

// 빈 칸/오타 구분 없이 동일 오류 문구 사용, 사번 존재 여부 노출 방지
export default function LoginPage() {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState(DEMO_ACCOUNT.employeeId);
  const [password, setPassword] = useState(DEMO_ACCOUNT.password);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const employeeIdRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const isSuccess = await signInWithEmployeeId(employeeId, password);
    setIsSubmitting(false);

    if (isSuccess) {
      navigate('/', { replace: true });
      return;
    }
    setHasError(true);
    (employeeId.trim() ? passwordRef : employeeIdRef).current?.focus();
  };

  // 로그인 상태로 /login 접근(직접 입력, 뒤로가기 등) 시 홈으로 리다이렉트
  if (getSessionUser()) return <Navigate to='/' replace />;

  const fieldClassName = `field${hasError ? ' is-error' : ''}`;

  return (
    <div className='auth-login'>
      <aside className='auth-login__brand'>
        <p className='auth-login__tagline'>
          회사가 준비한,
          <br />
          당신을 위한 독서
        </p>
      </aside>

      <main className='auth-login__main'>
        <div className='card auth-login__card'>
          <h1 className='auth-login__title'>
            <img src={ypLogo} alt='yp books' className='auth-login__title-logo' />
            B2B 임직원 로그인
          </h1>
          <p className='auth-login__desc'>사번과 비밀번호를 입력해 로그인하세요.</p>

          <form className='auth-login__form' onSubmit={handleSubmit} noValidate>
            <div className={fieldClassName}>
              <label htmlFor='employee-id' className='field__label'>
                사번
              </label>
              <input
                ref={employeeIdRef}
                id='employee-id'
                className='field__input'
                type='text'
                autoComplete='username'
                placeholder='사번을 입력해 주세요.'
                value={employeeId}
                onChange={(event) => {
                  setEmployeeId(event.target.value);
                  setHasError(false);
                }}
                aria-invalid={hasError}
                aria-describedby={hasError ? 'login-error' : undefined}
              />
            </div>

            <div className={fieldClassName}>
              <label htmlFor='password' className='field__label'>
                비밀번호
              </label>
              <div className='auth-login__password'>
                <input
                  ref={passwordRef}
                  id='password'
                  className='field__input'
                  type={isPasswordVisible ? 'text' : 'password'}
                  autoComplete='current-password'
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setHasError(false);
                  }}
                  aria-invalid={hasError}
                  aria-describedby={hasError ? 'login-error' : undefined}
                />
                <button type='button' className='auth-login__toggle' onClick={() => setIsPasswordVisible((visible) => !visible)} aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}>
                  <Icon name={isPasswordVisible ? 'eye-slash' : 'eye'} />
                </button>
              </div>
              {hasError && (
                <p id='login-error' className='field__help' role='alert'>
                  사번 또는 비밀번호가 맞지 않습니다.
                  <br />
                  다시 입력해 주세요.
                </p>
              )}
            </div>

            {/* 입력칸 사전 채움 상태, Enter 즉시 로그인되도록 버튼에 포커스 부여 */}
            <button type='submit' className='btn btn--primary btn--lg auth-login__submit' disabled={isSubmitting} autoFocus>
              {isSubmitting ? (
                <>
                  <Spinner size='sm' />
                  로그인 중
                </>
              ) : (
                '로그인'
              )}
            </button>
          </form>

          <p className='auth-login__help'>사번을 잊으셨나요? IT 관리자에게 문의하세요.</p>

          <p className='auth-login__meta'>© 영풍문고 · 임직원 전용 시스템</p>
        </div>
      </main>
      <Link to='/intranet' className='btn btn--tertiary btn--sm intranet-switch'>
        인트라넷으로 전환
      </Link>
    </div>
  );
}
