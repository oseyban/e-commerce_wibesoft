// apps/web/src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { sdk } from "@monorepo/api";
import { api } from "../lib/api";

export const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: () => sdk.getProducts({ client: api }),
  });
