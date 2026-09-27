const OTHER_PAYMENT_METHODS = [
  { id: 'credit_card', name: '신용카드' },
  { id: 'toss_pay', name: 'toss pay' },
  { id: 'kakao_pay', name: 'kakao pay' },
  { id: 'naver_pay', name: 'naver pay' },
  { id: 'payco', name: 'PAYCO' },
  { id: 'l_pay', name: 'L.pay' },
  { id: 'ssg_pay', name: 'SSGPAY' },
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
            <label className='radio'>
              <input type='radio' name='payment-method' checked={isOtherMethod} onChange={() => onSelectMethod('credit_card')} />
              다른 결제수단
            </label>

            <div className='payment-method__grid'>
              {OTHER_PAYMENT_METHODS.map((method) => (
                <button key={method.id} type='button' className={`payment-method__grid-btn${selectedMethod === method.id ? ' is-selected' : ''}`} onClick={() => onSelectMethod(method.id)}>
                  {method.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
