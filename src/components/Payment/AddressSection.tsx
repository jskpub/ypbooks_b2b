import { Icon } from '@/components/Icon';
import type { Address } from '@/data/address';

const DELIVERY_MEMO_PRESETS = ['부재시 경비실에 맡겨주세요.', '부재시 전화주시거나 문자 남겨 주세요.', '현관 앞에 놓아주세요.', '배송전 미리 연락주세요.', '파손의 위험이 있습니다. 배송시 주의해주세요.', '직접 수령하겠습니다.'];

interface AddressSectionProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  address: Address;
  onOpenAddressList: () => void;
  onOpenNewAddressForm: () => void;
  onOpenEditAddressForm: () => void;
  deliveryMemo: string;
  isCustomMemo: boolean;
  customMemoText: string;
  onSelectPreset: (memo: string) => void;
  onSelectCustom: () => void;
  onCustomMemoTextChange: (text: string) => void;
}

export default function AddressSection({ isExpanded, onToggleExpand, address, onOpenAddressList, onOpenNewAddressForm, onOpenEditAddressForm, deliveryMemo, isCustomMemo, customMemoText, onSelectPreset, onSelectCustom, onCustomMemoTextChange }: AddressSectionProps) {
  return (
    <div className='cart-group'>
      <button type='button' className='cart-group__header cart-group__toggle' aria-expanded={isExpanded} aria-controls='payment-address-body' onClick={onToggleExpand}>
        <span className='cart-group__title'>배송지</span>
        <span className='cart-group__header-right'>
          <span className='cart-group__chevron cart-group__chevron--down'>
            <Icon name='caret-down' />
          </span>
          <span className='cart-group__chevron cart-group__chevron--up'>
            <Icon name='caret-up' />
          </span>
        </span>
      </button>

      <div className='cart-group__body' id='payment-address-body' hidden={!isExpanded}>
        <div className='payment-address'>
          <div className='payment-address__type'>
            <label className='radio'>
              <input type='radio' name='addr-type' checked readOnly />
              기본 배송지
            </label>
            <label className='radio'>
              <input type='radio' name='addr-type' checked={false} onClick={onOpenNewAddressForm} readOnly />
              신규 배송지
            </label>
            <button type='button' className='btn btn--secondary btn--sm payment-address__list-btn' onClick={onOpenAddressList}>
              배송지 목록
            </button>
          </div>

          <div className='cart-address'>
            <div className='cart-address__head'>
              <span className='cart-address__title'>
                {address.title} ({address.recipient})
              </span>
              <button type='button' className='btn btn--tertiary btn--sm' onClick={onOpenEditAddressForm}>
                배송지 정보 수정
              </button>
            </div>
            <p className='payment-address__phone'>{address.phone1}</p>
            <p className='payment-address__line'>
              ({address.postalCode}) {address.roadAddress} {address.detailAddress}
            </p>
            <p className='payment-address__line payment-address__line--muted'>{address.jibunAddress}</p>
          </div>

          <div className='payment-address__memo'>
            <label className='field__label' htmlFor='payment-delivery-memo'>
              배송 메모
            </label>
            <div className='payment-address__memo-content'>
              <select
                id='payment-delivery-memo'
                className='field__input'
                value={isCustomMemo ? '직접 입력' : deliveryMemo}
                onChange={(event) => {
                  if (event.target.value === '직접 입력') onSelectCustom();
                  else onSelectPreset(event.target.value);
                }}
              >
                {DELIVERY_MEMO_PRESETS.map((preset) => (
                  <option key={preset} value={preset}>
                    {preset}
                  </option>
                ))}
                <option value='직접 입력'>요청사항을 직접 입력합니다.</option>
              </select>

              {isCustomMemo && (
                <div className='payment-address__custom-memo'>
                  <input type='text' className='field__input' value={customMemoText} onChange={(event) => onCustomMemoTextChange(event.target.value.slice(0, 30))} maxLength={30} placeholder='요청사항을 입력해주세요' />
                  <span className='payment-address__memo-count caption'>{customMemoText.length}/30자</span>
                </div>
              )}

              <p className='field__help'>택배사 송장에 표기되는 메시지입니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
