// src/store/authStore.ts

import { create } from "zustand";
import { deleteTokenRole } from "@/utils/secureStore";
import { queryClient } from "@/lib/trpc";
import type { UserRole } from "@repo/db";

// export enum role {
//   business = "business",
//   hire = "hire",
//   visitor = "visitor",
//   lister = "lister",
// }
type AuthState = {
  token: string | null;
  authenticated: boolean;
  role: UserRole;
  setToken: (token: string | null, role: UserRole) => void;
  clearToken: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: "visiter",
  authenticated: false,
  setToken: (token, role) => {
    queryClient.invalidateQueries();
    return set({ token, authenticated: true, role });
  },
  clearToken: () => {
    set({ token: null, authenticated: false });
    deleteTokenRole();
  },
}));
