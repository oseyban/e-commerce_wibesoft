"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProductById, type Product } from "@monorepo/api";

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
        <p className="text-red-500">Ürün yüklenemedi</p>
      </div>
    );
  }

  return (
    <main className="bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 text-xs text-zinc-500">
          Home / Shop / Men / T-Shirts
        </div>

        <section className="grid gap-10 lg:grid-cols-[120px_1fr_1fr]">
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((slot) => (
              <div
                key={slot}
                className="flex h-24 w-full items-center justify-center rounded-xl border bg-zinc-50 text-xs text-zinc-400"
              >
                Thumb
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center rounded-3xl bg-zinc-100 p-8">
            <div className="relative h-72 w-full">
              <Image
                src={data.image ?? ""}
                alt={data.title}
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold">{data.title}</h1>
            <div className="mt-3 flex items-center gap-2 text-sm text-zinc-600">
              <span className="text-yellow-500">★★★★★</span>
              <span>4.5/5</span>
            </div>
            <div className="mt-4 text-2xl font-bold">${data.price}</div>
            <p className="mt-4 text-sm text-zinc-600">{data.description}</p>

            <div className="mt-6 space-y-4">
              <div>
                <div className="text-sm font-semibold">Select Colors</div>
                <div className="mt-2 flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      className="rounded-full border px-4 py-2 text-xs"
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold">Choose Size</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      className="rounded-full border px-4 py-2 text-xs"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-full border px-3 py-2 text-sm">
                  <button className="px-2">-</button>
                  <span className="px-2">1</span>
                  <button className="px-2">+</button>
                </div>
                <button className="flex-1 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 border-b">
          <div className="flex gap-6 text-sm font-semibold text-zinc-500">
            <button className="border-b-2 border-black pb-3 text-zinc-900">
              Product Details
            </button>
            <button className="pb-3">Rating & Reviews</button>
            <button className="pb-3">FAQs</button>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">All Reviews</h2>
            <button className="rounded-full border px-4 py-2 text-xs">
              Write a Review
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-zinc-200 p-4"
              >
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>{review.name}</span>
                  <span className="text-yellow-500">★★★★★</span>
                </div>
                <p className="mt-2 text-xs text-zinc-600">{review.text}</p>
                <p className="mt-3 text-[11px] text-zinc-400">{review.date}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">You Might Also Like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`related-${index}`}
                className="rounded-2xl border border-zinc-200 bg-white p-4"
              >
                <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-zinc-50 text-xs text-zinc-400">
                  Product
                </div>
                <div className="text-sm font-semibold">Related Product</div>
                <div className="text-sm font-bold">$120</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
