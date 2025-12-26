import { Platform } from "react-native";
import * as Application from "expo-application";

let deviceId: string | null = null;

if (Platform.OS === "android") {
  deviceId = Application.getAndroidId();
}

const platform = Platform.OS; // "android" | "ios" | "web"

if (platform === "ios") {
  Application.getIosIdForVendorAsync().then((data) => {
    deviceId = data;
  });
}
export { platform, deviceId };
