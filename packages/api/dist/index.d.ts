export * as sdk from "./generated";
export type * from "./generated";
export { client, configureClient, setApiBaseUrl } from "./client";
export { getProducts, getProductById, getCategories as getCategoriesWithClient } from "./adapter";
