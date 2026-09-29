const fs = require('fs');

const aladinData = JSON.parse(fs.readFileSync('aladin_books.json', 'utf8'));

// Hardcode the existing static parts
const existingData = {
  '9791187142560': {
    target: '신입~주니어 임직원에게',
    recommendReason: '설득과 협업의 기본기를 다지는 고전으로, 어떤 직무에서도 바로 쓸 수 있는 대인관계 원칙을 담고 있습니다.\\n상대의 입장에서 생각하는 법부터 갈등을 풀어가는 대화법까지, 신입~주니어 시기에 익혀두면 오래 쓰는 내용입니다.\\n실제 업무 대화와 이메일 톤을 다듬는 데도 참고할 만한 사례가 풍부합니다.'
  },
  '9791187444725': {
    target: '재무 설계를 고민하는 분께',
    recommendReason: '재무 설계와 자산 관리에 대한 실용적인 통찰을 제공해 개인 재무 역량을 키우는 데 도움이 됩니다.\\n소득을 어떻게 자산으로 전환할지, 부채와 지출을 어떤 기준으로 판단할지 구체적으로 짚어줍니다.\\n막연했던 재테크 계획을 단계별로 세워보고 싶은 분께 특히 추천합니다.'
  },
  '9791193638859': {
    target: '기획·마케팅 담당자에게',
    recommendReason: '매년 발간되는 소비트렌드 전망서로, 업무에 바로 활용할 수 있는 산업·시장 인사이트를 제공합니다.\\n올해의 소비 키워드와 세대별 소비 패턴 변화를 한눈에 정리해줘서 기획 회의 자료로도 유용합니다.\\n다음 분기 전략을 준비하는 담당자라면 챙겨볼 만합니다.'
  },
  '9791162540640': {
    target: '업무 루틴을 개선하고 싶은 분께',
    recommendReason: '작은 습관으로 성과를 쌓는 법을 다룬 자기계발 베스트셀러로, 업무 생산성 향상에 실질적인 도움이 됩니다.\\n거창한 결심 대신 1%씩 나아지는 시스템을 만드는 방법을 구체적인 사례와 함께 설명합니다.\\n반복되는 업무 루틴을 조금씩 개선하고 싶은 분께 실천 가이드로 추천합니다.'
  },
  '9791162540633': {
    target: '장기 프로젝트를 맡은 분께',
    recommendReason: '재능보다 끈기가 성과를 만든다는 것을 데이터로 증명한 책으로, 장기 프로젝트를 수행하는 직무에 유용합니다.\\n중간에 동기가 흔들릴 때 다시 몰입도를 끌어올리는 방법을 여러 사례로 보여줍니다.\\n오래 걸리는 일을 맡고 있는 팀원들과 함께 읽고 나누기에도 좋습니다.'
  },
  '9788966260577': {
    target: '신사업·기획 담당자에게',
    recommendReason: '가설 검증과 빠른 실행을 강조하는 방법론으로, 신사업·기획 직무 담당자에게 특히 추천합니다.\\n최소 기능 제품(MVP)으로 시장 반응을 먼저 확인하고 방향을 수정해나가는 과정을 단계별로 안내합니다.\\n새로운 서비스나 프로젝트를 준비 중이라면 실무에 바로 대입해볼 수 있습니다.',
    badgeLabel: 'CEO 추천',
    badgeColor: 'blue'
  },
  '9788997575169': {
    target: '업무 몰입도를 높이고 싶은 분께',
    recommendReason: '우선순위를 정하고 집중하는 법을 다뤄, 업무 몰입도를 높이고 싶은 분들에게 권합니다.\\n여러 일을 동시에 처리하려다 오히려 진도가 안 나가는 분들에게 "단 하나"에 집중하는 사고법을 제안합니다.\\n하루 업무 계획을 세우는 방식 자체를 점검해보고 싶을 때 도움이 됩니다.'
  },
  '9788901227542': {
    target: '마케팅·기획 담당자에게',
    recommendReason: '행동경제학 관점에서 선택 설계를 다뤄 마케팅·기획 업무에 실질적인 통찰을 제공합니다.\\n사람들이 왜 예상과 다르게 행동하는지, 작은 장치로 더 나은 선택을 유도하는 방법을 다양한 사례로 설명합니다.\\n서비스 화면이나 정책을 설계하는 담당자에게 바로 적용할 힌트가 많습니다.'
  },
  '9788934977919': {
    target: '신입부터 관리자까지',
    recommendReason: '리더십과 자기관리의 원칙을 담은 경영 고전으로, 신입부터 관리자까지 두루 추천할 만합니다.\\n주도적인 태도부터 우선순위 관리, 상호 이익을 추구하는 협업 자세까지 폭넓게 다룹니다.\\n연차와 관계없이 다시 꺼내 읽을 때마다 새로운 인사이트를 주는 책입니다.'
  },
  '9788965707691': {
    target: '업종·직무 무관 전 임직원에게',
    recommendReason: '디지털 전환 시대의 산업 변화를 조망하는 책으로, 업종을 불문하고 참고할 만한 인사이트를 제공합니다.\\n스마트폰 이후 세대의 소비·행동 패턴이 산업 구조를 어떻게 바꾸고 있는지 폭넓게 다룹니다.\\n우리 회사·업계가 어디쯤 와 있는지 점검해보고 싶은 모든 임직원에게 권합니다.'
  }
};

