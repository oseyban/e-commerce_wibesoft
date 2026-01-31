"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, type Product } from "@monorepo/api";

export default function HomePage() {
  const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const res = await getProducts();
      if (Array.isArray(res)) return res;
      if (res && typeof res === "object" && "data" in res) {
        return (res as { data?: Product[] }).data ?? [];
      }
      return [];
    }
  });

  const { newArrivals, topSelling } = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    return {
      newArrivals: list.slice(0, 4),
      topSelling: list.slice(4, 8)
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Yükleniyor…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Ürünler yüklenemedi</p>
      </div>
    );
  }

  return (
    <main className="bg-white text-zinc-900">
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border">
              S
            </span>
            SHOP.CO
          </div>
          <div className="flex items-center gap-3 text-sm">
            <button className="rounded-full border border-zinc-300 px-3 py-1">
              Sign In
            </button>
            <div className="flex items-center gap-2 text-zinc-600">
              <span>🔍</span>
              <span>🛒</span>
              <span>👤</span>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Find clothes that match your style
            </p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">
              Find clothes
              <br />
              that match
              <br />
              your style
            </h1>
            <p className="mt-4 text-sm text-zinc-600">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense
              of style.
            </p>
            <button className="mt-6 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white">
              Shop Now
            </button>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center text-xs text-zinc-600">
              <div>
                <div className="text-lg font-bold text-zinc-900">200+</div>
                International Brands
              </div>
              <div>
                <div className="text-lg font-bold text-zinc-900">2,000+</div>
                High-Quality Products
              </div>
              <div>
                <div className="text-lg font-bold text-zinc-900">30,000+</div>
                Happy Customers
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-zinc-100">
            <div className="absolute right-6 top-6 h-8 w-8 rounded-full border-2 border-zinc-400" />
            <div className="absolute left-8 top-14 h-4 w-4 rounded-full bg-zinc-300" />
            <div className="flex h-80 items-center justify-center text-sm text-zinc-500">
              Hero Image
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900 py-6 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 text-lg font-semibold uppercase">
          <span>Versace</span>
          <span>Zara</span>
          <span>Gucci</span>
          <span>Prada</span>
          <span>Calvin Klein</span>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">New Arrivals</h2>
          <button className="rounded-full border px-4 py-2 text-xs">
            View All
          </button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product, index) => (
            <article
              key={product.id ?? `${product.title}-${index}`}
              className="rounded-2xl border border-zinc-200 bg-white p-4"
            >
              <Link
                href={product.id ? `/product/${product.id}` : "#"}
                className={product.id ? "block" : "pointer-events-none block"}
              >
              <div className="relative mb-4 h-40 w-full overflow-hidden rounded-xl bg-zinc-50">
                <Image
                  src={product.image ?? ""}
                  alt={product.title}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
                <h3 className="line-clamp-2 text-sm font-semibold">
                  {product.title}
                </h3>
                <p className="mt-2 text-sm font-bold">${product.price}</p>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Top Selling</h2>
          <button className="rounded-full border px-4 py-2 text-xs">
            View All
          </button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {topSelling.map((product, index) => (
            <article
              key={product.id ?? `${product.title}-${index}`}
              className="rounded-2xl border border-zinc-200 bg-white p-4"
            >
              <Link
                href={product.id ? `/product/${product.id}` : "#"}
                className={product.id ? "block" : "pointer-events-none block"}
              >
              <div className="relative mb-4 h-40 w-full overflow-hidden rounded-xl bg-zinc-50">
                <Image
                  src={product.image ?? ""}
                  alt={product.title}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
                <h3 className="line-clamp-2 text-sm font-semibold">
                  {product.title}
                </h3>
                <p className="mt-2 text-sm font-bold">${product.price}</p>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="mb-6 text-2xl font-bold">Browse by Dress Style</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Casual", "Formal", "Party", "Gym"].map((style) => (
            <div
              key={style}
              className="flex h-36 items-end justify-between rounded-2xl bg-zinc-100 p-4"
            >
              <span className="text-sm font-semibold">{style}</span>
              <span className="text-xs text-zinc-500">Explore</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Our Happy Customers</h2>
          <div className="flex gap-2">
            <button className="h-8 w-8 rounded-full border">‹</button>
            <button className="h-8 w-8 rounded-full border">›</button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Great quality and style. I love the fit!",
            "Fast delivery and amazing customer support.",
            "The fabrics are premium and comfortable."
          ].map((text, idx) => (
            <div
              key={text}
              className="rounded-2xl border border-zinc-200 p-4"
            >
              <div className="mb-2 text-sm font-semibold">
                {idx === 0 ? "Sarah M." : idx === 1 ? "Liam K." : "Ava P."}
              </div>
              <p className="text-xs text-zinc-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900 py-12 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl bg-zinc-800 p-8">
            <h2 className="text-2xl font-bold">
              Stay upto date about our latest offers
            </h2>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                placeholder="Enter your email address"
                className="w-full rounded-full bg-white px-4 py-3 text-sm text-zinc-900"
              />
              <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900">
                Subscribe to Newsletter
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-xs text-zinc-600">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-3 text-base font-extrabold text-zinc-900">
              SHOP.CO
            </div>
            <p>
              We have clothes that suits your style and which you’re proud to
              wear.
            </p>
          </div>
          <div>
            <div className="mb-2 font-semibold text-zinc-900">Company</div>
            <ul className="space-y-1">
              <li>About</li>
              <li>Features</li>
              <li>Works</li>
              <li>Career</li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-semibold text-zinc-900">Help</div>
            <ul className="space-y-1">
              <li>Customer Support</li>
              <li>Delivery Details</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-semibold text-zinc-900">Resources</div>
            <ul className="space-y-1">
              <li>Free eBooks</li>
              <li>Development Tutorial</li>
              <li>How to - Blog</li>
              <li>Youtube Playlist</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between border-t pt-4">
          <span>Shop.co © 2000-2023, All Rights Reserved</span>
          <div className="flex gap-2">
            <span>VISA</span>
            <span>MC</span>
            <span>PayPal</span>
            <span>ApplePay</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
