export default ({ config }) => {
  const profile = process.env.EAS_BUILD_PROFILE; // 'development', 'preview', 'production'
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  const iosPaymentApiKey = process.env.EXPO_PUBLIC_IOS_PAYMENT_API_KEY;
  const androidPaymentApiKey = process.env.EXPO_PUBLIC_ANDROID_PAYMENT_API_KEY;

  return {
    ...config,
    extra: {
      ...config.extra,
      PROD: profile === "production" ? true : config.extra.PROD,
      BACKEND_URL: backendUrl || config.extra.BACKEND_URL,
      IOS_PAYMENT_API_KEY: iosPaymentApiKey || config.extra.IOS_PAYMENT_API_KEY,
      ANDROID_PAYMENT_API_KEY:
        androidPaymentApiKey || config.extra.ANDROID_PAYMENT_API_KEY,
    },
  };
};
