export interface ColorChip {
  name: string;
  hex: string;
}

export interface ColorFamily {
  label: string;
  chips: ColorChip[];
}

export const atomicColorFamilies: ColorFamily[] = [
  {
    label: 'red',
    chips: [
      { name: 'red/50', hex: '#ffeeed' },
      { name: 'red/100', hex: '#fdd9d8' },
      { name: 'red/300', hex: '#f47d7b' },
      { name: 'red/500', hex: '#e01e1a' },
      { name: 'red/600', hex: '#c61a17' },
      { name: 'red/700', hex: '#aa1714' },
    ],
  },
  {
    label: 'neutral',
    chips: [
      { name: 'neutral/0', hex: '#ffffff' },
      { name: 'neutral/50', hex: '#fafafa' },
      { name: 'neutral/100', hex: '#f5f4f4' },
      { name: 'neutral/200', hex: '#e9e7e8' },
      { name: 'neutral/300', hex: '#d6d3d4' },
      { name: 'neutral/400', hex: '#aba6a7' },
      { name: 'neutral/550', hex: '#6f696b' },
      { name: 'neutral/600', hex: '#555152' },
      { name: 'neutral/700', hex: '#3d3b3b' },
      { name: 'neutral/800', hex: '#262425' },
      { name: 'neutral/900', hex: '#191818' },
    ],
  },
  {
    label: 'green',
    chips: [
      { name: 'green/50', hex: '#eaf7ef' },
      { name: 'green/100', hex: '#bee7cf' },
      { name: 'green/500', hex: '#1c8a4b' },
      { name: 'green/600', hex: '#157a40' },
    ],
  },
  {
    label: 'amber',
    chips: [
      { name: 'amber/50', hex: '#fff6e5' },
      { name: 'amber/100', hex: '#f5dfa6' },
      { name: 'amber/500', hex: '#c77700' },
      { name: 'amber/700', hex: '#8a5700' },
    ],
  },
  {
    label: 'blue',
    chips: [
      { name: 'blue/50', hex: '#eaf1ff' },
      { name: 'blue/100', hex: '#c9dbff' },
      { name: 'blue/500', hex: '#2563eb' },
      { name: 'blue/700', hex: '#1d4fbf' },
    ],
  },
];

export interface SemanticRow {
  hex: string;
  figmaVar: string;
  cssVar: string;
  figmaValue: string;
  codeValue: string;
  codeValueDiffers: boolean;
  usage: string;
  contrast: string;
}

export interface SemanticGroup {
  title: string;
  desc: string;
  rows: SemanticRow[];
}

