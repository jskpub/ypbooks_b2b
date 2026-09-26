export interface PastRecommendationEntry {
  isbn13: string;
  target: string;
}

export interface PastRecommendationMonth {
  month: string;
  books: PastRecommendationEntry[];
}

// BOOK-01 "지난 추천 도서" 목업. 월별 큐레이션 이력을 관리하는 실제 데이터 소스가 아직 없어서(관리자
// 화면 미구현) 실제 존재하는 책 + 임의 추천대상 문구로 구성했다. 실제 이력 저장소가 생기면 교체한다.
export const pastRecommendations: PastRecommendationMonth[] = [
  {
    month: '2026.08',
    books: [
      { isbn13: '9791189327156', target: '새로운 관점이 필요한 분께' }, // 물고기는 존재하지 않는다
      { isbn13: '9788983711892', target: '큰 그림을 보고 싶은 분께' }, // 코스모스
      { isbn13: '9791191056556', target: '지친 일상에 위로가 필요한 분께' }, // 미드나잇 라이브러리
      { isbn13: '9788934972464', target: '인류사에 관심 있는 분께' }, // 사피엔스
      { isbn13: '9791161571188', target: '따뜻한 이야기가 필요한 분께' }, // 불편한 편의점
    ],
  },
  {
    month: '2026.07',
    books: [
      { isbn13: '9788936434595', target: '깊이 있는 문학을 찾는 분께' }, // 채식주의자
      { isbn13: '9788936456788', target: '공감의 힘을 느끼고 싶은 분께' }, // 아몬드
      { isbn13: '9791187444725', target: '재무 설계를 고민하는 분께' }, // 부의 추월차선
      { isbn13: '9788901227542', target: '마케팅·기획 담당자에게' }, // 넛지
      { isbn13: '9788997575169', target: '업무 몰입도를 높이고 싶은 분께' }, // 원씽
    ],
  },
  {
    month: '2026.06',
    books: [
      { isbn13: '9788934977919', target: '신입부터 관리자까지' }, // 성공하는 사람들의 7가지 습관
      { isbn13: '9788965707691', target: '업종·직무 무관 전 임직원에게' }, // 포노 사피엔스
      { isbn13: '9791187142560', target: '신입~주니어 임직원에게' }, // 데일 카네기 인간관계론
      { isbn13: '9788966260577', target: '신사업·기획 담당자에게' }, // 린 스타트업
      { isbn13: '9791193638859', target: '기획·마케팅 담당자에게' }, // 트렌드 코리아 2026
    ],
  },
];
