import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, useColorScheme, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import { useDetectLocation } from "@/query/useDetectLocation";

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
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const handleDetect = async () => {
    try {
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
    }
  };

  const renderButtonContent = () => {
    if (iconOnly) {
      return (
        <Ionicons name="location-outline" size={24} color={theme.secondary} />
      );
    }

    return (
      <View className="bg-error p-3 rounded-lg items-center justify-center flex-row space-x-2">
        {isLoading ? (
          <>
            <ActivityIndicator size="small" color="#fff" />
            <Text className="text-secondary font-semibold ml-2">
              Detecting...
            </Text>
          </>
        ) : (
          <Text className="text-secondary font-semibold">
            Auto Detect Location
          </Text>
        )}
      </View>
    );
  };

  return (
    <View className="mx-auto mt-4 items-center w-[60%]">
      {isLoading ? (
        <View className="items-center justify-center space-y-3">
          <Pressable
            onPress={handleDetect}
            disabled
            style={{ marginHorizontal: "auto" }}
            className={`w-full rounded-lg bg-info px-4 py-3 opacity-50 flex-row items-center justify-center`}
          >
            {renderButtonContent()}
          </Pressable>
          {/* <ActivityIndicator size="small" color={theme.info} />
          <Text className="text-secondary font-medium">Detecting...</Text> */}
        </View>
      ) : (
        <Pressable
          onPress={handleDetect}
          disabled={isLoading}
          style={{ marginHorizontal: "auto" }}
          className={`w-full rounded-lg ${
            iconOnly ? "" : "bg-info px-4 py-3"
          } flex-row items-center justify-center`}
        >
          {renderButtonContent()}
        </Pressable>
      )}

      {isError && (
        <Text className="text-error text-center mt-2">
          {(error as Error)?.message ?? "Failed to detect location."}
        </Text>
      )}
    </View>
  );
}
