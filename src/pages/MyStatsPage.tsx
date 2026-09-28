import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getReadingStatusList, type ReadingStatusItem } from '@/data/readingStatusStore';
import type { Review } from '@/data/reviews';
import { getMyReviews } from '@/data/reviewStore';
import { fetchBookDetail, type AladinItem } from '@/services/aladinApi';
import { getSessionUser } from '@/data/auth';

type ReadingStatusDone = ReadingStatusItem & { completedAt: string };

interface MonthlyPoint {
  month: number;
  label: string;
  purchased: number;
  read: number;
}

interface ActivityRow {
  key: string;
  date: string;
  type: '구매' | '완독' | '서평';
  title: string;
}

function monthKey(year: string, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

// 1월부터 이번 달까지 두 계열(구매/완독)을 나란히 집계한다. 미래 달은 아직 알 수 없는 값이라 뺀다.
function buildMonthlySeries(items: ReadingStatusItem[], doneItems: ReadingStatusDone[], year: string, uptoMonth: number): MonthlyPoint[] {
  return Array.from({ length: uptoMonth }, (_, index) => {
    const month = index + 1;
    const key = monthKey(year, month);
    return {
      month,
      label: `${month}월`,
      purchased: items.filter((item) => item.purchasedAt.startsWith(key)).length,
      read: doneItems.filter((item) => item.completedAt.startsWith(key)).length,
    };
  });
}

// 누적 ÷ "활동한 달 수"로 계산하면 한 달만 몰아서 사도 월평균이 부풀려진다(예: 9월에만 4권 사면
// 월평균 4권으로 나옴). 첫 구매월부터 이번 달까지 경과한 달력 개월 수로 나눠야 실제 페이스를 보여준다.
function monthsElapsedSince(startKey: string, currentYear: string, currentMonthNum: number): number {
  const [startYear, startMonth] = startKey.split('-').map(Number);
  const currentMonthIndex = Number(currentYear) * 12 + currentMonthNum;
  const startMonthIndex = startYear * 12 + startMonth;
  return Math.max(1, currentMonthIndex - startMonthIndex + 1);
}

// 개발 검토사항 문서(B2B 기업 독서 프로그램 운영 관련 개발 검토사항_20260911.docx) 8절의
// "나의 독서" 트리에서 "독서통계"가 구매한 책/읽는 중/읽은 책/서평 작성과 나란한 형제 항목으로
// 정의돼 있어, 그 항목을 이 페이지로 분리했다. 표 대신 벤토 그리드(스냅샷 타일 + 차트 카드 +
// 요약 카드 + 통합 활동 리스트)로 구성 — 참고한 통계 대시보드들의 레이아웃 패턴을 그대로 쓰되,
// 데이터가 풍부하지 않은 이 서비스 특성상 게이지·퍼센트 카드는 넣지 않았다.
export default function MyStatsPage() {
  const user = getSessionUser();
  const [items] = useState<ReadingStatusItem[]>(() => getReadingStatusList());
  const [reviews] = useState<Review[]>(() => getMyReviews());
  const [books, setBooks] = useState<Record<string, AladinItem | null>>({});

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

  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);
  const currentYear = now.toISOString().slice(0, 4);
  const currentMonthNum = now.getMonth() + 1;

  const purchasedThisMonth = items.filter((item) => item.purchasedAt.startsWith(currentMonth));
  const doneItems = items.filter((item): item is ReadingStatusDone => item.status === 'done' && Boolean(item.completedAt));
  const readThisMonth = doneItems.filter((item) => item.completedAt.startsWith(currentMonth));
  const reviewsThisMonth = reviews.filter((review) => review.createdAt.startsWith(currentMonth));

  const earliestPurchaseKey = items.reduce<string | null>((earliest, item) => {
    const key = item.purchasedAt.slice(0, 7);
    return earliest === null || key < earliest ? key : earliest;
  }, null);
  const monthlyAvgPurchase = earliestPurchaseKey
    ? Math.round((items.length / monthsElapsedSince(earliestPurchaseKey, currentYear, currentMonthNum)) * 10) / 10
    : 0;

  const monthlySeries = buildMonthlySeries(items, doneItems, currentYear, currentMonthNum);

  const activity: ActivityRow[] = [
    ...purchasedThisMonth.map((item) => ({ key: `purchase-${item.isbn13}`, date: item.purchasedAt, type: '구매' as const, title: books[item.isbn13]?.title ?? '불러오는 중…' })),
    ...readThisMonth.map((item) => ({ key: `read-${item.isbn13}`, date: item.completedAt, type: '완독' as const, title: books[item.isbn13]?.title ?? '불러오는 중…' })),
    ...reviewsThisMonth.map((review) => ({ key: `review-${review.id}`, date: review.createdAt, type: '서평' as const, title: review.bookTitle })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const chartMax = Math.max(1, ...monthlySeries.flatMap((point) => [point.purchased, point.read]));
  const barHeight = (value: number) => (value === 0 ? 2 : Math.max(8, Math.round((value / chartMax) * 96)));

  return (
    <main id='main' className='main my-page-layout'>
      <div className='container my-page-layout__inner'>
        <aside className='my-page-sidebar'>
          <div className='my-page-sidebar__user'>
            <p className='text-h3'>{user?.name ?? '김민서'} 님</p>
            <p className='caption'>한결그룹</p>
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
                <li><Link to="/myreading">나의 독서현황</Link></li>
                <li><Link to="/myreview">나의 서평</Link></li>
                <li className='is-active'><Link to="/mystats">독서 통계</Link></li>
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
            <h1 className='text-h1'>독서 통계</h1>
          </div>

          <div className='my-stats'>

        <div className='my-stats__bento'>
          <div className='my-stats__hero'>
            <p className='caption'>이번 달 구매</p>
            <p className='my-stats__hero-value'>
              {purchasedThisMonth.length}
              <span className='my-stats__hero-unit'>권</span>
            </p>
          </div>
          <div className='my-stats__hero'>
            <p className='caption'>이번 달 서평</p>
            <p className='my-stats__hero-value'>
              {reviewsThisMonth.length}
              <span className='my-stats__hero-unit'>건</span>
            </p>
          </div>
          <div className='my-stats__hero'>
            <p className='caption'>이번 달 독서</p>
            <p className='my-stats__hero-value'>
              {readThisMonth.length}
              <span className='my-stats__hero-unit'>권</span>
            </p>
          </div>

          <div className='my-stats__card my-stats__card--chart'>
            <div className='my-stats__card-head'>
              <p className='label-lg'>월별 구매·완독 현황 ({currentYear}년)</p>
              <div className='my-stats__legend'>
                <span className='my-stats__legend-item'>
                  <span className='my-stats__legend-dot is-purchase' />
                  구매
                </span>
                <span className='my-stats__legend-item'>
                  <span className='my-stats__legend-dot is-read' />
                  완독
                </span>
              </div>
            </div>
            <div className='my-stats__chart-plot'>
              {monthlySeries.map((point) => (
                <div key={point.month} className='my-stats__chart-col'>
                  <div className='my-stats__chart-track'>
                    <div className='my-stats__chart-bars'>
                      <div className='my-stats__chart-bar is-purchase' style={{ height: `${barHeight(point.purchased)}px` }} title={`${point.label} 구매 ${point.purchased}권`} />
                      <div className='my-stats__chart-bar is-read' style={{ height: `${barHeight(point.read)}px` }} title={`${point.label} 완독 ${point.read}권`} />
                    </div>
                  </div>
                  <span className='my-stats__chart-axis-label'>{point.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='my-stats__card my-stats__card--summary'>
            <p className='label-lg'>누적 요약</p>
            <ul className='my-stats__summary-list'>
              <li>
                <span>구매</span>
                <span>{items.length}권</span>
              </li>
              <li>
                <span>서평</span>
                <span>{reviews.length}건</span>
              </li>
              <li>
                <span>독서</span>
                <span>{doneItems.length}권</span>
              </li>
              <li>
                <span>월평균 구매</span>
                <span>{monthlyAvgPurchase}권</span>
              </li>
            </ul>
          </div>

          <div className='my-stats__card my-stats__card--activity'>
            <p className='label-lg'>이번 달 활동</p>
            {activity.length === 0 ? (
              <p className='caption my-stats__empty'>이번 달 활동이 없습니다.</p>
            ) : (
              <ul className='my-stats__list'>
                {activity.map((row) => {
                  const content = (
                    <>
                      <span className='my-stats__activity-type caption'>{row.type}</span>
                      <span className='my-stats__activity-title'>{row.title}</span>
                      <span className='caption'>{row.date}</span>
                    </>
                  );
                  // 구매 내역은 주문/배송 현황 페이지로 연결.
                  if (row.type === '구매') {
                    return (
                      <li key={row.key}>
                        <Link to='/orders' className='my-stats__list-item is-link'>
                          {content}
                        </Link>
                      </li>
                    );
                  }
                  if (row.type === '완독') {
                    return (
                      <li key={row.key}>
                        <Link to='/myreading' className='my-stats__list-item is-link'>
                          {content}
                        </Link>
                      </li>
                    );
                  }
                  if (row.type === '서평') {
                    return (
                      <li key={row.key}>
                        <Link to='/myreview' className='my-stats__list-item is-link'>
                          {content}
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <li key={row.key} className='my-stats__list-item'>
                      {content}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
          </div>
        </div>
      </div>
    </main>
  );
}
