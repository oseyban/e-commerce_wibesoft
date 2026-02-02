"use client";

import { useEffect, useMemo, useState } from "react";
import { useStore } from "../../lib/store";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CartList from "../../components/cart/CartList";
import OrderSummary from "../../components/cart/OrderSummary";

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

  const displayItems: CartItem[] = mounted ? items : [];
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

      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-5 sm:py-10">
        <div className="mb-4 text-xs text-zinc-500">Home / Cart</div>
        <h1
          className="mb-6 text-[32px] font-bold leading-[38px] text-black sm:mb-8 sm:text-[40px] sm:leading-[48px]"
          style={{ fontFamily: "var(--font-integral), sans-serif" }}
        >
          Your Cart
        </h1>

        {!mounted ? (
          <div className="py-20 text-center text-zinc-500">Loading cart...</div>
        ) : displayItems.length === 0 ? (
          <div className="rounded-[20px] border border-black/10 bg-white p-10 text-center text-black/60">
            Your cart is empty.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <CartList items={displayItems} onRemove={remove} onQtyChange={setQty} format={format} />
            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              deliveryFee={deliveryFee}
              orderTotal={orderTotal}
              format={format}
            />
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
