export default ({ config }) => {
  return {
    ...config,
    ios: {
      ...config.ios,
      googleServicesFile: process.env.GOOGLE_SERVICE_PLIST,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      ...config.android,
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    },
    extra: {
      ...config.extra,
      androidPaymentApiKey: process.env.EXPO_PUBLIC_ANDROID_PAYMENT_API_KEY,
      iosPaymentApiKey: process.env.EXPO_PUBLIC_IOS_PAYMENT_API_KEY,
      backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL,
    },
  };
};
