---
name: yp-design-system
version: "1.0"
source: code
---

# YP 디자인 시스템 (코드 기준)

영풍문고 B2B 독서복지 플랫폼의 화면을 같은 기준으로 만들기 위한 디자인 시스템입니다. 임직원이 회사 지원금으로 도서를 고르고 결제하는 흐름에 필요한 요소를 담았습니다.

이 문서와 짝을 이루는 Figma 파일: [YP 디자인 시스템 (코드 기준)](https://www.figma.com/design/Qubd0su49qOLX7S2j83GiA) — 페이지 구성(v2 Overview / v2 Foundations / v2 Components / v2 Patterns / v2 Icons)과 표기 방식이 이 문서와 동일합니다.

> **핵심 원칙**: 이 문서의 모든 토큰·컴포넌트·값은 현재 코드베이스(`src/scss`, `src/components`)에서 추출했습니다. 과거 참고한 Figma 파일이나 `src/docs/design-system.md`(alpha, 기존 문서)의 구조·표기 방식만 참고했고 값은 가져오지 않았습니다. 코드와 다른 문서가 충돌하면 이 문서는 항상 코드를 따릅니다.

## 목차

1. [소개 / 범위 / 원칙](#소개--범위--원칙)
2. [Foundations](#foundations)
3. [Components](#components)
4. [Patterns](#patterns)
5. [Icons](#icons)
6. [제외 요소 (참고 Figma에는 있었지만 이 문서에는 없는 것)](#제외-요소)
7. [변경 이력](#변경-이력)

---

## 소개 / 범위 / 원칙

### 범위

| 구분 | 내용 |
|---|---|
| Foundations | 색, 타이포그래피, 간격과 모서리, 그리드, 인터랙션, 모션 + 코드 전용(Border Width, Shadow, Z-Index) |
| Components | 24개 — Action, Selection and Input, Content, Feedback, Navigation, Utility(코드 전용 카테고리) |
| Patterns | 9개 — Subsidy Summary, Book Card, Picked Book, Book List, Cart Row, Payment Sidebar, Login Form, Order Complete, Subsidy Limit Card |
| 포함하지 않는 것 | 다크 모드(코드 미구현, `_dark.scss` 사실상 빈 파일) / 1280px 미만 반응형(코드가 데스크톱 고정, `_breakpoints.scss` 주석) |

### 사용 전 안내

- **폰트**: 한글 기준 Pretendard GOV. 코드 실사용 웨이트는 Regular(400) / Medium(500) / Bold(700) 3종뿐입니다(`_variables.scss` 주석).
- **아이콘**: `src/components/Icon.tsx` 기준 39개. Phosphor Icons 여부는 코드에서 확인할 수 없습니다.
- **변수 이름**: 코드는 CSS 커스텀 프로퍼티(`--color-*` 등) 없이 SCSS `$변수`만 사용합니다(확인 완료 — `--color-` 문자열은 주석 1줄에만 등장). 이 문서와 Figma 파일 모두 "CSS 변수" 대신 "SCSS 변수"로 표기합니다. 대표적인 대응은 아래와 같습니다.

| Figma 변수 | SCSS 변수 | 코드 상태 |
|---|---|---|
| surface/brand | `$color-primary` | 있음 |
| surface/brand-hover | `$color-primary-hover` | 있음 |
| text/primary | `$color-foreground` | 있음 |
| border/default | `$color-border` | 있음 |
| focus-ring | `$color-focus-ring` | 있음 |
| bookmark/gray | `$color-bookmark-gray` | 있음 (7색 전용) |

전체 대응표는 [Foundations — Color](#color--semantic)에 있습니다.

### 원칙 (코드 주석 근거)

- **브랜드 색은 하나** — `$color-primary`(빨강)만 강조색으로 씁니다.
- **그림자는 2종만** — `$shadow-floating`, `$shadow-lg` 외 신규 그림자 추가 금지(`_variables.scss` 주석).
- **상태는 아이콘 모양으로** — Alert의 4개 tone은 배경·테두리·제목색이 모두 같고 아이콘 모양으로만 구분합니다(`_alert.scss` 주석).

---

## Foundations

### Color — Atomic

원본 색상 값입니다. 화면과 컴포넌트는 이 값을 직접 참조하지 않고 Semantic을 거쳐 씁니다. (`src/scss/abstracts/_variables.scss`)

| Family | 값 |
|---|---|
| neutral | 0:`#ffffff` 50:`#fafafa` 100:`#f5f4f4` 200:`#e9e7e8` 300:`#d6d3d4` 400:`#aba6a7` 500:`#948f90` 550:`#6f696b` 600:`#555152` 700:`#3d3b3b` 900:`#191818` |
| red | 50:`#ffeeed` 100:`#fdd9d8` 300:`#f47d7b` 500:`#e01e1a` 600:`#c61a17` 700:`#aa1714` |
| green | 50:`#eaf7ef` 500:`#1c8a4b` 600:`#157a40` |
| blue | 500:`#2563eb` 700:`#1d4fbf` |
| teal / orange / purple / pink | 각 1단계만 존재 — teal-700:`#0f766e` orange-700:`#b54708` purple-700:`#7e22ce` pink-700:`#be185d` (Bookmark Chip 7색 전용, 다단계 팔레트 없음) |

### Color — Semantic

용도로 이름 붙인 색입니다. 컴포넌트는 이 이름만 참조합니다. **대비**는 흰 배경(#ffffff) 대비 WCAG 공식으로 직접 계산했습니다(텍스트/아이콘으로 쓰이는 토큰만 표기, 배경·테두리 전용은 `-`).

#### Text — 글자 색

| Figma 변수 | SCSS 변수 | 값 | 용도 | 대비 |
|---|---|---|---|---|
| text/primary | `$color-foreground` | #191818 | 본문 텍스트 | 17.72:1 |
| text/secondary | `$color-foreground-secondary` | #555152 | 보조 텍스트 | 7.82:1 |
| text/tertiary | `$color-muted` | #6f696b | 흐린 텍스트/아이콘 | 5.37:1 |
| text/disabled | `$color-disabled-text` | #aba6a7 | 비활성 텍스트 | 2.40:1 |
| text/on-brand | `$color-on-primary` | #ffffff | primary 위 텍스트 | 1.00:1 |
| text/on-brand-subtle | `$color-on-primary-soft` | #aa1714 | primary-soft 위 텍스트 | 7.39:1 |
| text/link | `$color-link` | #c61a17 | 링크 | 5.90:1 |

#### Surface — 배경색

| Figma 변수 | SCSS 변수 | 값 | 용도 |
|---|---|---|---|
| surface/page | `$color-canvas` | #fafafa | 페이지 배경 |
| surface/sunken | `$color-surface` | #f5f4f4 | 표면(옅은 배경) |
| surface/card | `$color-surface-card` | #ffffff | 카드/입력 표면 |
| surface/brand | `$color-primary` | #e01e1a | 브랜드 CTA |
| surface/brand-hover | `$color-primary-hover` | #c61a17 | 코드에서 확인 불가(hover 상세) |
| surface/brand-pressed | `$color-primary-pressed` | #aa1714 | 코드에서 확인 불가 |
| surface/brand-subtle | `$color-primary-soft` | #ffeeed | 코드에서 확인 불가 |

#### Border

| Figma 변수 | SCSS 변수 | 값 | 용도 |
|---|---|---|---|
| border/default | `$color-border` | #e9e7e8 | 기본 테두리 |
| border/strong | `$color-border-strong` | #d6d3d4 | 강조 테두리 |
| border/control | `$color-border-control` | #6f696b | 폼 컨트롤 테두리 |
| border/brand | `$input-border-focus` | #e01e1a | 입력 포커스 테두리(포커스링과 별개) |
| focus-ring | `$color-focus-ring` | #2563eb | 모든 인터랙티브 요소 공통 |

#### State / Progress / Bookmark / Subsidy

| Figma 변수 | SCSS 변수 | 값 | 용도 | 대비 |
|---|---|---|---|---|
| state/danger | `$color-danger` | #aa1714 | 오류(대비 확보용 700) | 7.39:1 |
| state/danger-bg | `$color-danger-soft` | #ffeeed | 코드에서 확인 불가 | - |
| state/danger-border | `$color-danger-border` | #fdd9d8 | 코드에서 확인 불가 | - |
| progress/default | `$color-progress-default` | #f9acaa | 지원금 게이지 여유 | - |
| progress/warning | `$color-progress-warning` | #f47d7b | 한도 임박 | - |
| progress/full | `$color-progress-full` | #e01e1a | 한도 소진 | - |
| bookmark/gray..pink (7색) | `$color-bookmark-*` | 각 원본 참고 | 책갈피 칩 전용, 7색 외 사용 금지 | 5.40~11.13:1 |
| subsidy/company | `$color-subsidy-company` | #157a40 | 회사 지원금 금액 | 5.40:1 |
| subsidy/company-bg | `$color-subsidy-company-soft` | #eaf7ef | 코드에서 확인 불가 | - |
| subsidy/company-icon | `$color-subsidy-company-icon` | #1c8a4b | 코드에서 확인 불가 | 4.39:1 |
| subsidy/employee | `$color-subsidy-employee` | #191818 | 본인 부담금 금액 | 17.72:1 |
| subsidy/employee-bg | `$color-subsidy-employee-soft` | #f5f4f4 | 코드에서 확인 불가 | - |

### Typography

한글 기준 폰트는 Pretendard GOV. 20개 스타일, 샘플은 실제 렌더링 스타일.

| 스타일 | 샘플 | 크기/행간 | 굵기 | 용도 |
|---|---|---|---|---|
| v2/Display/Large | 도서 제목 | 32/42 | Bold | 추천 픽 도서 제목 |
| v2/Display/Base | 추천 주제 제목 | 28/36 | Bold | 추천 영역 제목 |
| v2/Heading/H1 | 나의 지원금 | 26/34 | Bold | 페이지 제목 |
| v2/Heading/H2 | 결제 정보 | 22/30 | Bold | 섹션 제목 |
| v2/Heading/H3 | 회사 지원금 | 20/28 | Medium | 카드 제목, 항목 제목 |
| v2/Heading/H4 | 도서 정보 | 17/24 | Medium | 도서명, 목록 제목 |
| v2/Body/Large | 도서 가격의 50%(최대 10,000원)까지 회사가 지원합니다. | 18/28 | Regular | 강조 본문, 안내 문장 |
| v2/Body/Base | 이 책은 나에게 필요한 이야기를 담고 있습니다. | 17/26 | Regular | 기본 본문 |
| v2/Body/Small | 신청 기간 내에만 도서 신청 취소가 가능합니다. | 15/24 | Regular | 보조 설명, 표 본문 |
| v2/Body/XSmall | 월 1권, 신청자 한정으로 제공됩니다. | 13/20 | Regular | 보조 설명, 표 본문 |
| v2/Label/Large | 장바구니 담기 | 16/24 | Medium | 버튼 라벨 |
| v2/Label/Base | 추천도서 | 14/20 | Medium | 배지, 탭, 입력 라벨 |
| v2/Label/Small | CEO 픽 | 12/16 | Bold | 리본, 작은 태그 |
| v2/Caption/Base | 2026.09.19 구매 | 12/18 | Regular | 날짜, 도움말 |
| v2/Caption/Strong | 잔여 한도 1건 | 12/18 | Bold | 상태 강조 캡션 |
| v2/Caption/Large | 출간일 · 카테고리 | 14/20 | Regular | 도서 메타 정보 |
| v2/Caption/LargeStrong | 평점 4.5 | 14/20 | Bold | 평점 등 강조 메타 |
| v2/Numeric/PriceLarge | 15,000원 | 22/28 | Bold | 최종 결제 금액 |
| v2/Numeric/Price | 9,000원 | 17/24 | Bold | 도서 가격 |
| v2/Numeric/PriceSmall | 9,000원 | 15/22 | Bold | 도서 가격 |

### Spacing and Radius

| 변수 | 값 | SCSS 변수 | 용도 |
|---|---|---|---|
| space-1 | 4px | `$space-1` | 아이콘과 라벨 사이 |
| space-2 | 8px | `$space-2` | 배지 안쪽, 촘촘한 간격 |
| space-3 | 12px | `$space-3` | 입력 안쪽 세로 |
| space-4 | 16px | `$space-4` | 컴포넌트 안쪽 기본 |
| space-5 | 20px | `$space-5` | 화면 좌우 여백 |
| space-6 | 24px | `$space-6` | 카드 안쪽, 묶음 사이 |
| space-8 | 32px | `$space-8` | 섹션 안쪽 구획 |
| space-10 | 40px | `$space-10` | 큰 블록 사이 |
| space-12 | 48px | `$space-12` | 페이지 구획 |
| space-16 | 64px | `$space-16` | 페이지 위아래 여백 |

| Radius | 값 | 용도 |
|---|---|---|
| radius-xs | 2px | 체크 표시 등 초소형 (참고 Figma엔 없던 코드 전용 단계) |
| radius-sm | 4px | 입력, 체크박스, 소형 버튼, 툴팁 |
| radius-md | 6px | 버튼, 알림, 입력 그룹, 카드 표지 |
| radius-lg | 10px | 카드, 모달 |
| radius-full | 999px | 배지, 칩, 지원금 버튼 |

### Grid

데스크톱 1280px 고정, 반응형 미지원. 결제 사이드바는 320px 고정, 나머지를 본문이 채웁니다.

| 항목 | 값 | SCSS 변수 |
|---|---|---|
| 최소/최대 너비 | 1280px | `$layout-min-width` / `$layout-max-width` |
| 좌우 여백 | 20px | `$layout-padding` |
| 컬럼 | 12컬럼 | `$layout-columns` |
| 거터 | 24px | `$layout-gutter` |
| 결제 사이드바 | 320px 고정 | `$layout-sidebar-width` |
| 읽기 전용 콘텐츠 최대 너비 | 960px | `$layout-reading-max-width`(코드 전용 추가) |

### Interaction

요소의 상태는 색으로만 알립니다. Secondary 버튼을 기준으로 정리했습니다(`_button.scss`).

| 상태 | 표현 | SCSS 변수 | 적용 |
|---|---|---|---|
| Default | 흰 배경, neutral-550 테두리 | `$color-surface-card` / `$color-border-control` | 기본 상태 |
| Hover | 배경이 옅은 회색으로 | `$color-surface` | 마우스를 올렸을 때 |
| Pressed | 배경이 한 단계 더 진한 회색으로 | `$color-border` | 누르고 있는 동안 |
| Focus | 2px 포커스 링, 2px 띄움 | `$color-focus-ring` | 키보드로 이동했을 때 |
| Disabled | 옅은 회색 배경/테두리, 비활성 텍스트 | `$color-surface` / `$color-disabled-text` | 누를 수 없는 상태 |

> Primary 버튼은 코드상 Hover 배경색 변경이 정의되어 있지 않습니다(`transition`만 선언, `_button.scss` 확인). 흔한 가정과 달리 실제로는 색이 바뀌지 않습니다 — 참고 Figma는 이 상태표를 Primary 기준으로 삼았지만, 코드 사실과 맞추기 위해 이 문서는 Secondary를 기준으로 삼았습니다.

### Motion

| 이름 | 값 | SCSS 변수 | 용도 |
|---|---|---|---|
| fast | 150ms ease-out | `$motion-fast` | 색, 테두리 전환 |
| base | 250ms ease-out | `$motion-base` | 아코디언 열림, 게이지 채움, 모달 표시, 메가메뉴 |
| spin | 800ms linear 무한반복 | `$motion-spin` | Spinner 회전(회전을 쓰는 유일한 예외) |

Spinner는 `prefers-reduced-motion` 대응이 코드에 구현되어 있습니다(`_spinner.scss`). 다른 컴포넌트의 대응 여부는 코드에서 확인 불가.

### Border Width, Shadow, Z-Index (코드 전용 — 참고 Figma에는 없던 섹션)

| Border Width | 값 | 용도 |
|---|---|---|
| `$border-width-1` | 1px | 기본 테두리 |
| `$border-width-2` | 2px | 포커스 상태 테두리 등 |

| Shadow | 값 | 용도 |
|---|---|---|
| `$shadow-floating` | `0 4px 6px rgba(neutral-900, 0.1)` | Side Button 등 |
| `$shadow-lg` | `0 16px 40px rgba(neutral-900, 0.16)` | 모달 |

| Z-Index | 값 | 비고 |
|---|---|---|
| `$z-go-to-top` | 30 | |
| `$z-category-menu-backdrop` | 40 | 헤더보다 아래 |
| `$z-header` | 41 | |
| `$z-header-sticky` | 42 | |
| `$z-category-menu-panel` | 43 | |
| `$z-toast` | 50 | 최상위 |

---

## Components

24개, 6개 카테고리. 각 항목의 출처 SCSS 파일은 `src/scss/components/` 기준입니다.

### Action

| 컴포넌트 | 설명 | 출처 |
|---|---|---|
| Button | Primary/Secondary/Tertiary/Danger × Large/Medium/Small × 5 state | `_button.scss` |
| Side Button | 가로 캐러셀 좌우 원형 이전/다음 버튼(50px, sm 28px) | `_side-button.scss` |
| Subsidy Button | 지원금 적용 토글(Apply/Applied/Exhausted) | `_subsidy-button.scss` |

### Selection and Input

| 컴포넌트 | 설명 | 출처 |
|---|---|---|
| Checkbox | 20px, appearance:none 커스텀 렌더링 | `_form.scss` |
| Radio | 18px, accent-color 사용 | `_form.scss` |
| Input | 높이 44px 고정, Default/Focus/Error × Empty/Filled | `_form.scss` |
| Select | Input과 동일 구조 + caret-down 배경 이미지 | `_form.scss` |
| Textarea | min-height 96px, 세로만 리사이즈 | `_form.scss` |
| Stepper | Default/Minimum(최소수량 1)/Disabled | `_stepper.scss` |

### Content

| 컴포넌트 | 설명 | 출처 |
|---|---|---|
| Bookmark Chip | 추천 주체 구분용 7색 고정 칩 | `_bookmark-chip.scss` |
| Badge | Recommended/General/Delivery 3 tone | `_badge.scss` |
| Card | Default/Selected × Medium/Small padding | `_card.scss` |
| Status Chip | Available/Renewal/Exhausted 3종(subsidy-chip) | `_subsidy-status.scss` |
| Empty State | 아이콘+제목+설명, 목록/검색결과 빈 상태 | `_empty-state.scss` |

### Feedback

| 컴포넌트 | 설명 | 출처 |
|---|---|---|
| Alert | Info/Success/Warning/Danger — 배경·제목색 공통, 아이콘만 다름 | `_alert.scss` |
| Progress | Default/Warning/Full 3단계 게이지 | `_progress.scss` |
| Spinner | Large(48)/Medium(32)/Small(20), 상단 호만 브랜드색 회전 | `_spinner.scss` |
| Modal | Default/Danger, 되돌릴 수 없는 작업은 Danger | `_modal.scss` |

### Navigation

| 컴포넌트 | 설명 | 출처 |
|---|---|---|
| Tab Item | Active(빨간 밑줄)/Inactive/Disabled | `_tab-item.scss` |
| Step Indicator | 장바구니→결제→주문완료 3단계 | `_step-indicator.scss` |

### Utility (코드 전용 — 참고 Figma에는 없던 카테고리)

| 컴포넌트 | 설명 | 출처 |
|---|---|---|
| Go To Top | 스크롤 400px 이후 노출되는 맨 위로 버튼 | `_go-to-top.scss` |
| Toast | 화면당 동시 1개, 다크 톤 짧은 알림 | `_toast.scss` |
| Skip Nav | 스크린리더용 본문 바로가기, 포커스 시만 노출 | `_helpers.scss` |
| Category Sidebar | 베스트·신상품 좌측 카테고리 목록 | `_category-sidebar.scss` |

---

## Patterns

서비스 화면을 이루는 9개 조합입니다.

| 패턴 | 설명 | 출처 |
|---|---|---|
| Subsidy Summary | 당월 지원 혜택 잔여 한도, 추천도서/개인도서 2열 | `MySubsidyPage.tsx` |
| Book Card | 도서 1권 세로 카드, home_bookcard/home_best/past-recomment 3종 | `BookCard.tsx` |
| Picked Book | 이달의 추천도서 상세 카드, 유일하게 Display 타이포 사용 | `PickedBook.tsx` |
| Book List | 도서 1권 가로 행, 베스트/신상품 목록용 | `BookListRow.tsx` |
| Cart Row | 장바구니 도서 1권 행 | `CartItemRow.tsx` |
| Payment Sidebar | 결제 정보 요약 + 최종 결제금액 + 결제 버튼 | `PaymentSummaryCard.tsx` |
| Login Form | 사번/비밀번호 입력, 오타/빈칸 구분 없는 동일 오류 문구 | `LoginPage.tsx` |
| Order Complete | 단계 표시 + 성공 메시지 + 정산 요약 | `OrderCompletePage.tsx` |
| Subsidy Limit Card | 이번 달 지원금 잔여 한도 게이지 카드 | `MySubsidyPage.tsx` + Progress 컴포넌트 조합 |

---

## Icons

`src/components/Icon.tsx` 기준 39개 (기본 크기 20px, 색은 놓이는 자리의 글자색을 따름):

arrow-up, arrows-clockwise, book-open, books, caret-down, caret-right, caret-up, check, circle, check-circle, device-mobile, dots-three-vertical, equals, eye, eye-slash, headset, heart, info, list, magnifying-glass, medal, minus, plus, question, receipt, shopping-bag, shopping-cart-simple, sign-out, star, sparkle, trash, truck, user, wallet, warning, warning-circle, x-circle, x, device-tablet-speaker

---

## 제외 요소

참고했던 기존 Figma 파일에는 있었지만, 코드에 대응 항목이 없어 이 문서·새 Figma 파일에는 포함하지 않은 항목입니다.

| 구분 | 항목명 | 제외 사유 |
|---|---|---|
| 토큰(색) | neutral/800 (#262425) | 코드에 없음 (700→900 결번) |
| 토큰(색) | red/200 (#f9acaa) | 코드에 명명된 atomic 토큰 없음(semantic progress/default에 값만 인라인) |
| 토큰(색) | green/100 (#bee7cf) | 코드에 없음 |
| 토큰(색) | teal/orange/purple/pink Atomic Family 다단계 구조 | 코드는 다단계 팔레트 없이 hex 1개씩만 존재 |
| 토큰(색) | state/danger-icon | 코드에 별도 변수 없음 |
| 컴포넌트 | Loading | 코드에서 별도 컴포넌트로 미확인(Spinner만 존재) |
| 아이콘 | gift, lock-simple, prohibit | 코드(Icon.tsx)에 없음 |
| 아이콘 | shopping-cart | 코드엔 다른 이름(`shopping-cart-simple`)만 존재 |

---

## 변경 이력

**버전 1.0** (작성일: 2026-09-30)
- 코드 기준 최초 작성. 참고 Figma(v2 Overview/Foundations/Components/Patterns/Icons)의 구조·표기 방식을 따르되, 모든 값은 현재 코드베이스(`src/scss`, `src/components`)에서 추출.
- 짝을 이루는 Figma 파일: https://www.figma.com/design/Qubd0su49qOLX7S2j83GiA
