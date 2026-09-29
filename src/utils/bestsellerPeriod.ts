// BOOK-03 베스트 년/월/주차 드롭다운용 기간 계산.
// 알라딘 ItemList(QueryType=Bestseller)의 Year/Month/Week 파라미터는 "그 달의 몇째 주"를 받는다.
// 주차 경계는 매뉴얼에 명시돼 있지 않아서 1~7일 = 1주, 8~14일 = 2주 … 로 단순하게 나눈다.

/** 드롭다운에 보여줄 연도 범위 — 올해 포함 최근 5년. */
const YEAR_RANGE = 5;

export interface BestsellerPeriod {
  year: number;
  month: number;
  week: number;
}

export function weekOfMonth(day: number): number {
  return Math.ceil(day / 7);
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getCurrentPeriod(now: Date = new Date()): BestsellerPeriod {
  return { year: now.getFullYear(), month: now.getMonth() + 1, week: weekOfMonth(now.getDate()) };
}

export function getYearOptions(now: Date = new Date()): number[] {
  const current = now.getFullYear();
  return Array.from({ length: YEAR_RANGE }, (_, index) => current - index);
}

// 아직 오지 않은 달·주는 집계가 없어서 선택지에서 뺀다.
export function getMonthOptions(year: number, now: Date = new Date()): number[] {
  const last = year === now.getFullYear() ? now.getMonth() + 1 : 12;
  return Array.from({ length: last }, (_, index) => index + 1);
}

export function getWeekOptions(year: number, month: number, now: Date = new Date()): number[] {
  const current = getCurrentPeriod(now);
  const last = year === current.year && month === current.month ? current.week : weekOfMonth(daysInMonth(year, month));
  return Array.from({ length: last }, (_, index) => index + 1);
}

/** 연·월을 바꿨을 때 기존 월/주차가 새 범위를 벗어나면 마지막 선택지로 당긴다. */
export function clampPeriod(period: BestsellerPeriod, now: Date = new Date()): BestsellerPeriod {
  const months = getMonthOptions(period.year, now);
  const month = Math.min(period.month, months[months.length - 1]);
  const weeks = getWeekOptions(period.year, month, now);
  const week = Math.min(period.week, weeks[weeks.length - 1]);
  return { year: period.year, month, week };
}

// 알라딘엔 월간 베스트셀러 리스트가 없다 — 월간은 그 달의 마지막 주(이번 달이면 이번 주) 순위를
// 가져와 화면에서 재배열한다.
export function getLastWeekOfMonth(year: number, month: number, now: Date = new Date()): number {
  const weeks = getWeekOptions(year, month, now);
  return weeks[weeks.length - 1];
}

export function isCurrentPeriod(period: BestsellerPeriod, now: Date = new Date()): boolean {
  const current = getCurrentPeriod(now);
  return period.year === current.year && period.month === current.month && period.week === current.week;
}
