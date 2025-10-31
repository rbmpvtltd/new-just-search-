// src/store/authStore.ts

import { create } from "zustand";
import { deleteToken } from "@/utils/secureStore";
import { queryClient } from "@/lib/trpc";
import { UserRole } from "@repo/db";

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
    deleteToken();
  },
}));



// -------------------------------------------------
// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { UserRole } from '@repo/db';

// // 👇 Define the shape of your store
// interface AuthState {
//   token: string | null;
//   role: UserRole | null;
//   authenticated: boolean;
//   hydrated: boolean;

//   setToken: (token: string | null, role: UserRole) => void;
//   clearToken: () => void;
//   rehydrate: () => void;
// }

// // 👇 Create typed store
// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set, get) => ({
//       token: null,
//       role: null,
//       authenticated: false,
//       hydrated: false,

//       setToken: (token, role) => {
//         console.log('Setting token', token, role);
//         set({ token, role, authenticated: true });
//       },

//       clearToken: () => {
//         set({ token: null, role: null, authenticated: false });
//       },

//       rehydrate: () => {
//         set({ hydrated: true });
//       },
//     }),
//     {
//       name: 'auth-storage',
//       storage: createJSONStorage(() => AsyncStorage),
//       partialize: (state) => ({
//         token: state.token,
//         role: state.role,
//         authenticated: state.authenticated,
//       }),
//       onRehydrateStorage: () => (state, error) => {
//         // ✅ Now `state` is typed as AuthState | undefined
//         if (error) {
//           console.error('Rehydration error:', error);
//           return;
//         }

//         if (state) {
//           // Optional: validate token here if needed
//           state.rehydrate(); // ✅ TypeScript knows this exists
//         }
//       },
//     }
//   )
// );