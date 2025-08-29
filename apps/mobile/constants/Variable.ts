import Constants from "expo-constants";

export const apiUrl = Constants.expoConfig?.extra?.PROD
  ? Constants.expoConfig?.extra?.API_URL_PROD
  : Constants.expoConfig?.extra?.API_URL_DEV;