export const semanticColorGroups: SemanticGroup[] = [
  {
    title: 'Surface',
    desc: '화면과 컴포넌트의 바탕색입니다.',
    rows: [
      { hex: '#fafafa', figmaVar: 'surface/page', cssVar: '--color-canvas', figmaValue: '#fafafa', codeValue: '#ffffff', codeValueDiffers: true, usage: '페이지 배경', contrast: '-' },
      { hex: '#ffffff', figmaVar: 'surface/card', cssVar: '--color-surface-card', figmaValue: '#ffffff', codeValue: '신규 제안', codeValueDiffers: false, usage: '카드, 모달, 입력 배경', contrast: '-' },
      { hex: '#f5f4f4', figmaVar: 'surface/sunken', cssVar: '--color-surface', figmaValue: '#f5f4f4', codeValue: '#f6f6f6', codeValueDiffers: true, usage: '약한 구획, 비활성 영역', contrast: '-' },
      { hex: '#e01e1a', figmaVar: 'surface/brand', cssVar: '--color-primary', figmaValue: '#e01e1a', codeValue: '#e01e1a', codeValueDiffers: false, usage: '주요 버튼, 선택 상태', contrast: '-' },
      { hex: '#c61a17', figmaVar: 'surface/brand-hover', cssVar: '--color-primary-hover', figmaValue: '#c61a17', codeValue: '#ea2e2e', codeValueDiffers: true, usage: '주요 버튼 hover', contrast: '-' },
      { hex: '#aa1714', figmaVar: 'surface/brand-pressed', cssVar: '--color-primary-pressed', figmaValue: '#aa1714', codeValue: '신규 제안', codeValueDiffers: false, usage: '주요 버튼 눌림', contrast: '-' },
      { hex: '#ffeeed', figmaVar: 'surface/brand-subtle', cssVar: '--color-primary-soft', figmaValue: '#ffeeed', codeValue: '#ffebeb', codeValueDiffers: true, usage: '추천도서 배지, 연한 강조 배경', contrast: '-' },
    ],
  },
  {
    title: 'Text',
    desc: '글자색입니다. 흰 배경 위 대비를 함께 적었습니다.',
    rows: [
      { hex: '#191818', figmaVar: 'text/primary', cssVar: '--color-foreground', figmaValue: '#191818', codeValue: '#181718', codeValueDiffers: true, usage: '제목, 본문', contrast: '17.72:1' },
      { hex: '#555152', figmaVar: 'text/secondary', cssVar: '--color-foreground-secondary', figmaValue: '#555152', codeValue: '#595959', codeValueDiffers: true, usage: '보조 설명', contrast: '7.82:1' },
      { hex: '#6f696b', figmaVar: 'text/tertiary', cssVar: '--color-muted', figmaValue: '#6f696b', codeValue: '#9c9c9c', codeValueDiffers: true, usage: '도움말, placeholder', contrast: '5.36:1' },
      { hex: '#aba6a7', figmaVar: 'text/disabled', cssVar: '--color-disabled-text', figmaValue: '#aba6a7', codeValue: '#9c9c9c', codeValueDiffers: true, usage: '비활성 텍스트', contrast: '비활성 예외' },
      { hex: '#ffffff', figmaVar: 'text/on-brand', cssVar: '--color-on-primary', figmaValue: '#ffffff', codeValue: '신규 제안', codeValueDiffers: false, usage: '빨간 배경 위 글자', contrast: '4.81:1 (빨강 위)' },
      { hex: '#e01e1a', figmaVar: 'text/brand', cssVar: '--color-primary', figmaValue: '#e01e1a', codeValue: '#e01e1a', codeValueDiffers: false, usage: '강조 금액, 필수 표시', contrast: '4.81:1' },
      { hex: '#c61a17', figmaVar: 'text/link', cssVar: '--color-link', figmaValue: '#c61a17', codeValue: '신규 제안', codeValueDiffers: false, usage: '텍스트 링크', contrast: '5.90:1' },
      { hex: '#aa1714', figmaVar: 'text/on-brand-subtle', cssVar: '--color-on-primary-soft', figmaValue: '#aa1714', codeValue: '신규 제안', codeValueDiffers: false, usage: '연한 빨강 배경 위 글자', contrast: '7.39:1' },
    ],
  },
  {
    title: 'Border',
    desc: '테두리와 포커스 링입니다.',
    rows: [
      { hex: '#e9e7e8', figmaVar: 'border/default', cssVar: '--color-border', figmaValue: '#e9e7e8', codeValue: '#cbd2d4', codeValueDiffers: true, usage: '입력, 카드, 구분선', contrast: '-' },
      { hex: '#d6d3d4', figmaVar: 'border/strong', cssVar: '--color-border-strong', figmaValue: '#d6d3d4', codeValue: '#9da6a8', codeValueDiffers: true, usage: 'hover, 강조 테두리', contrast: '-' },
      { hex: '#6f696b', figmaVar: 'border/control', cssVar: '--color-border-control', figmaValue: '#6f696b', codeValue: '신규 제안', codeValueDiffers: false, usage: '입력, 체크박스, 라디오 테두리', contrast: '5.36:1' },
      { hex: '#e01e1a', figmaVar: 'border/brand', cssVar: '--input-border-focus', figmaValue: '#e01e1a', codeValue: '#e01e1a', codeValueDiffers: false, usage: '선택된 항목 테두리', contrast: '-' },
      { hex: '#2563eb', figmaVar: 'focus-ring', cssVar: '--color-focus-ring', figmaValue: '#2563eb', codeValue: '신규 제안', codeValueDiffers: false, usage: '키보드 포커스 링', contrast: '-' },
    ],
  },
  {
    title: 'State',
    desc: '결과와 상태를 알리는 색입니다. 알림, 배지, 게이지에만 씁니다.',
    rows: [
      { hex: '#157a40', figmaVar: 'state/success', cssVar: '--color-success', figmaValue: '#157a40', codeValue: '#1f976b', codeValueDiffers: true, usage: '완료, 지원 가능 텍스트', contrast: '5.40:1' },
      { hex: '#eaf7ef', figmaVar: 'state/success-bg', cssVar: '--color-success-soft', figmaValue: '#eaf7ef', codeValue: '신규 제안', codeValueDiffers: false, usage: '성공 알림 배경', contrast: '-' },
      { hex: '#1c8a4b', figmaVar: 'state/success-icon', cssVar: '--color-success-icon', figmaValue: '#1c8a4b', codeValue: '신규 제안', codeValueDiffers: false, usage: '성공 아이콘', contrast: '-' },
      { hex: '#bee7cf', figmaVar: 'state/success-border', cssVar: '--color-success-border', figmaValue: '#bee7cf', codeValue: '신규 제안', codeValueDiffers: false, usage: '성공 알림 테두리', contrast: '-' },
      { hex: '#8a5700', figmaVar: 'state/warning', cssVar: '--color-warning', figmaValue: '#8a5700', codeValue: '#ee293b', codeValueDiffers: true, usage: '한도 임박 텍스트', contrast: '6.10:1' },
      { hex: '#fff6e5', figmaVar: 'state/warning-bg', cssVar: '--color-warning-soft', figmaValue: '#fff6e5', codeValue: '신규 제안', codeValueDiffers: false, usage: '경고 알림 배경', contrast: '-' },
      { hex: '#c77700', figmaVar: 'state/warning-icon', cssVar: '--color-warning-icon', figmaValue: '#c77700', codeValue: '신규 제안', codeValueDiffers: false, usage: '경고 아이콘', contrast: '-' },
      { hex: '#f5dfa6', figmaVar: 'state/warning-border', cssVar: '--color-warning-border', figmaValue: '#f5dfa6', codeValue: '신규 제안', codeValueDiffers: false, usage: '경고 알림 테두리', contrast: '-' },
      { hex: '#aa1714', figmaVar: 'state/danger', cssVar: '--color-danger', figmaValue: '#aa1714', codeValue: '#e01e1a', codeValueDiffers: true, usage: '오류, 한도 초과 텍스트', contrast: '7.39:1' },
      { hex: '#ffeeed', figmaVar: 'state/danger-bg', cssVar: '--color-danger-soft', figmaValue: '#ffeeed', codeValue: '#ffebeb', codeValueDiffers: true, usage: '오류 알림 배경', contrast: '-' },
      { hex: '#e01e1a', figmaVar: 'state/danger-icon', cssVar: '--color-danger-icon', figmaValue: '#e01e1a', codeValue: '신규 제안', codeValueDiffers: false, usage: '오류 아이콘', contrast: '-' },
      { hex: '#fdd9d8', figmaVar: 'state/danger-border', cssVar: '--color-danger-border', figmaValue: '#fdd9d8', codeValue: '신규 제안', codeValueDiffers: false, usage: '오류 알림 테두리', contrast: '-' },
      { hex: '#1d4fbf', figmaVar: 'state/info', cssVar: '--color-info', figmaValue: '#1d4fbf', codeValue: '신규 제안', codeValueDiffers: false, usage: '안내 텍스트', contrast: '7.18:1' },
      { hex: '#eaf1ff', figmaVar: 'state/info-bg', cssVar: '--color-info-soft', figmaValue: '#eaf1ff', codeValue: '신규 제안', codeValueDiffers: false, usage: '안내 알림 배경', contrast: '-' },
      { hex: '#c9dbff', figmaVar: 'state/info-border', cssVar: '--color-info-border', figmaValue: '#c9dbff', codeValue: '신규 제안', codeValueDiffers: false, usage: '안내 알림 테두리', contrast: '-' },
    ],
  },
  {
    title: 'Subsidy',
    desc: '이 서비스 전용입니다. 회사 지원금과 본인 부담금을 구분합니다.',
    rows: [
      { hex: '#157a40', figmaVar: 'subsidy/company', cssVar: '--color-subsidy-company', figmaValue: '#157a40', codeValue: '신규 제안', codeValueDiffers: false, usage: '회사 지원금 금액', contrast: '5.40:1' },
      { hex: '#eaf7ef', figmaVar: 'subsidy/company-bg', cssVar: '--color-subsidy-company-soft', figmaValue: '#eaf7ef', codeValue: '신규 제안', codeValueDiffers: false, usage: '회사 지원금 영역 배경', contrast: '-' },
      { hex: '#1c8a4b', figmaVar: 'subsidy/company-icon', cssVar: '--color-subsidy-company-icon', figmaValue: '#1c8a4b', codeValue: '신규 제안', codeValueDiffers: false, usage: '회사 지원금 아이콘', contrast: '-' },
      { hex: '#191818', figmaVar: 'subsidy/employee', cssVar: '--color-subsidy-employee', figmaValue: '#191818', codeValue: '신규 제안', codeValueDiffers: false, usage: '본인 부담금 금액', contrast: '17.72:1' },
      { hex: '#f5f4f4', figmaVar: 'subsidy/employee-bg', cssVar: '--color-subsidy-employee-soft', figmaValue: '#f5f4f4', codeValue: '신규 제안', codeValueDiffers: false, usage: '본인 부담금 영역 배경', contrast: '-' },
    ],
  },
];

