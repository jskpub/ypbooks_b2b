import { useEffect, useRef, useState } from 'react';
import BrandBar from './BrandBar';
import CategoryMenu, { type CategoryTab } from './CategoryMenu';
import Gnb from './Gnb';
import HeaderSticky from './HeaderSticky';
import UtilityBar from './UtilityBar';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CategoryTab>('domestic');
  const [isSticky, setIsSticky] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const gnbTriggerRef = useRef<HTMLButtonElement>(null);
  const stickyTriggerRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => setIsMenuOpen((open) => !open);
  const closeMenu = () => setIsMenuOpen(false);

  // header-sticky.js: 기본 헤더 높이를 넘어 스크롤하면 고정 헤더를 보여준다.
  useEffect(() => {
    const toggleSticky = () => {
      setIsSticky(window.scrollY > (headerRef.current?.offsetHeight ?? 0));
    };
    toggleSticky();
    window.addEventListener('scroll', toggleSticky, { passive: true });
    return () => window.removeEventListener('scroll', toggleSticky);
  }, []);

  // category-menu.js: Esc로 닫기, 메뉴/트리거 밖으로 포커스가 나가면 닫기.
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };
    const handleFocusin = (event: FocusEvent) => {
      const target = event.target as Node;
      const isInsideMenu = menuRef.current?.contains(target) ?? false;
      const isTrigger = target === gnbTriggerRef.current || target === stickyTriggerRef.current;
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
      <header className="header" ref={headerRef}>
        <UtilityBar />
        <BrandBar />
        <Gnb triggerRef={gnbTriggerRef} isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />
      </header>
      <HeaderSticky
        triggerRef={stickyTriggerRef}
        isSticky={isSticky}
        isMenuOpen={isMenuOpen}
        onToggleMenu={toggleMenu}
      />
      <CategoryMenu
        menuRef={menuRef}
        isOpen={isMenuOpen}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onClose={closeMenu}
      />
    </>
  );
}
