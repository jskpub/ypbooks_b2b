import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// SPA 라우팅은 브라우저 네이티브 이동과 달리 스크롤 위치를 그대로 들고 간다 — 예를 들어
// 장바구니 페이지 하단에서 "주문하기"를 눌러 결제 페이지로 이동하면, 결제 페이지도 같은
// 스크롤 위치(하단)에서 시작해버린다. 경로가 바뀔 때마다 맨 위로 되돌린다.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
