import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, useColorScheme, View } from "react-native";
import { Pressable } from "react-native";
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
  className?: string;
};

export default function LocationAutoDetect({ onResult, iconOnly,className }: Props) {

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
        <Ionicons className={className} name="location-outline" size={24} color={theme.secondary} />
      );
    }

    return (
      <View className="bg-error  rounded-lg items-center justify-center flex-row">
        {isLoading ? (
          <>
            <ActivityIndicator size="small" color="#fff" />
            <Text className="text-white font-semibold ml-2">Detecting...</Text>
          </>
        ) : (
          <Text className="text-white font-semibold">Auto Detect Location</Text>
        )}
      </View>
    );
  };

  return (
    <View className=" w-fit">
      {isLoading ? (
        <View className="items-center justify-center space-y-3">
          <Pressable
            onPress={handleDetect}
            disabled
            style={{ marginHorizontal: "auto" }}
            className={`rounded-lg  bg-info p-4 opacity-50 flex-row items-center justify-center`}
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
          className={`w-fit rounded-lg  ${
            iconOnly ? "" : "bg-info  py-3"
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
