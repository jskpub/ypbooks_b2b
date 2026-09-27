import { useEffect } from 'react';
import { Icon } from '@/components/Icon';

interface SubsidyConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedWithoutSubsidy: () => void;
  onApplyMaxBenefit: () => void;
}

export default function SubsidyConfirmModal({ isOpen, onClose, onProceedWithoutSubsidy, onApplyMaxBenefit }: SubsidyConfirmModalProps) {
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
      className={`modal-overlay${isOpen ? ' is-open' : ''}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className='modal subsidy-confirm' role='dialog' aria-modal='true' aria-labelledby='subsidy-confirm-title'>
        <div className='modal__header'>
          <span className='subsidy-confirm__icon'>
            <Icon name='sparkle' />
          </span>
          <button type='button' className='modal__close' aria-label='닫기' onClick={onClose}>
            <Icon name='x' />
          </button>
        </div>
        <p className='modal__title' id='subsidy-confirm-title'>
          최대 혜택이 적용되지 않았습니다
        </p>
        <div className='modal__footer'>
          <button type='button' className='btn btn--secondary' onClick={onProceedWithoutSubsidy}>
            그대로 진행
          </button>
          <button type='button' className='btn btn--primary' onClick={onApplyMaxBenefit}>
            <Icon name='sparkle' />
            최대혜택 적용하기
          </button>
        </div>
      </div>
    </div>
  );
}
