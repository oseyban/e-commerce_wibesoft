"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, type Product } from "@monorepo/api";

const categories = ["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"];
const sizes = [
  "XX-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
  "3X-Large",
  "4X-Large"
];

const colors = [
  { name: "Green", className: "bg-green-500" },
  { name: "Red", className: "bg-red-500" },
  { name: "Yellow", className: "bg-yellow-400" },
  { name: "Orange", className: "bg-orange-400" },
  { name: "Sky", className: "bg-sky-400" },
  { name: "Blue", className: "bg-blue-600" },
  { name: "Purple", className: "bg-purple-500" },
  { name: "Pink", className: "bg-pink-500" },
  { name: "White", className: "bg-white" },
  { name: "Black", className: "bg-black" }
];

const categoryMap: Record<string, string[]> = {
  "T-shirts": ["men's clothing", "women's clothing"],
  Shorts: ["men's clothing"],
  Shirts: ["men's clothing"],
  Hoodie: ["men's clothing"],
  Jeans: ["men's clothing"]
};

const getProductMeta = (product: Product) => {
  const seed =
    typeof product.id === "number" ? product.id : product.title.length;
  const sizeIndex = seed % sizes.length;
  const colorIndex = seed % colors.length;
  const sizePool = [
    sizes[sizeIndex],
    sizes[(sizeIndex + 3) % sizes.length],
    sizes[(sizeIndex + 5) % sizes.length]
  ];
  const colorPool = [
    colors[colorIndex].name,
    colors[(colorIndex + 2) % colors.length].name
  ];
  return { sizes: sizePool, colors: colorPool };
};

const normalizeProducts = async (): Promise<Product[]> => {
  const res = await getProducts();
  if (Array.isArray(res)) return res;
  if (res && typeof res === "object" && "data" in res) {
    return (res as { data?: Product[] }).data ?? [];
  }
  return [];
};