export interface TypographyRow {
  styleName: string;
  sampleClassName: string;
  sampleText: string;
  sizeLineHeight: string;
  weight: string;
  usage: string;
}

export const typographyRows: TypographyRow[] = [
  { styleName: 'v2/Heading/H1', sampleClassName: 'text-h1', sampleText: '나의 지원금', sizeLineHeight: '24 / 32', weight: 'Bold', usage: '페이지 제목' },
  { styleName: 'v2/Heading/H2', sampleClassName: 'text-h2', sampleText: '결제 정보', sizeLineHeight: '20 / 28', weight: 'Bold', usage: '섹션 제목' },
  { styleName: 'v2/Heading/H3', sampleClassName: 'text-h3', sampleText: '회사 지원금', sizeLineHeight: '17 / 24', weight: 'Medium', usage: '카드 제목, 항목 제목' },
  { styleName: 'v2/Heading/H4', sampleClassName: 'text-h4', sampleText: '도서 정보', sizeLineHeight: '17 / 24', weight: 'Medium', usage: '도서명, 목록 제목' },
  { styleName: 'v2/Body/Large', sampleClassName: 'text-body-lg', sampleText: '도서 가격의 50%(최대 10,000원)까지 회사가 지원합니다.', sizeLineHeight: '18 / 28', weight: 'Regular', usage: '강조 본문, 안내 문장' },
  { styleName: 'v2/Body/Base', sampleClassName: 'text-body-base', sampleText: '이 책은 나에게 필요한 이야기를 담고 있습니다.', sizeLineHeight: '17 / 24', weight: 'Regular', usage: '기본 본문' },
  { styleName: 'v2/Body/Small', sampleClassName: 'text-body-sm', sampleText: '월 1권, 신청자 한정으로 제공됩니다.', sizeLineHeight: '13 / 20', weight: 'Regular', usage: '보조 설명, 표 본문' },
  { styleName: 'v2/Label/Large', sampleClassName: 'label-lg', sampleText: '장바구니 담기', sizeLineHeight: '15 / 20', weight: 'Medium', usage: '버튼 라벨' },
  { styleName: 'v2/Label/Base', sampleClassName: 'label-base', sampleText: '추천도서', sizeLineHeight: '13 / 18', weight: 'Medium', usage: '배지, 탭, 입력 라벨' },
  { styleName: 'v2/Label/Small', sampleClassName: 'label-sm', sampleText: 'CEO 픽', sizeLineHeight: '12 / 16', weight: 'Bold', usage: '리본, 작은 태그' },
  { styleName: 'v2/Caption/Base', sampleClassName: 'caption', sampleText: '2026.09.19 구매', sizeLineHeight: '12 / 18', weight: 'Regular', usage: '날짜, 도움말' },
  { styleName: 'v2/Caption/Strong', sampleClassName: 'caption-strong', sampleText: '잔여 한도 1건', sizeLineHeight: '12 / 18', weight: 'Bold', usage: '상태 강조 캡션' },
  { styleName: 'v2/Numeric/PriceLarge', sampleClassName: 'price-lg', sampleText: '15,000원', sizeLineHeight: '22 / 28', weight: 'Bold', usage: '최종 결제 금액' },
  { styleName: 'v2/Numeric/Price', sampleClassName: 'price', sampleText: '9,000원', sizeLineHeight: '16 / 22', weight: 'Bold', usage: '도서 가격' },
];

