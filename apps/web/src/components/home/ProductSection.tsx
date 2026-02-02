import Image from "next/image";
import Link from "next/link";
import { type Product } from "@monorepo/api";
import RatingRow from "./Rating";

type ProductSectionProps = {
  title: string;
  titleClassName: string;
  products: Product[];
  getDiscount: (seed: number) => number;
  formatPrice: (value: number) => string;
};

export default function ProductSection({
  title,
  titleClassName,
  products,
  getDiscount,
  formatPrice,
}: ProductSectionProps) {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-5">
      <h2 className={`${titleClassName} font-[var(--font-integral)]`}>
        {title}
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p, i) => {
          const seed = p.id ?? i;
          const discount = getDiscount(seed);
          const originalPrice = discount ? p.price / (1 - discount / 100) : p.price;

          return (
            <article
              key={p.id ?? `${p.title}-${i}`}
              className={`rounded-2xl border border-zinc-200 bg-white overflow-hidden ${i > 1 ? "hidden sm:block" : ""}`}
            >
              <Link href={p.id ? `/product/${p.id}` : "#"} className="block">
                <div className="relative h-40 w-full bg-zinc-50">
                  <Image src={p.image ?? ""} alt={p.title} fill unoptimized className="object-contain" />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold line-clamp-2 font-[var(--font-satoshi)]">
                    {p.title}
                  </h3>
                  <div className="mt-2">
                    <RatingRow />
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-sm">
                    <span className="font-bold">{formatPrice(p.price)}</span>
                    {discount > 0 && (
                      <>
                        <span className="text-zinc-400 line-through">{formatPrice(originalPrice)}</span>
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                          -{discount}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
      <div className="mt-6 flex justify-center">
        <button className="w-full max-w-[260px] rounded-full border border-black px-6 py-2 text-sm sm:w-auto">
          View All
        </button>
      </div>
    </section>
  );
}
