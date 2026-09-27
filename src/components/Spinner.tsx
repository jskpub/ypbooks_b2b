interface SpinnerProps {
  size?: 'lg' | 'md' | 'sm';
}

// design-system.md Feedback > Spinner — 혼자 쓰지 않고 대기 문구와 함께 쓴다(문구는 부르는 쪽이 둔다).
export default function Spinner({ size = 'md' }: SpinnerProps) {
  return <span className={`spinner spinner--${size}`} aria-hidden='true' />;
}
