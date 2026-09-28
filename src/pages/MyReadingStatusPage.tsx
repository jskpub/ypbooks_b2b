import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '@/components/EmptyState';
import { Icon } from '@/components/Icon';
import { getReadingStatusList, markCompleted, markReading, markStarted, type ReadingStatus, type ReadingStatusItem } from '@/data/readingStatusStore';
import { getMyReviews } from '@/data/reviewStore';
import { fetchBookDetail, type AladinItem } from '@/services/aladinApi';
import { getSessionUser } from '@/data/auth';

type Tab = 'all' | ReadingStatus;

const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'unread', label: '읽을 책' },
  { key: 'reading', label: '읽고 있는 책' },
  { key: 'done', label: '읽은 책' },
];

const STATUS_LABEL: Record<ReadingStatus, string> = {
  unread: '읽을 책',
  reading: '읽고 있는 책',
  done: '읽은 책',
};

interface Row extends ReadingStatusItem {
  book: AladinItem | null;
}

function formatDot(isoDate: string): string {
  return isoDate.replaceAll('-', '.');
}

// REVIEW-02. 계정 드롭다운(마이페이지) UI가 아직 없어서 /myreading으로 직접 진입한다 —
// REVIEW_SPEC.md "진입 경로 결정" 참고. 완독/서평 데이터는 DB 없이 localStorage로만 관리한다.
// 통계(구매/서평/독서 권수)는 REVIEW-05(/mystats, 독서 통계)로 분리했다 — 이 페이지는 "지금 상태
// 관리"만 다루고, 과거 기간 집계는 다루지 않는다.
export default function MyReadingStatusPage() {
  const user = getSessionUser();
  const [tab, setTab] = useState<Tab>('all');
  const [items, setItems] = useState<ReadingStatusItem[]>(() => getReadingStatusList());
  const [books, setBooks] = useState<Record<string, AladinItem | null>>({});
  // 서평엔 개별 상세 페이지가 없어서, 카드의 "서평 보기"는 REVIEW-03(나의 서평) 목록의 해당
  // 카드로 앵커(#review-{id}) 이동시킨다 — MyReviewsPage가 그 해시를 보고 스크롤+하이라이트한다.
  const myReviewsByIsbn = useMemo(() => new Map(getMyReviews().map((review) => [review.isbn13, review])), [items]);

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

  const counts = {
    all: items.length,
    unread: items.filter((item) => item.status === 'unread').length,
    reading: items.filter((item) => item.status === 'reading').length,
    done: items.filter((item) => item.status === 'done').length,
  };

  const rows: Row[] = items
    .filter((item) => tab === 'all' || item.status === tab)
    .map((item) => ({ ...item, book: books[item.isbn13] ?? null }));

  const refresh = () => setItems(getReadingStatusList());

  const handleStart = (isbn13: string) => {
    markStarted(isbn13);
    refresh();
  };

  const handleComplete = (isbn13: string) => {
    markCompleted(isbn13);
    refresh();
  };

  const handleRevert = (isbn13: string) => {
    markReading(isbn13);
    refresh();
  };

  return (
    <main id='main' className='main my-page-layout'>
      <div className='container my-page-layout__inner'>
        <aside className='my-page-sidebar'>
          <div className='my-page-sidebar__user'>
            <p className='text-h3'>{user?.name ?? '홍길동'} 님</p>
            <p className='caption'>(주)한글과컴퓨터</p>
          </div>
          
          <nav className='my-page-nav'>
            <div className='my-page-nav__group'>
              <h4 className='my-page-nav__title'>쇼핑 & 주문 관리</h4>
              <ul>
                <li><Link to="/mypage">마이페이지 홈</Link></li>
                <li><Link to="/orders">주문 / 배송 조회</Link></li>
              </ul>
            </div>
            <div className='my-page-nav__group'>
              <h4 className='my-page-nav__title'>복지 혜택</h4>
              <ul>
                <li><Link to="/subsidy">나의 지원금 현황</Link></li>
              </ul>
            </div>
            <div className='my-page-nav__group'>
              <h4 className='my-page-nav__title'>독서 서재</h4>
              <ul>
                <li className='is-active'><Link to="/myreading">나의 독서현황</Link></li>
                <li><Link to="/myreview">나의 서평</Link></li>
                <li><Link to="/mystats">독서 통계</Link></li>
              </ul>
            </div>
            <div className='my-page-nav__group'>
              <h4 className='my-page-nav__title'>계정 & 설정</h4>
              <ul>
                <li><Link to="/profile">회원 정보 조회</Link></li>
              </ul>
            </div>
          </nav>
        </aside>

        <div className='my-page-content'>
          <div className='my-page-content__header'>
            <h1 className='text-h1'>나의 독서현황</h1>
          </div>

          <div className='reading-status'>

        <div className='reading-status__tabs' role='tablist'>
          {TABS.map((t) => (
            <button key={t.key} type='button' role='tab' aria-selected={tab === t.key} className={`tab-item${tab === t.key ? ' is-active' : ''}`} onClick={() => setTab(t.key)}>
              {t.label} ({counts[t.key]})
            </button>
          ))}
        </div>

        {rows.length === 0 ? (
          <EmptyState icon='books' title='아직 구매한 도서가 없습니다' description='추천도서나 개인도서를 구매하면 이곳에서 독서현황을 관리할 수 있어요.' />
        ) : (
          <ul className='reading-status__grid'>
            {rows.map((row) => {
              const review = myReviewsByIsbn.get(row.isbn13);
              return (
                <li key={row.isbn13} className='reading-status__card'>
                  <div className='reading-status__card-cover'>
                    {row.book?.cover ? <img src={row.book.cover} alt='' /> : <Icon name='books' />}
                    <span className={`reading-status__badge is-${row.status}`}>{STATUS_LABEL[row.status]}</span>
                  </div>
                  <div className='reading-status__card-info'>
                    <p className='text-h4 reading-status__card-title'>{row.book?.title ?? '불러오는 중…'}</p>
                    <p className='text-body-sm reading-status__author'>{row.book?.author}</p>
                    <p className='caption'>구매일 {row.purchasedAt}</p>
                    {/* 상태 전환(다시 읽기 등)으로 이 줄이 생겼다 없어졌다 하면 카드 높이가 바뀌면서
                        같은 행의 다른 카드 버튼 위치까지 같이 밀린다 — 항상 렌더링하고 해당 없을 땐
                        visibility만 숨겨서 높이를 고정한다. */}
                    <p className={`caption${row.status === 'done' && row.startedAt && row.completedAt ? '' : ' is-hidden'}`}>
                      독서 기간 {row.startedAt && row.completedAt ? `${formatDot(row.startedAt)} ~ ${formatDot(row.completedAt)}` : ' '}
                    </p>
                  </div>

                  <div className='reading-status__card-actions'>
                    {row.status === 'unread' && (
                      <button type='button' className='btn btn--secondary btn--sm' onClick={() => handleStart(row.isbn13)}>
                        읽기 시작
                      </button>
                    )}
                    {row.status === 'reading' && (
                      <button type='button' className='btn btn--secondary btn--sm' onClick={() => handleComplete(row.isbn13)}>
                        독서 완료
                      </button>
                    )}
                    {row.status === 'done' && (
                      <>
                        <button type='button' className='btn btn--secondary btn--sm' onClick={() => handleRevert(row.isbn13)}>
                          다시 읽기
                        </button>
                        {review ? (
                          <Link to={`/myreview#review-${review.id}`} className='btn btn--secondary btn--sm'>
                            서평 보기
                          </Link>
                        ) : (
                          <Link to={`/myreview/write/${row.isbn13}`} className='btn btn--primary btn--sm'>
                            서평 작성
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
          </div>
        </div>
      </div>
    </main>
  );
}
