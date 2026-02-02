import { colors, spacing, fontSizes, fontWeights, shadows } from "../../../../../packages/design-tokens/src";
import { themeColors } from "../../data/theme-colors";
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
  const borderColor = colors.gray[200];
  const textMuted = colors.gray[600];

  return (
    <div className="order-3 min-w-0 lg:order-none">
      <h1
        className="text-3xl font-bold uppercase leading-tight sm:text-4xl"
        style={{
          fontSize: "40px",
          lineHeight: "48px",
          fontWeight: 700,
          fontFamily: "var(--font-integral)",
        }}
      >
        {product.title}
      </h1>
      <div
        className="mt-3 flex items-center gap-2"
        style={{ fontSize: fontSizes.sm, color: textMuted }}
      >
        <span style={{ color: colors.warning }}>★★★★★</span>
        <span>4.5/5</span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div
          style={{
            fontSize: "32px",
            fontWeight: 700,
            lineHeight: "38px",
            color: colors.gray[900],
          }}
        >
          {formatPrice(discountedPrice)}
        </div>
        {discountPercent > 0 && (
          <>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: colors.gray[400],
                textDecoration: "line-through",
              }}
            >
              {formatPrice(product.price)}
            </div>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                background: themeColors.accent.dangerSoft,
                color: themeColors.accent.danger,
              }}
            >
              -{discountPercent}%
            </span>
          </>
        )}
      </div>
      <p
        className="mt-4"
        style={{ fontSize: fontSizes.sm, color: textMuted, lineHeight: 1.6 }}
      >
        {product.description}
      </p>

      <div className="mt-6 space-y-5 sm:mt-8">
        <div className="border-t pt-4" style={{ borderColor }}>
          <div style={{ fontSize: fontSizes.sm, fontWeight: fontWeights.semibold }}>
            Select Colors
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            {colorOptions.map((color) => {
              const isSelected = selectedColor.value === color.value;
              return (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => onSelectColor(color)}
                  className="relative h-9 w-9 rounded-full transition active:scale-95"
                  style={{
                    backgroundColor: color.swatch,
                    border: isSelected ? `2px solid ${colors.brand[600]}` : "2px solid transparent",
                  }}
                  aria-label={color.label}
                >
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-white">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="border-t pt-4" style={{ borderColor }}>
          <div style={{ fontSize: fontSizes.sm, fontWeight: fontWeights.semibold }}>
            Choose Size
          </div>
          <div className="mt-2 grid w-full grid-cols-4 gap-2">
            {sizeOptions.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onSelectSize(size)}
                className="min-h-[40px] w-full rounded-full border px-4 py-2 text-xs transition active:scale-95 sm:min-h-0"
                style={{
                  backgroundColor: selectedSize === size ? colors.black : colors.gray[100],
                  color: selectedSize === size ? colors.white : colors.gray[600],
                  borderColor,
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-row items-center gap-3 border-t pt-4" style={{ borderColor }}>
          <div
            className="flex items-center rounded-full border"
            style={{
              paddingLeft: spacing[3],
              paddingRight: spacing[3],
              paddingTop: spacing[2],
              paddingBottom: spacing[2],
              fontSize: fontSizes.sm,
              borderColor,
              minHeight: 44,
            }}
          >
            <button
              type="button"
              className="touch-manipulation px-2 text-lg"
              onClick={() => onQtyChange(Math.max(1, qty - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-[2ch] px-2 text-center">{qty}</span>
            <button
              type="button"
              className="touch-manipulation px-2 text-lg"
              onClick={() => onQtyChange(qty + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="touch-manipulation flex-1 rounded-full text-sm font-semibold text-white transition active:scale-95 h-[44px] lg:h-[52px]"
            style={{
              backgroundColor: colors.black,
              borderRadius: "62px",
              boxShadow: shadows.sm,
              paddingLeft: "54px",
              paddingRight: "54px",
            }}
            onClick={onAddToCart}
          >
            {justAdded ? "Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
