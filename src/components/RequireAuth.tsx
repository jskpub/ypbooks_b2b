import { Navigate, Outlet } from 'react-router-dom';
import { getSessionUser } from '@/data/auth';

// 미로그인 상태 직접 URL 접근 시 로그인 화면으로 리다이렉트
export default function RequireAuth() {
  if (!getSessionUser()) return <Navigate to='/login' replace />;
  return <Outlet />;
}
