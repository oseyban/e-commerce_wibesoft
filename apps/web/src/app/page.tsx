"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { type Product } from "@monorepo/api";
import testimonials from "../data/testimonials.json";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { themeColors } from "../data/theme-colors";
import { useProducts } from "../hooks/useProducts";

const ASSETS = {
  logo: "/images/logo.png",
  menu: "/images/menu.png",
  search: "/images/search.png",
  cart: "/images/cart.png",
  profile: "/images/profile.png",
  hero: "/images/home_ust.png",
  star: "/images/star.png",
  social: "/images/Social.png",
  finance: "/images/finance.png",
  dress: {
    causal: "/images/causal.png",
    formal: "/images/formal.png",
    party: "/images/party.png",
    gym: "/images/gym.png",
  },
  brands: {
    versace: "/images/brand/versace.png",
    zara: "/images/brand/zara.png",
    gucci: "/images/brand/gucci.png",
    prada: "/images/brand/prada.png",
    calvin: "/images/brand/calvin-klein.png",
  },
};

function Star({ small = false }: { small?: boolean }) {
  const size = small ? 12 : 18;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2.5l2.6 5.3 5.8.8-4.2 4 1 5.7L12 17.8 6.8 18.5l1-5.7L3.6 8.8l5.8-.8L12 2.5z" fill={themeColors.accent.warning} />
    </svg>
  );
}

function RatingRow() {
  return (
    <div className="flex items-center gap-1">
      <Star />
      <Star />
      <Star />
      <Star />
      <Star small />
      <span className="ml-2 text-xs text-zinc-500">4.5/5</span>
    </div>
  );
}

