import { Platform } from "react-native";
import * as Application from "expo-application";

let deviceId: string | null = null;

if (Platform.OS === "android") {
  deviceId = Application.getAndroidId();
}

if (Platform.OS === "ios") {
  deviceId = await Application.getIosIdForVendorAsync();
}

const platform = Platform.OS; // "android" | "ios" | "web"

export { platform, deviceId };
