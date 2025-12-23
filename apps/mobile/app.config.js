import "dotenv/config";

function required(name) {
  console.log("Name", process.env[name]);

  const value = process.env[name];
  if (!value) {
    console.log("vlaue is", value);
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

export default ({ config }) => {
  return {
    ...config,
    ios: {
      ...config.ios,
      googleServicesFile: required("GOOGLE_SERVICE_PLIST"),
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      ...config.android,
      googleServicesFile: required("GOOGLE_SERVICES_JSON"),
    },
    extra: {
      ...config.extra,
      androidPaymentApiKey: required("EXPO_PUBLIC_ANDROID_PAYMENT_API_KEY"),
      iosPaymentApiKey: required("EXPO_PUBLIC_IOS_PAYMENT_API_KEY"),
      backendUrl: required("EXPO_PUBLIC_BACKEND_URL"),
      algoliaAppId: required("EXPO_PUBLIC_ALGOLIA_APP_ID"),
      algoliaSearchApiKey: required("EXPO_PUBLIC_ALGOLIA_SEARCH_API_KEY"),
    },
  };
};
