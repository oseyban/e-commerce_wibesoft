import type { Product } from "@monorepo/api";

type ColorOption = { label: string; value: string; swatch: string };

type ProductInfoProps = {
  product: Product;
  discountPercent: number;
  discountedPrice: number;
  formatPrice: (value: number) => string;
  selectedColor: ColorOption;
  onSelectColor: (color: ColorOption) => void;
  colorOptions: ColorOption[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  sizeOptions: string[];
  qty: number;
  onQtyChange: (next: number) => void;
  onAddToCart: () => void;
  justAdded: boolean;
};

export default function ProductInfo({
  product,
  discountPercent,
  discountedPrice,
  formatPrice,
  selectedColor,
  onSelectColor,
  colorOptions,
  selectedSize,
  onSelectSize,
  sizeOptions,
  qty,
  onQtyChange,
  onAddToCart,
  justAdded,
}: ProductInfoProps) {
  return (
    <div className="order-3 min-w-0 lg:order-none">
      <h1 className="text-[40px] font-bold uppercase leading-[48px] text-black font-[var(--font-integral)]">
        {product.title}
      </h1>
      <div className="mt-3 flex items-center gap-2 text-sm text-black/60">
        <span className="text-[#FFC633]">★★★★★</span>
        <span>4.5/5</span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="text-[32px] font-bold leading-[38px] text-black">
          {formatPrice(discountedPrice)}
        </div>
        {discountPercent > 0 && (
          <>
            <div className="text-[20px] font-medium text-zinc-400 line-through">
              {formatPrice(product.price)}
            </div>
            <span className="rounded-full bg-[#FF33331A] px-3 py-1 text-xs font-semibold text-[#FF3333]">
              -{discountPercent}%
            </span>
          </>
        )}
      </div>
      <p className="mt-4 text-sm leading-[1.6] text-black/60">
        {product.description}
      </p>

      <div className="mt-6 space-y-5 sm:mt-8">
        <div className="border-t border-black/10 pt-4">
          <div className="text-sm font-semibold">Select Colors</div>
          <div className="mt-2 flex flex-wrap gap-3">
            {colorOptions.map((color) => {
              const isSelected = selectedColor.value === color.value;
              return (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => onSelectColor(color)}
                  className={`relative h-9 w-9 rounded-full border-2 transition active:scale-95 ${
                    isSelected ? "border-black" : "border-transparent"
                  }`}
                  style={{
                    backgroundColor: color.swatch,
                  }}
                  aria-label={color.label}
                >
                  {isSelected && (
                    <span
                      className={`absolute inset-0 flex items-center justify-center text-xs ${
                        color.value === "white" ? "text-black" : "text-white"
                      }`}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="border-t border-black/10 pt-4">
          <div className="text-sm font-semibold">Choose Size</div>
          <div className="mt-2 grid w-full grid-cols-4 gap-2">
            {sizeOptions.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onSelectSize(size)}
                className={`min-h-[40px] w-full rounded-full border border-black/10 px-4 py-2 text-xs transition active:scale-95 sm:min-h-0 ${
                  selectedSize === size ? "bg-black text-white" : "bg-[#F0F0F0] text-black/60"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-row items-center gap-3 border-t border-black/10 pt-4">
          <div className="flex h-11 items-center rounded-full border border-black/10 px-3 py-2 text-sm">
            <button
              type="button"
              className="touch-manipulation px-2 text-lg text-black"
              onClick={() => onQtyChange(Math.max(1, qty - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-[2ch] px-2 text-center">{qty}</span>
            <button
              type="button"
              className="touch-manipulation px-2 text-lg text-black"
              onClick={() => onQtyChange(qty + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="touch-manipulation flex-1 rounded-full bg-black px-[54px] text-sm font-semibold text-white shadow-sm transition active:scale-95 h-[44px] lg:h-[52px]"
            onClick={onAddToCart}
          >
            {justAdded ? "Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
