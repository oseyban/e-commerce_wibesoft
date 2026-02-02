import Image from "next/image";
import Link from "next/link";
import type { Product } from "@monorepo/api";
import { colors, radii, fontSizes } from "../../../../../packages/design-tokens/src";
import { themeColors } from "../../data/theme-colors";

type RelatedProductsProps = {
  products: Product[];
  formatPrice: (value: number) => string;
  getDiscountPercent: (seed: number) => number;
  getRatingRate: (item: Product) => number;
};

export default function RelatedProducts({
  products,
  formatPrice,
  getDiscountPercent,
  getRatingRate,
}: RelatedProductsProps) {
  return (
    <section className="mt-10 sm:mt-12">
      <h2
        className="mb-6 text-center"
        style={{
          fontSize: "32px",
          lineHeight: "36px",
          fontWeight: 700,
          fontFamily: "var(--font-integral)",
          color: colors.black,
        }}
      >
        You Might Also Like
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.map((item, index) => {
          const seed = Number(item.id ?? index + 1);
          const relatedDiscount = getDiscountPercent(seed);
          const currentPrice = item.price ?? 0;
          const discounted = relatedDiscount
            ? Math.round(currentPrice * (1 - relatedDiscount / 100))
            : currentPrice;
          return (
            <Link
              key={item.id ?? `${item.title}-${index}`}
              href={item.id != null ? `/product/${item.id}` : "#"}
              className={index >= 2 ? "hidden sm:block" : "block"}
            >
              <div
                className="mb-4 rounded-2xl p-4"
                style={{ background: colors.gray[50], borderRadius: radii.xl }}
              >
                <div className="relative h-36 w-full overflow-hidden sm:h-40">
                  <Image
                    src={item.image ?? ""}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-contain"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
              </div>
              <div
                className="line-clamp-2"
                style={{
                  fontSize: "20px",
                  lineHeight: "27px",
                  fontWeight: 700,
                  fontFamily: "var(--font-satoshi)",
                  color: colors.black,
                }}
              >
                {item.title}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                <span style={{ color: colors.warning }}>★★★★★</span>
                <span>{getRatingRate(item).toFixed(1)}/5</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div className="text-lg font-bold text-black">{formatPrice(discounted)}</div>
                {relatedDiscount > 0 && (
                  <>
                    <div className="text-sm text-zinc-400 line-through">
                      {formatPrice(currentPrice)}
                    </div>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-semibold"
                      style={{
                        background: themeColors.accent.dangerSoft,
                        color: themeColors.accent.danger,
                      }}
                    >
                      -{relatedDiscount}%
                    </span>
                  </>
                )}
              </div>
            </Link>
          );
        })}
        {products.length === 0 && (
          <p style={{ fontSize: fontSizes.sm, color: colors.gray[500] }}>
            No related products found.
          </p>
        )}
      </div>
    </section>
  );
}
