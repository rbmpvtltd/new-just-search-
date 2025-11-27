import { Ionicons } from "@expo/vector-icons";
import { Alert, Text, useColorScheme, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import RazorpayCheckout from "react-native-razorpay";
import { queryClient } from "@/lib/trpc";
import Colors from "@/constants/Colors";
import type { PlanInterface } from "@/query/getPlans";
import { useInitiateRazorPay, useVerityRazorPay } from "@/query/razorPay";
import { Loading } from "../ui/Loading";
export default function PricingCard(item: PlanInterface) {
  const colorScheme = useColorScheme();

  const { mutate: initiatMutate, isPending: initiatPending } =
    useInitiateRazorPay();
  const { mutate: verityMutate, isPending: verityPending } =
    useVerityRazorPay();
  if (initiatPending || verityPending) {
    return <Loading position="center" />;
  }

  let availableFeatures: string[] = [];
  availableFeatures = JSON.parse(item.attribute as any);

  const freeFeatures = ["BUSINESS LISTING"];

  return (
    <View
      className={`bg-base-200 rounded-3xl shadow-lg m-4 overflow-hidden w `}
    >
      <View
        style={{ backgroundColor: item.price_color }}
        className="py-5 rounded-t-3xl items-center relative"
      >
        <Text className={`text-2xl font-bold text-secondary`}>
          {item.title}
        </Text>
        {item.active && (
          <View className="absolute top-2 right-4 bg-accent rounded-full px-3 py-1">
            <Text className="text-xs font-bold text-secondary">ACTIVE</Text>
          </View>
        )}
      </View>

      <View className="py-5 items-center border-b border-base-300">
        <Text className="text-3xl font-bold text-secondary">
          ₹{item.price} + GST / year
        </Text>
      </View>

      <View className="p-5 gap-4">
        {availableFeatures.map((feature, index) => {
          const isAvailable =
            item.title === "Free" ? freeFeatures.includes(feature) : true;

          return (
            <View className="flex-row items-start gap-3" key={index.toString()}>
              <Ionicons
                name={isAvailable ? "checkmark-circle" : "close-circle"}
                size={22}
                color={isAvailable ? "#10B981" : "#EF4444"}
                className="mt-0.5"
              />
              <Text className="text-secondary flex-1">{feature}</Text>
            </View>
          );
        })}
      </View>

      <View className="px-5 pb-5">
        <Pressable
          style={{
            backgroundColor: item.active
              ? Colors[colorScheme ?? "light"]["base-100"]
              : item.price_color,
            borderRadius: 100,
            paddingVertical: 12,
            alignItems: "center",
            justifyContent: "center",
          }}
          className={`rounded-full py-3 items-center justify-center bg-base-300`}
          disabled={item.active}
          onPress={() => {
            initiatMutate(
              {
                plan_id: item.id,
              },
              {
                onSuccess: async (res) => {
                  const options = {
                    description: res.description,
                    currency: res.currency,
                    key: res.key,
                    amount: res.amount,
                    name: res.title,
                    order_id: res.order_id, //Replace this with an order_id created using Orders API.
                  };
                  if (!res.success) {
                    if (res.status === 401) {
                      Alert.alert(
                        "something went wrong",
                        "you are Unauthorized",
                      );
                    }

                    Alert.alert("something went wrong");
                    return;
                  }
                  const razorpay = await RazorpayCheckout.open(options);
                  if (!razorpay) {
                    Alert.alert("Payment Canceled");
                  }

                  verityMutate(
                    {
                      razorpay_order_id: razorpay.razorpay_order_id,
                      razorpay_payment_id: razorpay.razorpay_payment_id,
                      razorpay_signature: razorpay.razorpay_signature,
                      currency_id: 9,
                      days: 30,
                      method: "Razorpay",
                      plan_id: item.id,
                      order_number: res.order_number,
                    },
                    {
                      onSuccess: (res) => {
                        if (res.success) {
                          queryClient.invalidateQueries({
                            queryKey: ["plans"],
                          });
                          Alert.alert("payment verify successfully ");
                        } else {
                          Alert.alert(
                            "payment completed but verification failed",
                            "please raise help token to get money back",
                          );
                        }
                      },
                      onError: () => {
                        Alert.alert(
                          "payment completed but verification failed",
                          "please raise help token to get money back",
                        );
                      },
                    },
                  );

                  // router.push({
                  //   pathname: "/chat/[chat]",
                  //   params: { chat: res?.chat_session_id.toString() },
                  // });
                },
                onError: (err) => {
                  console.error("Failed to InitiatieRazorpay:");
                },
              },
            );
          }}
        >
          <Text className={`font-semibold text-lg text-secondary `}>
            {item.active ? "Current Plan" : `Get ${item.title}`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
