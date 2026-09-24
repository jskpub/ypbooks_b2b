// REVIEW-04 "AI 맞춤 질문" 생성 프록시 호출. Anthropic 키는 Cloudflare Worker의 Secret로만
// 존재한다(worker/.dev.vars, 배포 시 `wrangler secret put ANTHROPIC_API_KEY`) — 루트 .env에 넣으면
// Vite가 클라이언트 번들에 그대로 포함시켜 버리므로 절대 여기 두지 않는다.

const PROXY_BASE = import.meta.env.VITE_ALADIN_PROXY_URL as string | undefined;

// REVIEW_SPEC.md 10.3 — AI 질문 생성 실패 시 노출할 대체 질문.
export const FALLBACK_AI_QUESTION = '우리 회사 업무에 적용할 부분이 무엇인가요?';

export async function fetchAiQuestion(book: { title: string; author?: string; category?: string }): Promise<string> {
  if (!PROXY_BASE) return FALLBACK_AI_QUESTION;
  try {
    const url = new URL('/api/ai/question', PROXY_BASE);
    url.searchParams.set('title', book.title);
    if (book.author) url.searchParams.set('author', book.author);
    if (book.category) url.searchParams.set('category', book.category);
    const res = await fetch(url.toString());
    if (!res.ok) return FALLBACK_AI_QUESTION;
    const data: { question?: string } = await res.json();
    return data.question || FALLBACK_AI_QUESTION;
  } catch {
    return FALLBACK_AI_QUESTION;
  }
}
