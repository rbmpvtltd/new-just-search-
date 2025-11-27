import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {  Text, TouchableOpacity, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import StarRating from "react-native-star-rating-widget";
import { useShopIdStore } from "@/store/shopIdStore";
import { Image } from "react-native";

type CardPropsType = {
  item: {
    photo: string | undefined;
    id: number;
    name: string;
    area: string | null;
    streetName: string | null;
    buildingName: string | null;
    rating: string[];
    subcategories: string[];
    category: string | null;
  };
};

function Card<T>({ item }: CardPropsType) {
  const { setShopId } = useShopIdStore();

  return (
    <View className="h-[100%]">
      <Pressable
        onPress={() => {
          setShopId(item?.id.toString());
          router.push({
            pathname: "/(root)/(home)/subcategory/aboutBusiness/[premiumshops]",
            params: { premiumshops: item?.id.toString() },
          });
        }}
      >
        <View className="bg-base-200 rounded-lg w-[90%] shadow-lg ">
          {/* Image Section */}
          <View className="relative">
           <Image
           src="https://www.justsearch.net.in/assets/images/banners/ZmQkEttf1759906394.png"
           className="w-[100%] h-[200px]"

            />
          </View>
          <View className="mt-2 flex-row items-center justify-between">
            <StarRating
              rating={Math.ceil(Number(item.rating))}
              onChange={() => {}}
              starSize={24}
              enableSwiping={false}
            />
            {/* {Number(item?.user?.verify) === 1 && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="green"
                className="mr-2"
              />
            )} */}
          </View>

          <View className="flex-col gap-3 mx-2 ">
            <View>
              <Text className="text-secondary text-xl font-semibold">
                {item?.name}
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {item?.category && (
                <TouchableOpacity className="bg-success-content rounded-lg py-2 px-3 mb-1">
                  <Text className="text-success font-semibold text-xs">
                    {item.category}
                  </Text>
                </TouchableOpacity>
              )}

              {item?.subcategories
                ?.slice(0, 2)
                .map((sub: string, index: number) => (
                  <TouchableOpacity
                    key={index.toString()}
                    className="bg-error-content rounded-lg py-2 px-4 mb-1"
                  >
                    <Text className="text-pink-700 font-semibold text-xs">
                      {sub}
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
            {[item?.area, item?.streetName, item?.buildingName]
              .filter(Boolean)
              .join(", ")}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

export default Card;
