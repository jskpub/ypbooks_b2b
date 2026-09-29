import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';

export interface RecommendThumbCarouselItem {
  isbn13: string;
  title: string;
  cover?: string;
}

interface RecommendThumbCarouselProps {
  items: RecommendThumbCarouselItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

interface TrackMetrics {
  thumbWidthPct: number;
  thumbLeftPct: number;
  atStart: boolean;
  atEnd: boolean;
}

const INITIAL_METRICS: TrackMetrics = { thumbWidthPct: 100, thumbLeftPct: 0, atStart: true, atEnd: true };

// BookCarousel과 달리 페이지 단위가 아닌 연속 스크롤 + 하단 진행바로 위치 표시, 스크롤바 thumb 계산 방식 사용
export default function RecommendThumbCarousel({ items, selectedIndex, onSelect }: RecommendThumbCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<TrackMetrics>(INITIAL_METRICS);

  const updateMetrics = () => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const thumbWidthPct = Math.min(100, (el.clientWidth / el.scrollWidth) * 100);
    const ratio = maxScroll <= 0 ? 0 : el.scrollLeft / maxScroll;
    setMetrics({
      thumbWidthPct,
      thumbLeftPct: ratio * (100 - thumbWidthPct),
      atStart: el.scrollLeft <= 0,
      atEnd: el.scrollLeft >= maxScroll - 1,
    });
  };

  useEffect(() => {
    updateMetrics();
  }, [items]);

  const scrollByViewport = (direction: 1 | -1) => {
    trackRef.current?.scrollBy({ left: direction * (trackRef.current.clientWidth || 0), behavior: 'smooth' });
  };

  return (
    <div className='recommend-carousel'>
      <div className='recommend-carousel__row'>
        <button type='button' className='side-button side-button--sm side-button--prev' aria-label='이전 도서' disabled={metrics.atStart} onClick={() => scrollByViewport(-1)}>
          <Icon name='caret-right' />
        </button>
        <div className='recommend-carousel__track' role='tablist' aria-label='추천도서 목록' ref={trackRef} onScroll={updateMetrics}>
          {items.map((book, index) => (
            <button
              key={book.isbn13}
              type='button'
              role='tab'
              aria-selected={index === selectedIndex}
              className={`recommend-carousel__item${index === selectedIndex ? ' is-active' : ''}`}
              onClick={() => onSelect(index)}
            >
              {book.cover ? <img src={book.cover} alt={book.title} /> : null}
            </button>
          ))}
        </div>
        <button type='button' className='side-button side-button--sm side-button--next' aria-label='다음 도서' disabled={metrics.atEnd} onClick={() => scrollByViewport(1)}>
          <Icon name='caret-right' />
        </button>
      </div>
      <div className='recommend-carousel__progress'>
        <div className='recommend-carousel__progress-fill' style={{ width: `${metrics.thumbWidthPct}%`, left: `${metrics.thumbLeftPct}%` }} />
      </div>
    </div>
  );
}
