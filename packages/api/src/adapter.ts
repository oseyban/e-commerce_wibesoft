// packages/api/src/adapter.ts
import { client } from "./client";
import { sdk } from "./generated";

export const getProducts = () => sdk.getProducts({ client });
export const getProductById = (id: number) => sdk.getProductById({ client, id });
export const getCategories = () => sdk.getCategories({ client });
