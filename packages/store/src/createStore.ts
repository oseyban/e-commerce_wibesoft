import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createCartSlice, type CartSlice } from "./slices/cartSlice";
import { createAuthSlice, type AuthSlice } from "./slices/authSlice";

export type StoreState = CartSlice & AuthSlice;

/**
 * createStore: factory. App side passes storage (localStorage / AsyncStorage).
 * Example: const useStore = createStore({ name: "web", storage: localStorage });
 */
export const createStore = (opts: { name?: string; storage?: any; devtoolsName?: string } = {}) => {
  const { name = "app-storage", storage = undefined, devtoolsName = "app" } = opts;

  const withMiddleware = (f: any) => {
    let w = f;
    if (storage) {
      w = persist(w, {
        name,
        getStorage: () => storage,
      });
    }
    return devtools(w, { name: devtoolsName });
  };

  return create<StoreState>(withMiddleware((set: any, get: any, api: any) => ({
    ...createCartSlice(set, get, api),
    ...createAuthSlice(set, get, api),
  })));
};
