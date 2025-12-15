import { useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useEffect } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomCarousel from "@/components/Carousel/CustomCaraousel";
import Banner1 from "@/features/home/show/Banner1";
import Banner2 from "@/features/home/show/Banner2";
import Banner3 from "@/features/home/show/Banner3";
import Banner4 from "@/features/home/show/Banner4";
import { CategoryList } from "@/features/home/show/CategorySameList";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import { Loading } from "@/components/ui/Loading";
import { trpc } from "@/lib/trpc";
import { searchClient } from "@/lib/algoliaClient";
import {
  InstantSearch,
  Index,
  useHits,
  Configure,
} from "react-instantsearch-core";
import { SearchBox } from "@/components/home/SearchBox";
import { InfiniteHits } from "@/components/home/InfiniteHits";
import { router } from "expo-router";
// import Banner1 from "@/components/home/Banner1";
// import Banner2 from "@/components/home/Banner2";
// import Banner3 from "@/components/home/Banner3";
// import Banner4 from "@/components/home/Banner4";
// import { CategoryList } from "@/components/home/CategorySameList";
// import BoundaryWrapper from "@/components/layout/BoundaryWrapper";

// async function Banners() {
//   const firstBanner = await bannersFirst();
//   console.log("banner in banner fn",firstBanner)
//   return firstBanner;
// }

export default function TabOneScreen() {
  // const data = Banners();
  // console.log("==============data from trpc============",data)
  //
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View className="flex items-center r rounded-4xl">
        <CustomCarousel />

        {/* <Banner1 /> */}
        {/* <Banner1 />
        
        <Banner1 />
    //     <Banner1 /> */}

        <InstantSearch searchClient={searchClient} indexName="business_listing">
          <SearchBox />
          <Configure hitsPerPage={5} />
          <InfiniteHits hitComponent={Hit} />
          {/* <Index indexName="business_listing">
            <InfiniteHits hitComponent={BusinessListing} />

          </Index>

          <Index indexName="hire_listing">
            <InfiniteHits hitComponent={HireListing} />

          </Index> */}
        </InstantSearch>
        <BoundaryWrapper>
          <CategoryList />
        </BoundaryWrapper>
        {/* <CustomCarousel /> */}
        {/* <BoundaryWrapper> */}
        {/*   <CategoryList /> */}
        {/* </BoundaryWrapper> */}
        {/* <BoundaryWrapper> */}
        {/*   <CategoryList /> */}
        {/* </BoundaryWrapper> */}
        {/* <BoundaryWrapper> */}
        {/*   <CategoryList /> */}
        {/* </BoundaryWrapper> */}
        {/* <CustomCarousel /> */}
        {/* <BoundaryWrapper> */}
        {/*   <CategoryList /> */}
        {/* </BoundaryWrapper> */}
        {/* <CustomCarousel /> */}
        {/* <CustomCarousel /> */}
        <CustomCarousel />
        <CustomCarousel />
        <CustomCarousel />
        {/* <Banner3 /> */}
        {/* <Banner2 /> */}
        {/* <Banner4 /> */}
      </View>
    </ScrollView>
  );
}

function Hit({ hit }: { hit: any }) {
  return (
    <View className="px-4">
      <Pressable
        onPress={() => {
          console.log("clicked on", hit.objectID);
          router.push(
            `/(root)/(home)/subcategory/aboutBusiness/${hit.objectID}`,
          );
        }}
      >
        <Text className="text-lg text-secondary-content">{hit.name}</Text>
      </Pressable>
    </View>
  );
}

function BusinessListing() {
  const { hits } = useHits();
  return hits.map((hit) => <Text key={hit.objectID}>{hit.name}</Text>);
}

function HireListing() {
  const { hits } = useHits();
  return hits.map((hit) => <Text key={hit.objectID}>{hit.name}</Text>);
}
