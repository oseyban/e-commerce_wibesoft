import { createStore } from "@monorepo/store";

export const useStore = createStore({
  name: "web-cart",
  storage: typeof window !== "undefined" ? localStorage : undefined,
  devtoolsName: "web-cart"
});
