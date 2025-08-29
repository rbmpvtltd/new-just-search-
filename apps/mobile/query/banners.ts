import { log } from "@react-native-firebase/crashlytics";
import { useSuspenseQuery } from "@tanstack/react-query";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";

export type BannerOneItem = {
  id: any;
  title: string;
  photo: string;
  slug: string;
  type: number;
};

export type BannerTwoItem = {
  id: string;
  title: string;
  photo: string;
  slug: string;
  type: number;
  categories: { title: string }[];
  subcategories: { name: string }[];
  specialities: string;
  description: string;
  name: string;
  building_name: string;
  street_name: string;
  area: string;
  landmark: string;
  pincode: string;
  city: number;
  state: number;
  email: string;
  home_delivery: boolean;
  phone_number: string;
  whatsapp_no: string;
  latitude: number;
  longitude: number;
};
type BannerList = {
  banners1: BannerOneItem[];
  premium_shops: BannerTwoItem[];
};

const fetchBannersList = async (): Promise<BannerList> => {
  const response = await api(methods.get, `${apiUrl}/api/index`, {});
  return response.data;
};

export const useBanners = () => {
  return useSuspenseQuery({
    queryKey: ["banners"],
    queryFn: fetchBannersList,
  });
};
