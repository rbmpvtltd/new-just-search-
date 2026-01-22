import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PricingPlan {
  id: number;
  title: string;
  amount: number;
  attribute: { name: string; isAvailable: boolean }[];
  planColor: string;
}
const plans = [
  {
    id: 1,
    title: "FREE",
    amount: 0,
    attribute: [
      { name: "BUSINESS LISTING", isAvailable: true },
      { name: "HIRE PROFILE", isAvailable: true },
      { name: "PRODUCT LISTING", isAvailable: false },
      { name: "OFFER LISTING", isAvailable: false },
      { name: "VERIFICATION BADGE", isAvailable: false },
    ],
    planColor: "#ff3131",
  },
  {
    id: 2,
    title: "PRO",
    amount: 2199,
    attribute: [
      { name: "BUSINESS LISTING", isAvailable: true },
      { name: "VERIFICATION BADGE", isAvailable: true },
      { name: "30 PRODUCTS LISTING", isAvailable: true },
      {
        name: "15 OFFERS LISTING/MONTH(EACH OFFER VALID FOR 3 DAYS)",
        isAvailable: true,
      },
    ],
    planColor: "#ffbd59",
  },
  {
    id: 3,
    title: "ULTRA",
    amount: 2999,
    attribute: [
      { name: "BUSINESS LISTING", isAvailable: true },
      { name: "VERIFICATION BADGE", isAvailable: true },
      { name: "80 PRODUCTS LISTING", isAvailable: true },
      {
        name: "40 OFFERS LISTING/MONTH(EACH OFFER VALID FOR 5 DAYS)",
        isAvailable: true,
      },
    ],
    planColor: "#7ed957",
  },
  {
    id: 4,
    title: "HIRE",
    amount: 399,
    attribute: [
      { name: "HIRE PROFILE", isAvailable: true },
      { name: "VERIFICATION BADGE", isAvailable: true },
    ],
    planColor: "#38b6ff",
  },
];
export default function FakePricingPlans() {
  return (
    <ScrollView>
      {plans.map((plan) => (
        <PricingCard key={plan.id} plan={plan} />
      ))}
    </ScrollView>
  );
}

function PricingCard({ plan }: { plan: PricingPlan }) {
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
        </View>

        <View className="py-5 items-center border-b border-base-300">
          <Text className="text-3xl font-bold text-secondary">
            {plan.amount} {plan?.amount > 0 && "+ GST / year"}
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

        <View className="px-5 p-5 bg-base-300">
          <Pressable
            style={{
              backgroundColor: plan.planColor,
              borderRadius: 100,
              paddingVertical: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
            className={`rounded-full py-3 items-center justify-center bg-base-300 pointer-events-none`}
          >
            <Text className={`font-semibold text-lg text-secondary `}>
              {plan.title === "FREE" ? "Default" : "Upgrade Now"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
