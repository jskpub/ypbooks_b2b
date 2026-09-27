import { useEffect } from 'react';
import { Icon } from '@/components/Icon';

interface DeliveryInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeliveryInfoModal({ isOpen, onClose }: DeliveryInfoModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`cart-modal-overlay${isOpen ? ' is-open' : ''}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="cart-delivery-modal" role="dialog" aria-modal="true" aria-labelledby="cart-delivery-modal-title">
        <div className="cart-delivery-modal__header">
          <p className="cart-delivery-modal__title" id="cart-delivery-modal-title">
            [주문/배송] 배송 안내
          </p>
          <button type="button" className="cart-delivery-modal__close" aria-label="닫기" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>
        <div className="cart-delivery-modal__body">
          <div className="cart-delivery-modal__section">
            <h3 className="cart-delivery-modal__section-title">예상수령일</h3>
            <ol className="cart-delivery-modal__list">
              <li className="cart-delivery-modal__item">
                <span className="cart-delivery-modal__num">①</span>
                <span className="cart-delivery-modal__text">
                  서울·수도권의 11시~12시 대 2권 이상 주문은 당일배송 안될 수 있습니다.
                </span>
              </li>
              <li className="cart-delivery-modal__item">
                <span className="cart-delivery-modal__num">②</span>
                <span className="cart-delivery-modal__text">
                  발송예정일이 5일 이내 '출고예정'인 상품의 경우(결제일로부터 7일 동안 미입고), 출판사/유통사 사정으로
                  품절·절판되어 구입이 어려울 수 있습니다. 이 경우 SMS, 메일로 알려드립니다.
                </span>
              </li>
              <li className="cart-delivery-modal__item">
                <span className="cart-delivery-modal__num">③</span>
                <div className="cart-delivery-modal__content">
                  <span className="cart-delivery-modal__text">예상수령일은 출고 이후 택배사의 배송기간이 포함됩니다.</span>
                  <p className="cart-delivery-modal__example">
                    예) 5일 이내 출고 예정 + 1~2일 (배송기간) = 6~7일 이내 상품 수령 예정
                  </p>
                </div>
              </li>
              <li className="cart-delivery-modal__item">
                <span className="cart-delivery-modal__num">④</span>
                <span className="cart-delivery-modal__text">예상 수령일이 휴일인 경우 익일 배송됩니다.</span>
              </li>
              <li className="cart-delivery-modal__item">
                <span className="cart-delivery-modal__num">⑤</span>
                <span className="cart-delivery-modal__text">주문도서 중 일부상품 품절 시 예상수령일이 지연될 수 있습니다.</span>
              </li>
            </ol>
          </div>
          <div className="cart-delivery-modal__section">
            <h3 className="cart-delivery-modal__section-title">출고예정일</h3>
            <ol className="cart-delivery-modal__list">
              <li className="cart-delivery-modal__item">
                <span className="cart-delivery-modal__num">①</span>
                <span className="cart-delivery-modal__text">
                  주문하신 상품이 발송되는 날이며 출고예정 기간에는 주말, 공휴일이 제외됩니다.
                </span>
              </li>
              <li className="cart-delivery-modal__item">
                <span className="cart-delivery-modal__num">②</span>
                <span className="cart-delivery-modal__text">출고 예정 기간은 주문일부터 계산됩니다.</span>
              </li>
              <li className="cart-delivery-modal__item">
                <span className="cart-delivery-modal__num">③</span>
                <span className="cart-delivery-modal__text">토요일은 당일 배송만 출고됩니다.</span>
              </li>
            </ol>
          </div>
          <div className="cart-delivery-modal__section">
            <h3 className="cart-delivery-modal__section-title">당일배송 배송지</h3>
            <ol className="cart-delivery-modal__list">
              <li className="cart-delivery-modal__item">
                <span className="cart-delivery-modal__num">①</span>
                <span className="cart-delivery-modal__text">
                  자택주소로 입력해주시기 바랍니다. 직장의 경우 익일 배송으로 처리될 수 있으며, 학교는 당일 배송이 불가합니다.
                </span>
              </li>
            </ol>
            <p className="cart-delivery-modal__note">* 당일배송 관련 문의사항은 고객센터로 문의 바랍니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
