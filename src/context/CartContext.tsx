import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CartItem, CartGroup } from '@/data/cartItems';
import { initialAddresses, type Address } from '@/data/address';
import { getItemEmployeePayment, getItemSubsidy } from '@/utils/subsidy';
import { getShippingFee } from '@/utils/pricing';
import { recommendedBookList } from '@/data/recommendedBookList';
import { addPurchasedItems } from '@/data/readingStatusStore';

export interface AddToCartInput {
  isbn13: string;
  title: string;
  byline: string;
  listPrice: number;
  sellingPrice: number;
  qty: number;
  coverSrc?: string;
}

export interface OrderItem {
  id: string;
  title: string;
  group: CartGroup;
  formatLabel: string;
  sellingPrice: number;
  qty: number;
  subsidy: number;
  employeePayment: number;
  coverSrc?: string;
}

export interface Order {
  orderId: string;
  orderDate: string;
  items: OrderItem[];
  totalSellingPrice: number;
  totalCompanySubsidy: number;
  finalPaidAmount: number;
  shippingFee: number;
  paymentMethod: string;
  deliveryMemo: string;
  deliveryAddress: Address;
}

interface SubsidyLedger {
  recommendedUsed: boolean;
  personalUsed: boolean;
}

export type AddressModalMode = 'list' | 'form';

