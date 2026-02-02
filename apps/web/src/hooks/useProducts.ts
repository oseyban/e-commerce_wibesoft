// apps/web/src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { getProductById, getProducts, type Product } from "@monorepo/api";

export const useProducts = () =>
  useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

export const useProductById = (productId?: number) =>
  useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId as number),
    enabled: Number.isFinite(productId),
  });
