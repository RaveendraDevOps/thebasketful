import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { initialOrders } from '@/data/catalog';
import { CartLine, CustomerMode, Order } from '@/types';
import { calculateSubtotal } from '@/utils/cart';

export { priceFor } from '@/utils/cart';

type PersistedState = {
  hasOnboarded: boolean;
  mode: CustomerMode;
  cart: CartLine[];
  favorites: string[];
  orders: Order[];
};

type Store = PersistedState & {
  hydrated: boolean;
  setMode: (mode: CustomerMode) => void;
  completeOnboarding: (mode: CustomerMode) => void;
  quantityFor: (id: string) => number;
  updateQuantity: (id: string, delta: number) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  clearCart: () => void;
  placeOrder: (address: string, slot: string) => Order;
};

const initial: PersistedState = {
  hasOnboarded: false,
  mode: 'household',
  cart: [],
  favorites: [],
  orders: initialOrders,
};

const STORAGE_KEY = 'basketful-state-v1';
const AppContext = createContext<Store | null>(null);

export function AppStoreProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => value && setState({ ...initial, ...JSON.parse(value) }))
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [hydrated, state]);

  const subtotal = calculateSubtotal(state.cart, state.mode);
  const deliveryFee = subtotal === 0 || subtotal >= (state.mode === 'business' ? 1500 : 499) ? 0 : 39;
  const value = useMemo<Store>(() => ({
    ...state,
    hydrated,
    setMode: (mode) => setState((current) => ({ ...current, mode })),
    completeOnboarding: (mode) => setState((current) => ({ ...current, mode, hasOnboarded: true })),
    quantityFor: (id) => state.cart.find((line) => line.productId === id)?.quantity ?? 0,
    updateQuantity: (id, delta) => setState((current) => {
      const existing = current.cart.find((line) => line.productId === id);
      const quantity = Math.max(0, (existing?.quantity ?? 0) + delta);
      const cart = quantity === 0
        ? current.cart.filter((line) => line.productId !== id)
        : existing
          ? current.cart.map((line) => line.productId === id ? { ...line, quantity } : line)
          : [...current.cart, { productId: id, quantity }];
      return { ...current, cart };
    }),
    toggleFavorite: (id) => setState((current) => ({
      ...current,
      favorites: current.favorites.includes(id)
        ? current.favorites.filter((item) => item !== id)
        : [...current.favorites, id],
    })),
    isFavorite: (id) => state.favorites.includes(id),
    cartCount: state.cart.reduce((sum, line) => sum + line.quantity, 0),
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    clearCart: () => setState((current) => ({ ...current, cart: [] })),
    placeOrder: (address, slot) => {
      const order: Order = {
        id: `BF${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        total: subtotal + deliveryFee,
        status: 'Confirmed',
        itemCount: state.cart.reduce((sum, line) => sum + line.quantity, 0),
        address,
        slot,
      };
      setState((current) => ({ ...current, cart: [], orders: [order, ...current.orders] }));
      return order;
    },
  }), [deliveryFee, hydrated, state, subtotal]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useAppStore must be used inside AppStoreProvider');
  return value;
}
