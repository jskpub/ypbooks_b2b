// 알라딘 Open API 연동.
// 브라우저 -> aladin.co.kr 직접 fetch는 CORS 헤더 부재로 항상 실패한다(실측 확인: TypeError: Failed to fetch).
// 그래서 자체 Cloudflare Worker 프록시(worker/)를 거쳐서 호출한다. TTBKey는 Worker에만 있고 여기 코드엔 없다.

import { recommendedBookList } from '@/data/recommendedBookList';

const PROXY_BASE = import.meta.env.VITE_ALADIN_PROXY_URL as string | undefined;

export interface AladinItem {
  title: string;
  author: string;
  cover: string;
  priceSales: number;
  priceStandard: number;
  isbn13: string;
  itemId: number;
  categoryName: string;
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
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`알라딘 프록시 호출 실패 (status ${res.status})`);
  }
  const data: AladinListResponse = await res.json();
  if (data.errorMessage) {
    throw new Error(data.errorMessage);
  }
  return data.item ?? [];
}

export interface RecommendedAladinItem extends AladinItem {
  recommendReason: string;
}

// 홈 화면 "이달의 추천도서" 위젯용.
// src/data/recommendedBookList.ts(영풍문고 MD 큐레이션 ISBN 10권 + 추천사유)를 원천으로 삼고,
// 도서 정보(제목/저자/표지/가격)는 ISBN마다 알라딘 ItemLookUp으로 조회해 채운다.
// 이 목록의 ISBN이 곧 "지원금 100% 적용 대상" 판정 기준이 된다(장바구니/결제 로직에서 재사용).
export async function fetchRecommendedBooks(): Promise<RecommendedAladinItem[]> {
  const results = await Promise.all(
    recommendedBookList.map(async ({ isbn13, recommendReason }) => {
      const items = await callProxy('/api/aladin/lookup', {
        ItemId: isbn13,
        ItemIdType: 'ISBN13',
      });
      const item = items[0];
      return item ? { ...item, recommendReason } : null;
    }),
  );
  return results.filter((item): item is RecommendedAladinItem => item !== null);
}

// 홈 화면 "주간 베스트셀러" 위젯용.
export function fetchBestsellerBooks(maxResults = 8): Promise<AladinItem[]> {
  return callProxy('/api/aladin/list', {
    QueryType: 'Bestseller',
    SearchTarget: 'Book',
    MaxResults: String(maxResults),
  });
}

// 홈 화면 "신간 도서" 위젯용.
export function fetchNewArrivalBooks(maxResults = 8): Promise<AladinItem[]> {
  return callProxy('/api/aladin/list', {
    QueryType: 'ItemNewAll',
    SearchTarget: 'Book',
    MaxResults: String(maxResults),
  });
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

// 도서 상세(BOOK-05)용 단건 조회.
export async function fetchBookDetail(isbn13: string): Promise<AladinItem | null> {
  const items = await callProxy('/api/aladin/lookup', {
    ItemId: isbn13,
    ItemIdType: 'ISBN13',
  });
  return items[0] ?? null;
}
