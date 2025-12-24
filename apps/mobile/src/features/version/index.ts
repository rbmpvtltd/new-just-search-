import VersionCheck from "react-native-version-check";

export const checkAppNeedUpdate = async (latestVersion: string) => {
  const currentVersion = VersionCheck.getCurrentVersion();
  const versionCheck = await VersionCheck.needUpdate({
    currentVersion,
    latestVersion,
  });
  return versionCheck.isNeeded;
};
