import { useLocalSearchParams } from "expo-router";
import { FlatList, Text, View } from "react-native";
import { MemoizedDetailCard } from "@/components/cards/DetailCard";
import HireCard from "@/components/hirePageComp/HireCard";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import DataNotFound from "@/components/ui/DataNotFound";
import { Loading } from "@/components/ui/Loading";
// import { useSubCategoryList } from "@/query/subacategory";
import { useSubcategoryList } from "@/query/subacategory";

export default function SubCategory() {
  const { subcategory } = useLocalSearchParams();
  const subcategoryParam = Number(
    Array.isArray(subcategory) ? subcategory[0] : subcategory
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
  } = useSubcategoryList(Number(subcategoryParam));

  console.log("data is ====================>",JSON.stringify(data, null, 2));
  if (isLoading) {
    return <Loading position="center" />;
  }

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

  return (
    <BoundaryWrapper>
      <FlatList
        className="bg-base-100 mb-16"
        data={subcategoryData}
        keyExtractor={(item) => item.id.toString()}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        renderItem={({ item }) => {
          return item?.type === "1" ? (
            <MemoizedDetailCard
              type={1}
              item={item}
              category={item?.categories[0]?.title}
              subcategories={item?.subcategories}
            />
          ) : (
            <HireCard item={item} />
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
