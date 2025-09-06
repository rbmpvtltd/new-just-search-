import { Ionicons } from "@expo/vector-icons";
import { Text, useColorScheme, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import { useDetectLocation } from "@/query/useDetectLocation";
import { Loading } from "./Loading";

type Props = {
  onResult: (data: {
    success: boolean;
    latitude: number;
    longitude: number;
    name: string;
    street: string;
    formattedAddress: string;
    postalCode?: string;
    city?: string;
    region?: string;
    country?: string;
  }) => void;
  iconOnly?: boolean;
};

export default function LocationAutoDetect({ onResult, iconOnly }: Props) {
  const { data, isLoading, isError, error, refetch } = useDetectLocation(false);
  const colorScheme = useColorScheme();

  const handleDetect = async () => {
    const result = await refetch();
    if (result.data) {
      const { coords, address, success } = result.data;

      onResult({ ...coords, ...address, success });
    }
  };

  return (
    <View className=" mx-auto ">
      {isLoading && <Loading size={"small"} />}
      {!isLoading && (
        <Pressable
          onPress={handleDetect}
          disabled={isLoading}
          style={[
            {
              marginHorizontal: "auto",
            },
            !iconOnly && {
              backgroundColor: Colors[colorScheme ?? "light"].error,
              height: 40,
              padding: 10,
            },
          ]}
          className={`mx-auto px-4 py-6  rounded-lg mt-10 bg-info w-[60%] ${
            isLoading ? "opacity-50" : ""
          } ${!iconOnly ? "bg-info" : ""}`}
        >
          {iconOnly ? (
            <Ionicons
              name="location-outline"
              size={24}
              color={Colors[colorScheme ?? "light"].secondary}
            />
          ) : (
            <Text className="text-secondary text-center font-semibold">
              {isLoading ? "Detecting..." : "Auto Detect Location"}
            </Text>
          )}
        </Pressable>
      )}

      {isError && (
        <Text className="text-error">{(error as Error)?.message}</Text>
      )}
    </View>
  );
}
