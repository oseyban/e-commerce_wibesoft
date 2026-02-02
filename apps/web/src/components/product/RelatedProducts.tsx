import Image from "next/image";
import Link from "next/link";
import type { Product } from "@monorepo/api";

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
      <h2 className="mb-6 text-center text-[32px] font-bold leading-[36px] text-black font-[var(--font-integral)]">
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
              <div className="mb-4 rounded-2xl bg-[#F0EEED] p-4">
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
              <div className="line-clamp-2 text-[20px] font-bold leading-[27px] text-black font-[var(--font-satoshi)]">
                {item.title}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                <span className="text-[#FFC633]">★★★★★</span>
                <span>{getRatingRate(item).toFixed(1)}/5</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div className="text-lg font-bold text-black">{formatPrice(discounted)}</div>
                {relatedDiscount > 0 && (
                  <>
                    <div className="text-sm text-zinc-400 line-through">
                      {formatPrice(currentPrice)}
                    </div>
                    <span className="rounded-full bg-[#FF33331A] px-2 py-0.5 text-xs font-semibold text-[#FF3333]">
                      -{relatedDiscount}%
                    </span>
                  </>
                )}
              </div>
            </Link>
          );
        })}
        {products.length === 0 && (
          <p className="text-sm text-zinc-500">No related products found.</p>
        )}
      </div>
    </section>
  );
}
