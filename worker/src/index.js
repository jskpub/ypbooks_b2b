// 알라딘 Open API 프록시 + 서평 작성 AI 질문 생성 프록시.
// 브라우저 -> 알라딘(aladin.co.kr) 직접 fetch는 CORS 헤더 부재로 항상 실패한다(실측 확인됨: TypeError: Failed to fetch).
// 이 Worker가 서버-투-서버로 알라딘/Anthropic을 호출하고, CORS 헤더를 붙여 클라이언트에 돌려준다.
// 시크릿(ALADIN_TTBKEY, ANTHROPIC_API_KEY)은 여기(Worker Secret)에만 있고 클라이언트로는 절대 전달하지 않는다.

const ALADIN_BASE = 'https://www.aladin.co.kr/ttb/api';
const ANTHROPIC_MESSAGES_URL = 'https://api.anthropic.com/v1/messages';
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
  // BookCard 표지 슬롯이 192px라 Mid(85px)를 확대하면 흐려진다. 알라딘 최대 옵션인 Big(200px)을 쓴다.
  url.searchParams.set('Cover', 'Big');
  for (const key of allowedParams) {
    const value = searchParams.get(key);
    if (value) url.searchParams.set(key, value);
  }
  return url;
}

async function proxyToAladin(aladinUrl) {
  if (!aladinUrl) return jsonError('ALADIN_TTBKEY 시크릿이 설정되지 않았습니다. wrangler secret put ALADIN_TTBKEY 실행 필요.', 500);
  const res = await fetch(aladinUrl, { headers: { 'User-Agent': 'ypbooks-b2b-prototype-proxy' } });
  const text = await res.text();
  return withCors(text, { status: res.status });
}

// REVIEW-04 "AI 맞춤 질문" — 알라딘이 책 소개글/목차를 기본 제공하지 않아(별도 협의 대상), 제목/저자/
// 카테고리만으로 질문 1개를 생성한다. 실패 시 클라이언트가 REVIEW_SPEC.md 10.3의 대체 질문을 쓴다.
async function handleAiQuestion(searchParams, env) {
  if (!env.ANTHROPIC_API_KEY) {
    return jsonError('ANTHROPIC_API_KEY 시크릿이 설정되지 않았습니다. wrangler secret put ANTHROPIC_API_KEY 실행 필요.', 500);
  }
  const title = searchParams.get('title') || '';
  const author = searchParams.get('author') || '';
  const category = searchParams.get('category') || '';
  if (!title) return jsonError('title 파라미터가 필요합니다.', 400);

  const prompt = `당신은 회사 독서복지 프로그램에서 임직원의 서평 작성을 돕는 도우미입니다.
아래 책에 대해, 업무나 일상에 적용할 점을 생각해보게 하는 한국어 질문을 딱 1개만 만들어주세요.
질문 문장만 출력하고 다른 설명은 붙이지 마세요.

책 제목: ${title}
저자: ${author}
분야: ${category}`;

  const res = await fetch(ANTHROPIC_MESSAGES_URL, {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return jsonError(`AI 질문 생성 실패: ${errText}`, 502);
  }

  const data = await res.json();
  const question = data.content?.[0]?.text?.trim();
  if (!question) return jsonError('AI 응답에서 질문을 찾지 못했습니다.', 502);

  return withCors(JSON.stringify({ question }));
}

const ROUTE_HANDLERS = {
  // 이달의 추천도서(홈 위젯) 등 목록성 조회 - QueryType=Bestseller/ItemNewAll 등
  '/api/aladin/list': (searchParams, env) =>
    proxyToAladin(buildAladinUrl('ItemList.aspx', ['QueryType', 'SearchTarget', 'MaxResults', 'start', 'CategoryId', 'Year', 'Month', 'Week'], searchParams, env)),
  // 개인도서 자유 검색
  '/api/aladin/search': (searchParams, env) =>
    proxyToAladin(buildAladinUrl('ItemSearch.aspx', ['Query', 'QueryType', 'SearchTarget', 'MaxResults', 'start', 'Sort', 'CategoryId'], searchParams, env)),
  // 도서 상세
  '/api/aladin/lookup': (searchParams, env) => proxyToAladin(buildAladinUrl('ItemLookUp.aspx', ['ItemId', 'ItemIdType', 'OptResult'], searchParams, env)),
  // 서평 작성 AI 맞춤 질문(REVIEW-04)
  '/api/ai/question': (searchParams, env) => handleAiQuestion(searchParams, env),
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }
    if (request.method !== 'GET') {
      return jsonError('GET만 지원합니다.', 405);
    }

    const { pathname, searchParams } = new URL(request.url);
    const handler = ROUTE_HANDLERS[pathname];
    if (!handler) {
      return jsonError(`알 수 없는 경로입니다: ${pathname}`, 404);
    }

    try {
      return await handler(searchParams, env);
    } catch (err) {
      return jsonError(`요청 처리 실패: ${err.message}`, 502);
    }
  },
};
