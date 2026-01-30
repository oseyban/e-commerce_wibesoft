// packages/api/src/index.ts
export * as sdk from "./generated";
export type * from "./generated";
export { client, configureClient, setApiBaseUrl } from "./client";
export * from "./adapter";
