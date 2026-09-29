const STORAGE_KEY = 'ypbooks-b2b:reading-status';

// 'unread'(구매한 책, 아직 안 읽음) -> 'reading'(읽는 중) -> 'done'(읽은 책). 위시리스트처럼 사용자가
// 직접 목록에 추가하는 흐름은 없다 — 구매 즉시 'unread'로 시작하고, 이후 상태는 버튼으로만 바뀐다.
export type ReadingStatus = 'unread' | 'reading' | 'done';

export interface ReadingStatusItem {
  isbn13: string;
  status: ReadingStatus;
  purchasedAt: string;
  /** "읽기 시작" 버튼을 누른 날짜. 카드의 "독서 기간" 표기에 쓰인다. */
  startedAt?: string;
  completedAt?: string;
}

// 실제 구매/주문 이력 시스템이 아직 없어서(마이페이지 미구현) 김민서 계정 기준으로 시드 4건을 둔다.
// 구매한 책(unread) 1건 + 읽는 중 1건 + 완독·서평 미작성 1건 + 완독·서평 작성됨 1건 — REVIEW-02의
// 모든 분기(읽기 시작/독서 완료/서평 쓰기/서평 보기)를 구경할 수 있게 구성했다.
const SEED_ITEMS: ReadingStatusItem[] = [
  { isbn13: '9791187444725', status: 'unread', purchasedAt: '2026-05-15' }, // 5월 구매, 아직 안 읽음
  { isbn13: '9791162540640', status: 'reading', purchasedAt: '2026-07-10', startedAt: '2026-07-12' }, // 7월 구매, 읽는 중
  { isbn13: '9791187142560', status: 'done', purchasedAt: '2026-07-25', startedAt: '2026-07-26', completedAt: '2026-07-30' }, // 7월 구매, 7월 완독 (서평 미작성)
  { isbn13: '9791162540633', status: 'done', purchasedAt: '2026-08-01', startedAt: '2026-08-02', completedAt: '2026-08-10' }, // 8월 구매, 8월 완독 (서평 작성됨)
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

function updateStatus(isbn13: string, patch: Partial<ReadingStatusItem>): void {
  const items = readAll();
  const idx = items.findIndex((item) => item.isbn13 === isbn13);
  if (idx < 0) return;
  items[idx] = { ...items[idx], ...patch };
  writeAll(items);
}

// 결제 완료(CartContext.placeOrder) 시 호출 — 새로 산 도서를 오늘 날짜의 unread 항목으로 추가한다.
// 이미 독서현황에 있는 isbn(재구매 등)은 상태를 덮어쓰지 않고 건너뛴다.
export function addPurchasedItems(isbn13List: string[]): void {
  const items = readAll();
  const existing = new Set(items.map((item) => item.isbn13));
  const purchasedAt = new Date().toISOString().slice(0, 10);
  const newItems: ReadingStatusItem[] = [...new Set(isbn13List)].filter((isbn13) => !existing.has(isbn13)).map((isbn13) => ({ isbn13, status: 'unread', purchasedAt }));
  if (newItems.length === 0) return;
  writeAll([...items, ...newItems]);
}

// "읽기 시작" — 구매한 책(unread)을 읽는 중으로 전환한다.
export function markStarted(isbn13: string): void {
  updateStatus(isbn13, { status: 'reading', startedAt: new Date().toISOString().slice(0, 10) });
}

export function markCompleted(isbn13: string): void {
  updateStatus(isbn13, { status: 'done', completedAt: new Date().toISOString().slice(0, 10) });
}


