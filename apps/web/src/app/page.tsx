"use client";

import { useMemo } from "react";
import { type Product } from "@monorepo/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BrandStrip from "../components/home/BrandStrip";
import DressStyleSection from "../components/home/DressStyleSection";
import HeroSection from "../components/home/HeroSection";
import ProductSection from "../components/home/ProductSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import { useProducts } from "../hooks/useProducts";

export default function HomePage() {
  const { data, isLoading, isError } = useProducts();

  const { newArrivals, topSelling } = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    return { newArrivals: list.slice(0, 4), topSelling: list.slice(4, 8) };
  }, [data]);
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

      <HeroSection />
      <BrandStrip />
      <ProductSection
        title="NEW ARRIVALS"
        titleClassName="mb-6 text-center text-[28px] font-bold leading-[34px] text-black sm:mb-8 sm:text-[48px] sm:leading-[58px]"
        products={newArrivals}
        getDiscount={getDiscount}
        formatPrice={formatPrice}
      />
      <div className="mx-auto max-w-[1200px] px-4 sm:px-5">
        <hr className="border-zinc-200" />
      </div>
      <ProductSection
        title="TOP SELLING"
        titleClassName="mb-6 text-center text-[28px] font-bold leading-[34px] text-black underline decoration-2 sm:no-underline sm:mb-8 sm:text-[48px] sm:leading-[58px]"
        products={topSelling}
        getDiscount={(seed) => getDiscount(seed + 7)}
        formatPrice={formatPrice}
      />
      <div className="mx-auto max-w-[1200px] px-4 sm:px-5">
        <hr className="border-zinc-200" />
      </div>
      <DressStyleSection />
      <TestimonialsSection />

      <Footer />
    </main>
  );
}
