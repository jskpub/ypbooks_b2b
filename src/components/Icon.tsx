import type { SVGProps } from 'react';
import ArrowsClockwiseIcon from '@/assets/icons/arrows-clockwise.svg?react';
import BookOpenIcon from '@/assets/icons/book-open.svg?react';
import BooksIcon from '@/assets/icons/books.svg?react';
import CaretDownIcon from '@/assets/icons/caret-down.svg?react';
import CaretRightIcon from '@/assets/icons/caret-right.svg?react';
import CaretUpIcon from '@/assets/icons/caret-up.svg?react';
import CheckIcon from '@/assets/icons/check.svg?react';
import CheckCircleIcon from '@/assets/icons/check-circle.svg?react';
import DeviceMobileIcon from '@/assets/icons/device-mobile.svg?react';
import HeadsetIcon from '@/assets/icons/headset.svg?react';
import InfoIcon from '@/assets/icons/info.svg?react';
import ListIcon from '@/assets/icons/list.svg?react';
import MagnifyingGlassIcon from '@/assets/icons/magnifying-glass.svg?react';
import MedalIcon from '@/assets/icons/medal.svg?react';
import MinusIcon from '@/assets/icons/minus.svg?react';
import PlusIcon from '@/assets/icons/plus.svg?react';
import QuestionIcon from '@/assets/icons/question.svg?react';
import ShoppingBagIcon from '@/assets/icons/shopping-bag.svg?react';
import ShoppingCartSimpleIcon from '@/assets/icons/shopping-cart-simple.svg?react';
import SignOutIcon from '@/assets/icons/sign-out.svg?react';
import StarIcon from '@/assets/icons/star.svg?react';
import TrashIcon from '@/assets/icons/trash.svg?react';
import TruckIcon from '@/assets/icons/truck.svg?react';
import UserIcon from '@/assets/icons/user.svg?react';
import WalletIcon from '@/assets/icons/wallet.svg?react';
import WarningIcon from '@/assets/icons/warning.svg?react';
import XCircleIcon from '@/assets/icons/x-circle.svg?react';
import XIcon from '@/assets/icons/x.svg?react';

const icons = {
  'arrows-clockwise': ArrowsClockwiseIcon,
  'book-open': BookOpenIcon,
  books: BooksIcon,
  'caret-down': CaretDownIcon,
  'caret-right': CaretRightIcon,
  'caret-up': CaretUpIcon,
  check: CheckIcon,
  'check-circle': CheckCircleIcon,
  'device-mobile': DeviceMobileIcon,
  headset: HeadsetIcon,
  info: InfoIcon,
  list: ListIcon,
  'magnifying-glass': MagnifyingGlassIcon,
  medal: MedalIcon,
  minus: MinusIcon,
  plus: PlusIcon,
  question: QuestionIcon,
  'shopping-bag': ShoppingBagIcon,
  'shopping-cart-simple': ShoppingCartSimpleIcon,
  'sign-out': SignOutIcon,
  star: StarIcon,
  trash: TrashIcon,
  truck: TruckIcon,
  user: UserIcon,
  wallet: WalletIcon,
  warning: WarningIcon,
  'x-circle': XCircleIcon,
  x: XIcon,
} as const;

export type IconName = keyof typeof icons;

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

// EJS의 icon() 헬퍼(vite.config.js에서 빌드 타임에 SVG를 인라인하던 것)를 대체.
// <img src="*.svg">가 아니라 SVG를 컴포넌트로 렌더해야 currentColor로 글자색을 상속받는다.
export function Icon({ name, className = 'icon', ...props }: IconProps) {
  const SvgIcon = icons[name];
  return <SvgIcon className={className} aria-hidden="true" focusable={false} {...props} />;
}
