import { useSuspenseQuery } from "@tanstack/react-query";
import { Button, Linking, ScrollView, Text, View } from "react-native";
import Purchases from "react-native-purchases";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import { Loading } from "@/components/ui/Loading";
import { trpc } from "@/lib/trpc";
import PricingCard from "./planItem";
import { usePlanStore } from "./planStore";

export default function PricingPlansComponent() {
  const reverseCurrent = usePlanStore((state) => state.reverseCurrent);
  const { data } = useSuspenseQuery(trpc.planRouter.list.queryOptions());
  const {
    data: offerings,
    error,
    isError,
  } = useSuspenseQuery({
    queryKey: ["fetchOfferings"],
    queryFn: async () => {
      const offering = await Purchases.getOfferings();
      if (
        offering.current !== null &&
        offering.current.availablePackages.length !== 0
      ) {
        return offering;
      }
    },
  });
  if (isError) {
    console.log("error", error);
  }

  // if (loading.current) {
  //   return <ActivityIndicator size="large" />;
  // }

  const TeamOfUse = () => {
    // TODO: change this based on Platform
    Linking.openURL(
      "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/",
    );
  };
  const getPkg = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle === "free") {
      return null;
    }
    return offerings?.all[lowerTitle].availablePackages[0];
  };

  const privacy = () => {
    Linking.openURL("https://justsearch.net.in/privacy");
  };
  return (
    <BoundaryWrapper
      fallback={
        <View className="absolute bg-black opacity-60 inset-0 items-center justify-center">
          <Loading position="center" size="large" />
        </View>
      }
    >
      <ScrollView className="relative">
        {data.plans.map((item, index) => (
          <PricingCard
            key={`${index}-${item.title}`}
            plan={item}
            activePlan={data.activePlan}
            pkg={getPkg(item.title)}
          />
        ))}
        <View className="flex flex-row justify-center items-center gap-4">
          <Button title="Team of Use" onPress={TeamOfUse} />
          <Button title="privacy policy" onPress={privacy} />
        </View>
        <View className="py-10"></View>
      </ScrollView>
    </BoundaryWrapper>
  );
}
