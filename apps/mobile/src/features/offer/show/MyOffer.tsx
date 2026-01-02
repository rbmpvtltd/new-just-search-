import { Ionicons } from "@expo/vector-icons";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { AdvancedImage } from "cloudinary-react-native";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { Loading } from "@/components/ui/Loading";
import { SomethingWrong } from "@/components/ui/SomethingWrong";
import { cld } from "@/lib/cloudinary";
import { type OutputTrpcType, trpc } from "@/lib/trpc";
export default function MyOffersList() {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    trpc.offerrouter.showOffer.infiniteQueryOptions(
      {
        cursor: 0,
        limit: 10,
      },
      {
        getNextPageParam: (data) => data.nextCursor,
      },
    ),
  );
  const router = useRouter();
  if (isLoading) return <ActivityIndicator />;

  if (isError) return <SomethingWrong />;

  if (!data?.pages[0].offers || data.pages[0].offers.length === 0)
    return (
      <View className="px-4 mt-4">
        <Pressable
          className="bg-primary py-3 rounded-xl w-full flex-row items-center justify-center shadow-sm"
          onPress={() => router.push("/(root)/profile/offer/add")}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text className="text-secondary ml-2 font-semibold">
            Add New Offer
          </Text>
        </Pressable>
      </View>
    );
  const offersData = data?.pages.flatMap((page) => page.offers || []) ?? [];

  return (
    <View className="flex-1 bg-base-100">
      <FlatList
        data={offersData}
        renderItem={({ item }) => <OfferCard item={item} />}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (isFetchingNextPage ? <Loading /> : null)}
      />
    </View>
  );
}

type OfferType = NonNullable<
  OutputTrpcType["offerrouter"]["showOffer"]
>["offers"][number];
function OfferCard({ item }: { item: OfferType }) {
  const router = useRouter();
  const { mutate: deleteOffer, isPending } = useMutation(
    trpc.offerrouter.deleteOffer.mutationOptions(),
  );
  const isoStringStartDate = item.offerStartDate;
  const isoStringEndDate = item.offerEndDate;
  const startDate = new Date(isoStringStartDate);
  const endDate = new Date(isoStringEndDate);
  const formattedStartDate = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedEndDate = endDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleDelete = () => {
    Alert.alert("Delete offer", "Are you sure you want to delete this offer?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteOffer(
            { id: item?.id },
            {
              onSuccess: async (data) => {
                if (!data?.success) {
                  console.warn(
                    "Delete product mutation returned no data:",
                    data,
                  );
                  Alert.alert("Offer deleted successfully");
                  return;
                }
              },
            },
          );
        },
      },
    ]);
  };
  return (
    <View className="w-[90%] mt-3 mx-auto bg-base-100">
      <View className="flex-row bg-base-200 p-4 rounded-2xl shadow-sm">
        <View className="w-28 h-28 rounded-lg">
          <AdvancedImage
            cldImg={cld.image(item?.mainImage || "")}
            className="w-[100%] h-[100%] rounded-lg"
          />
        </View>
        <View className="flex-1 ml-4 justify-between">
          <View>
            <Text
              className="text-secondary font-bold text-base"
              numberOfLines={1}
            >
              {item?.offerName}
            </Text>
            <Text className="text-sm text-secondary mb-1">
              🕒 {formattedStartDate} → {formattedEndDate}
            </Text>

            <Text className="text-secondary font-bold text-lg">
              ₹{item?.finalPrice}{" "}
              {item?.discountPercent && (
                <Text className="text-error text-sm ml-1">
                  🔖 {item?.discountPercent}% OFF
                </Text>
              )}
            </Text>
          </View>

          <View className="flex-row mt-3">
            <Pressable
              className="bg-info flex-row items-center px-3 py-1.5 rounded-lg mr-2"
              onPress={() =>
                router.push(`/(root)/profile/offer/edit/${item?.id}`)
              }
            >
              <Ionicons name="create-outline" size={14} color="#fff" />
              <Text className="text-secondary text-sm ml-1">Edit</Text>
            </Pressable>

            <Pressable
              className="bg-error flex-row items-center px-3 py-1.5 rounded-lg"
              onPress={handleDelete}
            >
              {isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="trash-outline" size={14} color="#fff" />
                  <Text className="text-secondary text-sm ml-1">Delete</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
