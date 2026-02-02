import Image from "next/image";

type CartItemData = {
  id: number;
  title: string;
  price: number;
  qty: number;
  image?: string | null;
};

type CartItemProps = {
  item: CartItemData;
  onRemove: (id: number) => void;
  onQtyChange: (id: number, qty: number) => void;
  format: (value: number) => string;
};

export default function CartItem({ item, onRemove, onQtyChange, format }: CartItemProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-[#F0F0F0] text-xs text-zinc-400 sm:h-28 sm:w-28">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            unoptimized
            className="object-contain"
          />
        ) : (
          "Image"
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[14px] font-bold leading-[19px] text-black sm:text-sm">
              {item.title}
            </div>
            <p className="mt-1 text-[12px] leading-[16px] text-black/60">Size: Large</p>
            <p className="text-[12px] leading-[16px] text-black/60">Color: White</p>
          </div>
          <button
            className="text-red-500"
            onClick={() => onRemove(item.id)}
            type="button"
            aria-label={`Remove ${item.title}`}
          >
            <Image src="/images/trash.png" alt="" width={20} height={20} />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center text-[24px] leading-8 font-bold text-black">
            {format(item.price)}
          </div>
          <div className="flex h-[44px] items-center justify-center gap-5 rounded-full bg-[#F0F0F0] px-5 text-[14px] font-medium leading-[19px] text-black">
            <button
              className="flex h-5 w-5 items-center justify-center text-black"
              onClick={() => onQtyChange(item.id, item.qty - 1)}
              type="button"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="min-w-[6px] text-center">{item.qty}</span>
            <button
              className="flex h-5 w-5 items-center justify-center text-black"
              onClick={() => onQtyChange(item.id, item.qty + 1)}
              type="button"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
