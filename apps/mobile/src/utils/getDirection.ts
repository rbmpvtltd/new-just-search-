import { Linking } from "react-native";

export const openInGoogleMaps = (latitude: string, longitude: string) => {
  if (!latitude || !longitude) return;
  const lat = Number(latitude);
  const lon = Number(longitude);
  const url = `https://www.google.com/maps?q=${lat},${lon}`;
  Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
};
