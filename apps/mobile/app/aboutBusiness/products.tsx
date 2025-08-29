import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import ListingProduct from "@/components/ui/ListingProducts";
import { useShopIdStore } from "@/store/shopIdStore";

export default function TabOneScreen() {
  const shopId = useShopIdStore((state) => state.shopId);
  return (
    <BoundaryWrapper>
      <ListingProduct shopId={shopId} />
    </BoundaryWrapper>
  );
}
