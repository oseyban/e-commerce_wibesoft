import { StateCreator } from "zustand";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  qty: number;
};

export type CartSlice = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clearCart: () => void;
  total: () => number;
  /** Backward-compatible aliases */
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
};

export const createCartSlice: StateCreator<CartSlice, [], [], CartSlice> = (set, get) => ({
  items: [],
  add: (item) => {
    const items = get().items;
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx >= 0) {
      const next = items.slice();
      next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
      set({ items: next });
      return;
    }
    set({ items: [...items, item] });
  },
  remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
  setQty: (id, qty) => {
    if (qty <= 0) {
      set({ items: get().items.filter((i) => i.id !== id) });
      return;
    }
    set({ items: get().items.map((i) => (i.id === id ? { ...i, qty } : i)) });
  },
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, it) => sum + it.price * it.qty, 0),
  addItem: (item) => get().add(item),
  removeItem: (id) => get().remove(id),
});
