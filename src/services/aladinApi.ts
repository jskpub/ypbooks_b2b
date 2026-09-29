// aladin.co.kr 직접 fetch 시 CORS 헤더 부재로 항상 실패 (실측: TypeError: Failed to fetch), Cloudflare Worker 프록시로 우회
// TTBKey는 Worker에만 존재, 클라이언트 코드에는 없음

import { recommendedBookList } from '@/data/recommendedBookList';

const PROXY_BASE = import.meta.env.VITE_ALADIN_PROXY_URL as string | undefined;

// 세션 내 동일 요청 재호출 방지용 인메모리 캐시, 새로고침 전까지 유효
const apiCache = new Map<string, AladinItem[]>();

export interface AladinItem {
  title: string;
  author: string;
  cover: string;
  priceSales: number;
  priceStandard: number;
  isbn13: string;
  itemId: number;
  categoryName: string;
  publisher: string;
  pubDate: string;
  salesPoint: number;
  /** 알라딘 기본 응답의 책소개 요약, 목차/상세소개는 일반 TTBKey로 접근 불가해 이 필드가 최대 상세 정보 (도서에 따라 빈 문자열 가능) */
  description?: string;
  /** OptResult=subInfo,packing 요청한 상세 조회(fetchBookDetail)에서만 채워짐 */
  subInfo?: {
    itemPage?: number;
    packing?: {
      styleDesc?: string;
      sizeWidth?: number;
      sizeHeight?: number;
      sizeDepth?: number;
    };
  };
}

interface AladinListResponse {
  item?: AladinItem[];
  errorMessage?: string;
}

async function callProxy(path: string, params: Record<string, string>): Promise<AladinItem[]> {
  if (!PROXY_BASE) {
    throw new Error('VITE_ALADIN_PROXY_URL이 설정되지 않았습니다. .env를 확인하세요.');
  }
  const url = new URL(path, PROXY_BASE);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  const cacheKey = url.toString();

  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey)!;
  }

  const res = await fetch(cacheKey);
  if (!res.ok) {
    throw new Error(`알라딘 프록시 호출 실패 (status ${res.status})`);
  }
  const data: AladinListResponse = await res.json();
  if (data.errorMessage) {
    throw new Error(data.errorMessage);
  }
  const items = data.item ?? [];
  apiCache.set(cacheKey, items);
  return items;
}

export interface RecommendedAladinItem extends AladinItem {
  target: string;
  recommendReason: string;
  /** B2B 관리자가 큐레이션 외 직접 추가한 도서에만 존재 */
  badgeLabel: string | undefined;
  badgeColor: 'gray' | 'orange' | 'green' | 'teal' | 'blue' | 'purple' | 'pink' | undefined;
}

// recommendedBookList.ts(큐레이션 ISBN+추천대상+추천사유)가 원천, 이 ISBN 목록이 지원금 100% 적용 대상 판정 기준 (장바구니/결제 로직에서 재사용)
export async function fetchRecommendedBooks(): Promise<RecommendedAladinItem[]> {
  // 도서 상세 정보(title/cover 등)를 정적 저장, 방문마다 10회 개별 알라딘 조회 발생 방지
  return recommendedBookList.map(entry => ({
    ...entry,
    badgeLabel: entry.badgeLabel ?? undefined,
    badgeColor: entry.badgeColor ?? undefined,
  }));
}

// 홈 화면 "주간 베스트셀러" 위젯용. categoryId=0이면 전체 조회.
export function fetchBestsellerBooks(maxResults = 8, categoryId = 0, period?: { year: number; month: number; week: number }): Promise<AladinItem[]> {
  const params: Record<string, string> = {
    QueryType: 'Bestseller',
    SearchTarget: 'Book',
    MaxResults: String(maxResults),
  };
  if (categoryId > 0) params.CategoryId = String(categoryId);
  if (period) {
    params.Year = String(period.year);
    params.Month = String(period.month);
    params.Week = String(period.week);
  }
  return callProxy('/api/aladin/list', params);
}

// categoryId=0이면 전체 조회
export function fetchNewArrivalBooks(maxResults = 8, categoryId = 0): Promise<AladinItem[]> {
  const params: Record<string, string> = {
    QueryType: 'ItemNewAll',
    SearchTarget: 'Book',
    MaxResults: String(maxResults),
  };
  if (categoryId > 0) params.CategoryId = String(categoryId);
  return callProxy('/api/aladin/list', params);
}

// 알라딘에 예약판매 전용 리스트 부재로 ItemNewSpecial(주목할 만한 신간) 사용, 기간 파라미터(Year/Month/Week)는 Bestseller 전용이라 불필요
export function fetchNewSpecialBooks(maxResults = 8, categoryId = 0): Promise<AladinItem[]> {
  const params: Record<string, string> = {
    QueryType: 'ItemNewSpecial',
    SearchTarget: 'Book',
    MaxResults: String(maxResults),
  };
  if (categoryId > 0) params.CategoryId = String(categoryId);
  return callProxy('/api/aladin/list', params);
}

export function searchBooks(query: string, maxResults = 20): Promise<AladinItem[]> {
  return callProxy('/api/aladin/search', {
    Query: query,
    QueryType: 'Keyword',
    SearchTarget: 'Book',
    MaxResults: String(maxResults),
  });
}

// 상위 CategoryId 하나로 호출 시 하위 카테고리 도서까지 포함되어 1회 호출로 충분
export function fetchBooksByCategory(categoryId: number, maxResults = 50): Promise<AladinItem[]> {
  return callProxy('/api/aladin/list', {
    QueryType: 'Bestseller',
    SearchTarget: 'Book',
    CategoryId: String(categoryId),
    MaxResults: String(maxResults),
  });
}

export async function fetchBookDetail(isbn13: string): Promise<AladinItem | null> {
  const items = await callProxy('/api/aladin/lookup', {
    ItemId: isbn13,
    ItemIdType: 'ISBN13',
    OptResult: 'subInfo,packing',
  });
  return items[0] ?? null;
}