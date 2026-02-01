"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProductById, getProducts, type Product } from "@monorepo/api";
import { useStore } from "@/lib/store";
import { colors, spacing, radii, fontSizes, fontWeights, shadows } from "@monorepo/design-tokens";

type Review = {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
};

const reviews: Review[] = [
  {
    id: "rev-1",
    name: "Samantha D.",
    rating: 4,
    date: "Posted on August 14, 2023",
    text: "I absolutely love this shirt! The design is unique and the fabric feels so comfortable."
  },
  {
    id: "rev-2",
    name: "Alex M.",
    rating: 5,
    date: "Posted on August 12, 2023",
    text: "Looks great and fits perfectly. The quality exceeded my expectations."
  },
  {
    id: "rev-3",
    name: "Ethan R.",
    rating: 4,
    date: "Posted on August 10, 2023",
    text: "Very comfortable and stylish. I received compliments the first day I wore it."
  },
  {
    id: "rev-4",
    name: "Olivia P.",
    rating: 5,
    date: "Posted on August 8, 2023",
    text: "Great fit and premium material. Highly recommend!"
  }
];

const colorOptions = ["Black", "White", "Olive", "Navy"];
const sizeOptions = ["Small", "Medium", "Large", "X-Large"];

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = useMemo(() => Number(params?.id), [params?.id]);

  const { data, isLoading, isError } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: Number.isFinite(productId)
  });

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[2]);
  const [justAdded, setJustAdded] = useState(false);

  const relatedProducts = useMemo(() => {
    if (!data) return [];
    const byCategory = allProducts.filter(
      (item) => item.category === data.category && item.id !== data.id
    );
    return (byCategory.length ? byCategory : allProducts)
      .filter((item) => item.id !== data.id)
      .slice(0, 4);
  }, [allProducts, data]);

  const thumbnails = useMemo(() => {
    const src = data?.image ?? "";
    if (!src) return [];
    return [src, src, src];
  }, [data?.image]);

  const { add } = useStore((state) => ({
    add: state.add
  }));

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <p style={{ color: colors.gray[500], fontSize: fontSizes.sm }}>Yükleniyor…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <p style={{ color: colors.danger, fontSize: fontSizes.sm }}>Ürün yüklenemedi</p>
      </div>
    );
  }

  const primaryBg = justAdded ? colors.success : colors.brand[600];
  const borderColor = colors.gray[200];
  const textMuted = colors.gray[600];
  const textSecondary = colors.gray[500];

  return (
    <main style={{ background: colors.white, color: colors.gray[900] }}>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 md:py-10">
        <nav
          className="mb-6 sm:mb-8"
          style={{ fontSize: fontSizes.xs, color: textSecondary }}
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/product" className="hover:underline">Shop</Link>
          <span className="mx-2">/</span>
          <span>{data.category}</span>
        </nav>

        <section className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,100px)_1fr_minmax(0,1fr)] lg:gap-10">
          {/* Thumbnails: horizontal on mobile, vertical on lg */}
          <div className="flex flex-row gap-2 lg:flex-col lg:gap-3">
            {thumbnails.length ? (
              thumbnails.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="relative flex h-20 w-20 shrink-0 items-center justify-center lg:h-24 lg:w-full"
                  style={{
                    borderRadius: radii.xl,
                    border: `1px solid ${borderColor}`,
                    background: colors.gray[50],
                  }}
                >
                  <Image
                    src={src}
                    alt={`${data.title} thumbnail ${index + 1}`}
                    fill
                    unoptimized
                    className="object-contain p-2 lg:p-3"
                  />
                </div>
              ))
            ) : (
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center lg:h-24 lg:w-full"
                style={{
                  borderRadius: radii.xl,
                  border: `1px solid ${borderColor}`,
                  background: colors.gray[50],
                  fontSize: fontSizes.xs,
                  color: colors.gray[400],
                }}
              >
                No image
              </div>
            )}
          </div>

          {/* Main image */}
          <div
            className="flex min-h-[240px] items-center justify-center sm:min-h-[280px] lg:min-h-[320px]"
            style={{
              borderRadius: radii.xl,
              background: colors.gray[100],
              padding: spacing[6],
              boxShadow: shadows.sm,
            }}
          >
            <div className="relative h-56 w-full sm:h-64 lg:h-72">
              <Image
                src={data.image ?? ""}
                alt={data.title}
                fill
                unoptimized
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0">
            <h1
              className="text-2xl font-bold leading-tight sm:text-3xl"
              style={{ fontSize: fontSizes["3xl"], fontWeight: fontWeights.bold }}
            >
              {data.title}
            </h1>
            <div
              className="mt-3 flex items-center gap-2"
              style={{ fontSize: fontSizes.sm, color: textMuted }}
            >
              <span style={{ color: colors.warning }}>★★★★★</span>
              <span>4.5/5</span>
            </div>
            <div
              className="mt-4"
              style={{ fontSize: fontSizes["2xl"], fontWeight: fontWeights.bold, color: colors.brand[600] }}
            >
              ${data.price}
            </div>
            <p
              className="mt-4"
              style={{ fontSize: fontSizes.sm, color: textMuted, lineHeight: 1.6 }}
            >
              {data.description}
            </p>

            <div className="mt-6 space-y-4 sm:mt-8">
              <div>
                <div style={{ fontSize: fontSizes.sm, fontWeight: fontWeights.semibold }}>Select Colors</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className="min-h-[44px] rounded-full border px-4 py-2 text-xs transition active:scale-95 sm:min-h-0"
                      style={{
                        backgroundColor: selectedColor === color ? colors.brand[600] : "transparent",
                        color: selectedColor === color ? colors.white : colors.gray[900],
                        borderColor,
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: fontSizes.sm, fontWeight: fontWeights.semibold }}>Choose Size</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className="min-h-[44px] rounded-full border px-4 py-2 text-xs transition active:scale-95 sm:min-h-0"
                      style={{
                        backgroundColor: selectedSize === size ? colors.brand[600] : "transparent",
                        color: selectedSize === size ? colors.white : colors.gray[900],
                        borderColor,
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="min-w-[2ch] px-2 text-center">{qty}</span>
                  <button
                    type="button"
                    className="touch-manipulation px-2 text-lg"
                    onClick={() => setQty((prev) => prev + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="touch-manipulation min-h-[44px] flex-1 rounded-full px-5 py-3 text-sm font-semibold text-white transition active:scale-95"
                  style={{
                    backgroundColor: primaryBg,
                    borderRadius: radii.full,
                    boxShadow: shadows.sm,
                  }}
                  onClick={() => {
                    if (!data.id) return;
                    add({
                      id: data.id,
                      title: data.title,
                      price: data.price,
                      image: data.image ?? null,
                      qty,
                    });
                    setJustAdded(true);
                    window.setTimeout(() => setJustAdded(false), 900);
                  }}
                >
                  {justAdded ? "Added" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          className="mt-10 border-b sm:mt-12"
          style={{ borderColor }}
        >
          <div className="flex flex-wrap gap-4 sm:gap-6" style={{ fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: textSecondary }}>
            <button className="border-b-2 pb-3" style={{ borderColor: colors.brand[600], color: colors.gray[900] }}>
              Product Details
            </button>
            <button className="pb-3">Rating & Reviews</button>
            <button className="pb-3">FAQs</button>
          </div>
        </section>

        <section className="mt-6 sm:mt-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 style={{ fontSize: fontSizes.xl, fontWeight: fontWeights.bold }}>All Reviews</h2>
            <button
              className="w-full rounded-full border py-2 sm:w-auto sm:px-4"
              style={{ fontSize: fontSizes.xs, borderColor }}
            >
              Write a Review
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border p-4"
                style={{ borderColor, borderRadius: radii.xl, boxShadow: shadows.sm }}
              >
                <div className="flex items-center justify-between" style={{ fontSize: fontSizes.sm, fontWeight: fontWeights.semibold }}>
                  <span>{review.name}</span>
                  <span style={{ color: colors.warning }}>★★★★★</span>
                </div>
                <p className="mt-2" style={{ fontSize: fontSizes.xs, color: textMuted }}>{review.text}</p>
                <p className="mt-3" style={{ fontSize: "11px", color: colors.gray[400] }}>{review.date}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 sm:mt-12">
          <h2 className="mb-6" style={{ fontSize: fontSizes["2xl"], fontWeight: fontWeights.bold }}>You Might Also Like</h2>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {relatedProducts.map((item, index) => (
              <Link
                key={item.id ?? `${item.title}-${index}`}
                href={item.id != null ? `/product/${item.id}` : "#"}
                className="block rounded-2xl border p-4 transition hover:shadow-md"
                style={{ borderColor, borderRadius: radii.xl, background: colors.white, boxShadow: shadows.sm }}
              >
                <div
                  className="relative mb-4 h-36 w-full overflow-hidden sm:h-40"
                  style={{ borderRadius: radii.xl, background: colors.gray[50] }}
                >
                  <Image
                    src={item.image ?? ""}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-contain"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                <div className="line-clamp-2" style={{ fontSize: fontSizes.sm, fontWeight: fontWeights.semibold }}>
                  {item.title}
                </div>
                <div style={{ fontSize: fontSizes.sm, fontWeight: fontWeights.bold, color: colors.brand[600] }}>${item.price}</div>
              </Link>
            ))}
            {relatedProducts.length === 0 && (
              <p style={{ fontSize: fontSizes.sm, color: textSecondary }}>No related products found.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
