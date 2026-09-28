import { DOMESTIC_CATEGORIES } from '@/constants/categories';

interface CategorySidebarProps {
  activeCid?: number;
  onSelect?: (cid: number) => void;
}

// BOOK-03/04 좌측 카테고리 사이드바.
// onSelect가 없으면 시각적으로만 표시(비활성화).
export default function CategorySidebar({ activeCid = 0, onSelect }: CategorySidebarProps) {
  return (
    <nav className="category-sidebar" aria-label="카테고리">
      <p className="category-sidebar__title text-h4">카테고리</p>
      <ul className="category-sidebar__list">
        {DOMESTIC_CATEGORIES.map((cat) => (
          <li key={cat.cid}>
            <button
              type="button"
              className={`category-sidebar__item${activeCid === cat.cid ? ' is-active' : ''}`}
              onClick={() => onSelect?.(cat.cid)}
              disabled={!onSelect}
            >
              {cat.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

