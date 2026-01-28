import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, Text, useColorScheme, View } from "react-native";
import type { PurchasesPackage } from "react-native-purchases";
import { SafeAreaView } from "react-native-safe-area-context";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/features/auth/authStore";
import type { OutputTrpcType, UnwrapArray } from "@/lib/trpc";
import { usePlanStore } from "./planStore";
import { PlanSubmit } from "./planSubmit";

type PlanArray = OutputTrpcType["planRouter"]["list"]["plans"];
type ActivePlan = OutputTrpcType["planRouter"]["list"]["activePlan"];
type Plan = UnwrapArray<PlanArray>;
export default function PricingCard({
  plan,
  activePlan,
  pkg,
}: {
  plan: Plan;
  activePlan: ActivePlan;
  pkg: PurchasesPackage | null | undefined;
}) {
  const colorScheme = useColorScheme();
  const authenticated = useAuthStore((state) => state.authenticated);

  const storePlan = usePlanStore((state) => state.activePlan);
  const setNewStore = usePlanStore((state) => state.setNew);
  const currentRole = useAuthStore((state) => state.role);
  const showBtn = currentRole === plan.role || currentRole === "visitor";
  const buttonDisable =
    (plan.role === "all" || !showBtn) && activePlan.isactive;

  if (storePlan.id === plan.id && storePlan.active && pkg) {
    console.log("loading is", storePlan);
    return (
      <BoundaryWrapper>
        <PlanSubmit pkg={pkg} />
      </BoundaryWrapper>
    );
  }

  return (
    <SafeAreaView>
      <View
        className={`bg-base-200 rounded-3xl shadow-lg m-4 overflow-hidden w `}
      >
        <View
          style={{ backgroundColor: plan.planColor }}
          className="py-5 rounded-t-3xl items-center relative"
        >
          <Text className={`text-2xl font-bold text-secondary`}>
            {plan.title}
          </Text>
          {plan.id === activePlan.planid && (
            <View className="absolute top-2 right-4 bg-accent rounded-full px-3 py-1">
              <Text className="text-xs font-bold text-secondary">ACTIVE</Text>
            </View>
          )}
        </View>

        <View className="py-5 items-center border-b border-base-300">
          <Text className="text-3xl font-bold text-secondary">
            {plan.title !== "Free" ? (
              <>₹{pkg?.product.price} / year</>
            ) : (
              <>₹0 / year</>
            )}
          </Text>
        </View>

        <View className="p-5 gap-4">
          {plan.attribute.map((feature) => {
            return (
              <View
                className="flex-row items-start gap-3"
                key={`${feature.name}`}
              >
                <Ionicons
                  name={
                    feature.isAvailable ? "checkmark-circle" : "close-circle"
                  }
                  size={22}
                  color={feature.isAvailable ? "#10B981" : "#EF4444"}
                  className="mt-0.5"
                />
                <Text className="text-secondary flex-1">{feature.name}</Text>
              </View>
            );
          })}
        </View>

        <View className="px-5 pb-5 bg-base-300">
          <Pressable
            style={{
              // backgroundColor: buttonDisable ? "black" : "white",
              backgroundColor:
                plan.id === activePlan.planid
                  ? Colors[colorScheme ?? "light"]["base-100"]
                  : plan.planColor,
              borderRadius: 100,
              opacity: buttonDisable ? 0.1 : 1,
              paddingVertical: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
            className={`rounded-full py-3 items-center justify-center bg-base-300`}
            disabled={buttonDisable}
            onPress={() => {
              if (!authenticated) {
                return Alert.alert("Please login to continue");
              }
              setNewStore(plan.id, true);
            }}
          >
            <Text className={`font-semibold text-lg text-secondary `}>
              {plan.id === activePlan.planid
                ? "Current Plan"
                : `Get ${plan.title}`}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
