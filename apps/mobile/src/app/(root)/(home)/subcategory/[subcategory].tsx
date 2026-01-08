// import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
// import { Stack, useLocalSearchParams } from "expo-router";
// import { FlatList, Text, TouchableOpacity, View } from "react-native";
// import { MemoizedDetailCard } from "@/features/business/show/DetailCard";
// import HireCard from "@/features/hire/show/HireCard";
// import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
// import DataNotFound from "@/components/ui/DataNotFound";
// import { Loading } from "@/components/ui/Loading";
// import { trpc } from "@/lib/trpc";

// export default function SubCategory() {
//   const { subcategory, type } = useLocalSearchParams();
//   const subcategoryParam = Number(
//     Array.isArray(subcategory) ? subcategory[0] : subcategory,
//   );

//   console.log(subcategoryParam);
//   const {
//     data,
//     isError,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//   } = useInfiniteQuery(
//     trpc.subcategoryRouter.businessesByCategoryInfinate.infiniteQueryOptions(
//       {
//         cursor: 0,
//         categoryId: subcategoryParam,
//         limit: 10,
//       },
//       {
//         getNextPageParam: (data) => data.nextCursor,
//       },
//     ),
//   );

//   if (isLoading) {
//     return <Loading position="center" />;
//   }

//   if (!data?.pages[0].data || data?.pages[0]?.data?.length === 0) {
//     return <DataNotFound />;
//   }

//   if (isError) {
//     return (
//       <View className="flex-1 items-center justify-center">
//         <Text className="bg-secondary text-secondary-100">{error.message}</Text>
//       </View>
//     );
//   }

//   const subcategoryData = data?.pages.flatMap((page) => page?.data || []) || [];
//   const title = subcategoryData[0].category;

//   return (
//     <BoundaryWrapper>
//       <Stack.Screen
//         options={{
//           title: title ?? "",
//           headerShown: true,
//         }}
//       />
//       <FlatList
//         className="bg-base-100  flex-1"
//         data={subcategoryData}
//         keyExtractor={(item) => item.id.toString()}
//         initialNumToRender={5}
//         maxToRenderPerBatch={5}
//         windowSize={5}
//         renderItem={({ item }) => {
//           return Number(type) === 1 ? (
//             <MemoizedDetailCard
//               type={1}
//               item={item}
//               category={item?.category || ""}
//               subcategories={item?.subcategories}
//             />
//           ) : (
//             // <HireCard item={item} />\
//             <Text className="text-secondary">Hire Card Here</Text>
//           );
//         }}
//         onEndReached={() => {
//           if (hasNextPage && !isFetchingNextPage) {
//             fetchNextPage();
//           }
//         }}
//         onEndReachedThreshold={0.5}
//         ListFooterComponent={() => (isFetchingNextPage ? <Loading /> : null)}
//       />
//     </BoundaryWrapper>
//   );
// }

import { Stack, useLocalSearchParams } from "expo-router";
import type { Hit as AlgoliaHit } from "instantsearch.js";
import { useEffect, useState } from "react";
import { Configure, InstantSearch } from "react-instantsearch-core";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InfiniteHits } from "@/components/home/InfiniteHits";
import { SearchBox } from "@/components/home/SearchBox";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import { MemoizedDetailCard } from "@/features/business/show/DetailCard";
import { SubcategoryFilters } from "@/features/business/show/SubcategoryFilter";
import HireCard from "@/features/hire/show/HireCard";
import { searchClient } from "@/lib/algoliaClient";

export interface SubcategoryHitType extends AlgoliaHit {
  objectID: string;
  name: string;
  category: string;
  categoryId: number | null;
  expectedSalary: number | null;
  gender: string | null;
  jobType: string[] | null;
  languages: string[] | null;
  rating: number | null;
  subcategories: string[];
  workExp: number | null;
  workShift: string[] | null;
  listingType: "business" | "hire" | string;
  photo: string | null;
  area: string | null;
  longitude: string;
  latitude: string;

  buildingName: string | null;

  city: string | null;
  state: string | null;

  phoneNumber: string;

  streetName: string | null;

  _geoloc: {
    lat: number;
    lng: number;
  };
}

export default function SubCategory() {
  const { subcategory, type } = useLocalSearchParams();
  const subcategoryParam = Number(
    Array.isArray(subcategory) ? subcategory[0] : subcategory,
  );
  const typeParam = Number(Array.isArray(type) ? type[0] : type);

  const [title, setTitle] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  // Build the filter string for Algolia based on categoryId
  const filters = `categoryId:${subcategoryParam}`;

  return (
    <BoundaryWrapper>
      {/* <Stack.Screen
        options={{
          title: title || "Subcategory",
          headerShown: false,
        }}
      /> */}
      <SafeAreaView className="flex-1">
        <View className="-mb-14 flex-1">
          <View className="flex-1">
            <InstantSearch
              searchClient={searchClient}
              indexName="all_listing"
            >
              <Configure hitsPerPage={10} filters={filters} />
              <SearchBox placeholder={`Search Anything In ${title}`} />

              <SubcategoryFilters
                isDrawerOpen={isModalOpen}
                onToggleDrawer={() => setModalOpen((isOpen) => !isOpen)}
              />

              <InfiniteHits<SubcategoryHitType>
                showOnlyOnSearch={false}
                hitComponent={({ hit }) => (
                  <SubcategoryHitCard
                    hit={hit}
                    type={typeParam}
                    onTitleExtract={setTitle}
                  />
                )}
              />
            </InstantSearch>
          </View>
        </View>
      </SafeAreaView>
    </BoundaryWrapper>
  );
}

interface SubcategoryHitCardProps {
  hit: SubcategoryHitType;
  type: number;
  onTitleExtract: (title: string) => void;
}

function SubcategoryHitCard({
  hit,
  type,
  onTitleExtract,
}: SubcategoryHitCardProps) {
  // Extract title from first hit
  useEffect(() => {
    if (hit.category) {
      onTitleExtract(hit.category);
    }
  }, [hit.category, onTitleExtract]);

  return hit.listingType === "business" ? (
    <MemoizedDetailCard type={1} item={hit} />
  ) : (
    // <HireCard item={hit} />
    <HireCard item={hit} />
  );
}
