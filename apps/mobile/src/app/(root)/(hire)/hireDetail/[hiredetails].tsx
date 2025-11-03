import HireDetailsCard from "@/components/hirePageComp/HireDetailsCard";
import { useLocalSearchParams } from "expo-router";
import React from "react";

import { View } from "react-native";

export default function HireDetailsScreen() {
  const { hiredetails } = useLocalSearchParams();
  
  return (
    <View className=" flex-1 ">
      <HireDetailsCard item={hiredetails} />
    </View>
  );
}
