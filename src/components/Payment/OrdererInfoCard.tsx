interface OrdererInfoCardProps {
  phonePrefix: string;
  phoneMid: string;
  phoneEnd: string;
  email: string;
  onPhonePrefixChange: (value: string) => void;
  onPhoneMidChange: (value: string) => void;
  onPhoneEndChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

// 로그인/사용자 세션 부재로 주문자 이름 목데이터 고정
const ORDERER_NAME = '김민서';

export default function OrdererInfoCard({ phonePrefix, phoneMid, phoneEnd, email, onPhonePrefixChange, onPhoneMidChange, onPhoneEndChange, onEmailChange }: OrdererInfoCardProps) {
  return (
    <div className='card card--sm orderer-info'>
      <p className='card__title'>주문자 정보</p>

      <div className='field'>
        <span className='field__label'>
          이름{' '}
          <span className='field__required' aria-hidden='true'>
            *
          </span>
        </span>
        <p className='orderer-info__value'>{ORDERER_NAME}</p>
      </div>

      <div className='field'>
        <span className='field__label' id='orderer-phone-label'>
          연락처{' '}
          <span className='field__required' aria-hidden='true'>
            *
          </span>
        </span>
        <div className='orderer-info__phone' role='group' aria-labelledby='orderer-phone-label'>
          <select className='field__input' aria-label='통신사 코드' value={phonePrefix} onChange={(event) => onPhonePrefixChange(event.target.value)}>
            <option value='010'>010</option>
            <option value='011'>011</option>
            <option value='02'>02</option>
          </select>
          <span aria-hidden='true'>-</span>
          <input type='text' className='field__input' aria-label='연락처 중간 번호' aria-required='true' maxLength={4} value={phoneMid} onChange={(event) => onPhoneMidChange(event.target.value.replace(/\D/g, ''))} />
          <span aria-hidden='true'>-</span>
          <input type='text' className='field__input' aria-label='연락처 끝 번호' aria-required='true' maxLength={4} value={phoneEnd} onChange={(event) => onPhoneEndChange(event.target.value.replace(/\D/g, ''))} />
        </div>
      </div>

      <div className='field'>
        <label className='field__label' htmlFor='orderer-email'>
          이메일
        </label>
        <input id='orderer-email' type='email' className='field__input' value={email} onChange={(event) => onEmailChange(event.target.value)} />
      </div>

      <ul className='field__help list-disc caption'>
        <li>주문자 연락처로 주문 관련 알림톡이 발송되므로 <br />정확한 주문자 정보를 입력해 주세요.</li>
        <li>변경한 연락처/이메일은 회원정보에 반영되지 않습니다.</li>
      </ul>
    </div>
  );
}
