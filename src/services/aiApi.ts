// Anthropic 키는 Cloudflare Worker Secret로만 존재, 루트 .env 저장 시 Vite가 클라이언트 번들에 포함시켜버리므로 금지

const PROXY_BASE = import.meta.env.VITE_ALADIN_PROXY_URL as string | undefined;

// AI 질문 생성 실패 시 노출할 대체 질문
export const FALLBACK_AI_QUESTION = '우리 회사 업무에 적용할 부분이 무엇인가요?';

// 폴백 문구와 우연히 일치할 가능성 낮다고 판단, 별도 플래그 없이 문자열 비교로 AI 생성 여부 판별
export function isAiGeneratedQuestion(question: string | undefined): boolean {
  return Boolean(question) && question !== FALLBACK_AI_QUESTION;
}

// Cloudflare Worker 요청마다 다른 엣지에서 실행됨, Gemini가 일부 엣지를 미지원 지역으로 거절하는 현상 존재 (실측 약 1/5만 성공) — 재시도 시 다른 엣지로 라우팅되어 성공 가능
// 응답 지연 시 무한 대기 방지 위해 타임아웃 설정
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
