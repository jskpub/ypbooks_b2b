// 알라딘 Open API 프록시 + 서평 작성 AI 질문 생성 프록시.
// 브라우저 -> 알라딘(aladin.co.kr) 직접 fetch는 CORS 헤더 부재로 항상 실패한다(실측 확인됨: TypeError: Failed to fetch).
// 이 Worker가 서버-투-서버로 알라딘/Gemini를 호출하고, CORS 헤더를 붙여 클라이언트에 돌려준다.
// 시크릿(ALADIN_TTBKEY, GEMINI_API_KEY)은 여기(Worker Secret)에만 있고 클라이언트로는 절대 전달하지 않는다.

const ALADIN_BASE = 'https://www.aladin.co.kr/ttb/api';
// gemini-2.0-flash는 단종(404)됐고, 후속으로 안내받은 gemini-3.8-flash는 응답이 5~20초+로 느리고
// (thinking 토큰 소모) 가끔 503 과부하까지 떴다. 짧은 질문 1개 생성엔 무거운 모델이 필요 없어서
// lite 라인으로 교체 — 실측 2~3초, thinking 없이도 완결된 문장이 나온다.
const GEMINI_MODEL = 'gemini-flash-lite-latest';
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

// REVIEW-04 "AI 맞춤 질문" — 목차/상세소개(OptResult=Toc,fulldescription)는 일반 TTBKey로 접근이
// 안 되지만(실측 확인됨), ItemLookUp 기본 응답의 description(책소개 요약)은 별도 옵션 없이 온다 —
// 있으면 프롬프트에 같이 넣고, 없으면(개인도서 등) 제목/저자/분야만으로 생성한다.
async function handleAiQuestion(searchParams, env) {
  if (!env.GEMINI_API_KEY) {
    return jsonError('GEMINI_API_KEY 시크릿이 설정되지 않았습니다. wrangler secret put GEMINI_API_KEY 실행 필요.', 500);
  }
  const title = searchParams.get('title') || '';
  const author = searchParams.get('author') || '';
  const category = searchParams.get('category') || '';
  const description = searchParams.get('description') || '';
  if (!title) return jsonError('title 파라미터가 필요합니다.', 400);

  const prompt = `당신은 회사 독서복지 프로그램에서 임직원의 서평 작성을 돕는 도우미입니다.
아래 책에 대해, 업무나 일상에 적용할 점을 생각해보게 하는 한국어 질문을 딱 1개만 만들어주세요.
질문 문장만 출력하고 다른 설명은 붙이지 마세요.

책 제목: ${title}
저자: ${author}
분야: ${category}${description ? `\n책 소개: ${description}` : ''}`;

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`;
  const res = await fetch(geminiUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      // lite 모델은 thinkingConfig 파라미터 자체를 안 받는다(넣으면 400 INVALID_ARGUMENT) —
      // 애초에 thinking을 안 쓰는 모델이라 뺐다.
      generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return jsonError(`AI 질문 생성 실패: ${errText}`, 502);
  }

  const data = await res.json();
  const question = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
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
