export type OrderStep = 'cart' | 'payment' | 'complete';

const steps: { key: OrderStep; label: string }[] = [
  { key: 'cart', label: '장바구니' },
  { key: 'payment', label: '결제' },
  { key: 'complete', label: '완료' },
];

interface StepIndicatorProps {
  currentStep: OrderStep;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <ol className="step-indicator">
      {steps.map((step, index) => (
        <li
          key={step.key}
          className={`step-indicator__item${index === currentIndex ? ' is-current' : index < currentIndex ? ' is-done' : ''}`}
        >
          <span className="step-indicator__num">{index + 1}</span>
          {step.label}
        </li>
      ))}
    </ol>
  );
}

export default StepIndicator;
