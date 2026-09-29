export interface RecommendedBookEntry {
  isbn13: string;
  /** 추천대상, 직무/직급/상황 등을 하나의 문구로 작성 */
  target: string;
  /** 추천 분야 (6개 분야) */
  field?: '직무·실무' | '리더십·조직' | '문해력·자기계발' | '인문·교양' | '사회·경제·트렌드' | '문학·에세이';
  recommendReason: string;
  /** 추천자 뱃지(Bookmark Chip) 텍스트, 큐레이션 목록 외 B2B 관리자가 직접 추가한 도서에만 존재 */
  badgeLabel?: string;
  /** Bookmark 7색 중 추천 주체별 고정값 */
  badgeColor?: 'gray' | 'orange' | 'green' | 'teal' | 'blue' | 'purple' | 'pink';

  // 알라딘 API 조회 없이 정적으로 사용하는 도서 정보
  title: string;
  author: string;
  cover: string;
  priceSales: number;
  priceStandard: number;
  publisher: string;
  itemId: number;
  categoryName: string;
  pubDate: string;
}

export const recommendedBookList: RecommendedBookEntry[] = [
  {
    "isbn13": "9791162245620",
    "target": "IT·개발 주니어",
    "field": "직무·실무",
    "recommendReason": "구글의 실제 업무 문화와 협업 방식을 다룹니다. 코드 작성뿐만 아니라 코드 리뷰, 테스트, 팀 커뮤니케이션 등 실무에서 바로 적용할 수 있는 엔지니어링 원칙을 배울 수 있어 주니어 개발자에게 강력히 추천합니다.",
    "title": "구글 엔지니어는 이렇게 일한다 - 구글러가 전하는 문화, 프로세스, 도구의 모든 것",
    "author": "타이터스 윈터스, 톰 맨쉬렉, 하이럼 라이트 (지은이), 개앞맵시 (옮긴이)",
    "cover": "https://image.aladin.co.kr/product/29414/60/cover200/k562837320_1.jpg",
    "priceSales": 40500,
    "priceStandard": 45000,
    "publisher": "한빛미디어",
    "itemId": 294146082,
    "categoryName": "국내도서>컴퓨터/모바일>컴퓨터 공학>소프트웨어 공학",
    "pubDate": "2022-05-10"
  },
  {
    "isbn13": "9791188248193",
    "target": "마케팅 직무 실무자",
    "field": "직무·실무",
    "recommendReason": "배달의민족 CBO 장인성이 전하는 '일 잘하는 마케터'의 기획법입니다. 어떤 직무든 고객의 관점에서 생각하고 프로젝트를 실행하는 데 필요한 실용적인 노하우를 얻을 수 있습니다.",
    "title": "나이 든 채로 산다는 것 - 쌓여가는 시간에 자존을 더하는 황혼의 인문학",
    "author": "박홍순 (지은이)",
    "cover": "https://image.aladin.co.kr/product/14121/42/cover200/k692532236_1.jpg",
    "priceSales": 12600,
    "priceStandard": 14000,
    "publisher": "웨일북",
    "itemId": 141214220,
    "categoryName": "국내도서>인문학>교양 인문학",
    "pubDate": "2018-04-13"
  },
  {
    "isbn13": "9788934977919",
    "target": "팀장 및 리더급",
    "field": "리더십·조직",
    "recommendReason": "리더의 자기관리의 원칙을 담은 경영 고전으로, 신입부터 관리자까지 두루 추천할만합니다. 주도적인 태도부터 우선순위 관리, 상호 이익을 추구하는 협업 자세까지 폭넓게 다룹니다.",
    "title": "성공하는 사람들의 7가지 습관 - 출간 25주년 뉴에디션",
    "author": "스티븐 코비 (지은이), 김경섭 (옮긴이)",
    "cover": "https://image.aladin.co.kr/product/10826/79/cover200/8934977914_1.jpg",
    "priceSales": 19800,
    "priceStandard": 22000,
    "publisher": "김영사",
    "itemId": 108267955,
    "categoryName": "국내도서>자기계발>성공>성공학",
    "pubDate": "2017-05-02"
  },
  {
    "isbn13": "9788997575169",
    "target": "업무 몰입이 흩어지는 분",
    "field": "문해력·자기계발",
    "recommendReason": "우선순위를 정하고 집중하는 법을 다뤄, 업무 몰입이 흐트러지는 분들에게 권합니다. 여러 일을 동시에 처리하려다 오히려 진도가 안 나가는 분들에게 단 하나에 집중하는 사고법을 제안합니다.",
    "title": "원씽 The One Thing (60만 부 기념 스페셜 에디션) - 복잡한 세상을 이기는 단순함의 힘",
    "author": "게리 켈러, 제이 파파산 (지은이), 구세희 (옮긴이)",
    "cover": "https://image.aladin.co.kr/product/33147/58/cover200/k812937035_1.jpg",
    "priceSales": 15120,
    "priceStandard": 16800,
    "publisher": "비즈니스북스",
    "itemId": 331475851,
    "categoryName": "국내도서>자기계발>성공>성공학",
    "pubDate": "2013-08-30"
  },
  {
    "isbn13": "9788901227542",
    "target": "기획·전략 실무 담당자",
    "field": "문해력·자기계발",
    "recommendReason": "행동경제학 관점에서 선택 설계를 다뤄 마케팅·기획 실무에 실질적인 통찰을 제공합니다. 소비자 화면이나 정책을 설계하는 담당자에게 바로 적용할 힌트가 많습니다.",
    "title": "넛지 - 똑똑한 선택을 이끄는 힘",
    "author": "리처드 H. 탈러, 캐스 R. 선스타인 (지은이), 안진환 (옮긴이), 최정규 (해제)",
    "cover": "https://image.aladin.co.kr/product/17526/30/cover200/8901227541_1.jpg",
    "priceSales": 16200,
    "priceStandard": 18000,
    "publisher": "리더스북",
    "itemId": 175263092,
    "categoryName": "국내도서>경제경영>경제학/경제일반>경제이야기",
    "pubDate": "2018-11-23"
  },
  {
    "isbn13": "9791190313186",
    "target": "폭넓은 교양이 필요한 전 임직원",
    "field": "인문·교양",
    "recommendReason": "역사, 경제, 정치, 사회 등 굵직한 인문학적 주제를 하나의 흐름으로 엮어 쉽게 이해할 수 있습니다. 다양한 직군과의 협업이나 기획 업무에서 넓은 시야를 갖는 데 훌륭한 밑거름이 됩니다.",
    "badgeLabel": "CEO 추천",
    "badgeColor": "purple",
    "title": "지적 대화를 위한 넓고 얕은 지식 1 - 현실 편 : 역사 / 경제 / 정치 / 사회 / 윤리",
    "author": "채사장 (지은이)",
    "cover": "https://image.aladin.co.kr/product/22872/79/cover200/k992636841_3.jpg",
    "priceSales": 17100,
    "priceStandard": 19000,
    "publisher": "웨일북",
    "itemId": 228727924,
    "categoryName": "국내도서>인문학>교양 인문학",
    "pubDate": "2020-02-01"
  },
  {
    "isbn13": "9791193638859",
    "target": "신사업 기획 및 전략 담당자",
    "field": "사회·경제·트렌드",
    "recommendReason": "대한민국의 소비 트렌드와 시장 변화를 예측한 필독서입니다. 신사업 기획이나 마케팅 전략을 세울 때, 타겟 고객의 니즈와 라이프스타일 변화를 파악하기 위한 기초 자료로 적극 활용할 수 있습니다.",
    "title": "트렌드 코리아 2026 - 2026 대한민국 소비트렌드 전망",
    "author": "김난도, 전미영, 최지혜, 권정윤, 한다혜, 이혜원, 이수진, 서유현, 전다현, 이준영, 이향은, 김나은 (지은이)",
    "cover": "https://image.aladin.co.kr/product/37144/79/cover200/k442031479_3.jpg",
    "priceSales": 18000,
    "priceStandard": 20000,
    "publisher": "미래의창",
    "itemId": 371447935,
    "categoryName": "국내도서>경제경영>트렌드/미래전망>트렌드/미래전망 일반",
    "pubDate": "2025-09-25"
  },
  {
    "isbn13": "9788960519831",
    "target": "글로벌 비즈니스 담당자",
    "field": "사회·경제·트렌드",
    "recommendReason": "반도체를 둘러싼 글로벌 패권 경쟁과 경제적 파장을 흥미진진하게 풀어낸 책입니다. 기술 트렌드뿐만 아니라 세계 경제와 지정학적 리스크를 이해해야 하는 비즈니스 직군에게 추천합니다.",
    "title": "칩 워, 누가 반도체 전쟁의 최후 승자가 될 것인가",
    "author": "크리스 밀러 (지은이), 노정태 (옮긴이)",
    "cover": "https://image.aladin.co.kr/product/31576/70/cover200/8960519839_2.jpg",
    "priceSales": 25200,
    "priceStandard": 28000,
    "publisher": "부키",
    "itemId": 315767092,
    "categoryName": "국내도서>경제경영>경제학/경제일반>경제사/경제전망>세계 경제사/경제전망",
    "pubDate": "2023-05-19"
  },
  {
    "isbn13": "9788965707691",
    "target": "산업 변화의 흐름을 읽고 싶은 분",
    "field": "사회·경제·트렌드",
    "recommendReason": "디지털 전환 시대의 산업 변화를 조망하는 책으로 직종을 불문하고 참고할 만한 인사이트를 제공합니다. 우리 회사·업계가 어디로 가야 하는지 생각해보고 싶은 모든 임직원에게 권합니다.",
    "title": "포노 사피엔스 - 스마트폰이 낳은 신인류",
    "author": "최재붕 (지은이)",
    "cover": "https://image.aladin.co.kr/product/18453/67/cover200/8965707692_2.jpg",
    "priceSales": 15120,
    "priceStandard": 16800,
    "publisher": "쌤앤파커스",
    "itemId": 184536718,
    "categoryName": "국내도서>경제경영>트렌드/미래전망>트렌드/미래전망 일반",
    "pubDate": "2019-03-11"
  },
  {
    "isbn13": "9791161571188",
    "target": "재충전과 힐링이 필요한 분",
    "field": "문학·에세이",
    "recommendReason": "일상 속 소박한 공간 편의점을 배경으로, 서로의 상처를 보듬고 치유하는 따뜻한 이야기를 담은 소설입니다. 업무 지친 마음을 달래고 가벼운 마음으로 공감하며 읽기 좋아 휴식용 도서로 제안합니다.",
    "title": "불편한 편의점 (벚꽃 에디션)",
    "author": "김호연 (지은이)",
    "cover": "https://image.aladin.co.kr/product/29045/74/cover200/k192836746_2.jpg",
    "priceSales": 15120,
    "priceStandard": 16800,
    "publisher": "나무옆의자",
    "itemId": 290457417,
    "categoryName": "국내도서>소설/시/희곡>한국소설>2000년대 이후 한국소설",
    "pubDate": "2021-04-20"
  }
];

// 베스트셀러·신상품 목록에서 추천도서 뱃지 표시 여부 판별
export function isCurrentlyRecommended(isbn13: string): boolean {
  return recommendedBookList.some((entry) => entry.isbn13 === isbn13);
}
