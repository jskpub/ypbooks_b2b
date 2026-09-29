import { useEffect, useState } from 'react';
import { Icon } from '@/components/Icon';

// 헤더 축약 임계값(120px)보다 크게 설정, 스크롤 시작 직후 노출 시 sticky 헤더와 겹치는 현상 방지
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

  // visibility:hidden(_go-to-top.scss)이 비표시 시 포커스/스크린리더 접근을 이미 차단, aria-hidden/tabIndex 별도 처리 불필요 (CategoryMenu.tsx와 동일 패턴)
  return (
    <button type='button' className={`go-to-top${visible ? ' is-visible' : ''}`} aria-label='맨 위로 이동' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <Icon name='arrow-up' />
    </button>
  );
}
