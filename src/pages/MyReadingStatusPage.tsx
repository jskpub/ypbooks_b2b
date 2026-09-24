import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '@/components/EmptyState';
import { getReadingStatusList, markCompleted, type ReadingStatusItem } from '@/data/readingStatusStore';
import { getMyReviews } from '@/data/reviewStore';
import { fetchBookDetail, type AladinItem } from '@/services/aladinApi';

type Tab = 'all' | 'reading' | 'done';

const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'reading', label: '읽고 있는 중' },
  { key: 'done', label: '읽은 책' },
];

interface Row extends ReadingStatusItem {
  book: AladinItem | null;
}

// REVIEW-02. 계정 드롭다운(마이페이지) UI가 아직 없어서 /myreading으로 직접 진입한다 —
// REVIEW_SPEC.md "진입 경로 결정" 참고. 완독/서평 데이터는 DB 없이 localStorage로만 관리한다.
export default function MyReadingStatusPage() {
  const [tab, setTab] = useState<Tab>('all');
  const [items, setItems] = useState<ReadingStatusItem[]>(() => getReadingStatusList());
  const [books, setBooks] = useState<Record<string, AladinItem | null>>({});
  const myReviewedIsbns = useMemo(() => new Set(getMyReviews().map((review) => review.isbn13)), [items]);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      items.map(async (item) => {
        try {
          return [item.isbn13, await fetchBookDetail(item.isbn13)] as const;
        } catch {
          return [item.isbn13, null] as const;
        }
      }),
    ).then((entries) => {
      if (cancelled) return;
      setBooks(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, [items]);

  const rows: Row[] = items
    .filter((item) => tab === 'all' || item.status === tab)
    .map((item) => ({ ...item, book: books[item.isbn13] ?? null }));

  const completedThisMonth = items.filter((item) => item.status === 'done' && item.completedAt?.startsWith('2026-09')).length;
  const totalCompleted = items.filter((item) => item.status === 'done').length;

  const handleComplete = (isbn13: string) => {
    markCompleted(isbn13);
    setItems(getReadingStatusList());
  };

  return (
    <main id='main' className='main'>
      <div className='container reading-status'>
        <h1 className='text-h1'>나의 독서현황</h1>

        <div className='reading-status__summary'>
          <div className='reading-status__stat'>
            <p className='caption'>이번 달 읽은 권수</p>
            <p className='price-lg'>{completedThisMonth}권</p>
          </div>
          <div className='reading-status__stat'>
            <p className='caption'>누적 완독</p>
            <p className='price-lg'>{totalCompleted}권</p>
          </div>
          <div className='reading-status__stat'>
            <p className='caption'>작성 서평 수</p>
            <p className='price-lg'>{myReviewedIsbns.size}건</p>
          </div>
        </div>

        <div className='reading-status__tabs' role='tablist'>
          {TABS.map((t) => (
            <button key={t.key} type='button' role='tab' aria-selected={tab === t.key} className={`tab-item${tab === t.key ? ' is-active' : ''}`} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {rows.length === 0 ? (
          <EmptyState icon='books' title='아직 구매한 도서가 없습니다' description='추천도서나 개인도서를 구매하면 이곳에서 독서현황을 관리할 수 있어요.' />
        ) : (
          <ul className='reading-status__list'>
            {rows.map((row) => (
              <li key={row.isbn13} className='reading-status__item'>
                <div className='reading-status__cover'>{row.book?.cover ? <img src={row.book.cover} alt='' /> : null}</div>
                <div className='reading-status__info'>
                  <p className='text-h4'>{row.book?.title ?? '불러오는 중…'}</p>
                  <p className='text-body-sm reading-status__author'>{row.book?.author}</p>
                  <p className='caption'>구매일 {row.purchasedAt}</p>
                </div>
                <span className={`reading-status__badge is-${row.status}`}>{row.status === 'done' ? '완독' : '읽고 있는 중'}</span>
                <div className='reading-status__action'>
                  {row.status === 'reading' && (
                    <button type='button' className='btn btn--secondary' onClick={() => handleComplete(row.isbn13)}>
                      완독 처리
                    </button>
                  )}
                  {row.status === 'done' && !myReviewedIsbns.has(row.isbn13) && (
                    <Link to={`/myreview/write/${row.isbn13}`} className='btn btn--secondary'>
                      서평 쓰기
                    </Link>
                  )}
                  {row.status === 'done' && myReviewedIsbns.has(row.isbn13) && (
                    <Link to='/myreview' className='btn btn--tertiary'>
                      서평 보기
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
