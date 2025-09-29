import { create } from "zustand";

interface AuthData {
  displayName?: string;
  email?: string;
  mobileNumber?: string;
  password: string;
  confirmPassword: string;
}
interface AuthStore {
  authData: AuthData | null;
  otp: string;

  setAuthData: (data: AuthData) => void;
  clearAuthData: () => void;
  setOtp: (data: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authData: null,
  otp: "",

  setAuthData: (data) => set({ authData: data, otp: "" }),
  clearAuthData: () => set({ authData: null, otp: "" }),
  setOtp: (otp) => set({ otp }),
}));
