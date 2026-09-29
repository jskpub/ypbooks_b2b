import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// SPA 라우팅은 네이티브 이동과 달리 스크롤 위치가 유지됨, 경로 변경 시마다 맨 위로 강제 이동해 페이지 전환 시 이전 스크롤 위치 노출 방지
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
