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
    <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-4 sm:flex-row sm:items-center">
      <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl bg-zinc-100 text-xs text-zinc-400">
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
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-semibold">{item.title}</div>
            <p className="mt-1 text-xs text-zinc-500">Size: Large</p>
            <p className="text-xs text-zinc-500">Color: White</p>
          </div>
          <button
            className="text-red-500"
            onClick={() => onRemove(item.id)}
            type="button"
            aria-label={`Remove ${item.title}`}
          >
            🗑️
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-bold">{format(item.price)}</div>
          <div className="flex items-center rounded-full border px-3 py-2 text-sm">
            <button
              className="px-2"
              onClick={() => onQtyChange(item.id, item.qty - 1)}
              type="button"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-2">{item.qty}</span>
            <button
              className="px-2"
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
