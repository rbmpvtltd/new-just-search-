import React from "react";
import { Text } from "react-native";

type ErrorTextProp = {
  title?: string;
};

export default function ErrorText({ title }: ErrorTextProp) {
  return <Text className="text-error text-sm mb-1 mx-8 ">{title}</Text>;
}
