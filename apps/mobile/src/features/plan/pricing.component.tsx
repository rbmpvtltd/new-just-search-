import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Linking,
  ScrollView,
  Text,
  View,
} from "react-native";
import Purchases, { type PurchasesOfferings } from "react-native-purchases";
import { trpc } from "@/lib/trpc";
import PricingCard from "./planItem";

export default function PricingPlansComponent() {
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>();
  // const loading = useRef(true);
  const { data } = useSuspenseQuery(trpc.planRouter.list.queryOptions());

  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        const offering = await Purchases.getOfferings();
        if (
          offering.current !== null &&
          offering.current.availablePackages.length !== 0
        ) {
          // loading.current = false;
          setOfferings(offering);
        }
      } catch (error) {
        // TODO:  handle error
        console.error("Error fetching offerings:", error);
      }
    };

    fetchOfferings();
  }, []);

  const getPkg = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle === "free") {
      return null;
    }
    return offerings?.all[lowerTitle].availablePackages[0];
  };

  // if (loading.current) {
  //   return <ActivityIndicator size="large" />;
  // }

  // const TeamOfUse = () => {
  //   // TODO: change this based on Platform
  //   Linking.openURL(
  //     "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/",
  //   );
  // };
  const privacy = () => {
    Linking.openURL("https://justsearch.net.in/privacy");
  };
  return (
    <ScrollView>
      {data.plans.map((item, index) => (
        <PricingCard
          key={`${index}-${item.title}`}
          plan={item}
          activePlan={data.activePlan}
          pkg={getPkg(item.title)}
        />
      ))}
      <View className="flex flex-row justify-center items-center">
        {/* <Button title="Team of Use" onPress={TeamOfUse} /> */}
        <Text className="text-secondary">-</Text>
        <Button title="privacy policy" onPress={privacy} />
      </View>
      <View className="py-10"></View>
    </ScrollView>
  );
}
