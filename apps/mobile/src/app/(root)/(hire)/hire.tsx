// import { useInfiniteQuery } from "@tanstack/react-query";
// import { FlatList, Text, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import HireSearchForm from "@/features/hire/show/hireSearchForm";
// import HireCard from "@/features/hire/show/HireCard";
// import { Loading } from "@/components/ui/Loading";
// import { trpc } from "@/lib/trpc";
// import { useHireList } from "@/query/hireListing";

// export default function HireListScreen() {
//   const {
//     data,
//     isError,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//   } = useInfiniteQuery(
//     trpc.hirerouter.MobileAllHireLising.infiniteQueryOptions(
//       {
//         cursor: 0,
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
//   if (isError) {
//     return (
//       <View className="flex-1 items-center justify-center">
//         <Text className="bg-base-100 text-secondary">{error.message}</Text>
//       </View>
//     );
//   }

//   const allData = data?.pages.flatMap((page) => page?.data || []) || [];

import type { Hit as AlgoliaHit } from "instantsearch.js";
import { useState } from "react";
import { Configure, InstantSearch } from "react-instantsearch-core";
//   return (
//     <SafeAreaView className="flex-1">
//       <View>
//         <View className="">
//           <HireSearchForm />
//         </View>
//         <FlatList
//           className="mt-1"
//           data={allData}
//           keyExtractor={(_, index) => index.toString()}
//           renderItem={({ item }) => {
//             if (!item)
//               return (
//                 <View className="flex-1 items-center justify-center">
//                   <Text className="bg-secondary text-secondary-100">
//                     item not found
//                   </Text>
//                 </View>
//               );
//             return <HireCard item={item} />;
//           }}
//           onEndReached={() => {
//             if (hasNextPage && !isFetchingNextPage) {
//               fetchNextPage();
//             }
//           }}
//           onEndReachedThreshold={0.5}
//           ListFooterComponent={() => (isFetchingNextPage ? <Loading /> : null)}
//         />
//       </View>
//     </SafeAreaView>
//   );
// }
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InfiniteHits } from "@/components/home/InfiniteHits";
import { SearchBox } from "@/components/home/SearchBox";
import HireCard from "@/features/hire/show/HireCard";
import { HireFilters } from "@/features/hire/show/HireFilter";
import { searchClient } from "@/lib/algoliaClient";

// Type definition for Hire Listing data - extends Algolia Hit
export interface HireListingHitType extends AlgoliaHit {
  objectID: string;
  name: string;
  category: string;
  expectedSalary: number;
  gender: string;
  jobType: string[];
  languages: string[];
  subcategories: string[];
  workExp: number;
  workShift: string[];
  photo: string | null;
  area: string;
  longitude: string;
  latitude: string;
  buildingName: string;
  city: string;
  state: string;
  phoneNumber: string | null;
  _geoloc: {
    lat: number;
    lng: number;
  };
}

export default function HireListScreen() {
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      {/* <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      > */}
      <View className="flex-1">
        <InstantSearch searchClient={searchClient} indexName="hire_listing">
          <Configure hitsPerPage={10} />
          <SearchBox />
          <HireFilters
            isDrawerOpen={isModalOpen}
            onToggleDrawer={() => setModalOpen((isOpen) => !isOpen)}
            // onChange={scrollToTop}
          />
          <InfiniteHits<HireListingHitType>
            showOnlyOnSearch={false}
            hitComponent={HireHitCard}
          />
        </InstantSearch>
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}

// Hit component using HireCard
function HireHitCard({ hit }: { hit: HireListingHitType }) {
  return <HireCard item={hit} />;
}

// function Hit({ hit }: { hit: any }) {
//   return (
//     <View className="px-4">
//       <Pressable
//         onPress={() => {
//           console.log("clicked on", hit.objectID);
//           router.push(
//             `/(root)/(home)/subcategory/aboutBusiness/${hit.objectID}`,
//           );
//         }}
//       >
//         <Text className="text-lg text-secondary-content">{hit.name}</Text>
//       </Pressable>
//     </View>
//   );
// }
