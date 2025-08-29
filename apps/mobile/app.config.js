export default ({ config }) => {
  const profile = process.env.EAS_BUILD_PROFILE; // 'development', 'preview', 'production'

  return {
    ...config,
    extra: {
      ...config.extra,
      PROD: profile === "production" ? true : config.extra.PROD,
    },
  };
};
