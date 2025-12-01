const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

const config = getDefaultConfig(__dirname);

// Apply NativeWind transformer
const nativeWindConfig = withNativeWind(config, { input: "./global.css" });

// Apply Reanimated transformer
module.exports = wrapWithReanimatedMetroConfig(nativeWindConfig);
