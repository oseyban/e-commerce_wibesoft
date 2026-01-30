import axios from "axios";
import type * as Types from "./generated";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://fakestoreapi.com",
  timeout: 10000,
  headers: { Accept: "application/json" },
});

//hata durumu
const extract = <T>(res: { data: T }) => res.data;

/* Products */
export async function getProducts(): Promise<Types.GetProductsResponse> {
  const res = await api.get<Types.GetProductsResponse>("/products");
  return extract(res);
}

export async function getProductById(id: number): Promise<Types.GetProductByIdResponse> {
  const res = await api.get<Types.GetProductByIdResponse>(`/products/${id}`);
  return extract(res);
}

export async function createProduct(payload: Types.Product): Promise<Types.CreateProductResponse> {
  const res = await api.post<Types.CreateProductResponse>("/products", payload);
  return extract(res);
}

export async function updateProductById(
  id: number,
  payload: Types.Product
): Promise<Types.UpdateProductByIdResponse> {
  const res = await api.put<Types.UpdateProductByIdResponse>(`/products/${id}`, payload);
  return extract(res);
}

export async function deleteProductById(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}

/* Categories */
export async function getCategories(): Promise<Types.GetCategoriesResponse> {
  const res = await api.get<Types.GetCategoriesResponse>("/products/categories");
  return extract(res);
}

export async function getProductsByCategory(category: string): Promise<Types.GetProductsByCategoryResponse> {
  const res = await api.get<Types.GetProductsByCategoryResponse>(`/products/category/${encodeURIComponent(category)}`);
  return extract(res);
}

/* Carts */
export async function getCarts(): Promise<Types.GetCartsResponse> {
  const res = await api.get<Types.GetCartsResponse>("/carts");
  return extract(res);
}

export async function getCartById(id: number): Promise<Types.GetCartByIdResponse> {
  const res = await api.get<Types.GetCartByIdResponse>(`/carts/${id}`);
  return extract(res);
}

export async function createCart(payload: Types.Cart): Promise<Types.CreateCartResponse> {
  const res = await api.post<Types.CreateCartResponse>("/carts", payload);
  return extract(res);
}

/* Users */
export async function getUsers(): Promise<Types.GetUsersResponse> {
  const res = await api.get<Types.GetUsersResponse>("/users");
  return extract(res);
}

/* Auth */
export async function login(username: string, password: string): Promise<Types.LoginResponse> {
  const res = await api.post<Types.LoginResponse>("/auth/login", { username, password });
  return extract(res);
}
