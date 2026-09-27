import { Icon } from '@/components/Icon';

interface PaymentProcessingModalProps {
  isOpen: boolean;
}

export default function PaymentProcessingModal({ isOpen }: PaymentProcessingModalProps) {
  return (
    <div className={`modal-overlay${isOpen ? ' is-open' : ''}`} aria-hidden={!isOpen}>
      <div className='modal payment-processing' role='status' aria-live='polite'>
        <Icon name='arrows-clockwise' className='icon payment-processing__spinner' />
        <p className='modal__title'>결제 진행 중입니다…</p>
        <p className='modal__body'>잠시만 기다려 주세요.</p>
      </div>
    </div>
  );
}
