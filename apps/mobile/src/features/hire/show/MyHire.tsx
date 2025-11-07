import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Image, Text, useColorScheme, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import type { OutputTrpcType } from "@/lib/trpc";

type MyHireType = OutputTrpcType["hirerouter"]["show"];
export default function MyHireCard({ data }: { data: MyHireType }) {
  const colorScheme = useColorScheme();
  const router = useRouter();
  return (
    <View className="w-full h-full bg-base-100">
      <View className="bg-base-200 rounded-xl shadow-md mx-4 my-6 p-4">
        <Text className="text-secondary text-xl font-semibold mb-2">
          My Listings
        </Text>
        <View className="border-b border-secondary mb-4" />

        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
          }}
          className="w-full h-44 rounded-lg mb-3"
          resizeMode="cover"
        />

        <View className="w-full flex-row items-center justify-between">
          <Text className="text-secondary text-lg font-semibold mb-1 w-[80%]">
            {data.name}
          </Text>
          <Ionicons name="checkmark-circle" size={24} color="green" />
        </View>

        <Text className="text-secondary text-sm mb-4">{data.area}</Text>

        <View className="flex-row justify-between">
          <Pressable
            onPress={() => {
              router.push("/(root)/profile/hire/edit");
            }}
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].success,
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 16,
              width: "48%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={{ color: "#fff", marginLeft: 8, fontWeight: "500" }}>
              Edit
            </Text>
          </Pressable>

          <Pressable
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].info,
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 16,
              width: "48%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="eye-outline" size={20} color="#fff" />
            <Text style={{ color: "#fff", marginLeft: 8, fontWeight: "500" }}>
              View
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
