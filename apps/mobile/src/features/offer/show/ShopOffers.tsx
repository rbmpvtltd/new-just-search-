import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { type OutputTrpcType, trpc } from "@/lib/trpc";
import DataNotFound from "../../../components/ui/DataNotFound";

type OfferType = OutputTrpcType["businessrouter"]["shopOffers"][0];

export default function ShopOffersList({ listingId }: { listingId: string }) {
  const { data } = useQuery(
    trpc.businessrouter.shopOffers.queryOptions({
      businessId: Number(listingId),
    }),
  );

  if (data?.length === 0) {
    return <DataNotFound />;
  }

  return (
    <FlatList
      keyExtractor={(_, i) => i.toString()}
      data={data}
      renderItem={(item: { item: OfferType }) => {
        return (
          <Pressable
            onPress={() => {
              router.push({
                pathname:
                  "/(root)/(home)/subcategory/aboutbusiness/offers/singleoffers/[singleoffer]",
                params: { singleoffer: item.item.id },
              });
            }}
          >
            <View className="bg-base-200 rounded-lg w-[90%] shadow-lg m-4">
              {/* Image Section */}
              <View className="relative">
                <View className="relative h-auto mx-auto mt-2 w-[60%] ">
                  <Image
                    className="w-full rounded-lg aspect-[3/4]"
                    source={{
                      uri: `https://www.justsearch.net.in/assets/images/banners/ZmQkEttf1759906394.png`,
                    }}
                  />
                  <Text className="absolute bg-error text-secondary mt-8 pl-8 pr-3 rounded-r-md t-10">
                    -{item?.item?.discountPercent}%
                  </Text>
                </View>
              </View>
              <View className="h-auto w-full mt-4 px-4">
                <Text className="text-secondary text-2xl font-semibold">
                  {item?.item?.name ?? "Unknown"}
                </Text>
              </View>

              <View className="h-auto w-full mt-4 px-4 mb-6 text-center">
                <Text className="text-primary text-lg ">
                  ₹{String(item?.item?.finalPrice ?? "")}
                  <Text className="text-secondary line-through">
                    ₹{String(item?.item?.price ?? "")}
                  </Text>
                </Text>
              </View>
            </View>
          </Pressable>
        );
      }}
    />
  );
}
