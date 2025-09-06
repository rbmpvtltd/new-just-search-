import { View } from "react-native";
import RadioCard from "@/components/cards/RadioCard";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";

export const CatagoryFullList = () => {
  return (
    <View className="flex-1 items-center rounded-3xl">
      <BoundaryWrapper>
        <RadioCard />
      </BoundaryWrapper>
    </View>
  );
};
