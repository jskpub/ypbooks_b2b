export interface PastRecommendationEntry {
  isbn13: string;
  target: string;
}

export interface PastRecommendationMonth {
  month: string;
  books: PastRecommendationEntry[];
}

// 월별 큐레이션 관리 화면 부재로 목업 데이터 사용, 카드 폭(104px) 제약으로 추천대상 문구 축약 표기
const POOL: PastRecommendationEntry[] = [
  { isbn13: '9791189327156', target: '새로운 시각' },
  { isbn13: '9788983711892', target: '큰 그림 사고' },
  { isbn13: '9791191056556', target: '위로가 필요할 때' },
  { isbn13: '9788934972464', target: '인류사 교양' },
  { isbn13: '9791161571188', target: '따뜻한 이야기' },
  { isbn13: '9788936434595', target: '깊이 있는 문학' },
  { isbn13: '9788936456788', target: '공감이 필요할 때' },
  { isbn13: '9791187444725', target: '재무 설계 입문' },
  { isbn13: '9788901227542', target: '마케팅 담당자' },
  { isbn13: '9788997575169', target: '몰입력 향상' },
  { isbn13: '9788934977919', target: '신입~관리자' },
  { isbn13: '9788965707691', target: '전 임직원에게' },
  { isbn13: '9791187142560', target: '신입~주니어' },
  { isbn13: '9788966260577', target: '신사업 기획자' },
  { isbn13: '9791193638859', target: '기획·마케터' },
  { isbn13: '9791162540640', target: '업무 루틴 개선' },
  { isbn13: '9791162540633', target: '장기 프로젝트' },
];

// 최신 달(9월)은 이달의 추천도서로 별도 노출되므로 "지난 추천 도서"는 8월부터 8개월 구성
const MONTH_LABELS = ['2026.08', '2026.07', '2026.06', '2026.05', '2026.04', '2026.03', '2026.02', '2026.01'];

const BOOKS_PER_MONTH = 10;
const MONTH_OFFSET_STEP = 3; // 인접 달 라인업 중복 방지 위해 풀 내 순환 오프셋 적용

export const pastRecommendations: PastRecommendationMonth[] = MONTH_LABELS.map((month, monthIndex) => {
  const offset = (monthIndex * MONTH_OFFSET_STEP) % POOL.length;
  const books = Array.from({ length: BOOKS_PER_MONTH }, (_, i) => POOL[(offset + i) % POOL.length]);
  return { month, books };
});
