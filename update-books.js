const fs = require('fs');

const tsCode = `export interface RecommendedBookEntry {
  isbn13: string;
  target: string;
  field?: '직무·실무' | '리더십·조직' | '문해력·자기계발' | '인문·교양' | '사회·경제·트렌드' | '문학·에세이';
  jobRole?: string;
  jobLevel?: string;
  recommendReason: string;
  badgeLabel?: string;
  badgeColor?: 'gray' | 'orange' | 'green' | 'teal' | 'blue' | 'purple' | 'pink';

  // --- 알라딘 API 조회 없이 정적으로 사용하는 도서 정보 ---
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

// B2B 추천 도서 선정 로직 (6개 분야, 직무, 직급 골고루 배분)
export const recommendedBookList: RecommendedBookEntry[] = [
  {
    isbn13: '9791166120536',
    target: 'IT/개발 주니어',
    field: '직무·실무',
    jobRole: '개발/IT',
    jobLevel: '주니어',
    recommendReason: "구글의 실제 업무 문화와 협업 방식을 다룹니다.\\n코드 작성뿐만 아니라 코드 리뷰, 테스트, 팀 커뮤니케이션 등 실무에서 바로 적용할 수 있는 엔지니어링 원칙을 배울 수 있어 주니어 개발자에게 강력히 추천합니다.",
    title: "구글 엔지니어는 이렇게 일한다",
    author: "타이토 윈터스 외 (지은이)",
    cover: 'https://image.aladin.co.kr/product/29399/14/cover200/k292837375_1.jpg',
    priceSales: 31500,
    priceStandard: 35000,
    publisher: "인사이트",
    itemId: 293991410,
    categoryName: '국내도서>IT 모바일>컴퓨터 공학>소프트웨어 공학',
    pubDate: '2022-05-10',
    badgeLabel: '영풍문고 추천',
    badgeColor: 'blue'
  },
  {
    isbn13: '9791188248193',
    target: '마케팅 직무',
    field: '직무·실무',
    jobRole: '마케팅',
    jobLevel: '사원~대리',
    recommendReason: "배달의민족 CBO 장인성이 전하는 '일 잘하는 마케터'의 기획법입니다.\\n어떤 직무든 고객의 관점에서 생각하고 프로젝트를 실행하는 데 필요한 실용적인 노하우를 얻을 수 있습니다.",
    title: "마케터의 일",
    author: "장인성 (지은이)",
    cover: 'https://image.aladin.co.kr/product/14299/14/cover200/k062532729_2.jpg',
    priceSales: 13500,
    priceStandard: 15000,
    publisher: "북스톤",
    itemId: 142991475,
    categoryName: '국내도서>경제경영>마케팅/세일즈>마케팅/브랜드',
    pubDate: '2018-04-20',
    badgeLabel: '사내 베스트',
    badgeColor: 'orange'
  },
  {
    isbn13: '9788934977919',
    target: '팀장/리더급',
    field: '리더십·조직',
    jobRole: '경영/전략',
    jobLevel: '팀장 이상',
    recommendReason: "리더의 자기관리의 원칙을 담은 경영 고전으로, 신입부터 관리자까지 두루 추천할만합니다.\\n주도적인 태도부터 우선순위 관리, 상호 이익을 추구하는 협업 자세까지 폭넓게 다룹니다.",
    title: "성공하는 사람들의 7가지 습관",
    author: "스티븐 코비 (지은이)",
    cover: 'https://image.aladin.co.kr/product/10826/79/cover200/8934977914_1.jpg',
    priceSales: 19800,
    priceStandard: 22000,
    publisher: "김영사",
    itemId: 108267955,
    categoryName: '국내도서>자기계발>성공>성공학',
    pubDate: '2017-05-02',
    badgeLabel: '영풍문고 추천',
    badgeColor: 'blue'
  },
  {
    isbn13: '9791168340796',
    target: '글로벌 비즈니스 담당자',
    field: '사회·경제·트렌드',
    jobRole: '사업기획',
    jobLevel: '실무진 전반',
    recommendReason: "반도체를 둘러싼 글로벌 패권 경쟁과 경제적 파장을 흥미진진하게 풀어낸 책입니다.\\n기술 트렌드뿐만 아니라 세계 경제와 지정학적 리스크를 이해해야 하는 비즈니스 직군에게 추천합니다.",
    title: "칩워 (Chip War)",
    author: "크리스 밀러 (지은이)",
    cover: 'https://image.aladin.co.kr/product/31518/42/cover200/k602832569_1.jpg',
    priceSales: 22500,
    priceStandard: 25000,
    publisher: "부키",
    itemId: 315184209,
    categoryName: '국내도서>경제경영>세계경제>세계경제/글로벌경제',
    pubDate: '2023-04-20'
  },
  {
    isbn13: '9791190299091',
    target: '폭넓은 교양이 필요한 분들',
    field: '인문·교양',
    jobRole: '전 직무',
    jobLevel: '전 직급',
    recommendReason: "역사, 경제, 정치, 사회 등 굵직한 인문학적 주제를 하나의 흐름으로 엮어 쉽게 이해할 수 있습니다.\\n다양한 직군과의 협업이나 기획 업무에서 넓은 시야를 갖는 데 훌륭한 밑거름이 됩니다.",
    title: "지적 대화를 위한 넓고 얕은 지식 1",
    author: "채사장 (지은이)",
    cover: 'https://image.aladin.co.kr/product/22904/7/cover200/k832637213_3.jpg',
    priceSales: 14400,
    priceStandard: 16000,
    publisher: "웨일북",
    itemId: 229040713,
    categoryName: '국내도서>인문학>인문교양',
    pubDate: '2020-02-05',
    badgeLabel: 'CEO 추천',
    badgeColor: 'purple'
  },
  {
    isbn13: '9791193638859',
    target: '신사업 기획 및 전략 담당자',
    field: '사회·경제·트렌드',
    jobRole: '기획/마케팅',
    jobLevel: '대리~과장',
    recommendReason: "대한민국의 소비 트렌드와 시장 변화를 예측한 필독서입니다.\\n신사업 기획이나 마케팅 전략을 세울 때, 타겟 고객의 니즈와 라이프스타일 변화를 파악하기 위한 기초 자료로 적극 활용할 수 있습니다.",
    title: "트렌드 코리아 2025",
    author: "김난도 외 (지은이)",
    cover: 'https://image.aladin.co.kr/product/37144/79/cover200/k442031479_3.jpg',
    priceSales: 18000,
    priceStandard: 20000,
    publisher: "미래의창",
    itemId: 371447935,
    categoryName: '국내도서>경제경영>트렌드/미래전망>트렌드/미래전망 일반',
    pubDate: '2024-09-25'
  },
  {
    isbn13: '9791161571188',
    target: '재충전과 힐링이 필요한 임직원',
    field: '문학·에세이',
    jobRole: '전 직무',
    jobLevel: '전 직급',
    recommendReason: "일상 속 소박한 공간 편의점을 배경으로, 서로의 상처를 보듬고 치유하는 따뜻한 이야기를 담은 소설입니다.\\n업무에 지친 마음을 달래고 가벼운 마음으로 공감하며 읽기 좋아 휴식용 도서로 제안합니다.",
    title: "불편한 편의점",
    author: "김호연 (지은이)",
    cover: 'https://image.aladin.co.kr/product/26932/49/cover200/k382730107_3.jpg',
    priceSales: 12600,
    priceStandard: 14000,
    publisher: "나무옆의자",
    itemId: 269324905,
    categoryName: '국내도서>소설/시/희곡>한국소설>장편소설',
    pubDate: '2021-04-20',
    badgeLabel: 'HR 추천',
    badgeColor: 'pink'
  },
  {
    isbn13: '9788901227542',
    target: '마케팅·기획 담당자에게',
    field: '문해력·자기계발',
    jobRole: '기획/전략',
    jobLevel: '실무 담당자',
    recommendReason: "행동경제학 관점에서 선택 설계를 다뤄 마케팅·기획 실무에 실질적인 통찰을 제공합니다.\\n소비자 화면이나 정책을 설계하는 담당자에게 바로 적용할 힌트가 많습니다.",
    title: "넛지 - 더 똑똑한 선택을 이끄는 힘",
    author: "리처드 H. 탈러 외 (지은이)",
    cover: 'https://image.aladin.co.kr/product/17526/30/cover200/8901227541_1.jpg',
    priceSales: 16200,
    priceStandard: 18000,
    publisher: "리더스북",
    itemId: 175263092,
    categoryName: '국내도서>경제경영>경제학/경제일반>경제학이야기',
    pubDate: '2018-11-23'
  },
  {
    isbn13: '9788997575169',
    target: '업무 몰입이 흩어지는 분께',
    field: '문해력·자기계발',
    jobRole: '전 직무',
    jobLevel: '전 직급',
    recommendReason: "우선순위를 정하고 집중하는 법을 다뤄, 업무 몰입이 흐트러지는 분들에게 권합니다.\\n여러 일을 동시에 처리하려다 오히려 진도가 안 나가는 분들에게 단 하나에 집중하는 사고법을 제안합니다.",
    title: "원씽 The One Thing",
    author: "게리 켈러 외 (지은이)",
    cover: 'https://image.aladin.co.kr/product/33147/58/cover200/k812937035_1.jpg',
    priceSales: 15120,
    priceStandard: 16800,
    publisher: "비즈니스북스",
    itemId: 331475851,
    categoryName: '국내도서>자기계발>성공>성공학',
    pubDate: '2013-08-30'
  },
  {
    isbn13: '9788965707691',
    target: '전 직군 모든 임직원',
    field: '직무·실무',
    jobRole: '전 직무',
    jobLevel: '전 직급',
    recommendReason: "디지털 전환 시대의 산업 변화를 조망하는 책으로 직종을 불문하고 참고할 만한 인사이트를 제공합니다.\\n우리 회사·업계가 어디로 가야 하는지 생각해보고 싶은 모든 임직원에게 권합니다.",
    title: "포노 사피엔스 - 스마트폰이 낳은 신인류",
    author: "최재붕 (지은이)",
    cover: 'https://image.aladin.co.kr/product/18453/67/cover200/8965707692_2.jpg',
    priceSales: 15120,
    priceStandard: 16800,
    publisher: "쌤앤파커스",
    itemId: 184536718,
    categoryName: '국내도서>경제경영>트렌드/미래전망>트렌드/미래전망 일반',
    pubDate: '2019-03-11',
    badgeLabel: '임원진 강력 추천',
    badgeColor: 'teal'
  }
];

export function isCurrentlyRecommended(isbn13: string): boolean {
  return recommendedBookList.some((entry) => entry.isbn13 === isbn13);
}
`;

fs.writeFileSync('src/data/recommendedBookList.ts', tsCode, 'utf8');
