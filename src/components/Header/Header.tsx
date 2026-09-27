import { useEffect, useRef, useState } from 'react';
import BrandBar from './BrandBar';
import CategoryMenu, { type CategoryTab } from './CategoryMenu';
import Gnb from './Gnb';
import UtilityBar from './UtilityBar';

// 스크롤 임계값(px) — 내려갈 때/올라올 때를 다르게 둬서(hysteresis) 경계 근처에서
// .is-scrolled가 계속 토글되는 걸 막는다(test.html 참고). 간격을 94px 이상으로 넓게 둔 건
// 헤더 자신의 펼침↔축약 높이 차(약 94px)보다 커야 해서다 — 간격이 그보다 좁으면, 헤더가
// 줄어들 때 브라우저 스크롤 앵커링이 보정하는 스크롤량만으로도 반대쪽 임계값을 넘어버려서
// .is-scrolled가 켜졌다 꺼졌다를 무한 반복하는 버그가 있었다(_header.scss의
// overflow-anchor:none과 같이 짝을 이루는 방어책).
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

  // 헤더 전체가 하나의 sticky 엘리먼트로 남아있으면서 .is-scrolled 클래스만으로 축약형을
  // 표현한다(예전엔 header-sticky가 완전히 별도인 고정 헤더를 통째로 켜고 껐다 — 그래서
  // 전환이 애니메이션 없이 뚝 끊겨 보였다). rAF로 스크롤마다 리플로우 없이 처리한다.
  // 카테고리 메뉴가 열려있는 동안은 상태를 얼려둔다 — 패널 위치가 .is-scrolled 여부로
  // 정해지는데(category-menu.scss), 열려있는 채로 헤더가 커졌다 작아졌다 하면 패널이
  // 트리거를 놓치고 어긋나 보인다.
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

  // category-menu.js: Esc로 닫기, 메뉴/트리거 밖으로 포커스가 나가면 닫기.
  // 트리거는 두 개(Gnb의 전체카테고리 버튼 / BrandBar의 햄버거) — 스크롤 상태에 따라
  // 둘 중 하나만 보이지만(.is-scrolled로 opacity+visibility 토글), 어느 쪽으로 열었어도
  // 포커스 아웃 판정은 둘 다 검사한다.
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
