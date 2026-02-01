"use client";

import { useEffect, useMemo, useState } from "react";
import { useStore } from "../../lib/store";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CartItem from "../../components/cart/CartItem";

type CartItem = {
  id: number;
  title: string;
  price: number;
  qty: number;
  image?: string | null;
};

type StoreState = {
  items: CartItem[];
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  total: () => number;
};

const demoItems: CartItem[] = [
  {
    id: 1,
    title: "Gradient Graphic T-shirt",
    price: 145,
    qty: 1,
    image: null
  },
  { id: 2, title: "Checkered Shirt", price: 180, qty: 1, image: null },
  { id: 3, title: "Skinny Fit Jeans", price: 240, qty: 1, image: null }
];

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, setQty, remove, total } = useStore((state: StoreState) => ({
    items: state.items,
    setQty: state.setQty,
    remove: state.remove,
    total: state.total
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayItems: CartItem[] = mounted && items.length ? items : demoItems;
  const subtotal = useMemo(
    () => displayItems.reduce((sum, it) => sum + it.price * it.qty, 0),
    [displayItems]
  );
  const discount = subtotal * 0.2;
  const deliveryFee = subtotal > 0 ? 15 : 0;
  const orderTotal = subtotal - discount + deliveryFee;

  const format = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value);

  return (
    <main className="bg-white text-zinc-900">
      <Header />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-4 text-xs text-zinc-500">Home / Cart</div>
        <h1 className="mb-8 text-3xl font-black">Your Cart</h1>

        {mounted ? (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-4">
              {displayItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={remove}
                  onQtyChange={setQty}
                  format={format}
                />
              ))}
            </section>

            <aside className="h-fit rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <div className="mt-4 space-y-3 text-sm text-zinc-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="text-zinc-900">{format(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Discount (-20%)</span>
                <span className="text-red-500">-{format(discount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery Fee</span>
                <span className="text-zinc-900">{format(deliveryFee)}</span>
              </div>
              <div className="border-t pt-3 text-base font-semibold text-zinc-900">
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span>{format(orderTotal)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <input
                className="flex-1 rounded-full border px-4 py-3 text-sm"
                placeholder="Add promo code"
              />
              <button className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">
                Apply
              </button>
            </div>

            <button className="mt-6 w-full rounded-full bg-black py-3 text-sm font-semibold text-white">
              Go to Checkout →
            </button>
            </aside>
          </div>
        ) : (
          <div className="py-20 text-center text-zinc-500">Loading cart...</div>
        )}
      </div>
      <Footer />
    </main>
  );
}
