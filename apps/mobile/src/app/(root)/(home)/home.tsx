import { Loading } from "@/components/ui/Loading";
import { trpc} from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, Text, View } from "react-native";
// import Banner1 from "@/components/home/Banner1";
// import Banner2 from "@/components/home/Banner2";
// import Banner3 from "@/components/home/Banner3";
// import Banner4 from "@/components/home/Banner4";
// import { CategoryList } from "@/components/home/CategorySameList";
// import SearchForm from "@/components/home/searchForm";
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
  // const trpc = useTRPC();
  const { data, isLoading, error }  = useQuery(trpc.hi.hi2.queryOptions());
  if (isLoading) {
    <Loading position="center" />;
  }
  console.log(data)
  if (error) {
    console.log(error)
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="bg-base-100 text-secondary">{error.message}</Text>
      </View>
    )
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View className="flex items-center r rounded-4xl">
        <Text className="text-secondary">hi</Text>
        <Text className="text-secondary">{data?.itemid}</Text>

        {/* <Banner1 /> */}
        {/* <SearchForm /> */}
        {/* <Banner4 /> */}
        {/* <BoundaryWrapper> */}
        {/*   <CategoryList /> */}
        {/* </BoundaryWrapper> */}
        {/* <Banner2 /> */}
        {/* <Banner3 /> */}
      </View>
    </ScrollView>
  );
}
