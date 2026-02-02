"use client";

import { useEffect, useMemo, useState } from "react";
import { type Product } from "@monorepo/api";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CategoryHeader from "../../components/category/CategoryHeader";
import { FilterDrawer, FilterSidebar } from "../../components/category/FiltersPanel";
import Pagination from "../../components/category/Pagination";
import ProductGrid from "../../components/category/ProductGrid";
import { themeColors } from "../../data/theme-colors";
import { useProducts } from "../../hooks/useProducts";

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
  const { data = [], isLoading, isError } = useProducts();

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

  const paginationItems = useMemo<(number | "...")[]>(() => {
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

  const handleToggleCategory = (value: string) =>
    toggleSelection(value, selectedCategories, setSelectedCategories);
  const handleToggleSize = (value: string) =>
    toggleSelection(value, selectedSizes, setSelectedSizes);
  const handleToggleColor = (value: string) =>
    toggleSelection(value, selectedColors, setSelectedColors);
  const handleToggleDressStyle = (value: string) =>
    toggleSelection(value, selectedDressStyles, setSelectedDressStyles);

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

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setFiltersOpen(false);
  };
  const showingText = `Showing ${
    sortedProducts.length
      ? `${(currentPage - 1) * pageSize + 1}-${Math.min(
          currentPage * pageSize,
          sortedProducts.length
        )}`
      : "0"
  } of ${sortedProducts.length} Products`;

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
          <FilterSidebar
            variant="desktop"
            categories={categories}
            sizes={sizes}
            colors={colors}
            dressStyles={dressStyles}
            selectedCategories={selectedCategories}
            selectedSizes={selectedSizes}
            selectedColors={selectedColors}
            selectedDressStyles={selectedDressStyles}
            priceBounds={priceBounds}
            priceRange={priceRange}
            onChangePriceRange={setPriceRange}
            activePriceThumb={activePriceThumb}
            onActiveThumbChange={setActivePriceThumb}
            onToggleCategory={handleToggleCategory}
            onToggleSize={handleToggleSize}
            onToggleColor={handleToggleColor}
            onToggleDressStyle={handleToggleDressStyle}
            onReset={resetFilters}
            onApply={handleApplyFilters}
            surface={surface}
          />

          <div className="flex min-h-[760px] flex-col gap-8">
            <CategoryHeader
              title="Casual"
              showingText={showingText}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onOpenFilters={() => setFiltersOpen((v) => !v)}
            />
            {filtersOpen && (
              <FilterDrawer
                variant="mobile"
                categories={categories}
                sizes={sizes}
                colors={colors}
                dressStyles={dressStyles}
                selectedCategories={selectedCategories}
                selectedSizes={selectedSizes}
                selectedColors={selectedColors}
                selectedDressStyles={selectedDressStyles}
                priceBounds={priceBounds}
                priceRange={priceRange}
                onChangePriceRange={setPriceRange}
                activePriceThumb={activePriceThumb}
                onActiveThumbChange={setActivePriceThumb}
                onToggleCategory={handleToggleCategory}
                onToggleSize={handleToggleSize}
                onToggleColor={handleToggleColor}
                onToggleDressStyle={handleToggleDressStyle}
                onApply={handleApplyFilters}
                onClose={() => setFiltersOpen(false)}
                surface={surface}
              />
            )}

            <div className={filtersOpen ? "hidden lg:block" : "block"}>
              <ProductGrid
                products={products}
                isLoading={isLoading}
                isError={isError}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                items={paginationItems}
                onPageChange={setCurrentPage}
                surface={surface}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
