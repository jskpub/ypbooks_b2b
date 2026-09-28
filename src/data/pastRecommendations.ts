export interface PastRecommendationEntry {
  isbn13: string;
  target: string;
}

export interface PastRecommendationMonth {
  month: string;
  books: PastRecommendationEntry[];
}

// BOOK-01 "지난 추천 도서" 월별 큐레이션 이력을 관리하는 실제 데이터 소스가 아직 없다(관리자 화면
// 미구현). 실제 데이터 소스가 생기면 이 배열을 그 값으로 채운다.
export const pastRecommendations: PastRecommendationMonth[] = [];
