import { client } from "./client";
import * as gen from "./generated";

/** OpenAPI client response tipini çözer */
function unwrap<T>(res: { data?: T; body?: T } | T): T {
  if (res && typeof res === "object") {
    if ("data" in res && res.data) return res.data as T;
    if ("body" in res && res.body) return res.body as T;
  }
  return res as T;
}

/* ---------- TYPES ---------- */

type ProductsResponse = Awaited<ReturnType<typeof gen.getProducts>>;
type ProductResponse = Awaited<ReturnType<typeof gen.getProductById>>;
type CategoriesResponse = Awaited<ReturnType<typeof gen.getCategories>>;

export type Product = NonNullable<
  ProductsResponse extends { data?: infer T }
    ? T extends (infer U)[]
      ? U
      : never
    : never
>;

/* ---------- API ---------- */

export const getProducts = async (): Promise<Product[]> => {
  const res: ProductsResponse = await gen.getProducts({ client });
  return unwrap<Product[]>(res);
};

export const getProductById = async (id: number): Promise<Product> => {
  const res: ProductResponse = await gen.getProductById({
    client,
    path: { id },
  });
  return unwrap<Product>(res);
};

export const getCategories = async (): Promise<string[]> => {
  const res: CategoriesResponse = await gen.getCategories({ client });
  return unwrap<string[]>(res);
};
