import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import ShopOffersList from "@/features/offer/show/ShopOffers";
import { useShopIdStore } from "@/store/shopIdStore";
import { Stack } from "expo-router";

function AllOffers() {
  const shopId = useShopIdStore((state) => state.shopId);

  return (
    <BoundaryWrapper>
      {/* <Stack.Screen
        options={{
          title: "Offers",
        }}
      /> */}
      <ShopOffersList listingId={shopId} />
    </BoundaryWrapper>
  );
}
export default AllOffers;
