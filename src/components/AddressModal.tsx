import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Icon } from '@/components/Icon';
import AddressSearchModal from '@/components/AddressSearchModal';
import { useCart } from '@/context/CartContext';
import type { PostcodeResult } from '@/hooks/usePostcodeSearch';
import type { Address } from '@/data/address';

interface AddressForm {
  title: string;
  recipient: string;
  phonePrefix: string;
  phoneMid: string;
  phoneEnd: string;
  phone2Prefix: string;
  phone2Mid: string;
  phone2End: string;
  postalCode: string;
  roadAddress: string;
  jibunAddress: string;
  detailAddress: string;
  isDefault: boolean;
}

const EMPTY_FORM: AddressForm = {
  title: '',
  recipient: '',
  phonePrefix: '010',
  phoneMid: '',
  phoneEnd: '',
  phone2Prefix: '',
  phone2Mid: '',
  phone2End: '',
  postalCode: '',
  roadAddress: '',
  jibunAddress: '',
  detailAddress: '',
  isDefault: false,
};

function splitPhone(phone?: string) {
  const [prefix, mid, end] = (phone ?? '').split('-');
  return prefix && mid && end ? { prefix, mid, end } : { prefix: '', mid: '', end: '' };
}

interface FormErrors {
  recipient?: string;
  phone?: string;
  roadAddress?: string;
}

