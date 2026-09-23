import type { Ref } from 'react';

export type CategoryTab = 'domestic' | 'foreign';

interface CategoryMenuProps {
  isOpen: boolean;
  activeTab: CategoryTab;
  onTabChange: (tab: CategoryTab) => void;
  onClose: () => void;
  menuRef: Ref<HTMLDivElement>;
}

const domesticColumns = [
  ['소설/에세이/시', '유아/어린이/초등학습', '인문/역사', '예술', '종교', '경제/자기계발', '정치/사회', '수험서/자격증', '사전'],
  ['자녀교육/건강/여행/요리', '중/고학습', '외국어', '컴퓨터/IT', '기술/공학', '자연/과학', '의학', '잡지'],
];

const foreignItems = ['외서 일반서적', '외서 컴퓨터', '외서 전문서적'];

export default function CategoryMenu({ isOpen, activeTab, onTabChange, onClose, menuRef }: CategoryMenuProps) {
  return (
    <div className={`category-menu${isOpen ? ' is-open' : ''}`} id="category-menu" ref={menuRef}>
      <div className="category-menu__backdrop" onClick={onClose} />
      <div className="category-menu__panel" role="region" aria-label="전체 카테고리">
        <div className="category-menu__panel-inner container">
          <ul className="category-menu__lnb">
            <li>
              <button
                type="button"
                className={`category-menu__lnb-item${activeTab === 'domestic' ? ' is-active' : ''}`}
                onMouseEnter={() => onTabChange('domestic')}
                onFocus={() => onTabChange('domestic')}
              >
                국내도서
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`category-menu__lnb-item${activeTab === 'foreign' ? ' is-active' : ''}`}
                onMouseEnter={() => onTabChange('foreign')}
                onFocus={() => onTabChange('foreign')}
              >
                외국도서
              </button>
            </li>
          </ul>
          <div className="category-menu__content">
            <div className="category-menu__panel-group" hidden={activeTab !== 'domestic'}>
              {domesticColumns.map((column) => (
                <ul className="category-menu__sub-list" key={column[0]}>
                  {column.map((label) => (
                    <li key={label}>
                      <a href="javascript:;">{label}</a>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
            <div className="category-menu__panel-group" hidden={activeTab !== 'foreign'}>
              <ul className="category-menu__sub-list">
                {foreignItems.map((label) => (
                  <li key={label}>
                    <a href="javascript:;">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
