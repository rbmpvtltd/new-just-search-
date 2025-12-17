export default ({ config }) => {
  const profile = process.env.EAS_BUILD_PROFILE; // 'development', 'preview', 'production'
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

  return {
    ...config,
    extra: {
      ...config.extra,
      PROD: profile === "production" ? true : config.extra.PROD,
      BACKEND_URL: backendUrl || config.extra.BACKEND_URL,
    },
  };
};
