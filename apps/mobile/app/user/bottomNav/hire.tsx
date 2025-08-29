import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HireSearchForm from "@/components/forms/hireSearchForm";
import HireCard from "@/components/hirePageComp/HireCard";
import { Loading } from "@/components/ui/Loading";
import { useHireList } from "@/query/hireListing";

export default function HireListScreen() {
  const {
    data,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useHireList();

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
    <SafeAreaView>
      <View className="mb-40">
        <View className="">
          <HireSearchForm />
        </View>
        <FlatList
          className="mt-1 mb-[100px]"
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
            return <HireCard item={item} />;
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
