import { type Product } from "@monorepo/api";
import ProductCard from "./ProductCard";

type ProductGridProps = {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
};

export default function ProductGrid({
  products,
  isLoading,
  isError,
}: ProductGridProps) {
  if (isLoading) {
    return <div className="py-20 text-center text-zinc-500">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="py-20 text-center text-red-500">
        Products could not be loaded.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard
          key={product.id ?? `${product.title}-${index}`}
          product={product}
          index={index}
        />
      ))}
    </div>
  );
}
