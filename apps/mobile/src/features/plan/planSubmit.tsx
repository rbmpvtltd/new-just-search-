import type { UserRole } from "@repo/db";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { Alert, Modal, Pressable, Text, View } from "react-native";
import Purchases, { type PurchasesPackage } from "react-native-purchases";
import { Loading } from "@/components/ui/Loading";
import { queryClient, trpc } from "@/lib/trpc";
import { setTokenRole } from "@/utils/secureStore";
import { useAuthStore } from "../auth/authStore";
import { usePlanStore } from "./planStore";

export const PlanSubmit = ({ pkg }: { pkg: PurchasesPackage }) => {
  console.log("submition is started");
  const reverseCurrent = usePlanStore((state) => state.reverseCurrent);
  const { data, isError, isFetched } = useSuspenseQuery({
    queryKey: ["purchasing"],
    queryFn: async () => {
      const { customerInfo, productIdentifier } =
        await Purchases.purchasePackage(pkg);
      if (
        typeof customerInfo.entitlements.active[productIdentifier] !==
        "undefined"
      ) {
        return true;
      } else {
        return false;
      }
    },
  });

  if (isError || !data) {
    Alert.alert("Verification Failed");
    reverseCurrent(false);
    return null;
  }

  if (isFetched && data) {
    return <SubscriptionEventComponent />;
  }

  return (
    <View className="absolute bg-black opacity-60 inset-0 items-center justify-center">
      <Loading position="center" size="large" />
    </View>
  );
};

const SubscriptionEventComponent = () => {
  const currentPlan = usePlanStore((state) => state.activePlan);
  const setToken = useAuthStore((state) => state.setToken);
  const token = useAuthStore((state) => state.token);
  const { data: paymentVerify, isLoading } = useQuery(
    trpc.subscriptionRouter.verifyPayment.queryOptions(
      {
        planId: currentPlan.id,
      },
      {
        refetchInterval: 1000,
      },
    ),
  );

  if (isLoading) {
    return (
      <View className="absolute bg-black opacity-60 inset-0 items-center justify-center">
        <Loading position="center" size="large" />
      </View>
    );
  }

  if (paymentVerify?.success) {
    setToken(token, paymentVerify?.role ?? "visiter");
    queryClient.invalidateQueries({
      queryKey: trpc.planRouter.list.queryKey(),
    });
    return (
      <SuccessPaymentComponent
        token={token ?? ""}
        role={paymentVerify?.role ?? "visiter"}
      />
    );
  }
  return (
    <View className="absolute bg-black opacity-60 inset-0 items-center justify-center">
      <Text className="text-secondary">Waiting for responet</Text>
      <Loading position="center" size="large" />
    </View>
  );
};

const SuccessPaymentComponent = ({
  token,
  role,
}: {
  token: string;
  role: UserRole;
}) => {
  const reverseCurrent = usePlanStore((state) => state.reverseCurrent);
  const { isLoading, isError } = useQuery({
    queryKey: ["setTokenRole"],
    queryFn: async () => {
      await setTokenRole(token ?? "", role ?? "visiter");
      return true;
    },
  });

  if (isLoading || isError) return null;

  return (
    <View style={{ flex: 1 }}>
      <Modal visible={true} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 12,
              width: "85%",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Payment Done
            </Text>

            <View style={{ marginTop: 20 }}>
              <Pressable
                style={{
                  backgroundColor: "#2563eb",
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
                onPress={() => {
                  reverseCurrent(false);
                }}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  Okay
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
