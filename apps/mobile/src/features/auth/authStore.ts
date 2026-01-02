import type { UserRole } from "@repo/db";
import { create } from "zustand";
import { queryClient } from "@/lib/trpc";

type AuthState = {
  token: string | null;
  authenticated: boolean;
  role: UserRole | null;
  setToken: (token: string | null, role: UserRole | null) => void;
  clearToken: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: "guest",
  authenticated: false,
  setToken: (token, role) => {
    queryClient.invalidateQueries();
    const authenticated = token !== null && token !== "";
    return set({ token, authenticated, role });
  },
  clearToken: () => {
    set({ token: null, authenticated: false, role: "guest" });
  },
}));
