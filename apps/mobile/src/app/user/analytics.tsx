import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

type BusinessListingCardProps = {
  item: {
    uri: string;
    listingName: string;
    location: string;
  };
};
export default function Analytics({ item }: BusinessListingCardProps) {
  return (
    <View className="w-full h-full bg-base-100 m-auto flex justify-center items-center">
      {/* <View className="bg-base-200 rounded-xl shadow-md mx-4 my-6 p-4">
        <Text className="text-secondary text-xl font-semibold mb-2">
          Listing Statistics
        </Text>
        <View className="border-b border-secondary mb-4" />

        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1616499370260-485b3e5ed653?q=80&w=1470",
          }}
          className="w-full h-44 rounded-lg mb-3"
        />
        <Text className="text-secondary text-lg font-semibold mb-1">
          {item?.listingName || "Om Prakash"}
        </Text>
        <Text className="text-secondary text-sm mb-4">
          {item?.location ||
            "JALORI GATE Pin Code is 342003 JALORI GATE is located in JODHPUR RAJASTHAN"}
        </Text>

        <View className="flex-row justify-evenly items-center">
          <Pressable className="bg-info rounded-lg py-3 px-4 w-[48%] flex-row items-center justify-center">
            <Ionicons name="eye-outline" size={20} color="#fff" />
            <Text className="text-secondary ml-2 font-medium">View</Text>
          </Pressable>
          <View>
            <Text className="text-secondary text-lg font-semibold">
              Total Views : 100
            </Text>
          </View>
        </View>
      </View> */}

      <Text className="text-secondary text-4xl font-bold">Coming soon...</Text>
    </View>
  );
}