export default function HomePage() {
  const { data, isLoading, isError } = useProducts();

  const { newArrivals, topSelling } = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    return { newArrivals: list.slice(0, 4), topSelling: list.slice(4, 8) };
  }, [data]);
  const [testimonialIndex, setTestimonialIndex] = useState(1);

  const formatPrice = (value: number) => `$${value.toFixed(2)}`;
  const getDiscount = (seed: number) => {
    if (seed % 5 === 0) return 20;
    if (seed % 3 === 0) return 10;
    return 0;
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-zinc-500">Yükleniyor…</p></div>;
  }
  if (isError || !data) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-red-500">Ürünler yüklenemedi</p></div>;
  }

  return (
    <main className="bg-white text-zinc-900">
      <Header />

      {/* HERO */}
      <section className="relative w-full" style={{ background: themeColors.neutral.gray300 }}>
        {/* Decoratif stars*/}
        <Image
          src={ASSETS.star}
          alt=""
          width={56}
          height={56}
          className="absolute left-[18%] top-[72%] sm:left-[52.08%] sm:top-[30.5%]"
          aria-hidden
        />
        <Image
          src={ASSETS.star}
          alt=""
          width={104}
          height={104}
          className="absolute left-[68%] top-[62%] sm:left-[82%] sm:top-[15.03%]"
          aria-hidden
        />
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 items-center gap-6 px-4 sm:px-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-0" style={{ minHeight: 663 }}>
          {/* Left text alanı*/}
          <div className="pl-4 pr-4 py-8 sm:pl-6 sm:pr-6 lg:pl-[72px] lg:pr-6 lg:py-12">
            <h1 className="max-w-[315px] text-[36px] leading-[34px] font-extrabold text-black sm:max-w-[600px] sm:text-[48px] sm:leading-[52px] lg:text-[64px] lg:leading-[64px]" style={{ fontFamily: "var(--font-integral), sans-serif" }}>
              FIND CLOTHES THAT MATCHES YOUR STYLE
            </h1>

            <p className="mt-4 max-w-[600px] text-[14px] leading-[20px] text-black/60 sm:mt-6 sm:text-[16px] sm:leading-[22px]" style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>
              Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
            </p>

            <Link href="/category" className="mt-6 inline-flex w-full max-w-[358px] items-center justify-center rounded-[62px] bg-black px-8 py-3 text-sm text-white mx-auto sm:mx-0 sm:mt-8 sm:w-auto sm:px-12 sm:py-4" style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>
              Shop Now
            </Link>

            <div className="mt-6 grid max-w-[545px] grid-cols-2 gap-4 text-center sm:mt-10 sm:grid-cols-3 sm:gap-6 sm:text-left">
              <div>
                <div className="text-lg font-bold sm:text-2xl">200+</div>
                <div className="text-[11px] text-black/60 sm:text-sm">International Brands</div>
              </div>
              <div>
                <div className="text-lg font-bold sm:text-2xl">2,000+</div>
                <div className="text-[11px] text-black/60 sm:text-sm">High-Quality Products</div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-lg font-bold sm:text-2xl">30,000+</div>
                <div className="text-[11px] text-black/60 sm:text-sm">Happy Customers</div>
              </div>
            </div>
          </div>

          {/* Right: image */}
          <div className="flex items-center justify-center pr-0 lg:justify-end lg:pr-[40px]">
            <div className="relative h-[300px] w-[300px] sm:h-[360px] sm:w-[360px] lg:w-[520px] lg:h-[560px]">
              <Image
                src={ASSETS.hero}
                alt="Hero"
                fill
                sizes="(min-width:1024px) 520px, (min-width:640px) 420px, 320px"
                className="object-contain object-left-bottom"
                style={{ objectPosition: "55% 100%" }}
                priority
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Decoratif star */}
        <div className="pointer-events-none">
          <Image
            src={ASSETS.star}
            alt=""
            width={40}
            height={40}
            className="absolute hidden lg:block"
            style={{ left: "72%", top: "310px" }}
            aria-hidden
          />
        </div>
      </section>

      {/* Brand logolar */}
      <section className="bg-black py-4">
        <div className="mx-auto max-w-[1200px] flex flex-wrap items-center justify-center gap-4 px-4 sm:flex-nowrap sm:justify-between sm:gap-6 sm:px-5">
          <Image src={ASSETS.brands.versace} alt="versace" width={110} height={26} className="h-[26px] w-[110px] object-contain sm:h-[32px] sm:w-[140px]" />
          <Image src={ASSETS.brands.zara} alt="zara" width={110} height={26} className="h-[26px] w-[110px] object-contain sm:h-[32px] sm:w-[140px]" />
          <Image src={ASSETS.brands.gucci} alt="gucci" width={110} height={26} className="h-[26px] w-[110px] object-contain sm:h-[32px] sm:w-[140px]" />
          <Image src={ASSETS.brands.prada} alt="prada" width={110} height={26} className="h-[26px] w-[110px] object-contain sm:h-[32px] sm:w-[140px]" />
          <Image src={ASSETS.brands.calvin} alt="calvin" width={110} height={26} className="h-[26px] w-[110px] object-contain sm:h-[32px] sm:w-[140px]" />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-5">
        <h2
          className="mb-6 text-center text-[28px] font-bold leading-[34px] text-black sm:mb-8 sm:text-[48px] sm:leading-[58px]"
          style={{ fontFamily: "var(--font-integral), sans-serif" }}
        >
          NEW ARRIVALS
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((p, i) => {
            const seed = p.id ?? i;
            const discount = getDiscount(seed);
            const originalPrice = discount ? p.price / (1 - discount / 100) : p.price;

            return (
            <article key={p.id ?? `${p.title}-${i}`} className={`rounded-2xl border border-zinc-200 bg-white overflow-hidden ${i > 1 ? "hidden sm:block" : ""}`}>
              <Link href={p.id ? `/product/${p.id}` : "#"} className="block">
                <div className="relative h-40 w-full bg-zinc-50">
                  <Image src={p.image ?? ""} alt={p.title} fill unoptimized className="object-contain" />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold line-clamp-2" style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>{p.title}</h3>
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
          <button className="w-full max-w-[260px] rounded-full border border-black px-6 py-2 text-sm sm:w-auto">View All</button>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-5">
        <hr className="border-zinc-200" />
      </div>

      {/* Top Selling*/}
      <section className="mx-auto max-w-[1200px] px-4 pb-12 pt-12 sm:px-5">
        <h2
          className="mb-6 text-center text-[28px] font-bold leading-[34px] text-black underline decoration-2 sm:no-underline sm:mb-8 sm:text-[48px] sm:leading-[58px]"
          style={{ fontFamily: "var(--font-integral), sans-serif" }}
        >
          TOP SELLING
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topSelling.map((p, i) => {
            const seed = (p.id ?? i) + 7;
            const discount = getDiscount(seed);
            const originalPrice = discount ? p.price / (1 - discount / 100) : p.price;

            return (
            <article key={p.id ?? `${p.title}-${i}`} className={`rounded-2xl border border-zinc-200 bg-white overflow-hidden ${i > 1 ? "hidden sm:block" : ""}`}>
              <Link href={p.id ? `/product/${p.id}` : "#"} className="block">
                <div className="relative h-40 w-full bg-zinc-50">
                  <Image src={p.image ?? ""} alt={p.title} fill unoptimized className="object-contain" />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold line-clamp-2" style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>{p.title}</h3>
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
          <button className="w-full max-w-[260px] rounded-full border border-black px-6 py-2 text-sm sm:w-auto">View All</button>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-5">
        <hr className="border-zinc-200" />
      </div>

      {/* Browse by Dress Style */}
      <section className="mx-auto max-w-[1200px] px-4 pb-12 pt-12 sm:px-5">
        <div className="rounded-3xl bg-zinc-100 px-6 pb-6 pt-10 sm:px-8">
          <h2
            className="mb-4 text-center text-[28px] font-bold leading-[34px] text-black sm:mb-6 sm:text-[48px] sm:leading-[58px]"
            style={{ fontFamily: "var(--font-integral), sans-serif" }}
          >
            BROWSE BY DRESS STYLE
          </h2>
          {/* Top row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="relative h-[220px] overflow-hidden rounded-2xl bg-white">
              <Image src={ASSETS.dress.causal} alt="Casual" fill className="object-cover scale-x-[-1]" />
              <div className="absolute left-4 top-4 text-xl font-semibold">Casual</div>
            </div>
            <div className="relative h-[220px] overflow-hidden rounded-2xl bg-white">
              <Image src={ASSETS.dress.formal} alt="Formal" fill className="object-cover" />
              <div className="absolute left-4 top-4 text-xl font-semibold">Formal</div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr]">
            <div className="relative h-[220px] overflow-hidden rounded-2xl bg-white">
              <Image src={ASSETS.dress.party} alt="Party" fill className="object-cover" />
              <div className="absolute left-4 top-4 text-xl font-semibold">Party</div>
            </div>
            <div className="relative h-[220px] overflow-hidden rounded-2xl bg-white">
              <Image src={ASSETS.dress.gym} alt="Gym" fill className="object-cover" />
              <div className="absolute left-4 top-4 text-xl font-semibold">Gym</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Happy Customers */}
      <section className="mx-auto max-w-[1200px] px-4 pb-12 sm:px-5">
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <h2
            className="text-[28px] font-bold leading-[34px] text-black underline decoration-2 sm:no-underline sm:text-[48px] sm:leading-[58px]"
            style={{ fontFamily: "var(--font-integral), sans-serif" }}
          >
            OUR HAPPY CUSTOMERS
          </h2>
          <div className="flex gap-2">
            <button
              className="h-8 w-8 rounded-full border border-zinc-300"
              onClick={() =>
                setTestimonialIndex((prev) =>
                  prev <= 0 ? testimonials.length - 1 : prev - 1
                )
              }
              type="button"
              aria-label="Previous testimonials"
            >
              ←
            </button>
            <button
              className="h-8 w-8 rounded-full border border-zinc-300"
              onClick={() =>
                setTestimonialIndex((prev) =>
                  prev >= testimonials.length - 1 ? 0 : prev + 1
                )
              }
              type="button"
              aria-label="Next testimonials"
            >
              →
            </button>
          </div>
        </div>
        {/* Mobile: single card */}
        <div className="grid gap-4 sm:hidden">
          {testimonials.slice(0, 1).map((item) => (
            <div key={item.id} className="rounded-2xl border border-zinc-200 p-5">
              <RatingRow />
              <div className="mt-3 flex items-center gap-2 text-sm font-semibold">
                <span>{item.name}</span>
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[11px]">
                  ✓
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-600">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Desktop/mobil carousel */}
        <div className="relative hidden overflow-hidden sm:block">
          <div
            className="flex items-stretch gap-4 transition-transform duration-300"
            style={{
              transform: `translateX(calc(50% - ${testimonialIndex * 336 + 160}px))`,
            }}
          >
            {testimonials.map((item, idx) => {
              const distance = Math.abs(idx - testimonialIndex);
              const faded = distance > 1;
              return (
                <div
                  key={item.id}
                  className={`min-w-[320px] rounded-2xl border border-zinc-200 p-5 transition ${
                    faded ? "opacity-25" : "opacity-100"
                  }`}
                >
                  <RatingRow />
                  <div className="mt-3 flex items-center gap-2 text-sm font-semibold">
                    <span>{item.name}</span>
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[11px]">
                      ✓
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-600">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
