// 알라딘 Open API 프록시.
// 브라우저 -> 알라딘(aladin.co.kr) 직접 fetch는 CORS 헤더 부재로 항상 실패한다(실측 확인됨: TypeError: Failed to fetch).
// 이 Worker가 서버-투-서버로 알라딘을 호출하고, CORS 헤더를 붙여 클라이언트에 돌려준다.
// TTBKey는 여기(Worker Secret)에만 있고 클라이언트로는 절대 전달하지 않는다.

const ALADIN_BASE = 'https://www.aladin.co.kr/ttb/api';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function withCors(body, init = {}) {
  return new Response(body, {
    ...init,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  });
}

function jsonError(message, status) {
  return withCors(JSON.stringify({ error: message }), { status });
}

// 허용된 파라미터만 통과시킨다. 클라이언트가 output/ttbkey/Version 등을 임의로 덮어쓰지 못하게 막는다.
function buildAladinUrl(endpoint, allowedParams, searchParams, env) {
  const url = new URL(`${ALADIN_BASE}/${endpoint}`);
  url.searchParams.set('ttbkey', env.ALADIN_TTBKEY);
  url.searchParams.set('output', 'js');
  url.searchParams.set('Version', '20131101');
  url.searchParams.set('Cover', 'Mid');
  for (const key of allowedParams) {
    const value = searchParams.get(key);
    if (value) url.searchParams.set(key, value);
  }
  return url;
}

async function proxyToAladin(aladinUrl) {
  const res = await fetch(aladinUrl, { headers: { 'User-Agent': 'ypbooks-b2b-prototype-proxy' } });
  const text = await res.text();
  return withCors(text, { status: res.status });
}

const ROUTES = {
  // 이달의 추천도서(홈 위젯) 등 목록성 조회 - QueryType=Bestseller/ItemNewAll 등
  '/api/aladin/list': (searchParams, env) =>
    buildAladinUrl('ItemList.aspx', ['QueryType', 'SearchTarget', 'MaxResults', 'start', 'CategoryId', 'Year', 'Month', 'Week'], searchParams, env),
  // 개인도서 자유 검색
  '/api/aladin/search': (searchParams, env) =>
    buildAladinUrl('ItemSearch.aspx', ['Query', 'QueryType', 'SearchTarget', 'MaxResults', 'start', 'Sort', 'CategoryId'], searchParams, env),
  // 도서 상세
  '/api/aladin/lookup': (searchParams, env) =>
    buildAladinUrl('ItemLookUp.aspx', ['ItemId', 'ItemIdType', 'OptResult'], searchParams, env),
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }
    if (request.method !== 'GET') {
      return jsonError('GET만 지원합니다.', 405);
    }
    if (!env.ALADIN_TTBKEY) {
      return jsonError('ALADIN_TTBKEY 시크릿이 설정되지 않았습니다. wrangler secret put ALADIN_TTBKEY 실행 필요.', 500);
    }

    const { pathname, searchParams } = new URL(request.url);
    const buildUrl = ROUTES[pathname];
    if (!buildUrl) {
      return jsonError(`알 수 없는 경로입니다: ${pathname}`, 404);
    }

    try {
      const aladinUrl = buildUrl(searchParams, env);
      return await proxyToAladin(aladinUrl);
    } catch (err) {
      return jsonError(`알라딘 API 호출 실패: ${err.message}`, 502);
    }
  },
};
