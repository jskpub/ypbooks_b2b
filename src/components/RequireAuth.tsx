import { Navigate, Outlet } from 'react-router-dom';
import { getSessionUser } from '@/data/auth';

// 로그인하지 않은 채 주소를 직접 입력해 들어오면 사번 로그인 화면으로 돌려보낸다.
export default function RequireAuth() {
  if (!getSessionUser()) return <Navigate to='/login' replace />;
  return <Outlet />;
}
