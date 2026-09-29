const STORAGE_KEY = 'ypbooks-b2b:reading-status';

// 'unread' -> 'reading' -> 'done' 순서 고정, 위시리스트형 수동 추가 없이 구매 즉시 'unread'로 시작
export type ReadingStatus = 'unread' | 'reading' | 'done';

export interface ReadingStatusItem {
  isbn13: string;
  status: ReadingStatus;
  purchasedAt: string;
  /** "읽기 시작" 버튼을 누른 날짜, 카드의 "독서 기간" 표기에 사용 */
  startedAt?: string;
  completedAt?: string;
}

// 구매/주문 이력 시스템 부재로 시드 4건 사용, 상태별 분기(읽기 시작/독서 완료/서평 쓰기/서평 보기)를 모두 확인 가능하도록 구성
const SEED_ITEMS: ReadingStatusItem[] = [
  { isbn13: '9791187444725', status: 'unread', purchasedAt: '2026-05-15' },
  { isbn13: '9791162540640', status: 'reading', purchasedAt: '2026-07-10', startedAt: '2026-07-12' },
  { isbn13: '9791187142560', status: 'done', purchasedAt: '2026-07-25', startedAt: '2026-07-26', completedAt: '2026-07-30' },
  { isbn13: '9791162540633', status: 'done', purchasedAt: '2026-08-01', startedAt: '2026-08-02', completedAt: '2026-08-10' },
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
    // 저장 실패(프라이빗 모드 등) 시 무시, 프로토타입 범위 밖으로 처리
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

// CartContext.placeOrder에서 호출, 이미 존재하는 isbn(재구매 등)은 상태 덮어쓰기 방지 위해 건너뜀
export function addPurchasedItems(isbn13List: string[]): void {
  const items = readAll();
  const existing = new Set(items.map((item) => item.isbn13));
  const purchasedAt = new Date().toISOString().slice(0, 10);
  const newItems: ReadingStatusItem[] = [...new Set(isbn13List)].filter((isbn13) => !existing.has(isbn13)).map((isbn13) => ({ isbn13, status: 'unread', purchasedAt }));
  if (newItems.length === 0) return;
  writeAll([...items, ...newItems]);
}

export function markStarted(isbn13: string): void {
  updateStatus(isbn13, { status: 'reading', startedAt: new Date().toISOString().slice(0, 10) });
}

export function markCompleted(isbn13: string): void {
  updateStatus(isbn13, { status: 'done', completedAt: new Date().toISOString().slice(0, 10) });
}


