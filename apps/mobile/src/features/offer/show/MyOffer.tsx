import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { SomethingWrong } from "@/components/ui/SomethingWrong";
import { type OutputTrpcType, trpc } from "@/lib/trpc";
import { useDeleteOffer } from "@/query/deleteOffer";
export default function MyOffersList() {
  const {
    data: myOffers,
    isLoading,
    isError,
  } = useQuery(trpc.offerrouter.showOffer.queryOptions());
  const router = useRouter();
  if (isLoading) return <ActivityIndicator />;

  if (isError) return <SomethingWrong />;

  if (!myOffers?.offers || myOffers.offers.length === 0)
    return (
      <View className="px-4 mt-4">
        <Pressable
          className="bg-primary py-3 rounded-xl w-full flex-row items-center justify-center shadow-sm"
          onPress={() => router.push("/(root)/user/offer/add-offer")}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text className="text-secondary ml-2 font-semibold">
            Add New Offer
          </Text>
        </Pressable>
      </View>
    );
  const offersData = myOffers?.offers ?? [];

  return (
    <View className="flex-1 bg-base-100">
      <FlatList
        data={offersData}
        renderItem={({ item }) => <OfferCard item={item} />}
        // onEndReached={() => {
        //   if (hasNextPage) fetchNextPage();
        // }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

type OfferType = NonNullable<
  OutputTrpcType["businessrouter"]["showOffer"]
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
                console.log("data is", data);
                if (!data?.success) {
                  console.warn(
                    "Delete product mutation returned no data:",
                    data,
                  );
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
    <View className="w-full h-full bg-base-100 flex-1">
      <View className="bg-base-200 rounded-2xl shadow-md mx-4 my-6 p-4">
        {/* <Text className="text-secondary text-xl font-semibold mb-2">
          My {item.heading}
        </Text>
        <View className="border-b border-secondary mb-4" /> */}
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
          }}
          className="h-56 aspect-[3/4] mx-auto rounded-xl mb-4"
          resizeMode="cover"
        />

        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-secondary text-lg font-bold w-[50%]">
            {item?.offerName}
          </Text>
          <View className="w-[50%] items-end">
            <Text className="text-xs text-secondary">
              Offer Start Date: {formattedStartDate}
            </Text>

            <Text className="text-xs text-secondary">
              Offer End Date: {formattedEndDate}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          <View className="flex-row justify-between mt-2">
            <Pressable
              onPress={() => router.navigate("/(root)/user/offer")}
              className="w-[48%] flex-row items-center justify-center rounded-xl bg-success py-3 px-4 shadow-sm shadow-black/10 active:opacity-80"
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text className="ml-2 font-medium text-success-content">
                Edit
              </Text>
            </Pressable>

            <Pressable
              onPress={handleDelete}
              className="w-[48%] flex-row items-center justify-center rounded-xl bg-error py-3 px-4 shadow-sm shadow-black/10 active:opacity-80"
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text className="ml-2 font-medium text-secondary">Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
