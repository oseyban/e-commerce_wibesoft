"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type PointerEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, type Product } from "@monorepo/api";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { themeColors } from "../../data/theme-colors";

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
  { name: "Green", value: "#00C12B" },
  { name: "Blue", value: "#063AF5" },
  { name: "Cyan", value: "#06CAF5" },
  { name: "Purple", value: "#7D06F5" },
  { name: "Red", value: "#F50606" },
  { name: "Pink", value: "#F506A4" },
  { name: "Orange", value: "#F57906" },
  { name: "Yellow", value: "#F5DD06" },
  { name: "White", value: "#FFFFFF" },
  { name: "Black", value: "#000000" }
];

const categoryMap: Record<string, string[]> = {
  "T-shirts": ["men's clothing", "women's clothing"],
  Shorts: ["men's clothing"],
  Shirts: ["men's clothing"],
  Hoodie: ["men's clothing"],
  Jeans: ["men's clothing"]
};

const dressStyles = ["Casual", "Formal", "Party", "Gym"];
const dressStyleMap: Record<string, string[]> = {
  Casual: ["men's clothing", "women's clothing"],
  Formal: ["men's clothing"],
  Party: ["men's clothing"],
  Gym: ["men's clothing"]
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

function Star({ small = false }: { small?: boolean }) {
  const size = small ? 9 : 18;
  const height = small ? 17 : 18;
  return (
    <svg width={size} height={height} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.5l2.6 5.3 5.8.8-4.2 4 1 5.7L12 17.8 6.8 18.5l1-5.7L3.6 8.8l5.8-.8L12 2.5z"
        fill={themeColors.accent.warning}
      />
    </svg>
  );
}

function RatingRow() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Star />
        <Star />
        <Star />
        <Star />
        <Star small />
      </div>
      <span className="text-[14px] leading-[19px] text-black">4.5/5</span>
    </div>
  );
}

