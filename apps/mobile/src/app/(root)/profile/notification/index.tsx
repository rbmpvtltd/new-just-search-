// import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
// import { router } from "expo-router";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DataNotFound from "@/components/ui/DataNotFound";
import { Loading } from "@/components/ui/Loading";
import { NOTIFICATION_URL } from "@/constants/apis";
import Colors from "@/constants/Colors";
import { useClearNotification } from "@/query/clearNotifications";
import { useSuspenceData } from "@/query/getAllSuspense";
import { useMaskAsRead } from "@/query/notification/notication";
import { useStartChat } from "@/query/startChat";
import { isoStringToTime } from "@/utils/dateAndTime";
import { trpc } from "@/lib/trpc";
import { useAuthStore } from "@/features/auth/authStore";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";



export default function Notification() {
  const colorScheme = useColorScheme();
  const [showModal, setShowModal] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  console.log("Is Authenticated", isAuthenticated);
  if (!isAuthenticated) {
    router.push("/")
  }
  const { data } = useQuery(trpc.notificationRouter.getNotifications.queryOptions())
  console.log("Notification Data", data);
    const [selectedNotification, setSelectedNotification] = useState<any>(null);

  return (
    <View>

      <FlatList
        className="bg-base-200 mb-10"
        data={data?.data}
        renderItem={({ item, index }) => {
          return (
            <Pressable
                          onPress={() => {
                setShowModal(true);
                setSelectedNotification(item);
              }}

            >
              <View
                className={`${index % 2 === 0 ? "bg-base-200" : "bg-base-100"} px-4 py-3 flex-row gap-6 items-center w-[100%]`}
              >
                <View className="relative">
                  <Image
                    source={require("@/assets/images/app-icon.png")}
                    className="w-[50px] h-[50px] rounded-full"
                  />
                </View>
                <View className="w-[80%]">
                  <View className="flex-row justify-between items-center">
                    <Text className={`text-secondary text-2xl font-semibold`}>
                      Just Search
                    </Text>
                    <Text className="text-secondary">
                      {String(item.createdAt).split(" ").slice(0, 3).join(" ")}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-secondary text-[12px]">
                      {item.title}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
      <Modal
        visible={showModal}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
        transparent
      >
        <View
          className="flex-1 justify-center items-center bg-black/50"
          style={{
            backgroundColor:
              colorScheme === "dark" ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)",
          }}
        >
          <View
            className="w-[85%] p-5 rounded-2xl shadow-lg"
            style={{
              backgroundColor: Colors[colorScheme ?? "light"]["base-100"],
            }}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-secondary">
                {selectedNotification?.title || "Just Search"}
              </Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Ionicons
                  name="close"
                  size={24}
                  color={Colors[colorScheme ?? "light"].secondary}
                />
              </Pressable>
            </View>

            <Text className="text-secondary text-lg">
              {selectedNotification?.description}
            </Text>
          </View>
        </View>
      </Modal>

    </View>
  );
}
