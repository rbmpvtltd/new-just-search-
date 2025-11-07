import React from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  title: string | undefined;
  className?: string;
};

export default function LableText({ title, className }: Props) {
  return (
    <Text
      className={`text-lg font-medium text-secondary mb-2 ml-6 mt-4 ${className}`}
    >
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({});
