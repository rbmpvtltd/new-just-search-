import { Redirect, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Alert, FlatList } from "react-native";
import { MemoizedDetailCard } from "@/features/ business/show/DetailCard";
import HireCard from "@/features/hire/show/HireCard";
import { Loading } from "@/components/ui/Loading";
import { useSearchLists } from "@/query/searchList";
import DataNotFound from "@/components/ui/DataNotFound";

export default function AllListing() {
  const { location, category } = useLocalSearchParams();

  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchLists(location.toString(), category.toString());

  const totalData = data.pages[0].total;

  const firstPageData = data?.pages[0]?.data[0];

  if (!totalData) {
    return <DataNotFound />;
  }

  if (totalData === 1) {
    const id = firstPageData?.id;
    const type = String(firstPageData?.type);
    if (type === "1") {
      return (
        <Redirect
          href={{
            pathname: "/aboutBusiness/[premiumshops]",
            params: {
              premiumshops: id,
              location: location?.toString(),
              category: category?.toString(),
            },
          }}
        />
      );
    } else if (type === "2") {
      return (
        <Redirect
          href={{
            pathname: "/hireDetail/[hiredetails]",
            params: {
              hiredetails: firstPageData?.slug,
              location: location?.toString(),
              category: category?.toString(),
            },
          }}
        />
      );
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "All Listing",
        }}
      />
      <FlatList
        nestedScrollEnabled={true}
        data={data?.pages.flatMap((page) => page.data) ?? []}
        contentContainerStyle={{ minHeight: "100%" }}
        keyExtractor={(item) =>
          item?.id?.toString() ?? Math.random().toString()
        }
        renderItem={({ item }) => {
          if (!item) return null;
          if (item.type === "2") return <HireCard item={item} />;
          if (item.type === "1") {
            return (
              <MemoizedDetailCard
                item={item}
                type={1}
                subcategories={item.subcategories}
                category={item.categories[0]?.title}
              />
            );
          }
          return null;
        }}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (isFetchingNextPage ? <Loading /> : null)}
      />
    </>
  );
}
