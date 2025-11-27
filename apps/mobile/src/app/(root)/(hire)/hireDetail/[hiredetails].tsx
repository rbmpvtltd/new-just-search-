import HireDetailsCard from "@/features/hire/show/HireDetailsCard";
import { useLocalSearchParams } from "expo-router";
import React from "react";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HireDetailsScreen() {
  const { hiredetails } = useLocalSearchParams();
  
  return (
    <SafeAreaView className="flex-1" edges={["top"]}>

    <View className=" flex-1 ">
      <HireDetailsCard item={hiredetails} />
    </View>
    </SafeAreaView>
  );
}
