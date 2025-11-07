import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import ShopOffersList from "@/components/offerPageCompo/ShopOffers";
import { useShopIdStore } from "@/store/shopIdStore";
import { router, Stack } from "expo-router";
import { Pressable } from "react-native";

function AllOffers() {
  const shopId = useShopIdStore((state) => state.shopId);

  return (
    <BoundaryWrapper>
      <Stack.Screen
        options={{
          title: "Offers",
        }}
      />
      <Pressable
        className="text-secondary text-3xl"
        onPress={() => {
          router.push({
            pathname:
              "/(root)/(home)/subcategory/aboutBusiness/offers/singleOffers/[singleOffer]",
            params: { singleOffer: 36 },
          });
        }}
      >Go To Single Offer</Pressable>
      <ShopOffersList listingId={shopId} />
    </BoundaryWrapper>
  );
}
export default AllOffers;
