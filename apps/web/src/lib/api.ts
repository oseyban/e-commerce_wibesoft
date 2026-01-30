import { client } from "@monorepo/api";

export const api = client({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
});
