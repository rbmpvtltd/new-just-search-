import { Ionicons } from "@expo/vector-icons";
import { Alert, Text, useColorScheme, View,Pressable } from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { queryClient } from "@/lib/trpc";
import Colors from "@/constants/Colors";
import type { OutputTrpcType, UnwrapArray } from "@/lib/trpc";

type PlanArray = OutputTrpcType["planRouter"]["list"];
type Plan = UnwrapArray<PlanArray>;
export default function PricingCard({ plan }: { plan: Plan }) {
  const colorScheme = useColorScheme();
  return (
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
        {plan.status && (
          <View className="absolute top-2 right-4 bg-accent rounded-full px-3 py-1">
            <Text className="text-xs font-bold text-secondary">ACTIVE</Text>
          </View>
        )}
      </View>

      <View className="py-5 items-center border-b border-base-300">
        <Text className="text-3xl font-bold text-secondary">
          ₹{plan.amount} + GST / year
        </Text>
      </View>

      <View className="p-5 gap-4">
        {plan.attribute.map((feature, index) => {
          return (
            <View className="flex-row items-start gap-3" key={index.toString()}>
              <Ionicons
                name={feature.isAvailable ? "checkmark-circle" : "close-circle"}
                size={22}
                color={feature.isAvailable ? "#10B981" : "#EF4444"}
                className="mt-0.5"
              />
              <Text className="text-secondary flex-1">{feature.name}</Text>
            </View>
          );
        })}
      </View>

      <View className="px-5 pb-5">
        <Pressable
          style={{
            backgroundColor: plan.status
              ? Colors[colorScheme ?? "light"]["base-100"]
              : plan.planColor,
            borderRadius: 100,
            paddingVertical: 12,
            alignItems: "center",
            justifyContent: "center",
          }}
          className={`rounded-full py-3 items-center justify-center bg-base-300`}
          disabled={plan.status}
          onPress={() => {}}
        >
          <Text className={`font-semibold text-lg text-secondary `}>
            {plan.status ? "Current Plan" : `Get ${plan.title}`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
