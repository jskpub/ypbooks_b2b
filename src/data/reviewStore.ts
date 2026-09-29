import { CURRENT_USER_NAME } from '@/data/currentUser';
import { reviews as seedReviews, type Review } from '@/data/reviews';

// DB/로그인 부재로 localStorage 기반 서평 CRUD 목업, 브라우저 로컬에만 반영되고 다른 사용자에게 공유되지 않음
const STORAGE_KEY = 'ypbooks-b2b:reviews';

function readAll(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedReviews;
    const stored: Review[] = JSON.parse(raw);
    const storedIds = new Set(stored.map((review) => review.id));
    // 로컬 저장값 우선, 시드 중 로컬에 없는 항목만 뒤에 병합
    return [...stored, ...seedReviews.filter((review) => !storedIds.has(review.id))];
  } catch {
    return seedReviews;
  }
}

function writeAll(all: Review[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // 저장 실패(프라이빗 모드, 용량 초과) 시 무시, 프로토타입 범위 밖으로 처리
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

// 알라딘 평점이 아닌 자체 서평 데이터 기준 집계, 공개(비공개 제외) 서평만 포함
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

export function deleteReview(id: string): void {
  writeAll(readAll().filter((review) => review.id !== id));
}
