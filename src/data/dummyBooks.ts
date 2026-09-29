import { recommendedBookList } from '@/data/recommendedBookList';
import type { AladinItem } from '@/services/aladinApi';

// 알라딘 API 호출 실패(점검, 네트워크 오류, 응답 파싱 실패 등) 시 화면이 완전히 비지 않도록 쓰는 대체 데이터.
// recommendedBookList(이달의 추천도서 큐레이션)에 이미 있는 실제 도서 정보를 그대로 재사용 — 표지 이미지도
// 실제 알라딘 CDN 주소라 따로 찾을 필요 없이 바로 표시된다. salesPoint만 원본에 없어 0으로 채움.
export const dummyBooks: AladinItem[] = recommendedBookList.map((entry) => ({
  title: entry.title,
  author: entry.author,
  cover: entry.cover,
  priceSales: entry.priceSales,
  priceStandard: entry.priceStandard,
  isbn13: entry.isbn13,
  itemId: entry.itemId,
  categoryName: entry.categoryName,
  publisher: entry.publisher,
  pubDate: entry.pubDate,
  salesPoint: 0,
}));

// pastRecommendations.ts 풀(17권) 중 recommendedBookList와 안 겹치는 11권 — 웹 검색으로 실제
// 제목/저자/출판사/발행일을 확인해 채움(국립중앙도서관 ISBN 서지정보 등으로 교차 확인).
// 표지 이미지는 알라딘이 점검 중이라 확인할 방법이 없어 비워둠 — BookCard가 표지 없으면 책 아이콘으로
// 대체 표시하므로 깨지진 않음. price/itemId/categoryName은 past-recomment 카드에서 표시 안 해서 의미 없는 값.
const pastRecommendationFallback: AladinItem[] = [
  { title: '물고기는 존재하지 않는다', author: '룰루 밀러 (지은이), 정지인 (옮긴이)', cover: '', priceSales: 0, priceStandard: 0, isbn13: '9791189327156', itemId: 900000101, categoryName: '', publisher: '곰출판', pubDate: '2021-12-17', salesPoint: 0 },
  { title: '코스모스', author: '칼 세이건 (지은이), 홍승수 (옮긴이)', cover: '', priceSales: 0, priceStandard: 0, isbn13: '9788983711892', itemId: 900000102, categoryName: '', publisher: '사이언스북스', pubDate: '2006-12-20', salesPoint: 0 },
  { title: '미드나잇 라이브러리', author: '매트 헤이그 (지은이), 노진선 (옮긴이)', cover: '', priceSales: 0, priceStandard: 0, isbn13: '9791191056556', itemId: 900000103, categoryName: '', publisher: '인플루엔셜', pubDate: '2021-03-15', salesPoint: 0 },
  { title: '사피엔스', author: '유발 하라리 (지은이), 조현욱 (옮긴이)', cover: '', priceSales: 0, priceStandard: 0, isbn13: '9788934972464', itemId: 900000104, categoryName: '', publisher: '김영사', pubDate: '2015-11-24', salesPoint: 0 },
  { title: '채식주의자', author: '한강 (지은이)', cover: '', priceSales: 0, priceStandard: 0, isbn13: '9788936434595', itemId: 900000105, categoryName: '', publisher: '창비', pubDate: '2022-10-20', salesPoint: 0 },
  { title: '아몬드', author: '손원평 (지은이)', cover: '', priceSales: 0, priceStandard: 0, isbn13: '9788936456788', itemId: 900000106, categoryName: '', publisher: '창비', pubDate: '2017-03-31', salesPoint: 0 },
  { title: '부의 추월차선', author: '엠제이 드마코 (지은이), 신소영 (옮긴이)', cover: '', priceSales: 0, priceStandard: 0, isbn13: '9791187444725', itemId: 900000107, categoryName: '', publisher: '토트', pubDate: '2022-02-04', salesPoint: 0 },
  { title: '데일 카네기 인간관계론', author: '데일 카네기 (지은이), 임상훈 (옮긴이)', cover: '', priceSales: 0, priceStandard: 0, isbn13: '9791187142560', itemId: 900000108, categoryName: '', publisher: '현대지성', pubDate: '2019-10-07', salesPoint: 0 },
  { title: '린 스타트업', author: '에릭 리스 (지은이), 이창수, 송우일 (옮긴이)', cover: '', priceSales: 0, priceStandard: 0, isbn13: '9788966260577', itemId: 900000109, categoryName: '', publisher: '인사이트', pubDate: '2012-11-12', salesPoint: 0 },
  { title: '아주 작은 습관의 힘', author: '제임스 클리어 (지은이), 이한이 (옮긴이)', cover: '', priceSales: 0, priceStandard: 0, isbn13: '9791162540640', itemId: 900000110, categoryName: '', publisher: '비즈니스북스', pubDate: '2019-02-26', salesPoint: 0 },
  { title: '그릿', author: '앤절라 더크워스 (지은이), 김미정 (옮긴이)', cover: '', priceSales: 0, priceStandard: 0, isbn13: '9791162540633', itemId: 900000111, categoryName: '', publisher: '비즈니스북스', pubDate: '2019-02-20', salesPoint: 0 },
];

// isbn13으로 단건 조회하는 곳(fetchBookDetail)에서 씀 — 목록용 dummyBooks를 그냥 아무거나 대신 넣으면
// 엉뚱한 책이 나와 더 헷갈리므로, 요청한 isbn13과 실제로 같을 때만 대체한다.
export const dummyBooksByIsbn13 = new Map([...dummyBooks, ...pastRecommendationFallback].map((book) => [book.isbn13, book]));

// dummyBooks에도 없는 isbn13(대부분의 "지난 추천 도서")은 이 자리표시자로 대체 — 무한 "불러오는 중…" 방지.
export function placeholderBook(isbn13: string): AladinItem {
  return {
    title: '도서 정보를 일시적으로 불러올 수 없습니다',
    author: '',
    cover: '',
    priceSales: 0,
    priceStandard: 0,
    isbn13,
    itemId: 0,
    categoryName: '',
    publisher: '',
    pubDate: '',
    salesPoint: 0,
  };
}
