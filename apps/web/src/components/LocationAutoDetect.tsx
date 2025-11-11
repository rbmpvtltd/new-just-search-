import { useState } from "react";
import { useDetectLocation } from "@/utils/useDetectLocation";

type LocationResult = {
  success: boolean;
  latitude: number | undefined;
  longitude: number | undefined;
  name: string;
  street: string;
  formattedAddress: string;
  postalCode?: string;
  city?: string;
  region?: string;
  country?: string;
};

type Props = {
  onResult: (data: LocationResult) => void;
  iconOnly?: boolean;
};

export default function LocationAutoDetect({ onResult, iconOnly }: Props) {
  const { data, isLoading, isError, error, refetch } = useDetectLocation(false);
  const [detecting, setDetecting] = useState(false);

  const handleDetect = async () => {
    try {
      setDetecting(true);
      const result = await refetch();

      if (result.data) {
        const { coords, address, success } = result.data;

        const locationData: LocationResult = {
          success,
          latitude: coords?.latitude,
          longitude: coords?.longitude,
          name: address?.name ?? "",
          street: address?.street ?? "",
          formattedAddress: address?.formattedAddress ?? "",
          postalCode: address?.postalCode,
          city: address?.city,
          country: address?.country,
          region: address?.region,
        };

        onResult(locationData);
      }
    } catch (err) {
      console.error("Error detecting location:", err);
    } finally {
      setDetecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <button
        type="button"
        disabled={detecting || isLoading}
        onClick={handleDetect}
        className={`${
          iconOnly
            ? "p-2 rounded-full hover:bg-gray-100 transition"
            : "bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow w-full"
        } ${detecting ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {iconOnly ? (
          <i className="ri-map-pin-line text-xl" /> // optional icon (requires remixicon or similar)
        ) : detecting || isLoading ? (
          <span className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Detecting...</span>
          </span>
        ) : (
          "Auto Detect Location"
        )}
      </button>

      {isError && (
        <p className="text-red-500 text-sm mt-2 text-center">
          {(error as Error)?.message ?? "Failed to detect location."}
        </p>
      )}
    </div>
  );
}
