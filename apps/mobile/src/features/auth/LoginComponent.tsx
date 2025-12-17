import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";
import Colors from "@/constants/Colors";
import BusinessHireLoginComponent from "./BusinessHireLoginComponent";
import VisitorLoginForm from "./VisitorLoginForm";

export default function LoginComponent() {
  const colorScheme = useColorScheme();
  const [renderForm, setRenderForm] = useState<string>("");
  return (
    <>
      {!renderForm && (
        <View className="mt-36 flex-1 justify-center items-center w-full gap-8">
          <Pressable
            onPress={() => {
              setRenderForm("business-hire");
            }}
            className="bg-primary py-4 px-8 rounded-lg w-[80%]"
          >
            <Text className="mx-auto text-[#fff] text-xl">
              Login As Business/Hire
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setRenderForm("visitor");
            }}
            className="bg-primary py-4 px-8 rounded-lg w-[80%]"
          >
            <Text className="mx-auto text-[#fff] text-xl">
              Login As A Visitor
            </Text>
          </Pressable>
        </View>
      )}
      {!!renderForm && (
        <View className="w-full">
          {renderForm === "visitor" && <VisitorLoginForm />}
          {renderForm === "business-hire" && <BusinessHireLoginComponent />}
          <Pressable onPress={() => setRenderForm("")} className="mx-auto">
            <Ionicons
              name="arrow-back-circle-outline"
              color={Colors[colorScheme ?? "light"].secondary}
              size={50}
            />
          </Pressable>
        </View>
      )}
    </>
  );
}
