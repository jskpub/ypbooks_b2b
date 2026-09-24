const STORAGE_KEY = 'ypbooks-b2b:reading-status';

export type ReadingStatus = 'reading' | 'done';

export interface ReadingStatusItem {
  isbn13: string;
  status: ReadingStatus;
  purchasedAt: string;
  completedAt?: string;
}

// 실제 구매/주문 이력 시스템이 아직 없어서(마이페이지 미구현) 김민서 계정 기준으로 시드 3건을 둔다.
// 상태 A(읽고 있는 중) 1건 + 상태 B(완독, 서평 미작성) 1건 + 상태 B(완독, 서평 작성됨) 1건 — REVIEW-02의
// 모든 분기(완독 처리 버튼 / 서평 쓰기 / 서평 보기)를 구경할 수 있게 구성했다.
const SEED_ITEMS: ReadingStatusItem[] = [
  { isbn13: '9791162540640', status: 'reading', purchasedAt: '2026-09-20' }, // 아주 작은 습관의 힘
  { isbn13: '9791187142560', status: 'done', purchasedAt: '2026-09-05', completedAt: '2026-09-12' }, // 데일 카네기 인간관계론(서평 미작성)
  { isbn13: '9791162540633', status: 'done', purchasedAt: '2026-09-01', completedAt: '2026-09-08' }, // 그릿 GRIT(서평 작성됨, reviews.ts 시드와 연동)
];

function readAll(): ReadingStatusItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReadingStatusItem[]) : SEED_ITEMS;
  } catch {
    return SEED_ITEMS;
  }
}

function writeAll(items: ReadingStatusItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // 저장 실패(프라이빗 모드 등)는 조용히 무시 — 프로토타입 범위 밖
  }
}

export function getReadingStatusList(): ReadingStatusItem[] {
  return readAll();
}

export function markCompleted(isbn13: string): void {
  const items = readAll();
  const idx = items.findIndex((item) => item.isbn13 === isbn13);
  if (idx < 0) return;
  items[idx] = { ...items[idx], status: 'done', completedAt: new Date().toISOString().slice(0, 10) };
  writeAll(items);
}
