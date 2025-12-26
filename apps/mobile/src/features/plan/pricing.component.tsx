import { useSuspenseQuery } from "@tanstack/react-query";
import { Button, Linking, ScrollView, Text, View } from "react-native";
import Purchases from "react-native-purchases";
import { trpc } from "@/lib/trpc";
import PricingCard from "./planItem";
import { usePlanStore } from "./planStore";

export default function PricingPlansComponent() {
  const setOfferings = usePlanStore((state) => state.setOfferings);
  const { data } = useSuspenseQuery(trpc.planRouter.list.queryOptions());
  const { error, isError } = useSuspenseQuery({
    queryKey: ["fetchOfferings"],
    queryFn: async () => {
      const offering = await Purchases.getOfferings();
      if (
        offering.current !== null &&
        offering.current.availablePackages.length !== 0
      ) {
        setOfferings(offering);
      }
    },
  });
  if (isError) {
    console.log("error", error);
  }

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
    <ScrollView className="relative">
      {data.plans.map((item, index) => (
        <PricingCard
          key={`${index}-${item.title}`}
          plan={item}
          activePlan={data.activePlan}
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
