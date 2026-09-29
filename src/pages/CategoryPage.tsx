import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchBooksByCategory, type AladinItem } from '@/services/aladinApi';
import { DOMESTIC_CATEGORIES, FOREIGN_CATEGORIES, type CategoryItem } from '@/constants/categories';
import BookCard from '@/components/BookCard';

type BookTab = 'domestic' | 'foreign';

const CARDS_PER_ROW = 5;

// 동일 데이터를 3개 섹션으로 분리 표시, 데이터는 같지만 UI상 구분되어 보임
const SECTION_LABELS = ['주간 베스트셀러', '화제의 신간', '새로 나온 도서'];

function findCategoryByCid(cid: number): { cat: CategoryItem; tab: BookTab } {
  const foreign = FOREIGN_CATEGORIES.find((c) => c.cid === cid);
  if (foreign) return { cat: foreign, tab: 'foreign' };
  const domestic = DOMESTIC_CATEGORIES.find((c) => c.cid === cid) ?? DOMESTIC_CATEGORIES[0];
  return { cat: domestic, tab: 'domestic' };
}

// cid 쿼리 파라미터로 카테고리 지정, API 호출은 1회만 수행 후 CARDS_PER_ROW 단위로 섹션 분할
export default function CategoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramCid = Number(searchParams.get('cid') ?? '0');

  const initial = findCategoryByCid(paramCid);
  const [tab, setTab] = useState<BookTab>(initial.tab);
  const [activeCategory, setActiveCategory] = useState<CategoryItem>(initial.cat);
  const [books, setBooks] = useState<AladinItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');

  const categories = tab === 'domestic' ? DOMESTIC_CATEGORIES : FOREIGN_CATEGORIES;

  const load = useCallback((cat: CategoryItem) => {
    setStatus('loading');
    setBooks([]);
    fetchBooksByCategory(cat.cid, CARDS_PER_ROW * 3)
      .then((items) => {
        setBooks(items);
        setStatus('done');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => {
    const cid = Number(searchParams.get('cid') ?? '0');
    const { cat, tab: newTab } = findCategoryByCid(cid);
    setTab(newTab);
    setActiveCategory(cat);
    load(cat);
  }, [searchParams, load]);

  function handleCategoryClick(cat: CategoryItem) {
    setSearchParams({ cid: String(cat.cid) });
  }

  function handleTabChange(newTab: BookTab) {
    const defaultCat = newTab === 'domestic' ? DOMESTIC_CATEGORIES[0] : FOREIGN_CATEGORIES[0];
    setTab(newTab);
    setSearchParams({ cid: String(defaultCat.cid) });
  }

  const rows: AladinItem[][] = [];
  for (let i = 0; i < books.length; i += CARDS_PER_ROW) {
    rows.push(books.slice(i, i + CARDS_PER_ROW));
  }

  return (
    <main id="main" className="main">
      <div className="container category-page">
        <aside className="category-sidebar" aria-label="카테고리">
          <div className="category-sidebar__tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'domestic'}
              className={`category-sidebar__tab${tab === 'domestic' ? ' is-active' : ''}`}
              onClick={() => handleTabChange('domestic')}
            >
              국내도서
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'foreign'}
              className={`category-sidebar__tab${tab === 'foreign' ? ' is-active' : ''}`}
              onClick={() => handleTabChange('foreign')}
            >
              외국도서
            </button>
          </div>
          <ul className="category-sidebar__list">
            {categories.map((cat) => (
              <li key={cat.cid}>
                <button
                  type="button"
                  className={`category-sidebar__item${activeCategory.cid === cat.cid ? ' is-active' : ''}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="category-page__main">
          <h1 className="category-page__title text-h1">{activeCategory.label}</h1>

          {status === 'error' && (
            <p className="text-body-sm category-page__error">도서 목록을 불러오지 못했습니다.</p>
          )}

          {status === 'loading' && (
            <div className="category-page__loading">
              {Array.from({ length: CARDS_PER_ROW }).map((_, i) => (
                <div key={i} className="book-card-skeleton" />
              ))}
            </div>
          )}

          {status === 'done' && rows.length === 0 && (
            <p className="text-body-sm category-page__empty">해당 카테고리에 도서가 없습니다.</p>
          )}

          {status === 'done' &&
            rows.map((row, rowIdx) => (
              <section key={rowIdx} className="category-page__section">
                <h2 className="category-page__section-title text-h2">
                  {SECTION_LABELS[rowIdx] ?? `${rowIdx + 1}번째 목록`}
                </h2>
                <div className="category-page__row">
                  {row.map((book) => (
                    <BookCard
                      key={book.itemId}
                      variant="home_bookcard"
                      isbn13={book.isbn13}
                      title={book.title}
                      author={book.author}
                      coverSrc={book.cover}
                      sellingPrice={book.priceSales}
                      listPrice={book.priceStandard}
                    />
                  ))}
                </div>
              </section>
            ))}
        </div>
      </div>
    </main>
  );
}
