import { createContext, useContext, useState, type ReactNode } from 'react';
import { recommendedBookList } from '@/data/recommendedBookList';
import { initialCartItems, type CartItem } from '@/data/cartItems';

export interface AddToCartInput {
  isbn13: string;
  title: string;
  byline: string;
  listPrice: number;
  sellingPrice: number;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (input: AddToCartInput) => void;
  toggleChecked: (id: string) => void;
  toggleAllChecked: (checked: boolean) => void;
  changeQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  removeSelected: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// 사업 규칙(aladinApi.ts fetchRecommendedBooks 주석 참고): recommendedBookList.ts의 ISBN(이번 달
// 추천도서 10권)만 회사 100% 지원 대상 "recommended" 그룹이고, 그 외(지난 추천 도서 포함)는 전부
// 개인도서 "personal" 그룹으로 분류한다.
function resolveGroup(isbn13: string): CartItem['group'] {
  return recommendedBookList.some((book) => book.isbn13 === isbn13) ? 'recommended' : 'personal';
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(initialCartItems);

  const addToCart = ({ isbn13, title, byline, listPrice, sellingPrice, qty }: AddToCartInput) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === isbn13);
      if (existing) {
        return prev.map((item) => (item.id === isbn13 ? { ...item, qty: item.qty + qty } : item));
      }
      const newItem: CartItem = {
        id: isbn13,
        group: resolveGroup(isbn13),
        title,
        byline,
        formatLabel: '종이책',
        formatBadgeClassName: 'badge--general',
        coverIcon: 'book-open',
        listPrice,
        sellingPrice,
        qty,
        checked: true,
        deliveryMain: '내일 출고 가능',
        deliverySub: '영업일 기준 1~2일 이내 도착',
      };
      return [...prev, newItem];
    });
  };

  const toggleChecked = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const toggleAllChecked = (checked: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, checked })));
  };

  const changeQty = (id: string, qty: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const removeSelected = () => {
    setItems((prev) => prev.filter((item) => !item.checked));
  };

  const value: CartContextValue = { items, addToCart, toggleChecked, toggleAllChecked, changeQty, removeItem, removeSelected };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
