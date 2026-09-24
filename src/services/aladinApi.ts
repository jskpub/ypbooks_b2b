// 알라딘 Open API 연동.
// 브라우저 -> aladin.co.kr 직접 fetch는 CORS 헤더 부재로 항상 실패한다(실측 확인: TypeError: Failed to fetch).
// 그래서 자체 Cloudflare Worker 프록시(worker/)를 거쳐서 호출한다. TTBKey는 Worker에만 있고 여기 코드엔 없다.

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

// 홈 화면 "이달의 추천도서" 위젯용.
// 주의: 알라딘 "편집자 추천"(소설 카테고리 고정)을 임시로 사용 중이다. 실제로는 영풍문고 MD가
// 큐레이션한 추천도서(추천사유 포함)가 원천 데이터여야 한다(PRD/문의회신 참고).
// MD 큐레이션 데이터 소스가 정해지면 이 함수를 ISBN 목록 기반 ItemLookUp 호출로 교체한다.
export function fetchRecommendedBooks(maxResults = 8): Promise<AladinItem[]> {
  return callProxy('/api/aladin/list', {
    QueryType: 'ItemEditorChoice',
    SearchTarget: 'Book',
    CategoryId: '1', // 소설/시/희곡 - ItemEditorChoice는 CategoryId 필수(전체 조회 불가)
    MaxResults: String(maxResults),
  });
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
