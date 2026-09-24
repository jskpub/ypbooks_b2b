# 영풍문고 B2B 임직원 독서 플랫폼 - Coding Convention

**Version:** 1.0 · **Last Updated:** 2026-09-24

> 영풍문고 B2B 임직원 독서 플랫폼 프런트엔드 코드베이스의 일관된 구현 규칙과 패턴을 정리한 문서입니다.

이 문서는 규칙을 새로 정하기 위한 게 아니라, 지금 코드베이스에서 이미 일관되게 지켜지고 있는 걸 그대로 적어둔 것이다. 새 코드를 짤 때는 아래 원칙과 기존 파일들을 함께 참고한다.

이 문서는 **컴포넌트/React/SCSS 작성 규칙**만 다룬다. 웹표준·접근성·ARIA는 [`krds-yp-custom.md`](./krds-yp-custom.md), 색상·타이포·간격 수치는 [`design-system.md`](./design-system.md)를 본다.

## 디렉토리 구조

```
src/
  components/     재사용 컴포넌트. 2개 이상의 페이지/컴포넌트에서 쓰거나, 그 자체로 독립된 단위(Header, Icon 등)
    Header/       한 기능을 이루는 하위 컴포넌트 묶음은 폴더로 그룹화 (Header, BrandBar, Gnb, ...)
  pages/          라우트에 직접 연결되는 최상위 페이지 컴포넌트 (App.tsx의 <Route element>)
  data/           타입 있는 정적/목 데이터 (cartItems.ts, foundationTokens.ts). 컴포넌트 파일에 배열을 직접 박아 넣지 않는다
  scss/          패턴 (abstracts/base/components/layout/pages/themes/utilities/vendors)
  assets/         폰트, 아이콘(svg), 이미지
```

- 표/데이터 양이 많아지면(색상 팔레트, spacing 표 등) 컴포넌트 파일에 직접 작성하지 말고 `data/`에 타입 있는 배열로 분리하고 `.map()`으로 렌더링한다. 값을 옮겨 적다 생기는 실수를 줄이고, 나중에 값만 훑어보기 쉽다.

## SCSS

- **BEM만 쓴다**: `.block`, `.block__element`, `.block--modifier`. SCSS에서는 항상 `&`로 부모 블록 안에 중첩해서 쓴다.
  ```scss
  .card {
    &__title { ... }
    &--sm { ... }
  }
  ```
  부모 밖에 `.card__title { ... }`처럼 따로 떨어뜨려 쓰지 않는다 — 최종 CSS는 같아도, 한 블록에 속한 스타일이 흩어지면 나중에 찾기 어렵다.
- **모디파이어는 반드시 블록과 짝을 이룬다.** `.layout--with-sidebar`처럼 모디파이어 클래스를 블록 없이 단독으로 쓰지 않는다. 그 조합만 쓸 거면 아예 독립된 블록 이름(`.layout-with-sidebar`)으로 짓는다.
- **유틸리티 클래스는 BEM 대상이 아니다.** `.text-h1`, `.icon`, `.sr-only`, `.caption`, `.hide-mo` 같은 건 특정 블록에 속한 게 아니라 여러 컴포넌트가 공통으로 갖다 쓰는 범용 스타일이다. 억지로 `card__text-h1`처럼 만들지 않는다.
- **디자인 토큰(변수)만 쓴다.** hex 코드, px 값을 직접 쓰지 않고 `$color-*`, `$space-*`, `$radius-*`, `$font-size-*` 등 `abstracts/_variables.scss`의 변수를 쓴다. 필요한 토큰이 없으면 새로 hex를 박아 넣지 말고 변수부터 추가한다.
- **상태는 `.is-*` 클래스로 토글한다** (`.is-open`, `.is-active`, `.is-selected`, `.is-disabled`). `:disabled` 같은 네이티브 의사 클래스와 같이 쓸 때도 이 패턴을 따른다.

## 디자인 토큰 갱신 원칙

- 토큰 값의 출처는 Figma다. 정리 문서([`./design-system.md`](./design-system.md))는 참고용이고, 값이 애매하거나 의심되면 문서보다 **Figma의 실제 컴포넌트 인스턴스를 `get_variable_defs`로 직접 확인**한다 — 문서 자체가 Figma 상태와 어긋나 있을 수 있다.
- **Figma 파일이 여러 개면 어느 파일인지부터 확인한다.** 같은 변수 이름(`--radius-sm` 등)이라도 파일마다 값이 다를 수 있다(2026-09-25: 원본 프로젝트 파일과 개인 파일의 `--radius-sm/md/lg`가 서로 달라서 한 번 잘못된 결론을 냈었음). 실제로 작업 중인/링크로 받은 파일 기준으로 확인하고, 예전에 다른 파일에서 확인한 값을 그대로 믿지 않는다.
- 변수명·클래스명·파일 구조는 유지하고 값만 최신화한다. 구조를 바꿔야 할 이유가 있으면(예: 기존 변수 하나가 여러 값으로 쪼개져야 함) 먼저 설명하고 확인받는다.
- 값이 확실하지 않으면 추측해서 채우지 않고 "확인 필요"로 남긴다.

## TypeScript / React

- `tsconfig.json`은 `strict: true`. `any` 대신 명시적 타입을 쓴다.
- 경로는 `@/`(→ `src/`) alias를 쓴다. 깊은 상대경로(`../../../`)를 쓰지 않는다.
- 컴포넌트는 함수형 + named export 없이 `export default function ComponentName() {}` 형태를 따른다 (이 프로젝트 전체가 이 스타일).
- 순수 데모/문서용 요소(스타일가이드 페이지의 체크박스·인풋 샘플 등)는 초기값만 있고 onChange가 없다면 `checked`/`value` 대신 `defaultChecked`/`defaultValue`를 쓴다 — React가 controlled component로 취급해서 경고를 내는 걸 피한다.

## 아이콘 / 이미지

- 이 규칙은 `src/assets/icons/`에 있는 **작은 UI 아이콘 세트**(화살표, 체크, 메뉴 등 Phosphor Icons Regular)에만 적용된다. 로고·사진·일러스트·책 표지 같은 이미지는 여기 해당하지 않고, 지금도 `<img src="...">`(예: `BrandBar.tsx`의 로고)로 직접 쓰고 있다 — 이런 건 계속 그렇게 쓰면 된다.
- 위 UI 아이콘 세트를 쓸 때는 SVG를 직접 import하지 않고 `<Icon name="list" />`(`src/components/Icon.tsx`)를 통해서 쓴다 — `currentColor` 상속과 `aria-hidden`/`focusable` 기본값을 여기서 한 번에 처리한다. 내부적으로는 `?react` 쿼리로 React 컴포넌트처럼 import한다(`vite-plugin-svgr`).
- 이 세트에 새 아이콘이 필요하면 `src/assets/icons/`에 SVG를 추가하고 `Icon.tsx`의 매핑 객체에 등록한다. 세트 밖의 이미지(사진, 커스텀 그래픽 등)는 이 과정을 거칠 필요 없이 필요한 방식으로 추가하면 된다.

## 라우팅

- 새 페이지는 `src/pages/`에 컴포넌트 하나 추가하고 `App.tsx`에 `<Route path="..." element={<... />} />` 한 줄만 추가한다. 헤더/푸터는 `Layout.tsx`가 모든 라우트에 자동으로 씌워주므로 페이지마다 반복해서 넣지 않는다.

---

## 버전 관리

| 버전 | 날짜       | 변경 사항 | 작업자 |
| ---- | ---------- | --------- | ------ |
| 1.0  | 2026-09-22 | 최초 작성 | 김지선 |
