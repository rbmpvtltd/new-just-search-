import Ionicons from "@expo/vector-icons/Ionicons";
import { AdvancedImage } from "cloudinary-react-native";
import { useRouter } from "expo-router";
import { Pressable, Text, useColorScheme, View } from "react-native";
import Colors from "@/constants/Colors";
import { cld } from "@/lib/cloudinary";
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

        <View className="w-[100%] h-44">
          <AdvancedImage
            cldImg={cld.image(data?.photo || "")}
            className="w-[100%] h-[100%]"
          />
        </View>
        <View className="w-full flex-row items-center justify-between">
          <Text className="text-secondary text-lg font-semibold mb-1 w-[80%]">
            {data?.name}
          </Text>
          {data?.status === "Approved" && (
            <Ionicons name="checkmark-circle" size={24} color="green" />
          )}
        </View>

        <Text className="text-secondary text-sm mb-4">
          {[data.address, data.city.city, data.state.name]
            .filter(Boolean)
            .join(", ")}
        </Text>

        <View className="flex-row justify-between">
          <Pressable
            onPress={() => {
              console.log("data id is ", data.id);
              router.push(`/(root)/profile/hire/edit/${data.id}`);
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
