import { Text, View } from "react-native";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import AddOffer from "@/features/offer/forms/create/AddOffer";

export default function CreateOffer() {
  return (
    <View>
      <BoundaryWrapper>
        <AddOffer />
      </BoundaryWrapper>
    </View>
  );
}