let newEntries = [];
for (const item of aladinData) {
  const existing = existingData[item.isbn13];
  if (!existing) continue;

  let entryStr = `  {
    isbn13: '${item.isbn13}',
    target: '${existing.target}',
    recommendReason: ${JSON.stringify(existing.recommendReason.replace(/\\\\n/g, '\\n'))},`;
  
  if (existing.badgeLabel) {
    entryStr += `\n    badgeLabel: '${existing.badgeLabel}',`;
  }
  if (existing.badgeColor) {
    entryStr += `\n    badgeColor: '${existing.badgeColor}',`;
  }
  
  entryStr += `
    title: ${JSON.stringify(item.title)},
    author: ${JSON.stringify(item.author)},
    cover: '${item.cover}',
    priceSales: ${item.priceSales},
    priceStandard: ${item.priceStandard},
    publisher: ${JSON.stringify(item.publisher)},
    itemId: ${item.itemId},
    categoryName: '${item.categoryName}',
    pubDate: '${item.pubDate}'
  }`;
  newEntries.push(entryStr);
}

const newTsContent = `export interface RecommendedBookEntry {
  isbn13: string;
  /** 추천대상 — Figma BOOK-01 "추천대상" 라벨, 영풍문고 큐레이션 담당자가 짧게 작성하는 값. */
  target: string;
  recommendReason: string;
  /** 추천자 뱃지(Bookmark Chip) 텍스트 — 큐레이션 목록 외 B2B 관리자가 직접 추가한 도서에만 있음(design-system.md Bookmark). */
  badgeLabel?: string;
  /** Bookmark 7색 중 추천 주체별 고정값. design-system.md: "추천 주체 하나에 색 하나". */
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

// 영풍문고 MD가 선정한 이달의 추천도서 10권 — 회사가 100% 지원하는 목록이다.
// B2B 임직원 독서복지 취지에 맞춰 자기계발·직무·산업 트렌드 위주로 구성했다(문학/교양서 제외).
// 장바구니/결제 로직에서는 이 ISBN 목록에 있는 책만 "추천도서"로 판정한다(그 외는 개인도서로
// 50% · 최대 1만원 지원).
// 추천 사유는 design-system.md Picked Book 스펙("3~5줄, 잘라 내지 않음")에 맞춰 여러 줄로 작성한다.
export const recommendedBookList: RecommendedBookEntry[] = [
${newEntries.join(',\n')}
];

// 베스트/신상품 목록의 "추천도서" 칩 — 이달의 추천도서 10권에 포함돼 있을 때만 노출(BOOK-03/04 스펙).
export function isCurrentlyRecommended(isbn13: string): boolean {
  return recommendedBookList.some((entry) => entry.isbn13 === isbn13);
}
`;

fs.writeFileSync('src/data/recommendedBookList.ts', newTsContent, 'utf8');
console.log('Success merging data');
