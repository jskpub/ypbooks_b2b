# 영풍문고 B2B 임직원 독서 플랫폼 - 커스텀 KRDS 가이드라인

> **가이드 개요 및 준수 범위**
>
> - 본 문서는 **영풍문고 프로젝트 작업 환경 및 개발 요건**에 맞추어 KRDS(Korea Design System) 코딩 규칙을 커스터마이징한 가이드입니다.
> - 기본적인 **웹 표준 원칙**을 준수하며, 웹 접근성은 프로젝트 범위를 고려하여 **최소한의 기준** 중심으로 검토 및 반영되었습니다.

**Version:** 1.3
**Last Updated:** 2026-09-24
**Accessibility Level:** WCAG 2.1 Level AA

---

## 프로젝트 적용 안내

이 문서는 대한민국 정부 디자인 시스템(KRDS)을 기반으로
**영풍문고 B2B 프로젝트 기준에 맞게 재구성**한 가이드입니다.

KRDS 원칙 중 이 프로젝트와 무관하거나 충돌하는 항목(앱 표준, 모바일 브레이크포인트,
컬러·타이포·간격 수치 등)은 제거 또는 위임 처리되었습니다.

이 문서는 웹 표준, 접근성, 마크업 원칙만을 다룹니다.

---

## 이 문서의 사용 범위

| 항목                           | 참조 문서                                                                 |
| ------------------------------ | ------------------------------------------------------------------------- |
| 색상·타이포·간격·레이아웃 수치 | [`design-system.md`](./design-system.md) (Figma 디자인 시스템 기준)       |
| 웹표준·접근성·HTML 구조·ARIA   | 이 문서                                                                   |
| 컴포넌트/React/SCSS 작성 규칙  | [`coding-convention.md`](./coding-convention.md)                          |
| SCSS 변수 실제 구현            | [`src/scss/abstracts/_variables.scss`](../scss/abstracts/_variables.scss) |

> 색상·타이포·간격 수치가 이 문서와 다르면 **`design-system.md`가 우선**합니다.

---

## 1. 기본 원칙

### 1-1. 단순성과 명확성

- 불필요한 시각적 요소 제거
- 계층 구조가 명확한 정보 구성
- 사용자의 의도를 방해하지 않는 디자인

### 1-2. 포용성 (Inclusive by default)

- 노안·저시력 사용자를 "우선 고려 대상"으로 설계
- 색상만으로 정보 전달 금지
- 충분한 색상 대비율 확보 (최소 4.5:1)

### 1-3. 한글 최적화

- 한글 가독성을 고려한 행간과 자간 (자간은 기본 0)
- Pretendard GOV로 통일된 한글 웹폰트
- 제목과 본문의 명확한 시각적 구분

---

## 2. 문서 구조 / 랜드마크

- 페이지에는 `<header>`, `<nav>`, `<main>`, `<footer>` 랜드마크를 반드시 포함한다.
- `<main>`에는 고유 `id="main"`을 부여하고, 페이지당 하나만 존재한다.
- 제목 레벨(`h1`~`h4`)은 건너뛰지 않고 순서대로 사용한다. 페이지당 `h1`은 하나.

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="페이지 설명" />
    <title>페이지 제목 | 영풍문고 B2B</title>
  </head>
  <body>
    <a href="#main" class="skip-nav">본문 바로가기</a>

    <header role="banner">
      <nav aria-label="메인 네비게이션">
        <!-- 네비게이션 -->
      </nav>
    </header>

    <main id="main">
      <h1>페이지 제목</h1>
      <!-- 콘텐츠 -->
    </main>

    <footer role="contentinfo">
      <!-- 푸터 -->
    </footer>
  </body>
