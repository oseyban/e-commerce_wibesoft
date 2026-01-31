import { StateCreator } from "zustand";

export type AuthSlice = {
  token?: string | null;
  user?: { id: string; name?: string } | null;
  setToken: (t?: string | null) => void;
  logout: () => void;
};

export const createAuthSlice: StateCreator<any, [], [], AuthSlice> = (set) => ({
  token: null,
  user: null,
  setToken: (t?: string | null) => set({ token: t }),
  logout: () => set({ token: null, user: null }),
});
