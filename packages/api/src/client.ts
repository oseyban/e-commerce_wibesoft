
import axios from "axios";
import * as Types from "./generated";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://fakestoreapi.com",
  // timeout: 10000,
  // headers: { Accept: "application/json" }
});

/* Products */
export async function getProducts(): Promise<Types.Product[]> {
  const res = await api.get<Types.Product[]>("/products");
  return res.data;
}

export async function getProductById(id: number): Promise<Types.Product> {
  const res = await api.get<Types.Product>(`/products/${id}`);
  return res.data;
}

export async function createProduct(payload: Types.Product): Promise<Types.Product> {
  const res = await api.post<Types.Product>("/products", payload);
  return res.data;
}

export async function updateProductById(id: number, payload: Types.Product): Promise<Types.Product> {
  const res = await api.put<Types.Product>(`/products/${id}`, payload);
  return res.data;
}

export async function deleteProductById(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}

/* Categories */
export async function getCategories(): Promise<string[]> {
  const res = await api.get<string[]>("/products/categories");
  return res.data;
}

export async function getProductsByCategory(category: string): Promise<Types.Product[]> {
  const res = await api.get<Types.Product[]>(`/products/category/${encodeURIComponent(category)}`);
  return res.data;
}

/* Carts */
export async function getCarts(): Promise<Types.Cart[]> {
  const res = await api.get<Types.Cart[]>("/carts");
  return res.data;
}

export async function getCartById(id: number): Promise<Types.Cart> {
  const res = await api.get<Types.Cart>(`/carts/${id}`);
  return res.data;
}

export async function createCart(payload: Types.Cart): Promise<Types.Cart> {
  const res = await api.post<Types.Cart>("/carts", payload);
  return res.data;
}

/* Users */
export async function getUsers(): Promise<Types.User[]> {
  const res = await api.get<Types.User[]>("/users");
  return res.data;
}

/* Auth (örnek) */
export async function login(username: string, password: string): Promise<{ token: string }> {
  const res = await api.post<{ token: string }>("/auth/login", { username, password });
  return res.data;
}
