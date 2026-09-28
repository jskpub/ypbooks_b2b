import { useEffect, useState } from 'react';
import { Icon } from '@/components/Icon';

// 헤더 축약 임계값(Header.tsx의 120px)과 별개로, 페이지를 꽤 내려간 시점에서만 뜨도록 더 큰
// 값을 쓴다 — 스크롤 시작하자마자 뜨면 다른 sticky 요소(헤더 등)와 겹쳐 어수선해 보인다.
const SHOW_THRESHOLD = 400;

export default function GoToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      setVisible(window.scrollY > SHOW_THRESHOLD);
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // visibility:hidden(_go-to-top.scss)이 안 보일 때 포커스/스크린리더 접근을 이미 막아주므로
  // (카테고리 메뉴 딤/패널과 같은 처리, CategoryMenu.tsx 참고) aria-hidden/tabIndex를 따로 두지 않는다.
  return (
    <button type='button' className={`go-to-top${visible ? ' is-visible' : ''}`} aria-label='맨 위로 이동' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <Icon name='arrow-up' />
    </button>
  );
}
