export interface PastRecommendationEntry {
  isbn13: string;
  target: string;
}

export interface PastRecommendationMonth {
  month: string;
  books: PastRecommendationEntry[];
}

// BOOK-01 "지난 추천 도서" 목업. 월별 큐레이션 이력을 관리하는 실제 데이터 소스가 아직 없어서(관리자
// 화면 미구현) 실제 존재하는 책 + 임의 추천대상 문구로 구성했다. 알라딘 조회가 이미 검증된 ISBN
// 17종(과거 이력 + 이달의 추천도서 recommendedBookList.ts와 겹치는 항목 포함)을 풀로 두고, 월마다
// 10권(화살표 5+5)씩 순환 배치한다. 실제 이력 저장소가 생기면 이 파일 전체를 교체한다.
// 카드 폭(104px)에 맞춰 한 줄로 들어가도록 짧게 쓴다 — 원래 문구는 recommendedBookList.ts처럼
// "~하는 분께" 전체 문장이었지만, 좁은 카드에서 줄바꿈되어 CSS만으로는 못 고쳐 문구 자체를 줄였다.
const POOL: PastRecommendationEntry[] = [
  { isbn13: '9791189327156', target: '새로운 시각' }, // 물고기는 존재하지 않는다
  { isbn13: '9788983711892', target: '큰 그림 사고' }, // 코스모스
  { isbn13: '9791191056556', target: '위로가 필요할 때' }, // 미드나잇 라이브러리
  { isbn13: '9788934972464', target: '인류사 교양' }, // 사피엔스
  { isbn13: '9791161571188', target: '따뜻한 이야기' }, // 불편한 편의점
  { isbn13: '9788936434595', target: '깊이 있는 문학' }, // 채식주의자
  { isbn13: '9788936456788', target: '공감이 필요할 때' }, // 아몬드
  { isbn13: '9791187444725', target: '재무 설계 입문' }, // 부의 추월차선
  { isbn13: '9788901227542', target: '마케팅 담당자' }, // 넛지
  { isbn13: '9788997575169', target: '몰입력 향상' }, // 원씽
  { isbn13: '9788934977919', target: '신입~관리자' }, // 성공하는 사람들의 7가지 습관
  { isbn13: '9788965707691', target: '전 임직원에게' }, // 포노 사피엔스
  { isbn13: '9791187142560', target: '신입~주니어' }, // 데일 카네기 인간관계론
  { isbn13: '9788966260577', target: '신사업 기획자' }, // 린 스타트업
  { isbn13: '9791193638859', target: '기획·마케터' }, // 트렌드 코리아 2026
  { isbn13: '9791162540640', target: '업무 루틴 개선' }, // 아주 작은 습관의 힘
  { isbn13: '9791162540633', target: '장기 프로젝트' }, // 그릿
];

// 더보기(⑮) 스펙: 기본 3개월 노출 → 클릭 시 3개월씩 추가, 더 없으면 버튼 숨김.
// 최신 달(9월)은 이달의 추천도서라 "지난" 목록엔 8월부터 올해 1월까지 8개월을 채운다.
const MONTH_LABELS = ['2026.08', '2026.07', '2026.06', '2026.05', '2026.04', '2026.03', '2026.02', '2026.01'];

const BOOKS_PER_MONTH = 10;
const MONTH_OFFSET_STEP = 3; // 인접한 달끼리 라인업이 똑같아 보이지 않도록 풀 안에서 순환 오프셋을 준다.

export const pastRecommendations: PastRecommendationMonth[] = MONTH_LABELS.map((month, monthIndex) => {
  const offset = (monthIndex * MONTH_OFFSET_STEP) % POOL.length;
  const books = Array.from({ length: BOOKS_PER_MONTH }, (_, i) => POOL[(offset + i) % POOL.length]);
  return { month, books };
});
