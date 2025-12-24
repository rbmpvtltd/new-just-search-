import Constants from "expo-constants";

export const apiUrl = Constants.expoConfig?.extra?.PROD
  ? Constants.expoConfig?.extra?.API_URL_PROD
  : Constants.expoConfig?.extra?.API_URL_DEV;

// export const backendUrl =
//   Constants.expoConfig?.extra?.backendUrl ??
//   "https://backend-test.justsearch.net.in/";
// export const androidPaymentApiKey =
//   Constants.expoConfig?.extra?.androidPaymentApiKey ??
//   "goog_oiSnuWepljgpdlqlTYEjrBmuAFp";
//
// export const iosPaymentApiKey =
//   Constants.expoConfig?.extra?.iosPaymentApiKey ??
//   "appl_RiTjBDuyekUKpwXeFXIFzKujefz";
//
// export const algoliaAppId =
//   Constants.expoConfig?.extra?.algoliaAppId ?? "XLHL5IDFH9";
// export const algoliaSearchApiKey =
//   Constants.expoConfig?.extra?.algoliaSearchApiKey ??
//   "4b94ea6117cbe235a2e3794e8060ee38";

const extra = Constants.expoConfig?.extra;

if (!extra) {
  throw new Error("Expo extra config missing");
}

export const backendUrl =
  process.env.EXPO_PUBLIC_BACKEND_URL ?? extra.backendUrl;
export const androidPaymentApiKey = extra.androidPaymentApiKey;
export const iosPaymentApiKey = extra.iosPaymentApiKey;
export const algoliaAppId = extra.algoliaAppId;
export const algoliaSearchApiKey = extra.algoliaSearchApiKey;

// "EXPO_PUBLIC_BACKEND_URL": "https://backend-test.justsearch.net.in/",
// "EXPO_PUBLIC_IOS_PAYMENT_API_KEY": "appl_RiTjBDuyekUKpwXeFXIFzKujefz",
// "EXPO_PUBLIC_ANDROID_PAYMENT_API_KEY": "goog_oiSnuWepljgpdlqlTYEjrBmuAFp",
// "EXPO_PUBLIC_ALGOLIA_APP_ID": "XLHL5IDFH9",
// "EXPO_PUBLIC_ALGOLIA_SEARCH_API_KEY": "4b94ea6117cbe235a2e3794e8060ee38"
