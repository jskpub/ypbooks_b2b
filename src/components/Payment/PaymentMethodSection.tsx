import { Icon } from '@/components/Icon';

interface PaymentMethodItem {
  id: string;
  name: string;
  badge?: 'benefit' | 'new';
  badgeText?: string;
  logoType?: 'toss' | 'kakao' | 'naver' | 'payco' | 'lpay' | 'ssg';
}

const OTHER_PAYMENT_METHODS: PaymentMethodItem[] = [
  { id: 'credit_card', name: '신용카드', badge: 'benefit', badgeText: '혜택' },
  { id: 'toss_pay', name: 'toss pay', logoType: 'toss' },
  { id: 'kakao_pay', name: '카카오페이', logoType: 'kakao' },
  { id: 'naver_pay', name: '네이버페이', badge: 'benefit', badgeText: '혜택', logoType: 'naver' },
  { id: 'payco', name: 'PAYCO', badge: 'benefit', badgeText: '혜택', logoType: 'payco' },
  { id: 'l_pay', name: 'L.pay', badge: 'new', badgeText: 'NEW', logoType: 'lpay' },
  { id: 'ssg_pay', name: 'SSGPAY', badge: 'new', badgeText: 'NEW', logoType: 'ssg' },
  { id: 'bank_transfer', name: '무통장입금' },
  { id: 'phone_pay', name: '휴대폰 소액결제' },
  { id: 'global_card', name: '해외발급신용카드' },
  { id: 'book_gift', name: '도서문화상품권' },
];

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  quick_bank: '퀵계좌이체',
  yp_quick_pay: '영풍빠른결제',
  ...Object.fromEntries(OTHER_PAYMENT_METHODS.map((method) => [method.id, method.name])),
};

function renderMethodLogo(method: PaymentMethodItem) {
  switch (method.logoType) {
    case 'toss':
      return (
        <span className='payment-logo payment-logo--toss'>
          <svg className='payment-logo__toss-icon' viewBox='0 0 24 24' width='20' height='20' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <rect width='24' height='24' rx='12' fill='#3182F6' />
            <path d='M7 13.5C7 11 9 9 11.5 9H15v2h-3.5C10.1 11 9 12.1 9 13.5S10.1 16 11.5 16H15v2h-3.5C9 18 7 16 7 13.5z' fill='#FFFFFF' />
            <circle cx='15.5' cy='10' r='1.5' fill='#FFFFFF' />
          </svg>
          <span className='payment-logo__toss-text'>
            toss <strong>pay</strong>
          </span>
        </span>
      );
    case 'kakao':
      return (
        <span className='payment-logo payment-logo--kakao'>
          <span className='payment-logo__kakao-pill'>kakao pay</span>
        </span>
      );
    case 'naver':
      return (
        <span className='payment-logo payment-logo--naver'>
          <span className='payment-logo__naver-pill'>
            <strong>N</strong> pay
          </span>
        </span>
      );
    case 'payco':
      return <span className='payment-logo payment-logo--payco'>PAYCO</span>;
    case 'lpay':
      return <span className='payment-logo payment-logo--lpay'>L.pay</span>;
    case 'ssg':
      return (
        <span className='payment-logo payment-logo--ssg'>
          SSG<span className='payment-logo__ssg-red'>PAY.</span>
        </span>
      );
    default:
      return <span className='payment-logo__name'>{method.name}</span>;
  }
}

interface PaymentMethodSectionProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  selectedMethod: string;
  onSelectMethod: (id: string) => void;
}

export default function PaymentMethodSection({ isExpanded, onToggleExpand, selectedMethod, onSelectMethod }: PaymentMethodSectionProps) {
  const isOtherMethod = !['quick_bank', 'yp_quick_pay'].includes(selectedMethod);

  return (
    <div className='cart-group'>
      <button type='button' className='cart-group__header cart-group__toggle' aria-expanded={isExpanded} aria-controls='payment-method-body' onClick={onToggleExpand}>
        <span className='cart-group__title text-body-sm'>결제수단 (직원 부담금 결제)</span>
        <span className='cart-group__header-right'>
          <span className='cart-group__chevron cart-group__chevron--down' />
          <span className='cart-group__chevron cart-group__chevron--up' />
        </span>
      </button>

      <div className='cart-group__body' id='payment-method-body' hidden={!isExpanded}>
        <div className='payment-method'>
          <label className='radio payment-method__option'>
            <input type='radio' name='payment-method' checked={selectedMethod === 'quick_bank'} onChange={() => onSelectMethod('quick_bank')} />
            <span className='payment-method__option-label'>퀵계좌이체</span>
            <span className='payment-method__option-note caption'>1만원 이상 결제시 0.5% 할인</span>
          </label>

          <label className='radio payment-method__option'>
            <input type='radio' name='payment-method' checked={selectedMethod === 'yp_quick_pay'} onChange={() => onSelectMethod('yp_quick_pay')} />
            <span className='payment-method__option-label'>영풍빠른결제</span>
          </label>

          <div className='payment-method__other'>
            <label className='radio payment-method__other-title'>
              <input type='radio' name='payment-method' checked={isOtherMethod} onChange={() => onSelectMethod('credit_card')} />
              <span>다른 결제수단</span>
            </label>

            <div className='payment-method__grid'>
              {OTHER_PAYMENT_METHODS.map((method) => (
                <button key={method.id} type='button' className={`payment-method__grid-btn${selectedMethod === method.id ? ' is-selected' : ''}`} onClick={() => onSelectMethod(method.id)}>
                  {method.badge && <span className={`payment-method__ribbon payment-method__ribbon--${method.badge}`}>{method.badgeText}</span>}
                  {renderMethodLogo(method)}
                </button>
              ))}
            </div>

            {selectedMethod === 'toss_pay' && (
              <div className='payment-method__toss-notice caption'>
                <span className='payment-method__toss-tag'>
                  <Icon name='info' /> 토스페이먼츠
                </span>
                <span>토스페이먼츠 (Toss Payments) 간편결제 샘플이 선택되었습니다.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