</html>
```

---

## 3. 건너뛰기 링크 (Skip Navigation)

- `<body>` 최상단, 첫 포커스 가능 요소로 배치한다.
- 평소에는 시각적으로 숨기되(`.skip-nav`), 키보드 포커스 시 반드시 화면에 노출한다.
- `href="#main"`으로 본문 랜드마크로 바로 이동시킨다.

```html
<a href="#main" class="skip-nav">본문 바로가기</a>
```

```scss
.skip-nav {
  position: absolute;
  top: -100%;
  left: 0;

  &:focus {
    top: 0;
  }
}
```

---

## 4. GNB / 현재 위치 표시

- 현재 페이지에 해당하는 메뉴 링크에 `aria-current="page"`를 부여한다.
- 시각적 상태 클래스(강조 색상 등)는 `aria-current`와 함께 적용한다 — 색상만으로 구분 금지.
- 모바일 햄버거 버튼은 `aria-expanded`(열림/닫힘 상태)와 `aria-controls`(대상 목록의 id)를 연결한다.

```html
<!-- 현재 페이지 표시 -->
<nav aria-label="메인 네비게이션">
  <ul>
    <li><a href="/dashboard" aria-current="page">대시보드</a></li>
    <li><a href="/orders">주문 관리</a></li>
  </ul>
</nav>

<!-- 햄버거 버튼 -->
<button aria-expanded="false" aria-controls="mobile-nav" aria-label="메뉴 열기">
  <svg aria-hidden="true"><!-- 햄버거 아이콘 --></svg>
</button>
<ul id="mobile-nav">
  <!-- 메뉴 목록 -->
</ul>
```

---

## 5. 포커스 · 키보드 접근성

- 모든 인터랙티브 요소(`a`, `button`, `input` 등)는 키보드로 도달·조작 가능해야 한다.
- 포커스 인디케이터를 `outline: none`으로 제거하지 않는다. 커스텀 스타일을 쓰더라도 시각적으로 명확해야 한다.
- 커스텀 토글(햄버거, 아코디언 등)은 `button` 요소로 만들거나, `div`/`span`을 쓸 경우 `role`, `tabindex`, 키보드 이벤트를 모두 구현한다.
- 탭 순서: 좌→우, 상→하 (DOM 순서와 시각 순서 일치)
- `Esc` 키로 모달/드롭다운 닫기
- 모달 오픈 시 첫 포커스 가능 요소로 자동 이동, 닫히면 트리거 버튼으로 복귀 (포커스 트랩)

> 주의: `outline: none` 사용은 KRDS 접근성 원칙 위반

---

## 6. 색상 대비

| 대상                                      | 최소 대비율 |
| ----------------------------------------- | ----------- |
| 일반 텍스트 (17px, 400)                   | 4.5:1 이상  |
| 큰 텍스트 (19px Bold 이상 또는 24px 이상) | 3:1 이상    |
| UI 컴포넌트 경계선                        | 3:1 이상    |

- 색상만으로 상태(성공/실패/필수 등)를 전달하지 않는다. 아이콘, 텍스트, 패턴 등을 함께 사용한다.

---

## 7. 이미지 · 폼

### 7-1. 이미지

```html
<!-- 의미 있는 이미지 -->
<img src="logo.svg" alt="영풍문고 로고" />

<!-- 장식용 이미지 -->
<img src="divider.svg" alt="" />

<!-- 아이콘만 있는 버튼 -->
<button aria-label="검색하기">
  <svg aria-hidden="true"><!-- 검색 아이콘 --></svg>
</button>

<!-- 잘못된 alt 예시 -->
<img src="logo.svg" alt="이미지" />
```

### 7-2. 폼

```html
<!-- 올바른 폼 구조 -->
<label for="email"> 이메일 <span aria-hidden="true">*</span> </label>
<input id="email" type="email" required aria-required="true" aria-describedby="email-error" />
<span id="email-error" role="alert" aria-invalid="true"> 올바른 이메일 형식을 입력하세요. </span>

