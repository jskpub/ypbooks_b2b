import { useRef } from 'react';
import { Icon } from '@/components/Icon';
import { usePostcodeSearch, type PostcodeResult } from '@/hooks/usePostcodeSearch';

interface AddressSearchModalProps {
  onSelect: (result: PostcodeResult) => void;
  onClose: () => void;
}

// AddressModal의 [주소 검색] 버튼에서 열리는 2단계 팝업. 카카오(다음) 우편번호 서비스를
// iframe으로 그대로 embed하되(내부 콘텐츠 자체는 우리가 못 바꾼다), 감싸는 헤더·모서리·여백은
// 이 프로젝트 디자인 시스템(modal--brand) 톤에 맞춰서 튀지 않게 둔다.
export default function AddressSearchModal({ onSelect, onClose }: AddressSearchModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { status, retry } = usePostcodeSearch(containerRef, true, onSelect);

  return (
    <div
      className='modal-overlay is-open'
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className='modal modal--brand address-search' role='dialog' aria-modal='true' aria-labelledby='address-search-title'>
        <div className='modal__header'>
          <p className='modal__title' id='address-search-title'>
            주소 검색
          </p>
          <button type='button' className='modal__close' aria-label='닫기' onClick={onClose}>
            <Icon name='x' />
          </button>
        </div>

        <div className='address-search__frame'>
          <div ref={containerRef} className='address-search__iframe' />
          {status === 'loading' && (
            <div className='address-search__status'>
              <Icon name='arrows-clockwise' className='icon address-search__spinner' />
              <span className='caption'>주소 검색을 불러오는 중입니다...</span>
            </div>
          )}
          {status === 'error' && (
            <div className='address-search__status'>
              <span className='caption'>주소 검색 서비스를 불러오지 못했습니다.</span>
              <button type='button' className='btn btn--secondary btn--sm' onClick={retry}>
                다시 시도
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
