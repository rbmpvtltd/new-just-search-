import { SafeAreaView } from "react-native-safe-area-context";
import OfferSearchForm from "@/components/forms/offerSearchForm";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import OffersList from "@/components/offerPageCompo/OffersList";

function AllOffers() {
  return (
    <SafeAreaView className="flex-1">
      <BoundaryWrapper>
        <OfferSearchForm />
        <OffersList />
      </BoundaryWrapper>
    </SafeAreaView>
  );
}

export default AllOffers;
