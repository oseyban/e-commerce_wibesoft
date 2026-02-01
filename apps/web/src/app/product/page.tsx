"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@monorepo/api";
import type { Product } from "@monorepo/api";

export default function ProductsPage() {
  const { data = [], isLoading, isError, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading) {
    return <p className="p-8 text-center text-neutral-500">Yükleniyor...</p>;
  }

  if (isError) {
    return (
      <p className="p-8 text-center text-red-500">
        Hata oluştu: {(error as Error).message}
      </p>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Ürünler</h1>

      <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.map((product) => (
          <Link
            key={product.id}
            href={product.id != null ? `/product/${product.id}` : "#"}
            className="flex flex-col rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="relative mb-4 flex h-40 w-full items-center justify-center">
              <Image
                src={product.image ?? ""}
                alt={product.title}
                width={300}
                height={160}
                style={{ objectFit: "contain" }}
              />
            </div>

            <h2 className="mb-2 line-clamp-2 text-sm font-medium">
              {product.title}
            </h2>

            <p className="mt-auto text-lg font-semibold">${product.price}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
