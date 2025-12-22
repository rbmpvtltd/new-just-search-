import Constants from "expo-constants";

export const apiUrl = Constants.expoConfig?.extra?.PROD
  ? Constants.expoConfig?.extra?.API_URL_PROD
  : Constants.expoConfig?.extra?.API_URL_DEV;

export const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
export const iosPaymentApiKey =
  process.env.EXPO_PUBLIC_IOS_PAYMENT_API_KEY ?? "";
export const androidPaymentApiKey =
  process.env.EXPO_PUBLIC_ANDROID_PAYMENT_API_KEY ?? "";
