import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { memo } from "react";
import {
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import StarRating from "react-native-star-rating-widget";
import type { SubcategoryHitType } from "@/app/(root)/(home)/subcategory/[subcategory]";
import AvatarWithFallback from "@/components/ui/AvatarWithFallback";
import Colors from "@/constants/Colors";
import { useShopIdStore } from "@/store/shopIdStore";
import { OutputTrpcType } from "@/lib/trpc";

type FavouriteBsinesses = OutputTrpcType["businessrouter"]["favouritesShops"]["data"][0]["shop"][0];

function DetailCard({
  item,
  type,
  navigationId,
  category,
  subcategory,
  rating
}: {
  item: SubcategoryHitType|FavouriteBsinesses;
  type: number;
  navigationId : number;
  category?: string;
  subcategory?: string[];
  rating?: string | undefined;
}) {
  const { setShopId } = useShopIdStore();
  const colorScheme = useColorScheme();

  return (
    <Pressable
      onPress={() => {
        setShopId(String(navigationId));
        router.navigate({
          pathname: "/(root)/(home)/subcategory/aboutBusiness/[premiumshops]",
          params: { premiumshops: navigationId },
        });
      }}
    >
      <View
        className="bg-base-100 dark:bg-base-200 h-auto rounded-lg shadow-lg m-4"
        style={{
          backgroundColor: Colors[colorScheme ?? "light"]["base-200"],
        }}
      >
        <View className="flex-row p-3 ">
          <View>
            <AvatarWithFallback
              uri={
                "https://www.justsearch.net.in/assets/images/banners/ZmQkEttf1759906394.png"
              } // TODO : change image when upload on cloudinary
              imageClass="w-[150px] h-[180px] rounded-lg"
              iconClass="items-center justify-center"
              imageStyle={{ resizeMode: "stretch" }}
            />
          </View>
          <View className="flex-1 my-1 mx-2">
            <View className="flex-row items-center justify-between">
              {/* {Number(item?.user?.verify) === 1 && (
                <View className="bg-info py-2 px-3 rounded-lg ">
                  <Text className="text-[#fff] text-sm font-medium">
                    Verified
                  </Text>
                </View>
              )} */}
              {Number(type) === 1 && (
                <Pressable
                  className=""
                  onPress={() => {
                    router.push({
                      pathname:
                        "/(root)/(home)/subcategory/aboutBusiness/[premiumshops]",
                      params: { premiumshops: navigationId },
                    });
                  }}
                >
                  <Ionicons
                    size={26}
                    color={Colors[colorScheme ?? "light"].secondary}
                    name="heart-outline"
                  />
                </Pressable>
              )}
            </View>
            <View className="my-2">
              <StarRating
                rating={Number(rating) ?? 0}
                onChange={() => {}}
                starSize={18}
                enableSwiping={false}
              />
              {/* <View className="flex-row items-center gap-1">
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text className="text-secondary text-sm font-medium">
                  {rating}
                </Text>
              </View> */}
            </View>
            <View className="mx-2">
              <Text className="text-secondary text-lg font-semibold">
                {item.name}
              </Text>
            </View>
            <View className="flex-row gap-2 mt-2 flex-wrap">
              <TouchableOpacity
                className="bg-success-content rounded-lg py-2 px-1"
                onPress={() => {
                  setShopId(String(navigationId));
                  router.navigate({
                    pathname:
                      "/(root)/(home)/subcategory/aboutBusiness/[premiumshops]",
                    params: { premiumshops: navigationId },
                  });
                }}
              >
                <Text className="text-success font-semibold text-xs">
                  {category}
                </Text>
              </TouchableOpacity>
              {subcategory?.slice(0, 2)?.map((sub:string, index:number) => (
                <TouchableOpacity
                  key={index.toString()}
                  className="bg-error-content rounded-lg py-2 px-2 mb-1"
                  onPress={() => {
                    setShopId(String(navigationId));
                    router.navigate({
                      pathname:
                        "/(root)/(home)/subcategory/aboutBusiness/[premiumshops]",
                      params: { premiumshops: navigationId },
                    });
                  }}
                >
                  <Text className="text-pink-700 font-semibold text-xs">
                    {sub}
                  </Text>
                </TouchableOpacity>
              ))}
              {Number(subcategory?.length) > 2 && (
                <TouchableOpacity
                  className="bg-base-100 rounded-lg py-2 px-4 mb-1"
                  onPress={() => {
                    setShopId(String(navigationId ));
                    router.navigate({
                      pathname:
                        "/(root)/(home)/subcategory/aboutBusiness/[premiumshops]",
                      params: { premiumshops: navigationId },
                    });
                  }}
                >
                  <Text className="text-secondary font-semibold text-xs">
                    + More
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        {/* <View className="w-full mx-4">
        <Text className="text-secondary text-lg font-semibold ">
          {item.name}
        </Text>
      </View> */}
        <View className="w-[80%] mx-4 flex-row items-center gap-2 ">
          <Text className="text-secondary-content flex items-center justify-center">
            <Ionicons
              name="location"
              size={22}
              color={colorScheme === "dark" ? "#F87171" : "#DC2626"}
            />
          </Text>
          <Text className="text-secondary text-lg font-semibold ">
            {item.buildingName} {item.streetName}
            {item.area}
          </Text>
        </View>

        <View className="w-full mx-4 gap-6 m-4 flex-row items-center ">
          <View className="rounded-lg bg-primary p-1">
            <Pressable
              onPress={() => {
                setShopId(String(navigationId ));
                router.navigate({
                  pathname:
                    "/(root)/(home)/subcategory/aboutBusiness/[premiumshops]",
                  params: { premiumshops: navigationId },
                });
              }}
            >
              <View className=" text-xl text-center flex-row py-1 gap-2 px-3 justify-center">
                <Ionicons size={20} name="chatbox-ellipses" color={"white"} />
              </View>
            </Pressable>
          </View>

          <View className="rounded-lg bg-primary p-1">
            <Pressable
              onPress={() => {
                setShopId(String(navigationId));
                router.navigate({
                  pathname:
                    "/(root)/(home)/subcategory/aboutBusiness/[premiumshops]",
                  params: { premiumshops: navigationId },
                });
              }}
            >
              <View className=" text-xl text-center flex-row py-1 gap-2 px-3 justify-center">
                <Ionicons size={20} name="call" color={"white"} />
              </View>
            </Pressable>
          </View>
          {Number(type) === 1 && (
            <View className="rounded-lg bg-primary p-1">
              <Pressable
                onPress={() => {
                  setShopId(String(navigationId));
                  router.navigate({
                    pathname:
                      "/(root)/(home)/subcategory/aboutBusiness/[premiumshops]",
                    params: { premiumshops: navigationId},
                  });
                }}
              >
                <View className=" text-xl text-center flex-row py-1 gap-2 px-3 justify-center">
                  <Ionicons size={20} name="location" color={"white"} />
                </View>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export const MemoizedDetailCard = memo(DetailCard);
