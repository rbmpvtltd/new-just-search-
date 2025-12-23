import Constants from "expo-constants";

export const apiUrl = Constants.expoConfig?.extra?.PROD
  ? Constants.expoConfig?.extra?.API_URL_PROD
  : Constants.expoConfig?.extra?.API_URL_DEV;

export const backendUrl = Constants.expoConfig?.extra?.backendUrl ?? "";
export const androidPaymentApiKey =
  Constants.expoConfig?.extra?.androidPaymentApiKey ?? "";

export const iosPaymentApiKey =
  Constants.expoConfig?.extra?.iosPaymentApiKey ?? "";
