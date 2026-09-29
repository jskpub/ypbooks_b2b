// 상위 CID 하나로 조회 시 하위 카테고리 도서까지 포함되므로 API 호출 1회로 단순화 가능
export interface CategoryItem {
  label: string;
  cid: number;
}

export const DOMESTIC_CATEGORIES: CategoryItem[] = [
  { label: '종합',           cid: 0 },
  { label: '소설/에세이/시', cid: 1 },
  { label: '경제/자기계발',  cid: 170 },
  { label: '인문/역사',      cid: 656 },
  { label: '정치/사회',      cid: 798 },
  { label: '예술',           cid: 517 },
  { label: '종교',           cid: 1230 },
  { label: '컴퓨터/IT',      cid: 351 },
  { label: '자연/과학',      cid: 981 },
  { label: '외국어',         cid: 1322 },
  { label: '유아/어린이',    cid: 13788 },
  { label: '중/고학습',      cid: 76000 },
  { label: '수험서/자격증',  cid: 3191 },
  { label: '건강/여행/요리', cid: 55890 },
  { label: '잡지',           cid: 2913 },
];

export const FOREIGN_CATEGORIES: CategoryItem[] = [
  { label: '외서 종합',     cid: 74698 },
  { label: '외서 일반서적', cid: 74699 },
  { label: '외서 컴퓨터',   cid: 74700 },
  { label: '외서 전문서적', cid: 74701 },
];
