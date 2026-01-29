import { createClient } from "@hey-api/client-axios";

export const client = createClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://fakestoreapi.com",
});
