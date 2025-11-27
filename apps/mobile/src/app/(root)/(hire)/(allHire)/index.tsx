import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HireSearchForm from "@/features/hire/show/hireSearchForm";
import HireCard from "@/features/hire/show/HireCard";
import { Loading } from "@/components/ui/Loading";
import { useInfiniteQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

export default function HireListScreen() {
  const {
    data,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    trpc.hirerouter.MobileAllHireLising.infiniteQueryOptions(
      {
        cursor: 0,
        limit: 10,
      },
      {
        getNextPageParam: (data) => data.nextCursor,
      },
    ),
  );
  console.log(error)
  if (isLoading) {
    return <Loading position="center" />;
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="bg-base-100 text-secondary">{error.message}</Text>
      </View>
    );
  }

  const allData = data?.pages.flatMap((page) => page?.data || []) || [];

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <View className="flex-1">
        <View className="">
          <HireSearchForm />
        </View>
        <FlatList
          className="mt-1 gap-4"
          data={allData}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => {
            if (!item)
              return (
                <View className="flex-1 items-center justify-center">
                  <Text className="bg-secondary text-secondary-100">
                    item not found
                  </Text>
                </View>
              );
            return< HireCard item={item} />;
          }}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (isFetchingNextPage ? <Loading /> : null)}
        />
      </View>
    </SafeAreaView>
  );
}
