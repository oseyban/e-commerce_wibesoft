import { test, expect } from "@playwright/test";

test("GET /products returns 200 and non-empty array", async ({ request }) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://fakestoreapi.com";
  const apiBase = baseUrl.replace(/\/$/, "");

  const res = await request.get(`${apiBase}/products`);
  expect(res.status()).toBe(200);

  const data = await res.json();
  expect(Array.isArray(data)).toBeTruthy();
  expect(data.length).toBeGreaterThan(0);
});
