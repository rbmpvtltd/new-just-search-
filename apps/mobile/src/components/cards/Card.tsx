import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import StarRating from "react-native-star-rating-widget";
import { useShopIdStore } from "@/store/shopIdStore";

type CardPropsType = {
  item: {
    id: any;
    name: string;
    categories: any;
    subcategories: any;
    title: string;
    photo: string;
    building_name: string;
    street_name: string;
    area: string;
    landmark: string;
    reviews_avg_rate: number;
    user: {
      verify: number;
    };
  };
};

function Card<T>({ item }: CardPropsType) {
  const { setShopId } = useShopIdStore();
  return (
    <View className="h-[100%]">
      <Pressable
        onPress={() => {
          setShopId(item?.id);
          router.push({
            pathname: "/aboutBusiness/[premiumshops]",
            params: { premiumshops: item?.id.toString() },
          });
        }}
      >
        <View className="bg-base-200 rounded-lg w-[90%] shadow-lg ">
          {/* Image Section */}
          <View className="relative">
            <Image
              className="w-full h-[300px] rounded-tl-lg rounded-tr-lg"
              source={{
                uri: `https://justsearch.net.in/assets/images/${item.photo}`,
              }}
              resizeMode="stretch"
            />
          </View>
          <View className="mt-2 flex-row items-center justify-between">
            <StarRating
              rating={item?.reviews_avg_rate ?? 0}
              onChange={() => {}}
              starSize={24}
              enableSwiping={false}
            />
            {Number(item?.user?.verify) === 1 && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="green"
                className="mr-2"
              />
            )}
          </View>

          <View className="flex-col gap-3 mx-2 ">
            <View>
              <Text className="text-secondary text-xl font-semibold">
                {item?.name}
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {item?.categories?.[0]?.title && (
                <TouchableOpacity className="bg-success-content rounded-lg py-2 px-3 mb-1">
                  <Text className="text-success font-semibold text-xs">
                    {item.categories[0].title}
                  </Text>
                </TouchableOpacity>
              )}

              {item?.subcategories
                ?.slice(0, 2)
                .map((sub: any, index: number) => (
                  <TouchableOpacity
                    key={sub.id || index}
                    className="bg-error-content rounded-lg py-2 px-4 mb-1"
                  >
                    <Text className="text-pink-700 font-semibold text-xs">
                      {sub.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              {item.subcategories?.length > 2 && (
                <TouchableOpacity className="bg-base-100 rounded-lg py-2 px-4 mb-1">
                  <Text className="text-secondary font-semibold text-xs">
                    + More
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <Text className="text-secondary-content my-2 mx-3">
            <Ionicons name="location" />
            {[item?.area, item?.landmark, item?.street_name]
              .filter(Boolean)
              .join(", ")}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

export default Card;
