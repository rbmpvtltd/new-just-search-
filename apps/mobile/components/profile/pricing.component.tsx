import PricingCard from "@/components/cards/PricingCard";
import { useFetchAllPlans } from "@/query/getPlans";
import React from "react";
import { ScrollView } from "react-native";

export default function PricingPlansComponent() {
  const { data } = useFetchAllPlans();

  return (
    <ScrollView>
      {data.map((item, index) => (
        <PricingCard key={index} {...item} />
      ))}
    </ScrollView>
  );
}
