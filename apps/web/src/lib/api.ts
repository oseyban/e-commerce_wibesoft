import { client, configureClient } from "@monorepo/api";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "https://fakestoreapi.com";
configureClient({ baseUrl, responseStyle: "data" });

export const api = client;
