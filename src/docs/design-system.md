# 영풍문고 B2B 임직원 독서 플랫폼 - 디자인 시스템

> 💡 본 문서는 피그마(Figma)에서 추출한 **design-system.md** 문서를 기준으로 작성되었습니다.

---

version: alpha
name: '영풍문고 B2B 독서복지 Design System'
description: '임직원이 회사 지원금으로 도서를 고르고 결제하는 데스크톱 웹 서비스. 밝은 회색 페이지 위 흰 카드와 1px 테두리로 위계를 만들고, 영풍문고 BI 빨강(#e01e1a) 하나를 실행·강조·오류·지원금 게이지에만 쓴다. 지원금과 본인 부담금은 항상 같은 위치와 순서로 보이며, 상태 변화는 색으로만 표현하고 요소를 움직이지 않는다.'

colors:

# Brand & Accent

primary: '#e01e1a'
primary-hover: '#c61a17'
primary-pressed: '#aa1714'
primary-soft: '#ffeeed'
on-primary: '#ffffff'
on-primary-soft: '#aa1714'
link: '#c61a17'

# Surface

canvas: '#fafafa'
surface-card: '#ffffff'
surface: '#f5f4f4'

# Text

foreground: '#191818'
foreground-secondary: '#555152'
muted: '#6f696b'
disabled-text: '#aba6a7'

# Border & Focus

border: '#e9e7e8'
border-strong: '#d6d3d4'
border-control: '#6f696b'
border-brand: '#e01e1a'
focus-ring: '#2563eb'

# State

danger: '#aa1714'
danger-soft: '#ffeeed'
danger-icon: '#e01e1a'
danger-border: '#fdd9d8'

# Progress

progress-default: '#f9acaa'
progress-warning: '#f47d7b'
progress-full: '#e01e1a'

# Bookmark (추천 주체 구분)

bookmark-gray: '#3d3b3b'
bookmark-orange: '#b54708'
bookmark-green: '#157a40'
bookmark-teal: '#0f766e'
bookmark-blue: '#1d4fbf'
bookmark-purple: '#7e22ce'
bookmark-pink: '#be185d'

# Subsidy (서비스 전용)

subsidy-company: '#157a40'
subsidy-company-soft: '#eaf7ef'
subsidy-company-icon: '#1c8a4b'
subsidy-employee: '#191818'
subsidy-employee-soft: '#f5f4f4'

typography:
heading-h1:
fontFamily: 'Pretendard GOV, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
fontSize: 26px
fontWeight: 700
lineHeight: 34px
heading-h2:
fontFamily: 'Pretendard GOV, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
fontSize: 22px
fontWeight: 700
lineHeight: 30px
heading-h3:
fontFamily: 'Pretendard GOV, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
fontSize: 20px
fontWeight: 500
lineHeight: 28px
heading-h4:
fontFamily: 'Pretendard GOV, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
fontSize: 17px
fontWeight: 500
lineHeight: 24px
body-lg:
fontFamily: 'Pretendard GOV, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
fontSize: 18px
fontWeight: 400
lineHeight: 28px
body:
fontFamily: 'Pretendard GOV, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
fontSize: 17px
fontWeight: 400
lineHeight: 26px
body-sm:
fontFamily: 'Pretendard GOV, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
fontSize: 15px
fontWeight: 400
lineHeight: 24px
body-xs:
fontFamily: 'Pretendard GOV, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
fontSize: 13px
fontWeight: 400
lineHeight: 20px
label-lg:
fontFamily: 'Pretendard GOV, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
fontSize: 16px
fontWeight: 500
lineHeight: 24px
label:
fontFamily: 'Pretendard GOV, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
fontSize: 14px
fontWeight: 500
lineHeight: 20px
label-sm:
fontFamily: 'Pretendard GOV, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
fontSize: 12px
fontWeight: 700
lineHeight: 16px
caption:
fontFamily: 'Pretendard GOV, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
fontSize: 12px
fontWeight: 400
lineHeight: 18px
caption-strong:
fontFamily: 'Pretendard GOV, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
fontSize: 12px
fontWeight: 700
lineHeight: 18px
price-lg:
fontFamily: 'Pretendard GOV, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
fontSize: 22px
fontWeight: 700
lineHeight: 28px
fontFeature: 'tnum'
price:
fontFamily: 'Pretendard GOV, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
fontSize: 17px
fontWeight: 700
lineHeight: 24px
fontFeature: 'tnum'

rounded:
xs: 2px
sm: 4px
md: 6px
lg: 10px
full: 999px

spacing:
space-1: 4px
space-2: 8px
space-3: 12px
space-4: 16px
space-5: 20px
space-6: 24px
space-8: 32px
space-10: 40px
space-12: 48px
space-16: 64px
layout-min-width: 1280px
layout-max-width: 1280px
layout-inner-padding: 20px
layout-sidebar-width: 320px
layout-content-gap: 24px
grid-columns: 12
grid-gutter: 24px

components:

# Action

