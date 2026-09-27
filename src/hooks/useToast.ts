import { useCallback, useRef, useState } from 'react';

/** 스토리보드(CART-01-2 Case 7-A, PAY-01-2 Case 8-A/8-B) 기준 — 화면 하단 토스트로
 * 주문/결제 진행을 막는 경우에 쓴다. 약 2.4초 뒤 자동으로 사라진다. */
export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const showToast = useCallback((text: string) => {
    window.clearTimeout(timerRef.current);
    setMessage(text);
    timerRef.current = window.setTimeout(() => setMessage(null), 2400);
  }, []);

  return { toastMessage: message, showToast };
}
