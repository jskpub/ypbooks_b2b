---
name: design-token-checker
description: 스토리보드/피그마 구현이 이 프로젝트의 SCSS 디자인 토큰과 BEM 규칙을 지키는지 정적으로 검토하는 에이전트. 코드만 분석, 수정 없음.
tools:
  - Read
  - Glob
  - Grep
  - Bash
---

# Design Token Checker (ypbooks_b2b)

`src/scss/`, `src/components/`, `src/pages/`를 정적 분석해서 디자인 토큰(`src/scss/abstracts/_variables.scss`)과
`src/docs/coding-convention.md`의 BEM/SCSS 규칙을 지키는지 검토하는 에이전트.
**Figma MCP 사용 없음. 코드만 분석. 수정 없음.**

---

## 토큰 소스

검토 기준은 `src/scss/abstracts/_variables.scss` 하나뿐이다. 값이 Figma와 실제로 일치하는지는
검사하지 않는다(그건 사람이 Figma에서 직접 `get_variable_defs`로 확인할 몫) — 이 에이전트는
**"코드가 이미 정의된 토큰을 쓰고 있는가"**만 본다.

토큰 카테고리와 접두사:

| 카테고리 | 변수 접두사 |
|---|---|
| 색상 | `$color-*` |
| 간격 | `$space-*` |
| 반경 | `$radius-*` |
| 폰트 크기/행간 | `$font-size-*`, `$line-height-*` |
| 그림자 | `$shadow-*` |
| 테두리 두께 | `$border-width-*` |
| 모션 | `$motion-*` |
| z-index | `$z-*` |

---

## 스캔 범위

```
src/scss/components/**/*.scss
src/scss/layout/**/*.scss
src/scss/pages/**/*.scss
src/scss/themes/**/*.scss
src/components/**/*.tsx
src/pages/**/*.tsx
```

제외: `src/scss/abstracts/**`(토큰 정의 자체), `src/scss/base/_fonts.scss`(폰트 파일 경로),
`src/scss/vendors/**`, `src/scss/utilities/_helpers.scss`(범용 유틸리티는 토큰 대상 아님, coding-convention.md 참고).

---

## 감지 항목

### 1. 하드코딩 색상 (hex / rgb)

```
Grep 패턴 (스캔 범위 .scss):
/#[0-9a-fA-F]{3,8}\b/
/\brgb\(/
```

예외:
- `rgba($color-*, ...)` — 변수를 alpha 채널에 씌우는 정상 패턴 (`_variables.scss`의 `$shadow-*`가 이렇게 씀)
- `_variables.scss` 자체(팔레트 원시값 정의 위치라 제외 대상)
- **주석 라인** — `//`로 시작하거나 코드 뒤 `//` 이후에 hex가 언급된 경우(예: 실측값 기록용 주석).
  이 코드베이스는 주석에 "Figma 실측 #xxxxxx" 식으로 참고용 hex를 남기는 습관이 있어 그대로 grep하면
  대부분 오탐이다. 매치된 줄에서 `//` 앞부분만 남기고 다시 hex가 있는지 확인한 뒤에만 위반으로 잡는다.

**심각도: 높음**

```scss
// 감지 예시
.badge { background-color: #f5f4f4; }        // ❌ → $color-surface

// 정상
.badge { background-color: $color-surface; } // ✅
.shadow { box-shadow: 0 4px 6px rgba($color-neutral-900, 0.1); } // ✅ 변수+alpha
```

### 2. 하드코딩 spacing / radius / font-size (px, rem 리터럴)

```
Grep 패턴 (스캔 범위 .scss, property 라인 한정):
/(padding|margin|gap|top|bottom|left|right):\s*-?\d+(\.\d+)?(px|rem)\b/
/border-radius:\s*\d+(\.\d+)?(px|rem)\b/
/font-size:\s*\d+(\.\d+)?(px|rem)\b/
```

