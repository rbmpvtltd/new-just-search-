import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { MemoizedDetailCard } from "@/features/business/show/DetailCard";
import DataNotFound from "@/components/ui/DataNotFound";
import { useWishlist } from "@/query/favorite";

export default function AllFavorites() {
  const { data, isLoading, refetch } = useWishlist();

  const filtered = (data?.data || [])
    .filter((item: any) => item?.listing != null)
    .map((item: any) => item.listing);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  if (isLoading) return <Text className="text-secondary">Loading...</Text>;
  if (filtered?.length === 0) {
    // Alert.alert(
    //   "Data Not Found",
    //   "There is no favourite found for you go to business and add favourites",
    //   [{ text: "Got It" }],
    // );
    return <DataNotFound />;
  }

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item?.id?.toString()}
      renderItem={({ item }) => {
        return (
          <MemoizedDetailCard
            item={item}
            type={item?.type}
            category={item?.categories[0]?.title}
            subcategories={item?.subcategories}
          />
        );
      }}
    />
  );
}
