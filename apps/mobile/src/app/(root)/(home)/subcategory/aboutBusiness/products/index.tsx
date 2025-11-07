import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import ListingProduct from "@/components/ui/ListingProducts";
import { useShopIdStore } from "@/store/shopIdStore";
import { Stack } from "expo-router";

export default function TabOneScreen() {
  const shopId = useShopIdStore((state) => state.shopId);
  return (
    <BoundaryWrapper>
      <Stack.Screen options={{
        title : "Products"
      }}/>
      <ListingProduct shopId={shopId} />
    </BoundaryWrapper>
  );
}
