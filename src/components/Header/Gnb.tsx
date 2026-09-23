import type { Ref } from 'react';
import { Icon } from '@/components/Icon';

interface GnbProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  triggerRef: Ref<HTMLButtonElement>;
}

export default function Gnb({ isMenuOpen, onToggleMenu, triggerRef }: GnbProps) {
  return (
    <nav className="gnb" aria-label="카테고리">
      <div className="gnb__inner container">
        <ul className="gnb__list">
          <li>
            <button
              type="button"
              ref={triggerRef}
              className="gnb__link gnb__link--category category-menu-trigger"
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
              aria-controls="category-menu"
              onClick={onToggleMenu}
            >
              <span className="gnb__icon gnb__icon--menu">
                <Icon name="list" />
              </span>
              <span className="gnb__icon gnb__icon--close">
                <Icon name="x" />
              </span>
              전체카테고리
            </button>
          </li>
          <li>
            <a href="javascript:;" className="gnb__link">
              추천도서
            </a>
          </li>
          <li>
            <a href="javascript:;" className="gnb__link">
              베스트
            </a>
          </li>
          <li>
            <a href="javascript:;" className="gnb__link">
              신상품
            </a>
          </li>
          <li>
            <a href="javascript:;" className="gnb__link">
              서평
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
