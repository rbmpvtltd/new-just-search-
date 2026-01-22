import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { AdvancedImage } from "cloudinary-react-native";
import { router } from "expo-router";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  Share,
  Text,
  View,
} from "react-native";
import { useAuthStore } from "@/features/auth/authStore";
import { cld } from "@/lib/cloudinary";
import { type OutputTrpcType, trpc } from "@/lib/trpc";
import DataNotFound from "../../../components/ui/DataNotFound";

type ProductType = OutputTrpcType["businessrouter"]["shopProducts"][0];

function ListingProduct({ shopId }: { shopId: string }) {
  const { data } = useQuery(
    trpc.businessrouter.shopProducts.queryOptions({
      businessId: Number(shopId),
    }),
  );
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  const clearToken = useAuthStore((state) => state.clearToken);
  if (data?.length === 0) {
    return <DataNotFound />;
  }

  const renderItem = ({ item }: { item: ProductType }) => {
    const onShare = async () => {
      try {
        const shareUrl = `https://web-test.justsearch.net.in/subcategory/aboutbusiness/products/singleproduct/${item.id}`;

        const result = await Share.share(
          {
            title: item?.name ?? "Check this Product",
            message:
              Platform.OS === "android"
                ? `${item?.name ?? "Amazing Product"}\n\n${shareUrl}`
                : (item?.name ?? "Amazing Product"),
            url: shareUrl, // iOS uses this
          },
          {
            dialogTitle: "Share Offer",
          },
        );

        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // iOS specific (AirDrop, WhatsApp, etc.)
            console.log("Shared via:", result.activityType);
          } else {
            console.log("Shared successfully");
          }
        } else if (result.action === Share.dismissedAction) {
          console.log("Share dismissed");
        }
      } catch (error: any) {
        Alert.alert("Error", error?.message ?? "Unable to share");
      }
    };
    return (
      <View className="bg-base-200 rounded-lg w-[90%] shadow-lg  m-4 ">
        <Pressable
          onPress={() => {
            router.navigate({
              pathname:
                "/(root)/(home)/subcategory/aboutbusiness/products/singleproduct/[singleproduct]",
              params: { singleproduct: item?.id },
            });
          }}
        >
          {/* Image Section */}
          <View className="relative">
            <View className="relative h-auto mx-auto mt-2 w-[60%] ">
              {/* <Image
                    className="w-full rounded-lg aspect-[3/4] "
                    source={{
                      uri: `https://www.justsearch.net.in/assets/images/19992115541759217624.jpeg`,
                   
                    }}
                  /> */}
              <AdvancedImage
                cldImg={cld.image(item.photos[0] || "")}
                className="w-[100%] aspect-[3/4] rounded-lg"
              />
            </View>
          </View>
          {/* <View>
            <Text className="text-secondary-content my-4 mx-3 text-xl text-center">
              {item?.name}
            </Text>
            <Text className="text-primary font-semibold text-[24px] my-4 mx-3 text-xl text-center">
              ₹{item?.price}
            </Text>
          </View> */}
          <View className="w-full mt-4 px-4">
            {/* Row 1: Name + Share */}
            <View className="relative items-center">
              <Text
                className="text-secondary text-2xl font-semibold text-center px-10"
                numberOfLines={2}
              >
                {item?.name ?? "Unknown"}
              </Text>

              <Pressable
                hitSlop={10}
                onPress={onShare}
                className="absolute right-0 top-1/2 -translate-y-1/2"
              >
                <Ionicons name="share-social" size={22} color="black" />
              </Pressable>
            </View>

            {/* Row 2: Price */}
            <Text className="text-primary font-semibold text-[24px] text-center mt-2">
              ₹{item?.price}
            </Text>
          </View>
        </Pressable>
        <View className="w-[80%] bg-primary p-2 rounded mt-2 mx-auto mb-4">
          <Pressable
            onPress={() => {
              router.push({
                pathname:
                  "/(root)/(home)/subcategory/aboutbusiness/products/singleproduct/[singleproduct]",
                params: { singleproduct: item.id },
              });
            }}
          >
            <View className="flex-row justify-center items-center">
              <Ionicons
                name="chatbox-ellipses"
                size={20}
                color="white"
                className="mr-2"
              />
              <Text className="text-[#ffffff] font-semibold text-center">
                Chat Now
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    );
  };
  return (
    // <Text className="text-secondary text-3xl">this is for testing in ListingProducts.tsx</Text>
    <FlatList
      keyExtractor={(_, i) => i.toString()}
      data={data}
      renderItem={renderItem}
    />
  );
}

export default ListingProduct;
