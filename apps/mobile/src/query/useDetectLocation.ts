import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { Alert } from "react-native";

async function reverseGeocodeWithTimeout(
  coords: Location.LocationGeocodedLocation,
  timeout = 8000,
) {
  return Promise.race([
    Location.reverseGeocodeAsync(coords),
    new Promise<never>((_, reject) =>
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

  // let position: Location.LocationObject;

  // Get current coordinates
  const loc = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  const { latitude, longitude } = loc.coords;
  let geoResult: any = null;
  try {
    geoResult = await reverseGeocodeWithTimeout({ latitude, longitude });
  } catch (err: any) {
    Alert.alert(
      "Location Error",
      "Unable to fetch address. Please enter it manually.",
    );

    return {
      success: false,
    };
  }
  const geo = geoResult?.[0];
  if (!geo) {
    return {
      success: false,
      error: "address-not-found",
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

export const useDetectLocation = (enabled = false) => {
  return useQuery({
    queryKey: ["location"],
    queryFn: fetchLocationData,
    enabled: false, // user action required
    retry: false, // no useless retries
    staleTime: Infinity, // no stale data
  });
};
