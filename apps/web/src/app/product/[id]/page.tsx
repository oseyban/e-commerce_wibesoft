"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { type Product } from "@monorepo/api";
import { useStore } from "../../../lib/store";
import { colors, fontSizes } from "../../../../../../packages/design-tokens/src";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useProductById, useProducts } from "../../../hooks/useProducts";
import Breadcrumbs from "../../../components/product/Breadcrumbs";
import ProductGallery from "../../../components/product/ProductGallery";
import ProductInfo from "../../../components/product/ProductInfo";
import ProductTabs from "../../../components/product/ProductTabs";
import RelatedProducts from "../../../components/product/RelatedProducts";

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

const colorOptions = [
  { label: "Olive", value: "olive", swatch: "#4B4B3B" },
  { label: "Black", value: "black", swatch: "#1F1F1F" },
  { label: "Navy", value: "navy", swatch: "#2F365B" },
  { label: "White", value: "white", swatch: "#F4F4F4" },
];
const sizeOptions = ["Small", "Medium", "Large", "X-Large"];

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = useMemo(() => Number(params?.id), [params?.id]);

  const { data, isLoading, isError } = useProductById(productId);
  const { data: allProducts = [] } = useProducts();

  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[2]);
  const [justAdded, setJustAdded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  const activeImage = thumbnails[selectedIndex] ?? data?.image ?? "";

  useEffect(() => {
    if (selectedIndex >= thumbnails.length) {
      setSelectedIndex(0);
    }
  }, [selectedIndex, thumbnails.length]);

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

  return (
    <main style={{ background: colors.white, color: colors.gray[900] }}>
      <Header />

      <Breadcrumbs category={data.category} />

      <div className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 sm:py-6 md:py-8">
        <section className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,100px)_1fr_minmax(0,1fr)] lg:gap-10">
          <ProductGallery
            title={data.title}
            thumbnails={thumbnails}
            activeImage={activeImage}
            selectedIndex={selectedIndex}
            onSelectIndex={setSelectedIndex}
          />
          <ProductInfo
            product={data}
            discountPercent={discountPercent}
            discountedPrice={discountedPrice}
            formatPrice={formatPrice}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
            colorOptions={colorOptions}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            sizeOptions={sizeOptions}
            qty={qty}
            onQtyChange={setQty}
            onAddToCart={() => {
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
            justAdded={justAdded}
          />
        </section>
        <ProductTabs description={data.description} />
        <RelatedProducts
          products={relatedProducts}
          formatPrice={formatPrice}
          getDiscountPercent={getDiscountPercent}
          getRatingRate={getRatingRate}
        />
      </div>

      <Footer />
    </main>
  );
}
