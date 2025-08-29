import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { useStartChat } from "@/query/startChat";
import { dialPhone } from "@/utils/getContact";
import { openInGoogleMaps } from "@/utils/getDirection";
import Review from "../forms/review";

type PremiumShposCardProps = {
  item: {
    id: string;
    name: string;
    description: string;
    categories: { title: string }[];
    subcategories: { name: string }[];
    specialities: string;
    building_name: string;
    street_name: string;
    area: string;
    landmark: string;
    pincode: string;
    city: {
      id: number;
      city: string;
    };
    state: {
      id: number;
      name: string;
    };
    email: string;
    phone_number: string;
    whatsapp_no: string;
    home_delivery: boolean;
    latitude: number;
    longitude: number;
    schedules: string;
  };
};

const ShposCard = ({ item }: PremiumShposCardProps) => {
  const router = useRouter();
  const { mutate: startChat, isPending } = useStartChat();
  const latitude = Number(item?.latitude?.split(",").shift());
  const longitude = Number(item?.longitude?.split(",").pop());

  const schedules = JSON.parse(item?.schedules || "{}");

  return (
    <View className="w-[93%] mx-auto mt-6 p-4 rounded-2xl bg-base-200 shadow-lg gap-4">
      <Text className="text-xl font-bold text-secondary ">{item?.name}</Text>
      <View className="mb-1">
        <Text className="text-secondary text-lg">{item?.description} </Text>
      </View>
      <View className="mb-1 flex-row items-center gap-3">
        <Text className="text-primary text-sm ">
          <Ionicons name="location-outline" size={16} className="ml-1" />
        </Text>
        <Text className=" text-secondary flex-1 flex-wrap">
          {[
            item?.building_name,
            item?.street_name,
            item?.landmark,
            item?.area,
            item?.city?.city,
            item?.state?.name,
          ]
            .filter(Boolean)
            .join(", ")}
        </Text>
      </View>

      <View className="mb-1 flex flex-row items-center gap-3">
        <Text className="text-primary text-sm ">
          <Ionicons name="call-outline" size={16} className="ml-1" />
        </Text>
        <Pressable onPress={() => dialPhone(item?.phone_number)}>
          <Text className=" text-secondary">{item?.phone_number}</Text>
        </Pressable>
      </View>
      <View className="mb-1 flex flex-row items-center gap-3">
        <Text className="text-success text-sm">
          <Ionicons name="logo-whatsapp" size={16} className="ml-1" />
        </Text>
        <Text className=" text-secondary">
          {item?.whatsapp_no ? item?.whatsapp_no : "Not Available"}
        </Text>
      </View>

      <View className="mb-1 flex flex-row items-center gap-3">
        <Text className="text-primary text-sm">
          <Ionicons name="mail-outline" size={16} className="ml-1" />
        </Text>
        <Text className=" text-secondary">
          {item?.email ? item?.email : "Not Available"}
        </Text>
      </View>

      <View className="mb-1 flex-row items-center gap-2">
        <Text className="text-primary text-sm">
          <Ionicons name="bicycle-outline" size={16} className="ml-1" />
        </Text>
        <Text className=" text-secondary font-bold">Home Delivery:</Text>
        <Text className=" text-secondary">
          {!item?.home_delivery ? "Available" : "Not Available"}
        </Text>
      </View>
      <View className="mb-1 flex-row flex-wrap gap-2">
        <Text className=" text-secondary font-bold">Specialities:</Text>
        <Text className=" text-secondary">{item?.specialities}</Text>
      </View>

      <View className="flex-row flex-wrap gap-2 ">
        <View>
          <Text className=" text-secondary w-full mb-1 font-bold">
            Categories:
          </Text>
        </View>
        {item.categories?.[0]?.title && (
          <TouchableOpacity className="bg-success-content rounded-lg py-2 px-3 mb-1">
            <Text className="text-success font-semibold text-xs">
              {item.categories[0].title}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row flex-wrap gap-2 ">
        <View>
          <Text className=" text-secondary w-full mb-1 font-bold">
            Sub Categories:
          </Text>
        </View>
        {item.subcategories?.map((sub, index) => (
          <TouchableOpacity
            className="bg-error-content rounded-lg py-2 px-3 mb-1"
            key={index.toString()}
          >
            <Text className="text-pink-700 font-semibold text-xs">
              {sub.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View className="p-4">
        {Object.entries(schedules).map(([day, value]) => {
          const open = value?.opens_at;
          const close = value?.closes_at;

          const timeLabel = open && close ? `${open} - ${close}` : "Closed";
          return (
            <View
              key={day}
              className="flex-row justify-between py-2 border-b border-gray-200"
            >
              <Text className="font-medium text-secondary">{day}</Text>
              <Text
                className={` ${timeLabel === "Closed" ? "text-secondary" : "text-secondary"}`}
              >
                {timeLabel}
              </Text>
            </View>
          );
        })}
      </View>

      <View className="flex-row w-full justify-center gap-2">
        {/* Chat Now */}
        <View className="flex-1 bg-primary rounded-lg px-2 py-2">
          <Pressable
            onPress={() => {
              startChat(item?.id, {
                onSuccess: (res) => {
                  if (res?.chat_session_id) {
                    router.push({
                      pathname: "/chat/[chat]",
                      params: { chat: res?.chat_session_id.toString() },
                    });
                  } else {
                    Alert.alert(
                      "Authentication Required",
                      "You must be logged in to use chat.",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Sign In",
                          onPress: () => {
                            router.navigate("/user/bottomNav/profile");
                          },
                        },
                      ],
                    );
                    [];
                  }
                },
              });
            }}
          >
            <View className="flex-row items-center justify-center gap-1">
              <Ionicons size={20} name="chatbox-ellipses" color={"white"} />
              <Text className="text-secondary font-semibold text-sm">
                Chat Now
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Contact Now */}
        <View className="flex-1 bg-primary rounded-lg px-2 py-2">
          <Pressable onPress={() => dialPhone(item?.phone_number)}>
            <View className="flex-row items-center justify-center gap-1">
              <Ionicons size={20} name="call" color={"white"} />
              <Text className="text-secondary font-semibold text-sm">
                Contact Now
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Get Direction */}
        <View className="flex-1 bg-primary rounded-lg px-2 py-2">
          <Pressable onPress={() => openInGoogleMaps(latitude, longitude)}>
            <View className="flex-row items-center justify-center gap-1">
              <Ionicons size={20} name="location" color={"white"} />
              <Text className="text-secondary font-semibold text-sm">
                Get Direction
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {latitude && longitude ? (
        <View style={{ height: 400, borderRadius: 12, overflow: "hidden" }}>
          <Text></Text>
        </View>
      ) : (
        <Text className="text-red-500 font-semibold text-center mt-4">
          Location not available
        </Text>
      )}

      <View>
        <Review listingId={Number(item?.id)} />
      </View>
    </View>
  );
};

export default ShposCard;
