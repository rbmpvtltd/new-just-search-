// src/store/authStore.ts
import { queryClient } from "@/app/_layout";
import { deleteToken } from "@/utils/secureStore";
import { create } from "zustand";

export enum role {
  business = "business",
  hire = "hire",
  visitor = "visitor",
  lister = "lister",
}
type AuthState = {
  token: string | null;
  authenticated: boolean;
  role: role;
  setToken: (token: string | null, role: role) => void;
  clearToken: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: role.visitor,
  authenticated: false,
  setToken: (token, role) => {
    queryClient.invalidateQueries();
    return set({ token, authenticated: true, role });
  },
  clearToken: () => {
    set({ token: null, authenticated: false });
    deleteToken();
  },
}));