// YP_PAYMENTS DeliveryModal(E:\YP_PAYMENTS\src\components\DeliveryModal.tsx) 이식. 원본은 주소록/최근배송지/
// 신규등록 3탭이지만 이 프로젝트는 "최근 배송지"가 목록과 같은 데이터를 재사용하는 가짜 탭이라 빼고
// 목록/등록 2탭으로 단순화했다. 주소 검색은 카카오(다음) 우편번호 서비스(usePostcodeSearch)를
// AddressSearchModal에서 그대로 embed해서 쓴다.
export default function AddressModal() {
  const { addresses, selectedAddress, isAddressModalOpen, addressModalMode, editingAddressId, openAddressList, openAddressForm, closeAddressModal, selectAddress, saveAddress } = useCart();
  const editingAddress = addresses.find((address) => address.id === editingAddressId) ?? null;

  const [form, setForm] = useState<AddressForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isAddressSearchOpen, setIsAddressSearchOpen] = useState(false);
  const recipientRef = useRef<HTMLInputElement>(null);
  const phoneMidRef = useRef<HTMLInputElement>(null);
  const addressSearchBtnRef = useRef<HTMLButtonElement>(null);

  // 모달이 열리거나 목록/등록 탭이 바뀔 때마다 폼을 다시 채운다 — 수정 진입 시 기존 값을, 신규 진입 시 빈 값을.
  useEffect(() => {
    if (!isAddressModalOpen || addressModalMode !== 'form') return;
    if (editingAddress) {
      const phone = splitPhone(editingAddress.phone1);
      const phone2 = splitPhone(editingAddress.phone2);
      setForm({
        title: editingAddress.title,
        recipient: editingAddress.recipient,
        phonePrefix: phone.prefix || '010',
        phoneMid: phone.mid,
        phoneEnd: phone.end,
        phone2Prefix: phone2.prefix,
        phone2Mid: phone2.mid,
        phone2End: phone2.end,
        postalCode: editingAddress.postalCode,
        roadAddress: editingAddress.roadAddress,
        jibunAddress: editingAddress.jibunAddress,
        detailAddress: editingAddress.detailAddress,
        isDefault: editingAddress.isDefault,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
    setIsAddressSearchOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddressModalOpen, addressModalMode, editingAddressId]);

  useEffect(() => {
    if (!isAddressModalOpen) return;
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAddressModal();
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [isAddressModalOpen, closeAddressModal]);

  const handleSelectAddressResult = (result: PostcodeResult) => {
    setForm((prev) => ({ ...prev, postalCode: result.zonecode, roadAddress: result.roadAddress, jibunAddress: result.jibunAddress || result.autoJibunAddress }));
    setErrors((prev) => ({ ...prev, roadAddress: undefined }));
    setIsAddressSearchOpen(false);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: FormErrors = {};
    if (!form.recipient.trim()) nextErrors.recipient = '수령인을 입력해 주세요.';
    if (!form.phoneMid.trim() || !form.phoneEnd.trim()) nextErrors.phone = '연락처를 정확히 입력해 주세요.';
    if (!form.roadAddress.trim()) nextErrors.roadAddress = '[주소 검색] 버튼을 눌러 주소를 검색해 주세요.';
    setErrors(nextErrors);

    if (nextErrors.recipient) return recipientRef.current?.focus();
    if (nextErrors.phone) return phoneMidRef.current?.focus();
    if (nextErrors.roadAddress) return addressSearchBtnRef.current?.focus();

    const data: Omit<Address, 'id'> = {
      title: form.title.trim() || `${form.recipient.trim()}님의 배송지`,
      recipient: form.recipient.trim(),
      phone1: `${form.phonePrefix}-${form.phoneMid}-${form.phoneEnd}`,
      phone2: form.phone2Mid.trim() && form.phone2End.trim() ? `${form.phone2Prefix || '02'}-${form.phone2Mid}-${form.phone2End}` : undefined,
      postalCode: form.postalCode,
      roadAddress: form.roadAddress,
      jibunAddress: form.jibunAddress || form.roadAddress,
      detailAddress: form.detailAddress.trim(),
      isDefault: form.isDefault,
    };
    saveAddress(data, editingAddressId);
  };

  return (
    <>
      <div
        // 주소 검색 팝업이 열려 있는 동안엔 이 오버레이를 잠깐 숨긴다 — 두 모달의 딤(배경)이 겹쳐서
        // 뜨면 이중 팝업처럼 보이던 문제. is-open을 뗐다가 다시 붙이면 기존 트랜지션 그대로 부드럽게
        // 사라졌다 나타난다. AddressSearchModal은 이 div 밖(형제)으로 빼야 한다 — 안에 두면
        // visibility:hidden/opacity:0/pointer-events:none이 자식인 검색 팝업까지 같이 덮어버린다.
        className={`modal-overlay${isAddressModalOpen && !isAddressSearchOpen ? ' is-open' : ''}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeAddressModal();
        }}
      >
        <div className='modal modal--brand address-modal' role='dialog' aria-modal='true' aria-labelledby='address-modal-title'>
          <div className='modal__header'>
            <p className='modal__title' id='address-modal-title'>
              배송지 {addressModalMode === 'list' ? '목록' : editingAddressId ? '수정' : '등록'}
            </p>
            <button type='button' className='modal__close' aria-label='닫기' onClick={closeAddressModal}>
              <Icon name='x' />
            </button>
          </div>

          <div className='address-modal__tabs' role='tablist'>
            <button type='button' role='tab' aria-selected={addressModalMode === 'list'} className={`tab-item${addressModalMode === 'list' ? ' is-active' : ''}`} onClick={openAddressList}>
              배송지 목록
            </button>
            <button type='button' role='tab' aria-selected={addressModalMode === 'form'} className={`tab-item${addressModalMode === 'form' ? ' is-active' : ''}`} onClick={() => openAddressForm()}>
              배송지 등록/수정
            </button>
          </div>

          {addressModalMode === 'list' ? (
            <div className='modal__body address-modal__list'>
              {addresses.map((address) => {
                const isSelected = address.id === selectedAddress.id;
                return (
                  <div key={address.id} className={`address-modal__item${isSelected ? ' is-selected' : ''}`}>
                    <button type='button' className='address-modal__item-select' onClick={() => selectAddress(address.id)}>
                      <span className='address-modal__item-head'>
                        <span className='address-modal__item-title'>
                          {isSelected && <Icon name='check-circle' className='icon address-modal__item-check' />}
                          {address.title} ({address.recipient})
                        </span>
                        {address.isDefault && <span className='status-chip status-chip--available'>기본배송지</span>}
                      </span>
                      <span className='address-modal__item-line caption'>
                        <Icon name='device-mobile' className='icon address-modal__item-icon' />
                        {address.phone1}
                      </span>
                      <span className='address-modal__item-line caption'>
                        ({address.postalCode}) {address.roadAddress} {address.detailAddress}
                      </span>
                    </button>
                    <button type='button' className='btn btn--secondary btn--md address-modal__item-edit' onClick={() => openAddressForm(address.id)}>
                      수정
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <form className='modal__body address-modal__form' onSubmit={handleSubmit} noValidate>
              <div className='address-modal__row'>
                <label className='address-modal__row-label field__label' htmlFor='address-title'>
                  배송지명
                </label>
                <div className='address-modal__row-content'>
                  <input id='address-title' type='text' className='field__input' placeholder='배송지명을 입력하세요 (예: 자택, 회사)' value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
                </div>
              </div>

              <div className={`address-modal__row${errors.recipient ? ' is-error' : ''}`}>
                <label className='address-modal__row-label field__label' htmlFor='address-recipient'>
                  수령인{' '}
                  <span className='field__required' aria-hidden='true'>
                    *
                  </span>
                </label>
                <div className='address-modal__row-content'>
                  <input
                    id='address-recipient'
                    ref={recipientRef}
                    type='text'
                    className='field__input'
                    placeholder='수령인 이름을 입력하세요'
                    required
                    aria-required='true'
                    aria-invalid={!!errors.recipient}
                    aria-describedby={errors.recipient ? 'address-recipient-error' : undefined}
                    value={form.recipient}
                    onChange={(event) => setForm((prev) => ({ ...prev, recipient: event.target.value }))}
                  />
                  {errors.recipient && (
                    <span id='address-recipient-error' className='field__help' role='alert'>
                      {errors.recipient}
                    </span>
                  )}
                </div>
              </div>

              <div className={`address-modal__row${errors.phone ? ' is-error' : ''}`}>
                <span className='address-modal__row-label field__label' id='address-phone-label'>
                  연락처1{' '}
                  <span className='field__required' aria-hidden='true'>
                    *
                  </span>
                </span>
                <div className='address-modal__row-content'>
                  <div className='address-modal__phone-group' role='group' aria-labelledby='address-phone-label'>
                    <select className='field__input' aria-label='통신사 코드' value={form.phonePrefix} onChange={(event) => setForm((prev) => ({ ...prev, phonePrefix: event.target.value }))}>
                      <option value='010'>010</option>
                      <option value='011'>011</option>
                      <option value='02'>02</option>
                    </select>
                    <span aria-hidden='true'>-</span>
                    <input
                      type='text'
                      className='field__input'
                      ref={phoneMidRef}
                      aria-label='연락처 중간 번호'
                      aria-required='true'
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'address-phone-error' : undefined}
                      maxLength={4}
                      value={form.phoneMid}
                      onChange={(event) => setForm((prev) => ({ ...prev, phoneMid: event.target.value.replace(/\D/g, '') }))}
                    />
                    <span aria-hidden='true'>-</span>
                    <input type='text' className='field__input' aria-label='연락처 끝 번호' aria-required='true' maxLength={4} value={form.phoneEnd} onChange={(event) => setForm((prev) => ({ ...prev, phoneEnd: event.target.value.replace(/\D/g, '') }))} />
                  </div>
                  {errors.phone && (
                    <span id='address-phone-error' className='field__help' role='alert'>
                      {errors.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className='address-modal__row'>
                <span className='address-modal__row-label field__label' id='address-phone2-label'>
                  연락처2
                </span>
                <div className='address-modal__row-content'>
                  <div className='address-modal__phone-group' role='group' aria-labelledby='address-phone2-label'>
                    <select className='field__input' aria-label='통신사 코드(선택)' value={form.phone2Prefix} onChange={(event) => setForm((prev) => ({ ...prev, phone2Prefix: event.target.value }))}>
                      <option value=''>선택</option>
                      <option value='010'>010</option>
                      <option value='02'>02</option>
                      <option value='031'>031</option>
                    </select>
                    <span aria-hidden='true'>-</span>
                    <input type='text' className='field__input' aria-label='연락처2 중간 번호' maxLength={4} value={form.phone2Mid} onChange={(event) => setForm((prev) => ({ ...prev, phone2Mid: event.target.value.replace(/\D/g, '') }))} />
                    <span aria-hidden='true'>-</span>
                    <input type='text' className='field__input' aria-label='연락처2 끝 번호' maxLength={4} value={form.phone2End} onChange={(event) => setForm((prev) => ({ ...prev, phone2End: event.target.value.replace(/\D/g, '') }))} />
                  </div>
                </div>
              </div>

              <div className={`address-modal__row${errors.roadAddress ? ' is-error' : ''}`}>
                <span className='address-modal__row-label field__label' id='address-road-label'>
                  배송지 주소{' '}
                  <span className='field__required' aria-hidden='true'>
                    *
                  </span>
                </span>
                <div className='address-modal__row-content'>
                  <div className='address-modal__postal-row'>
                    <input type='text' className='field__input' aria-label='우편번호' value={form.postalCode} readOnly placeholder='우편번호' />
                    <button type='button' ref={addressSearchBtnRef} className='btn btn--secondary btn--sm' aria-invalid={!!errors.roadAddress} aria-describedby={errors.roadAddress ? 'address-road-error' : undefined} onClick={() => setIsAddressSearchOpen(true)}>
                      주소 검색
                    </button>
                  </div>

                  <p className='address-modal__hint caption'>
                    <Icon name='info' className='icon address-modal__hint-icon' />
                    <span>주소 입력 시 반드시 [주소 검색] 버튼을 클릭하여 주소를 입력해 주세요.</span>
                  </p>

                  <div className='address-modal__sub-row'>
                    <span className='address-modal__sub-label'>도로명</span>
                    <input type='text' className='field__input' aria-label='도로명주소' value={form.roadAddress} readOnly placeholder='주소 검색으로 입력됩니다' />
                  </div>
                  <div className='address-modal__sub-row'>
                    <span className='address-modal__sub-label'>지번</span>
                    <input type='text' className='field__input' aria-label='지번주소' value={form.jibunAddress} readOnly />
                  </div>
                  <div className='address-modal__sub-row'>
                    <span className='address-modal__sub-label'>상세주소</span>
                    <input type='text' className='field__input' aria-label='상세주소' value={form.detailAddress} onChange={(event) => setForm((prev) => ({ ...prev, detailAddress: event.target.value }))} placeholder='상세주소를 입력해주세요' />
                  </div>

                  {errors.roadAddress && (
                    <span id='address-road-error' className='field__help' role='alert'>
                      {errors.roadAddress}
                    </span>
                  )}
                </div>
              </div>

              <div className='address-modal__row'>
                <span className='address-modal__row-label' aria-hidden='true' />
                <div className='address-modal__row-content'>
                  <label className='checkbox'>
                    <input type='checkbox' checked={form.isDefault} onChange={(event) => setForm((prev) => ({ ...prev, isDefault: event.target.checked }))} />
                    기본배송지로 선택
                  </label>
                </div>
              </div>

              <div className='modal__footer'>
                <button type='button' className='btn btn--secondary' onClick={closeAddressModal}>
                  취소
                </button>
                <button type='submit' className='btn btn--primary'>
                  {editingAddressId ? '수정 완료' : '저장'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {isAddressSearchOpen && <AddressSearchModal onSelect={handleSelectAddressResult} onClose={() => setIsAddressSearchOpen(false)} />}
    </>
  );
}
