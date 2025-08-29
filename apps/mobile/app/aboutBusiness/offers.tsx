import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import ShopOffersList from "@/components/offerPageCompo/ShopOffers";
import { useShopIdStore } from "@/store/shopIdStore";

function AllOffers() {
  const shopId = useShopIdStore((state) => state.shopId);

  return (
    <BoundaryWrapper>
      <ShopOffersList listingId={shopId} />
    </BoundaryWrapper>
  );
}
export default AllOffers;
