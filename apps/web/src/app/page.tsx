"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@monorepo/api";

type Product = {
  id: number;
  title: string;
  price: number;
  image?: string | null;
};

export default function HomePage() {
  const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => getProducts()
  });

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
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">
        Öne Çıkan Ürünler
      </h1>

      <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.isArray(data) &&
          data.map((product) => (
            <article
              key={product.id}
              className="flex flex-col rounded-xl border bg-white p-4"
            >
              <div className="relative mb-4 h-40 w-full">
                <Image
                  src={product.image ?? ""}
                  alt={product.title}
                  fill
                  className="object-contain"
                />
              </div>

              <h2 className="mb-1 line-clamp-2 text-sm font-medium">
                {product.title}
              </h2>

              <p className="mt-auto text-lg font-semibold">${product.price}</p>
            </article>
          ))}
      </section>
    </main>
  );
}
