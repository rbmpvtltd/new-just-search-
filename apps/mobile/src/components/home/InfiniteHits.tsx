// import React from "react";
// import { StyleSheet, View, FlatList, Text } from "react-native";
// import { useInfiniteHits, useSearchBox, type UseInfiniteHitsProps } from "react-instantsearch-core";
// import type { Hit as AlgoliaHit } from "instantsearch.js";

// interface InfiniteHitsProps<THit> extends UseInfiniteHitsProps {
//   hitComponent: React.ComponentType<{ hit: THit }>;
//   hitsPerPage?: number;
//   showOnlyOnSearch?: boolean;
// }

// export function InfiniteHits<THit extends AlgoliaHit = AlgoliaHit>({
//   hitComponent: Hit,
//   hitsPerPage = 5,
//   showOnlyOnSearch = true,
//   ...props
// }: InfiniteHitsProps<THit>) {
//   const { items, isLastPage, showMore } = useInfiniteHits({
//     ...props,
//     escapeHTML: false,
//   });

//   const { query } = useSearchBox();

//   // Don't show results if showOnlyOnSearch is true and query is empty
//   if (showOnlyOnSearch && !query.trim()) {
//     return (
//       <View>
//         <Text className="text-gray-400 py-2">Start typing to search...</Text>
//       </View>
//     );
//   }

//   // Limit the displayed items to hitsPerPage
//   const displayedItems = items.slice(0, hitsPerPage);

//   return (
//     <FlatList
//       data={displayedItems}
//       keyExtractor={(item) => item.objectID}
//       ItemSeparatorComponent={() => <View className="border-b-2 border-secondary"/>}
//       onEndReached={() => {
//         if (!isLastPage && items.length < hitsPerPage) {
//           showMore();
//         }
//       }}
//       renderItem={({ item }) => (
//         <View className="py-2">
//           <Hit hit={item as THit} />
//         </View>
//       )}
//       ListEmptyComponent={() => (
//         <View >
//           <Text>No results found</Text>
//         </View>
//       )}
//       className="w-full bg-base-200  px-6 py-6"
//     />
//   );
// }

// const styles = StyleSheet.create({

// });
import React from "react";
import { View, FlatList, Text, ActivityIndicator } from "react-native";
import {
  useInfiniteHits,
  useSearchBox,
  type UseInfiniteHitsProps,
} from "react-instantsearch-core";
import type { Hit as AlgoliaHit } from "instantsearch.js";
import { Loading } from "@/components/ui/Loading";

interface InfiniteHitsProps<THit> extends UseInfiniteHitsProps {
  hitComponent: React.ComponentType<{ hit: THit }>;
  showOnlyOnSearch?: boolean;
}

export function InfiniteHits<THit extends AlgoliaHit = AlgoliaHit>({
  hitComponent: Hit,
  showOnlyOnSearch = true,
  ...props
}: InfiniteHitsProps<THit>) {
  const { items, isLastPage, showMore } = useInfiniteHits({
    ...props,
    escapeHTML: false,
  });

  const { query } = useSearchBox();

  // Don't show results if showOnlyOnSearch is true and query is empty
  if (showOnlyOnSearch && !query.trim()) {
    return (
      <View className="p-4">
        <Text className="text-gray-400 py-2 text-center">
          Start typing to search...
        </Text>
      </View>
    );
  }

  const handleLoadMore = () => {
    if (!isLastPage) {
      showMore();
    }
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.objectID}
      ItemSeparatorComponent={() => <View className="h-2" />}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      renderItem={({ item }) => {
        return (
          <View>
            <Hit hit={item as THit} />
          </View>
        );
      }}
      ListEmptyComponent={() => (
        <View className="flex-1">
          <Loading position="center" />
        </View>
      )}
      ListFooterComponent={() =>
        !isLastPage ? (
          <View className="py-4">
            <Loading />
          </View>
        ) : null
      }
      className="w-full"
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
    />
  );
}
