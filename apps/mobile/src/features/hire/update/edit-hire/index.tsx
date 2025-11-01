import { useQuery } from "@tanstack/react-query";
import {
  ActivityIndicator,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { type OutputTrpcType, trpc } from "@/lib/trpc";
import { useHireFormStore } from "../../shared/store/useCreateHireStore";
import DocumentsForm from "./forms/DocumentsForm";
import EducationForm from "./forms/EducationForm";
import PersonalDetailsForm from "./forms/PersonalDetailsForm";
import PreferredPositionForm from "./forms/PreferredPositionForm";

export type UserHireListingType = OutputTrpcType["hirerouter"]["show"] | null;
export type FormReferenceDataType = OutputTrpcType["hirerouter"]["add"] | null;
export default function UpdateHireListing() {
  const { page } = useHireFormStore();
  const {
    data: formReferenceData,
    error: addError,
    isLoading: addLoading,
    isError: addIsError,
  } = useQuery(trpc.hirerouter.add.queryOptions());

  const {
    data: hireListing,
    isLoading: hireLoading,
    isError: hireIsError,
    error: hireError,
  } = useQuery(trpc.hirerouter.show.queryOptions());

  if (addLoading || hireLoading) {
    return (
      <View className="flex-1 items-center justify-center py-10">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-600 mt-3">Loading your data...</Text>
      </View>
    );
  }

  if (addIsError || hireIsError) {
    const message =
      addError?.message ||
      hireError?.message ||
      "Unable to fetch data. Please try again later.";

    return (
      <View className="flex-1 items-center justify-center py-10 px-6">
        <Text className="text-red-600 text-center font-semibold mb-2">
          Something went wrong
        </Text>
        <Text className="text-gray-500 text-sm text-center">{message}</Text>
      </View>
    );
  }

  if (!formReferenceData) {
    return (
      <View className="flex-1 items-center justify-center py-10">
        <Text className="text-gray-600 text-center">
          Couldn't load the hire form. Please refresh and try again.
        </Text>
      </View>
    );
  }

  if (!hireListing) {
    return (
      <View className="flex-1 items-center justify-center py-10">
        <Text className="text-gray-600 text-center">
          No hire listing found. You can create a new one below.
        </Text>
      </View>
    );
  }

  const steps = [
    "Personal Details",
    "Education",
    "Preferred Role",
    "Documents",
  ];

  const renderForm = () => {
    switch (page) {
      case 0:
        return (
          <PersonalDetailsForm
            hireListing={hireListing}
            formReferenceData={formReferenceData}
          />
        );
      case 1:
        return <EducationForm hireListing={hireListing} />;
      case 2:
        return <PreferredPositionForm hireListing={hireListing} />;
      case 3:
        return <DocumentsForm hireListing={hireListing} />;
      default:
        return (
          <PersonalDetailsForm
            hireListing={hireListing}
            formReferenceData={formReferenceData}
          />
        );
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#fff" }} edges={["bottom"]}>
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
            paddingHorizontal: 12,
            paddingVertical: 0,
          }}
        >
          <View className="rounded-lg">{renderForm()}</View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
