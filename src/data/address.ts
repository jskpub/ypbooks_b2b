export interface Address {
  id: string;
  title: string;
  recipient: string;
  phone1: string;
  phone2?: string;
  postalCode: string;
  roadAddress: string;
  detailAddress: string;
  jibunAddress: string;
  isDefault: boolean;
}

/** 장바구니·결제 공통으로 쓰는 배송지 목록의 초기값. */
export const initialAddresses: Address[] = [
  {
    id: 'addr-01',
    title: '집',
    recipient: '김민서',
    phone1: '010-1234-5678',
    postalCode: '03181',
    roadAddress: '서울특별시 종로구 청계천로 41',
    detailAddress: '3층 302호',
    jibunAddress: '서울특별시 종로구 서린동 33',
    isDefault: true,
  },
  {
    id: 'addr-02',
    title: '회사',
    recipient: '김민서 대리',
    phone1: '010-1234-5678',
    postalCode: '06110',
    roadAddress: '서울특별시 강남구 강남대로 542',
    detailAddress: '6층 디지털사업본부 B2B팀',
    jibunAddress: '서울특별시 강남구 논현동 142-3',
    isDefault: false,
  },
];
