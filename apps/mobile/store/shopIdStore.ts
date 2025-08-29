import { create } from "zustand";

type ShopIdState = {
  shopId: string;
  setShopId: (shopId: string) => void;
};

export const useShopIdStore = create<ShopIdState>((set) => ({
  shopId: "",
  setShopId: (shopId) => set({ shopId }),
}));
