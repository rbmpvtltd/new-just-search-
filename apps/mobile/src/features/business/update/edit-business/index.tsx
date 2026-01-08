import { useQuery } from "@tanstack/react-query";
import {
  ActivityIndicator,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { type OutputTrpcType, trpc } from "@/lib/trpc";
import { useBusinessFormStore } from "../../shared/store/useCreateBusinessStore";
import AddressDetail from "./forms/AddressDetail";
import BusinessDetail from "./forms/BusinessDetail";
import BusinessTiming from "./forms/BusinessTiming";
import ContactDetail from "./forms/ContactDetail";

export type UserBusinessListingType =
  | OutputTrpcType["businessrouter"]["edit"]
  | null;
export default function UpdateBusinessListing({
  data,
}: {
  data: UserBusinessListingType;
}) {
  const { page } = useBusinessFormStore();

  const steps = [
    "Business Detail",
    "Address Details",
    "Business Timing",
    "Contact Details",
  ];

  const renderForm = () => {
    switch (page) {
      case 0:
        return <BusinessDetail data={data} />;
      case 1:
        return <AddressDetail data={data} />;
      case 2:
        return <BusinessTiming data={data} />;
      case 3:
        return <ContactDetail data={data} />;
      default:
        return <BusinessDetail data={data} />;
    }
  };

  return (
    <>
      <View className="px-4 py-2">
        <View className="flex-row justify-between items-center relative">
          {steps.map((label, index) => {
            const isActive = index === page;
            const isCompleted = index < page;
            return (
              <View key={label} className="flex-1 items-center">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center border-2 
                    ${isCompleted ? "bg-primary border-primary" : isActive ? "border-primary" : "border-gray-300"}
                  `}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      isCompleted
                        ? "text-white"
                        : isActive
                          ? "text-primary"
                          : "text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </Text>
                </View>

                <Text
                  className={`mt-2 text-[11px] text-center font-medium ${
                    isActive || isCompleted ? "text-primary" : "text-gray-400"
                  }`}
                  numberOfLines={2}
                >
                  {label}
                </Text>

                {index < steps.length - 1 && (
                  <View
                    className={`absolute top-4 right-0 w-full h-[2px] -z-10 
                      ${isCompleted ? "bg-primary" : "bg-gray-200"}`}
                    style={{
                      left: "50%",
                      width: "65%",
                      transform: [{ translateX: 16 }],
                    }}
                  />
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <View
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${((page + 1) / steps.length) * 100}%` }}
        />
      </View> */}

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAwareScrollView
          enableOnAndroid
          extraScrollHeight={60}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            // paddingHorizontal: 12,
            paddingVertical: 0,
          }}
        >
          <View className="rounded-lg">{renderForm()}</View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </>
  );
}