button-primary:
backgroundColor: '{colors.primary}'
textColor: '{colors.on-primary}'
typography: '{typography.label-lg}'
rounded: '{rounded.md}'
height: 52px
padding: 24px
button-primary-hover:
backgroundColor: '{colors.primary-hover}'
button-primary-pressed:
backgroundColor: '{colors.primary-pressed}'
button-primary-disabled:
backgroundColor: '{colors.surface}'
textColor: '{colors.disabled-text}'
button-secondary:
backgroundColor: '{colors.surface-card}'
textColor: '{colors.foreground}'
typography: '{typography.label-lg}'
rounded: '{rounded.md}'
height: 52px
padding: 24px
button-secondary-hover:
backgroundColor: '{colors.surface}'
button-secondary-pressed:
backgroundColor: '{colors.surface}'
button-secondary-disabled:
backgroundColor: '{colors.surface}'
textColor: '{colors.disabled-text}'
button-tertiary:
backgroundColor: transparent
textColor: '{colors.primary}'
typography: '{typography.label-lg}'
rounded: '{rounded.md}'
height: 52px
padding: 24px
button-tertiary-hover:
backgroundColor: '{colors.surface}'
textColor: '{colors.on-primary-soft}'
button-tertiary-pressed:
backgroundColor: '{colors.primary-soft}'
textColor: '{colors.on-primary-soft}'
button-danger:
backgroundColor: '{colors.surface-card}'
textColor: '{colors.danger}'
typography: '{typography.label-lg}'
rounded: '{rounded.md}'
height: 52px
padding: 24px
button-danger-hover:
backgroundColor: '{colors.danger-soft}'
button-danger-pressed:
backgroundColor: '{colors.danger-border}'
side-button:
backgroundColor: '{colors.surface-card}'
textColor: '{colors.foreground}'
rounded: '{rounded.full}'
size: 50px
subsidy-button-recommended:
backgroundColor: '{colors.surface-card}'
textColor: '{colors.on-primary-soft}'
typography: '{typography.label}'
rounded: '{rounded.full}'
height: 32px
padding: 12px
subsidy-button-recommended-applied:
backgroundColor: '{colors.primary}'
textColor: '{colors.on-primary}'
subsidy-button-personal:
backgroundColor: '{colors.surface-card}'
textColor: '{colors.foreground}'
typography: '{typography.label}'
rounded: '{rounded.full}'
height: 32px
padding: 12px
subsidy-button-personal-applied:
backgroundColor: '{colors.subsidy-employee}'
textColor: '{colors.on-primary}'
subsidy-button-disabled:
backgroundColor: '{colors.surface}'
textColor: '{colors.disabled-text}'
typography: '{typography.label}'
rounded: '{rounded.full}'
height: 32px
padding: 12px

# Selection & Input

checkbox:
backgroundColor: '{colors.surface-card}'
rounded: '{rounded.sm}'
size: 20px
checkbox-checked:
backgroundColor: '{colors.primary}'
radio:
backgroundColor: '{colors.surface-card}'
rounded: '{rounded.full}'
size: 20px
input-field:
backgroundColor: '{colors.surface-card}'
textColor: '{colors.foreground}'
typography: '{typography.body}'
rounded: '{rounded.sm}'
height: 44px
padding: 16px
stepper:
backgroundColor: '{colors.surface-card}'
textColor: '{colors.foreground}'
typography: '{typography.body-sm}'
rounded: '{rounded.sm}'
height: 34px
width: 160px

# Content

badge-recommended:
backgroundColor: '{colors.primary-soft}'
textColor: '{colors.on-primary-soft}'
typography: '{typography.label}'
rounded: '{rounded.full}'
height: 24px
badge-general:
backgroundColor: '{colors.surface}'
textColor: '{colors.foreground-secondary}'
typography: '{typography.label}'
rounded: '{rounded.full}'
height: 24px
card:
backgroundColor: '{colors.surface-card}'
textColor: '{colors.foreground}'
rounded: '{rounded.lg}'
padding: 24px
card-compact:
padding: 16px
status-chip:
backgroundColor: '{colors.surface}'
textColor: '{colors.foreground-secondary}'
typography: '{typography.label}'
rounded: '{rounded.sm}'
height: 32px
padding: 12px
bookmark-chip:
backgroundColor: '{colors.bookmark-gray}'
textColor: '{colors.on-primary}'
typography: '{typography.label-sm}'
height: 28px

# Feedback

alert:
backgroundColor: '{colors.surface}'
textColor: '{colors.foreground}'
typography: '{typography.body-sm}'
rounded: '{rounded.md}'
padding: 16px
progress-track:
backgroundColor: '{colors.border}'
rounded: '{rounded.full}'
height: 12px
modal:
backgroundColor: '{colors.surface-card}'
textColor: '{colors.foreground}'
rounded: '{rounded.lg}'
padding: 24px
width: 480px

# Navigation

tab-item:
backgroundColor: '{colors.surface-card}'
textColor: '{colors.foreground-secondary}'
typography: '{typography.label-lg}'
height: 46px
padding: 16px
tab-item-active:
textColor: '{colors.foreground}'
tab-item-disabled:
textColor: '{colors.disabled-text}'

# Patterns

book-card:
backgroundColor: '{colors.surface-card}'
textColor: '{colors.foreground}'
rounded: '{rounded.lg}'
padding: 24px
width: 240px
payment-sidebar:
backgroundColor: '{colors.surface-card}'
textColor: '{colors.foreground}'
rounded: '{rounded.lg}'
width: 320px

---

# 영풍문고 B2B 독서복지 Design System

**Version:** alpha · **Last Updated:** 2026-09-24

> 출처: Figma「영풍문고 B2B 독서복지 플랫폼 — Design System」v2.2 (2026.09.24), Design System 섹션(node 228:754). Figma 변수·컴포넌트 실측값을 기준으로 작성했고, Figma 문서 설명과 실측값이 다른 곳은 **Known Gaps**에 정리했다.

## Overview

임직원이 회사 지원금으로 도서를 고르고 결제하는 B2B 독서복지 서비스다. 사용자는 매달 지원 한도(추천도서 1권 100%, 개인도서 50%·최대 10,000원) 안에서 책을 담고 결제한다. 화면이 답해야 할 질문은 항상 "이번 달 지원금이 얼마 남았고, 이 책을 사면 내가 얼마를 내는가"다.

UI는 차분하고 사무적이다. 밝은 회색 페이지(`{colors.canvas}`) 위에 흰 카드와 1px 테두리로 정보를 묶고, 영풍문고 BI 빨강 하나로 실행과 강조를 알린다. 데스크톱 1280px 기준이며, 결제 사이드바를 오른쪽에 고정해 금액 계산을 계속 보이게 한다.

규칙이 명시되지 않은 상황에서는 **새 색이나 장식을 더하지 말고, 지원금·금액 정보가 먼저 읽히는 쪽**으로 결정한다.

**Key Characteristics:**

