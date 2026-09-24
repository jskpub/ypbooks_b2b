import type { IconName } from '@/components/Icon';

export type ReviewVisibility = 'public-real' | 'public-anonymous' | 'private';

export interface Review {
  id: string;
  /** 알라딘 ItemLookUp으로 실시간 표지/제목을 채우기 위한 키. bookTitle/bookAuthor/coverIcon은 알라딘 호출
   * 실패 시 표시할 폴백이다(오프라인, 알라딘 장애 등). */
  isbn13: string;
  bookTitle: string;
  bookAuthor: string;
  publisher: string;
  coverIcon: IconName;
  authorName: string;
  visibility: ReviewVisibility;
  rating: number;
  oneLiner: string;
  aiQuestion: string;
  detail: string;
  createdAt: string;
  updatedAt?: string;
  /** 본인을 제외한 다른 임직원의 좋아요 수 — 정렬 기준이라 본인이 눌러도 순서가 바뀌지 않는다. */
  likeCount: number;
  likedByMe: boolean;
}

export const reviews: Review[] = [
  {
    id: 'review-unpleasant-convenience-store',
    isbn13: '9791161571188',
    bookTitle: '불편한 편의점',
    bookAuthor: '김호연',
    publisher: '나무옆의자',
    coverIcon: 'book-open',
    authorName: '김지선',
    visibility: 'public-real',
    rating: 5,
    oneLiner: '따뜻한 위로가 필요한 날 다시 꺼내 읽고 싶은 책',
    aiQuestion: '독고 씨가 편의점 사람들과 관계를 맺어 가는 과정에서 가장 인상 깊었던 장면은 무엇인가요?',
    detail:
      '말수가 적은 독고 씨가 손님 한 명 한 명의 사정을 알아채고 조용히 돕는 장면들이 좋았습니다. 팀에서도 먼저 묻기 전에 동료의 상황을 살피는 태도가 필요하다는 생각이 들었습니다.',
    createdAt: '2026-09-22',
    likeCount: 12,
    likedByMe: false,
  },
  {
    id: 'review-atomic-habits',
    isbn13: '9791162540640',
    bookTitle: '아주 작은 습관의 힘',
    bookAuthor: '제임스 클리어',
    publisher: '비즈니스북스',
    coverIcon: 'books',
    authorName: '이하준',
    visibility: 'public-anonymous',
    rating: 4,
    oneLiner: '작은 습관 하나를 바로 시작하게 만드는 실용서',
    aiQuestion: '우리 회사 업무에 적용할 부분이 무엇인가요?',
    detail:
      '"1% 개선" 개념을 주간 회고에 적용해 보기로 했습니다. 큰 목표 대신 매일 반복할 수 있는 작은 행동을 정하니 부담이 줄었고, 체크리스트로 진행 상황을 눈에 보이게 만드는 방법이 특히 유용했습니다.',
    createdAt: '2026-09-24',
    likeCount: 27,
    likedByMe: true,
  },
  {
    id: 'review-vegetarian',
    isbn13: '9788936434595',
    bookTitle: '채식주의자',
    bookAuthor: '한강',
    publisher: '창비',
    coverIcon: 'book-open',
    authorName: '박서연',
    visibility: 'public-real',
    rating: 4,
    oneLiner: '읽는 내내 불편했지만 오래 남는 이야기',
    aiQuestion: '영혜의 선택을 바라보는 주변 인물들의 시선에서 무엇을 느꼈나요?',
    detail:
      '가족들이 영혜를 이해하려 하기보다 설득하고 고치려 드는 모습이 마음에 걸렸습니다. 다른 사람의 선택을 판단하기 전에 그 이유를 먼저 들어 보는 연습이 필요하다고 느꼈습니다.',
    createdAt: '2026-09-18',
    updatedAt: '2026-09-23',
    likeCount: 8,
    likedByMe: false,
  },
  {
    id: 'review-trend-korea',
    isbn13: '9791193638859',
    bookTitle: '트렌드 코리아 2026',
    bookAuthor: '김난도 외',
    publisher: '미래의창',
    coverIcon: 'books',
    authorName: '최민호',
    visibility: 'public-anonymous',
    rating: 3,
    oneLiner: '내년 기획 회의 전에 훑어보기 좋은 키워드 모음',
    aiQuestion: '소개된 트렌드 중 우리 팀 업무와 가장 가까운 키워드는 무엇인가요?',
    detail:
      '고객 경험을 개인화하는 흐름이 우리 서비스에도 해당된다고 봤습니다. 다만 키워드마다 사례가 짧아서 실제 기획에 쓰려면 추가 자료를 찾아봐야 할 것 같습니다.',
    createdAt: '2026-09-20',
    likeCount: 15,
    likedByMe: false,
  },
  {
    id: 'review-private-sample',
    isbn13: '9791187142560',
    bookTitle: '데일 카네기 인간관계론',
    bookAuthor: '데일 카네기',
    publisher: '현대지성',
    coverIcon: 'book-open',
    authorName: '정다은',
    visibility: 'private',
    rating: 5,
    oneLiner: '비공개 서평 — 피드에 노출되지 않아야 한다',
    aiQuestion: '우리 회사 업무에 적용할 부분이 무엇인가요?',
    detail: '비공개로 설정한 서평입니다.',
    createdAt: '2026-09-25',
    likeCount: 0,
    likedByMe: false,
  },
  {
    // CURRENT_USER_NAME(김민서)이 작성한 서평 — readingStatusStore 시드(그릿, 완독)와 짝을 맞춰
    // REVIEW-02의 "서평 보기" 분기, REVIEW-03(나의 서평) 목록을 데이터 없이도 확인할 수 있게 한다.
    id: 'review-그릿-김민서',
    isbn13: '9791162540633',
    bookTitle: '그릿 GRIT',
    bookAuthor: '앤절라 더크워스',
    publisher: '비즈니스북스',
    coverIcon: 'books',
    authorName: '김민서',
    visibility: 'public-real',
    rating: 5,
    oneLiner: '재능보다 끈기, 결국 끝까지 하는 사람이 이긴다',
    aiQuestion: '우리 회사 업무에 적용할 부분이 무엇인가요?',
    detail: '장기 프로젝트를 진행하며 중간에 흔들릴 때마다 "왜 시작했는지"를 다시 떠올리는 습관을 들이게 됐습니다. 목표를 잘게 쪼개서 작은 성취를 자주 확인하는 방식이 특히 도움이 됐습니다.',
    createdAt: '2026-09-09',
    likeCount: 4,
    likedByMe: false,
  },
];
