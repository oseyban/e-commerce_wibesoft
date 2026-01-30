// apps/web/src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@monorepo/api";

export const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
