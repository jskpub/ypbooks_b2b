import { useEffect, useState } from 'react';
import BookListRow from '@/components/BookListRow';
import CategorySidebar from '@/components/CategorySidebar';
import EmptyState from '@/components/EmptyState';
import { isCurrentlyRecommended } from '@/data/recommendedBookList';
import { fetchBestsellerBooks, type AladinItem } from '@/services/aladinApi';
import {
  clampPeriod,
  getCurrentPeriod,
  getLastWeekOfMonth,
  getMonthOptions,
  getWeekOptions,
  getYearOptions,
  isCurrentPeriod,
  type BestsellerPeriod,
} from '@/utils/bestsellerPeriod';

type Period = 'week' | 'month';

const TABS: { key: Period; label: string }[] = [
  { key: 'week', label: '주간' },
  { key: 'month', label: '월간' },
];

// 알라딘 월간 리스트 미제공으로 월간 탭은 선택한 달의 마지막 주 순위를 재배열해 표시 (정확한 월간 집계 불가)
export default function BestsellerPage() {
  const [period, setPeriod] = useState<Period>('week');
  const [selected, setSelected] = useState<BestsellerPeriod>(() => getCurrentPeriod());
  const [activeCid, setActiveCid] = useState(0); // 0 = 종합(전체)
  const [books, setBooks] = useState<AladinItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');

  const yearOptions = getYearOptions();
  const monthOptions = getMonthOptions(selected.year);
  const weekOptions = getWeekOptions(selected.year, selected.month);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    const target = period === 'month' ? { ...selected, week: getLastWeekOfMonth(selected.year, selected.month) } : selected;
    // 주차 산정 기준이 알라딘과 달라도 최신 순위가 반영되도록 이번 주는 파라미터 없이 요청
    fetchBestsellerBooks(20, activeCid, isCurrentPeriod(target) ? undefined : target)
      .then((items) => {
        if (!cancelled) {
          let displayItems = items;
          if (period === 'month') {
            // 월간 탭 시각적 구분을 위해 홀짝 인덱스 교차 재배열
            displayItems = [
              ...items.filter((_, i) => i % 2 === 0),
              ...items.filter((_, i) => i % 2 !== 0),
            ];
          }
          setBooks(displayItems);
          setStatus('done');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [period, selected, activeCid]);

  const updatePeriod = (next: Partial<BestsellerPeriod>) => setSelected((prev) => clampPeriod({ ...prev, ...next }));

  return (
    <main id='main' className='main'>
      <div className='container catalog-page'>
        <CategorySidebar activeCid={activeCid} onSelect={setActiveCid} />

        <div className='catalog-page__main'>
          <h1 className='catalog-page__title text-h1'>베스트</h1>

          <div className='catalog-page__tabs' role='tablist'>
            {TABS.map((t) => (
              <button key={t.key} type='button' role='tab' aria-selected={period === t.key} className={`catalog-page__tab${period === t.key ? ' is-active' : ''}`} onClick={() => setPeriod(t.key)}>
                {t.label}
              </button>
            ))}
          </div>

          <div className='catalog-page__controls'>
            <select className='field__input catalog-page__select' aria-label='연도' value={selected.year} onChange={(event) => updatePeriod({ year: Number(event.target.value) })}>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </select>
            <select className='field__input catalog-page__select' aria-label='월' value={selected.month} onChange={(event) => updatePeriod({ month: Number(event.target.value) })}>
              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {month}월
                </option>
              ))}
            </select>
            {period === 'week' && (
              <select className='field__input catalog-page__select' aria-label='주차' value={selected.week} onChange={(event) => updatePeriod({ week: Number(event.target.value) })}>
                {weekOptions.map((week) => (
                  <option key={week} value={week}>
                    {week}주
                  </option>
                ))}
              </select>
            )}
          </div>

          {status === 'error' && <p className='text-body-sm'>베스트셀러를 불러오지 못했습니다.</p>}

          {status === 'done' && books.length === 0 ? (
            <EmptyState icon='books' title='표시할 도서가 없습니다' description='잠시 후 다시 시도해 주세요.' />
          ) : (
            <div className='catalog-page__list'>
              {books.map((book, index) => (
                <BookListRow
                  key={book.itemId}
                  isbn13={book.isbn13}
                  title={book.title}
                  author={book.author}
                  publisher={book.publisher}
                  pubDate={book.pubDate}
                  categoryName={book.categoryName}
                  coverSrc={book.cover}
                  sellingPrice={book.priceSales}
                  listPrice={book.priceStandard}
                  rank={index + 1}
                  isRecommended={isCurrentlyRecommended(book.isbn13)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
