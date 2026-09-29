interface SpinnerProps {
  size?: 'lg' | 'md' | 'sm';
}

// 단독 사용 금지, 대기 문구와 함께 사용 (문구는 호출 측에서 지정)
export default function Spinner({ size = 'md' }: SpinnerProps) {
  return <span className={`spinner spinner--${size}`} aria-hidden='true' />;
}
