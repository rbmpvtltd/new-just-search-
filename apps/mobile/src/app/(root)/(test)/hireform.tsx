import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Text, View } from "react-native";
import AddHire from "@/features/hire/create/add-hire";
import { trpc } from "@/lib/trpc";

export default function hireform() {
  const { data, error, isLoading } = useQuery(
    trpc.hirerouter.add.queryOptions(),
  );
  if (error)
    return <Text className="text-red-500 mx-auto">{error.message}</Text>;
  if (isLoading) return <Text>Loading</Text>;
  console.log("data", data);

  return (
    <View>
      <AddHire />
    </View>
  );
}
