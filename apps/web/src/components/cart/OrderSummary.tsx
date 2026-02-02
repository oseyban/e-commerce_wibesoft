import Image from "next/image";

type OrderSummaryProps = {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  orderTotal: number;
  format: (value: number) => string;
};

export default function OrderSummary({
  subtotal,
  discount,
  deliveryFee,
  orderTotal,
  format
}: OrderSummaryProps) {
  return (
    <aside className="h-fit rounded-[20px] border border-black/10 p-4 sm:p-6">
      <h2 className="text-[24px] font-bold leading-[32px] text-black">Order Summary</h2>
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
  );
}
