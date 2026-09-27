import { useEffect, useState, type RefObject } from 'react';

// 카카오(다음) 우편번호 서비스 — https://postcode.map.kakao.com/guide (API 키 불필요)
const POSTCODE_SCRIPT_SRC = 'https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

export interface PostcodeResult {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  autoJibunAddress: string;
}

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: { width?: string | number; height?: string | number; oncomplete: (data: PostcodeResult) => void }) => { embed: (element: HTMLElement) => void };
    };
  }
}

let postcodeScriptPromise: Promise<void> | null = null;
function loadPostcodeScript(): Promise<void> {
  if (window.daum?.Postcode) return Promise.resolve();
  if (!postcodeScriptPromise) {
    postcodeScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = POSTCODE_SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        script.remove();
        postcodeScriptPromise = null; // 실패 시 다음 시도에서 재로드할 수 있게 초기화
        reject(new Error('postcode script load failed'));
      };
      document.head.appendChild(script);
    });
  }
  return postcodeScriptPromise;
}

type PostcodeStatus = 'idle' | 'loading' | 'ready' | 'error';

/** 우편번호 찾기 팝업을 `containerRef` 안에 임베드한다. `active`가 true인 동안만 스크립트를 불러와 렌더링한다. */
export function usePostcodeSearch(containerRef: RefObject<HTMLDivElement | null>, active: boolean, onComplete: (result: PostcodeResult) => void) {
  const [status, setStatus] = useState<PostcodeStatus>('idle');
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    setStatus('loading');

    loadPostcodeScript()
      .then(() => {
        const container = containerRef.current;
        if (cancelled || !container || !window.daum) return;
        new window.daum.Postcode({
          width: '100%',
          height: '100%',
          oncomplete: onComplete,
        }).embed(container);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, retryToken]);

  return { status, retry: () => setRetryToken((token) => token + 1) };
}
