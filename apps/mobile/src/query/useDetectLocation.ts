import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { Alert } from "react-native";

async function reverseGeocodeWithTimeout(coords, timeout = 8000) {
  return Promise.race([
    Location.reverseGeocodeAsync(coords),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Reverse geocode timeout")), timeout),
    ),
  ]);
}

const fetchLocationData = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permission Denied",
      "We need location permission to detect your address.",
    );
    return {
      success: false,
    };
  }

  // Get current coordinates
  const loc = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = loc.coords;

  let geo = null;
  try {
    [geo] = await reverseGeocodeWithTimeout({ latitude, longitude });
  } catch (err) {
    console.warn("Reverse geocode failed:", err.message);
    Alert.alert(
      "Location Error",
      "Unable to fetch address. Please enter it manually.",
    );

    return {
      success: false,
    };
  }

  return {
    success: true,
    coords: { latitude, longitude },
    address: {
      district: geo?.district ?? "",
      name: geo?.name ?? "",
      postalCode: geo?.postalCode ?? "",
      formattedAddress: geo?.formattedAddress ?? "",
      city: geo?.city ?? "",
      region: geo?.region ?? "",
      country: geo?.country ?? "",
      street: geo?.street ?? "",
    },
  };
};

export const useDetectLocation = (enabled = false) =>
  useQuery({
    queryKey: ["location"],
    queryFn: fetchLocationData,
    enabled,
    // retry: 1, // one retry if it fails
  });
