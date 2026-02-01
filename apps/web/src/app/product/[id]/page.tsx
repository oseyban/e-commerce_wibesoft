"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProductById, getProducts, type Product } from "@monorepo/api";
import { useStore } from "../../../lib/store";
import { colors, spacing, radii, fontSizes, fontWeights, shadows } from "../../../../../../packages/design-tokens/src";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import reviews from "../../../data/reviews.json";

type Review = {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
};

type CartItemInput = {
  id: number;
  title: string;
  price: number;
  qty: number;
  image?: string | null;
};

type StoreState = {
  add: (item: CartItemInput) => void;
};

type ProductWithRating = Product & {
  rating?: {
    rate?: number;
    count?: number;
  };
};

const reviewList = reviews as Review[];

const colorOptions = [
  { label: "Olive", value: "olive", swatch: "#4B4B3B" },
  { label: "Black", value: "black", swatch: "#1F1F1F" },
  { label: "Navy", value: "navy", swatch: "#2F365B" },
  { label: "White", value: "white", swatch: "#F4F4F4" },
];
const sizeOptions = ["Small", "Medium", "Large", "X-Large"];

const ASSETS = {
  filter: "/images/filtrele.png",
  latestArrow: "/images/latest_ok.png",
};

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "reviews" | "faqs">("reviews");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"latest" | "highest" | "lowest">("latest");
  const [visibleReviews, setVisibleReviews] = useState(6);

  const relatedProducts = useMemo(() => {
    if (!data) return [];
    const sameCategory = allProducts.filter(
      (item) => item.category === data.category && item.id !== data.id
    );
    const others = allProducts.filter(
      (item) => item.category !== data.category && item.id !== data.id
    );
    const combined = [...sameCategory, ...others];
    return combined.slice(0, 4);
  }, [allProducts, data]);

  const thumbnails = useMemo(() => {
    const src = data?.image ?? "";
    if (!src) return [];
    return [src, src, src];
  }, [data?.image]);

  const activeImage = selectedImage ?? data?.image ?? "";

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  const discountPercent = useMemo(() => {
    if (!Number.isFinite(productId)) return 0;
    if (productId % 5 === 0) return 40;
    if (productId % 3 === 0) return 20;
    return 0;
  }, [productId]);

  const discountedPrice = useMemo(() => {
    if (!discountPercent) return data?.price ?? 0;
    return Math.round((data?.price ?? 0) * (1 - discountPercent / 100));
  }, [data?.price, discountPercent]);

  const getDiscountPercent = (seed: number) => {
    if (seed % 5 === 0) return 30;
    if (seed % 3 === 0) return 20;
    return 0;
  };

  const getRatingRate = (item: Product) => {
    const rating = (item as ProductWithRating).rating;
    return rating?.rate ?? 4;
  };

  const sortedReviews = useMemo(() => {
    const list = [...reviewList];
    const toDate = (value: string) => {
      const text = value.replace("Posted on ", "");
      const parsed = Date.parse(text);
      return Number.isNaN(parsed) ? 0 : parsed;
    };
    if (sortBy === "latest") {
      return list.sort((a, b) => toDate(b.date) - toDate(a.date));
    }
    if (sortBy === "highest") {
      return list.sort((a, b) => b.rating - a.rating);
    }
    return list.sort((a, b) => a.rating - b.rating);
  }, [sortBy]);

  const { add } = useStore((state: StoreState) => ({
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
      <Header />

      <div className="mx-auto max-w-[1200px] px-4 py-4 text-xs text-zinc-500 sm:px-5">
        <nav className="flex flex-wrap items-center gap-2" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/product" className="hover:underline">Shop</Link>
          <span>/</span>
          <span>Men</span>
          <span>/</span>
          <span>{data.category || "T-shirt"}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 sm:py-6 md:py-8">

        <section className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,100px)_1fr_minmax(0,1fr)] lg:gap-10">
          {/* Thumbnails: horizontal on mobile, vertical on lg */}
          <div className="flex flex-row gap-2 lg:flex-col lg:gap-3">
            {thumbnails.length ? (
              thumbnails.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(src)}
                  className="relative flex h-20 w-20 shrink-0 items-center justify-center lg:h-24 lg:w-full"
                  style={{
                    borderRadius: radii.xl,
                    border: `2px solid ${src === activeImage ? colors.brand[600] : borderColor}`,
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
                </button>
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
                src={activeImage}
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
              className="text-3xl font-bold uppercase leading-tight sm:text-4xl"
              style={{
                fontSize: "40px",
                lineHeight: "48px",
                fontWeight: 700,
                fontFamily: "var(--font-integral)",
              }}
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
                    {formatPrice(data.price)}
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ background: "#FF33331A", color: "#FF3333" }}
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
              {data.description}
            </p>

            <div className="mt-6 space-y-4 sm:mt-8">
              <div>
                <div style={{ fontSize: fontSizes.sm, fontWeight: fontWeights.semibold }}>Select Colors</div>
                <div className="mt-2 flex flex-wrap gap-3">
                  {colorOptions.map((color) => {
                    const isSelected = selectedColor.value === color.value;
                    return (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setSelectedColor(color)}
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
              <div>
                <div style={{ fontSize: fontSizes.sm, fontWeight: fontWeights.semibold }}>Choose Size</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className="min-h-[40px] rounded-full border px-4 py-2 text-xs transition active:scale-95 sm:min-h-0"
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
            <button
              className="pb-3"
              style={{
                borderBottom: activeTab === "details" ? `2px solid ${colors.black}` : "2px solid transparent",
                color: activeTab === "details" ? colors.gray[900] : textSecondary,
              }}
              onClick={() => setActiveTab("details")}
              type="button"
            >
              Product Details
            </button>
            <button
              className="pb-3"
              style={{
                borderBottom: activeTab === "reviews" ? `2px solid ${colors.black}` : "2px solid transparent",
                color: activeTab === "reviews" ? colors.gray[900] : textSecondary,
              }}
              onClick={() => setActiveTab("reviews")}
              type="button"
            >
              Rating & Reviews
            </button>
            <button
              className="pb-3"
              style={{
                borderBottom: activeTab === "faqs" ? `2px solid ${colors.black}` : "2px solid transparent",
                color: activeTab === "faqs" ? colors.gray[900] : textSecondary,
              }}
              onClick={() => setActiveTab("faqs")}
              type="button"
            >
              FAQs
            </button>
          </div>
        </section>

        {activeTab === "details" && (
          <section className="mt-6 sm:mt-8">
            <h2 style={{ fontSize: fontSizes.xl, fontWeight: fontWeights.bold }}>Product Details</h2>
            <p className="mt-3" style={{ fontSize: fontSizes.sm, color: textMuted, lineHeight: 1.7 }}>
              {data.description}
            </p>
          </section>
        )}

        {activeTab === "reviews" && (
          <section className="mt-6 sm:mt-8">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 style={{ fontSize: fontSizes.xl, fontWeight: fontWeights.bold }}>
                  All Reviews <span style={{ color: textSecondary, fontWeight: 400 }}>(451)</span>
                </h2>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <button
                  type="button"
                  className="flex items-center justify-center rounded-full bg-zinc-100 px-4 py-2"
                  style={{ minWidth: 48, minHeight: 48 }}
                  aria-label="Filter reviews"
                >
                  <Image src={ASSETS.filter} alt="Filter" width={20} height={20} unoptimized />
                </button>
                <div className="relative w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSortOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between gap-2 rounded-full bg-zinc-100 px-4 py-2 sm:w-auto"
                    style={{ minHeight: 48, fontSize: "16px", fontWeight: 500, color: colors.black }}
                    aria-haspopup="listbox"
                    aria-expanded={sortOpen}
                  >
                    <span>{sortBy === "latest" ? "Latest" : sortBy === "highest" ? "Highest" : "Lowest"}</span>
                    <Image src={ASSETS.latestArrow} alt="Open" width={14} height={14} unoptimized />
                  </button>
                  {sortOpen && (
                    <div
                      className="absolute right-0 z-10 mt-2 w-full min-w-[160px] rounded-2xl border bg-white p-2 shadow-lg"
                      style={{ borderColor }}
                      role="listbox"
                    >
                      {["latest", "highest", "lowest"].map((value) => (
                        <button
                          key={value}
                          type="button"
                          className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-zinc-100"
                          onClick={() => {
                            setSortBy(value as "latest" | "highest" | "lowest");
                            setSortOpen(false);
                          }}
                        >
                          {value === "latest" ? "Latest" : value === "highest" ? "Highest" : "Lowest"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className="w-full rounded-full bg-black px-5 py-3 text-sm font-medium text-white sm:w-auto"
                  style={{ fontSize: "16px", lineHeight: "22px" }}
                  type="button"
                >
                  Write a Review
                </button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {sortedReviews.slice(0, visibleReviews).map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border p-4"
                  style={{ borderColor, borderRadius: radii.xl, boxShadow: shadows.sm }}
                >
                  <div className="flex items-center gap-1" style={{ color: colors.warning, fontSize: fontSizes.sm }}>
                    {"★★★★★"}
                  </div>
                  <div
                    className="mt-2 flex items-center gap-2"
                    style={{ fontSize: fontSizes.sm, fontWeight: fontWeights.semibold }}
                  >
                    <span>{review.name}</span>
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                      ✓
                    </span>
                  </div>
                  <p className="mt-2" style={{ fontSize: fontSizes.xs, color: textMuted }}>{review.text}</p>
                  <p className="mt-3" style={{ fontSize: "11px", color: colors.gray[400] }}>{review.date}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <button
                className="rounded-full border px-6 py-2 text-sm"
                style={{ borderColor }}
                type="button"
                onClick={() => setVisibleReviews(8)}
              >
                Load More Reviews
              </button>
            </div>
          </section>
        )}

        {activeTab === "faqs" && (
          <section className="mt-6 sm:mt-8">
            <h2 style={{ fontSize: fontSizes.xl, fontWeight: fontWeights.bold }}>FAQs</h2>
            <div className="mt-4 space-y-3 text-sm text-zinc-600">
              <div className="rounded-2xl border p-4" style={{ borderColor }}>
                <div className="font-semibold text-zinc-900">How do I choose my size?</div>
                <p className="mt-2">Check the size chart and compare with a similar item you own.</p>
              </div>
              <div className="rounded-2xl border p-4" style={{ borderColor }}>
                <div className="font-semibold text-zinc-900">Can I return this item?</div>
                <p className="mt-2">Returns are accepted within 30 days in original condition.</p>
              </div>
            </div>
          </section>
        )}

        <section className="mt-10 sm:mt-12">
          <h2
            className="mb-6 text-center"
            style={{
              fontSize: "48px",
              lineHeight: "58px",
              fontWeight: 700,
              fontFamily: "var(--font-integral)",
              color: colors.black,
            }}
          >
            You Might Also Like
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {relatedProducts.map((item, index) => (
              (() => {
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
                className="block"
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
                      <div className="text-sm text-zinc-400 line-through">{formatPrice(currentPrice)}</div>
                      <span className="rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: "#FF33331A", color: "#FF3333" }}>
                        -{relatedDiscount}%
                      </span>
                    </>
                  )}
                </div>
              </Link>
                );
              })()
            ))}
            {relatedProducts.length === 0 && (
              <p style={{ fontSize: fontSizes.sm, color: textSecondary }}>No related products found.</p>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
