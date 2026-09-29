const fs = require('fs');

const PROXY_URL = 'https://ypbooks-b2b-aladin-proxy.ypbookb2b.workers.dev';

const booksTarget = [
  { isbn13: '9791162245620', target: 'IT·개발 주니어', field: '직무·실무', recommendReason: "구글의 실제 업무 문화와 협업 방식을 다룹니다.\\n코드 작성뿐만 아니라 코드 리뷰, 테스트, 팀 커뮤니케이션 등 실무에서 바로 적용할 수 있는 엔지니어링 원칙을 배울 수 있어 주니어 개발자에게 강력히 추천합니다." },
  { isbn13: '9791188248193', target: '마케팅 직무 실무자', field: '직무·실무', recommendReason: "배달의민족 CBO 장인성이 전하는 '일 잘하는 마케터'의 기획법입니다.\\n어떤 직무든 고객의 관점에서 생각하고 프로젝트를 실행하는 데 필요한 실용적인 노하우를 얻을 수 있습니다." },
  { isbn13: '9788934977919', target: '팀장 및 리더급', field: '리더십·조직', recommendReason: "리더의 자기관리의 원칙을 담은 경영 고전으로, 신입부터 관리자까지 두루 추천할만합니다.\\n주도적인 태도부터 우선순위 관리, 상호 이익을 추구하는 협업 자세까지 폭넓게 다룹니다." },
  { isbn13: '9788997575169', target: '업무 몰입이 흩어지는 분', field: '문해력·자기계발', recommendReason: "우선순위를 정하고 집중하는 법을 다뤄, 업무 몰입이 흐트러지는 분들에게 권합니다.\\n여러 일을 동시에 처리하려다 오히려 진도가 안 나가는 분들에게 단 하나에 집중하는 사고법을 제안합니다." },
  { isbn13: '9788901227542', target: '기획·전략 실무 담당자', field: '문해력·자기계발', recommendReason: "행동경제학 관점에서 선택 설계를 다뤄 마케팅·기획 실무에 실질적인 통찰을 제공합니다.\\n소비자 화면이나 정책을 설계하는 담당자에게 바로 적용할 힌트가 많습니다." },
  { isbn13: '9791190313186', target: '폭넓은 교양이 필요한 전 임직원', field: '인문·교양', recommendReason: "역사, 경제, 정치, 사회 등 굵직한 인문학적 주제를 하나의 흐름으로 엮어 쉽게 이해할 수 있습니다.\\n다양한 직군과의 협업이나 기획 업무에서 넓은 시야를 갖는 데 훌륭한 밑거름이 됩니다.", badgeLabel: 'CEO 추천', badgeColor: 'purple' },
  { isbn13: '9791193638859', target: '신사업 기획 및 전략 담당자', field: '사회·경제·트렌드', recommendReason: "대한민국의 소비 트렌드와 시장 변화를 예측한 필독서입니다.\\n신사업 기획이나 마케팅 전략을 세울 때, 타겟 고객의 니즈와 라이프스타일 변화를 파악하기 위한 기초 자료로 적극 활용할 수 있습니다." },
  { isbn13: '9788960519831', target: '글로벌 비즈니스 담당자', field: '사회·경제·트렌드', recommendReason: "반도체를 둘러싼 글로벌 패권 경쟁과 경제적 파장을 흥미진진하게 풀어낸 책입니다.\\n기술 트렌드뿐만 아니라 세계 경제와 지정학적 리스크를 이해해야 하는 비즈니스 직군에게 추천합니다." },
  { isbn13: '9788965707691', target: '산업 변화의 흐름을 읽고 싶은 분', field: '사회·경제·트렌드', recommendReason: "디지털 전환 시대의 산업 변화를 조망하는 책으로 직종을 불문하고 참고할 만한 인사이트를 제공합니다.\\n우리 회사·업계가 어디로 가야 하는지 생각해보고 싶은 모든 임직원에게 권합니다." },
  { isbn13: '9791161571188', target: '재충전과 힐링이 필요한 분', field: '문학·에세이', recommendReason: "일상 속 소박한 공간 편의점을 배경으로, 서로의 상처를 보듬고 치유하는 따뜻한 이야기를 담은 소설입니다.\\n업무 지친 마음을 달래고 가벼운 마음으로 공감하며 읽기 좋아 휴식용 도서로 제안합니다." }
];

async function run() {
  const finalBooks = [];
  for (const info of booksTarget) {
    console.log('Fetching', info.isbn13);
    const res = await fetch(`${PROXY_URL}/api/aladin/lookup?ItemId=${info.isbn13}&ItemIdType=ISBN13`);
    const data = await res.json();
    const item = data.item?.[0];
    if (!item) {
      console.log('NOT FOUND', info.isbn13);
      continue;
    }
    
    const entry = {
      isbn13: info.isbn13,
      target: info.target,
      field: info.field,
      recommendReason: info.recommendReason,
    };
    if (info.badgeLabel) {
      entry.badgeLabel = info.badgeLabel;
      entry.badgeColor = info.badgeColor;
    }
    entry.title = item.title;
    entry.author = item.author;
    entry.cover = item.cover;
    entry.priceSales = item.priceSales;
    entry.priceStandard = item.priceStandard;
    entry.publisher = item.publisher;
    entry.itemId = item.itemId;
    entry.categoryName = item.categoryName;
    entry.pubDate = item.pubDate;
    
    finalBooks.push(entry);
  }
  
  const tsCode = `export interface RecommendedBookEntry {
  isbn13: string;
  /** 추천대상 — Figma BOOK-01 "추천대상" 라벨 (직무/직급/상황 등을 하나의 문구로 작성) */
  target: string;
  /** 추천 분야 (6개 분야) */
  field?: '직무·실무' | '리더십·조직' | '문해력·자기계발' | '인문·교양' | '사회·경제·트렌드' | '문학·에세이';
  recommendReason: string;
  /** 추천자 뱃지(Bookmark Chip) 텍스트 — 큐레이션 목록 외 B2B 관리자가 직접 추가한 도서에만 있음 */
  badgeLabel?: string;
  /** Bookmark 7색 중 추천 주체별 고정값 */
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

// B2B 추천 도서 선정 로직 (6개 분야 배분 및 대상별 맞춤 큐레이션)
export const recommendedBookList: RecommendedBookEntry[] = ${JSON.stringify(finalBooks, null, 2)};

// 베스트셀러/신상품 목록에서 "추천도서" 뱃지를 달아줄 추천도서 10권에 포함되었는지 판별
export function isCurrentlyRecommended(isbn13: string): boolean {
  return recommendedBookList.some((entry) => entry.isbn13 === isbn13);
}
`;

  fs.writeFileSync('src/data/recommendedBookList.ts', tsCode, 'utf8');
  console.log('DONE');
}

run();
