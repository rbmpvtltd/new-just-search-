import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo } from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { format } from "timeago.js";
import Colors from "@/constants/Colors";
import type { OutputTrpcType } from "@/lib/trpc";

type MyTokenType =
  | OutputTrpcType["helpAndSupportRouter"]["show"][number]
  | null;
const MyToken = memo(({ myTokens }: { myTokens: MyTokenType }) => {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const parseDate = (dateString: Date | null | undefined) => {
    if (!dateString) return new Date();
    return new Date(dateString);
  };
  return (
    <View
      className="p-4 rounded-2xl shadow mb-3 w-[90%] mx-auto mt-2"
      style={{
        backgroundColor: Colors[colorScheme ?? "light"]["base-200"],
      }}
    >
      <View className="flex-row items-center mb-2">
        <Text className="text-lg font-medium text-secondary mr-2">
          Ticket Number:
        </Text>
        <Text className="text-lg font-bold text-info">
          {myTokens?.tokenNumber}
        </Text>
      </View>

      <View className="flex-row items-center mb-2">
        <Text className="text-lg font-medium text-secondary mr-2">
          Subject:
        </Text>
        <Text className="text-lg font-bold text-info">
          {myTokens?.subject}
          {/* Hire issue test */}
        </Text>
      </View>

      <View className="flex-row items-center mb-2">
        <Text className="text-base font-medium text-secondary mr-2">
          Created:
        </Text>
        <Text className="text-base font-semibold text-info">
          {format(parseDate(myTokens?.createdAt), "en_US")}
        </Text>
      </View>

      <View className="flex-row items-center mb-2">
        <Text className="text-base font-medium text-secondary mr-2">
          Status:
        </Text>
        <View
          className="rounded-full px-3 py-1"
          style={{
            backgroundColor:
              myTokens?.status === 1
                ? Colors[colorScheme ?? "light"].success
                : Colors[colorScheme ?? "light"].error,
          }}
        >
          <Text className="text-secondary font-semibold">
            {myTokens?.status === 1 ? "Open" : "Close"}
          </Text>
        </View>
      </View>

      <View className="flex-row mt-2 self-end">
        <Pressable
          className="flex-row items-center justify-center rounded-lg py-2 px-4"
          style={{
            backgroundColor: Colors[colorScheme ?? "light"].info,
          }}
          onPress={() =>
            router.navigate({
              pathname: "/(root)/profile/help-and-support/chat/[id]",
              params: { id: Number(myTokens?.id) },
            })
          }
        >
          <Ionicons name="eye-outline" size={20} color="#fff" />
          <Text className="text-base-100 font-medium ml-1.5">View</Text>
        </Pressable>
      </View>
    </View>
  );
});

export default MyToken;
