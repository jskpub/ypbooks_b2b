import { useEffect, useRef, useState } from 'react';
import BrandBar from './BrandBar';
import CategoryMenu, { type CategoryTab } from './CategoryMenu';
import Gnb from './Gnb';
import UtilityBar from './UtilityBar';

// 스크롤 다운/업 임계값 차등 적용(hysteresis)으로 경계 부근 .is-scrolled 무한 토글 방지
// 임계값 간격은 헤더 펼침↔축약 높이 차(약 94px)보다 커야 함 — 좁으면 스크롤 앵커링 보정값이 반대 임계값을 넘어 토글 반복됨 (_header.scss overflow-anchor:none과 짝)
const SCROLL_DOWN_THRESHOLD = 120;
const SCROLL_UP_THRESHOLD = 20;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CategoryTab>('domestic');
  const [isScrolled, setIsScrolled] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const gnbTriggerRef = useRef<HTMLButtonElement>(null);
  const brandTriggerRef = useRef<HTMLButtonElement>(null);
  const isMenuOpenRef = useRef(isMenuOpen);
  isMenuOpenRef.current = isMenuOpen;

  const toggleMenu = () => setIsMenuOpen((open) => !open);
  const closeMenu = () => setIsMenuOpen(false);

  // 카테고리 메뉴 열림 중 스크롤 상태 고정 — 패널 위치가 .is-scrolled에 의존해(category-menu.scss) 헤더 크기 변화 시 패널이 트리거를 벗어나는 현상 방지
  useEffect(() => {
    let ticking = false;
    let scrolled = false;

    const update = () => {
      ticking = false;
      if (isMenuOpenRef.current) return;

      const y = window.scrollY;
      if (!scrolled && y > SCROLL_DOWN_THRESHOLD) {
        scrolled = true;
        setIsScrolled(true);
      } else if (scrolled && y < SCROLL_UP_THRESHOLD) {
        scrolled = false;
        setIsScrolled(false);
      }
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

  // 트리거가 Gnb/BrandBar 두 곳(스크롤 상태에 따라 하나만 노출)이라 포커스 아웃 판정 시 둘 다 검사 필요
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };
    const handleFocusin = (event: FocusEvent) => {
      const target = event.target as Node;
      const isInsideMenu = menuRef.current?.contains(target) ?? false;
      const isTrigger = target === gnbTriggerRef.current || target === brandTriggerRef.current;
      if (!isInsideMenu && !isTrigger) closeMenu();
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('focusin', handleFocusin);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('focusin', handleFocusin);
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className={`header${isScrolled ? ' is-scrolled' : ''}`}>
        <UtilityBar />
        <BrandBar isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} triggerRef={brandTriggerRef} />
        <Gnb triggerRef={gnbTriggerRef} isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />
      </header>
      <CategoryMenu menuRef={menuRef} isOpen={isMenuOpen} activeTab={activeTab} onTabChange={setActiveTab} onClose={closeMenu} />
    </>
  );
}
