// 알라딘 Open API 연동.
// 브라우저 -> aladin.co.kr 직접 fetch는 CORS 헤더 부재로 항상 실패한다(실측 확인: TypeError: Failed to fetch).
// 그래서 자체 Cloudflare Worker 프록시(worker/)를 거쳐서 호출한다. TTBKey는 Worker에만 있고 여기 코드엔 없다.

import { recommendedBookList } from '@/data/recommendedBookList';

const PROXY_BASE = import.meta.env.VITE_ALADIN_PROXY_URL as string | undefined;

// 세션 내 중복 API 호출 방지용 인메모리 캐시. 키: 완성된 요청 URL, 값: 응답 item 배열.
// 페이지 새로고침 전까지 유효하며, 동일한 요청은 네트워크 없이 즉시 반환된다.
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
  /** 알라딘 기본 응답에 포함된 책소개 요약. 목차/상세소개(OptResult=Toc,fulldescription)는
   * 일반 TTBKey로 접근이 안 돼서(실측 확인) 이 필드가 얻을 수 있는 가장 상세한 정보다.
   * 항상 오는 필드지만 도서에 따라 빈 문자열일 수 있어 optional로 둔다. */
  description?: string;
  /** OptResult=subInfo,packing으로 요청한 상세 조회(fetchBookDetail)에서만 채워진다. */
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

  // 세션 내 캐시 히트 시 API를 재호출하지 않는다.
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
  /** design-system.md Bookmark — 큐레이션 목록 외 B2B 관리자가 직접 추가한 도서에만 존재. */
  badgeLabel: string | undefined;
  badgeColor: 'gray' | 'orange' | 'green' | 'teal' | 'blue' | 'purple' | 'pink' | undefined;
}

// 홈/추천도서(BOOK-01) 화면용.
// src/data/recommendedBookList.ts(영풍문고 MD 큐레이션 ISBN 10권 + 추천대상 + 추천사유)를 원천으로 삼고,
// 도서 정보(제목/저자/표지/가격)는 ISBN마다 알라딘 ItemLookUp으로 조회해 채운다.
// 이 목록의 ISBN이 곧 "지원금 100% 적용 대상" 판정 기준이 된다(장바구니/결제 로직에서 재사용).
export async function fetchRecommendedBooks(): Promise<RecommendedAladinItem[]> {
  // 추천도서는 추천사유와 함께 도서 상세 정보(title, cover 등)를 recommendedBookList.ts에 직접 정적 데이터로 저장하여,
  // 홈 방문 시마다 10회의 알라딘 API 개별 조회가 발생하는 것을 방지함.
  return recommendedBookList.map(entry => ({
    ...entry,
    badgeLabel: entry.badgeLabel ?? undefined,
    badgeColor: entry.badgeColor ?? undefined,
  }));
}

// 홈 화면 "주간 베스트셀러" 위젯 / 베스트(BOOK-03). categoryId=0이면 전체 조회.
// period를 주면 그 주(Year/Month/Week)의 순위를, 생략하면 알라딘 기준 이번 주 순위를 준다.
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

// 홈 화면 "신간 도서" 위젯 / 신상품(BOOK-04) "새로 나온 도서" 탭. categoryId=0이면 전체 조회.
export function fetchNewArrivalBooks(maxResults = 8, categoryId = 0): Promise<AladinItem[]> {
  const params: Record<string, string> = {
    QueryType: 'ItemNewAll',
    SearchTarget: 'Book',
    MaxResults: String(maxResults),
  };
  if (categoryId > 0) params.CategoryId = String(categoryId);
  return callProxy('/api/aladin/list', params);
}

// 신상품(BOOK-04) "화제의 신간" 탭. 알라딘엔 출간 전 예약판매 전용 리스트가 없어서, 대신
// "주목할 만한 신간"(ItemNewSpecial)을 쓴다. Year/Month/Week 같은 기간 파라미터는 Bestseller
// 전용이라 여기선 필요 없다 — 알라딘이 알아서 최신 기준으로 준다. categoryId=0이면 전체 조회.
export function fetchNewSpecialBooks(maxResults = 8, categoryId = 0): Promise<AladinItem[]> {
  const params: Record<string, string> = {
    QueryType: 'ItemNewSpecial',
    SearchTarget: 'Book',
    MaxResults: String(maxResults),
  };
  if (categoryId > 0) params.CategoryId = String(categoryId);
  return callProxy('/api/aladin/list', params);
}

// 개인도서 자유 검색.
export function searchBooks(query: string, maxResults = 20): Promise<AladinItem[]> {
  return callProxy('/api/aladin/search', {
    Query: query,
    QueryType: 'Keyword',
    SearchTarget: 'Book',
    MaxResults: String(maxResults),
  });
}

// 카테고리별 도서 목록 조회. CategoryId(알라딘 CID) 하나로 1회 호출한다 — 상위 CID를 넘기면
// 하위 카테고리 도서까지 포함된다.
export function fetchBooksByCategory(categoryId: number, maxResults = 50): Promise<AladinItem[]> {
  return callProxy('/api/aladin/list', {
    QueryType: 'Bestseller',
    SearchTarget: 'Book',
    CategoryId: String(categoryId),
    MaxResults: String(maxResults),
  });
}

// 도서 상세(BOOK-05)용 단건 조회.
export async function fetchBookDetail(isbn13: string): Promise<AladinItem | null> {
  const items = await callProxy('/api/aladin/lookup', {
    ItemId: isbn13,
    ItemIdType: 'ISBN13',
    OptResult: 'subInfo,packing',
  });
  return items[0] ?? null;
}
