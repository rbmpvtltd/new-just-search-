import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { MemoizedDetailCard } from "@/features/business/show/DetailCard";
import HireCard from "@/features/hire/show/HireCard";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import DataNotFound from "@/components/ui/DataNotFound";
import { Loading } from "@/components/ui/Loading";
import { trpc } from "@/lib/trpc";

export default function SubCategory() {
  const { subcategory ,type} = useLocalSearchParams();
  const subcategoryParam = Number(
    Array.isArray(subcategory) ? subcategory[0] : subcategory,
  );

  console.log(subcategoryParam);
  const {
    data,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    trpc.subcategoryRouter.businessesByCategoryInfinate.infiniteQueryOptions(
      {
        cursor: 0,
        categoryId: subcategoryParam,
        limit: 10,
      },
      {
        getNextPageParam: (data) => data.nextCursor,
      },
    ),
  );

  // const { data, isLoading } = useQuery(
  //   trpc.subcategoryRouter.businessesByCategoryInfinate.queryOptions({
  //     cursor: 0,
  //     categoryId: subcategoryParam,
  //     limit: 10,
  //   }),
  // );
  // console.log("data is", data);

  if (isLoading) {
    return <Loading position="center" />;
  }

  // return (
  //   <TouchableOpacity
  //     onPress={() => {
  //       fetchNextPage();
  //     }}
  //   >
  //     <View className="flex-1 items-center justify-center">
  //       <Text className="bg-secondary text-secondary-100">hi</Text>
  //     </View>
  //   </TouchableOpacity>
  // );

  if (!data?.pages[0].data || data?.pages[0]?.data?.length === 0) {
    return <DataNotFound />;
  }
  
  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="bg-secondary text-secondary-100">{error.message}</Text>
      </View>
    );
  }
  
  const subcategoryData = data?.pages.flatMap((page) => page?.data || []) || [];
  const title = subcategoryData[0].category
  
  return (
    <BoundaryWrapper>
      <Stack.Screen
        options={{
          title : title ?? "",
          headerShown : true
        }}
      />
      <FlatList
        className="bg-base-100 mb-16"
        data={subcategoryData}
        keyExtractor={(item) => item.id.toString()}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        renderItem={({ item }) => {
          return Number(type) === 1 ? (
            <MemoizedDetailCard
              type={1}
              item={item}
              category={item?.category || ""}
              subcategories={item?.subcategories}
            />
          ) : (
            // <HireCard item={item} />\
            <Text className="text-secondary">Hire Card Here</Text>
          );
        }}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (isFetchingNextPage ? <Loading /> : null)}
      />
    </BoundaryWrapper>
  );
}
