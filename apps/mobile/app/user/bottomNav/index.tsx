import { ScrollView, View } from "react-native";
import Banner1 from "@/components/home/Banner1";
import Banner2 from "@/components/home/Banner2";
import Banner3 from "@/components/home/Banner3";
import Banner4 from "@/components/home/Banner4";
import { CategoryList } from "@/components/home/CategorySameList";
import SearchForm from "@/components/home/searchForm";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import { bannersFirst } from "@/query/trpc/banner";

async function Banners() {
  const firstBanner = await bannersFirst();
  console.log("banner in banner fn",firstBanner)
  return firstBanner;
}

export default function TabOneScreen() {
  const data = Banners();
  console.log("==============data from trpc============",data)
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View className="flex items-center r rounded-4xl">
        <Banner1 />
        <SearchForm />
        <Banner4 />
        <BoundaryWrapper>
          <CategoryList />
        </BoundaryWrapper>
        <Banner2 />
        <Banner3 />
      </View>
    </ScrollView>
  );
}
