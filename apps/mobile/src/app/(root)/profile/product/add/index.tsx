import { View } from "react-native";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import AddProduct from "@/features/product/forms/create/AddProduct";

export default function CreateOffer() {
  return (
    <BoundaryWrapper>
      <AddProduct />
    </BoundaryWrapper>
  );
}
