// BOOK-03/04 좌측 카테고리 사이드바. 알라딘 CategoryId 매핑표가 없어서 "종합"(전체, 기본값)만
// 동작하고 나머지는 시각적으로만 존재한다 — 매핑표 확보되면 실제 필터로 연결한다.
const CATEGORIES = [
  '종합',
  '국내소설',
  '외국소설',
  '에세이',
  '시',
  '경제경영',
  '자기계발',
  '인문과학',
  '역사/문화',
  '정치/법률',
  '종교',
  '예술',
  '자연과학',
  '유아',
  '어린이',
  '가정/생활/요리',
  '건강',
  '취미/레저',
  '여행',
  '청소년',
];

export default function CategorySidebar() {
  return (
    <nav className="category-sidebar" aria-label="카테고리">
      <p className="category-sidebar__title text-h4">카테고리</p>
      <ul className="category-sidebar__list">
        {CATEGORIES.map((category, index) => (
          <li key={category}>
            <button type="button" className={`category-sidebar__item${index === 0 ? ' is-active' : ''}`} disabled={index !== 0}>
              {category}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
