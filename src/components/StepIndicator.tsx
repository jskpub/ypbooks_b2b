import { Icon } from '@/components/Icon';

export type OrderStep = 'cart' | 'payment' | 'complete';

const steps: { key: OrderStep; label: string }[] = [
  { key: 'cart', label: '장바구니' },
  { key: 'payment', label: '결제' },
  { key: 'complete', label: '완료' },
];

interface StepIndicatorProps {
  currentStep: OrderStep;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <ol className='step-indicator'>
      {steps.flatMap((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        const modifier = isCurrent ? ' step-indicator__step--current' : isDone ? ' step-indicator__step--done' : '';

        const stepItem = (
          <li key={step.key} className={`step-indicator__step${modifier}`} aria-current={isCurrent ? 'step' : undefined}>
            <span className='step-indicator__circle'>{isDone ? <Icon name='check' /> : index + 1}</span>
            <span className='step-indicator__label'>{step.label}</span>
          </li>
        );

        if (index === steps.length - 1) return [stepItem];

        const connector = <li key={`${step.key}-connector`} className={`step-indicator__connector${isDone ? ' is-active' : ''}`} aria-hidden='true' />;

        return [stepItem, connector];
      })}
    </ol>
  );
}
