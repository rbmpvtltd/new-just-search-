import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import { useStartChat } from "@/query/startChat";
import { useAuthStore } from "@/store/authStore";
import { showLoginAlert } from "@/utils/alert";
import { dialPhone } from "@/utils/getContact";

const screenWidth = Dimensions.get("window").width;
export default function HireCard({ item, title }: any) {
  const colorScheme = useColorScheme();
  const { mutate: startChat } = useStartChat();
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  const clearToken = useAuthStore((state) => state.clearToken);

  const [aspectRatio, setAspectRatio] = useState(3 / 4);

  // Fetch image dimensions to calculate aspect ratio
  useEffect(() => {
    if (item?.photo) {
      const imgUrl = `https://www.justsearch.net.in/assets/images/${item?.photo}`;
      Image.getSize(
        imgUrl,
        (width, height) => {
          if (width > 0 && height > 0) {
            setAspectRatio(Number((width / height).toFixed(2))); // safe float
          }
        },
        () => {
          setAspectRatio(3 / 4); // fallback if image fails
        },
      );
    }
  }, [item?.photo]);
  const imgUrl = item?.photo
    ? `https://www.justsearch.net.in/assets/images/${item?.photo}`
    : "https://www.justsearch.net.in/assets/images/9706277681737097544.jpg";
  if (!item || !item?.name) return null;
  return (
    <View className="h-auto rounded-xl m-auto w-[90%] pb-4 bg-base-200 mb-4 shadow-2xl">
      <View
        className="mx-auto mt-2 w-[60%]"
        style={{ aspectRatio, height: screenWidth * 0.6 * (1 / aspectRatio) }}
      >
        <Pressable onPress={() => router.navigate(`/hireDetail/${item?.slug}`)}>
          <Image
            className="w-full h-full rounded-lg"
            source={{
              uri: imgUrl,
            }}
            resizeMode="contain"
          />
        </Pressable>
      </View>
      <View className="flex-row justify-between items-center w-[100%]">
        <View className="w-[80%]">
          <Text className="text-secondary text-2xl m-4 font-semibold">
            {item?.name}
          </Text>
        </View>
        <View className="w-[20%] flex items-center justify-center">
          {Number(item?.user?.verify) === 1 && (
            <Ionicons name="checkmark-circle" size={28} color="green" />
          )}
        </View>
      </View>
      <View className="flex-row gap-2 m-4 flex-wrap">
        {item?.categories?.map((item: any, i: number) => (
          <TouchableOpacity
            key={i.toString()}
            className="bg-success-content rounded-lg py-2 px-3 mb-1"
          >
            <Text className="text-success font-semibold text-xs">
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
        {item?.subcategories?.map((item: any, i: number) => (
          <TouchableOpacity
            key={i.toString()}
            className="bg-error-content rounded-lg py-2 px-3 mb-1"
          >
            <Text className="text-pink-700 font-semibold text-xs">
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="mx-4 ">
        <Text className="text-secondary-content">{item.job_role}</Text>
      </View>
      <View className="mx-4 my-2">
        <Text className="text-secondary-content">
          {(() => {
            try {
              const parsed = JSON.parse(item.job_type); // turn it into an array
              return Array.isArray(parsed) ? parsed.join(", ") : parsed;
            } catch {
              return item.job_type; // fallback if it's not JSON
            }
          })()}
        </Text>
      </View>
      <View className="mx-4 my-2">
        <Text className="text-secondary-content">
          <Ionicons name="location" />
          {item?.real_address}
        </Text>
      </View>
      <Pressable
        onPress={() => {
          if (!isAuthenticated) {
            showLoginAlert({
              message: "Need to login to chat on your behalf",
              onConfirm: () => {
                clearToken();
                router.push("/user/bottomNav/profile");
              },
            });
          } else {
            startChat(item.id, {
              onSuccess: (res) => {
                console.log("Chat started:", res.chat_session_id);

                router.push({
                  pathname: "/chat/[chat]",
                  params: { chat: res?.chat_session_id.toString() },
                });
              },
              onError: (err) => {
                console.error("Failed to start chat:", err);
              },
            });
          }
        }}
        style={{
          width: "90%",
          backgroundColor: Colors[colorScheme ?? "light"].primary,
          padding: 8,
          borderRadius: 4,
          marginTop: 8,
          marginHorizontal: "auto",
        }}
      >
        <View className="text-xl text-center flex-row py-1 gap-2 justify-center items-start">
          <Ionicons name="chatbox-ellipses" size={20} color={"white"} />
          <Text className="text-[#ffffff] text-center font-semibold">
            Chat Now
          </Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => dialPhone(item?.phone_number)}
        style={{
          width: "90%",
          backgroundColor: Colors[colorScheme ?? "light"].primary,
          padding: 8,
          borderRadius: 4,
          marginTop: 8,
          marginHorizontal: "auto",
        }}
      >
        <View className="text-xl text-center flex-row py-1 gap-2 justify-center items-start">
          <Ionicons name="call" size={20} color={"white"} />
          <Text className="text-[#ffffff] text-center font-semibold">
            Contact Now
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