export default function CategoryPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const { data = [], isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products", "category"],
    queryFn: normalizeProducts
  });

  const priceBounds = useMemo(() => {
    const prices = data.map((item) => item.price ?? 0).filter((v) => v > 0);
    if (!prices.length) return { min: 0, max: 0 };
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [data]);

  useEffect(() => {
    if (!priceBounds.max) return;
    setPriceRange([priceBounds.min, priceBounds.max]);
  }, [priceBounds.min, priceBounds.max]);

  const filteredProducts = useMemo(() => {
    let list = [...data];

    if (selectedCategories.length) {
      const allowedCategories = new Set(
        selectedCategories.flatMap((cat) => categoryMap[cat] ?? [])
      );
      list = list.filter((item) =>
        allowedCategories.has(String(item.category ?? ""))
      );
    }

    list = list.filter(
      (item) =>
        item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    if (selectedSizes.length) {
      list = list.filter((item) => {
        const meta = getProductMeta(item);
        return meta.sizes.some((size) => selectedSizes.includes(size));
      });
    }

    if (selectedColors.length) {
      list = list.filter((item) => {
        const meta = getProductMeta(item);
        return meta.colors.some((color) => selectedColors.includes(color));
      });
    }

    return list;
  }, [data, priceRange, selectedCategories, selectedSizes, selectedColors]);

  const products = useMemo(
    () => filteredProducts.slice(0, 9),
    [filteredProducts]
  );

  const toggleSelection = (
    value: string,
    list: string[],
    setList: (next: string[]) => void
  ) => {
    setList(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([priceBounds.min, priceBounds.max]);
  };

  return (
    <main className="bg-white text-zinc-900">
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-lg font-extrabold tracking-tight">SHOP.CO</div>
          <div className="hidden items-center gap-6 text-sm text-zinc-600 md:flex">
            <span>Shop</span>
            <span>On Sale</span>
            <span>New Arrivals</span>
            <span>Brands</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-600">
            <span>🔍</span>
            <span>🛒</span>
            <span>👤</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-4 text-xs text-zinc-500">Home / Casual</div>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Casual</h1>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span>
              Showing {products.length} of {filteredProducts.length} Products
            </span>
            <span>
              Sort by: <strong className="text-zinc-900">Most Popular</strong>
            </span>
            <button
              className="rounded-full border px-4 py-2 md:hidden"
              onClick={() => setFiltersOpen((v) => !v)}
            >
              Filters
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden h-fit rounded-2xl border border-zinc-200 p-4 lg:block">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Filters</h2>
              <button
                className="text-xs text-zinc-400"
                onClick={resetFilters}
                type="button"
              >
                Reset
              </button>
            </div>
            <div className="space-y-3 border-b pb-4 text-sm text-zinc-600">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    toggleSelection(item, selectedCategories, setSelectedCategories)
                  }
                  className={`flex w-full items-center justify-between text-left ${
                    selectedCategories.includes(item)
                      ? "font-semibold text-zinc-900"
                      : ""
                  }`}
                >
                  <span>{item}</span>
                  <span>›</span>
                </button>
              ))}
            </div>
            <div className="py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Price</h3>
                <span>▾</span>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={priceRange[0]}
                    onChange={(event) =>
                      setPriceRange([
                        Math.min(Number(event.target.value), priceRange[1]),
                        priceRange[1]
                      ])
                    }
                    className="w-full"
                  />
                  <input
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={priceRange[1]}
                    onChange={(event) =>
                      setPriceRange([
                        priceRange[0],
                        Math.max(Number(event.target.value), priceRange[0])
                      ])
                    }
                    className="w-full"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-zinc-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
            <div className="border-t py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Colors</h3>
                <span>▾</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() =>
                      toggleSelection(color.name, selectedColors, setSelectedColors)
                    }
                    className={`h-7 w-7 rounded-full border ${color.className} ${
                      selectedColors.includes(color.name)
                        ? "ring-2 ring-black ring-offset-2"
                        : ""
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <div className="border-t py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Size</h3>
                <span>▾</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() =>
                      toggleSelection(size, selectedSizes, setSelectedSizes)
                    }
                    className={`rounded-full border px-3 py-2 ${
                      selectedSizes.includes(size)
                        ? "bg-black text-white"
                        : "text-zinc-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Dress Style</h3>
                <span>▾</span>
              </div>
              <div className="mt-3 space-y-2 text-sm text-zinc-600">
                {["Casual", "Formal", "Party", "Gym"].map((style) => (
                  <div key={style} className="flex items-center justify-between">
                    <span>{style}</span>
                    <span>›</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="mt-4 w-full rounded-full bg-black py-3 text-sm font-semibold text-white"
              type="button"
            >
              Apply Filter
            </button>
          </aside>

          <div className="space-y-8">
            {filtersOpen && (
              <div className="rounded-2xl border border-zinc-200 p-4 lg:hidden">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Filters</h2>
                  <button
                    className="text-zinc-400"
                    onClick={() => setFiltersOpen(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3 border-b pb-4 text-sm text-zinc-600">
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        toggleSelection(item, selectedCategories, setSelectedCategories)
                      }
                      className={`flex w-full items-center justify-between text-left ${
                        selectedCategories.includes(item)
                          ? "font-semibold text-zinc-900"
                          : ""
                      }`}
                    >
                      <span>{item}</span>
                      <span>›</span>
                    </button>
                  ))}
                </div>
                <div className="py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Price</h3>
                    <span>▾</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={priceBounds.min}
                        max={priceBounds.max}
                        value={priceRange[0]}
                        onChange={(event) =>
                          setPriceRange([
                            Math.min(Number(event.target.value), priceRange[1]),
                            priceRange[1]
                          ])
                        }
                        className="w-full"
                      />
                      <input
                        type="range"
                        min={priceBounds.min}
                        max={priceBounds.max}
                        value={priceRange[1]}
                        onChange={(event) =>
                          setPriceRange([
                            priceRange[0],
                            Math.max(Number(event.target.value), priceRange[0])
                          ])
                        }
                        className="w-full"
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-zinc-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                <div className="border-t py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Colors</h3>
                    <span>▾</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() =>
                          toggleSelection(
                            color.name,
                            selectedColors,
                            setSelectedColors
                          )
                        }
                        className={`h-7 w-7 rounded-full border ${color.className} ${
                          selectedColors.includes(color.name)
                            ? "ring-2 ring-black ring-offset-2"
                            : ""
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="border-t py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Size</h3>
                    <span>▾</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() =>
                          toggleSelection(size, selectedSizes, setSelectedSizes)
                        }
                        className={`rounded-full border px-3 py-2 ${
                          selectedSizes.includes(size)
                            ? "bg-black text-white"
                            : "text-zinc-600"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="border-t py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Dress Style</h3>
                    <span>▾</span>
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-zinc-600">
                    {["Casual", "Formal", "Party", "Gym"].map((style) => (
                      <div key={style} className="flex items-center justify-between">
                        <span>{style}</span>
                        <span>›</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  className="mt-4 w-full rounded-full bg-black py-3 text-sm font-semibold text-white"
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                >
                  Apply Filter
                </button>
              </div>
            )}

            {isLoading ? (
              <div className="py-20 text-center text-zinc-500">Loading...</div>
            ) : isError ? (
              <div className="py-20 text-center text-red-500">
                Products could not be loaded.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product, index) => (
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
            )}

            <div className="flex items-center justify-between text-xs text-zinc-500">
              <button className="rounded-full border px-4 py-2">Previous</button>
              <div className="flex items-center gap-2">
                {["1", "2", "3", "...", "9", "10"].map((item) => (
                  <span
                    key={item}
                    className={`rounded-full px-3 py-2 ${
                      item === "1"
                        ? "bg-zinc-900 text-white"
                        : "border border-transparent"
                    }`}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <button className="rounded-full border px-4 py-2">Next</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
