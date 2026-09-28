// REVIEW-04 "AI 맞춤 질문" 생성 프록시 호출. Anthropic 키는 Cloudflare Worker의 Secret로만
// 존재한다(worker/.dev.vars, 배포 시 `wrangler secret put ANTHROPIC_API_KEY`) — 루트 .env에 넣으면
// Vite가 클라이언트 번들에 그대로 포함시켜 버리므로 절대 여기 두지 않는다.

const PROXY_BASE = import.meta.env.VITE_ALADIN_PROXY_URL as string | undefined;

// REVIEW_SPEC.md 10.3 — AI 질문 생성 실패 시 노출할 대체 질문.
export const FALLBACK_AI_QUESTION = '우리 회사 업무에 적용할 부분이 무엇인가요?';

// 별도 필드 없이 저장된 aiQuestion 값만으로 "실제 AI가 만든 질문"인지 판별한다 — 폴백 문구와
// 우연히 같은 질문을 AI가 만들 가능성은 사실상 없다고 보고, 문자열 비교로 충분하다고 판단.
export function isAiGeneratedQuestion(question: string | undefined): boolean {
  return Boolean(question) && question !== FALLBACK_AI_QUESTION;
}

// Cloudflare Worker가 요청마다 다른 엣지에서 실행되고, Gemini가 그 엣지의 위치를 이따금
// "지원 안 되는 지역"으로 거절한다(실측 확인: 5회 중 1회꼴로만 성공). 같은 요청을 다시 보내면
// 다른 엣지로 라우팅될 수 있어 재시도가 의미 있다. 타임아웃도 같이 걸어서, 응답이 안 오는
// 경우에도 무한 대기하지 않고 정해진 시간 안에 폴백으로 넘어가게 한다.
const MAX_ATTEMPTS = 3;
const ATTEMPT_TIMEOUT_MS = 4000;

async function requestAiQuestion(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ATTEMPT_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    const data: { question?: string } = await res.json();
    return data.question || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchAiQuestion(book: { title: string; author?: string; category?: string; description?: string }): Promise<string> {
  if (!PROXY_BASE) return FALLBACK_AI_QUESTION;
  const url = new URL('/api/ai/question', PROXY_BASE);
  url.searchParams.set('title', book.title);
  if (book.author) url.searchParams.set('author', book.author);
  if (book.category) url.searchParams.set('category', book.category);
  if (book.description) url.searchParams.set('description', book.description);

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const question = await requestAiQuestion(url.toString());
    if (question) return question;
  }
  return FALLBACK_AI_QUESTION;
}
