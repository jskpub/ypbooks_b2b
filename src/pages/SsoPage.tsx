import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthLogo from '@/components/AuthLogo';
import { Icon } from '@/components/Icon';
import Spinner from '@/components/Spinner';
import { signInWithSso } from '@/data/auth';

export default function SsoPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shouldFail = searchParams.get('result') === 'fail';
  const [isFailed, setIsFailed] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    signInWithSso(shouldFail).then((isSuccess) => {
      if (isCancelled) return;
      if (isSuccess) navigate('/', { replace: true });
      else setIsFailed(true);
    });
    return () => {
      isCancelled = true;
    };
  }, [navigate, shouldFail]);

  return (
    <div className='auth-sso'>
      <header className='auth-sso__header'>
        <AuthLogo />
        <span className='auth-sso__service'>독서복지 플랫폼</span>
      </header>
      <main className='auth-sso__body' aria-live='polite'>
        {isFailed ? (
          <>
            <div className='alert auth-sso__alert' role='alert'>
              <Icon name='x-circle' className='icon alert__icon' />
              <div className='alert__body'>
                <p className='alert__title'>인트라넷 로그인 상태를 확인할 수 없습니다</p>
              </div>
            </div>
            <button type='button' className='btn btn--primary btn--lg' onClick={() => navigate('/login')}>
              사번으로 로그인
            </button>
          </>
        ) : (
          <>
            <Spinner size='lg' />
            <h1 className='auth-sso__title'>인트라넷 계정을 확인하고 있습니다</h1>
            <p className='auth-sso__desc'>잠시만 기다려주세요</p>
            <p className='auth-sso__note'>확인이 완료되면 자동으로 홈 화면으로 이동합니다</p>
          </>
        )}
      </main>
    </div>
  );
}
