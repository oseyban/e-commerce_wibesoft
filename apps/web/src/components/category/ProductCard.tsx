import Image from "next/image";
import Link from "next/link";
import { type Product } from "@monorepo/api";
import RatingRow from "./Rating";

type ProductCardProps = {
  product: Product;
  index: number;
};

const formatPrice = (value: number) => `$${Math.round(value)}`;

const getDiscount = (seed: number) => {
  if (seed % 5 === 0) return 30;
  if (seed % 3 === 0) return 20;
  return 0;
};

export default function ProductCard({ product, index }: ProductCardProps) {
  const seed =
    typeof product.id === "number" ? product.id : product.title.length + index;
  const discount = getDiscount(seed);
  const originalPrice = discount
    ? product.price / (1 - discount / 100)
    : product.price;

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <Link
        href={product.id ? `/product/${product.id}` : "#"}
        className={product.id ? "block" : "pointer-events-none block"}
      >
        <div className="relative h-40 w-full bg-[#F0EEED]">
          <Image
            src={product.image ?? ""}
            alt={product.title}
            fill
            unoptimized
            className="object-contain"
          />
        </div>
        <div className="p-4">
          <h3 className="truncate text-[16px] font-bold leading-[22px] text-black sm:line-clamp-2 sm:whitespace-normal sm:text-[20px] sm:leading-[20px]">
            {product.title}
          </h3>
          <div className="mt-2">
            <RatingRow />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="text-[24px] font-bold leading-8 text-black">
              {formatPrice(product.price)}
            </span>
            {discount > 0 && (
              <>
                <span className="text-[16px] text-zinc-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
                <span className="rounded-full bg-[#FF33331A] px-2 py-0.5 text-[11px] font-semibold text-[#FF3333]">
                  -{discount}%
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