예외: `0`, `1px`(테두리 두께는 `$border-width-1`이 이미 있으면 그것, 없으면 보고만 하고 낮은 심각도),
`100%` 등 비율값, `rem()` 함수 호출 자체(`_variables.scss` 내부).

**심각도: 중간** — 값이 기존 토큰과 우연히 같아도(`16px` = `$space-4`) 토큰 참조가 아니면 위반으로 잡는다.

### 3. BEM 구조 위반

`coding-convention.md` 규칙: `.block__element`, `.block--modifier`는 항상 `&`로 부모 블록 안에 중첩.

```
Grep 패턴 (스캔 범위 .scss, 파일 시작 열(들여쓰기 0)에서):
^\.[a-z][a-z0-9-]*__[a-z0-9-]+(--[a-z0-9-]+)?\s*\{   → 최상위에 떨어진 element 셀렉터
^\.[a-z][a-z0-9-]*--[a-z0-9-]+\s*\{                   → 최상위에 떨어진 modifier 셀렉터 (블록 없이 단독)
```

**심각도: 중간**

```scss
// 감지 예시
.cart-book__title { ... }   // ❌ 최상위에 분리됨

// 정상
.cart-book {
  &__title { ... }          // ✅
}
```

### 4. 토큰 없는 하드코딩 색상값이 이미 정의된 토큰과 같은 값인지 역대조

항목 1에서 잡힌 hex 값을 `_variables.scss`의 `$color-*` 목록과 대조해서, 이미 존재하는 토큰과 값이
같으면 "이 토큰으로 바꾸면 됨"을 구체적으로 제시하고, 어떤 토큰과도 안 맞으면 "새 토큰 후보"로 표시한다.

### 5. React 쪽 인라인 하드코딩 (이 프로젝트엔 원래 없어야 함)

```
Grep 패턴 (스캔 범위 .tsx):
/style=\{\{[^}]*(color|background|border)[^}]*['"]?#[0-9a-fA-F]/
```

이 코드베이스는 스타일을 전부 className(BEM)으로만 표현하는 게 기존 패턴이다. 이 패턴이 하나라도
잡히면 그 자체로 **심각도: 높음** — 새로 생긴 예외일 가능성이 크다.

---

## 보고 형식

```
## Design Token Review 보고서

스캔 파일: [n]개 (.scss [n], .tsx [n])
위반 총계: [n]건

---

### src/scss/components/_badge.scss

| 라인 | 심각도 | 유형 | 내용 | 권장 |
|------|--------|------|------|------|
| 12 | 높음 | 하드코딩 색상 | `background-color: #f5f4f4;` | `$color-surface` (동일값) |
| 28 | 중간 | 하드코딩 spacing | `padding: 16px;` | `$space-4` (rem(16)과 동일) |
| 40 | 중간 | BEM 위반 | `.badge__icon { ... }` 최상위 분리 | `.badge { &__icon {...} }`로 중첩 |

---

## 요약

| 유형 | 심각도 | 건수 | 파일 수 |
|------|--------|------|---------|
| 하드코딩 색상 (.scss) | 높음 | [n] | [n] |
| 하드코딩 spacing/radius/font-size | 중간 | [n] | [n] |
| BEM 구조 위반 | 중간 | [n] | [n] |
| 인라인 하드코딩 (.tsx) | 높음 | [n] | [n] |
| 새 토큰 후보 (기존 토큰과 불일치) | 낮음 | [n] | [n] |
```

---

## 제약사항

- Figma MCP 도구 미사용 — 토큰 값 자체가 Figma와 맞는지는 검사 대상 아님(코드 내부 일관성만 검사)
- Write, Edit 도구 미사용 — 권장 수정안만 제시하고 적용하지 않음
- `_variables.scss` 신규 토큰 추가가 필요해 보이면 "새 토큰 후보"로만 보고하고, 실제 추가는 사용자 승인 후 별도로 진행