interface CartContextValue {
  items: CartItem[];
  subsidyLedger: SubsidyLedger;
  lastOrder: Order | null;
  addToCart: (input: AddToCartInput) => void;
  toggleChecked: (id: string) => void;
  toggleAllChecked: (checked: boolean) => void;
  changeQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  removeSelected: () => void;
  applySubsidy: (id: string) => void;
  removeSubsidy: (id: string) => void;
  placeOrder: (paymentMethod: string, deliveryMemo: string) => Order;
  addresses: Address[];
  selectedAddress: Address;
  isAddressModalOpen: boolean;
  addressModalMode: AddressModalMode;
  editingAddressId: string | null;
  openAddressList: () => void;
  openAddressForm: (addressId?: string) => void;
  closeAddressModal: () => void;
  selectAddress: (id: string) => void;
  saveAddress: (data: Omit<Address, 'id'>, editingId: string | null) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

let orderSeq = 0;
function generateOrderId() {
  const today = new Date();
  const ymd = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
  orderSeq += 1;
  return `YP${ymd}${String(orderSeq).padStart(4, '0')}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [subsidyLedger, setSubsidyLedger] = useState<SubsidyLedger>({ recommendedUsed: false, personalUsed: false });
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(initialAddresses[0].id);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressModalMode, setAddressModalMode] = useState<AddressModalMode>('list');
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? addresses[0];

  const openAddressList = () => {
    setAddressModalMode('list');
    setIsAddressModalOpen(true);
  };

  const openAddressForm = (addressId?: string) => {
    setEditingAddressId(addressId ?? null);
    setAddressModalMode('form');
    setIsAddressModalOpen(true);
  };

  const closeAddressModal = () => setIsAddressModalOpen(false);

  const selectAddress = (id: string) => {
    setSelectedAddressId(id);
    setIsAddressModalOpen(false);
  };

  // 기본 배송지로 저장하면 나머지 배송지의 기본 표시를 해제한다 — 기본 배송지는 항상 하나.
  const saveAddress = (data: Omit<Address, 'id'>, editingId: string | null) => {
    const id = editingId ?? `addr-${Date.now()}`;
    setAddresses((prev) => {
      const cleared = data.isDefault ? prev.map((address) => ({ ...address, isDefault: false })) : prev;
      if (editingId) return cleared.map((address) => (address.id === editingId ? { ...data, id } : address));
      return [...cleared, { ...data, id }];
    });
    setSelectedAddressId(id);
    setIsAddressModalOpen(false);
  };

  const addToCart = ({ isbn13, title, byline, listPrice, sellingPrice, qty, coverSrc }: AddToCartInput) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === isbn13);
      if (existing) {
        return prev.map((item) => (item.id === isbn13 ? { ...item, qty: item.qty + qty } : item));
      }
      const isRecommended = recommendedBookList.some((book) => book.isbn13 === isbn13);
      const newItem: CartItem = {
        id: isbn13,
        group: isRecommended ? 'recommended' : 'personal',
        title,
        byline,
        formatLabel: '종이도서',
        formatBadgeClassName: 'badge--general',
        coverIcon: 'book-open',
        coverSrc,
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

  // 같은 그룹(추천도서/개인도서) 안에서는 지원금을 한 권에만 적용할 수 있다 — 새로 적용하면
  // 같은 그룹의 기존 적용을 자동으로 해제한다(YP_PAYMENTS ShopContext의 enforceSubsidyExclusivity 이식).
  const applySubsidy = (id: string) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (!target) return prev;
      return prev.map((item) => {
        if (item.id === id) return { ...item, isSubsidyApplied: true };
        if (item.group === target.group) return { ...item, isSubsidyApplied: false };
        return item;
      });
    });
  };

  const removeSubsidy = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isSubsidyApplied: false } : item)));
  };

  const placeOrder = (paymentMethod: string, deliveryMemo: string): Order => {
    const paidItems = items.filter((item) => item.checked);
    const orderItems: OrderItem[] = paidItems.map((item) => ({
      id: item.id,
      title: item.title,
      group: item.group,
      formatLabel: item.formatLabel,
      sellingPrice: item.sellingPrice,
      qty: item.qty,
      subsidy: getItemSubsidy(item),
      employeePayment: getItemEmployeePayment(item),
      coverSrc: item.coverSrc,
    }));

    const totalSellingPrice = orderItems.reduce((sum, item) => sum + item.sellingPrice * item.qty, 0);
    const totalCompanySubsidy = orderItems.reduce((sum, item) => sum + item.subsidy, 0);
    const shippingFee = getShippingFee(totalSellingPrice);
    const finalPaidAmount = totalSellingPrice - totalCompanySubsidy + shippingFee;

    const order: Order = {
      orderId: generateOrderId(),
      orderDate: new Date().toLocaleString('ko-KR'),
      items: orderItems,
      totalSellingPrice,
      totalCompanySubsidy,
      finalPaidAmount,
      shippingFee,
      paymentMethod,
      deliveryMemo,
      deliveryAddress: selectedAddress,
    };

    // 이번 결제에서 지원금을 적용한 그룹만 이번 달 한도를 소진 처리한다 — 지원금 없이 산
    // 추천/개인도서는 한도를 쓰지 않는다(원본 processPayment와 동일).
    setSubsidyLedger((prev) => ({
      recommendedUsed: prev.recommendedUsed || paidItems.some((item) => item.group === 'recommended' && item.isSubsidyApplied),
      personalUsed: prev.personalUsed || paidItems.some((item) => item.group === 'personal' && item.isSubsidyApplied),
    }));
    setItems((prev) => prev.filter((item) => !item.checked));
    setLastOrder(order);
    // 나의 독서현황(/myreading)·독서 통계(/mystats)는 별도 목업 저장소(readingStatusStore)를 쓰므로,
    // 결제 완료 시점에 여기서 직접 이어줘야 실제 구매가 그 화면들에도 반영된다.
    addPurchasedItems(orderItems.map((item) => item.id));
    return order;
  };

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      subsidyLedger,
      lastOrder,
      addToCart,
      toggleChecked,
      toggleAllChecked,
      changeQty,
      removeItem,
      removeSelected,
      applySubsidy,
      removeSubsidy,
      placeOrder,
      addresses,
      selectedAddress,
      isAddressModalOpen,
      addressModalMode,
      editingAddressId,
      openAddressList,
      openAddressForm,
      closeAddressModal,
      selectAddress,
      saveAddress,
    }),
    [items, subsidyLedger, lastOrder, addresses, selectedAddress, isAddressModalOpen, addressModalMode, editingAddressId],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart는 CartProvider 안에서만 쓸 수 있습니다.');
  return ctx;
}
