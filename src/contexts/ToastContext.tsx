import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

interface ToastState {
  id: number;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
const TOAST_DURATION_MS = 2200;

// 프로젝트에 아직 토스트 패턴이 없어서(design-system.md 미정의) 버튼 톤(다크 배경 + 흰 글자)에
// 맞춰 최소 형태로 새로 만들었다. 한 번에 하나만 띄운다 — 여러 개 쌓일 만큼 빈번한 액션이 아니다.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = useCallback((message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const id = Date.now();
    setToast({ id, message });
    timerRef.current = setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, TOAST_DURATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
