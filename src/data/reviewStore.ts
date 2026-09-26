import { CURRENT_USER_NAME } from '@/data/currentUser';
import { reviews as seedReviews, type Review } from '@/data/reviews';

// DB 없이(로그인도 없이) localStorage로 서평 CRUD를 흉내낸다 — 이 브라우저에서만 보이고, 다른 사람
// 화면에는 반영되지 않는 임시방편이다(진짜 다인원 공유는 서버 저장소가 있어야 한다).
const STORAGE_KEY = 'ypbooks-b2b:reviews';

function readAll(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedReviews;
    const stored: Review[] = JSON.parse(raw);
    const storedIds = new Set(stored.map((review) => review.id));
    // 로컬에 저장된 값이 우선하고, 시드 중 로컬에 없는 항목만 뒤에 붙인다.
    return [...stored, ...seedReviews.filter((review) => !storedIds.has(review.id))];
  } catch {
    return seedReviews;
  }
}

function writeAll(all: Review[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // 저장 실패(프라이빗 모드, 용량 초과)는 조용히 무시 — 프로토타입 범위 밖
  }
}

export function getAllReviews(): Review[] {
  return readAll();
}

export function getMyReviews(authorName: string = CURRENT_USER_NAME): Review[] {
  return readAll().filter((review) => review.authorName === authorName);
}

export function getMyReviewByIsbn(isbn13: string, authorName: string = CURRENT_USER_NAME): Review | undefined {
  return readAll().find((review) => review.isbn13 === isbn13 && review.authorName === authorName);
}

// BOOK-01 대표 도서 영역의 "평점 X.X · 서평 N개" — 우리 자체 서평 데이터 기준(알라딘 평점 아님).
// 공개(비공개 제외) 서평만 집계한다.
export function getReviewStatsByIsbn(isbn13: string): { average: number; count: number } {
  const matched = readAll().filter((review) => review.isbn13 === isbn13 && review.visibility !== 'private');
  if (matched.length === 0) return { average: 0, count: 0 };
  const sum = matched.reduce((acc, review) => acc + review.rating, 0);
  return { average: Math.round((sum / matched.length) * 10) / 10, count: matched.length };
}

export function saveReview(review: Review): void {
  const all = readAll();
  const idx = all.findIndex((existing) => existing.id === review.id);
  if (idx >= 0) all[idx] = review;
  else all.unshift(review);
  writeAll(all);
}