- 주인공은 지원금과 금액이다. 회사 지원금과 본인 부담금은 항상 같은 위치, 같은 순서로 보여 준다.
- 강조색은 `{colors.primary}`(#e01e1a) 하나. 실행 버튼, 강조 금액, 오류, 지원금 게이지에만 쓴다.
- 예외적인 색은 두 가지뿐: 추천 주체를 구분하는 책갈피 칩 7색, 키보드 포커스 링 파랑.
- 위계는 흰 카드 + 1px `{colors.border}` 테두리로 만든다. 그림자는 모달과 떠 있는 버튼에만.
- 상태는 색으로만 알린다. 위치·크기를 움직이지 않는다.
- 서체는 Pretendard GOV 하나, 굵기 400 / 500 / 700.
- 금액은 항상 천 단위 쉼표 + "원" (예: 15,000원).

## Colors

모든 색은 Atomic(원본값) → Semantic(용도명) 두 단계로 연결된다. 화면과 컴포넌트는 **Semantic만** 쓴다. 아래 토큰 이름은 코드의 CSS 변수(`--color-*`)에서 접두사를 뺀 것이다.

### Brand & Accent

- **YP Red** (`{colors.primary}` — #e01e1a): 주요 버튼, 선택 상태, 강조 금액, 필수 표시, 지원금 적용됨 상태. 흰 배경 대비 4.81:1. 장식·일러스트·배경 면적에는 쓰지 않는다.
- **Red Hover** (`{colors.primary-hover}` — #c61a17): 주요 버튼 hover.
- **Red Pressed** (`{colors.primary-pressed}` — #aa1714): 주요 버튼 눌림.
- **Red Soft** (`{colors.primary-soft}` — #ffeeed): 추천도서 배지 배경, 연한 강조 배경, Tertiary 버튼 눌림.
- **On Red Soft** (`{colors.on-primary-soft}` — #aa1714): 연한 빨강 배경 위 글자, 추천도서 지원금 버튼 글자.
- **Link** (`{colors.link}` — #c61a17): 텍스트 링크(대비 5.90:1).

### Surface

- **Canvas** (`{colors.canvas}` — #fafafa): 페이지 배경.
- **Card** (`{colors.surface-card}` — #ffffff): 카드, 모달, 입력창 배경.
- **Sunken** (`{colors.surface}` — #f5f4f4): 약한 구획, 비활성 버튼 배경, Alert·Status Chip 배경, 표지 자리 배경.

### Text

- **Foreground** (`{colors.foreground}` — #191818): 제목, 본문. 대비 17.72:1.
- **Secondary** (`{colors.foreground-secondary}` — #555152): 보조 설명. 7.82:1.
- **Muted** (`{colors.muted}` — #6f696b): 도움말, placeholder. 5.36:1.
- **Disabled** (`{colors.disabled-text}` — #aba6a7): 비활성 텍스트 전용(WCAG 예외).
- **On Primary** (`{colors.on-primary}` — #ffffff): 빨강·검정·책갈피 배경 위 글자.

### Border & Focus

- **Border** (`{colors.border}` — #e9e7e8): 카드 테두리, 구분선, 게이지 트랙.
- **Border Strong** (`{colors.border-strong}` — #d6d3d4): hover·강조 테두리.
- **Border Control** (`{colors.border-control}` — #6f696b): 입력창, 체크박스, 라디오, Secondary 버튼 테두리. 조작 요소의 경계는 이 색으로 3:1 이상을 확보한다.
- **Border Brand** (`{colors.border-brand}` — #e01e1a, CSS `--input-border-focus`): 선택된 항목 테두리, 추천도서 지원금 버튼 테두리.
- **Focus Ring** (`{colors.focus-ring}` — #2563eb): 키보드 포커스 링 전용. 다른 용도로 쓰지 않는다.

### State

오류는 빨강 계열로만 표현한다. 성공·주의 전용 색은 두지 않는다(Alert는 아이콘 모양으로 구분).

- **Danger** (`{colors.danger}` — #aa1714): 오류 메시지, 입력 오류 테두리, Danger 버튼.
- **Danger Soft** (`{colors.danger-soft}` — #ffeeed): Danger 버튼 hover 배경.
- **Danger Icon** (`{colors.danger-icon}` — #e01e1a): Alert 제목.
- **Danger Border** (`{colors.danger-border}` — #fdd9d8): Danger 버튼 눌림 배경.

### Progress

지원금 게이지 채움 색. 한도에 가까울수록 진해진다. 트랙은 `{colors.border}`.

- `{colors.progress-default}` #f9acaa — 여유 있음
- `{colors.progress-warning}` #f47d7b — 한도 임박
- `{colors.progress-full}` #e01e1a — 한도 소진

### Bookmark

추천 주체(CEO픽, 본부장픽 등 직무·직책)를 구분하는 책갈피 칩 배경. 글자는 모두 흰색(대비 5.4:1 이상). **추천 주체 하나에 색 하나**를 정하면 모든 화면에서 같은 색을 쓴다. 이 7색은 책갈피 칩 밖에서 쓰지 않는다.

| 토큰                       | Hex     |
| -------------------------- | ------- |
| `{colors.bookmark-gray}`   | #3d3b3b |
| `{colors.bookmark-orange}` | #b54708 |
| `{colors.bookmark-green}`  | #157a40 |
| `{colors.bookmark-teal}`   | #0f766e |
| `{colors.bookmark-blue}`   | #1d4fbf |
| `{colors.bookmark-purple}` | #7e22ce |
| `{colors.bookmark-pink}`   | #be185d |

### Subsidy (서비스 전용)

회사 지원금과 본인 부담금을 구분한다.

- **Company** (`{colors.subsidy-company}` — #157a40) / 배경 `{colors.subsidy-company-soft}` #eaf7ef / 아이콘 `{colors.subsidy-company-icon}` #1c8a4b: 회사 지원금 금액과 영역.
- **Employee** (`{colors.subsidy-employee}` — #191818) / 배경 `{colors.subsidy-employee-soft}` #f5f4f4: 본인 부담금 금액과 영역, 개인도서 지원금 적용됨 버튼 배경.

### Gradient Policy

그라디언트를 쓰지 않는다.

### Figma ↔ CSS 변수 대응 (주요)

| Figma 변수                                     | CSS 변수                                                                         | 토큰                    |
| ---------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------- |
| surface/page                                   | `--color-canvas`                                                                 | `{colors.canvas}`       |
| surface/card                                   | `--color-surface-card`                                                           | `{colors.surface-card}` |
| surface/sunken                                 | `--color-surface`                                                                | `{colors.surface}`      |
| surface/brand(-hover/-pressed/-subtle)         | `--color-primary(-hover/-pressed/-soft)`                                         | `{colors.primary}` 계열 |
| text/primary · secondary · tertiary · disabled | `--color-foreground` · `-foreground-secondary` · `-muted` · `-disabled-text`     | 동일                    |
| text/on-brand · on-brand-subtle · link         | `--color-on-primary` · `-on-primary-soft` · `-link`                              | 동일                    |
| border/default · strong · control · brand      | `--color-border` · `-border-strong` · `-border-control` · `--input-border-focus` | `{colors.border-brand}` |

## Typography

### Font Family

- **화면용**: `Pretendard GOV, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif`
- Noto Sans KR은 Figma 문서 페이지용(v2/Doc) 서체다. 서비스 화면에는 쓰지 않는다.
- 금액(`price`, `price-lg`)은 `font-variant-numeric: tabular-nums`로 자릿수를 맞춘다.

### Hierarchy

| Token                         | Size / Line | Weight        | Use                                    |
| ----------------------------- | ----------- | ------------- | -------------------------------------- |
| `{typography.heading-h1}`     | 26 / 34     | 700 (Bold)    | 페이지 제목                            |
| `{typography.heading-h2}`     | 22 / 30     | 700 (Bold)    | 섹션 제목                              |
| `{typography.heading-h3}`     | 20 / 28     | 500 (Medium)  | 카드 제목, 항목 제목                   |
| `{typography.heading-h4}`     | 17 / 24     | 500 (Medium)  | 도서명, 목록 제목                      |
| `{typography.body-lg}`        | 18 / 28     | 400 (Regular) | 강조 본문, 안내 문장                   |
| `{typography.body}`           | 17 / 26     | 400 (Regular) | 기본 본문                              |
| `{typography.body-sm}`        | 15 / 24     | 400 (Regular) | 보조 설명, 표 본문 (15px 보정)         |
| `{typography.body-xs}`        | 13 / 20     | 400 (Regular) | 각주, 메타데이터, 부가 주석            |
| `{typography.label-lg}`       | 16 / 24     | 500 (Medium)  | 버튼 라벨                              |
| `{typography.label}`          | 14 / 20     | 500 (Medium)  | 배지, 탭, 입력 라벨                    |
| `{typography.label-sm}`       | 12 / 16     | 700 (Bold)    | 리본, 작은 태그                        |
| `{typography.caption}`        | 12 / 18     | 400 (Regular) | 날짜, 도움말                           |
| `{typography.caption-strong}` | 12 / 18     | 700 (Bold)    | 상태 강조 캡션                         |
| `{typography.price-lg}`       | 22 / 28     | 700 (Bold)    | 최종 결제 금액                         |
| `{typography.price}`          | 17 / 24     | 700 (Bold)    | 도서 가격 (H4 도서명과 동일 행간 매칭) |

### Principles

- 자간은 모두 0. 음수 자간을 쓰지 않는다.
- 버튼 라벨은 한 줄로 유지한다. 줄바꿈되면 라벨을 줄인다.
- 금액 표기: 천 단위 쉼표 + "원". 할인 전 정가는 `{colors.muted}` 12~13px + 취소선, 지원 비율은 `{colors.primary}` 굵게("100%", "50%").
- Alert 제목·설명, 추천 사유처럼 긴 텍스트는 줄바꿈하고 말줄임으로 자르지 않는다.

## Layout

### Spacing System

- **Base unit:** 4px. `{spacing.space-1}`~`{spacing.space-16}`(4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64)만 쓴다.
  | 토큰 | 값 | 용도 |
  |---|---|---|
  | `{spacing.space-1}` | 4px | 아이콘과 라벨 사이 |
  | `{spacing.space-2}` | 8px | 배지 안쪽, 촘촘한 간격, 버튼 아이콘-라벨 |
  | `{spacing.space-3}` | 12px | 입력 안쪽 세로, 소형 버튼 좌우 |
  | `{spacing.space-4}` | 16px | 컴포넌트 안쪽 기본, Alert 안쪽 |
  | `{spacing.space-5}` | 20px | 화면 좌우 여백 |
  | `{spacing.space-6}` | 24px | 카드·모달 안쪽, 묶음 사이 |
  | `{spacing.space-8}` | 32px | 섹션 안쪽 구획 |
  | `{spacing.space-10}` | 40px | 큰 블록 사이 |
  | `{spacing.space-12}` | 48px | 페이지 구획 |
  | `{spacing.space-16}` | 64px | 페이지 위아래 여백 |

### Grid & Container

- 데스크톱 전용. 최소·최대 너비 1280px(`{spacing.layout-min-width}`), 좌우 여백 20px, 12컬럼 · 거터 24px.
- **결제 사이드바**는 320px(`{spacing.layout-sidebar-width}`) 고정, 화면 오른쪽. 나머지 폭은 본문이 채운다. 본문과 사이드바 사이 24px(`{spacing.layout-content-gap}`).
- 코드 변수: `--layout-wrap-min-width`, `--layout-inner-max-width`, `--layout-inner-padding`, `--layout-sidebar-width`, `--layout-content-gap`.

### Whitespace Philosophy

카드 안쪽은 24px로 넉넉하게, 카드 안 요소 사이는 8~16px로 촘촘하게 둔다. 같은 종류의 목록(장바구니 행, 도서 카드)은 간격을 통일해 리듬을 만든다.

## Elevation & Depth

| Level     | Treatment                            | Use                                     |
| --------- | ------------------------------------ | --------------------------------------- |
| Flat      | 그림자·테두리 없음                   | 페이지 배경(`{colors.canvas}`), 탭      |
| Outline   | 흰 배경 + 1px `{colors.border}`      | 카드, 장바구니 행, 결제 사이드바, Alert |
| Shadow/SM | `0 1px 2px rgba(24, 23, 26, 0.06)`   | (정의만 있음, 사용처 확인 필요)         |
| Shadow/MD | `0 4px 16px rgba(24, 23, 26, 0.10)`  | (정의만 있음, 사용처 확인 필요)         |
| Shadow/LG | `0 16px 40px rgba(24, 23, 26, 0.16)` | 모달                                    |
| Floating  | `0 4px 6px rgba(0, 0, 0, 0.10)`      | Side Button(목록 좌우 이동)             |

**Shadow philosophy.** 그림자는 화면 위에 떠 있는 요소(모달, 목록 위 Side Button)에만 쓴다. 카드는 그림자 대신 테두리로 구분한다. 카드 hover는 테두리를 `{colors.border-control}`로, 선택은 2px `{colors.primary}` 테두리로 바꾼다.

## Shapes

| Token            | Value | Use                                                               |
| ---------------- | ----- | ----------------------------------------------------------------- |
| `{rounded.xs}`   | 2px   | 체크 표시 등 아주 작은 요소                                       |
| `{rounded.sm}`   | 4px   | 입력창, Stepper, 소형 버튼, Status Chip, 체크박스, 모달 닫기 영역 |
| `{rounded.md}`   | 6px   | 버튼(Large·Medium), Alert, 표지 이미지                            |
| `{rounded.lg}`   | 10px  | 카드, 모달, 도서 카드, 결제 사이드바, 포커스 링(md 요소 기준)     |
| `{rounded.full}` | 999px | 배지, 지원금 버튼, 게이지, Side Button, 라디오, 단계 원           |

같은 종류의 요소는 한 화면에서 같은 모서리를 쓴다. pill(`full`)은 "상태를 표시하거나 토글하는 작은 요소"의 문법이다. 주요 실행 버튼에는 pill을 쓰지 않는다.

### Imagery

- **표지:** 세로 5:7 비율(도서 카드 192×268, 목록 90×126). `{rounded.md}`. 이미지가 없으면 `{colors.surface}` 바탕 + 가운데 `books` 아이콘.
- **아이콘:** Phosphor Icons **Regular** 한 세트만. 기본 20px, 소형 버튼·배지·칩 안에서는 16px. 색은 놓이는 자리의 글자색을 따른다. 제목·라벨 왼쪽에 나란히 둔다.
- 사용 아이콘(22): arrows-clockwise, book-open, books, caret-down, caret-right, check, check-circle, gift, info, lock-simple, magnifying-glass, minus, plus, prohibit, receipt, shopping-cart, star, truck, user, warning-circle, x, x-circle. 새 아이콘이 필요하면 Phosphor Regular에서 고른다.
- 배지에 이모지를 쓰지 않는다.

## Components

### Action

**`button-primary` / `button-secondary` / `button-tertiary` / `button-danger`** — 4 variant × 3 size × 5 state.
| Size | Height | 좌우 padding | Radius | Label | Icon |
|---|---|---|---|---|---|
| Large | 52px | 24px | `{rounded.md}` | `{typography.label-lg}` | 20px |
| Medium | 44px | 16px | `{rounded.md}` | `{typography.label-lg}` | 20px |
| Small | 36px | 12px | `{rounded.sm}` | `{typography.label}` | 16px |

- 아이콘-라벨 간격 8px, 아이콘은 라벨 왼쪽.
- **Primary**: 빨강 배경 + 흰 글자. **한 화면에 하나만** 둔다(예: 결제하기, 장바구니 담기).
- **Secondary**: 흰 배경 + 1px `{colors.border-control}` 테두리 + 검정 글자. Hover 배경 `{colors.surface}`, Pressed는 테두리가 `{colors.foreground}`로.
- **Tertiary**: 배경·테두리 없음 + 빨강 글자. Hover 배경 `{colors.surface}` + 글자 `{colors.on-primary-soft}`, Pressed 배경 `{colors.primary-soft}`.
- **Danger**: 흰 배경 + 1px `{colors.danger}` 테두리 + `{colors.danger}` 글자. 되돌릴 수 없는 작업(주문 취소)에만.
- **Disabled**(전 variant): 배경 `{colors.surface}`, 글자 `{colors.disabled-text}`, Secondary·Danger는 테두리 `{colors.border}`. 커서 `not-allowed`.
- **Focus**(전 variant): 아래 Interaction의 포커스 링.

**`side-button`** — 가로 스크롤 도서 목록 양옆의 50×50 원형 버튼. 흰 배경 + 1px `{colors.border-control}` + Floating 그림자, caret 아이콘 20px. 목록 처음에서는 Left, 끝에서는 Right를 Disabled로. 아이콘만 있으므로 `aria-label`("이전 도서", "다음 도서")을 반드시 붙인다.

**`subsidy-button-*`** — 지원금 적용을 켜고 끄는 토글. 높이 32px, pill, 좌우 12px, 아이콘 16px + 라벨 `{typography.label}`.
| 종류 | 적용하기 (Apply) | 적용됨 (Applied) | 한도 소진 (`subsidy-button-disabled`) |
|---|---|---|---|
| 추천도서 (`star` 아이콘) | 흰 배경, 1px `{colors.border-brand}`, 글자 `{colors.on-primary-soft}` | 빨강 배경·테두리, 흰 글자 | `{colors.surface}` 배경, 1px `{colors.border}`, `{colors.disabled-text}` 글자, 누를 수 없음 |
| 개인도서 (`user` 아이콘) | 흰 배경, 1px `{colors.subsidy-employee}`, 검정 글자 | 검정(`{colors.subsidy-employee}`) 배경, 흰 글자 | 위와 동일 |
라벨은 "지원금 적용하기" ↔ "지원금 적용됨" ↔ "지원금 한도 소진"으로 바뀐다.

### Selection & Input

**`checkbox`** — 20×20, `{rounded.sm}`. Off: 흰 배경 + 1px `{colors.border-control}`. On·Mixed: 빨강 배경 + 흰 체크/대시. 라벨 `{typography.body}`, 간격 8px. 용도: 장바구니 도서 선택, 약관 동의.

**`radio`** — 20×20 원. Off: 흰 배경 + 2px `{colors.border-control}`. On: 2px `{colors.primary}` 테두리 + 빨강 내부 점. 용도: 결제 수단, 배송 방법.

**`input-field`** — 라벨은 **항상 위**(`{typography.label}`, 입력창과 8px), 도움말·오류는 아래. 입력창 높이 44px, 좌우 16px, `{rounded.sm}`, 1px `{colors.border-control}`. 앞 아이콘 20px(선택). placeholder `{colors.muted}`.

- Focus: 테두리 2px `{colors.focus-ring}`.
- Error: 테두리 `{colors.danger}` + 아래 오류 문구 `{colors.danger}` `{typography.body-sm}`. 문구는 "무엇을 어떻게 고치면 되는지"로 쓴다. 📋 Error variant는 Figma 컴포넌트에 없음(Login Form 패턴에만 있음).

**`stepper`** — 수량 1권 단위 증감. Medium 160×34, Small 88×28. `{rounded.sm}`, 1px `{colors.border-control}`, 좌우 32px 버튼(minus/plus 16px) + 가운데 숫자. 최소 수량 1에서는 빼기 버튼만 흐리게(Minimum), 수량을 바꿀 수 없는 도서는 전체 Disabled.

### Content

**`badge-recommended` / `badge-general`** — 도서 유형 표시. 높이 24px, pill, 좌 8px·우 12px, 아이콘 16px + 라벨. 색만으로 구분하지 않고 아이콘과 글자를 함께 쓴다.

- 추천도서: `{colors.primary-soft}` 배경, `star` 아이콘, `{colors.on-primary-soft}` 글자.
- 일반도서: `{colors.surface}` 배경, `books` 아이콘, `{colors.foreground-secondary}` 글자.

**`card`** — 흰 배경, 1px `{colors.border}`, `{rounded.lg}`, padding 24px(Compact 16px), 제목-본문 8px. 제목 `{typography.label-lg}`, 본문 `{typography.body-sm}` `{colors.foreground-secondary}`.

- Hover: 테두리 `{colors.border-control}`. Selected: 테두리 2px `{colors.primary}`.
- 카드 안에 카드를 넣지 않는다.

**`status-chip`** — 표시 전용(누르지 않음). 한 항목이라도 한도를 다 쓰면 "매월 1일 자동 갱신"을 알린다. `{colors.surface}` 배경, 1px `{colors.border}`, `{rounded.sm}`, 높이 32px, `arrows-clockwise` 아이콘 16px.

**`bookmark-chip`** — 추천 주체(CEO픽, 본부장픽)를 알리는 가로 책갈피. 높이 28px, 본문 + 오른쪽 V자 꼬리(10px). 안쪽 padding 5 / 6 / 5 / 12px. 표지 왼쪽 위 가장자리에 붙이고 누르지 않는다. 색은 Bookmark 7색 중 추천 주체별 고정값.

### Feedback

**`alert`** — 화면 안 안내·성공·주의·오류 메시지. 네 tone 모두 `{colors.surface}` 배경 + 1px `{colors.border}` + 회색 아이콘(`{colors.foreground-secondary}`) + 빨간 제목(`{colors.danger-icon}`, `{typography.label-lg}`) + 검정 설명(`{typography.body-sm}`). **tone은 아이콘 모양으로만 구분**한다(info / check-circle / warning-circle / x-circle). padding 16px, 아이콘-텍스트 12px, 제목-설명 4px, `{rounded.md}`. 높이는 내용에 맞춰 늘어나며 잘리지 않는다.

**`progress-track`** — 월 지원 한도 게이지. 트랙 높이 12px, pill, `{colors.border}`. 채움은 Progress 3색(Default → Warning → Full). 라벨 오른쪽에 "사용 금액 / 한도 금액"을 `{typography.body-sm}` `{colors.foreground-secondary}`로 함께 적는다. 채움 변화는 250ms.

**Spinner** — 회색 원 위에 빨강 호가 시계 방향으로 회전(800ms linear 무한). Large 48px/두께 4, Medium 32/3, Small 20/2. 진행률을 알 수 없는 대기에만 쓰고, 혼자 쓰지 않고 Loading이나 버튼 안에서 대기 문구와 함께 쓴다.

**Loading** — Spinner + 안내 문구. Page(다른 조작을 막는 전체 대기, 로그인) / Inline(목록 일부 대기). 요청이 실패하면 대기 화면을 닫고 Alert로 이유를 알린다.

**`modal`** — 너비 480px, 흰 배경, `{rounded.lg}`, padding 24px, 요소 사이 16px, Shadow/LG. 구성: 제목(`{typography.heading-h2}`) + 닫기(32×32, x 아이콘) / 본문(`{typography.body}` `{colors.foreground-secondary}`) / 오른쪽 정렬 버튼(Medium, 간격 8px, [취소 Secondary] [확인 Primary]). Danger 유형은 확인 버튼을 Danger variant로 바꾼다.

### Navigation

**`tab-item`** — 같은 화면 안 내용 전환. 높이 46px, 좌우 16px, 라벨 `{typography.label-lg}`. Active는 `{colors.foreground}` 글자 + 아래 2px `{colors.primary}` 선, Inactive는 `{colors.foreground-secondary}`, Disabled는 `{colors.disabled-text}`. 용도: 마이페이지(지원금 관리, 주문 내역, 환불), 도서 상세.

**Step Indicator** — 주문 흐름 3단계(장바구니 → 결제하기 → 주문 완료). 28px 원 + 라벨(간격 8px), 단계 사이 64×2px 연결선. 완료·현재 단계는 빨강 원 + 빨강 연결선, 현재 라벨은 `{typography.label-lg}` `{colors.foreground}`, 남은 단계는 흰 원 + 2px `{colors.border-control}` + `{colors.foreground-secondary}` 라벨 + `{colors.border}` 연결선. 숫자는 순서 표시에만 쓴다.

## Do's and Don'ts

### Do

- 회사 지원금과 본인 부담금을 모든 화면에서 같은 위치, 같은 순서로 보여 준다.
- `{colors.primary}`는 실행 버튼, 강조 금액, 오류, 지원금 게이지에만 쓴다.
- 한 화면에 Primary 버튼은 하나만 둔다.
- 금액은 천 단위 쉼표 + "원", 숫자는 tabular-nums로 정렬한다.
- 본문 글자 대비 4.5:1 이상, 버튼 라벨은 한 줄.
- 색·간격·모서리는 토큰(CSS 변수)만 쓴다. 새 값이 필요하면 토큰을 먼저 제안한다.
- 아이콘만 있는 버튼에는 스크린리더용 이름을 붙인다.
- 상태는 색으로 알리고, 긴 텍스트는 줄바꿈한다.

### Don't

- 빨강 외의 강조색을 추가하지 않는다. 책갈피 7색은 책갈피 칩 밖에서 쓰지 않는다.
- 그라디언트, 카드 그림자, 장식 일러스트를 쓰지 않는다.
- hover·선택 시 요소를 움직이거나 크기를 바꾸지 않는다(scale, translate 금지).
- 배지·칩에 이모지를 쓰지 않는다. Phosphor Regular 외 아이콘 세트를 섞지 않는다.
- 카드 안에 카드를 넣지 않는다.
- 주요 실행 버튼에 pill 모서리를 쓰지 않는다(pill은 배지·토글·게이지 전용).
- 서비스 화면에 Noto Sans KR(문서용 서체)을 쓰지 않는다.
- 다크 모드·모바일 레이아웃을 임의로 만들지 않는다(MVP 범위 밖).

## Interaction & Motion

요소의 상태는 **색으로만** 알린다. 위치나 크기를 움직이지 않는다. 모든 컴포넌트는 아래 순서를 따른다.

| 상태     | 표현                                                                         | 예(Primary 버튼)                                   |
| -------- | ---------------------------------------------------------------------------- | -------------------------------------------------- |
| Default  | 기본 색                                                                      | `{colors.primary}` 배경                            |
| Hover    | 한 단계 어둡게                                                               | `{colors.primary-hover}`                           |
| Pressed  | 두 단계 어둡게                                                               | `{colors.primary-pressed}`                         |
| Focus    | 2px `{colors.focus-ring}` 링, 요소와 2px 띄움. 링 radius = 요소 radius + 4px | `outline: 2px solid #2563eb; outline-offset: 2px;` |
| Disabled | `{colors.surface}` 배경 + `{colors.disabled-text}` 글자                      | `cursor: not-allowed`                              |

| Motion | 값                    | 용도                                  | 코드                |
| ------ | --------------------- | ------------------------------------- | ------------------- |
| fast   | 150ms ease-out        | 색, 테두리 전환                       | `--transition-fast` |
| base   | 250ms ease-out        | 아코디언 열림, 게이지 채움, 모달 표시 | `--transition-base` |
| spin   | 800ms linear infinite | Spinner 회전(회전을 쓰는 유일한 예외) | `--animation-spin`  |

전환은 색과 불투명도만 바꾼다. 튀거나 늘어나는 움직임은 쓰지 않는다. `prefers-reduced-motion: reduce`이면 모든 전환·애니메이션을 끄고 즉시 바꾼다.

## Responsive Behavior

### Breakpoints

| Name     | Width    | Key Changes                                                                 |
| -------- | -------- | --------------------------------------------------------------------------- |
| Desktop  | ≥ 1280px | 유일한 지원 구간. 1280px 고정 컨테이너, 좌우 여백은 화면 폭에 따라 늘어난다 |
| < 1280px | —        | 📋 MVP 범위 밖. 가로 스크롤 허용(`min-width: 1280px`)                       |

### Touch Targets

데스크톱 전용이지만 클릭 영역은 최소 32px 높이(지원금 버튼, Status Chip)를 지킨다. 주요 버튼은 44px 이상.

## Screen Patterns

### 공통 상태

- **Loading:** Spinner + 문구. 전체 조작을 막아야 하면 Page, 영역 일부면 Inline.
- **Error:** 대기 화면을 닫고 Alert(tone=Danger) 또는 입력 아래 오류 문구로 이유를 알린다.
- **Empty:** 📋 Figma에 정의 없음.

### Subsidy Summary — 결제, 마이페이지 홈

이번 달 지원금 사용 현황 카드. 추천도서·개인도서 게이지를 세로로 나란히 두고, 한 항목이라도 소진되면 제목 오른쪽에 Status Chip("매월 1일 자동 갱신")을 놓는다. 소진 상태에서는 사용량 텍스트를 라벨 오른쪽으로 옮긴다.

```
┌─ card ───────────────────────────────┐
│ 이번 달 지원금            [↻ 매월 1일 자동 갱신] │
│ 추천도서 지원금                        │
│ ███████████████████████ (progress)   │
│ 1권 / 1권 사용                        │
│ 개인도서 지원금                        │
│ ███████████░░░░░░░░░░░               │
│ 9,000원 / 10,000원 사용               │
└──────────────────────────────────────┘
```

### Cart Row — 장바구니

한 줄에 [체크박스] [표지 44×64] [배지 + 도서명 + 금액] … [실제 결제 금액 + Stepper] [지원금 버튼] [삭제 x]. 흰 카드 + 1px 테두리. 추천도서 지원금 행과 개인도서 지원금 행을 그룹 제목(`{typography.caption}`)으로 나눈다.

- 지원금 적용 전: 정가만 표시(취소선 없음).
- 적용 후: 지원 비율(빨강 굵게, "100%"·"50%") + 적용 후 금액(굵게) + 취소선 정가(`{colors.muted}`). Stepper 위 금액은 실제 결제 금액.

### Payment Sidebar — 장바구니, 결제

너비 320px 고정, 화면 오른쪽. 흰 카드.

```
┌─ 320px ──────────────────┐
│ 결제 금액                  │
│ 상품 금액        26,000원  │
│ 추천도서 지원금  -14,000원  │  ← 차감액은 빨강
│ 개인도서 지원금   -6,000원  │
│ ──────────────────────── │
│ 최종 결제 금액    6,000원  │  ← price-lg
│ [   6,000원 결제하기    ]  │  ← button-primary Large, 전체 폭
└──────────────────────────┘
```

### Book Card — 홈, 추천도서 선택

240px 카드, padding 24px. [추천 대상 caption] → [표지 192×268, 왼쪽 위 순위 배지 24px 빨강] → [도서명 `heading-h4` / 저자 `body-sm`] → [판매가 `price` + 정가 `caption` 취소선]. 도서 유형은 Badge, 담기는 Button.

### Picked Book — 홈 추천 영역, 추천도서 목록 상단

추천 도서 한 권을 크게 소개. 표지 왼쪽 위에 Bookmark Chip, 오른쪽에 도서 정보(제목, 저자·출판사, 출간일·카테고리, 평점·리뷰·구매 수) + 추천 사유(3~5줄, 잘라 내지 않음) + 구매 버튼.

### Book List — 도서 목록

한 행에 [표지 90×126] [배지들 → 카테고리 → 도서명(17 Bold) → 저자·출판사·출간일 → 가격 → 태그 배지] [오른쪽 160px: Stepper, 장바구니 담기(Secondary), 바로 구매(Primary)].

### Order Complete — 주문 완료

결제 결과와 적용된 지원금을 알리고 다음 행동을 안내. 주문번호, 결제 금액, 적용된 지원금, 받는 곳을 label/value 목록으로.

### Login Form — 로그인

사번 + 비밀번호. 오류는 입력 아래에서 알린다. 안내 문구: "회사에서 받은 사번으로 로그인하세요."

### Subsidy Limit Card — 마이페이지 지원금 관리

종류별(추천도서 권수 / 개인도서 금액) 남은 한도("1권 / 1권", "10,000원 / 10,000원")와 지원 정책, 바로가기 링크("추천도서 바로가기 >")를 보여 준다. 한도 소진 시 남은 값 0.

## Iteration Guide

1. 한 번에 컴포넌트 하나만 수정하고 YAML key로 지칭한다(`button-primary`, `subsidy-button-personal`).
2. 상태 variant(`-hover`, `-pressed`, `-disabled`, `-applied`, `-active`)는 `components:`에 별도 key로 둔다.
3. hex를 직접 쓰지 않고 CSS 변수(`var(--color-primary)`) = `{colors.*}` 토큰을 쓴다.
4. 토큰 값을 바꾸면 Figma 변수와 이 문서 본문을 함께 고친다. 원본은 Figma 변수다.
5. 강조가 더 필요하면 새 색 대신 굵기(500→700)나 테두리로 먼저 해결한다.
6. 새 화면을 만들 때는 Screen Patterns의 조합(Subsidy Summary, Payment Sidebar 등)을 먼저 재사용한다.

## Known Gaps

Figma 파일 안에서 문서 설명과 실제 값이 다른 곳이다. 이 DESIGN.md가 택한 기준을 함께 적었다.

- **텍스트 스타일 값 불일치 (확인 필요):** Figma 로컬 텍스트 스타일 v2/Heading·Body·Label 값(H1 24/36, H2 19/29, Body/Base 17/26, Label/Large 19/29 Regular 등)이 Foundations 문서 표와 다르다. 컴포넌트가 문서 표 값(버튼 15/20 Medium 등)과 일치하므로 **문서 표 값**을 채택했다.
- **컴포넌트 서체 (확인 필요):** 대부분의 컴포넌트 텍스트가 Pretendard GOV가 아니라 Noto Sans / Noto Sans KR로 들어가 있고 텍스트 스타일에 연결돼 있지 않다. 문서 원칙에 따라 Pretendard GOV로 통일했다.
<!-- - **Spacing 코드 이름:** 문서 표에 옛 코드 이름(`--spacing-xs`, `--spacing-md` 등)이 남아 있으나 Figma 변수 code syntax는 `--space-N`. `--space-N`을 기준으로 했다.
- **Alert 제목 대비:** `{colors.danger-icon}`(#e01e1a)을 `{colors.surface}`(#f5f4f4) 위에 쓰면 4.38:1로 AA(4.5:1)에 조금 못 미친다(흰 배경 기준 4.81:1). 제목을 `{colors.danger}`(#aa1714)로 바꾸거나 Alert 배경을 흰색으로 바꾸는 방안 검토 필요.
- **지원금 차감액 색:** Payment Sidebar의 지원금 차감액(-14,000원)은 빨강으로 표시되지만, Subsidy 색 그룹은 회사 지원금을 초록(`{colors.subsidy-company}`)으로 정의한다. 어느 쪽이 기준인지 확인 필요. 현재는 패턴 화면(빨강)을 따른다.
- **Badge Tone=Delivery:** Figma에 "무료 배송" 배지 variant가 있으나 문서에는 추천도서·일반도서 두 가지만 있다. 테두리·글자색이 변수에 연결돼 있지 않다.
- **그림자:** Shadow/SM·MD는 정의만 있고 사용처가 없다. Side Button 그림자(`0 4px 6px rgba(0,0,0,0.10)`)는 스타일에 연결돼 있지 않다.
- **삭제 후보 색:** state/success 계열 4개와 state/warning은 Figma에서 "삭제 후보"로 표시돼 YAML에서 제외했다. 성공·주의는 Alert 아이콘으로만 구분한다.
- **Input Error variant:** 컴포넌트에 없고 Login Form 패턴에만 있다.
- **Empty 상태, 1280px 미만 레이아웃, 다크 모드, 모바일:** 📋 정의 없음(MVP 범위 밖). -->

---

## 버전 관리

| 버전 | 날짜       | 변경 사항                                | 작성자 |
| ---- | ---------- | ---------------------------------------- | ------ |
| 1.0  | 2026-09-24 | Figma v2.2(node 228:754) 기준 최초 작성. | 김지선 |
