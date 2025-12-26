import { useSubscription } from "@trpc/tanstack-react-query";
import { Alert, View } from "react-native";
import Purchases, { type PurchasesPackage } from "react-native-purchases";
import { Loading } from "@/components/ui/Loading";
import { queryClient, trpc } from "@/lib/trpc";
import { usePlanStore } from "./planStore";

export const planSubmit = () => {
  const activeOffering = usePlanStore((state) => state.activeOffering);
  const offerings = usePlanStore((state) => state.offerings);
  const loading = usePlanStore((state) => state.loading);
  const setLoading = usePlanStore((state) => state.setLoading);
  const { data: paymentVerify } = useSubscription(
    trpc.subscriptionRouter.verifyPayement.subscriptionOptions(),
  );
  console.log("Payment verify emit", paymentVerify);

  const getPkg = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle === "free") {
      return null;
    }
    return offerings?.all[lowerTitle].availablePackages[0];
  };

  const pkg = getPkg(activeOffering || "");
  if (pkg) {
    Purchases.purchasePackage(pkg);
  }

  const handleSubscribe = async (pkg: PurchasesPackage | null | undefined) => {
    setLoading(true);
    if (!pkg) {
      setLoading(false);
      return;
    }
    try {
      const { customerInfo, productIdentifier, transaction } =
        await Purchases.purchasePackage(pkg);
      if (
        typeof customerInfo.entitlements.active[productIdentifier] !==
        "undefined"
      ) {
        console.log("payment done");
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  if (paymentVerify) {
    queryClient.invalidateQueries({
      queryKey: trpc.planRouter.list.queryKey(),
    });
    Alert.alert("Payment Successfull", "Your plan has been activated");
    setLoading(false);
  }

  if (loading) {
    return (
      <View className="absolute bg-black opacity-60 inset-0 items-center justify-center">
        <Loading position="center" size="large" />
      </View>
    );
  }

  return <div></div>;
};