export interface SpacingRow {
  variable: string;
  value: string;
  barWidthPx: number;
  code: string;
  usage: string;
}

export const spacingRows: SpacingRow[] = [
  { variable: 'space-1', value: '4px', barWidthPx: 4, code: '--spacing-xs', usage: '아이콘과 라벨 사이' },
  { variable: 'space-2', value: '8px', barWidthPx: 8, code: '--spacing-sm', usage: '배지 안쪽, 촘촘한 간격' },
  { variable: 'space-3', value: '12px', barWidthPx: 12, code: '--spacing-md-sm', usage: '입력 안쪽 세로' },
  { variable: 'space-4', value: '16px', barWidthPx: 16, code: '--spacing-md', usage: '컴포넌트 안쪽 기본' },
  { variable: 'space-5', value: '20px', barWidthPx: 20, code: '없음', usage: '화면 좌우 여백' },
  { variable: 'space-6', value: '24px', barWidthPx: 24, code: '--spacing-lg', usage: '카드 안쪽, 묶음 사이' },
  { variable: 'space-8', value: '32px', barWidthPx: 32, code: '--spacing-xl', usage: '섹션 안쪽 구획' },
  { variable: 'space-10', value: '40px', barWidthPx: 40, code: '없음', usage: '큰 블록 사이' },
  { variable: 'space-12', value: '48px', barWidthPx: 48, code: '--spacing-2xl', usage: '페이지 구획' },
  { variable: 'space-16', value: '64px', barWidthPx: 64, code: '--spacing-3xl', usage: '페이지 위아래 여백' },
];

