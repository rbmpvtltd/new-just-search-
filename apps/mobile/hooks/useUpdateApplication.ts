import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";
import { useEffect } from "react";
import VersionCheck from "react-native-version-check";
import Constants from "expo-constants";
import { Alert, Linking, Platform } from "react-native";

interface IAllLastestVersion {
  success: boolean;
  version: {
    closetest: string;
    opentest: string;
    production: string;
  };
}

const checkAppUpdate = async () => {
  try {
    const currentVersion = VersionCheck.getCurrentVersion();

    const buildType = Constants.expoConfig?.extra?.BUILD_TYPE_FIELDS[
      Constants.expoConfig?.extra?.BUILD_TYPE
    ] as "closetest" | "opentest" | "production";

    const AllLastestVersion: IAllLastestVersion = await api(
      methods.get,
      `${apiUrl}/api/get-latest-version`,
      {},
    );

    const latestVersion = AllLastestVersion.version[buildType];

    const versionCheck = await VersionCheck.needUpdate({
      currentVersion,
      latestVersion,
    });
    if (versionCheck.isNeeded) {
      Alert.alert(
        "Update Available",
        "A new version of the app is available. Please update to continue.",
        [
          {
            text: "Update Now",
            onPress: () => {
              if (Platform.OS === "android") {
                Linking.openURL("market://details?id=com.rbm.justsearch"); // Replace with your app ID
              } else {
                Linking.openURL(
                  "itms-apps://itunes.apple.com/app/idYOUR_APP_ID",
                );
              }
            },
          },
        ],
      );
    }
  } catch (error) {
    console.log("Version check failed:", error);
  }
};

export default function useGoogleUpdate() {
  useEffect(() => {
    checkAppUpdate();
  }, []);
}
