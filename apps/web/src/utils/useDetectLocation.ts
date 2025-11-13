import { useQuery } from "@tanstack/react-query";

async function getCurrentPosition(
  options?: PositionOptions,
): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

async function reverseGeocode(lat: number, lon: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to reverse geocode.");
  return res.json();
}

const fetchLocationData = async () => {
  try {
    const position = await getCurrentPosition({ enableHighAccuracy: true });
    const { latitude, longitude } = position.coords;

    const data = await reverseGeocode(latitude, longitude);

    const address = data.address ?? {};

    return {
      success: true,
      coords: { latitude, longitude },
      address: {
        name: data.display_name ?? "",
        street: address.road ?? "",
        city: address.city || address.town || address.village || "",
        region: address.state ?? "",
        country: address.country ?? "",
        postalCode: address.postcode ?? "",
        formattedAddress: data.display_name ?? "",
      },
    };
  } catch (error: any) {
    console.error("Location detection failed:", error.message);
    return {
      success: false,
      coords: undefined,
      address: {},
      error: error.message,
    };
  }
};

export const useDetectLocation = (enabled = false) =>
  useQuery({
    queryKey: ["location"],
    queryFn: fetchLocationData,
    enabled,
    retry: 1,
  });
