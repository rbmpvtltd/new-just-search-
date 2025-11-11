import React from "react";
import { Text, View } from "react-native";

type ErrorTextProp = {
  title?: string;
};

export default function ErrorText({ title }: ErrorTextProp) {
  return (
    <View className="w-full">
      <Text className="text-error text-sm mb-1 mx-8 ">{title}</Text>
    </View>
  );
}
