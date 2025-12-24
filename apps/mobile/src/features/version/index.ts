import VersionCheck from "react-native-version-check";

export const checkAppNeedUpdate = (latestVersion: string) => {
  const currentVersion = VersionCheck.getCurrentVersion();

  const [major1, minor1, patch1] = currentVersion.split(".");
  const [major2, minor2, patch2] = latestVersion.split(".");
  const data = {
    major: Number(major2) > Number(major1),
    minor: Number(minor2) > Number(minor1),
    patch: Number(patch2) > Number(patch1),
  };

  return data;
};
