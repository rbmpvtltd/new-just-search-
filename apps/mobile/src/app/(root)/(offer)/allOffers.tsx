import { SafeAreaView } from "react-native-safe-area-context";
import OfferSearchForm from "@/features/offer/show/offerSearchForm";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import OffersList from "@/features/offer/show/OffersList";
import type { Hit as AlgoliaHit } from "instantsearch.js";
import { View } from "react-native";
import { Configure, InstantSearch } from "react-instantsearch-core";
import { searchClient } from "@/lib/algoliaClient";
import { SearchBox } from "@/components/home/SearchBox";
import { InfiniteHits } from "@/components/home/InfiniteHits";
import { OfferProductFilters } from "@/features/offer/show/OfferFilter";
import { useState } from "react";

export interface OfferProductHitType extends AlgoliaHit {
  objectID: string;
  name: string;
  discountPercent: number;
  category: string;
  finalPrice: number;
  price: number;
  subcategories: string[];
  navigationId: number;
  photo: string[];
  businessId: number;
}

function AllOffers() {
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <SafeAreaView className="flex-1">
      <View className="-mb-14 flex-1">
        <InstantSearch
          searchClient={searchClient}
          indexName="product_offer_listing"
        >
          <Configure hitsPerPage={10} />
          <SearchBox />
          <OfferProductFilters
            isDrawerOpen={isModalOpen}
            onToggleDrawer={() => setModalOpen((isOpen) => !isOpen)}
            // onChange={scrollToTop}
          />
          <InfiniteHits<OfferProductHitType>
            showOnlyOnSearch={false}
            hitComponent={OfferProductHitCard}
          />
        </InstantSearch>
      </View>
    </SafeAreaView>
  );
}

function OfferProductHitCard({ hit }: { hit: OfferProductHitType }) {
  return <OffersList item={hit} />;
}

export default AllOffers;
