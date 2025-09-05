import { ScrollView, View } from "react-native";
import Banner1 from "@/components/home/Banner1";
import Banner2 from "@/components/home/Banner2";
import Banner3 from "@/components/home/Banner3";
import Banner4 from "@/components/home/Banner4";
import { CategoryList } from "@/components/home/CategorySameList";
import SearchForm from "@/components/home/searchForm";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import { Drawer } from "expo-router/drawer";

export default function TabOneScreen() {
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <Drawer.Screen options={{ title: "okay" }} />

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