export interface RadiusCard {
  key: 'sm' | 'md' | 'lg' | 'full';
  name: string;
  value: string;
  desc: string;
  code: string;
}

export const radiusCards: RadiusCard[] = [
  { key: 'sm', name: 'radius-sm', value: '6px', desc: '입력, 소형 버튼, 툴팁', code: '코드: --radius-md (6px)' },
  { key: 'md', name: 'radius-md', value: '10px', desc: '버튼, 알림, 입력 그룹', code: '코드: 코드에 없음 (8px, 12px 혼용)' },
  { key: 'lg', name: 'radius-lg', value: '16px', desc: '카드, 모달', code: '코드: 코드에 없음 (12px)' },
  { key: 'full', name: 'radius-full', value: 'full', desc: '배지, 칩, 지원금 버튼', code: '코드: --radius-full' },
];

export interface GridFactRow {
  label: string;
  value: string;
  code: string;
}

export const gridFactRows: GridFactRow[] = [
  { label: '최소 너비', value: '1280px', code: '--layout-wrap-min-width' },
  { label: '컨테이너 최대 너비', value: '1280px', code: '--layout-inner-max-width' },
  { label: '좌우 여백', value: '20px', code: '--layout-inner-padding' },
  { label: '컬럼과 거터', value: '12컬럼, 거터 24px', code: '없음 (신규 제안)' },
  { label: '결제 사이드바', value: '320px 고정', code: '--layout-sidebar-width' },
  { label: '콘텐츠 사이 간격', value: '24px', code: '--layout-content-gap' },
];

export interface InteractionRow {
  key: 'default' | 'hover' | 'pressed' | 'focus' | 'disabled';
  state: string;
  expression: string;
  variable: string;
  usage: string;
}

export const interactionRows: InteractionRow[] = [
  { key: 'default', state: 'Default', expression: '기본 빨강 배경, 흰 글자', variable: 'surface/brand', usage: '주요 버튼, 선택된 항목' },
  { key: 'hover', state: 'Hover', expression: '한 단계 어둡게', variable: 'surface/brand-hover', usage: '마우스를 올렸을 때' },
  { key: 'pressed', state: 'Pressed', expression: '두 단계 어둡게', variable: 'surface/brand-pressed', usage: '누르고 있는 동안' },
  { key: 'focus', state: 'Focus', expression: '2px 링, 요소와 2px 띄움', variable: 'focus-ring', usage: '키보드로 이동했을 때' },
  { key: 'disabled', state: 'Disabled', expression: '연한 배경, 글자는 text/disabled', variable: 'surface/sunken', usage: '누를 수 없는 상태, 커서 not-allowed' },
];

export interface MotionRow {
  name: string;
  value: string;
  usage: string;
  code: string;
}

export const motionRows: MotionRow[] = [
  { name: 'fast', value: '150ms ease-out', usage: '색, 테두리 전환', code: '--transition-fast' },
  { name: 'base', value: '250ms ease-out', usage: '아코디언 열림, 게이지 채움, 모달 표시', code: '--transition-base' },
];
