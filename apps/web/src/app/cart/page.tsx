"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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

      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-5 sm:py-10">
        <div className="mb-4 text-xs text-zinc-500">Home / Cart</div>
        <h1
          className="mb-6 text-[32px] font-bold leading-[38px] text-black sm:mb-8 sm:text-[40px] sm:leading-[48px]"
          style={{ fontFamily: "var(--font-integral), sans-serif" }}
        >
          Your Cart
        </h1>

        {mounted ? (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[20px] border border-black/10 p-4 sm:p-6">
              {displayItems.map((item, index) => (
                <div key={item.id}>
                  <CartItem
                    item={item}
                    onRemove={remove}
                    onQtyChange={setQty}
                    format={format}
                  />
                  {index !== displayItems.length - 1 && (
                    <div className="my-4 h-px bg-black/10" />
                  )}
                </div>
              ))}
            </section>

            <aside className="h-fit rounded-[20px] border border-black/10 p-4 sm:p-6">
              <h2 className="text-[24px] font-bold leading-[32px] text-black">
                Order Summary
              </h2>
              <div className="mt-6 space-y-5 text-[16px] leading-[22px] text-black/60 sm:text-[20px] sm:leading-[27px]">
                <div className="flex items-center justify-between">
                  <span className="font-normal text-black/60">Subtotal</span>
                  <span className="font-bold text-black">{format(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-normal text-black/60">Discount (-20%)</span>
                  <span className="font-bold text-[#FF3333]">-{format(discount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-normal text-black/60">Delivery Fee</span>
                  <span className="font-bold text-black">{format(deliveryFee)}</span>
                </div>
                <div className="border-t border-black/10 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-black font-normal">Total</span>
                    <span className="text-[20px] font-bold leading-[27px] text-black sm:text-[24px] sm:leading-[32px]">
                      {format(orderTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <div className="flex h-[48px] flex-1 items-center gap-2 rounded-full bg-[#F0F0F0] px-4 text-sm text-black/40">
                  <span className="inline-flex h-6 w-6 items-center justify-center">
                    <Image src="/images/addtopromo.png" alt="" width={24} height={24} />
                  </span>
                  <input
                    className="flex-1 bg-transparent text-[16px] leading-[22px] text-black/40 placeholder:text-black/40 outline-none"
                    placeholder="Add promo code"
                  />
                </div>
                <button className="h-[48px] rounded-full bg-black px-6 text-[16px] font-medium leading-[22px] text-white">
                  Apply
                </button>
              </div>

              <button className="mt-6 flex h-[60px] w-full items-center justify-center gap-2 rounded-full bg-black text-[16px] font-medium leading-[22px] text-white">
                Go to Checkout
                <span aria-hidden>→</span>
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