export default function CategoryPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedDressStyles, setSelectedDressStyles] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("popular");
  const [activePriceThumb, setActivePriceThumb] = useState<"min" | "max">("min");
  const [pageSize, setPageSize] = useState(16);
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

    if (selectedDressStyles.length) {
      const allowedCategories = new Set(
        selectedDressStyles.flatMap((style) => dressStyleMap[style] ?? [])
      );
      list = list.filter((item) =>
        allowedCategories.has(String(item.category ?? ""))
      );
    }

    return list;
  }, [
    data,
    priceRange,
    selectedCategories,
    selectedSizes,
    selectedColors,
    selectedDressStyles
  ]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "price-asc") {
      list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    } else if (sortBy === "new") {
      list.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
    }
    return list;
  }, [filteredProducts, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
  const products = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedProducts.slice(start, start + pageSize);
  }, [sortedProducts, currentPage, pageSize]);

  const paginationItems = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    return [1, 2, "...", totalPages - 1, totalPages];
  }, [totalPages]);

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
    setSelectedDressStyles([]);
    setPriceRange([priceBounds.min, priceBounds.max]);
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategories,
    selectedSizes,
    selectedColors,
    selectedDressStyles,
    priceRange,
    pageSize
  ]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    const update = () => {
      setPageSize(media.matches ? 8 : 16);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const surface = {
    base: themeColors.neutral.white,
    muted: themeColors.neutral.gray100,
    border: themeColors.neutral.overlay10,
    text: themeColors.neutral.black,
  };

  const getPercent = (value: number) => {
    const range = priceBounds.max - priceBounds.min || 1;
    return ((value - priceBounds.min) / range) * 100;
  };

  const formatPrice = (value: number) => `$${Math.round(value)}`;
  const getDiscount = (seed: number) => {
    if (seed % 5 === 0) return 30;
    if (seed % 3 === 0) return 20;
    return 0;
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setFiltersOpen(false);
  };

  const handlePricePointerDown = (
    event: PointerEvent<HTMLDivElement>
  ) => {
    const range = priceBounds.max - priceBounds.min;
    if (!range) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const percent = Math.min(
      Math.max((event.clientX - rect.left) / rect.width, 0),
      1
    );
    const value = priceBounds.min + percent * range;
    const midpoint = (priceRange[0] + priceRange[1]) / 2;
    setActivePriceThumb(value <= midpoint ? "min" : "max");
  };

  return (
    <main className="text-zinc-900" style={{ background: surface.base }}>
      <style jsx global>{`
        .price-range::-webkit-slider-thumb {
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: #000000;
          cursor: pointer;
          border: none;
        }
        .price-range::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: #000000;
          cursor: pointer;
          border: none;
        }
      `}</style>
      <Header />

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-5">
        <div className="mb-4 text-xs text-zinc-500">Home / Casual</div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside
            className="hidden h-fit rounded-2xl p-4 lg:block"
            style={{ background: surface.base, border: `1px solid ${surface.border}` }}
          >
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
            <div
              className="space-y-3 border-b pb-4 text-sm text-zinc-600"
              style={{ borderColor: surface.border }}
            >
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
                <div className="relative h-6" onPointerDown={handlePricePointerDown}>
                  <div
                    className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full"
                    style={{ background: "#F0F0F0" }}
                  />
                  <div
                    className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full"
                    style={{
                      left: `${getPercent(priceRange[0])}%`,
                      right: `${100 - getPercent(priceRange[1])}%`,
                      background: surface.text,
                    }}
                  />
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
                    className="price-range absolute inset-0 h-6 w-full cursor-pointer appearance-none bg-transparent"
                    onPointerDown={() => setActivePriceThumb("min")}
                    style={{
                      accentColor: surface.text,
                      zIndex: activePriceThumb === "min" ? 4 : 3
                    }}
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
                    className="price-range absolute inset-0 h-6 w-full cursor-pointer appearance-none bg-transparent"
                    onPointerDown={() => setActivePriceThumb("max")}
                    style={{
                      accentColor: surface.text,
                      zIndex: activePriceThumb === "max" ? 4 : 3
                    }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-zinc-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
            <div className="border-t py-4" style={{ borderColor: surface.border }}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Colors</h3>
                <span>▾</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 sm:grid sm:grid-cols-5 sm:gap-2">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() =>
                      toggleSelection(color.name, selectedColors, setSelectedColors)
                    }
                    className={`h-9 w-9 rounded-full border ${
                      selectedColors.includes(color.name)
                        ? "ring-2 ring-black ring-offset-2"
                        : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                    aria-pressed={selectedColors.includes(color.name)}
                  >
                    {selectedColors.includes(color.name) && (
                      <span
                        className="flex h-full w-full items-center justify-center text-[10px] font-semibold"
                        style={{
                          color: color.value === "#FFFFFF" ? "#000000" : "#FFFFFF",
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t py-4" style={{ borderColor: surface.border }}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Size</h3>
                <span>▾</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() =>
                      toggleSelection(size, selectedSizes, setSelectedSizes)
                    }
                    className={`w-full rounded-full border px-3 py-2 ${
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
            <div className="border-t py-4" style={{ borderColor: surface.border }}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Dress Style</h3>
                <span>▾</span>
              </div>
              <div className="mt-3 space-y-2 text-sm text-zinc-600">
                {dressStyles.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() =>
                      toggleSelection(
                        style,
                        selectedDressStyles,
                        setSelectedDressStyles
                      )
                    }
                    className={`flex w-full items-center justify-between ${
                      selectedDressStyles.includes(style)
                        ? "font-semibold text-zinc-900"
                        : ""
                    }`}
                  >
                    <span>{style}</span>
                    <span>›</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              className="mt-4 w-full rounded-full py-3 text-sm font-semibold"
              style={{ background: surface.text, color: surface.base }}
              type="button"
              onClick={handleApplyFilters}
            >
              Apply Filter
            </button>
          </aside>

          <div className="flex min-h-[760px] flex-col gap-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1
                  className="text-[32px] font-bold leading-[43px] text-black"
                  style={{ fontFamily: "var(--font-satoshi), sans-serif" }}
                >
                  Casual
                </h1>
                <span
                  className="text-[14px] font-normal leading-[19px] text-black/60 sm:hidden"
                  style={{ fontFamily: "var(--font-satoshi), sans-serif" }}
                >
                  Showing{" "}
                  {sortedProducts.length
                    ? `${(currentPage - 1) * pageSize + 1}-${Math.min(
                        currentPage * pageSize,
                        sortedProducts.length
                      )}`
                    : "0"}{" "}
                  of {sortedProducts.length} Products
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className="hidden text-[14px] font-normal leading-[19px] text-black/60 sm:inline"
                  style={{ fontFamily: "var(--font-satoshi), sans-serif" }}
                >
                  Showing{" "}
                  {sortedProducts.length
                    ? `${(currentPage - 1) * pageSize + 1}-${Math.min(
                        currentPage * pageSize,
                        sortedProducts.length
                      )}`
                    : "0"}{" "}
                  of {sortedProducts.length} Products
                </span>
                <label
                  className="hidden items-center gap-2 text-[16px] font-normal leading-[22px] text-black/60 sm:flex"
                  style={{ fontFamily: "var(--font-satoshi), sans-serif" }}
                >
                  Sort by:
                  <span className="inline-flex items-center gap-0">
                    <select
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value)}
                      className="appearance-none bg-transparent font-medium text-black outline-none"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="new">Newest</option>
                      <option value="price-asc">Low to High</option>
                      <option value="price-desc">High to Low</option>
                    </select>
                    <span className="inline-flex h-4 w-4 -ml-0 items-center justify-center text-black outline-none" aria-hidden>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </span>
                </label>
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 sm:hidden"
                  onClick={() => setFiltersOpen((v) => !v)}
                  aria-label="Open filters"
                >
                  <Image src="/images/filtrele.png" alt="" width={16} height={16} />
                </button>
              </div>
            </div>
            {filtersOpen && (
              <div
                className="mx-auto w-full max-w-[390px] rounded-t-[20px] rounded-b-none p-4 lg:hidden"
                style={{ background: surface.base, border: `1px solid ${surface.border}` }}
              >
                <div
                  className="mb-4 flex items-center justify-between border-b pb-3"
                  style={{ borderColor: surface.border }}
                >
                  <h2 className="text-sm font-semibold">Filters</h2>
                  <button
                    className="text-zinc-400"
                    onClick={() => setFiltersOpen(false)}
                  >
                    ✕
                  </button>
                </div>
                <div
                  className="space-y-3 border-b pb-4 text-sm text-zinc-600"
                  style={{ borderColor: surface.border }}
                >
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
                    <div className="relative h-6" onPointerDown={handlePricePointerDown}>
                      <div
                        className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full"
                        style={{ background: "#F0F0F0" }}
                      />
                      <div
                        className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full"
                        style={{
                          left: `${getPercent(priceRange[0])}%`,
                          right: `${100 - getPercent(priceRange[1])}%`,
                          background: surface.text,
                        }}
                      />
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
                        className="price-range absolute inset-0 h-6 w-full cursor-pointer appearance-none bg-transparent"
                        onPointerDown={() => setActivePriceThumb("min")}
                        style={{
                          accentColor: surface.text,
                          zIndex: activePriceThumb === "min" ? 4 : 3
                        }}
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
                        className="price-range absolute inset-0 h-6 w-full cursor-pointer appearance-none bg-transparent"
                        onPointerDown={() => setActivePriceThumb("max")}
                        style={{
                          accentColor: surface.text,
                          zIndex: activePriceThumb === "max" ? 4 : 3
                        }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-zinc-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                <div className="border-t py-4" style={{ borderColor: surface.border }}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Colors</h3>
                    <span>▾</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 sm:grid sm:grid-cols-5 sm:gap-2">
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
                        className={`h-9 w-9 rounded-full border ${
                          selectedColors.includes(color.name)
                            ? "ring-2 ring-black ring-offset-2"
                            : ""
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                        aria-pressed={selectedColors.includes(color.name)}
                      >
                        {selectedColors.includes(color.name) && (
                          <span
                            className="flex h-full w-full items-center justify-center text-[10px] font-semibold"
                            style={{
                              color:
                                color.value === "#FFFFFF" ? "#000000" : "#FFFFFF",
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="border-t py-4" style={{ borderColor: surface.border }}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Size</h3>
                    <span>▾</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() =>
                          toggleSelection(size, selectedSizes, setSelectedSizes)
                        }
                        className={`w-full rounded-full border px-3 py-2 ${
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
                <div className="border-t py-4" style={{ borderColor: surface.border }}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Dress Style</h3>
                    <span>▾</span>
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-zinc-600">
                    {dressStyles.map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() =>
                          toggleSelection(
                            style,
                            selectedDressStyles,
                            setSelectedDressStyles
                          )
                        }
                        className={`flex w-full items-center justify-between ${
                          selectedDressStyles.includes(style)
                            ? "font-semibold text-zinc-900"
                            : ""
                        }`}
                      >
                        <span>{style}</span>
                        <span>›</span>
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  className="mt-4 w-full rounded-full py-3 text-sm font-semibold"
                  style={{ background: surface.text, color: surface.base }}
                  type="button"
                  onClick={handleApplyFilters}
                >
                  Apply Filter
                </button>
              </div>
            )}

            <div className={filtersOpen ? "hidden lg:block" : "block"}>
              {isLoading ? (
                <div className="py-20 text-center text-zinc-500">Loading...</div>
              ) : isError ? (
                <div className="py-20 text-center text-red-500">
                  Products could not be loaded.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product, index) => (
                    <article
                      key={product.id ?? `${product.title}-${index}`}
                      className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
                    >
                      <Link
                        href={product.id ? `/product/${product.id}` : "#"}
                        className={product.id ? "block" : "pointer-events-none block"}
                      >
                        <div className="relative h-40 w-full" style={{ background: "#F0EEED" }}>
                          <Image
                            src={product.image ?? ""}
                            alt={product.title}
                            fill
                            unoptimized
                            className="object-contain"
                          />
                        </div>
                        <div className="p-4">
                          <h3
                            className="truncate text-[16px] font-bold leading-[22px] text-black sm:line-clamp-2 sm:whitespace-normal sm:text-[20px] sm:leading-[20px]"
                            style={{ fontFamily: "var(--font-satoshi), sans-serif" }}
                          >
                            {product.title}
                          </h3>
                          <div className="mt-2">
                            <RatingRow />
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-3">
                            {(() => {
                              const seed =
                                typeof product.id === "number"
                                  ? product.id
                                  : product.title.length + index;
                              const discount = getDiscount(seed);
                              const originalPrice = discount
                                ? product.price / (1 - discount / 100)
                                : product.price;
                              return (
                                <>
                                  <span
                                    className="text-[24px] font-bold leading-8 text-black"
                                    style={{ fontFamily: "var(--font-satoshi), sans-serif" }}
                                  >
                                    {formatPrice(product.price)}
                                  </span>
                                  {discount > 0 && (
                                    <>
                                      <span className="text-[16px] text-zinc-400 line-through">
                                        {formatPrice(originalPrice)}
                                      </span>
                                      <span
                                        className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                                        style={{
                                          background: themeColors.accent.dangerSoft,
                                          color: themeColors.accent.danger
                                        }}
                                      >
                                        -{discount}%
                                      </span>
                                    </>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              )}

              <div className="mt-auto flex items-center justify-between text-xs text-zinc-500">
                <button
                  className="rounded-lg border px-4 py-2"
                  style={{ borderColor: surface.border, background: surface.base }}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <span className="mr-2">‹</span>
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {paginationItems.map((item, index) => {
                    if (item === "...") {
                      return (
                        <span key={`ellipsis-${index}`} className="px-2 py-2">
                          ...
                        </span>
                      );
                    }
                    const page = item as number;
                    const isActive = page === currentPage;
                    return (
                      <button
                        key={page}
                        type="button"
                        className={`rounded-lg px-3 py-2 ${
                          isActive ? "text-white" : "border border-transparent"
                        }`}
                        style={
                          isActive
                            ? { background: surface.text, color: surface.base }
                            : undefined
                        }
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
                  className="rounded-lg border px-4 py-2"
                  style={{ borderColor: surface.border, background: surface.base }}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <span className="ml-2">›</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