<!-- 잘못된 예시: label 없는 입력 -->
<input placeholder="이메일" />
```

- 모든 폼 입력에는 `<label for="...">` 또는 `aria-label`을 연결한다.
- 필수 항목은 시각적 + `aria-required="true"` 모두 표시한다.
- 오류 메시지는 `aria-describedby`로 필드와 연결한다.
- 오류 발생 시 포커스를 첫 오류 필드로 자동 이동한다.

---

## 8. ARIA 사용

| 속성               | 용도                 | 예시                                             |
| ------------------ | -------------------- | ------------------------------------------------ |
| `aria-label`       | 요소 설명            | `<button aria-label="메뉴 닫기">x</button>`      |
| `aria-describedby` | 상세 설명            | `<input aria-describedby="hint-1" />`            |
| `aria-live`        | 동적 업데이트        | `<div aria-live="polite">로딩 중...</div>`       |
| `aria-hidden`      | 스크린 리더에서 숨김 | `<span aria-hidden="true">-></span>`             |
| `aria-invalid`     | 유효성 오류          | `<input aria-invalid="true" />`                  |
| `aria-current`     | 현재 위치            | `<a aria-current="page">대시보드</a>`            |
| `aria-expanded`    | 열림/닫힘 상태       | `<button aria-expanded="false">메뉴</button>`    |
| `aria-controls`    | 제어 대상 연결       | `<button aria-controls="nav-list">메뉴</button>` |
| `role`             | 역할 명시            | `<div role="alert">오류 메시지</div>`            |

```html
<!-- 피해야 할 패턴 -->
<div onclick="...">클릭하기</div>
<a onclick="...">이동</a>
```

---

## 9. 레이아웃 원칙

> 이 프로젝트의 실제 디자인 소스(Figma node 1184:216)는 **1280px 고정 데스크톱 전용**이며
> "모바일은 MVP 범위 밖"입니다.
> 구체적인 수치는 [design-system.md](./design-system.md)를 따릅니다.

- 12컬럼 그리드 기반, `max-width: 1280px` 중앙 정렬
- 반응형을 구현해야 하는 경우 모바일 퍼스트(`min-width` 미디어 쿼리)로 작성한다.
- 컴포넌트 상태는 반드시 모두 정의한다.

```
Default → Hover → Active → Focus → Disabled
```

---

## 10. 인터액션 원칙

> 애니메이션 타이밍 수치는 `design-system.md`를 따릅니다.

### 10-1. Easing 함수

```css
/* 기본 */
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

/* 엔트리 */
transition-timing-function: cubic-bezier(0, 0, 0.2, 1);

/* 엑시트 */
transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
```

### 10-2. 모션 감소 대응

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. 타이포그래피 원칙

> 폰트 크기·행간·웨이트 수치는
> [design-system.md](./design-system.md)를 단일 출처로 사용합니다.

- 12px 미만 사용 금지 (WCAG 접근성 원칙)
- 한글 본문에 음수 자간 적용 금지
- 본문 행간 1.5 미만 사용 금지
- 브라우저 200% 확대 시 콘텐츠 손실 없이 리플로우 되어야 함
- 최대 66~80자/줄 권장 (가독성)

## 12. 체크리스트

새 페이지/컴포넌트를 만들 때 이 정도만 확인한다. 성능·SEO·QA는 이 문서 범위 밖이라 뺐다.

- [ ] 랜드마크(`header`/`main`/`footer`) 있고, `<main id="main">`은 페이지당 하나, `h1`도 하나
- [ ] 아이콘 전용 버튼에 `aria-label`
- [ ] 포커스 표시 있음 (`outline: none` 안 씀)
- [ ] 폼 입력마다 `label` 연결
- [ ] 색상만으로 정보·상태를 전달하지 않음

---

## 13. 버전 관리

| 버전 | 날짜       | 변경 사항                                                                                                            | 작성자 |
| ---- | ---------- | -------------------------------------------------------------------------------------------------------------------- | ------ |
| 1.0  | 2026-09-22 | 최초 작성                                                                                                            | 김지선 |
| 1.1  | 2026-09-22 | Pretendard GOV 적용, KRDS 토큰 반영, 행간·자간 규칙 세분화                                                           | 김지선 |
| 1.1  | 2026-09-23 | 영풍문고 B2B 프로젝트 기준으로 수정                                                                                  | 김지선 |
| 1.2  | 2026-09-24 | 두 문서 통합·중복 제거, 수치 위임 처리, 앱 표준 제거, 프로젝트 안내 추가                                             | 김지선 |
| 1.3  | 2026-09-24 | 체크리스트를 웹표준·접근성 최소 항목으로 축소(성능/SEO/QA 항목 제거), 남은 문서 링크 정리, 섹션 번호(13번 누락) 정리 |        |
