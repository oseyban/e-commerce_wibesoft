import axios from "axios";
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://fakestoreapi.com",
    timeout: 10000,
    headers: { Accept: "application/json" },
});
//hata durumu
const extract = (res) => res.data;
/* Products */
export async function getProducts() {
    const res = await api.get("/products");
    return extract(res);
}
export async function getProductById(id) {
    const res = await api.get(`/products/${id}`);
    return extract(res);
}
export async function createProduct(payload) {
    const res = await api.post("/products", payload);
    return extract(res);
}
export async function updateProductById(id, payload) {
    const res = await api.put(`/products/${id}`, payload);
    return extract(res);
}
export async function deleteProductById(id) {
    await api.delete(`/products/${id}`);
}
/* Categories */
export async function getCategories() {
    const res = await api.get("/products/categories");
    return extract(res);
}
export async function getProductsByCategory(category) {
    const res = await api.get(`/products/category/${encodeURIComponent(category)}`);
    return extract(res);
}
/* Carts */
export async function getCarts() {
    const res = await api.get("/carts");
    return extract(res);
}
export async function getCartById(id) {
    const res = await api.get(`/carts/${id}`);
    return extract(res);
}
export async function createCart(payload) {
    const res = await api.post("/carts", payload);
    return extract(res);
}
/* Users */
export async function getUsers() {
    const res = await api.get("/users");
    return extract(res);
}
/* Auth */
export async function login(username, password) {
    const res = await api.post("/auth/login", { username, password });
    return extract(res);
}
